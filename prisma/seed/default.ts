import { GrantType, PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { defaultRoles } from './roles'

export const seedDefaultTenantWithAdmin = (prisma: PrismaClient) => {
  const adminEmail = String(process.env.ADMIN_EMAIL)
  const adminPassword = String(process.env.ADMIN_PASSWORD)
  var salt = bcrypt.genSaltSync(10)
  var hash = bcrypt.hashSync(adminPassword, salt)
  const defaultSettings = prisma.tenant.create({
    data: {
      domainName: '*',
      Users: {
        create: {
          email: adminEmail,
          password: hash,
          salt: salt,
          username: 'admin',
          Profile: {
            create: {
              firstName: 'Admin',
              lastName: 'Super',
              displayName: 'Super Admin',
            },
          },
        },
      },
      Applications: {
        create: {
          // id: "581af555-a990-4a4b-912d-e3cb9b880f55",
          // secret: "ckid0nyml0000mndy9ulx7c7k",
          name: 'Default',
          RedirectUris: {
            create: {
              url: '/login',
            },
          },
          EnabledScopes: {
            connect: [
              { name: 'openid' },
              { name: 'email' },
              { name: 'profile' },
              { name: 'avig.auth.user.admin' },
            ],
          },
          Grants: {
            connect: [
              {
                grantType: GrantType.AUTHORIZATION_CODE,
              },
              {
                grantType: GrantType.REFRESH_TOKEN,
              },
              {
                grantType: GrantType.CLIENT_CREDENTIALS,
              },
            ],
          },
          Roles: {
            create: defaultRoles,
          },
          Registrations: {
            create: {
              User: {
                connect: {
                  email: adminEmail,
                },
              },
              Roles: {
                connect: {
                  name: 'admin',
                },
              },
              username: 'admin',
            },
          },
        },
      },
    },
  })
  return [defaultSettings]
}