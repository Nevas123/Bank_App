@regression @workflow
Feature: Cross-flow regression coverage

  Background:
    Given the App_Bank backend is seeded with demo data
    And I am authenticated as the seeded demo user
    And I am on the dashboard

  Scenario: Dashboard to form to confirmation to success to dashboard happy path
    When I click the "Send Money" button
    And I fill the transfer form with:
      | Recipient Name | Sarah Lopez             |
      | Account Number | ES911234567890123456    |
      | Amount         | 250.00                  |
    And I click the "Continue" button
    And I activate the slide-to-confirm control
    And I click the "Back to Main Menu" button
    Then the dashboard should be visible

  Scenario: Sidebar is visible only on the dashboard
    Then the sidebar should be visible
    When I click the "Send Money" button
    Then the sidebar should not be visible
    When I complete the transfer and return to the dashboard
    Then the sidebar should be visible again

  Scenario: Language selection survives the full transfer flow
    Given I click the "ESP" language button
    When I click the "Enviar dinero" button
    And I fill the transfer form with:
      | Recipient Name | Sarah Lopez             |
      | Account Number | ES911234567890123456    |
      | Amount         | 250.00                  |
    And I click the "Continuar" button
    And I activate the confirmation control
    And I click the "Volver al menú principal" button
    Then the dashboard should still be displayed in Spanish

  Scenario: Cancel flow does not create a transfer
    When I click the "Send Money" button
    And I fill the transfer form with:
      | Recipient Name | Sarah Lopez             |
      | Account Number | ES911234567890123456    |
      | Amount         | 250.00                  |
    And I click the "Cancel" button
    Then the dashboard should be visible
    And no new transaction should be added

  Scenario: Opening profile and exit dialogs does not break the main flow
    When I click the profile bubble
    And I close the profile modal
    And I click the "Exit" button
    And I close the exit dialog
    Then the dashboard should still be fully usable
    When I click the "Send Money" button
    Then the transfer form should open normally
