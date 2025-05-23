describe("Opus Flow Tests", () => {
  beforeEach(() => {
    cy.loginWithCredentials();
    cy.visit("/");
  });

  it("should allow a new user to initalise profile", () => {
    cy.wait(1000); // Wait for modals to load

    // First login info
    cy.get("#firstLoginModal").should("exist");
    //cy.wait(100) // Breifly show info modal
    cy.get(".index-module__ifV0vq__closeModalButton").click();

    // Test input validation
    cy.get("button[type=submit]").should("have.attr", "disabled");

    cy.get("#newDisplayName").type("cypress");

    cy.get(".index-module__ifV0vq__themeOption").each(($el) => {
      cy.wrap($el).click();
      cy.wrap($el).should("exist");
      cy.wait(10);
    });

    cy.get("#newInterestIcon").type("l");

    cy.get(".index-module__ifV0vq__errorTooltip").contains(
      "The Icon must be one emoji"
    );

    cy.get("#newInterestIcon").type("🚀🚀");

    cy.get(".index-module__ifV0vq__errorTooltip").contains(
      "The Icon must be one emoji"
    );

    cy.get("#newInterestName").type("SomethingLongerThan20Characters");

    cy.get(".index-module__ifV0vq__errorTooltip").contains(
      "Interest name must be less than 20 characters"
    );

    cy.get("#newInterestName").clear().type("QA Testing");

    cy.get(".index-module__ifV0vq__selectInterestModalInterestButton").click();

    // Select interests
    cy.get(".index-module__ifV0vq__choiceButton").each(($el, index) => {
      if (index != 1 && index < 3) {
        cy.wrap($el).click();
      }
      if (index > 3) return;
    });

    cy.get("button[type=submit]").click();

    cy.get(".index-module__ifV0vq__cookieBanner").should("exist");
  });
});
