# 🎧 AprovaCast - Plataforma de Estudos em Áudio & Chatbot IA

Projeto Final Interdisciplinar desenvolvido para a **3ª Avaliação (AV3)** das disciplinas de **Desenvolvimento Web para IA** e **Banco de Dados** no curso de **Tecnólogo em Inteligência Artificial** — **Faculdade Estadual Piauí / Instituto de Tecnologia (PIT)**.

---

## 👥 Equipe de Desenvolvimento

* **Ramon Braga Ramos:** Back-end (Flask), Integração com Banco de Dados e API do Chatbot IA.
* **Juliana Jerônimo de Oliveira Sousa:** Front-end, Vitrine de Planos Dinâmica com CSS Grid e Estilização Visual.
* **Rilley Alencar Carvalho:** Interface do Chatbot, Estrutura Semântica e Apoio de Front-end.

* **Professores Orientadores:**
  * M.Sc. Tiago Martins Ribeiro (*Desenvolvimento Web para IA*)
  * Sidiney de Sousa Araujo (*Banco de Dados*)

---

## 📱 Sobre o AprovaCast

O **AprovaCast** é uma plataforma voltada a concurseiros e vestibulandos, oferecendo resumos, legislação e aulas narradas em áudio para estudos no trânsito, na academia ou no trabalho. A plataforma conta com vitrine de planos carregada do banco de dados, formulário de inscrição persistente e um **assistente virtual (AprovaCast IA)** com persona e contexto restritos.

---

## 🚀 Tecnologias Utilizadas

### Front-end:
* **HTML5 Semântico:** `<header>`, `<nav>`, `<section>` e `<footer>`.
* **CSS3:** Flexbox, CSS Grid responsivo (`auto-fit`) e media queries.
* **JavaScript ES6+:** `fetch`, `async/await`, validação de dados e manipulação do DOM.

### Back-end & Banco de Dados:
* **Python 3 & Flask:** API REST para leitura dos planos, gravação das inscrições e proxy seguro da IA.
* **PostgreSQL:** 6 tabelas (`plano`, `recurso`, `plano_recurso`, `cliente`, `inscricao`, `mensagem`), relacionamentos 1:N e N:N, normalização até a 3FN e chaves estrangeiras com `RESTRICT`, `CASCADE` e `SET NULL`.
* **Psycopg2:** driver de conexão com `RealDictCursor` e comandos parametrizados.

### Inteligência Artificial:
* **Google Gemini API (`gemini-3.8-flash`):** chamada pelo servidor Flask (rota `/api/chat`), com System Prompt restrito à persona **AprovaCast IA**. A chave fica apenas no arquivo `.env`.
* **Mecanismo de Contingência:** fallback local por palavras-chave em caso de falha.

---

## 🗄️ Banco de Dados (pasta `banco/`)

| Arquivo | Conteúdo |
| --- | --- |
| `der.png` | DER final (6 entidades, notação pé de galinha) |
| `der.drawio` | Arquivo editável do DER no draw.io |
| `esquema.md` | Esquema relacional, relacionamentos e normalização |
| `01_criacao.sql` | `CREATE TABLE` na ordem de dependência, com PK, FK, `UNIQUE` e `CHECK` |
| `02_carga.sql` | `INSERT` dos dados de teste em todas as tabelas |
| `03_consultas.sql` | 7 consultas comentadas, cada uma com a pergunta de negócio e o resultado |

---

## 📁 Estrutura de Arquivos

```text
landingPageAprovaCast/
├── app.py              # Servidor Flask e rotas da API
├── requirements.txt    # Dependências Python
├── index.html          # Estrutura da landing page
├── style.css           # Estilos e responsividade
├── script.js           # Lógica do front-end e chamadas à API
├── .gitignore          # Ignora .env e arquivos temporários
├── README.md           # Documentação
└── banco/              # Artefatos de Banco de Dados
    ├── der.png
    ├── der.drawio
    ├── esquema.md
    ├── 01_criacao.sql
    ├── 02_carga.sql
    └── 03_consultas.sql
```

---

## 🛠️ Como Executar

1. Clonar o repositório:
```bash
git clone https://github.com/R4MBR4/landingPageAprovaCast.git
cd landingPageAprovaCast
```

2. No PostgreSQL (psql ou pgAdmin), no banco `aprovacast_db`, executar:
```sql
\i 'banco/01_criacao.sql'
\i 'banco/02_carga.sql'
```

3. Criar o arquivo `.env` na raiz:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=aprovacast_db
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui
GEMINI_API_KEY=sua_chave_aqui
```

4. Instalar as dependências e iniciar:
```bash
pip install -r requirements.txt
python app.py
```
Acesse **http://localhost:5000**.

---

## ✨ Funcionalidades

1. **Vitrine de planos:** planos e recursos lidos das tabelas `plano`, `plano_recurso` e `recurso` (`GET /api/planos`).
2. **Formulário de inscrição:** grava nas tabelas `cliente` e `inscricao` (`POST /api/inscricao`) e bloqueia inscrição repetida no mesmo plano.
3. **Chatbot com IA:** `POST /api/chat` chama o Gemini pelo servidor e grava a conversa na tabela `mensagem`.
4. **Modo de contingência:** respostas locais por palavras-chave se o servidor ou a IA falharem.
5. **Navegação:** 4 menus com âncoras (`#sobre`, `#planos`, `#contato`, `#chatbot`).

---

## 📝 Licença
Projeto acadêmico — AV3 Interdisciplinar PIT (2026).