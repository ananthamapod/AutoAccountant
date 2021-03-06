const envvar = require('envvar')
const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
// HTTP server logger with great customizability
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
// Sets HTTP request headers for increased security
const helmet = require('helmet')
const minifyHTML = require('express-minify-html')
const debug = require('debug')('autoaccountant:server')
const webpackAssets = require('express-webpack-assets')

/*** ROUTES IMPORTS ***/
const index = require('./routes/index')
const users = require('./routes/users')
const api = require('./routes/api')

/*** AUTHENTICATION HANDLER ***/
const jwt = require('jsonwebtoken')
const passport = require("passport")
const passportJWT = require("passport-jwt")
const User = require('./models/User')

const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromHeader('Authorization')
jwtOptions.secretOrKey = envvar.string('APPLICATION_SECRET')

const strategy = new JwtStrategy(jwtOptions, function(jwtData, next) {
  debug('payload received', jwtData)
  var user = User.find({_id: jwtData.id})
  if (user) {
    next(null, user)
  } else {
    next(null, false)
  }
})

passport.use(strategy)

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
// means more processing server side, but less network
app.use(minifyHTML({
  override:      false,
  exception_url: false,
  htmlMinifier: {
    removeComments:            true,
    collapseWhitespace:        true,
    collapseBooleanAttributes: true,
    removeAttributeQuotes:     true,
    removeEmptyAttributes:     true,
    minifyJS:                  true
  }
}))
app.use(webpackAssets('./config/webpack-assets.json', {
    devMode: true
}))

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
/**
 * displays http logs in a dev shorthand format:
 * :method :url :status :response-time ms - :res[content-length]
 * See https://github.com/expressjs/morgan
 **/
app.use(logger('dev'))
/**
 * Adds security HTTP headers, see https://helmetjs.github.io/docs/
 */
app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(passport.initialize())

app.use('/users', users)
app.use('/api', api)
// NOTE: MAIN ROUTE LINKED IN LAST BECAUSE IT'S A FALLTHROUGH, DO NOT MOVE UP
app.use('/', index)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function(err, req, res) {
  // set locals, only provide error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
