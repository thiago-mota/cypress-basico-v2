/// <reference types="Cypress" />
const THREE_SECONDS_IN_MS = 3000

describe('Central de Atendimento ao Cliente TAT', () => {
	beforeEach(() => {
		cy.visit('./src/index.html');
	});

	describe('Testa preenchimento e envio do formulário', () => {
		it('verifica o título da aplicação', () => {
			cy.title()
				.should('be.equal', 'Central de Atendimento ao Cliente TAT');
		});
	
		it('preenche os campos obrigatórios e envia o formulário', () => {
			cy.clock();
			cy.fillMandatoryFieldsAndSubmit();
	
			cy.get('button[type="submit"')
				.click();
	
			cy.get('.success > strong')
				.should('be.visible');
	
			cy.tick(THREE_SECONDS_IN_MS);
	
				cy.get('.success > strong')
				.should('not.be.visible');
		});
	
		it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
			cy.clock();
			cy.fillMandatoryFieldsAndSubmit();
	
			cy.get('#open-text-area')
				.clear();
	
			cy.get('.button[type="submit"')
				.click();
		
			cy.get('.error > strong')
				.should('be.visible')
				.contains('Valide os campos obrigatórios!');
	
			cy.tick(THREE_SECONDS_IN_MS);
	
			cy.get('.error > strong')
				.should('not.be.visible')
		});
	
		it('verifica que o campo de telefone aceita apenas números e ficará vazio quando um valor não-numérico for digitado', () => {
			cy.get('#phone')
			.should('be.visible')
			.type('xablau')
			.should('have.value', '');
		})
	
		it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
			cy.clock();
			cy.get('#phone-checkbox')
			.check();
			cy.fillMandatoryFieldsAndSubmit();
	
	
			cy.get('.error > strong')
				.should('be.visible')
				.contains('Valide os campos obrigatórios!')
	
			cy.tick(THREE_SECONDS_IN_MS)
			cy.get('.error > strong')
				.should('not.be.visible')
				.contains('Valide os campos obrigatórios!')
	
		});
	
		it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
			cy.get('#firstName')
			.should('be.visible')
			.type('John')
			.should('have.value', 'John')
			.clear()
			.should('have.value', '');
	
		cy.get('#lastName')
			.should('be.visible')
			.type('Doe')
			.should('have.value', 'Doe')
			.clear()
			.should('have.value', '');
	
		cy.get('#email')
			.should('be.visible')
			.type('john.doe@mail.com')
			.should('have.value', 'john.doe@mail.com')
			.clear()
			.should('have.value', '');
	
			cy.get('#phone')
			.should('be.visible')
			.type(15)
			.should('have.value', 15)
			.clear()
			.should('have.value', '');
		});
	
		it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
			cy.clock()
			cy.get('.button[type="submit"')
			.click();
	
			cy.get('.error > strong')
			.should('be.visible')
			.contains('Valide os campos obrigatórios!');
	
			cy.tick(THREE_SECONDS_IN_MS)
			cy.get('.error > strong')
				.should('not.be.visible')
		});
	
		it('envia o formuário com sucesso usando um comando customizado', () => {
			cy.clock()
			cy.fillMandatoryFieldsAndSubmit();
	
			cy.get('.success')
				.should('be.visible');
	
			cy.tick(THREE_SECONDS_IN_MS)
	
			cy.get('.success > strong')
				.should('not.be.visible');
		});
	
		// it('utiliza contains ao invés de get', () => {
		// 	cy.contains('Nome')
		// 	.should('be.visible')
		// 	.next()
		// 	.type('John')
		// 	.should('have.value', 'John');
	
		// 	cy.contains('Sobrenome')
		// 	.should('be.visible')
		// 	.next()
		// 	.type('Doe')
		// 	.should('have.value', 'Doe');
	
		// 	cy.contains('E-mail')
		// 	.should('be.visible')
		// 	.next()
		// 	.type('john.doe@mail.com')
		// 	.should('have.value', 'john.doe@mail.com'); 
	
		// 	cy.contains('button', 'Enviar')
		// 		.click();	
		// });
	});


	describe('Testa radios e checkboxes', () => {
		it('selecione um produto (YouTube) por seu texto', () => {
			cy.get('#product')
				.select('YouTube')
				.should('have.value', 'youtube');
		});
	
		it('seleciona um produto (Mentoria) por seu valor', () => {
			cy.get('#product')
			.select('mentoria')
			.should('have.value', 'mentoria');
		});
	
		it('seleciona um produto (Blog) por seu índice', () => {
			cy.get('#product')
			.select(1)
			.should('have.value', 'blog');
		});
	
		it('marca o tipo de atendimento "Feedback"', () => {
			cy.get('input[type="radio"][value="feedback"]')
				.should('be.visible')
				.check()
				.should('be.checked');
		});
		
		it('marca cada tipo de atendimento', () => {
			cy.get('[type="radio"]')
				.should('have.length', 3)
				.each(($radio) => {
					cy.wrap($radio).check()
					cy.wrap($radio).should('be.checked');
				});
		});
	
		it('marca ambos os checkboxes, depois desmarca o último', () => {
			cy.get('input[type="checkbox"]')
				.check()
				.last()
				.uncheck();
	
				cy.get('input[type="checkbox"]')
					.first()
					.should('be.checked');
	
				cy.get('input[type="checkbox"]')
					.last()
					.should('not.be.checked');
		});
	});

	describe('Testa envio de arquivos', () => {
		it('seleciona um arquivo da página fixtures', () => {
			cy.get('input[type="file"]')
				.selectFile('cypress/fixtures/example.json')
				.should((input) => {
					// console.log(input)
					expect(input[0].files[0].name).to.equal('example.json')
				});
		});
	
		it('seleciona um arquivo simulando um drag-and-drop', () => {
			cy.get('input[type="file"]')
			.selectFile('cypress/fixtures/example.json', { action: 'drag-drop' })
			.should((input) => {
				expect(input[0].files[0].name).to.equal('example.json')
			});
		});
	
		it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
			cy.fixture('example.json').as('sampleFile')
			cy.get('input[type="file"]')
				.selectFile('@sampleFile')
				.should((input) => {
					expect(input[0].files[0].name).to.equal('example.json')
				});
		});
	});

	describe('Testa links que abrem e outra aba', () => {
		it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
			cy.get('a[href="privacy.html"]')
				.should('have.attr', 'target', '_blank')
		});

		it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
			cy.get('a[href="privacy.html"]')
				.invoke('removeAttr', 'target')
				.click()
		
			cy.contains('CAC TAT - Política de privacidade')
				.should('be.visible');
		});
	});

	describe('Testa tempo em que mensagens de erros ficam visíveis', () => {
		it('testa se a mensagem de sucesso ficará visível por três segundos', () => {
			cy.clock()
			cy.fillMandatoryFieldsAndSubmit();
	
			cy.get('.success')
				.should('be.visible');
	
			cy.tick(THREE_SECONDS_IN_MS)
	
			cy.get('.success > strong')
				.should('not.be.visible');
		});

		it('testa se a mensagem de erro ficará visível por três segundos', () => {
			cy.clock()
			cy.get('.button[type="submit"')
			.click();
	
			cy.get('.error > strong')
			.should('be.visible')
			.contains('Valide os campos obrigatórios!');
	
			cy.tick(THREE_SECONDS_IN_MS)
			cy.get('.error > strong')
				.should('not.be.visible');
		});
	})

	describe('Utilizando o lodash', () => {
		it('testa utilização do ._.repeat()', () => {
			cy.fillMandatoryFieldsMinusTextArea();
			const longText = Cypress._.repeat('teste ', 10);

  		cy.get('#open-text-area')
				.invoke('val', longText)
				.should('have.value', longText);
		});

		Cypress._.times(3, () => {
			it('testa utilização do ._.times()', () => {
				cy.clock()
				cy.fillMandatoryFieldsAndSubmit();
		
				cy.get('.success')
					.should('be.visible');
		
				cy.tick(THREE_SECONDS_IN_MS)
		
				cy.get('.success > strong')
					.should('not.be.visible');
			});
		});
	});

	describe('Invocando atributos e métodos de elementos com .invoke', () => {
		it('exibe e esconde as mensagens de sucesso e erro utilizando o invoke', () => {
			cy.get('.success')
				.should('not.be.visible')
				.invoke('show')
				.should('be.visible')
				.and('contain', 'Mensagem enviada com sucesso.')
				.invoke('hide')
				.should('not.be.visible')
    	cy.get('.error')
				.should('not.be.visible')
				.invoke('show')
				.should('be.visible')
				.and('contain', 'Valide os campos obrigatórios!')
				.invoke('hide')
				.should('not.be.visible')
		});

		it('preenche a área de texto utilizando o comando invoke', () => {
			cy.fillMandatoryFieldsMinusTextArea();
			const sampleText = 'Sample text a ser inserido no text-area utilizando o .invoke';

  		cy.get('#open-text-area')
				.invoke('val', sampleText)
				.should('have.value', sampleText);
		}); 
	});

	describe('Testando requisições HTTP', () => {
		it('faz uma requisição HTTP e verifica status, statusText e body', () => {
			cy.request({
				method: 'GET',
				url: 'https://cac-tat.s3.eu-central-1.amazonaws.com/index.html',
			})
				.should((response) => {
					const { status, statusText, body } = response;
					expect(status).to.equal(200);
					expect(statusText).to.equal('OK');
					expect(body).to.include('CAC TAT');
				});
		});
	});
});
