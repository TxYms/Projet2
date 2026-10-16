// Scénario 4 : la déconnexion supprime le token et bloque l'accès aux étudiants
describe('Déconnexion', () => {
  it('revient sur /login et ne permet plus d\'accéder aux étudiants', () => {
    cy.intercept('GET', '/api/students', { statusCode: 200, body: [] });
    cy.visit('/login');
    cy.loginAsAgent();
    cy.visit('/students');
    cy.contains('Students').should('be.visible');

    // WHEN : je clique sur Logout
    cy.contains('button', 'Logout').click();

    // THEN : je suis sur /login et le token a disparu
    cy.location('pathname').should('eq', '/login');
    cy.window().its('localStorage.token').should('not.exist');

    // et je ne peux plus ouvrir le formulaire d'ajout
    cy.visit('/students/new');
    cy.location('pathname').should('eq', '/login');
  });
});
