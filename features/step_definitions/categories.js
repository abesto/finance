const submitTextDialog = require('./dialogs').submitTextDialog;

const XPaths = {
    categoryGroupWithName: function (categoryGroupName) {
        return "//tr[@class='super-category-row' and td[@class='super-category-name' and .//text()='"+ categoryGroupName + "']]";
    }
};

module.exports = function () {
    this.When(/^I create the category groups? (.*)$/, function (categoryGroupNamesArg) {
        categoryGroupNamesArg.split(/ +/).forEach(function (categoryGroupName) {
            browser.click('.create-category-group-button');
            submitTextDialog('.create-category-group-dialog', categoryGroupName);
        });
    });

    this.When(/^I create the categories (.*) under category group (.*)$/, function (categoryNamesArg, categoryGroupName) {
        categoryNamesArg.split(/ +/).forEach(function (categoryName) {
            const row = XPaths.categoryGroupWithName(categoryGroupName);
            const button = row + "//*[@class='create-category-button']";
            // Hover the row where category name is superCategoryName to get the "add" button to show...
            browser.moveToObject(row);
            browser.waitForVisible(button);
            // and then click it
            browser.click(button);
            // finally use the dialog that opens to create the category
            submitTextDialog('.create-category-dialog', categoryName);
        });
    });

    this.Then(/I should see the category names (.*)/, function (categoryNamesArg) {
        expect(
            browser.getText("//*[@class='super-category-name' or @class='category-name']")
        ).to.deep.equal(categoryNamesArg.split(/ +/));
    });

    this.When(/^I rename the category group "([^"]*)" to "([^"]*)"$/, function (from, to) {
        const row = XPaths.categoryGroupWithName(from);
        const editable = row + "//*[@class='editable-super-category-name']";
        browser.click(editable);
        browser.keys(to + '\n');
    });

    this.When(/^I rename the category "([^"]*)" to "([^"]*)"$/, function (from, to) {
        const subject = "//*[@class='editable-category-name' and text()='" + from + "']";
        browser.click(subject);
        browser.keys(to + '\n');
    });
};
