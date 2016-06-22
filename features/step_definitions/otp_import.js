module.exports = function () {
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
        expect(browser.isVisible(selectors.nthCardTableBody(count))).to.equal(typeof not == 'undefined');
    });

    this.Then(/the entries table of import log (\d+) contains exactly the lines$/, function(count, expected) {
        expect(
            browser.getText(selectors.nthCardTableBody(count))
        ).to.equal(expected);
    })
};