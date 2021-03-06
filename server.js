const express =     require('express'),
morgan        =     require('morgan'),
bodyParser    =     require('body-parser'),
mongoose      =     require('mongoose'),
hbs           =     require('hbs'),
expressHbs    =     require('express-handlebars'),
session       =     require('express-session'),
MongoStore    =     require('connect-mongo')(session),
flash         =     require('express-flash'),
passport      =     require('passport'),
passportSocketIo =  require('passport.socketio'),
cookieParser  =     require('cookie-parser'),
config        =     require('./config/secret'),
app           =     express(),
http          =     require('http').Server(app),
io            =     require('socket.io')(http);

mongoose.Promise = global.Promise;
var promise = mongoose.connect(config.database,{useMongoClient: true}, function(err){
    if(err){
      console.log(err)
    }else{
      console.log('connected to new database');
    }
  })

const sessionStore = new MongoStore({ url: config.database, autoReconnect: true});

app.engine('.hbs', expressHbs({ defaultLayout: 'layout', extname: '.hbs' }));
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: config.secret,
    store: sessionStore
}));

app.use(flash());
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
  res.locals.user = req.user;
  next();
});

io.use(passportSocketIo.authorize({
  cookieParser: cookieParser,
  key: 'connect.sid',
  secret: config.secret,
  store: sessionStore,
  success: onAuthorizeSuccess,
  fail: onAuthorizeFail
}));

function onAuthorizeSuccess(data, accept){
  console.log('successful connection');
  accept();
}

function onAuthorizeFail(data, message, error, accept){
  console.log("failed connection");
  if(error) accept(new Error(message));
}

require('./realtime/io')(io);


const mainRoutes = require('./routes/main');
const userRoutes = require('./routes/user');

app.use(mainRoutes);
app.use(userRoutes);


http.listen(3000, (err) =>{
    if(err) console.log(err);
    console.log('Running on port ${3000}')
});

