import { fakeToken } from '../support/commands';

// Scénario 2 : un agent crée son compte puis se connecte (API simulée avec cy.intercept)
describe('Inscription et connexion', () => {
  beforeEach(() => {
    // Réponses simulées du back-end
    cy.intercept('POST', '/api/register', { statusCode: 201 }).as('register');
    cy.intercept('GET', '/api/students', { statusCode: 200, body: [] }).as('getStudents');
  });

  it('crée un compte, puis se connecte et arrive sur la liste des étudiants', () => {
    // 1. Inscription
    cy.visit('/register');
    cy.fillField('firstName', 'John');
    cy.fillField('lastName', 'Doe');
    cy.fillField('login', 'jdoe');
    cy.fillField('password', 'password');
    cy.contains('button', 'Register').click();

    // le front envoie bien les données attendues par RegisterDTO
    cy.wait('@register').its('request.body').should('deep.equal', {
      firstName: 'John', lastName: 'Doe', login: 'jdoe', password: 'password'
    });
    cy.location('pathname').should('eq', '/login');

    // 2. Connexion avec un mauvais mot de passe : le message du serveur s'affiche
    cy.intercept('POST', '/api/login', { statusCode: 401, body: { message: 'Invalid credentials' } }).as('badLogin');
    cy.fillField('login', 'jdoe');
    cy.fillField('password', 'wrong');
    cy.contains('button', 'Login').click();
    cy.wait('@badLogin');
    cy.get('.alert-danger').should('contain', 'Invalid credentials');

    // 3. Connexion avec le bon mot de passe
    cy.intercept('POST', '/api/login', { statusCode: 200, body: { token: fakeToken() } }).as('login');
    cy.fillField('password', 'password');
    cy.contains('button', 'Login').click();

    // THEN : le token est enregistré et j'arrive sur la liste des étudiants
    cy.wait('@login').its('request.body').should('deep.equal', { login: 'jdoe', password: 'password' });
    cy.location('pathname').should('eq', '/students');
    cy.wait('@getStudents');
    cy.contains('No student yet.').should('be.visible');
    cy.window().its('localStorage.token').should('exist');
  });
});
