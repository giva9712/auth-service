import { objectType } from '@nexus/schema'

export const Role = objectType({
  name: 'Role',
  definition(t) {
    t.model.name()
    t.model.Users()
    t.model.Scopes()
    t.model.Groups()
    t.model.createdAt()
    t.model.updatedAt()
  },
})
