describe('Home test', () => {
  it('Visit pages and check add new button', () => {
    cy.visit('http://localhost:3000', {
      auth: {
        username: 'admin',
        password: 'teste',
      },
    });
    cy.get('#addButton').click();

    cy.url().should('include', '/new-accounting-entry');

    cy.get('button').contains('Back').click({ force: true });

    cy.url().should('not.include', '/new-accounting-entry');
  });

  it('Visit installments and check add new button', () => {
    cy.get('a').contains('Installments').click({ force: true });
    cy.url().should('include', '/installments');
    cy.get('#addButton').click();
    cy.url().should('include', '/new-installment');
    cy.get('button').contains('Back').click({ force: true });
    cy.url()
      .should('not.include', '/new-installments')
      .should('include', '/installments');
  });

  it('Visit accounts and check add new button', () => {
    cy.get('a').contains('Accounts').click({ force: true });
    cy.url().should('include', '/accounts');
    cy.get('#addButton').click();
    cy.url().should('include', '/new-account');
    cy.get('button').contains('Back').click({ force: true });
    cy.url()
      .should('not.include', '/new-account')
      .should('include', '/accounts');
  });

  it('Visit categories and check add new button', () => {
    cy.get('a').contains('Categories').click({ force: true });
    cy.url().should('include', '/categories');
    cy.get('#addButton').click();
    cy.url().should('include', '/new-categorie');
    cy.get('button').contains('Back').click({ force: true });
    cy.url()
      .should('not.include', '/new-categorie')
      .should('include', '/categories');
  });
});
