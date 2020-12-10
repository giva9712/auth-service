import { objectType } from '@nexus/schema'

export const ExternalIdentifier = objectType({
  name: 'ExternalIdentifier',
  definition(t) {
    t.model.Tenant()
    t.model.Application()
    t.model.IdentityProvider()
    t.model.status()
    t.model.data()
    t.model.providerType()
    t.model.isUserCreatedBefore()
    t.model.User()
    t.model.createdAt()
    t.model.updatedAt()
  },
})