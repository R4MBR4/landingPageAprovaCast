-- AprovaCast - Carga dos dados de teste (executar depois do 01_criacao.sql)

INSERT INTO plano (nome, preco, descricao) VALUES
('Plano Básico', 0.00, 'Notícias de editais e podcasts introdutórios.'),
('OAB & Jurídico', 29.90, 'Legislação narrada e súmulas do STF/STJ.'),
('Concursos Federais', 49.90, 'Carreiras policiais, fiscais e administrativas.'),
('AprovaCast VIP (IA)', 79.90, 'Acesso total, resumos com IA e flashcards em áudio.');

INSERT INTO recurso (nome, descricao) VALUES
('Áudio offline', 'Download das aulas para estudar sem internet.'),
('Resumos por IA', 'Resumos gerados e revisados por inteligência artificial.'),
('Legislação narrada', 'Leis e súmulas convertidas em áudio.'),
('Simulados', 'Bancos de questões com correção comentada.'),
('Flashcards em áudio', 'Cartões de revisão em formato sonoro.'),
('Chatbot 24h', 'Atendimento por assistente virtual.');

INSERT INTO plano_recurso (id_plano, id_recurso) VALUES
(1,1), (1,3), (2,1), (2,3), (2,6), (3,1), (3,4), (3,6),
(4,1), (4,2), (4,4), (4,5), (4,6);

INSERT INTO cliente (nome, email, telefone, data_cadastro) VALUES
('Ana Souza', 'ana@email.com', '86999990001', '2026-10-01'),
('Bruno Lima', 'bruno@email.com', '86999990002', '2026-10-05'),
('Carla Mendes', 'carla@email.com', '86999990003', '2026-10-12'),
('Diego Santos', 'diego@email.com', '86999990004', '2026-11-02'),
('Elisa Rocha', 'elisa@email.com', '86999990005', '2026-11-10');

INSERT INTO inscricao (id_cliente, id_plano, data_inscricao, status) VALUES
(1,1,'2026-10-01','ativa'), (1,4,'2026-10-15','ativa'),
(2,2,'2026-10-06','ativa'), (3,3,'2026-10-12','cancelada'),
(4,4,'2026-11-02','ativa'), (5,2,'2026-11-10','pendente');

INSERT INTO mensagem (id_cliente, conteudo, resposta, data_envio) VALUES
(1, 'Quais são os planos?', 'Temos 4 planos, do Básico ao VIP com IA.', '2026-10-15 10:00:00'),
(2, 'O plano OAB inclui súmulas?', 'Sim! Inclui legislação narrada e súmulas STF/STJ.', '2026-10-20 14:30:00'),
(NULL, 'Como cancelar?', 'Você pode cancelar quando quiser, sem fidelidade.', '2026-11-05 09:15:00');