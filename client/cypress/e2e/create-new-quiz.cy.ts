describe('create new quiz', () => {
  it('passes', () => {
    cy.visit('/');
    cy.contains('a', 'create')
      .click();
    cy.contains('create new quiz')
      .click();

    cy.contains('Edit Quiz');
    cy.contains('save')
      .should('be.disabled');
    cy.contains('Name')
      .click()
      .type('E2E Create Test Quiz');
    cy.contains('add round')
      .click();
    cy.contains('Round')
      .click()
      .type('First Round');
    cy.contains('Q1')
      .click()
      .type('Which question is this?');
    cy.contains('add question')
      .click();
    cy.contains('Q2')
      .click()
      .type('How many questions does this round have?')

    cy.contains('save')
      .should('be.enabled');
  });
});
