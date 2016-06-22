Feature: Manage Categories

  Background:
    Given an empty database
    Given I have visited the "Budget" page

  Scenario: Category groups and categories can be created
    When I create the category groups category-group-1 category-group-2
      And I create the categories cat-1-1 cat-1-2 cat-1-3 under category group category-group-1
      And I create the categories cat-2-1 cat-2-2 under category group category-group-2
    Then I should see the category names category-group-1 cat-1-1 cat-1-2 cat-1-3 category-group-2 cat-2-1 cat-2-2

  @ignore
  Scenario: Category groups and categories can be reordered with drag-and-drop
    # Can't test DnD because currently HTML5 DnD is not well supported by Selenium
    #   - 2016-06-22

  Scenario: Category groups can be renamed
    Given I create the category groups group-1 group-2
    When I rename the category group "group-1" to "totally-new-name"
    Then I should see the category names totally-new-name group-2
    When I rename the category group "group-2" to "another-new-name"
    Then I should see the category names totally-new-name another-new-name

  Scenario: Categories can be renamed
    Given I create the category group group-1
      And I create the categories cat-1 cat-2 cat-3 under category group group-1
    When I rename the category "cat-1" to "new-name"
      And I rename the category "cat-3" to "another-new-name"
    Then I should see the category names group-1 new-name cat-2 another-new-name
