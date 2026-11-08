// =============================================================================
// PROJETO FINAL AV3 - DESENVOLVIMENTO WEB PARA I.A.
// ALUNO: Ramon Braga Ramos | PROFESSOR: M.Sc. Tiago Martins Ribeiro
// PLATAFORMA: AprovaCast - Atendimento Inteligente com Gemini IA
// =============================================================================

// 1. SELEÇÃO DOS ELEMENTOS DO DOM
const campoMensagem = document.getElementById("mensagem");
const botaoEnviar = document.getElementById("enviarMensagem");
const areaResposta = document.getElementById("resposta");

// 2. CONFIGURAÇÃO DA API DO GEMINI
// Caso tenha a chave do Google AI Studio, cole aqui. Se deixar vazio, ele roda no modo local seguro!
const GEMINI_API_KEY = ""; 

// Contexto oficial da plataforma AprovaCast para a IA
const PROMPT_SISTEMA = `Você é o assistente virtual da plataforma AprovaCast.
Informações da plataforma:
- O AprovaCast oferece resumos, legislação e aulas em áudio para concursos e OAB.
- Nossos planos:
  * Plano Básico: Gratuito (notícias de editais e podcasts introdutórios).
  * Plano OAB & Jurídico: R$ 29,90/mês (leis narradas e súmulas STF/STJ).
  * Plano Concursos Federais: R$ 49,90/mês (policiais, fiscais e tribunais).
  * Plano AprovaCast VIP (IA): R$ 79,90/mês (acesso total + resumos com Gemini IA + flashcards).
- Pagamento: PIX, cartão e boleto. Sem fidelidade (cancele quando quiser).
Responda de forma educada, curta, prestativa e objetiva com emojis (🎧, 📚, ⚖️, 🚀).`;

// 3. FUNÇÃO DE CHAMADA REST À API DO GEMINI
async function chamarGemini(pergunta) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const payload = {
        contents: [{
            parts: [{ text: `${PROMPT_SISTEMA}\n\nCliente: "${pergunta}"\nAssistente:` }]
        }]
    };

    const resposta = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    if (!resposta.ok) {
        throw new Error("Erro na comunicação com o Gemini");
    }

    const dados = await resposta.json();
    return dados.candidates[0].content.parts[0].text;
}

// 4. FALLBACK LOCAL (ATIVIDADE PRÁTICA 2 DO PROFESSOR)
// Garante respostas instantâneas para perguntas frequentes mesmo offline
function analisarTextoLocal(texto) {
    if (texto.includes("oi") || texto.includes("olá") || texto.includes("ola")) {
        return "Olá! 👋 Seja bem-vindo ao AprovaCast! Como posso te ajudar a acelerar sua aprovação hoje?";
    } else if (texto.includes("bom dia")) {
        return "Bom dia! ☀️ Pronto para revisar suas matérias em áudio hoje?";
    } else if (texto.includes("boa tarde")) {
        return "Boa tarde! ☕ Aproveite seu trajeto ou intervalo para estudar com nossos podcasts!";
    } else if (texto.includes("boa noite")) {
        return "Boa noite! 🌙 Uma sessão leve de áudio antes de dormir ajuda a fixar o conteúdo!";
    } else if (texto.includes("plano") || texto.includes("preço") || texto.includes("preco") || texto.includes("quanto custa") || texto.includes("valor")) {
        return "Nossos planos são: Básico (Gratuito), OAB (R$ 29,90/mês), Concursos Federais (R$ 49,90/mês) e VIP IA (R$ 79,90/mês)! 🎧";
    } else if (texto.includes("grátis") || texto.includes("gratis") || texto.includes("free")) {
        return "Sim! O nosso Plano Básico é 100% gratuito e já dá acesso a resumos diários de editais!";
    } else if (texto.includes("site") || texto.includes("projeto")) {
        return "Este site foi desenvolvido na disciplina de Desenvolvimento Web para I.A. no PIT!";
    } else if (texto.includes("oab") || texto.includes("direito")) {
        return "Nosso plano OAB & Jurídico custa R$ 29,90/mês com legislação seca narrada e jurisprudência em áudio!";
    } else if (texto.includes("ajuda") || texto.includes("suporte")) {
        return "Você pode perguntar sobre: 'planos', 'preços', 'OAB', 'grátis' ou saudações como 'bom dia'!";
    } else {
        return "Não entendi sua dúvida 😅. Tente perguntar sobre nossos planos, valores ou matérias disponíveis!";
    }
}

// 5. FUNÇÃO PRINCIPAL DE PROCESSAMENTO
async function processarEnvio() {
    // 1. Captura e tratamento do texto (trim remove vazios, toLowerCase padroniza)
    let textoOriginal = campoMensagem.value;
    let textoTratado = textoOriginal.trim().toLowerCase();

    // 2. Validação obrigatória de entrada vazia com return antecipado
    if (textoTratado === "") {
        areaResposta.innerText = "⚠️ Digite alguma coisa antes de enviar!";
        return; // Interrompe a execução
    }

    // 3. Feedback visual no chat
    areaResposta.innerText = "Pensando... 🤖💬";
    campoMensagem.value = "";

    try {
        if (GEMINI_API_KEY && GEMINI_API_KEY.trim() !== "") {
            let respostaGemini = await chamarGemini(textoTratado);
            console.log("Resposta Gemini IA:", respostaGemini);
            areaResposta.innerText = respostaGemini;
        } else {
            let respostaLocal = analisarTextoLocal(textoTratado);
            console.log("Resposta Local:", respostaLocal);
            areaResposta.innerText = respostaLocal;
        }
    } catch (erro) {
        console.warn("Modo contingência ativado:", erro);
        areaResposta.innerText = analisarTextoLocal(textoTratado);
    }

    campoMensagem.focus();
}

// 6. EVENTOS DE ENVIO (CLIQUE E TECLA ENTER)
botaoEnviar.addEventListener("click", processarEnvio);

campoMensagem.addEventListener("keydown", function(evento) {
    if (evento.key === "Enter") {
        processarEnvio();
    }
});