describe('CarSharing UI', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('shows healthy status of all services', () => {
    ['identity', 'fleet', 'bookings', 'payments'].forEach((service) => {
      cy.contains('li', `${service}:`).should('contain', 'healthy');
    });
  });

  it('lists available cars', () => {
    cy.get('table tbody tr').should('have.length.at.least', 1);
    cy.contains('td', 'Toyota Corolla');
  });

  it('books a car and rejects an overlapping booking', () => {
    cy.get('table tbody tr').first().contains('button', 'Забронювати').click();
    cy.contains('p', /Бронювання #\d+ створено|Помилка 409/);

    // повторне бронювання того ж авто на перетинний період має бути відхилене
    cy.get('table tbody tr').first().contains('button', 'Забронювати').click();
    cy.contains('p', 'Помилка 409');
  });
});
