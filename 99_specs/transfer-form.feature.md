@smoke @regression @transfer-form
Feature: Transfer form screen

  Background:
    Given the App_Bank backend is seeded with demo data
    And I am authenticated as the seeded demo user
    And I am on the dashboard
    And the default language is English

  Scenario: User enters the transfer form from the dashboard
    When I click the "Send Money" button
    Then the transfer form should be visible
    And the available balance should remain visible at the top center
    And the language buttons should remain visible
    And the sidebar should not be visible
    And the form should contain the fields:
      | Recipient Name |
      | Account Number |
      | Amount         |
    And the "Cancel" button should be visible
    And the "Continue" button should be visible

  Scenario: Cancel returns the user to the dashboard without changes
    Given I am on the transfer form
    And I fill the transfer form with:
      | Recipient Name | Sarah Lopez             |
      | Account Number | ES911234567890123456    |
      | Amount         | 250.00                  |
    When I click the "Cancel" button
    Then the dashboard should be visible
    And the transactions table should be visible
    And the available balance should still be "€12,450.75"

  Scenario: Balance area keeps the same position when opening the form
    Given I am on the dashboard
    When I click the "Send Money" button
    Then the balance block should remain in the same top-center area

  Scenario: Form buttons are translated after language switch
    Given I am on the transfer form
    When I click the "ESP" language button
    Then the cancel button should display "Cancelar"
    And the continue button should display "Continuar"
