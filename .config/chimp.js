const reportsDir = process.env.CIRCLE_TEST_REPORTS;

module.exports = {
    webdriverio: {
        waitforTimeout: 30000,
        baseUrl: 'http://localhost:3000',
        screenshotPath: reportsDir
    },
    // Meteor
    ddp: 'http://localhost:3000',
    // Cucumber
    chai: true,
    screenshotsPath: reportsDir ? reportsDir + '/screenshots' : reportsDir,
    jsonOutput: reportsDir ? reportsDir + '/cucumber/report.cucumber' : reportsDir
};