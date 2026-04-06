@smoke @regression @validation
Feature: Transfer form validation

  Background:
    Given the App_Bank backend is seeded with demo data
    And I am authenticated as the seeded demo user
    And I am on the transfer form
    And the available balance is "€12,450.75"

  Scenario Outline: Required fields are mandatory
    When I fill the transfer form with:
      | Recipient Name | <name>     |
      | Account Number | <account>  |
      | Amount         | <amount>   |
    And I click the "Continue" button
    Then a validation error should be displayed for "<field>"
    And I should remain on the transfer form

    Examples:
      | name         | account                 | amount | field          |
      |              | ES911234567890123456    | 250.00 | Recipient Name |
      | Sarah Lopez  |                         | 250.00 | Account Number |
      | Sarah Lopez  | ES911234567890123456    |        | Amount         |

  Scenario: Recipient name rejects numeric-only input
    When I fill the transfer form with:
      | Recipient Name | 123456                  |
      | Account Number | ES911234567890123456    |
      | Amount         | 250.00                  |
    And I click the "Continue" button
    Then a validation error should be displayed for "Recipient Name"
    And I should remain on the transfer form

  Scenario Outline: Amount must be a positive decimal number
    When I fill the transfer form with:
      | Recipient Name | Sarah Lopez             |
      | Account Number | ES911234567890123456    |
      | Amount         | <amount>                |
    And I click the "Continue" button
    Then a validation error should be displayed for "Amount"
    And I should remain on the transfer form

    Examples:
      | amount |
      | 0      |
      | -1     |
      | abc    |

  Scenario: Amount cannot exceed available balance
    When I fill the transfer form with:
      | Recipient Name | Sarah Lopez             |
      | Account Number | ES911234567890123456    |
      | Amount         | 13000.00                |
    And I click the "Continue" button
    Then a validation error should be displayed for "Amount"
    And I should remain on the transfer form

  Scenario: Valid form data allows the user to continue
    When I fill the transfer form with:
      | Recipient Name | Sarah Lopez             |
      | Account Number | ES911234567890123456    |
      | Amount         | 250.00                  |
    And I click the "Continue" button
    Then the confirmation screen should be visible
