module.exports = function(app) {
    app.use('/', require('./../routes/index'));
    //app.use('/login', require('./../routes/login'));
}