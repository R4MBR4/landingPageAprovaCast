# 🎧 AprovaCast - Landing Page & Chatbot com IA

Projeto Final desenvolvido para a **3ª Avaliação (AV3)** da disciplina de **Desenvolvimento Web para IA** no curso de **Tecnólogo em Inteligência Artificial** — **PIT (Piauí Instituto de Tecnologia)**.

---

## 👥 Equipe de Desenvolvimento
* **Ramon Braga Ramos:** Estrutura Base, Configuração do Repositório e Chatbot com IA
* **Juliana Jerônimo de Oliveira Sousa:** Vitrine de Planos & Recursos, CSS Grid e Estilização Visual
* **Rilley Alencar Carvalho:** Colaborador / Apoio de Interface (Front-end do Chatbot)

👨‍🏫 **Professor Orientador:** M.Sc. Tiago Martins Ribeiro  
📅 **Data de Entrega:** 08/11/2026  

---

## 📱 Sobre o AprovaCast
O **AprovaCast** é uma plataforma inovadora de aprendizado por áudio desenvolvida para concurseiros e vestibulandos. A landing page apresenta nossos planos de assinatura e conta com um **assistente virtual inteligente** para tirar dúvidas em tempo real sobre matérias, conteúdos e assinaturas.

---

## 🚀 Tecnologias Utilizadas
* **HTML5 Semântico:** Estruturação acessível com `<header>`, `<nav>`, `<section>` e `<footer>`.
* **CSS3 Moderno:** Flexbox, CSS Grid responsivo e efeitos de transição visual.
* **JavaScript ES6+:** Manipulação do DOM, tratamento de texto (`trim`, `toLowerCase`), eventos e validações com `return`.
* **Inteligência Artificial (OpenRouter):** Atendimento automatizado aos clientes.
* **Git & GitHub:** Versionamento com branches individuais e controle de commits.

---

## 🛠️ Como Executar o Projeto Localmente
1. Clone o repositório:
   ```bash
   git clone https://github.com/R4MBR4/landingPageAprovaCast.git
   ```
2. Abra o arquivo `index.html` no navegador ou com a extensão **Live Server** no VS Code.

---

## ✨ Principais Funcionalidades
* **Hero / Apresentação:** apresentação da plataforma e chamada para os planos.
* **Vitrine de Planos:** 4 cards (Básico, OAB & Jurídico, Concursos Federais, VIP IA) construídos com CSS Grid.
* **Formulário de Inscrição:** cadastro de nome, e-mail e carreira de interesse, com validação de campos obrigatórios.
* **Chatbot com IA:** assistente virtual "AprovaCast IA" que responde dúvidas sobre planos, matérias e funcionalidades.
* **Menu de navegação:** 4 links âncora funcionais (Sobre, Planos, Inscrição, Chatbot).
* **Responsividade:** layout adaptado para desktop e dispositivos móveis.

---

## 🤖 Integração com Inteligência Artificial
O chatbot utiliza a **API do OpenRouter** (modelos gratuitos via roteador `openrouter/free`) com a persona **"AprovaCast IA"**, restrita ao contexto da plataforma. O assistente responde de forma educada e objetiva sobre planos, aulas em áudio, funcionalidades e suporte. Caso a API esteja indisponível, um **fallback local** por palavras-chave mantém o atendimento funcionando offline.

---

## 📁 Estrutura de Pastas/Arquivos
```
landingPageAprovaCast/
├── index.html      # Estrutura da página (header, seções, rodapé)
├── style.css       # Estilização visual (planos, chatbot, formulário)
├── script.js       # Lógica do chatbot (IA) e do formulário
└── README.md       # Documentação do projeto
```

---

## 📝 Licença
Projeto acadêmico — AV3 (PIT). Todos os direitos reservados © 2026 AprovaCast.