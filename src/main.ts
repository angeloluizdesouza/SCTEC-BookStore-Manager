import { AuthorRepository } from './repositories/AuthorRepository';
import { BookRepository } from './repositories/BookRepository';
import { ClientRepository } from './repositories/ClientRepository';
import { LoanRepository } from './repositories/LoanRepository';

import { AuthorService } from './services/AuthorService';
import { BookService } from './services/BookService';
import { ClientService } from './services/ClientService';
import { LoanService } from './services/LoanService';

import { AuthorController } from './controllers/AuthorController';
import { BookController } from './controllers/BookController';
import { ClientController } from './controllers/ClientController';
import { LoanController } from './controllers/LoanController';

import { AuthorMenu } from './menus/AuthorMenu';
import { BookMenu } from './menus/BookMenu';
import { ClientMenu } from './menus/ClientMenu';
import { LoanMenu } from './menus/LoanMenu';
import { MainMenu } from './menus/MainMenu';

import { loadSeedData } from './data/seed';
import { ConsoleUtils } from './utils/ConsoleUtils';
import { PromptUtils } from './utils/PromptUtils';

/**
 * Ponto de entrada principal da aplicação BookStore Manager (RF21).
 */
async function bootstrap(): Promise<void> {
  try {
    ConsoleUtils.clear();
    ConsoleUtils.printHeader('Inicialização do Sistema');
    ConsoleUtils.info('Inicializando camadas e repositórios em memória...');

    // 1. Instanciação dos Repositórios (Camada de Dados em Memória)
    const authorRepo = new AuthorRepository();
    const bookRepo = new BookRepository();
    const clientRepo = new ClientRepository();
    const loanRepo = new LoanRepository();

    // 2. Carga dos dados iniciais (Seed Data sincronizado com script.sql)
    ConsoleUtils.info('Carregando dados iniciais (seed data)...');
    await loadSeedData(authorRepo, bookRepo, clientRepo, loanRepo);
    ConsoleUtils.success('Massa de dados inicial carregada com sucesso!');

    // 3. Instanciação dos Serviços (Regras de Negócio e Validações)
    const authorService = new AuthorService(authorRepo, bookRepo);
    const bookService = new BookService(bookRepo, authorRepo, loanRepo);
    const clientService = new ClientService(clientRepo, loanRepo);
    const loanService = new LoanService(loanRepo, bookRepo, clientRepo);

    // 4. Instanciação dos Controllers (Interação com Usuário e CLI)
    const authorController = new AuthorController(authorService);
    const bookController = new BookController(bookService, authorService);
    const clientController = new ClientController(clientService);
    const loanController = new LoanController(loanService, bookService, clientService);

    // 5. Instanciação dos Menus Modulares
    const authorMenu = new AuthorMenu(authorController);
    const bookMenu = new BookMenu(bookController);
    const clientMenu = new ClientMenu(clientController);
    const loanMenu = new LoanMenu(loanController);
    const mainMenu = new MainMenu(authorMenu, bookMenu, clientMenu, loanMenu);

    await PromptUtils.pause('Pressione Enter para acessar o Menu Principal...');

    // 6. Execução do Menu Principal
    await mainMenu.show();
  } catch (error: unknown) {
    ConsoleUtils.error(
      `Falha fatal ao inicializar o BookStore Manager: ${error instanceof Error ? error.message : String(error)}`
    );
    PromptUtils.close();
    process.exit(1);
  }
}

// Inicia a aplicação
bootstrap();
