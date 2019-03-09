const express = require('express');
const mongoose = require('mongoose');

const routes = require('./routes');
const {mongoURI} = require('./config/keys.js');

const app = express();

// DB Config
mongoose
    .connect(mongoURI, {useNewUrlParser: true})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

routes(app);

app.get('/', (req, res) => res.send('Hello World!'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port ${port}`));