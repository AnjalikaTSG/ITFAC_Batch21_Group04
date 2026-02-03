Feature: User Login

  Scenario: Success Login to the Application
    Given I open the application login page
    When I enter valid username "admin" and password "admin123"
    And I click the login button
    Then I should see the dashboard page