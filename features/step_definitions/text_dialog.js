function submitTextDialog(className, text) {
    function c(component) {
        return className + '-open ' + className + component;
    }
    browser.waitForVisible(c('-body'));
    browser.click(c('-input [type=text]'));
    browser.clearElement(c('-input [type=text]'));
    browser.keys(text + '\n');
    browser.waitForVisible(className + '-overlay', null, false);
    waitUntilDialogOverlayIsGone(className + '-overlay');
}

function waitUntilDialogOverlayIsGone(selector) {
    // Material-UI dialog overlays are deactivated by moving them off the screen to the left
    return browser.waitUntil(function () {
        const expectedValue = '-' + browser.getViewportSize('width') + 'px';
        var overlayLeftResponse = browser.getCssProperty(selector, 'left');
        if (!Array.isArray(overlayLeftResponse)) {
            overlayLeftResponse = [overlayLeftResponse];
        }
        return overlayLeftResponse
            .map(function(resp) { return resp.value == expectedValue; })
            .reduce(function (a, b) { return a && b; });
    });
}

module.exports = function () {
    this.When(/^I wait for the text input dialog "([^"]*)" to go away$/, function (className) {
        // Material-UI dialog overlays are deactivated by moving them off the screen to the left
        return browser.waitUntil(function () {
            const expectedValue = '-' + browser.getViewportSize('width') + 'px';
            var overlayLeftResponse = browser.getCssProperty(className + '-overlay', 'left');
            if (!Array.isArray(overlayLeftResponse)) {
                overlayLeftResponse = [overlayLeftResponse];
            }
            return overlayLeftResponse
                .map(function(resp) { return resp.value == expectedValue; })
                .reduce(function (a, b) { return a && b; });
        });
    });

    this.When(/^I submit the text input dialog "([^"]*)" with the text "([^"]*)"$/, submitTextDialog);
};

module.exports.submitTextDialog = submitTextDialog;
