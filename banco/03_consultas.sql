-- AprovaCast - Consultas SQL (perguntas reais do negócio)

-- CONSULTA 1 - Pergunta: quais planos existem e quanto custam?
SELECT nome, preco FROM plano ORDER BY preco ASC;
-- Resultado: Básico 0,00; OAB 29,90; Federais 49,90; VIP 79,90.

-- CONSULTA 2 - Pergunta: quantos clientes estão inscritos em cada plano?
SELECT p.nome AS plano, COUNT(i.id_inscricao) AS total_inscricoes
FROM plano p
LEFT JOIN inscricao i ON i.id_plano = p.id_plano
GROUP BY p.nome
ORDER BY total_inscricoes DESC, p.nome;
-- Resultado: OAB 2; VIP 2; Básico 1; Federais 1.

-- CONSULTA 3 - Pergunta: como está a distribuição das inscrições por status?
SELECT status, COUNT(*) AS total FROM inscricao GROUP BY status ORDER BY total DESC;
-- Resultado: ativa 4; pendente 1; cancelada 1.

-- CONSULTA 4 (N:N) - Pergunta: quais recursos estão disponíveis em cada plano?
SELECT p.nome AS plano, r.nome AS recurso
FROM plano p
JOIN plano_recurso pr ON pr.id_plano = p.id_plano
JOIN recurso r        ON r.id_recurso = pr.id_recurso
ORDER BY p.nome, r.nome;
-- Resultado: 13 vínculos entre os 4 planos e os 6 recursos.

-- CONSULTA 5 - Pergunta: quais inscrições foram feitas nos últimos 30 dias?
SELECT c.nome AS cliente, p.nome AS plano, i.data_inscricao
FROM inscricao i
JOIN cliente c ON c.id_cliente = i.id_cliente
JOIN plano p   ON p.id_plano   = i.id_plano
WHERE i.data_inscricao >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY i.data_inscricao DESC;
-- Resultado (em 22/11/2026): Elisa Rocha (OAB) e Diego Santos (VIP).

-- CONSULTA 6 - Pergunta: existe algum plano sem nenhuma inscrição?
SELECT p.nome AS plano_sem_inscricao
FROM plano p
LEFT JOIN inscricao i ON i.id_plano = p.id_plano
WHERE i.id_inscricao IS NULL;
-- Resultado: nenhuma linha.

-- CONSULTA 7 - Pergunta: qual a receita mensal potencial das inscrições ativas?
SELECT SUM(p.preco) AS receita_potencial_mensal
FROM inscricao i
JOIN plano p ON p.id_plano = i.id_plano
WHERE i.status = 'ativa';
-- Resultado: 189,70.