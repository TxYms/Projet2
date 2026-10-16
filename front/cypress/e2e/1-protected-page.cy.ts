// Scénario 1 : une page des étudiants est protégée par le guard
describe('Page protégée', () => {
  it('redirige vers /login quand on n\'est pas connecté', () => {
    // WHEN : j'ouvre la liste des étudiants sans être connecté
    cy.visit('/students');

    // THEN : je suis redirigé vers la page de connexion
    cy.location('pathname').should('eq', '/login');
    cy.contains('Login Form').should('be.visible');
  });
});
