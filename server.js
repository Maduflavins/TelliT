const express =     require('express'),
morgan        =     require('morgan'),
bodyParser    =     require('body-parser'),
mongoose      =     require('mongoose'),
hbs           =     require('hbs'),
expressHbs    =     require('express-handlebars'),
session       =     require('express-session'),
MongoStore    =     require('connect-mongo')(session),
flash         =     require('express-flash'),
config        =     require('./config/secret');

const app = express();

mongoose.Promise = global.Promise;
var promise = mongoose.connect(config.database,{useMongoClient: true}, (err) =>{
    if(err){
      console.log(err)
    }else{
      console.log('connected to new database');
    }
  })


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
    store: new MongoStore({ url: config.database, autoReconnect: true})
}));

app.use(flash());


const mainRoutes = require('./routes/main');
const userRoutes = require('./routes/user');

app.use(mainRoutes);
app.use(userRoutes);


app.listen(3000, (err) =>{
    if(err) console.log(err);
    console.log('Running on port ${3000}')
});

