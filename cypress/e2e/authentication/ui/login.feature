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
    When I enter username "admin" and incorrect password "wrongpass" 3 times consecutively
    And On the 4th attempt I enter username "admin" and password "admin123"
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

  @UI_Us_01_214064R
  Scenario: User Login - Valid Credentials
    Given I am on the login page
    When I enter username "testuser" and password "test123"
    And I click the login button
    Then I should be redirected to the user dashboard

  @UI_Us_02_214064R
  Scenario: User Login - Password Complexity
    Given I am on the login page
    When I initiate the Forgot Password workflow
    And I try to set a weak password "weak"
    Then I should see a password complexity error message

  @UI_Us_03_214064R
  Scenario: User Logout
    Given I am logged in as "user"
    When I click the logout button
    Then I should see the login page

  @UI_Us_04_214064R
  Scenario: User - Access Admin Endpoint
    Given I am logged in as "user"
    When I attempt to navigate to an admin-only URL "/ui/categories/add"
    Then I should be redirected to a non-admin page or see an Access Denied error
