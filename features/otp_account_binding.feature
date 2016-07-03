Feature: OTP account binding

  The right OTP-imported transactions automatically show up in WNAB accounts with the OTP account number set.

  Scenario: Set account number first, then import
    Given an empty database
    And I create the account "Account A"
    And I create the account "Account B"

    When I click the edit account button for "Account A"
    And set the OTP account number to "424242"
    And I visit the "OTP Import" page
    And I upload the OTP exported CSV "features/data/otp-test-input.csv" 2 times

    #Then the account "Account A" has exactly the transactions "foo bar"
    #And the account "Account B" has no transactions
