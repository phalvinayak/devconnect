const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');

const routes = require('./routes');
const {mongoURI} = require('./config/keys.js');

const app = express();

// Body Parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// DB Config
mongoose
    .connect(mongoURI, {useNewUrlParser: true})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.use(passport.initialize());
//Passport config
require('./config/passport')(passport);

routes(app);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port ${port}`));