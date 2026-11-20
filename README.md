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

O **AprovaCast** é uma plataforma inovadora voltada a concurseiros e vestibulandos, oferecendo resumos, legislação e aulas narradas em áudio para estudos no trânsito, na academia ou no trabalho. A plataforma conta com vitrine de planos carregada dinamicamente do banco de dados, formulário de inscrição persistente e um **assistente virtual inteligente (AprovaCast IA)** com persona e contexto restritos.

---

## 🚀 Tecnologias Utilizadas

### Front-end:
* **HTML5 Semântico:** Estruturação acessível com `<header>`, `<nav>`, `<section>` e `<footer>`.
* **CSS3 Moderno:** Flexbox, CSS Grid responsivo (`auto-fit`) e variáveis visuais.
* **JavaScript ES6+:** Manipulação assíncrona do DOM (`fetch`, `async/await`), validação de dados e tratamento de strings (`trim`, `toLowerCase`).

### Back-end & Banco de Dados:
* **Python 3 & Flask:** API RESTful para fornecimento de planos, gravação de inscrições e proxy seguro de IA.
* **PostgreSQL 18:** Banco de dados relacional com integridade referencial, normalização (1FN, 2FN, 3FN), chave primária e estrangeira (`CASCADE`/`RESTRICT`).
* **Psycopg2:** Driver de conexão otimizado com `RealDictCursor`.

### Inteligência Artificial:
* **OpenRouter API:** Modelo gratuito com System Prompt restrito à persona do AprovaCast.
* **Mecanismo de Contingência:** Fallback inteligente local por palavras-chave em caso de falha de conexão.

---

## 📁 Estrutura de Arquivos do Projeto

```text
landingPageAprovaCast/
├── app.py                 # Servidor Back-end Flask e endpoints REST
├── requirements.txt       # Dependências Python do projeto
├── index.html             # Estrutura da Landing Page
├── style.css              # Folha de estilos unificada e responsiva
├── script.js              # Lógica do Front-end e integração assíncrona
├── .gitignore             # Proteção de credenciais e arquivos temporários
├── README.md              # Documentação oficial do projeto
└── banco/                 # Artefatos da disciplina de Banco de Dados
    ├── der.png            # Diagrama Entidade-Relacionamento (DER)
    ├── esquema.md         # Esquema relacional e análise de normalização
    ├── 01_criacao.sql     # Script DDL de criação das tabelas (com 1:N e N:N)
    ├── 02_carga.sql       # Script DML de carga dos dados de teste
    └── 03_consultas.sql   # 5 consultas analíticas com JOIN, COUNT, AVG e GROUP BY
```

---

## 🛠️ Como Executar o Projeto Localmente

### 1. Clonar o repositório
```bash
git clone https://github.com/R4MBR4/landingPageAprovaCast.git
cd landingPageAprovaCast
```

### 2. Configurar o Banco de Dados PostgreSQL
Execute os scripts da pasta `banco/` no seu terminal `psql` ou pgAdmin:
```sql
\i 'banco/01_criacao.sql'
\i 'banco/02_carga.sql'
```

### 3. Configurar as Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto com suas credenciais:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=aprovacast_db
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui
OPENROUTER_API_KEY=sua_chave_aqui
```

### 4. Instalar as Dependências e Iniciar o Servidor
```bash
pip install -r requirements.txt
python app.py
```
Acesse no seu navegador: **`http://localhost:5000`**

---

## ✨ Funcionalidades Implementadas

1. **Vitrine Dinâmica de Planos:** Dados lidos em tempo real da tabela `plano` via endpoint `GET /api/planos`.
2. **Formulário de Inscrição:** Gravação e persistência de dados de leads na tabela `inscricao` via `POST /api/inscricao`.
3. **Chatbot com IA Protegida:** Requisições enviadas ao endpoint `POST /api/chat`, blindando a chave da API no servidor.
4. **Navegação Fluida:** 4 âncoras no menu de cabeçalho (`#sobre`, `#planos`, `#contato`, `#chatbot`).

---

## 📝 Licença
Projeto acadêmico — AV3 Interdisciplinar PIT (2026).