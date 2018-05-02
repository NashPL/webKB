module.exports = function(app) {
    app.use('/', require('./../routes/index'));

    //LOGIN MODULE:
    app.use('/login', require('./../routes/LOGIN/login'));
    app.use('/signin', require('./../routes/LOGIN/signin'));
}