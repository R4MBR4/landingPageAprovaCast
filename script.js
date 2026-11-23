// =============================================================================
// PROJETO FINAL AV3 - DESENVOLVIMENTO WEB PARA I.A. & BANCO DE DADOS
// PLATAFORMA: AprovaCast - Integração Full-Stack (Flask + PostgreSQL + IA)
// =============================================================================

// =============================================================================
// 1. CARREGAMENTO DOS PLANOS DO BANCO DE DADOS POSTGRESQL (Requisito do Edital)
// =============================================================================
const ICONES_PLANOS = ["🎧", "⚖️", "🏛️", "🤖"];

// Preenche a lista "Plano de Interesse" do formulário com os planos do banco
function atualizarOpcoesDoFormulario(planos) {
    const selectPlano = document.getElementById("plano");
    if (!selectPlano) return;

    selectPlano.innerHTML = '<option value="">Selecione um plano...</option>';
    planos.forEach(plano => {
        const preco = plano.preco === 0
            ? "Gratuito"
            : `R$ ${plano.preco.toFixed(2).replace(".", ",")}/mês`;
        const opcao = document.createElement("option");
        opcao.value = plano.id_plano;
        opcao.textContent = `${plano.nome} (${preco})`;
        selectPlano.appendChild(opcao);
    });
}

async function carregarPlanosDoBanco() {
    const container = document.getElementById("planosContainer");
    if (!container) return;

    try {
        const resposta = await fetch("/api/planos");
        if (!resposta.ok) throw new Error("Erro ao consultar a API de planos");

        const planos = await resposta.json();

        // Se o banco retornou os planos, renderiza dinamicamente
        if (planos && planos.length > 0) {
            container.innerHTML = ""; // Limpa o container

            planos.forEach((plano, indice) => {
                const card = document.createElement("div");
                card.className = "plano";

                const precoFormatado = plano.preco === 0 
                    ? "Gratuito" 
                    : `R$ ${plano.preco.toFixed(2).replace(".", ",")} /mês`;

                // Recursos do plano vêm da tabela associativa plano_recurso (N:N)
                const listaRecursos = (plano.recursos || [])
                    .map(recurso => `<li>${recurso}</li>`)
                    .join("");

                card.innerHTML = `
                    <div class="plano-icone">${ICONES_PLANOS[indice] || "🎧"}</div>
                    <h3>${plano.nome}</h3>
                    <p>${plano.descricao || ""}</p>
                    <ul class="plano-recursos">${listaRecursos}</ul>
                    <strong>${precoFormatado}</strong>
                `;
                container.appendChild(card);
            });

            atualizarOpcoesDoFormulario(planos);
            console.log("✅ Planos carregados do PostgreSQL com sucesso!");
        }
    } catch (erro) {
        console.warn("⚠️ Usando fallback dos planos estáticos:", erro);
    }
}

// =============================================================================
// 2. GRAVAÇÃO DO FORMULÁRIO NO BANCO DE DADOS POSTGRESQL (Requisito do Edital)
// =============================================================================
const formInscricao = document.getElementById("formInscricao");
const mensagemFeedback = document.getElementById("mensagemFeedback");

if (formInscricao) {
    formInscricao.addEventListener("submit", async function (evento) {
        evento.preventDefault();

        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim();
        const idPlano = document.getElementById("plano").value;
        const botaoSubmit = formInscricao.querySelector("button[type='submit']");

        if (!nome || !email || !idPlano) {
            exibirFeedback("Preencha todos os campos obrigatórios!", false);
            return;
        }

        // Feedback de carregamento
        const textoOriginalBotao = botaoSubmit.innerText;
        botaoSubmit.disabled = true;
        botaoSubmit.innerText = "Cadastrando no banco...";

        try {
            const resposta = await fetch("/api/inscricao", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome, email, id_plano: Number(idPlano) })
            });

            const dados = await resposta.json();

            if (resposta.ok) {
                exibirFeedback("🎉 " + dados.mensagem, true);
                formInscricao.reset();
            } else {
                exibirFeedback("⚠️ " + (dados.erro || "Não foi possível concluir o cadastro."), false);
            }
        } catch (erro) {
            console.error("Erro na requisição de cadastro:", erro);
            exibirFeedback("❌ Erro de comunicação com o servidor. Tente novamente.", false);
        } finally {
            botaoSubmit.disabled = false;
            botaoSubmit.innerText = textoOriginalBotao;
        }
    });
}

function exibirFeedback(mensagem, sucesso) {
    if (!mensagemFeedback) return;
    mensagemFeedback.innerText = mensagem;
    mensagemFeedback.style.display = "block";
    mensagemFeedback.style.backgroundColor = sucesso ? "#dcfce7" : "#fee2e2";
    mensagemFeedback.style.color = sucesso ? "#166534" : "#991b1b";
    mensagemFeedback.style.border = sucesso ? "1px solid #86efac" : "1px solid #fca5a5";

    setTimeout(() => {
        mensagemFeedback.style.display = "none";
    }, 6000);
}

// =============================================================================
// 3. CHATBOT COM INTELIGÊNCIA ARTIFICIAL (Protegido via API Flask)
// =============================================================================
const campoMensagem = document.getElementById("mensagem");
const botaoEnviar = document.getElementById("enviarMensagem");
const areaResposta = document.getElementById("resposta");

// Fallback local caso o servidor ou a API fiquem offline
// Verifica se o texto contém a palavra inteira (evita achar "oi" dentro de "depois")
function temPalavra(texto, palavra) {
    const padrao = new RegExp(`(^|[^\\p{L}])${palavra}([^\\p{L}]|$)`, "u");
    return padrao.test(texto);
}

function analisarTextoLocal(texto) {
    if (temPalavra(texto, "oi") || temPalavra(texto, "olá") || temPalavra(texto, "ola")) {
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

async function processarEnvio() {
    let textoOriginal = campoMensagem.value;
    let textoTratado = textoOriginal.trim().toLowerCase();

    if (textoTratado === "") {
        areaResposta.innerText = "⚠️ Digite alguma coisa antes de enviar!";
        return;
    }

    areaResposta.innerText = "Pensando... 🤖💬";
    campoMensagem.value = "";

    try {
        const resposta = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mensagem: textoOriginal.trim() })
        });

        if (!resposta.ok) throw new Error("Erro na resposta da API");

        const dados = await resposta.json();
        // Remove marcações de Markdown (**negrito**) que a IA às vezes devolve
        const textoIA = (dados.resposta || "").replace(/\*\*/g, "").replace(/^\s*[*-]\s+/gm, "• ");
        areaResposta.innerText = textoIA || analisarTextoLocal(textoTratado);
    } catch (erro) {
        console.warn("Modo contingência ativado (fallback local):", erro);
        areaResposta.innerText = analisarTextoLocal(textoTratado);
    }

    campoMensagem.focus();
}

if (botaoEnviar) botaoEnviar.addEventListener("click", processarEnvio);

if (campoMensagem) {
    campoMensagem.addEventListener("keydown", function (evento) {
        if (evento.key === "Enter") {
            evento.preventDefault();
            processarEnvio();
        }
    });
}

// Inicializa o carregamento dos dados do PostgreSQL ao abrir a página
window.addEventListener("DOMContentLoaded", () => {
    carregarPlanosDoBanco();
});