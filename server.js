var express = require('express');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var passport = require('passport');
var session = require('express-session');
var models = require('./models');
var fileUpload = require('express-fileupload');
var path = require('path');

var app = express();
var PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.text());
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
}));

app.use(session({
    secret: 'roomie',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public'));

app.use(fileUpload());

app.set('views', './views');

app.engine('hbs', exphbs(
    {
        defaultLayout: "main",
        extname: '.hbs',
        partialsDir: 'views/partials'
    }
));

app.set('view engine', '.hbs');

require('./config/passport/passport.js')(passport, models.Users);
require('./routes/auth.js')(app, passport);
require('./routes/api-routes.js')(app, fileUpload);
require('./routes/roommate-api.js')(app, fileUpload);
require('./routes/html-routes.js')(app);
require('./routes/friendship-api.js')(app);
require('./routes/posts-api.js')(app);
require('./routes/profile-routes.js')(app);


models.sequelize.sync({
    force: false
}).then(() => {
    app.listen(PORT, () => {
        console.log('App listening on PORT ' + PORT);
    });
});
