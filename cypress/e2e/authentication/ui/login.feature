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

Feature: Plant Management

  @UI_Ad_04_214064R
  Scenario: Verify Cancel button functionality on Edit Page
    Given I perform login as "admin"
    And a plant named "Rose" exists
    And I navigate to the Plant List page
    When I click the Edit button for plant "Rose"
    And I change the plant name to "Tulip"
    And I click the Cancel button
    Then I should be redirected to the Plant List page
    And the plant name should remain "Rose"

  @UI_Ad_05_214064R
  Scenario: Verify validation for Zero Price
    Given I perform login as "admin"
    And a valid category exists
    And I navigate to the Add Plant page
    When I enter "ZeroPricePlant" in the Name field
    And I select the first category
    And I enter "0.00" in the Price field
    And I enter "10" in the Quantity field
    And I click the Save button
    Then I expect an error message "Price must be greater than 0"


Feature: Category Management

  @UI_Us_05_214064R
  Scenario: No Add Button for User
    Given I perform login as "user"
    And I navigate to the Category List page
    Then I should not see the "Add Category" button
