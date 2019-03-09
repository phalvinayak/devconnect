const users = require('./api/users');
const profile = require('./api/profile');
const posts = require('./api/posts');

const routes = app => {
    app.use('/api/users', users);
    app.use('/api/profile', profile);
    app.use('/api/posts', posts);
}

module.exports = routes;