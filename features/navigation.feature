Feature: Navigation

  Scenario: Sidebar highlights the current menu item
    When I visit the "Budget" page
    Then the "Budget" sidebar item is highlighted
    But the "OTP Import" sidebar item is not highlighted

    When I visit the "OTP Import" page
    Then the "OTP Import" sidebar item is highlighted
    But the "Budget" sidebar item is not highlighted
