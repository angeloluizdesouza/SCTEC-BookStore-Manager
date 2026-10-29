-- ============================================================================
-- PROJETO FINAL: SCTEC - BookStore Manager
-- BANCO DE DADOS RELACIONAL: PostgreSQL
-- AUTOR: Angelo Luiz de Souza
-- DESCRIÇÃO: Script SQL contendo DDL, DML, Consultas Relacionais e Relatórios
-- ============================================================================

-- ============================================================================
-- SEÇÃO 1: DDL - CRIAÇÃO DA ESTRUTURA DO BANCO DE DADOS (CREATE TABLE & CONSTRAINTS)
-- ============================================================================

-- Drop de tabelas existentes para garantir idempotência (ordem reversa de dependência)
DROP TABLE IF EXISTS loans CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS authors CASCADE;

-- Tabela 1: Autores (authors)
CREATE TABLE authors (
    author_id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    nationality VARCHAR(60) NOT NULL,
    birth_date DATE NOT NULL,
    CONSTRAINT chk_author_name_not_empty CHECK (LENGTH(TRIM(name)) > 0)
);

-- Tabela 2: Livros (books)
CREATE TABLE books (
    book_id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    author_id INT NOT NULL,
    genre VARCHAR(60) NOT NULL,
    publication_year INT NOT NULL,
    available_copies INT NOT NULL DEFAULT 1,
    CONSTRAINT fk_books_authors FOREIGN KEY (author_id) 
        REFERENCES authors(author_id) ON DELETE CASCADE,
    CONSTRAINT chk_book_title_not_empty CHECK (LENGTH(TRIM(title)) > 0),
    CONSTRAINT chk_publication_year CHECK (publication_year > 0 AND publication_year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1),
    CONSTRAINT chk_available_copies CHECK (available_copies >= 0)
);

-- Tabela 3: Clientes (clients)
CREATE TABLE clients (
    client_id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    phone VARCHAR(25) NOT NULL,
    birth_date DATE NOT NULL,
    CONSTRAINT chk_client_name_not_empty CHECK (LENGTH(TRIM(name)) > 0),
    CONSTRAINT chk_client_email_format CHECK (email LIKE '%_@__%.__%')
);

-- Tabela 4: Empréstimos (loans)
CREATE TABLE loans (
    loan_id SERIAL PRIMARY KEY,
    book_id INT NOT NULL,
    client_id INT NOT NULL,
    loan_date DATE NOT NULL DEFAULT CURRENT_DATE,
    return_date DATE,
    is_returned BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_loans_books FOREIGN KEY (book_id) 
        REFERENCES books(book_id) ON DELETE RESTRICT,
    CONSTRAINT fk_loans_clients FOREIGN KEY (client_id) 
        REFERENCES clients(client_id) ON DELETE RESTRICT,
    CONSTRAINT chk_return_date CHECK (return_date IS NULL OR return_date >= loan_date)
);

-- ============================================================================
-- SEÇÃO 2: DML - CARGA DE DADOS INICIAIS (SEED DATA)
-- (Mesmos dados sincronizados com src/data/seed.ts da aplicação)
-- ============================================================================

-- Inserção de Autores
INSERT INTO authors (name, nationality, birth_date) VALUES
('Machado de Assis', 'Brasileira', '1839-06-21'),
('Clarice Lispector', 'Brasileira', '1920-12-10'),
('George Orwell', 'Britânica', '1903-06-25'),
('J.R.R. Tolkien', 'Britânica', '1892-01-03'),
('Gabriel García Márquez', 'Colombiana', '1927-03-06');

-- Inserção de Livros vinculados aos autores
INSERT INTO books (title, author_id, genre, publication_year, available_copies) VALUES
('Dom Casmurro', 1, 'Romance / Realismo', 1899, 3),
('Memórias Póstumas de Brás Cubas', 1, 'Romance / Realismo', 1881, 2),
('A Hora da Estrela', 2, 'Ficção Moderna', 1977, 4),
('1984', 3, 'Ficção Distópica', 1949, 2),
('A Revolução dos Bichos', 3, 'Fábula Política', 1945, 5),
('O Hobbit', 4, 'Alta Fantasia', 1937, 3),
('O Senhor dos Anéis: A Sociedade do Anel', 4, 'Alta Fantasia', 1954, 1),
('Cem Anos de Solidão', 5, 'Realismo Mágico', 1967, 4);

-- Inserção de Clientes
INSERT INTO clients (name, email, phone, birth_date) VALUES
('Ana Clara Ribeiro', 'ana.ribeiro@email.com', '(11) 98765-4321', '1995-04-15'),
('Bruno Henrique Martins', 'bruno.martins@email.com', '(21) 97654-3210', '1988-09-22'),
('Camila Rodrigues Silva', 'camila.silva@email.com', '(31) 99876-1234', '2001-02-10'),
('Diego Santos Ferreira', 'diego.santos@email.com', '(41) 99123-4567', '1992-11-30'),
('Eduarda Lima Costa', 'eduarda.lima@email.com', '(51) 98456-7890', '1998-07-05');

-- Inserção de Empréstimos (Ativos e Concluídos)
INSERT INTO loans (book_id, client_id, loan_date, return_date, is_returned) VALUES
(1, 1, '2026-10-01', '2026-10-15', TRUE),   -- Ana devolveu Dom Casmurro
(3, 2, '2026-10-05', '2026-10-18', TRUE),   -- Bruno devolveu A Hora da Estrela
(4, 3, '2026-10-10', NULL, FALSE),           -- Camila com 1984 (ativo)
(6, 4, '2026-10-12', NULL, FALSE),           -- Diego com O Hobbit (ativo)
(7, 1, '2026-10-15', NULL, FALSE),           -- Ana com A Sociedade do Anel (ativo)
(2, 5, '2026-10-20', NULL, FALSE);           -- Eduarda com Brás Cubas (ativo)


-- ============================================================================
-- SEÇÃO 3: DML - DEMONSTRAÇÃO DE OPERAÇÕES UPDATE E DELETE
-- ============================================================================

-- Demonstração 1: Atualização de informações de cliente (telefone e e-mail)
UPDATE clients
SET phone = '(11) 99999-8888',
    email = 'ana.ribeiro.novo@email.com'
WHERE client_id = 1;

-- Demonstração 2: Atualização da quantidade disponível de um livro
UPDATE books
SET available_copies = available_copies + 1
WHERE book_id = 1;

-- Demonstração 3: Inserção e posterior remoção demonstrativa respeitando integridade
INSERT INTO authors (name, nationality, birth_date) 
VALUES ('Autor Temporário', 'Brasileira', '1980-01-01');

INSERT INTO books (title, author_id, genre, publication_year, available_copies)
VALUES ('Livro Excluir Teste', (SELECT author_id FROM authors WHERE name = 'Autor Temporário'), 'Teste', 2020, 1);

-- Remoção do livro e autor temporários
DELETE FROM books WHERE title = 'Livro Excluir Teste';
DELETE FROM authors WHERE name = 'Autor Temporário';


-- ============================================================================
-- SEÇÃO 4: DQL - CONSULTAS BÁSICAS
-- ============================================================================

-- Listar todos os autores
SELECT * FROM authors ORDER BY author_id ASC;

-- Listar todos os livros com ano superior a 1950
SELECT book_id, title, genre, publication_year, available_copies 
FROM books 
WHERE publication_year > 1950 
ORDER BY publication_year DESC;

-- Listar clientes cadastrados
SELECT client_id, name, email, phone 
FROM clients 
ORDER BY client_id ASC;


-- ============================================================================
-- SEÇÃO 5: DQL - CONSULTAS RELACIONAIS (JOIN, GROUP BY, ORDER BY, LIMIT)
-- ============================================================================

-- Consulta 1: Listagem completa de livros com o nome e nacionalidade do autor (INNER JOIN)
SELECT 
    b.book_id,
    b.title AS livro,
    b.genre AS genero,
    b.publication_year AS ano,
    b.available_copies AS exemplares_disponiveis,
    a.name AS autor,
    a.nationality AS nacionalidade
FROM books b
INNER JOIN authors a ON b.author_id = a.author_id
ORDER BY b.book_id ASC;

-- Consulta 2: Histórico completo de empréstimos com dados de livro, cliente e status (INNER JOIN)
SELECT 
    l.loan_id,
    b.title AS livro,
    c.name AS cliente,
    c.email AS contato_cliente,
    l.loan_date AS data_emprestimo,
    COALESCE(TO_CHAR(l.return_date, 'YYYY-MM-DD'), 'Pendente') AS data_devolucao,
    CASE 
        WHEN l.is_returned THEN 'Devolvido'
        ELSE 'Em Aberto (Ativo)'
    END AS status_emprestimo
FROM loans l
INNER JOIN books b ON l.book_id = b.book_id
INNER JOIN clients c ON l.client_id = c.client_id
ORDER BY l.loan_date DESC, l.loan_id DESC;

-- Consulta 3: Todos os autores e quantidade total de livros (LEFT JOIN + GROUP BY + Funções de Agregação)
SELECT 
    a.author_id,
    a.name AS autor,
    a.nationality,
    COUNT(b.book_id) AS total_livros_cadastrados,
    COALESCE(SUM(b.available_copies), 0) AS total_exemplares_em_estoque
FROM authors a
LEFT JOIN books b ON a.author_id = b.author_id
GROUP BY a.author_id, a.name, a.nationality
ORDER BY total_livros_cadastrados DESC, a.name ASC;

-- Consulta 4: Top 3 livros mais recentes na livraria (ORDER BY + LIMIT)
SELECT 
    b.book_id,
    b.title,
    b.publication_year,
    a.name AS autor
FROM books b
INNER JOIN authors a ON b.author_id = a.author_id
ORDER BY b.publication_year DESC
LIMIT 3;


-- ============================================================================
-- SEÇÃO 6: RELATÓRIOS GERENCIAIS (REQUISITO RF18)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Relatório 1: Livros disponíveis (com exemplares disponíveis no estoque)
-- ----------------------------------------------------------------------------
SELECT 
    b.book_id,
    b.title AS titulo,
    a.name AS autor,
    b.genre AS genero,
    b.available_copies AS quantidade_disponivel
FROM books b
INNER JOIN authors a ON b.author_id = a.author_id
WHERE b.available_copies > 0
ORDER BY b.available_copies DESC, b.title ASC;

-- ----------------------------------------------------------------------------
-- Relatório 2: Livros emprestados (empréstimos atualmente em andamento)
-- ----------------------------------------------------------------------------
SELECT 
    b.book_id,
    b.title AS titulo_livro,
    a.name AS autor,
    c.name AS emprestado_para,
    l.loan_date AS data_retirada
FROM loans l
INNER JOIN books b ON l.book_id = b.book_id
INNER JOIN authors a ON b.author_id = a.author_id
INNER JOIN clients c ON l.client_id = c.client_id
WHERE l.is_returned = FALSE
ORDER BY l.loan_date ASC;

-- ----------------------------------------------------------------------------
-- Relatório 3: Livros cadastrados por autor
-- ----------------------------------------------------------------------------
SELECT 
    a.name AS autor,
    a.nationality AS nacionalidade,
    COUNT(b.book_id) AS quantidade_livros,
    STRING_AGG(b.title, '; ' ORDER BY b.publication_year) AS titulos_publicados
FROM authors a
LEFT JOIN books b ON a.author_id = b.author_id
GROUP BY a.author_id, a.name, a.nationality
ORDER BY quantidade_livros DESC, a.name ASC;

-- ----------------------------------------------------------------------------
-- Relatório 4: Quantidade de empréstimos por livro (Histórico Total)
-- ----------------------------------------------------------------------------
SELECT 
    b.book_id,
    b.title AS titulo_livro,
    a.name AS autor,
    COUNT(l.loan_id) AS total_vezes_emprestado
FROM books b
INNER JOIN authors a ON b.author_id = a.author_id
LEFT JOIN loans l ON b.book_id = l.book_id
GROUP BY b.book_id, b.title, a.name
ORDER BY total_vezes_emprestado DESC, b.title ASC;

-- ----------------------------------------------------------------------------
-- Relatório 5: Clientes com empréstimos ativos (em aberto)
-- ----------------------------------------------------------------------------
SELECT 
    c.client_id,
    c.name AS nome_cliente,
    c.email,
    c.phone AS telefone,
    b.title AS livro_emprestado,
    l.loan_date AS data_emprestimo,
    CURRENT_DATE - l.loan_date AS dias_em_posse
FROM clients c
INNER JOIN loans l ON c.client_id = l.client_id
INNER JOIN books b ON l.book_id = b.book_id
WHERE l.is_returned = FALSE
ORDER BY dias_em_posse DESC, c.name ASC;

-- ----------------------------------------------------------------------------
-- Relatório Diferencial 6: Ranking dos clientes mais assíduos (Geral)
-- ----------------------------------------------------------------------------
SELECT 
    c.client_id,
    c.name AS cliente,
    COUNT(l.loan_id) AS total_emprestimos,
    COUNT(CASE WHEN l.is_returned = FALSE THEN 1 END) AS emprestimos_ativos,
    COUNT(CASE WHEN l.is_returned = TRUE THEN 1 END) AS emprestimos_devolvidos
FROM clients c
LEFT JOIN loans l ON c.client_id = l.client_id
GROUP BY c.client_id, c.name
ORDER BY total_emprestimos DESC, c.name ASC;

-- ----------------------------------------------------------------------------
-- Relatório Diferencial 7: Tempo médio de devolução dos livros concluídos
-- ----------------------------------------------------------------------------
SELECT 
    b.title AS livro,
    COUNT(l.loan_id) AS devolucoes_realizadas,
    ROUND(AVG(l.return_date - l.loan_date), 1) AS media_dias_ate_devolucao
FROM loans l
INNER JOIN books b ON l.book_id = b.book_id
WHERE l.is_returned = TRUE AND l.return_date IS NOT NULL
GROUP BY b.book_id, b.title
ORDER BY media_dias_ate_devolucao DESC;
