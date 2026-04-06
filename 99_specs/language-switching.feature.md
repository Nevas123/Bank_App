@smoke @regression @i18n
Feature: Language switching across the authenticated application

  Background:
    Given the App_Bank backend is seeded with demo data
    And I am authenticated as the seeded demo user
    And I am on the dashboard
    And the default language is English

  Scenario Outline: User switches language on the dashboard
    When I click the "<language_button>" language button
    Then the page labels should be displayed in "<language>"
    And the sidebar main option should display "<main_menu_label>"
    And the exit button should display "<exit_label>"
    And the transactions title should display "<transactions_label>"
    And the send money button should display "<send_money_label>"

    Examples:
      | language_button | language | main_menu_label | exit_label | transactions_label   | send_money_label |
      | ESP             | Spanish  | Menú principal  | Salir      | Últimos movimientos  | Enviar dinero    |
      | ENG             | English  | Main Menu       | Exit       | Latest Transactions  | Send Money       |

  Scenario: Active language button is highlighted
    When I click the "ESP" language button
    Then the "ESP" language button should appear selected
    And the "ENG" language button should appear unselected

  Scenario: Language selection persists when entering the transfer form
    Given I click the "ESP" language button
    When I click the "Enviar dinero" button
    Then the transfer form should be visible
    And the form labels should be displayed in Spanish
    And the language selection should remain "ESP"

  Scenario: Language selection persists on the confirmation screen
    Given I click the "ESP" language button
    And I start a valid transfer with:
      | Recipient Name | Sarah Lopez             |
      | Account Number | ES911234567890123456    |
      | Amount         | 250.00                  |
    When I continue to the confirmation screen
    Then the confirmation screen should be visible
    And the confirmation labels should be displayed in Spanish
    And the language selection should remain "ESP"

  Scenario: Switching language does not erase entered form values
    Given I am on the transfer form
    And I fill the transfer form with:
      | Recipient Name | Sarah Lopez             |
      | Account Number | ES911234567890123456    |
      | Amount         | 250.00                  |
    When I click the "ESP" language button
    Then the form values should remain:
      | Recipient Name | Sarah Lopez             |
      | Account Number | ES911234567890123456    |
      | Amount         | 250.00                  |
