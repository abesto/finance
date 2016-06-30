var myStepDefinitionsWrapper = function () {
    var self = this;

    this.Then(/^a link that matches "(.*)" is visible \(save the element as "(.*)"\)$/, function (regexString, memo) {
        const regex = new RegExp(regexString);
        browser.waitUntil(function () {
            const elementsResult = browser.elements('<a>').value;
            for (var i = 0; i < elementsResult.length; i++) {
                const element = elementsResult[i].ELEMENT;
                if (browser.elementIdAttribute(element, 'href').value.match(regex)) {
                    self[memo] = element;
                    return true;
                }
            }
            return false;
        });
    });

    this.When(/^I click the element saved as "([^"]*)"$/, function (memo) {
        browser.elementIdClick(self[memo]);
    });
};

module.exports = myStepDefinitionsWrapper;
