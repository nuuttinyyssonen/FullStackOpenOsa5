import '../support/commands'
describe('Blog app', () => {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Nuutti Nyyssönen',
      username: 'nuuttinyyssonen',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    const secondUser = {
      name: 'Test User',
      username: 'testuser',
      password: 'testuser'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', secondUser)
    cy.visit('http://localhost:5173')
  })

  it('Login form is showed', () => {
    cy.contains('login to application')
  })
  
  describe('Login', () => {

    it('succeeds with correct credentials', () => {
      cy.login({ username: "nuuttinyyssonen", password: "salainen" })
      cy.contains('Nuutti Nyyssönen logged in')
    })

    it('fails with wrong credentials', () => {
      cy.get('#username').type('nuuttinyyssonen')
      cy.get('#password').type('nuuttinyyssonen')
      cy.get('#login-btn').click()
      cy.contains('Invalid username or password')
    })
  })

  describe('when logged in', () => {
    beforeEach(() => {
      cy.login({ username: "nuuttinyyssonen", password: "salainen" })
      cy.contains('Nuutti Nyyssönen logged in')

      cy.contains('create new blog').click()
      cy.get('#title').type('Test Title')
      cy.get('#author').type('Test Author')
      cy.get('#url').type('www.test.com')
      cy.get('#create-btn').click()

      cy.contains('a new blog Test Title by Test Author added')
    })

    it('can be liked', () => {
      cy.contains('Show').click()
      cy.get('.like-btn').click()
      cy.contains(1)
    })

    it('can be removed', () => {
      cy.contains('Show').click()
      cy.get('#remove-btn').click()
      cy.wait(3000)
    })
  })

  describe('second user logged in', () => {
    beforeEach(() => {
      cy.login({ username: "nuuttinyyssonen", password: "salainen" })
      cy.contains('Nuutti Nyyssönen logged in')

      cy.contains('create new blog').click()
      cy.get('#title').type('Test Title')
      cy.get('#author').type('Test Author')
      cy.get('#url').type('www.test.com')
      cy.get('#create-btn').click()

      cy.contains('a new blog Test Title by Test Author added')
      cy.contains('Logout').click()

      cy.login({ username: "testuser", password: "testuser" })
    })

    it('cannot be removed if not authorized', () => {
      cy.contains('Show').click()
      cy.get('#remove-btn').should('not.exist')
    })
  })

  describe('Blogs in order', () => {
    beforeEach(() => {
      cy.login({ username: "nuuttinyyssonen", password: "salainen" })

      cy.contains('create new blog').click()
      cy.get('#title').type('Test Title1')
      cy.get('#author').type('Test Author1')
      cy.get('#url').type('www.test1.com')
      cy.get('#create-btn').click()

      cy.wait(3000)

      cy.get('#title').type('Test Title2')
      cy.get('#author').type('Test Author2')
      cy.get('#url').type('www.test.com2')
      cy.get('#create-btn').click()
    })

    it('likes', () => {
      cy.get('.blog-post')
        .eq(0)
        .should('exist')
        .find('.show-btn')
        .should('be.visible')
        .click();

      cy.get('.blog-post')
        .eq(1)
        .should('exist')
        .find('.show-btn')
        .should('be.visible')
        .click();  
      
      cy.get('.like-btn')
        .eq(1)
        .should('exist')
        .click()
    })
  })
})