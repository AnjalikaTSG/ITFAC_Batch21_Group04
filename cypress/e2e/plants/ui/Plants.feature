Feature: Plant Management - UI

  Scenario: Successfully add a plant with valid data
    Given I am logged in as admin
    When I add a new plant with valid data
    Then the new plant should appear in the list

Scenario: Add plant with quantity below 5 and verify Low badge
  Given I am logged in as admin
  When I add a new plant with quantity below 5
  Then the new plant should display a Low badge

Scenario: Verify validation error for negative Price input
  Given I am logged in as admin
  When I try to add a plant with negative price
  Then a price validation error should be shown

Scenario: Verify validation for Plant Name min length size
  Given I am logged in as admin
  When I try to add a plant with a short name
  Then a name length validation error should be shown

Scenario: Verify deletion of an existing plant
  Given I am logged in as admin
  And a plant named "DeleteMe" exists in the list
  When I delete the plant named "DeleteMe"
  Then the plant "DeleteMe" should not be visible in the list

Scenario: User can view the Plant List with read-only access
  Given I am logged in as a test user
  When I navigate to the Plant List page
  Then the paginated list of plants should be visible
  And no Add, Edit, or Delete controls should be present

Scenario: User can search for a plant by name
  Given I am logged in as a test user
  And a plant named "Basil" exists in the list
  When I search for the plant "Basil"
  Then only the plant "Basil" should be visible in the list

Scenario: User can sort the plant list by Price
  Given I am logged in as a test user
  And multiple plants with different prices exist
  When I sort the plant list by Price
  Then the plants should be ordered by Price

Scenario: Add Plant button is hidden for Users
  Given I am logged in as a test user
  When I navigate to the Plant List page
  Then the Add Plant button should not be visible

Scenario: Access Denied when forcing URL for Edit Plant
  Given I am logged in as a test user
  And a plant with ID 1 exists
  When I manually visit the Edit Plant page for ID 1
  Then I should see an Access Denied page

Scenario: Verify that an Admin cannot delete a plant that has sales records
    Given User is logged as "admin" Role
    And a plant named "test1" exists in the list
    And a sales record exists for the plant "test1"
    When User clicks on "Plants" in the sidebar
    And User locates the Delete button for the plant "test1"
    And User clicks the Delete button for "test1"
    Then the application should display an error instead of deleting the plant
    And the system should display the updated plant list
    And the plant "test1" should still be visible in the list