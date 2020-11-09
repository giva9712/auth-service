'use strict'

import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { BasicStrategy } from 'passport-http'
import { Strategy as ClientPasswordStrategy } from 'passport-oauth2-client-password'
import { Strategy as BearerStrategy } from 'passport-http-bearer'
import { prisma } from '../../context'
import { compare } from 'bcryptjs'
import { User } from '@prisma/client'
/**
 * LocalStrategy
 *
 * This strategy is used to authenticate users based on a username and password.
 * Anytime a request is made to authorize an application, we must ensure that
 * a user is logged in before asking them to approve the request.
 */
passport.use(
  new LocalStrategy(
    { usernameField: 'username', passReqToCallback: true },
    async (req, username, password, done) => {
      const userPool = await prisma.userPool.findOne({
        where: {
          identifier: req.params.userPoolIdentifier,
        },
      })
      if (!userPool) return done(null, false)
      prisma.user
        .findOne({
          where: {
            username_userPoolId: {
              username,
              userPoolId: userPool.id,
            },
          },
          include: {
            Roles: {
              include: {
                Scopes: true,
                CustomScopes: {
                  include: {
                    ResourceServer: true,
                  },
                },
              },
            },
            Groups: {
              include: {
                Roles: {
                  include: {
                    Scopes: true,
                    CustomScopes: {
                      include: {
                        ResourceServer: true,
                      },
                    },
                  },
                },
              },
            },
          },
        })
        .then(async (user) => {
          if (!user || (user && user.isDisabled)) return done(null, false)
          const passwordValid = await compare(password, user.password)
          if (!passwordValid) return done(null, false)
          return done(null, user)
        })
        .catch((error) => done(error))
    },
  ),
)

passport.serializeUser((user: User, done) => {
  return done(null, user.id)
})

passport.deserializeUser((id: string, done) => {
  prisma.user
    .findOne({
      where: {
        id,
      },
      include: {
        Roles: {
          include: {
            Scopes: true,
            CustomScopes: {
              include: {
                ResourceServer: true,
              },
            },
          },
        },
        Groups: {
          include: {
            Roles: {
              include: {
                Scopes: true,
                CustomScopes: {
                  include: {
                    ResourceServer: true,
                  },
                },
              },
            },
          },
        },
      },
    })
    .then((user) => {
      if (!user || (user && user.isDisabled)) return done(null, false)
      return done(null, user)
    })
    .catch((error) => done(error))
})

/**
 * BasicStrategy & ClientPasswordStrategy
 *
 * These strategies are used to authenticate registered OAuth clients. They are
 * employed to protect the `token` endpoint, which consumers use to obtain
 * access tokens. The OAuth 2.0 specification suggests that clients use the
 * HTTP Basic scheme to authenticate. Use of the client password strategy
 * allows clients to send the same credentials in the request body (as opposed
 * to the `Authorization` header). While this approach is not recommended by
 * the specification, in practice it is quite common.
 */
function verifyClient(clientId: string, clientSecret: string, done: any) {
  prisma.oAuthClient
    .findOne({
      where: {
        id: clientId,
      },
    })
    .then((client) => {
      if (!client) return done(null, false)
      if (client.secret === clientSecret) return done(null, client)
      return done(null, client)
    })
    .catch((error) => done(error))
}

passport.use(new BasicStrategy(verifyClient))

passport.use(new ClientPasswordStrategy(verifyClient))

/**
 * BearerStrategy
 *
 * This strategy is used to authenticate either users or clients based on an access token
 * (aka a bearer token). If a user, they must have previously authorized a client
 * application, which is issued an access token to make requests on behalf of
 * the authorizing user.
 */
passport.use(
  new BearerStrategy((accessToken, done) => {
    prisma.oAuthAccessToken
      .findFirst({
        where: {
          accessToken,
        },
        include: {
          User: true,
          Client: true,
          Scopes: true,
        },
      })
      .then((localAccessToken) => {
        if (!localAccessToken) return done(null, false)
        if (localAccessToken.User) {
          done(null, localAccessToken.User, {
            scope: localAccessToken.Scopes.map((scope) => scope.name).join(' '),
          })
        } else {
          prisma.oAuthClient
            .findOne({
              where: {
                id: localAccessToken.Client.id,
              },
            })
            .then((client) => {
              if (!client) return done(null, false)
            })
        }
      })
      .catch((error) => done(error))
  }),
)
