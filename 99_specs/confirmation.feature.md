@smoke @regression @confirmation
Feature: Transfer confirmation screen

  Background:
    Given the App_Bank backend is seeded with demo data
    And I am authenticated as the seeded demo user
    And I started a valid transfer with:
      | Recipient Name | Sarah Lopez             |
      | Account Number | ES911234567890123456    |
      | Amount         | 250.00                  |
    And I am on the confirmation screen

  Scenario: Confirmation screen shows the transfer summary
    Then the available balance should remain visible at the top center
    And the language buttons should remain visible
    And the sidebar should not be visible
    And the confirmation title should be visible
    And the transfer summary should display:
      | Recipient Name | Sarah Lopez             |
      | Account Number | ES911234567890123456    |
      | Amount         | €250.00                 |

  Scenario: Confirmation control is visible
    Then the slide-to-confirm control should be visible
    And the transfer should not be completed yet

  Scenario: Transfer is not completed before the user confirms
    Then the success message should not be visible
    And no new transaction should be added

  Scenario: Confirmation labels are translated when language changes
    When I click the "ESP" language button
    Then the confirmation labels should be displayed in Spanish
    And the transfer summary values should remain unchanged

  Scenario: Confirmation screen preserves entered data
    Then the transfer summary should exactly match the form data previously entered
