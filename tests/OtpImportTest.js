/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

// These are Chimp globals
/* globals browser assert server */

describe('OTP Import', function () {
    before(function() {
        browser.url('/otp');
    });

    beforeEach(function () {
        server.call('fixtures.reset-database');
    });
    
    const page = {
        sidebar: {
            otp: '#nav-otp'
        },

        uploadButton: '#otp-import-upload-button',
        fileInput: '.otp-import-file-input',

        card: {
            container: '.otp-import-log-card',
            header: '.otp-import-log-card-header',
            table: '.otp-import-log-details-table'
        }
    };

    it('has the OTP Import sidebar item highlighted', function () {
        browser.waitForText(page.sidebar.otp);
        const bgColor = browser.getCssProperty(page.sidebar.otp, 'background-color');
        assert.equal(bgColor.parsed.hex, '#000000');
        assert.equal(bgColor.parsed.alpha, 0.2);
    });

    it('can import and expand / collapse OTP CSV transaction logs', function () {
        browser.waitForExist(page.uploadButton);

        // Don't know how to assert that this opens a file selector dialog :(
        //browser.click(uploadButtonSelector);

        // Import the file twice
        browser.chooseFile(page.fileInput, './tests/otp-test-input.csv');
        browser.chooseFile(page.fileInput, './tests/otp-test-input.csv');

        // Wait until two import log cards are created
        browser.waitForExist(page.card.container + ':nth-child(2)');

        // And assert that there are exactly two, with the expected text
        const cards = browser.elements(page.card.container);
        assert.equal(cards.value.length, 2);
        cards.value.forEach(function (el) {
            const headerText = browser.elementIdText(el.ELEMENT, page.card.header).value;
            assert.match(headerText, /^2016-03-18 to 2016-03-21\n2 entries imported at/);
        });

        // And assert that we can expand them, and they have the right contents
        browser.click(page.card.header);
        browser.waitForVisible(page.card.table);
        assert.deepEqual(
            browser.getText(page.card.table + ' tbody tr'),
            [
                '424242 2016-03-18 2016-03-18 Income 1,405 HUF FunCo 4,550EUR 0, 2016.03.16 INCOME MEMO',
                '424242 2016-03-21 2016-03-21 Expense 1,000 HUF FunCo 2016.03.18 EXPENSE MEMO'
            ]
        );

        // Finally, assert that we can collapse them
        browser.click(page.card.header);
        browser.waitForVisible(page.card.table, null, true);
    });

    it('retains items between reloads', function () {
        browser.waitForExist(page.uploadButton);

        // Upload some data
        browser.chooseFile(page.fileInput, './tests/otp-test-input.csv');
        browser.chooseFile(page.fileInput, './tests/otp-test-input.csv');
        browser.chooseFile(page.fileInput, './tests/otp-test-input.csv');

        // Wait until it appears on the UI
        browser.waitForExist(page.card.container + ':nth-child(3)');

        // Reload
        browser.url('/otp');

        // Assert that the items are still there
        browser.waitForExist(page.card.container + ':nth-child(3)');
    });
});