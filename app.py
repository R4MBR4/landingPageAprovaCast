# =============================================================================
# PROJETO FINAL INTERDISCIPLINAR - AV3 (PIT)
# BACK-END EM PYTHON (FLASK) COM POSTGRESQL E GOOGLE GEMINI
# Disciplinas: Desenvolvimento Web para IA & Banco de Dados
# =============================================================================

import os
import requests
import psycopg2
from psycopg2.extras import RealDictCursor
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

# Carrega as variáveis de ambiente do arquivo .env (senha do banco e chave da IA)
load_dotenv()

app = Flask(__name__, static_folder=".")
CORS(app)


# -----------------------------------------------------------------------------
# CONEXÃO COM O BANCO DE DADOS POSTGRESQL
# -----------------------------------------------------------------------------
def get_db_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=os.getenv("DB_PORT", "5432"),
        dbname=os.getenv("DB_NAME", "aprovacast_db"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD", ""),
        cursor_factory=RealDictCursor
    )


# -----------------------------------------------------------------------------
# ROTA 1: SERVIR A LANDING PAGE
# -----------------------------------------------------------------------------
@app.route("/")
def index():
    return send_from_directory(".", "index.html")


@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(".", path)


# -----------------------------------------------------------------------------
# ROTA 2: LEITURA DOS PLANOS E DOS RECURSOS DE CADA PLANO (tabelas plano,
# plano_recurso e recurso - relacionamento N:N)
# -----------------------------------------------------------------------------
@app.route("/api/planos", methods=["GET"])
def listar_planos():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT p.id_plano, p.nome, p.preco, p.descricao,
                   COALESCE(
                       ARRAY_AGG(r.nome ORDER BY r.nome)
                           FILTER (WHERE r.id_recurso IS NOT NULL),
                       '{}'
                   ) AS recursos
            FROM plano p
            LEFT JOIN plano_recurso pr ON pr.id_plano = p.id_plano
            LEFT JOIN recurso r        ON r.id_recurso = pr.id_recurso
            GROUP BY p.id_plano, p.nome, p.preco, p.descricao
            ORDER BY p.preco ASC;
        """)
        planos = cur.fetchall()
        cur.close()
        conn.close()

        # O PostgreSQL devolve NUMERIC como Decimal, que não é aceito em JSON
        for plano in planos:
            plano["preco"] = float(plano["preco"])

        return jsonify(planos), 200
    except Exception as erro:
        print("Erro ao buscar planos:", erro)
        return jsonify({"erro": "Falha ao carregar planos do banco de dados."}), 500


# -----------------------------------------------------------------------------
# ROTA 3: GRAVAÇÃO DO FORMULÁRIO (tabelas cliente e inscricao)
# O cliente é criado (ou atualizado, se o e-mail já existir) e a inscrição
# no plano escolhido é registrada com status 'pendente'.
# -----------------------------------------------------------------------------
@app.route("/api/inscricao", methods=["POST"])
def salvar_inscricao():
    dados = request.get_json(silent=True)
    if not dados:
        return jsonify({"erro": "Dados inválidos."}), 400

    nome = str(dados.get("nome", "")).strip()
    email = str(dados.get("email", "")).strip().lower()
    id_plano = dados.get("id_plano")

    if not nome or not email or not id_plano:
        return jsonify({"erro": "Todos os campos são obrigatórios."}), 400

    try:
        id_plano = int(id_plano)
    except (TypeError, ValueError):
        return jsonify({"erro": "Plano inválido."}), 400

    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # 1) Cliente: insere ou, se o e-mail já existir (UNIQUE), atualiza o nome
        cur.execute("""
            INSERT INTO cliente (nome, email)
            VALUES (%s, %s)
            ON CONFLICT (email) DO UPDATE SET nome = EXCLUDED.nome
            RETURNING id_cliente;
        """, (nome, email))
        id_cliente = cur.fetchone()["id_cliente"]

        # 2) Impede inscrição repetida do mesmo cliente no mesmo plano
        cur.execute("""
            SELECT 1 FROM inscricao
            WHERE id_cliente = %s AND id_plano = %s AND status <> 'cancelada';
        """, (id_cliente, id_plano))
        if cur.fetchone():
            conn.rollback()
            cur.close()
            conn.close()
            return jsonify({"erro": "Você já está inscrito neste plano!"}), 409

        # 3) Inscrição no plano escolhido
        cur.execute("""
            INSERT INTO inscricao (id_cliente, id_plano, status)
            VALUES (%s, %s, 'pendente')
            RETURNING id_inscricao;
        """, (id_cliente, id_plano))
        id_inscricao = cur.fetchone()["id_inscricao"]

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({
            "sucesso": True,
            "mensagem": "Inscrição realizada com sucesso! Bem-vindo ao AprovaCast.",
            "id_cliente": id_cliente,
            "id_inscricao": id_inscricao
        }), 201

    except psycopg2.errors.ForeignKeyViolation:
        if conn:
            conn.rollback()
            conn.close()
        return jsonify({"erro": "O plano escolhido não existe."}), 400
    except Exception as erro:
        if conn:
            conn.rollback()
            conn.close()
        print("Erro ao gravar inscrição:", erro)
        return jsonify({"erro": "Erro interno ao salvar no banco."}), 500


# -----------------------------------------------------------------------------
# ROTA 4: ATENDIMENTO COM IA (Google Gemini chamado pelo servidor)
# A chave fica no .env e nunca é enviada ao navegador.
# Cada pergunta e resposta é gravada na tabela mensagem.
# -----------------------------------------------------------------------------
PROMPT_SISTEMA = (
    "Você é o AprovaCast IA, assistente virtual oficial da plataforma AprovaCast. "
    "Informações da plataforma: "
    "- O AprovaCast oferece resumos, legislação e aulas em áudio para concursos e OAB. "
    "- Nossos planos: "
    "  * Plano Básico: Gratuito (notícias de editais e podcasts introdutórios). "
    "  * OAB & Jurídico: R$ 29,90/mês (legislação narrada e súmulas STF/STJ). "
    "  * Concursos Federais: R$ 49,90/mês (carreiras policiais, fiscais e administrativas). "
    "  * AprovaCast VIP (IA): R$ 79,90/mês (acesso total, resumos com IA e flashcards em áudio). "
    "- Pagamento: PIX, cartão e boleto. Sem fidelidade (cancele quando quiser). "
    "- Para se inscrever, o visitante usa o formulário da seção Inscrição Grátis. "
    "Responda em português do Brasil, de forma curta, educada e objetiva, "
    "usando emojis de estudo (🎧, 📚, ⚖️, 🚀) e sem formatação Markdown (não use asteriscos). "
    "REGRAS: responda SOMENTE sobre o AprovaCast. A perguntas de outros temas, recuse "
    "educadamente em uma frase e convide o usuário a perguntar sobre os planos e conteúdos."
)

MODELO_IA = "gemini-3.8-flash"


def registrar_mensagem(conteudo, resposta):
    """Grava a conversa na tabela mensagem. Uma falha aqui não derruba o chat."""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO mensagem (conteudo, resposta) VALUES (%s, %s);",
            (conteudo, resposta)
        )
        conn.commit()
        cur.close()
        conn.close()
    except Exception as erro:
        print("Aviso: não foi possível gravar a mensagem:", erro)


@app.route("/api/chat", methods=["POST"])
def chat():
    dados = request.get_json(silent=True) or {}
    mensagem = str(dados.get("mensagem", "")).strip()

    if not mensagem:
        return jsonify({"erro": "A mensagem não pode estar vazia."}), 400

    gemini_key = os.getenv("GEMINI_API_KEY")
    if not gemini_key:
        return jsonify({"erro": "Chave da IA não configurada no servidor."}), 500

    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{MODELO_IA}:generateContent"
        payload = {
            "system_instruction": {"parts": [{"text": PROMPT_SISTEMA}]},
            "contents": [{"parts": [{"text": mensagem}]}]
        }
        headers = {
            "Content-Type": "application/json",
            "x-goog-api-key": gemini_key   # chave enviada no cabeçalho, não na URL
        }

        resposta = requests.post(url, json=payload, headers=headers, timeout=20)

        if resposta.status_code == 200:
            resultado = resposta.json()
            texto_ia = resultado["candidates"][0]["content"]["parts"][0]["text"].strip()
            registrar_mensagem(mensagem, texto_ia)
            return jsonify({"resposta": texto_ia}), 200

        print("Erro retornado pelo Gemini:", resposta.status_code, resposta.text)
        return jsonify({"erro": "Falha na comunicação com a IA."}), 502

    except Exception as erro:
        print("Erro no chat:", erro)
        return jsonify({"erro": "Erro de conexão com o serviço de IA."}), 500


# -----------------------------------------------------------------------------
# INICIALIZAÇÃO DO SERVIDOR
# -----------------------------------------------------------------------------
if __name__ == "__main__":
    print("🚀 Servidor AprovaCast rodando em http://localhost:5000")
    app.run(debug=True, port=5000)