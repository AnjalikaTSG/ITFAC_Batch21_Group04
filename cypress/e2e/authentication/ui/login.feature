Feature: Admin Authentication and Security

  @UI_Ad_01_214064R
  Scenario: Admin Login - Valid Credentials
    Given I am on the login page
    When I enter username "admin" and password "admin123"
    And I click the login button
    Then I should be redirected to the admin dashboard

  @UI_Ad_02_214064R
  Scenario: Admin Login - Account Lockout
    Given I am on the login page
    When I enter username "admin" and incorrect password "wrongpass" 3 times
    And I enter username "admin" and password "admin123"
    And I click the login button
    Then I should see an error message "Account Locked"
    And I should remain on the login page

  @UI_Ad_03_214064R
  Scenario: Admin Logout and Browser Back Security
    Given I am logged in as "admin"
    When I click the logout button
    And I click the browser back button
    Then I should see the login page
    And I should not be able to access the dashboard
