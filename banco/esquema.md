# Esquema Relacional - AprovaCast

## 1. Tabelas e Atributos

* **categoria** (<u>id_categoria</u>, nome)
* **conteudo** (<u>id_conteudo</u>, *id_categoria*, titulo, duracao_minutos)
  * *id_categoria* referencia **categoria**(id_categoria) [Relacionamento 1:N]
* **plano** (<u>id_plano</u>, nome, preco, descricao, icone)
* **plano_conteudo** (<u>*id_plano*</u>, <u>*id_conteudo*</u>)
  * *id_plano* referencia **plano**(id_plano)
  * *id_conteudo* referencia **conteudo**(id_conteudo) [Relacionamento N:N resolvido por associativa]
* **inscricao** (<u>id_inscricao</u>, nome, email, carreira, data_cadastro)

## 2. Normalização
* **1FN (Primeira Forma Normal):** Todos os atributos possuem valores atômicos e indivisíveis; não existem colunas multivaloradas ou grupos repetitivos.
* **2FN (Segunda Forma Normal):** A base já atende à 1FN e todos os atributos não-chave dependem totalmente da totalidade da chave primária (especialmente na tabela associativa `plano_conteudo`, cuja chave é composta).
* **3FN (Terceira Forma Normal):** A base já atende à 2FN e nenhum atributo não-chave possui dependência transitiva de outro atributo não-chave.