-- AprovaCast - Script de criação das tabelas (PostgreSQL)
-- Executar em um banco vazio. As tabelas são criadas na ordem de dependência.

DROP TABLE IF EXISTS mensagem, inscricao, cliente, plano_recurso, recurso, plano CASCADE;

-- 1. PLANO: planos de assinatura exibidos na vitrine do site
CREATE TABLE plano (
    id_plano   SERIAL PRIMARY KEY,
    nome       VARCHAR(80)   NOT NULL UNIQUE,
    preco      NUMERIC(10,2) NOT NULL CHECK (preco >= 0),
    descricao  TEXT
);

-- 2. RECURSO: benefícios que os planos oferecem
CREATE TABLE recurso (
    id_recurso SERIAL PRIMARY KEY,
    nome       VARCHAR(80) NOT NULL UNIQUE,
    descricao  TEXT
);

-- 3. PLANO_RECURSO: tabela associativa que resolve o N:N entre plano e recurso
CREATE TABLE plano_recurso (
    id_plano   INTEGER NOT NULL REFERENCES plano (id_plano) ON DELETE CASCADE,
    id_recurso INTEGER NOT NULL REFERENCES recurso (id_recurso) ON DELETE CASCADE,
    PRIMARY KEY (id_plano, id_recurso)
);

-- 4. CLIENTE: pessoa que se cadastra pelo formulário do site
CREATE TABLE cliente (
    id_cliente    SERIAL PRIMARY KEY,
    nome          VARCHAR(120) NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    telefone      VARCHAR(20),
    data_cadastro DATE NOT NULL DEFAULT CURRENT_DATE
);

-- 5. INSCRICAO: liga um cliente a um plano (1:N com cliente e 1:N com plano)
CREATE TABLE inscricao (
    id_inscricao   SERIAL PRIMARY KEY,
    id_cliente     INTEGER NOT NULL REFERENCES cliente (id_cliente) ON DELETE RESTRICT,
    id_plano       INTEGER NOT NULL REFERENCES plano (id_plano) ON DELETE RESTRICT,
    data_inscricao DATE NOT NULL DEFAULT CURRENT_DATE,
    status         VARCHAR(20) NOT NULL DEFAULT 'ativa'
                   CHECK (status IN ('ativa', 'pendente', 'cancelada'))
);

-- 6. MENSAGEM: perguntas feitas ao chatbot e as respostas da IA
CREATE TABLE mensagem (
    id_mensagem SERIAL PRIMARY KEY,
    id_cliente  INTEGER REFERENCES cliente (id_cliente) ON DELETE SET NULL,
    conteudo    TEXT NOT NULL,
    resposta    TEXT,
    data_envio  TIMESTAMP NOT NULL DEFAULT now()
);