import Express from 'express'
import session from 'express-session'
import _ from 'lodash'
import passport from 'passport'
import routes from './controllers'
import cookieParser from 'cookie-parser'
import errorHandler from 'errorhandler'
import * as path from 'path'
import { ensureLoggedIn } from 'connect-ensure-login'
import { prisma } from '../context'

module.exports = function (app: Express.Application) {
  app.set('view engine', 'ejs')
  app.set('views', path.join(__dirname, './views'))
  app.use(Express.json())
  app.use(
    Express.urlencoded({
      extended: true,
    }),
  )
  app.use(errorHandler())
  app.use(cookieParser())
  app.use(
    session({
      secret: 'Super Secret Sesion Key',
      saveUninitialized: true,
      resave: true,
    }),
  )
  // Use the passport package in our application
  app.use(passport.initialize())
  app.use(passport.session())

  // Passport configuration
  require('./auth')

  const checkUserPoolExists = async (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction,
  ) => {
    const userPool = await prisma.userPool.findOne({
      where: {
        identifier: req.params.userPoolIdentifier,
      },
    })
    if (!userPool) {
      res.send('UserPool not found!')
    }
    next()
  }

  const router = Express.Router()
  // site

  router.get('/', [ensureLoggedIn(), routes.site.index])
  router.route('/login').get(routes.site.loginForm).post(routes.site.login)
  router.get('/logout', routes.site.logout)
  router.get('/account', routes.site.account)

  // Create endpoint handlers for oauth2 authorize
  router
    .route('/oauth2/authorize')
    .get(routes.oauth2.authorization)
    .post(routes.oauth2.decision)
  // Create endpoint handlers for oauth2 token
  router.route('/oauth2/token').post(routes.oauth2.token)
  app.use('/:userPoolIdentifier', checkUserPoolExists, router)
}
