Feature: Category Management

  @UI_Us_05_214064R
  Scenario: No Add Button for User
    Given I perform login as "user"
    And I navigate to the Category List page
    Then I should not see the "Add Category" button
