# Esquema relacional — AprovaCast

plano         (id_plano PK, nome UNIQUE, preco, descricao)
recurso       (id_recurso PK, nome UNIQUE, descricao)
plano_recurso (id_plano PK/FK -> plano, id_recurso PK/FK -> recurso)
cliente       (id_cliente PK, nome, email UNIQUE, telefone, data_cadastro)
inscricao     (id_inscricao PK, id_cliente FK -> cliente, id_plano FK -> plano, data_inscricao, status)
mensagem      (id_mensagem PK, id_cliente FK -> cliente, conteudo, resposta, data_envio)

Relacionamentos: cliente 1:N inscricao; plano 1:N inscricao; cliente 1:N mensagem (opcional);
plano N:N recurso, resolvido pela tabela associativa plano_recurso.
Normalização: 1FN (atributos atômicos), 2FN (sem dependência parcial), 3FN (sem dependência transitiva).