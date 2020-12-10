import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'
import { AccountStatusType, Application, User } from '@prisma/client'
import passport from 'passport'
import { BasicStrategy } from 'passport-http'
import { Strategy as ClientPasswordStrategy } from 'passport-oauth2-client-password'

import {
  consumeRememberMeToken,
  getClientById,
  getUserById,
  getUserByUsernameOrEmail,
  getUserRegistration,
  saveRememberMeToken,
} from './../controllers/utils'
import { Strategy as LocalStrategy } from 'passport-local'
import { compare } from 'bcryptjs'
import { Strategy as CustomStrategy } from 'passport-custom'
import { Strategy as RememberMeStrategy } from 'passport-remember-me-extended'
import { AppUser } from '../client/user'
import { getKIDfromAccessToken } from '../client'
import cryptoRandomString from 'crypto-random-string'
import moment from 'moment'

export class JWTScopeStrategy extends CustomStrategy {
  authenticate(req: any, options: any) {
    req.scope = options.scope
    return super.authenticate(req, options)
  }
}

const ISSUER = process.env.ISSUER

passport.use(
  new LocalStrategy(
    { usernameField: 'username', passReqToCallback: true },
    async (req, username, password, done) => {
      const clientId = req.body.client_id
      getUserByUsernameOrEmail(username)
        .then(async (user) => {
          if (
            !user ||
            (user && user.accountStatusType === AccountStatusType.DISABLED)
          ) {
            return done(null, false)
          }
          const registration = await getUserRegistration(user.id, clientId)
          if (!registration) return done(null, false)
          const passwordValid = await compare(password, user.password)
          if (!passwordValid) {
            return done(null, false)
          }
          return done(null, user)
        })
        .catch((error) => done(error))
    },
  ),
)

passport.use(
  new RememberMeStrategy(
    async (token, done) => {
      try {
        const user = await consumeRememberMeToken(token)
        if (!user) return done(null, false)
        return done(null, user)
      } catch (err) {
        return done(err)
      }
    },
    async (user, done) => {
      const token = cryptoRandomString({ length: 64, type: 'url-safe' })
      try {
        const savedToken = await saveRememberMeToken(token, user.id)
        if (savedToken) return done(null, token)
      } catch (err) {
        return done(err)
      }
    },
  ),
)

passport.use(
  'jwt',
  new JWTScopeStrategy(async (req: any, done) => {
    const defaultApp: Application = req.session.defaultApp
    const host = req.protocol + '://' + req.get('host')
    const client = jwksClient({
      cache: true,
      rateLimit: true,
      cacheMaxEntries: 5,
      cacheMaxAge: 10000,
      jwksUri: `${host}/.well-known/jwks.json`,
    })
    const accessToken = req.cookies['access_token']

    if (!accessToken) return done(null, false)
    try {
      const kid = getKIDfromAccessToken(accessToken)
      const key = await client.getSigningKeyAsync(kid)
      const payload: any = jwt.verify(accessToken, key.getPublicKey(), {
        algorithms: ['RS256'],
        audience: defaultApp.id,
        issuer: ISSUER,
      })
      console.log(moment.unix(payload.exp));
      
      const appUser = new AppUser(payload)
      if (appUser.canScope(req.scope))
        return done(new Error(`Not allowed scope`))
      const user = await getUserById(String(appUser.sub))
      if (!user) return done(new Error('User not found!'))
      return done(null, user)
    } catch (err) {
      console.log(err);
      
      if (err) done(null, false)
    }
  }),
)

passport.serializeUser((user: User, done) => {
  return done(null, user.id)
})

passport.deserializeUser((id: string, done) => {
  getUserById(id)
    .then((user) => {
      if (
        !user ||
        (user && user.accountStatusType === AccountStatusType.DISABLED)
      ) {
        return done(null, false)
      }
      return done(null, user)
    })
    .catch((error) => done(error))
})

function verifyClient(clientId: string, clientSecret: string, done: any) {
  getClientById(clientId)
    .then((client) => {
      if (!client)
        return done(null, false, {
          error: {
            status: 403,
            message: 'Unauthorized Client!',
          },
        })
      if (client.secret === clientSecret) return done(null, client)
      return done(null, client)
    })
    .catch((error) => done(error))
}

passport.use(new BasicStrategy(verifyClient))

passport.use('clientPassword', new ClientPasswordStrategy(verifyClient))