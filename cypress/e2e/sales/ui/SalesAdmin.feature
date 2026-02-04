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

  