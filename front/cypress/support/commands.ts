// Commandes réutilisables dans les scénarios E2E

declare global {
  namespace Cypress {
    interface Chainable {
      /** Simule un agent déjà connecté : un token valide 1 h est placé dans le localStorage. */
      loginAsAgent(): Chainable<void>;
      /** Remplit un champ de formulaire Angular (formControlName). */
      fillField(name: string, value: string): Chainable<void>;
    }
  }
}

// Faux JWT : le front ne lit que le payload (le login et la date d'expiration)
export function fakeToken(): string {
  const payload = btoa(JSON.stringify({ sub: 'jdoe', exp: Math.floor(Date.now() / 1000) + 3600 }));
  return `header.${payload}.signature`;
}

Cypress.Commands.add('loginAsAgent', () => {
  cy.window().then(win => win.localStorage.setItem('token', fakeToken()));
});

Cypress.Commands.add('fillField', (name: string, value: string) => {
  cy.get(`input[formcontrolname="${name}"]`).clear().type(value);
});
