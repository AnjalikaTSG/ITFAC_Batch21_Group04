Feature: Sales Management UI

  Background:
    # Precondition: User must be logged in as Admin
    Given I am logged in as an Admin

  Scenario: Verify Sales List Page Loading (UI_Ad_01_214025B)
    When I navigate to the Sales page
    Then the "Sales" page header should be visible
    And the data table should display the following columns:
      | Plant       |
      | Quantity    |
      | Total Price |
      | Sold At     |
      | Actions     |

  Scenario: Verify 'Sell Plant' Button Availability (UI_Ad_02_214025B)
    When I navigate to the Sales page
    Then the "Sell Plant" button should be visible
    When I click the "Sell Plant" button
    Then I should be redirected to the "New Sale" page

  Scenario: Verify Default Sorting by Sold Date (UI_Ad_03_214025B)
    # Precondition: Ensure there are at least 2 records to verify sorting
    When I navigate to the Sales page
    Then the records should be sorted by "Sold At" in descending order