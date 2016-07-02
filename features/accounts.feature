Feature: Manage Accounts

  Background:
    Given I have visited the "Budget" page
    Given an empty database

  Scenario: Create an account
    Given an empty database
    When I create the account "Account A"
    And I create the account "Account B"
    Then the accounts list should have exactly the text
    """
    Account A
    0 Ft
    Account B
    0 Ft
    """

  Scenario: Delete an account
    Given I create the account "Account A"
    And I create the account "Account B"

    When I click the edit account button for "Account A"
    And click the delete account button
    And confirm

    Then the accounts list should have exactly the text
    """
    Account B
    0 Ft
    """

  Scenario: Rename an account
    Given I create the account "Account A"

    When I click the edit account button for "Account A"
    And I rename the account to "Totally New Name"

    Then the accounts list should have exactly the text
    """
    Totally New Name
    0 Ft
    """

#  Scenario: Accounts can be reordered via drag-and-drop
#
#  Scenario: Change OTP Account number to from empty to an existing account number
#    Then transactions are automatically created from all existing OTP imports
#
#  Scenario: Clear previously set, existing OTP Account number
#    Then transactions are deleted
#    Then OTP imported entries have a red warning sign saying "not assigned to WNAB account"

