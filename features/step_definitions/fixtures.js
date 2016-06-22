module.exports = function () {
    this.Given(/^an empty database$/, function () {
        server.call('fixtures.reset-database');
    });
};