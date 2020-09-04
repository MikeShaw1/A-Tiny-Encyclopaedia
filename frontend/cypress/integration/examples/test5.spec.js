describe("My fifth test",function () {
it("Test audit function",()=>{
    cy.viewport(1400,800)
    cy.visit('http://localhost:3000/')
    cy.get('#signIn').should('contain','登录').click()
    cy.url().should('eq','http://localhost:3000/SignUp')
    cy.get('#normal_login_username').type('wy122963')
        .should('have.value','wy122963')
    cy.get('#normal_login_password').type('wy13278649176')
        .should('have.value','wy13278649176')
    cy.get('.ant-btn.login-form-button')
        .should('have.attr','type','submit')
        .click()
    cy.url().should('eq','http://localhost:3000/')
    cy.get('#username').should('contain','Hi,wy122963')
    cy.get('.anticon.anticon-setting.ant-dropdown-trigger').click()
    cy.get('#EntryAudit').should('contain','Entry Audit')
        .click()
})
})
