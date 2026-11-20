-- =============================================================================
-- BANCO DE DADOS: APROVACAST
-- DISCIPLINA: Banco de Dados | PROFESSOR: Sidiney de Sousa Araujo
-- ARQUIVO: 03_consultas.sql (5 Consultas obrigatórias de negócio)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- CONSULTA 1: Quais conteúdos em áudio estão cadastrados e a qual categoria pertencem?
-- Comandos utilizados: SELECT, INNER JOIN, ORDER BY
-- Finalidade: Listar o catálogo de aulas com o nome de suas respectivas categorias.
-- -----------------------------------------------------------------------------
SELECT 
    c.id_conteudo,
    c.titulo AS aula_audio,
    cat.nome AS categoria,
    c.duracao_minutos
FROM conteudo c
INNER JOIN categoria cat ON c.id_categoria = cat.id_categoria
ORDER BY cat.nome, c.titulo;


-- -----------------------------------------------------------------------------
-- CONSULTA 2: Quantos conteúdos em áudio existem em cada categoria?
-- Comandos utilizados: SELECT, INNER JOIN, COUNT, GROUP BY, ORDER BY
-- Finalidade: Avaliar quais categorias possuem mais materiais produzidos.
-- -----------------------------------------------------------------------------
SELECT 
    cat.nome AS categoria,
    COUNT(c.id_conteudo) AS total_conteudos
FROM categoria cat
INNER JOIN conteudo c ON cat.id_categoria = c.id_categoria
GROUP BY cat.nome
ORDER BY total_conteudos DESC;


-- -----------------------------------------------------------------------------
-- CONSULTA 3: Quais conteúdos em áudio estão liberados para cada plano?
-- Comandos utilizados: SELECT, INNER JOIN (envolvendo a tabela associativa N:N)
-- Finalidade: Mapear a grade de conteúdos disponível em cada assinatura.
-- -----------------------------------------------------------------------------
SELECT 
    p.nome AS plano,
    p.preco,
    c.titulo AS conteudo_disponivel,
    c.duracao_minutos
FROM plano p
INNER JOIN plano_conteudo pc ON p.id_plano = pc.id_plano
INNER JOIN conteudo c ON pc.id_conteudo = c.id_conteudo
ORDER BY p.preco ASC, c.titulo ASC;


-- -----------------------------------------------------------------------------
-- CONSULTA 4: Qual a média de duração (em minutos) dos áudios por categoria?
-- Comandos utilizados: SELECT, INNER JOIN, AVG, ROUND, GROUP BY, HAVING
-- Finalidade: Analisar o tempo médio de estudo por área.
-- -----------------------------------------------------------------------------
SELECT 
    cat.nome AS categoria,
    ROUND(AVG(c.duracao_minutos), 1) AS duracao_media_minutos,
    SUM(c.duracao_minutos) AS tempo_total_minutos
FROM categoria cat
INNER JOIN conteudo c ON cat.id_categoria = c.id_categoria
GROUP BY cat.nome
HAVING COUNT(c.id_conteudo) > 0
ORDER BY duracao_media_minutos DESC;


-- -----------------------------------------------------------------------------
-- CONSULTA 5: Quantas inscrições foram realizadas por carreira através do formulário do site?
-- Comandos utilizados: SELECT, COUNT, GROUP BY, ORDER BY
-- Finalidade: Relatório de conversão de leads para saber a carreira com maior procura.
-- -----------------------------------------------------------------------------
SELECT 
    carreira,
    COUNT(id_inscricao) AS total_inscritos
FROM inscricao
GROUP BY carreira
ORDER BY total_inscritos DESC;