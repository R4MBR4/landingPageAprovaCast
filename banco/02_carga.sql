-- =============================================================================
-- BANCO DE DADOS: APROVACAST
-- DISCIPLINA: Banco de Dados | PROFESSOR: Sidiney de Sousa Araujo
-- ARQUIVO: 02_carga.sql (Povoamento dos dados de teste)
-- =============================================================================

-- 1. CARGA DA TABELA CATEGORIA
INSERT INTO categoria (nome) VALUES 
('Carreiras Policiais'),
('OAB e Jurídico'),
('Carreiras Fiscais e Administrativas'),
('Geral e Atualidades');

-- 2. CARGA DA TABELA CONTEUDO (Aulas e resumos em áudio)
INSERT INTO conteudo (id_categoria, titulo, duracao_minutos) VALUES 
(1, 'Direito Penal: Teoria do Crime em 15 minutos', 15),
(1, 'Processo Penal: Inquérito Policial Descomplicado', 25),
(2, 'Ética OAB: Estatuto da Advocacia Comentado', 30),
(2, 'Direito Constitucional: Direitos Fundamentais (Art. 5º)', 40),
(3, 'Direito Administrativo: Atos e Poderes da Administração', 35),
(3, 'AFO: Lei de Responsabilidade Fiscal e Orçamento', 28),
(4, 'Atualidades: Panorama Semanal de Concursos e Editais', 20);

-- 3. CARGA DA TABELA PLANO (Exatamente os planos exibidos no site)
INSERT INTO plano (nome, preco, descricao, icone) VALUES 
('Plano Básico', 0.00, 'Acesso diário a notícias de editais e podcasts introdutórios de matérias gerais.', '🎧'),
('OAB & Jurídico', 29.90, 'Legislação seca em áudio narrada na velocidade que você quiser + súmulas do STF/STJ.', '⚖️'),
('Concursos Federais', 49.90, 'Carreiras Policiais, Fiscais e Administrativas com simulados e jurisprudência em áudio.', '🏛️'),
('AprovaCast VIP (IA)', 79.90, 'Acesso total + resumos com Gemini IA, flashcards em áudio e dúvidas no Chatbot 24h.', '🤖');

-- 4. CARGA DA TABELA ASSOCIATIVA PLANO_CONTEUDO (Muitos para Muitos)
-- Plano Básico (id_plano = 1) tem acesso apenas a Atualidades (id_conteudo = 7)
INSERT INTO plano_conteudo (id_plano, id_conteudo) VALUES 
(1, 7);

-- Plano OAB & Jurídico (id_plano = 2) tem acesso a OAB/Jurídico e Atualidades (conteudos 3, 4, 7)
INSERT INTO plano_conteudo (id_plano, id_conteudo) VALUES 
(2, 3),
(2, 4),
(2, 7);

-- Plano Concursos Federais (id_plano = 3) tem acesso a Policiais, Fiscais e Atualidades (conteudos 1, 2, 5, 6, 7)
INSERT INTO plano_conteudo (id_plano, id_conteudo) VALUES 
(3, 1),
(3, 2),
(3, 5),
(3, 6),
(3, 7);

-- Plano VIP IA (id_plano = 4) tem acesso total a todos os conteúdos (conteudos 1 a 7)
INSERT INTO plano_conteudo (id_plano, id_conteudo) VALUES 
(4, 1),
(4, 2),
(4, 3),
(4, 4),
(4, 5),
(4, 6),
(4, 7);

-- 5. CARGA DA TABELA INSCRICAO (Leads de teste recebidos pelo formulário)
INSERT INTO inscricao (nome, email, carreira) VALUES 
('Carlos Eduardo da Silva', 'carlos.silva@email.com', 'policial'),
('Mariana Ferreira Lima', 'mariana.lima@email.com', 'juridica'),
('Lucas Gabriel Santos', 'lucas.santos@email.com', 'fiscal'),
('Beatriz Costa Ribeiro', 'beatriz.costa@email.com', 'juridica');