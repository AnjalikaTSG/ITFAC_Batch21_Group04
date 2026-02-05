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
