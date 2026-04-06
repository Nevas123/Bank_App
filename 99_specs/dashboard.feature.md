@smoke @regression @dashboard
Feature: Dashboard landing page

  Background:
    Given the App_Bank backend is seeded with demo data
    And I am authenticated as the seeded demo user
    And I am on the dashboard
    And the default language is English
    And the current user is "Alex Morgan"
    And the available balance is "€12,450.75"

  Scenario: Authenticated user lands on the dashboard successfully
    Then the sidebar should be visible
    And the profile bubble should be visible at the top of the sidebar
    And the "Main Menu" option should be visible in the sidebar
    And the "Exit" button should be visible at the bottom of the sidebar
    And the available balance should be visible at the top center
    And the "ENG" and "ESP" language buttons should be visible at the top right
    And the "Latest Transactions" table should be visible
    And the "Send Money" button should be visible

  Scenario: Transactions table displays the expected structure
    Then the transactions table should contain the columns:
      | Date      |
      | Recipient |
      | Amount    |
      | Status    |

  Scenario: Transactions table displays seeded rows
    Then the transactions table should contain at least 1 row

  Scenario: Main menu option keeps the user on the dashboard
    When I click the "Main Menu" option
    Then the dashboard should remain visible
    And the "Latest Transactions" table should remain visible

  Scenario: Send Money call to action is enabled
    Then the "Send Money" button should be enabled
