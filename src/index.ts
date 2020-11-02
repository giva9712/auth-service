import { config } from 'dotenv-flow'
config()
import { ApolloServer } from 'apollo-server-express'
import { applyMiddleware } from 'graphql-middleware'
import { createContext } from './context'
import { permissions } from './permissions'
import { schema } from './schema'
import express from 'express'
import * as HTTP from 'http'

const graphqlServer = new ApolloServer({
  schema: applyMiddleware(schema, permissions),
  context: createContext,
})
const app = express()
const http = HTTP.createServer(app)

require('./api/')(app)

graphqlServer.applyMiddleware({ app })
graphqlServer.installSubscriptionHandlers(http)

http.listen(process.env.PORT, () => {
  console.log(
    `🚀 GraphQL service ready at http://localhost:${process.env.PORT}/graphql`,
  )
})
