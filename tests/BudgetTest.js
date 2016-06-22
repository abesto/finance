/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

// These are Chimp globals
/* globals browser assert server */

const util = require('./util');
it = require('./util').it;

describe('Budget page', function () {
    function createCategoryGroup(name) {
        browser.click(page.createSuperCategoryGroupButton);
        util.submitTextInputDialog(page.createSuperCategoryDialog, name);
    }

    function createCategory(superCategoryName, name) {
        // Click the button in the row where category name is superCategoryName
        browser.click("//tr[@class='super-category-row' and td[@class='super-category-name' and .//text()='"+ superCategoryName + "']]//*[@class='create-category-button']");
        util.submitTextInputDialog(page.createCategoryDialog, name);
    }

    function nth(selector, n) {
        return selector + ':nth-child(' + n + ')';
    }

    const page = {
        sidebar: {
            budget: '#nav-budget'
        },

        createSuperCategoryGroupButton: '.create-category-group-button',
        createSuperCategoryDialog: '.create-category-group-dialog',

        createCategoryButton: '.create-category-button',
        createCategoryDialog: '.create-category-dialog',

        categoryTable: '.budget',
        superCategoryRow: '.super-category-row',
        superCategoryName: '.super-category-name',
        editableSuperCategoryName: '.editable-super-category-name',
        categoryRow: '.category-row',
        editableCategoryName: '.editable-category-name',

        categoryName: '.category-name'
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

    describe('provides category editing where', function () {
        it('category groups and categories can be created', function () {
            createCategoryGroup('category-group-1');
            createCategoryGroup('category-group-2');
            createCategory('category-group-1', 'cat-1-1');
            createCategory('category-group-1', 'cat-1-2');
            createCategory('category-group-2', 'cat-2-1');
            createCategory('category-group-2', 'cat-2-2');
            createCategory('category-group-2', 'cat-2-3');
            assert.deepEqual(
                browser.getText("//*[@class='super-category-name' or @class='category-name']"),
                [
                    'category-group-1', 'cat-1-1', 'cat-1-2',
                    'category-group-2', 'cat-2-1', 'cat-2-2', 'cat-2-3'
                ]
            );
        });

        // Can't test DnD because currently HTML5 DnD is not well supported by Selenium
        //   - 2016-06-22

        it('category groups can be renamed', function () {
            // Create two category groups
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
        });

        it('categories can be renamed', function () {
            // Create two categories
            createCategoryGroup('category-group-1');
            createCategory('category-group-1', 'cat-1-1');
            createCategory('category-group-1', 'cat-1-2');

            // Rename the second one
            const subject = "//*[@class='editable-category-name' and text()='cat-1-2']";
            const newName = 'changed-category ' + Math.random().toString();
            browser.click(subject);
            browser.keys(newName + '\n');

            // Assert that they have the right names, in the right order
            assert.deepEqual(
                browser.getText(page.editableCategoryName),
                ['cat-1-1', newName]
            );
        })
    });
});

