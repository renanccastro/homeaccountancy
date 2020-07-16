describe('Categories', () => {
  it('Visit and check add new categorie button', () => {
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
});
