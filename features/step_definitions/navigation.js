var myStepDefinitionsWrapper = function () {
    const pageMap = {
        Budget: '/',
        'OTP Import': '/otp'
    };

    this.Given(/^I (?:have visited|visit) the "([^"]*)" page$/, function (pageName) {
        expect(pageMap).to.include.keys(pageName);
        browser.url(pageMap[pageName]);
        browser.waitForExist('#nav-budget');
    });

    this.Then(/^the "([^"]*)" sidebar item is( not)? highlighted$/, function (sidebarItem, not) {
        const shouldBeHighlighted = (typeof not === 'undefined');
        const bgColor = browser.getCssProperty(
            "//*[@class='sidebar']//span[@type='button' and .//text()='" + sidebarItem + "']",
            'background-color');
        if (shouldBeHighlighted) {
            expect(bgColor.parsed.alpha).to.equal(0.2, 'alpha');
        } else {
            expect(bgColor.parsed.alpha).to.equal(0, 'alpha');
        }
    });
};
module.exports = myStepDefinitionsWrapper;