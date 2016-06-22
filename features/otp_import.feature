Feature: Import from OTP

  Background:
    Given an empty database
    Given I have visited the "OTP Import" page

  @ignore
  Scenario: Clicking the start upload button opens the file upload dialog
    # No idea how to test this, native windows are hard to get

  Scenario: Can import and expand / collapse OTP CSV transaction logs
    Given I upload the OTP exported CSV "features/data/otp-test-input.csv" 2 times

    When I wait until the import log has 2 items
    Then the header of import log 1 should contain
    """
    2016-03-18 to 2016-03-21
    2 entries imported at
    """
    And the header of import log 2 should contain
    """
    2016-03-18 to 2016-03-21
    2 entries imported at
    """

    When I click the header of import log 1
    Then the entries table of import log 1 is visible
    And the entries table of import log 2 is not visible
    And the entries table of import log 1 contains exactly the lines
    """
    424242 2016-03-18 2016-03-18 Income 1,405 HUF FunCo 4,550EUR 0, 2016.03.16 INCOME MEMO
    424242 2016-03-21 2016-03-21 Expense 1,000 HUF FunCo 2016.03.18 EXPENSE MEMO
    """

    When I click the header of import log 1
    Then the entries table of import log 1 is not visible
    And the entries table of import log 2 is not visible

  Scenario: Uploaded OTP imports remain between reloads
    Given I upload the OTP exported CSV "features/data/otp-test-input.csv" 3 times
    And I wait until the import log has 3 items

    When I visit the "OTP Import" page
    Then the import log should have 3 items
