-- =============================================================================
-- BANCO DE DADOS: APROVACAST
-- DISCIPLINA: Banco de Dados | PROFESSOR: Sidiney de Sousa Araujo
-- ARQUIVO: 01_criacao.sql (Ordem de dependência respeitada)
-- =============================================================================

-- 1. TABELA CATEGORIA (Pai no relacionamento 1:N)
CREATE TABLE IF NOT EXISTS categoria (
    id_categoria SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE
);

-- 2. TABELA CONTEUDO (Filho no relacionamento 1:N)
CREATE TABLE IF NOT EXISTS conteudo (
    id_conteudo SERIAL PRIMARY KEY,
    id_categoria INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    duracao_minutos INT NOT NULL CHECK (duracao_minutos > 0),
    CONSTRAINT fk_conteudo_categoria 
        FOREIGN KEY (id_categoria) 
        REFERENCES categoria(id_categoria) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
);

-- 3. TABELA PLANO (Exibida na vitrine da landing page)
CREATE TABLE IF NOT EXISTS plano (
    id_plano SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    preco NUMERIC(10, 2) NOT NULL CHECK (preco >= 0),
    descricao TEXT NOT NULL,
    icone VARCHAR(20) NOT NULL
);

-- 4. TABELA PLANO_CONTEUDO (Associativa: resolve o relacionamento N:N entre plano e conteudo)
CREATE TABLE IF NOT EXISTS plano_conteudo (
    id_plano INT NOT NULL,
    id_conteudo INT NOT NULL,
    PRIMARY KEY (id_plano, id_conteudo),
    CONSTRAINT fk_plano_conteudo_plano 
        FOREIGN KEY (id_plano) 
        REFERENCES plano(id_plano) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    CONSTRAINT fk_plano_conteudo_conteudo 
        FOREIGN KEY (id_conteudo) 
        REFERENCES conteudo(id_conteudo) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

-- 5. TABELA INSCRICAO (Armazena os cadastros do formulário do site)
CREATE TABLE IF NOT EXISTS inscricao (
    id_inscricao SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    carreira VARCHAR(100) NOT NULL,
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
