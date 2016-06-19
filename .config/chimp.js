module.exports = {
    webdriverio: {
        waitforTimeout: 30000,
        baseUrl: 'http://localhost:3000',
        screenshotPath: process.env.CIRCLE_TEST_REPORTS
    },
    mocha: true,
    path: 'tests',
    ddp: 'http://localhost:3000'
};