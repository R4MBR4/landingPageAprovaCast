// ==========================================
// AprovaCast - Chatbot com IA (OpenRouter) e Formulário
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // ---------- Elementos do Chatbot ----------
    const respostaEl = document.getElementById('resposta');
    const mensagemEl = document.getElementById('mensagem');
    const enviarBtn = document.getElementById('enviarMensagem');

    // =====================================================
    // CONFIGURAÇÃO DA IA (OpenRouter)
    // 1. Crie uma conta em https://openrouter.ai
    // 2. Gere uma chave em https://openrouter.ai/keys
    // 3. Cole a chave abaixo entre as aspas simples
    // =====================================================
    const OPENROUTER_API_KEY = 'COLE_SUA_CHAVE_OPENROUTER_AQUI';
    const MODEL = 'openrouter/free'; // roteador de modelos gratuitos do OpenRouter

    // Persona do assistente
    const PERSONA =
        'Você é o AprovaCast IA, assistente virtual da plataforma AprovaCast, ' +
        'que vende cursos em áudio para concursos e vestibulares. ' +
        'Responda de forma curta, amigável e em português do Brasil. ' +
        'Foque em planos, matérias, funcionalidades da plataforma e suporte. ' +
        'Não responda sobre assuntos fora do contexto do AprovaCast.';

    // Respostas locais (fallback caso a API falhe)
    const respostasLocais = [
        { chave: ['plano', 'preço', 'preco', 'valor', 'assinatura'], texto: 'Temos 3 planos: Starter (R$ 19,90/mês), Pro (R$ 39,90/mês) e Premium (R$ 69,90/mês). O Pro é o mais popular! Qual deles te interessa?' },
        { chave: ['starter'], texto: 'O plano Starter custa R$ 19,90/mês e dá acesso a 50 aulas em áudio, resumos de editais e player offline.' },
        { chave: ['pro'], texto: 'O plano Pro custa R$ 39,90/mês: aulas ilimitadas, resumos + legislação narrada, player offline e suporte prioritário.' },
        { chave: ['premium'], texto: 'O plano Premium custa R$ 69,90/mês e inclui tudo do Pro + mentoria com IA personalizada, simulados em áudio e certificado.' },
        { chave: ['audio', 'aula', 'estudar', 'ouvir'], texto: 'O AprovaCast transforma editais em aulas em áudio de alta fixação para você estudar no trânsito, academia ou trabalho.' },
        { chave: ['ia', 'inteligência', 'inteligencia', 'assistente'], texto: 'Nossa IA gera e revisa resumos, além de oferecer um assistente virtual (eu mesmo!) para tirar dúvidas em tempo real.' },
        { chave: ['contato', 'suporte', 'ajuda'], texto: 'Você pode falar com a gente pela seção Contato no final da página ou perguntar aqui mesmo.' },
        { chave: ['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite'], texto: 'Olá! 👋 Sou o AprovaCast IA. Como posso ajudar você hoje?' }
    ];

    function respostaLocal(pergunta) {
        const p = pergunta.toLowerCase();
        for (const item of respostasLocais) {
            if (item.chave.some(k => p.includes(k))) return item.texto;
        }
        return 'Não tenho uma resposta pronta para isso, mas posso ajudar com planos, aulas em áudio e funcionalidades. Tente reformular sua pergunta!';
    }

    function adicionarMensagem(texto, tipo) {
        const div = document.createElement('div');
        div.className = 'chat-msg chat-' + tipo;
        div.textContent = texto;
        respostaEl.appendChild(div);
        respostaEl.scrollTop = respostaEl.scrollHeight;
    }

    async function consultarIA(pergunta) {
        if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY.includes('COLE_SUA_CHAVE')) {
            return respostaLocal(pergunta);
        }
        try {
            const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + OPENROUTER_API_KEY,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'AprovaCast IA'
                },
                body: JSON.stringify({
                    model: MODEL,
                    messages: [
                        { role: 'system', content: PERSONA },
                        { role: 'user', content: pergunta }
                    ]
                })
            });
            if (!resp.ok) throw new Error('HTTP ' + resp.status);
            const data = await resp.json();
            const texto = data.choices && data.choices[0] && data.choices[0].message
                ? data.choices[0].message.content
                : '';
            return (texto || '').trim() || respostaLocal(pergunta);
        } catch (e) {
            return respostaLocal(pergunta);
        }
    }

    async function enviarPergunta() {
        const pergunta = mensagemEl.value.trim();
        if (!pergunta) {
            adicionarMensagem('Por favor, digite sua dúvida antes de enviar.', 'bot');
            return;
        }
        adicionarMensagem(pergunta, 'user');
        mensagemEl.value = '';
        const digitando = document.createElement('div');
        digitando.className = 'chat-msg chat-bot chat-digitando';
        digitando.textContent = 'Digitando...';
        respostaEl.appendChild(digitando);
        respostaEl.scrollTop = respostaEl.scrollHeight;

        const resposta = await consultarIA(pergunta);
        if (digitando.parentNode) digitando.parentNode.removeChild(digitando);
        adicionarMensagem(resposta, 'bot');
    }

    if (enviarBtn) {
        enviarBtn.addEventListener('click', enviarPergunta);
    }
    if (mensagemEl) {
        mensagemEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                enviarPergunta();
            }
        });
    }

    // ---------- Formulário de Contato ----------
    const form = document.getElementById('formContato');
    const statusEl = document.getElementById('formStatus');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const msg = document.getElementById('mensagemContato').value.trim();
            if (!nome || !email || !msg) {
                statusEl.textContent = 'Preencha os campos obrigatórios.';
                statusEl.className = 'form-status erro';
                return;
            }
            statusEl.textContent = 'Mensagem enviada com sucesso! Retornaremos em breve.';
            statusEl.className = 'form-status sucesso';
            form.reset();
        });
    }
});