@smoke @regression @login
Feature: Login page and authentication flow

  Background:
    Given the App_Bank backend is seeded with demo data
    And I am logged out

  Scenario: User lands on the login page successfully
    When I open the application
    Then the login page should be visible
    And the email field should be visible
    And the password field should be visible
    And the "Sign In" button should be visible
    And the "ENG" and "ESP" language buttons should be visible

  Scenario: User logs in with the seeded demo credentials
    Given I am on the login page
    When I log in with the seeded demo credentials
    Then the dashboard should be visible
    And the available balance should be visible at the top center
    And the current user should be "Alex Morgan"

  Scenario: User cannot log in with invalid credentials
    Given I am on the login page
    When I log in with email "alex.morgan@appbank.demo" and password "WrongPass123!"
    Then a login error message should be visible
    And I should remain on the login page

  Scenario: Unauthenticated user is redirected to login when opening a protected route
    Given I am logged out
    When I navigate directly to the dashboard route
    Then the login page should be visible

  Scenario: Login page labels are translated when language changes
    Given I am on the login page
    When I click the "ESP" language button
    Then the login labels should be displayed in Spanish
    And the selected language should remain "ESP"
