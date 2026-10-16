// Scénario 3 : ajouter, consulter, modifier puis supprimer un étudiant (API simulée)
describe('Gestion d\'un étudiant', () => {
  // "Base de données" simulée, modifiée par les appels interceptés
  let students: { id: number; firstName: string; lastName: string; email: string }[];

  beforeEach(() => {
    students = [];

    cy.intercept('GET', '/api/students', req => req.reply(students)).as('getStudents');
    cy.intercept('POST', '/api/students', req => {
      const created = { id: 1, ...req.body };
      students.push(created);
      req.reply({ statusCode: 201, body: created });
    }).as('createStudent');
    cy.intercept('GET', '/api/students/1', req => req.reply(students[0])).as('getStudent');
    cy.intercept('PUT', '/api/students/1', req => {
      students[0] = { id: 1, ...req.body };
      req.reply(students[0]);
    }).as('updateStudent');
    cy.intercept('DELETE', '/api/students/1', req => {
      students = [];
      req.reply({ statusCode: 204 });
    }).as('deleteStudent');

    // Je suis déjà connecté
    cy.visit('/login');
    cy.loginAsAgent();
  });

  it('ajoute un étudiant, le modifie puis le supprime', () => {
    // La liste est vide au départ
    cy.visit('/students');
    cy.contains('No student yet.').should('be.visible');

    // 1. Ajout
    cy.contains('Add a student').click();
    cy.location('pathname').should('eq', '/students/new');
    cy.contains('New student').should('be.visible');
    cy.fillField('firstName', 'Alice');
    cy.fillField('lastName', 'Martin');
    cy.fillField('email', 'alice@mail.com');
    cy.contains('button', 'Save').click();

    // le corps envoyé correspond à StudentRequestDTO, et on arrive sur le détail
    cy.wait('@createStudent').its('request.body').should('deep.equal', {
      firstName: 'Alice', lastName: 'Martin', email: 'alice@mail.com'
    });
    cy.location('pathname').should('eq', '/students/1');
    cy.contains('alice@mail.com').should('be.visible');

    // 2. Modification : le formulaire est pré-rempli
    cy.contains('a', 'Edit').click();
    cy.location('pathname').should('eq', '/students/1/edit');
    cy.get('input[formcontrolname="email"]').should('have.value', 'alice@mail.com');
    cy.fillField('lastName', 'Durand');
    cy.contains('button', 'Save').click();
    cy.wait('@updateStudent');
    cy.location('pathname').should('eq', '/students/1');
    cy.contains('Durand').should('be.visible');

    // 3. Retour à la liste : l'étudiant modifié est affiché
    cy.contains('Back to the list').click();
    cy.get('tbody tr').should('have.length', 1).and('contain', 'Durand');

    // 4. Suppression (la confirmation du navigateur est acceptée automatiquement par Cypress)
    cy.contains('button', 'Delete').click();
    cy.wait('@deleteStudent');
    cy.contains('No student yet.').should('be.visible');
  });
});
