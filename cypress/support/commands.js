Cypress.Commands.add('fillMandatoryFieldsAndSubmit', () => {
  cy.get('#firstName').type('John');
  cy.get('#lastName').type('Doe');
  cy.get('#email').type('john.doe@mail.com');
  cy.get('#open-text-area').type('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean at porttitor tellus.');
  cy.get('button[type="submit"').click();
});

Cypress.Commands.add('fillMandatoryFieldsMinusTextArea', () => {
  cy.get('#firstName').type('John');
  cy.get('#lastName').type('Doe');
  cy.get('#email').type('john.doe@mail.com');
})