import Express from 'express'
import expressSession from 'express-session'
import _ from 'lodash'
import passport from 'passport'
import routes from './controllers'
import cookieParser from 'cookie-parser'
import errorHandler from 'errorhandler'
import path from 'path'
import { prisma } from '../context'
import redis from 'redis'
import connectRedis from 'connect-redis'
import vhost from 'vhost'
import { ensureLoggedIn } from 'connect-ensure-login'
const RedisStore = connectRedis(expressSession)

const redisClient = redis.createClient(
  Number(process.env.REDIS_PORT),
  process.env.REDIS_HOST,
  {
    no_ready_check: true,
  },
)

module.exports = function (app: Express.Application) {
  app.set('view engine', 'ejs')
  app.set('views', path.join(__dirname, './views'))
  app.use(Express.json())
  app.use(
    Express.urlencoded({
      extended: false,
    }),
  )
  app.use(errorHandler())
  app.use(cookieParser())
  app.use(
    expressSession({
      name: 'AUTHORIZATION_SERVER',
      saveUninitialized: true,
      resave: true,
      secret: process.env.SESSION_SECRET as string,
      store: new RedisStore({ client: redisClient }),
      // key: 'authorization.sid',
      cookie: {
        sameSite: true,
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: Number(process.env.SESSION_MAX_AGE),
      },
    }),
  )
  // Use the passport package in our application
  app.use(passport.initialize())
  app.use(passport.session())
  app.use((req, res, next) => {
    if (req.originalUrl.includes('favicon.ico')) {
      return res.status(204).end()
    }
    next()
  })

  app.use(Express.static(path.join(__dirname, './public')))

  app.use((req, res, next) => {
    console.log('# Request recieved on: ', req.url)
    next()
  })

  // Passport configuration
  require('./auth')

  const checkUserPoolExists = async (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction,
  ) => {
    const userPool = await prisma.userPool.findOne({
      where: {
        identifier: req.vhost[0],
      },
    })
    if (!userPool) {
      return res.send('UserPool not found!')
    }
    return next()
  }

  const router = Express.Router()
  // site
  router.use(checkUserPoolExists)

  router.get('/', [ensureLoggedIn(), routes.site.index])
  // static resources for stylesheets, images, javascript files
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
  router.get('/api/profile', routes.user.info)
  router.get('/api/clientinfo', routes.client.info)

  router.get('/api/revoke', routes.token.revoke)
  router.get('/api/tokeninfo/:access_token', routes.token.info)
  // app.use('/:userPoolIdentifier', checkUserPoolExists, router)
  app.use(vhost('*.auth.test', router))
}
