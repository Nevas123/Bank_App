@smoke @regression @success
Feature: Successful money transfer

  Background:
    Given the App_Bank backend is seeded with demo data
    And I am authenticated as the seeded demo user
    And I started a valid transfer with:
      | Recipient Name | Sarah Lopez             |
      | Account Number | ES911234567890123456    |
      | Amount         | 250.00                  |
    And I am on the confirmation screen

  Scenario: User confirms the transfer successfully
    When I activate the slide-to-confirm control
    Then the transfer should be completed
    And a success message should be visible
    And the success message should indicate that the transfer was completed

  Scenario: User can return to the dashboard after success
    Given the transfer has been completed
    When I click the "Back to Main Menu" button
    Then the dashboard should be visible
    And the transactions table should be visible

  @stateful
  Scenario: Balance is reduced after successful transfer
    Given the initial available balance is "€12,450.75"
    When I activate the slide-to-confirm control
    Then the available balance should become "€12,200.75"

  @stateful
  Scenario: New transaction is added to the top of the table after success
    Given the transfer has been completed
    When I return to the dashboard
    Then the first row of the transactions table should display:
      | Recipient | Sarah Lopez |
      | Amount    | -€250.00    |
      | Status    | Completed   |

  Scenario: User cannot complete the same transfer twice from one confirmation view
    When I activate the slide-to-confirm control
    Then the transfer should be completed
    When I try to activate the slide-to-confirm control again
    Then no duplicate transfer should be created
