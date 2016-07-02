const submitTextDialog = require('./dialogs').submitTextDialog;

var myStepDefinitionsWrapper = function () {
    this.When(/^I create the account "(.*)"$/, function (name) {
        browser.click('.create-account-button');
        submitTextDialog('.create-account-dialog', name);
    });

    this.Then(/^the accounts list should have exactly the text/, function (text) {
        expect(browser.getText('.accounts-list')).to.equal(text);
    });

    this.When(/^I click the edit account button for "([^"]*)"$/, function (name) {
        const item = "//*[@class='accounts-list-item' and .//text()='" + name + "']";
        const settingsButton = item + "//*[@class='accounts-list-edit-button']";
        browser.moveToObject(item);
        browser.waitForVisible(settingsButton);
        browser.click(settingsButton);
    });

    this.When(/^click the delete account button$/, function () {
        browser.click('.delete-account-button');
    });

    this.When(/^I rename the account to "([^"]*)"$/, function (newName) {
        browser.click('.editable-account-name');
        browser.keys(newName + '\n');
    });
};
module.exports = myStepDefinitionsWrapper;