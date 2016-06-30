var myStepDefinitionsWrapper = function () {
    const selectors = {
        nthCard: function (n) {
            return '.otp-import-log-card:nth-child(' + n + ')'
        },
        nthCardHeader: function (n) {
            return selectors.nthCard(n) + ' .otp-import-log-card-header'
        },
        nthCardTableBody: function (n) {
            return selectors.nthCard(n) + ' .otp-import-log-details-table-body';
        }
    };

    this.Given(/^I upload the OTP exported CSV "([^"]*)" (\d+) times$/, function (filename, times) {
        for (var i = 0; i < times; i++) {
            browser.chooseFile('.otp-import-file-input', filename);
        }
    });

    this.When(/^(?:I wait until the import log has|the import log should have) (\d+) items$/, function (count) {
        browser.waitForExist('.otp-import-log-card:nth-child(' + count + ')');
    });

    this.Then(/^the header of import log (\d+) should contain$/, function (count, expected) {
        expect(
            browser.getText(selectors.nthCardHeader(count))
        ).to.have.string(expected);
    });

    this.When(/^I click the header of import log (\d+)$/, function (count) {
        browser.click(selectors.nthCardHeader(count));
    });

    this.Then(/^the entries table of import log (\d+) is( not)? visible$/, function(count, not) {
        browser.waitForVisible(selectors.nthCardTableBody(count), null, typeof not != 'undefined');
    });

    this.Then(/the entries table of import log (\d+) contains exactly the lines$/, function(count, expected) {
        expect(
            browser.getText(selectors.nthCardTableBody(count))
        ).to.equal(expected);
    });

    this.Then(/^the rows of the entries table of import log (\d+) are( not)? grayed out$/, function (count, not) {
        const actualColors = browser.getCssProperty(selectors.nthCardTableBody(count) + ' tr', 'color');
        const expected = typeof not == 'undefined' ? '#cccccc' : '#000000';
        actualColors.map(function (actual) {
            expect(actual.parsed.hex).to.equal(expected);
        });
    });

    this.When(/^I click row (\d+) of the entries table of import log (\d+)$/, function (rowCount, cardCount) {
        browser.click(selectors.nthCardTableBody(cardCount) + ' tr:nth-child(' + rowCount + ')');
    });

    this.Then(/^exactly one import details table is visible$/, function () {
        browser.waitForExist('.otp-import-log-details-table:first-child');
        expect(
            browser.isExisting('.otp-import-log-details-table:nth-child(2)')
        ).to.equal(false);
    });

    this.Then(/^there are no import details cards$/, function () {
        expect(
            browser.isExisting(selectors.nthCard(1))
        ).to.equal(false);
    });

    this.Then(/^the import details table should contain exactly the lines$/, function (text) {
        expect(
            browser.getText('.otp-import-log-details-table-body')
        ).to.equal(text);
    });
};
module.exports = myStepDefinitionsWrapper;