
1. CONTEXTUALIZAÇÃO
Neste projeto final, você planejará e desenvolverá uma aplicação executada via Desktop Standalone para gerenciamento de uma livraria. O sistema permitirá administrar autores, livros, clientes e empréstimos, mantendo os dados em banco de dados (PostgreSQL) durante a execução. Paralelamente, você modelará e implementará o banco de dados relacional da livraria no PostgreSQL, por meio de um Diagrama Entidade-Relacionamento (DER) e de um script SQL. A aplicação deverá ser implementada utilizando Node.js e TypeScript.
                

Durante o desenvolvimento, espera-se que sejam aplicados, entre outros, os seguintes conteúdos:
●        JavaScript moderno aplicado ao Back-End;
●        Node.js;
●        TypeScript;
●        Programação Orientada a Objetos;
●        Interfaces, classes e tipagem estática;
●        Programação assíncrona com Promises e Async/Await;
●        Arquitetura em camadas e separação de responsabilidades;
●        PostgreSQL;
●        Modelagem de banco de dados relacional;
●        Comandos SQL (DDL, DML e consultas);
●        Consultas utilizando JOIN, GROUP BY, ORDER BY, LIMIT e funções de agregação;
●        Princípios de Clean Code e SOLID;
●        Git, GitHub e GitFlow para versionamento do projeto.
________________


2. DESAFIO
Desenvolver um sistema de gerenciamento de uma pequena livraria. A empresa precisa informatizar o controle de autores, livros, clientes e empréstimos, substituindo os registros manuais por uma aplicação executada via terminal.
O sistema deverá se chamar:
BookStore Manager
A aplicação deverá permitir o gerenciamento das informações da livraria por meio de menus interativos no terminal, mantendo os dados em banco de dados (PostgreSQL) durante a execução. 
Durante a execução do projeto, o sistema deverá possibilitar o cadastro, consulta, atualização e remoção de registros, além de controlar empréstimos e devoluções de livros. Os relatórios gerenciais deverão ser elaborados por meio de consultas SQL no banco de dados.
Todo o projeto deverá ser desenvolvido utilizando Node.js e TypeScript, aplicando uma arquitetura organizada, boas práticas de programação.
Objetivo técnico do projeto
Planejar e desenvolver uma aplicação e o projeto do banco de dados da livraria, sendo capaz de:
* gerenciar autores, livros, clientes e empréstimos por meio do terminal, mantendo os dados em memória;
* modelar o banco de dados relacional da livraria por meio de um Diagrama Entidade-Relacionamento (DER);
* aplicar regras de negócio durante as operações do sistema;
* implementar o banco de dados no PostgreSQL por meio de script SQL (DDL, DML e consultas relacionais);
*  elaborar relatórios gerenciais por meio de consultas SQL;
* organizar o código em camadas, promovendo modularização e reutilização;
* utilizar recursos da linguagem TypeScript, programação orientada a objetos e programação assíncrona;
* documentar a instalação, execução e utilização da aplicação no arquivo README.md.
3. RESULTADOS ESPERADOS (ENTREGA)
* Repositório público no GitHub: contendo todo o histórico de desenvolvimento do projeto, com commits semânticos, branches e organização do código.
* Projeto desenvolvido em Node.js com TypeScript: aplicação executável, estruturada em camadas, com os dados mantidos em banco de dados e implementando todas as funcionalidades descritas neste documento.
* Arquivo README.md completo: documentação técnica contendo instruções para instalação, configuração do ambiente, execução do script SQL no PostgreSQL, execução da aplicação, arquitetura adotada, tecnologias utilizadas e exemplos de utilização do sistema.
* Histórico de versionamento no GitHub: demonstrando a evolução do desenvolvimento por meio de commits semânticos e utilização de branches conforme o fluxo de versionamento definido.

4. REQUISITOS DAS TAREFAS
4.1. ORGANIZAÇÃO ARQUITETURAL DO PROJETO
A aplicação deverá ser desenvolvida utilizando uma arquitetura organizada em camadas, promovendo a separação de responsabilidades entre os diferentes componentes do sistema. O objetivo é facilitar a manutenção do código, aumentar sua legibilidade e aplicar boas práticas de desenvolvimento estudadas durante o curso.
 
Não será permitido desenvolver toda a aplicação em um único arquivo (main.ts). Cada camada deverá possuir responsabilidades bem definidas, evitando duplicação de código e alto acoplamento entre os módulos.
 
A estrutura mínima sugerida para o projeto é:
   
Responsabilidade das camadas. Deve-se efetuar commit no GitHub (https://github.com/angeloluizdesouza/SCTEC-BookStore-Manager) de cada camada criada para depois dar seguimento na próxima.
 
Main
	Responsável por iniciar a aplicação, carregar os dados iniciais (seed) e iniciar o menu principal do sistema.
	Controllers
	Responsáveis por realizar a interação com o usuário por meio do terminal, recebendo entradas, apresentando menus, exibindo mensagens e acionando os serviços da aplicação.
	Services
	Responsáveis por implementar as regras de negócio do sistema, realizando validações, processando informações e coordenando as operações necessárias antes do acesso aos dados.
	Repositories
	Responsáveis exclusivamente pelo armazenamento e recuperação dos dados em memória (arrays ou Map), oferecendo métodos para inserção, atualização, consulta e remoção de registros. 
        Nenhuma outra camada deve manipular essas coleções diretamente. Os dados iniciais (seed) podem ficar em um arquivo próprio, como src/data/seed.ts.
	Models
	Responsáveis por representar as entidades do sistema por meio de classes, interfaces e tipos utilizados ao longo da aplicação.
	Database
	Pasta localizada na raiz do repositório (fora de src/), que reúne o projeto do banco de dados: o DER (PNG, JPG ou PDF) e o arquivo script.sql. 
	Utils
	Responsável por concentrar funções auxiliares reutilizáveis, como validações, formatação de textos, tratamento de datas e outras rotinas compartilhadas.
	Menus
	Responsável pela organização dos menus da aplicação, tornando a navegação mais modular e facilitando futuras expansões do sistema.


4.2. REQUISITOS FUNCIONAIS (RF)
RF01 – Configurar o projeto Node.js com TypeScript
Deverá criar uma aplicação utilizando Node.js e TypeScript, contendo, no mínimo, os seguintes arquivos:
 
●        package.json;
●        tsconfig.json;
●        README.md;
●        .gitignore;
●        src/main.ts.
 
RF03 – Criar a estrutura do banco de dados.
Desenvolver o arquivo script.sql, localizado na pasta database/, contendo os comandos DDL (CREATE TABLE) para a criação de toda a estrutura do banco de dados.
 
O banco deverá contemplar, no mínimo, as seguintes entidades:
 
●        Autores;
●        Livros;
●        Clientes;
●        Empréstimos.

O diagrama de classes (Class Diagram.md) estará disponível para leitura junto com está skill.
Os relacionamentos devem ser implementados utilizando chaves primárias e estrangeiras, além de restrições como NOT NULL, UNIQUE e CHECK, quando aplicável.
 
O arquivo script.sql deverá ser organizado em seções, para geração do banco de dados em outro ambiente caso seja efetuado clone para outro desktop.

RF04 – Implementar a arquitetura em camadas
A aplicação deverá seguir uma arquitetura organizada em camadas, separando as responsabilidades entre Controllers, Services, Repositories, Models, Menus e Utils.
Não será permitido desenvolver toda a aplicação em um único arquivo.

RF05 – Criar as classes e interfaces do sistema
Deverá representar as entidades do sistema utilizando Classes e Interfaces do TypeScript.
As entidades deverão possuir atributos tipados e serem utilizadas ao longo da aplicação.

RF06 – Desenvolver o menu principal
Ao iniciar a aplicação, deverá ser apresentado um menu principal permitindo a navegação entre os módulos do sistema.
 
Exemplo:
 
●        Autores;
●        Livros;
●        Clientes;
●        Empréstimos;
●        Encerrar aplicação.


RF07 – Implementar o gerenciamento de autores
O sistema deverá permitir:
 
●        cadastrar autores;
●        listar autores;
●        consultar um autor por identificador;
●        atualizar autores;
●        remover autores.


RF08 – Implementar o gerenciamento de livros
O sistema deverá permitir:
 
●        cadastrar livros;
●        listar livros;
●        consultar livros;
●        atualizar livros;
●        remover livros.
 
Cada livro deverá estar obrigatoriamente vinculado a um autor previamente cadastrado.


RF09 – Implementar o gerenciamento de clientes
O sistema deverá permitir:
 
●        cadastrar clientes;
●        listar clientes;
●        consultar clientes;
●        atualizar clientes;
●        remover clientes.


RF10 – Realizar empréstimos
O sistema deverá permitir registrar o empréstimo de um livro para um cliente.
 
Antes de registrar o empréstimo deverão ser realizadas validações como:
 
●        existência do livro;
●        existência do cliente;
●        disponibilidade do livro.
RF11 – Registrar devoluções
O sistema deverá permitir registrar a devolução de um livro emprestado.
 
Após a devolução, a quantidade disponível do livro deverá ser atualizada.


RF12 – Consultar empréstimos
O sistema deverá permitir consultar os empréstimos cadastrados.
 
A listagem deverá apresentar informações do livro, do cliente e da data do empréstimo.
 
RF13 – Impedir operações inválidas
A aplicação deverá validar situações como:
 
●        autor inexistente;
●        livro inexistente;
●        cliente inexistente;
●        empréstimo inexistente;
●        livro sem disponibilidade;
●        registros duplicados quando aplicável.
 
Sempre que ocorrer uma situação inválida, o sistema deverá apresentar mensagens claras ao usuário sem interromper sua execução.
RF14 – Utilizar programação assíncrona
Os métodos das camadas Services e Repositories deverão ser assíncronos (async), retornando Promises, e suas chamadas deverão utilizar await com tratamento adequado de exceções. Essa organização prepara a aplicação para uma futura integração com banco de dados.
RF15 – Implementar tratamento de erros
As operações críticas deverão utilizar blocos try/catch, garantindo que entradas inválidas ou violações das regras de negócio não interrompam a execução da aplicação.
RF16 – Manipular dados com SQL (DML)
O arquivo script.sql deverá conter comandos SQL para realizar operações de:
 
●        INSERT;
●        UPDATE;
●        DELETE;
●        SELECT.
 
Os comandos INSERT deverão popular todas as tabelas com os mesmos dados de exemplo utilizados como dados iniciais (seed) da aplicação. Os comandos UPDATE e DELETE deverão demonstrar a atualização e a remoção de registros, respeitando os relacionamentos entre as tabelas.
RF17 – Utilizar consultas relacionais
O arquivo script.sql deverá conter consultas utilizando relacionamentos entre tabelas, empregando comandos como:
 
●        INNER JOIN;
●        LEFT JOIN;
●        GROUP BY;
●        ORDER BY;
●        LIMIT;
●        funções de agregação.


RF18 – Implementar relatórios em SQL
O arquivo script.sql deverá conter consultas SQL que gerem, no mínimo, os seguintes relatórios:
 
●        livros disponíveis;
●        livros emprestados;
●        livros cadastrados por autor;
●        quantidade de empréstimos por livro;
●        clientes com empréstimos ativos.
 
Outros relatórios poderão ser implementados como diferencial. Os relatórios não precisam ser implementados na aplicação CLI.
RF19 – Utilizar recursos do TypeScript
O projeto deverá demonstrar a utilização de:
 
●        interfaces;
●        classes;
●        modificadores de acesso;
●        parâmetros tipados;
●        retornos tipados;
●        construtores;
●        métodos.


RF20 – Aplicar boas práticas de programação
O código deverá demonstrar:
 
●        nomes significativos para variáveis e métodos;
●        separação de responsabilidades;
●        reutilização de código;
●        ausência de duplicação desnecessária;
●        organização e legibilidade.

RF21 – Demonstrar o funcionamento da aplicação
O arquivo main.ts deverá iniciar toda a aplicação, carregar os dados iniciais (seed) e iniciar o menu principal do sistema, permitindo a navegação entre todas as funcionalidades implementadas.
RF22 – Documentar o projeto
Deverá elaborar um arquivo README.md contendo:
 
●        descrição do projeto;
●        objetivo;
●        tecnologias utilizadas;
●        requisitos para execução;
●        execução do script SQL no PostgreSQL;
●        imagem do DER;
●        instalação;
●        execução;
●        arquitetura do projeto;
●        funcionalidades implementadas;
●        estrutura de pastas;
●        exemplos de utilização;
●        integrantes da equipe;
●        link do Kanban.

4.3. REQUISITOS NÃO FUNCIONAIS (RNF)
Além da implementação das funcionalidades descritas anteriormente, o projeto deverá atender aos seguintes requisitos de qualidade.
 


RNF02 – Organização do código
 
O código-fonte deverá estar organizado em camadas, conforme a arquitetura proposta neste documento, evitando arquivos excessivamente grandes ou com múltiplas responsabilidades.

RNF03 – Padronização do código
 
O projeto deverá utilizar nomes claros e significativos para:
 
●        classes;
●        interfaces;
●        funções;
●        métodos;
●        variáveis;
●        arquivos;
●        pastas.
 
A nomenclatura adotada deverá seguir um padrão consistente durante todo o projeto.


RNF04 – Qualidade do código
 
A aplicação deverá demonstrar boas práticas de desenvolvimento, tais como:
 
●        baixo acoplamento entre as camadas;
●        reutilização de código;
●        ausência de duplicação desnecessária;
●        funções e métodos com responsabilidade bem definida;
●        organização e legibilidade do código.


RNF05 – Portabilidade
 
A aplicação deverá executar corretamente em qualquer ambiente que possua os pré-requisitos especificados no README, sem necessidade de alterações no código-fonte.
4.4. VERSIONAMENTO COM GITHUB
O desenvolvimento do projeto deverá utilizar o Git como sistema de controle de versão e o GitHub como plataforma para hospedagem do repositório. Espera-se que o histórico do projeto demonstre a evolução do desenvolvimento da aplicação, evidenciando boas práticas de versionamento, organização das tarefas e colaboração entre os integrantes da equipe.
 
Branches mínimas
 
Para projeto individual:
main
develop
feat/autores
feat/livros
feat/clientes
feat/emprestimos
feat/banco-dados
docs/readme
	 

Fluxo de desenvolvimento
Durante o desenvolvimento do projeto, recomenda-se seguir o seguinte fluxo:
 
1. Criar uma nova branch a partir da develop;
2. Implementar a funcionalidade proposta;
3. Realizar commits semânticos durante o desenvolvimento;
4. Integrar a funcionalidade na branch develop;
5. Após a conclusão do projeto, realizar a integração da develop na main.

Repositório GitHub https://github.com/angeloluizdesouza/SCTEC-BookStore-Manager (já está criado). 
Commits mínimos
O histórico do repositório deverá demonstrar a evolução contínua do projeto.
 
Quantidade mínima recomendada:
- Projeto Individual: mínimo de 12 commits.
 
Não serão considerados apenas commits de criação do projeto ou alterações no README. Espera-se que o histórico represente o desenvolvimento das funcionalidades ao longo da execução do projeto.
 
Exemplos de commits
feat: cria estrutura inicial do projeto feat: implementa cadastro de autores feat: implementa gerenciamento de livros feat: adiciona cadastro de clientes feat: implementa empréstimos de livros feat: cria consultas de relatórios no script.sql refactor: reorganiza camada de serviços fix: corrige validação de empréstimos docs: atualiza README style: aplica padronização do código
	 
Histórico de desenvolvimento
O histórico de commits deverá demonstrar:
 
- evolução gradual do projeto;
- implementação incremental das funcionalidades;
- organização lógica das alterações;
- utilização adequada das branches.
 
Não é recomendado concentrar todo o desenvolvimento em poucos commits ou realizar apenas um commit ao final do projeto.
 
O repositório deverá ser público até a conclusão da avaliação e conter:
 
- código-fonte completo;
- histórico de commits;
- branches utilizadas durante o desenvolvimento;
- arquivo README.md atualizado;
- arquivo script.sql do banco de dados;
- diagrama de classes do banco de dados (.MD;
- arquivo .gitignore;
- demais arquivos necessários para execução da aplicação.
