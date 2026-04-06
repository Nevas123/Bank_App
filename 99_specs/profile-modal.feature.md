@regression @profile
Feature: Profile modal from the sidebar bubble

  Background:
    Given the App_Bank backend is seeded with demo data
    And I am authenticated as the seeded demo user
    And I am on the dashboard
    And the current user is "Alex Morgan"

  Scenario: User opens the profile modal
    When I click the profile bubble
    Then the profile modal should be visible
    And the modal should contain a circular avatar
    And the modal should display the full name "Alex Morgan"
    And the modal should display the email "alex.morgan@appbank.demo"
    And the modal should display the phone number "+34 600 123 456"

  Scenario: User closes the profile modal with the close control
    Given the profile modal is open
    When I close the profile modal
    Then the profile modal should not be visible
    And the dashboard should remain visible

  Scenario: Opening the profile modal does not navigate away
    When I click the profile bubble
    Then the dashboard should still be visible behind the modal
    And the transactions table should still be present behind the modal

  Scenario: Profile modal is translated after language change
    Given I click the "ESP" language button
    When I click the profile bubble
    Then the profile modal labels should be displayed in Spanish
