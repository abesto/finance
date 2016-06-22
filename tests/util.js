const mocha = require('mocha');
const oldIt = it;

exports.it = function it(name, fn) {
    return oldIt(name, function () {
        try {
            fn();
        } catch (e) {
            if (process.env.hasOwnProperty('CIRCLE_TEST_REPORTS')) {
                browser.saveScreenshot(process.env.CIRCLE_TEST_REPORTS + '/' + mocha.utils.slug(name) + '.png');
            }
            throw e;
        }
    });
};


exports.waitUntilDialogOverlayIsGone = function(selector) {
    // Material-UI dialog overlays are deactivated by moving them off the screen to the left
    return browser.waitUntil(function () {
        const expectedValue = '-' + browser.getViewportSize('width') + 'px';
        const overlayLeft = browser.getCssProperty(selector, 'left').value;
        return expectedValue == overlayLeft;
    });
};

exports.assertSidebarItemIsHighlighted = function(selector) {
    const bgColor = browser.getCssProperty(selector, 'background-color');
    assert.equal(bgColor.parsed.hex, '#000000');
    assert.equal(bgColor.parsed.alpha, 0.2);
};
