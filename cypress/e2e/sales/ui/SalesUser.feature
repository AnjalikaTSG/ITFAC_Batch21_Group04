Feature: Sales Management (Standard User)

  Background:
    # Precondition: Login as a Standard User
    Given I am logged in as a Standard User

  Scenario: Verify Sales List View - Read Only (UI_Us_01_214025B)
    When I navigate to the Sales page
    Then the "Sell Plant" button should NOT be visible
    And the "Actions" column should NOT be visible