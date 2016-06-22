/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

// These are Chimp globals
/* globals browser assert server */

const util = require('./util');
it = require('./util').it;

describe('Budget page', function () {
    function createCategoryGroup(name) {
        browser.click(page.createSuperCategoryGroupButton);
        browser.waitForVisible(page.createSuperCategoryBody);
        browser.click(page.createSuperCategoryInput);
        browser.clearElement(page.createSuperCategoryInput);
        browser.keys(name + '\n');
        browser.waitForVisible(page.createSuperCategoryOverlay, null, true);
        util.waitUntilDialogOverlayIsGone(page.createSuperCategoryOverlay);
    }

    function nth(selector, n) {
        return selector + ':nth-child(' + n + ')';
    }

    const page = {
        sidebar: {
            budget: '#nav-budget'
        },

        createSuperCategoryGroupButton: '.create-category-group-button',
        createSuperCategoryBody: '.create-category-group-dialog-body',
        createSuperCategoryInput: '.create-category-group-dialog input',
        createSuperCategoryOverlay: '.create-category-group-dialog-overlay',

        categoryTable: '.budget',
        superCategoryRow: '.super-category-row',
        editableSuperCategoryName: '.editable-super-category-name'
    };

    before(function() {
        browser.url('/budget');
        browser.waitForExist(page.sidebar.budget, 2 * 60 * 1000);
    });

    beforeEach(function () {
        server.call('fixtures.reset-database');
    });
    
    it('has the Budget sidebar item highlighted', function () {
        util.assertSidebarItemIsHighlighted(page.sidebar.budget);
    });

    describe('category groups', function () {
        it('can be created', function () {
            createCategoryGroup('category-group-1');
            createCategoryGroup('category-group-2');
            assert.equal(
                browser.elements(page.superCategoryRow).value.length,
                2
            );
        });

        // Can't test DnD because currently HTML5 DnD is not well supported by Selenium
        //   - 2016-06-22

        it('can be renamed', function () {
            // Create two categories
            createCategoryGroup('category-group-1');
            createCategoryGroup('category-group-2');

            // Rename the second one
            const subject = nth(page.superCategoryRow, 2) + ' ' + page.editableSuperCategoryName;
            const newName = 'changed-category-group ' + Math.random().toString();
            browser.click(subject);
            browser.keys(newName + '\n');

            // Assert that it has the new name
            assert.equal(browser.getText(subject), newName);

            // Assert that the other one still has its original name
            assert.equal(
                browser.getText(nth(page.superCategoryRow, 1) + ' ' + page.editableSuperCategoryName),
                'category-group-1'
            );
        })
    });
});

