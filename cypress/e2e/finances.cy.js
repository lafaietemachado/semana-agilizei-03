/// <reference types="cypress" />

import { format } from '../support/util'

context('Dev Finances Agilizei', () => {
  
    beforeEach(() => {
        cy.visit('https://devfinance-agilizei.netlify.app/')

        cy.get('#data-table tbody tr').should('have.length', 0)
    })
    it('Cadastrar entradas', () => {
        
        cy.get('#transaction .button').click()
        cy.get('#description').type('Mesada')
        cy.get('[name=amount]').type(12)
        cy.get('[type=date]').type('2023-10-15')
        cy.get('button').contains('Salvar').click()

        cy.get('#data-table tbody tr').should('have.length', 1)
    })

    it('Cadastrar saídas', () => {
        
        cy.get('#transaction .button').click()
        cy.get('#description').type('Presente')
        cy.get('[name=amount]').type(-12)
        cy.get('[type=date]').type('2023-10-15')
        cy.get('button').contains('Salvar').click()

        cy.get('#data-table tbody tr').should('have.length', 1)
    })

    it('Remover entradas e saidas', () => {
        const entrada = 'Mesada'
        const saida = 'KinderOvo'

        cy.get('#transaction .button').click()
        cy.get('#description').type(entrada)
        cy.get('[name=amount]').type(120)
        cy.get('[type=date]').type('2023-10-15')
        cy.get('button').contains('Salvar').click()

        cy.get('#transaction .button').click()
        cy.get('#description').type(saida)
        cy.get('[name=amount]').type(-35)
        cy.get('[type=date]').type('2023-10-15')
        cy.get('button').contains('Salvar').click()

        //estrategia 1: voltar para elemento pai, e avançar para um td img attr

        cy.get('td.description').contains(entrada).parent().find('img[onclick*=remove]').click()

        // estrategia 2: buscar todos os irmãos, e buscar o que tem img + attr

        cy.get('td.description').contains(saida).siblings().children('img[onclick*=remove]').click()

        cy.get('#data-table tbody tr').should('have.length', 0)

    })

    it.only('Validar saldo com diversas transações', () => {
        const entrada = 'Mesada'
        const saida = 'KinderOvo'

        cy.get('#transaction .button').click()
        cy.get('#description').type(entrada)
        cy.get('[name=amount]').type(120)
        cy.get('[type=date]').type('2023-10-15')
        cy.get('button').contains('Salvar').click()

        cy.get('#transaction .button').click()
        cy.get('#description').type(saida)
        cy.get('[name=amount]').type(-35)
        cy.get('[type=date]').type('2023-10-15')
        cy.get('button').contains('Salvar').click()

        let incomes = 0
        let expenses =0

        cy.get('#data-table tbody tr').each(($el, index, $list) => {
            cy.log(index)

            cy.get($el).find('td.income, td.expense').invoke('text').then(text => {
                if(text.includes('-')){
                    expenses = expenses + format(text)
                } else{
                    incomes = incomes + format(text)
                }

                cy.log(`entradas`, incomes)
                cy.log(`saidas`, expenses)
            })
        })

        cy.get('#totalDisplay').invoke('text').then(text=> {
            cy.log(`valor total`, format(text))

            let formattedTotalDisplay = format(text)
            let expectedTotal= incomes + expenses

            expect(formattedTotalDisplay).to.eq(expectedTotal)
        })
    })
})