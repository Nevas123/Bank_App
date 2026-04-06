@regression @exit
Feature: Exit dialog and logout flow

  Background:
    Given the App_Bank backend is seeded with demo data
    And I am authenticated as the seeded demo user
    And I am on the dashboard

  Scenario: User opens the exit dialog
    When I click the "Exit" button
    Then the exit dialog should be visible
    And the dialog should display the message "Hasta la vista!"

  Scenario: User closes the exit dialog and stays on the dashboard
    Given the exit dialog is open
    When I close the exit dialog
    Then the exit dialog should not be visible
    And the dashboard should remain visible

  Scenario: User confirms exit and returns to the login page
    Given the exit dialog is open
    When I confirm the exit action
    Then the login page should be visible
    And I should be logged out

  Scenario: Exit dialog is translated together with the UI language
    Given I click the "ESP" language button
    When I click the "Salir" button
    Then the exit dialog should be visible
    And the dialog controls should be displayed in Spanish

  Scenario: Closing the exit dialog does not remove dashboard state
    Given the transactions table is visible
    When I click the "Exit" button
    And I close the exit dialog
    Then the transactions table should still be visible
    And the available balance should still be visible
