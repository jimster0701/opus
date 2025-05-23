// cypress/support/commands.ts

declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>;
      quickSetup(): Chainable<void>;
      loginWithCredentials(): Chainable<void>;
    }
  }
}

// Command to login with test credentials
Cypress.Commands.add("loginWithCredentials", () => {
  cy.visit("/api/auth/signin");
  cy.contains("Test Account").click();

  cy.get('input[name="username"]').type("admin");
  cy.get('input[name="password"]').type("admin");
  cy.contains('button[type="submit"]', "Sign in with Test Account").click();
  cy.login();
});

Cypress.Commands.add("login", () => {
  cy.session("test-user", () => {
    cy.request("/api/auth/csrf").then((resp) => {
      const csrfToken = resp.body.csrfToken;

      cy.request({
        method: "POST",
        url: "/api/auth/callback/cypress-credentials",
        form: true,
        body: {
          csrfToken,
          username: "admin",
          password: "admin",
        },
      });
    });
  });
});

Cypress.Commands.add("quickSetup", () => {
  cy.get(".index-module__ifV0vq__closeModalButton").click();
  cy.get("#newDisplayName").type("cypress");
  cy.get(".index-module__ifV0vq__choiceButton").each(($el, index) => {
    if (index < 3) cy.wrap($el).click();
  });
  cy.get("button[type=submit]").click();

  cy.get(".index-module__ifV0vq__cookieConsentButton")
    .contains("Accept")
    .click();
});

export {};
