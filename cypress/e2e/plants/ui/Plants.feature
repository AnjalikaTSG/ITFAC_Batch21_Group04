Feature: Plant Management - Admin

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
  Given a plant named "DeleteMe" exists in the list
  When I delete the plant named "DeleteMe"
  Then the plant "DeleteMe" should not be visible in the list

Scenario: User can view the Plant List with read-only access
  Given I am logged in as a test user
  When I navigate to the Plant List page
  Then the paginated list of plants should be visible
  And no Add, Edit, or Delete controls should be present