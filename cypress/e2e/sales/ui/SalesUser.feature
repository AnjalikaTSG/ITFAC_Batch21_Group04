Feature: Sales Management (Standard User)

  Background:
    # Precondition: Login as a Standard User
    Given I am logged in as a Standard User

  Scenario: Verify Sales List View - Read Only (UI_Us_01_214025B)
    When I navigate to the Sales page
    Then the "Sell Plant" button should NOT be visible
    And the "Actions" column should NOT be visible

  Scenario: Verify Hidden Delete Actions (UI_Us_02_214025B)
    When I navigate to the Sales page
    Then the "Delete" button should NOT be visible in the table

  Scenario: Security: Direct URL Access - New Sale (UI_Us_03_214025B)
    When I manually navigate to "/ui/sales/new"
    Then I should be redirected to the "Login" page or see a "403" error

  Scenario: Verify Sorting Functionality (User) (UI_Us_04_214025B)
    When I navigate to the Sales page
    When I click on the "Quantity" column header
    Then the records should be sorted by "Quantity" in ascending order