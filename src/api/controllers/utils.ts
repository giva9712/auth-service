import { Role, Scope } from '@prisma/client'
import fs from 'fs'
import _ from 'lodash'
import moment from 'moment'
import { Moment } from 'moment-timezone'
import { JWK, JWS } from 'node-jose'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '../../context'

const signToken = async (payload: object, expiresIn: number) => {
  const ks = fs.readFileSync(`${__dirname}/../../keys/jwks.json`)
  const keyStore = await JWK.asKeyStore(ks.toString())
  const jwks = keyStore.all({ use: 'sig' })
  const rawKey = _.sample(jwks)

  if (rawKey !== undefined) {
    const key = await JWK.asKey(rawKey)
    const opt = { compact: true, jwk: key, fields: { typ: 'jwt' } }
    const token = await JWS.createSign(opt, key)
      .update(JSON.stringify(payload))
      .final()
    return token
  }
  throw new Error('RawKey is undefined!')
}

const mapScopes = (scopes: Array<string>) => {
  return scopes.map((scope) => ({
    name: scope,
  }))
}

export const getClient = (clientId: string) => {
  return prisma.application.findOne({
    where: {
      id: clientId,
    },
    include: {
      EnabledScopes: true,
    },
  })
}

export const getUserById = (userId: string) => {
  return prisma.user.findOne({
    where: {
      id: userId,
    },
    include: {
      Groups: {
        include: {
          Roles: true,
        },
      },
      Registrations: {
        include: {
          Roles: true,
        },
      },
      Profile: true,
    },
  })
}

export const generateAuthCode = (
  clientId: string,
  userId: string,
  redirectUri: string,
  scopes: Array<string>,
) => {
  return prisma.authorizationCode.create({
    data: {
      Application: {
        connect: {
          id: clientId,
        },
      },
      expirationDate: moment()
        .add({
          minute: 1,
        })
        .toISOString(),
      redirectURI: redirectUri,
      User: {
        connect: {
          id: userId,
        },
      },
      Scopes: {
        connect: mapScopes(scopes),
      },
    },
  })
}

export const getAuthCode = (code: string) => {
  return prisma.authorizationCode.findOne({
    where: {
      code: code,
    },
    include: {
      Scopes: true,
    },
  })
}

export const issueAccessToken = async (
  clientId: string,
  userId: string | null,
  scopes: Array<string>,
  accessTokenLifetime: number,
) => {
  const expirationDate = calculateExpirationDate(accessTokenLifetime)
  const jti = uuidv4()
  if (userId) {
    const user = await getUserById(userId)
    if (user) {
      const token = await signToken(
        {
          iss: 'https://tomujin.org',
          sub: userId,
          aud: clientId,
          groups: user.Groups.map((group) => group.name),
          scopes: getRolesFromUser(user),
          // exp: expirationDate.valueOf(),
          token_use: 'jwt',
          // nbf: NaN,
          iat: moment().valueOf() / 1000,
          jti: jti,
          // claims
          username: user.username,
          email: user.email,
          displayName: user.Profile?.displayName,
        },
        accessTokenLifetime,
      )
      await prisma.accessToken.create({
        data: {
          jti: jti,
          Application: {
            connect: {
              id: clientId,
            },
          },
          User: {
            connect: {
              id: userId,
            },
          },
          Scopes: {
            connect: mapScopes(scopes),
          },
          expirationDate: expirationDate.toISOString(),
        },
      })
      return token
    }
  } else {
    const token = await signToken(
      {
        iss: '',
        sub: clientId,
        aud: clientId,
        token_use: 'jwt',
        nbf: null,
        iat: moment().valueOf(),
        jti: jti,
      },
      accessTokenLifetime * 60,
    )
    await prisma.accessToken.create({
      data: {
        jti: jti,
        Application: {
          connect: {
            id: clientId,
          },
        },
        Scopes: {
          connect: mapScopes(scopes),
        },
        expirationDate: expirationDate.toISOString(),
      },
    })
    return token
  }

  throw Error('User not found!')
}

export const issueRefreshToken = (
  clientId: string,
  userId: string,
  scopes: Array<string>,
  refreshTokenLifetime: number,
) => {
  return prisma.refreshToken.create({
    data: {
      Application: {
        connect: {
          id: clientId,
        },
      },
      User: {
        connect: {
          id: userId,
        },
      },
      Scopes: {
        connect: mapScopes(scopes),
      },
      expirationDate: moment()
        .add({
          minute: refreshTokenLifetime,
        })
        .toISOString(),
    },
  })
}

export const calculateExpiresInAsSecond = (
  expirationDate: string | Moment | Date,
) => {
  return moment.parseZone(expirationDate).diff(moment(), 'seconds')
}

export const calculateExpirationDate = (accessTokenLifetime: number) => {
  return moment().add({
    minute: accessTokenLifetime,
  })
}

export const isExpired = (expirationDate: string | Date): boolean => {
  return moment().isAfter(moment(expirationDate))
}

export const getClientById = (clientId: string) => {
  return prisma.application.findOne({
    where: {
      id: clientId,
    },
    include: {
      EnabledScopes: true,
      RedirectUris: true,
    },
  })
}

export const getAccessToken = (jti: string) => {
  return prisma.accessToken.findOne({
    where: {
      jti,
    },
    include: {
      Application: true,
      Scopes: true,
    },
  })
}

export const getUserByUsernameOrEmail = (username: string) => {
  return prisma.user.findFirst({
    where: {
      OR: [
        {
          username: username,
        },
        {
          email: username,
        },
      ],
    },
    include: {
      Profile: true,
      Groups: {
        include: {
          Roles: true,
        },
      },
    },
  })
}

export const deleteAuthCode = (id: string) => {
  return prisma.authorizationCode.delete({
    where: {
      id,
    },
  })
}

export const getRolesFromUser = (user: {
  Groups: Array<{
    Roles: Array<Role>
  }>
}) => {
  return _.uniq(
    _.flatMap(user.Groups, (group) =>
      group.Roles.map((role: Role) => ({
        ...role,
        permissions: role.permissions ? JSON.parse(role.permissions) : null,
      })),
    ),
  )
}

export const getScopesFromClient = (client: {
  EnabledScopes: Array<Scope>
}) => {
  return client.EnabledScopes.map((scope: Scope) => scope.name)
}

export const getRefreshToken = (refreshToken: string) => {
  return prisma.refreshToken.findOne({
    where: {
      refreshToken,
    },
    include: {
      Scopes: true,
    },
  })
}
