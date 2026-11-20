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

# Carrega variáveis de ambiente do arquivo .env
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
# ROTA 2: LEITURA DOS PLANOS DO BANCO (Requisito do Edital)
# -----------------------------------------------------------------------------
@app.route("/api/planos", methods=["GET"])
def listar_planos():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT id_plano, nome, preco, descricao, icone FROM plano ORDER BY preco ASC;")
        planos = cur.fetchall()
        cur.close()
        conn.close()
        
        # Converte o Decimal do preco para float para serializar em JSON
        for plano in planos:
            plano["preco"] = float(plano["preco"])
            
        return jsonify(planos), 200
    except Exception as erro:
        print("Erro ao buscar planos:", erro)
        return jsonify({"erro": "Falha ao carregar planos do banco de dados."}), 500

# -----------------------------------------------------------------------------
# ROTA 3: GRAVAÇÃO DO FORMULÁRIO NO BANCO (Requisito do Edital)
# -----------------------------------------------------------------------------
@app.route("/api/inscricao", methods=["POST"])
def salvar_inscricao():
    dados = request.get_json()
    if not dados:
        return jsonify({"erro": "Dados inválidos."}), 400

    nome = dados.get("nome", "").strip()
    email = dados.get("email", "").strip().lower()
    carreira = dados.get("carreira", "").strip()

    if not nome or not email or not carreira:
        return jsonify({"erro": "Todos os campos são obrigatórios."}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            """
            INSERT INTO inscricao (nome, email, carreira)
            VALUES (%s, %s, %s)
            RETURNING id_inscricao;
            """,
            (nome, email, carreira)
        )
        id_gerado = cur.fetchone()["id_inscricao"]
        conn.commit()
        cur.close()
        conn.close()

        return jsonify({
            "sucesso": True,
            "mensagem": "Inscrição realizada com sucesso!",
            "id_inscricao": id_gerado
        }), 201

    except psycopg2.errors.UniqueViolation:
        return jsonify({"erro": "Este e-mail já está cadastrado na plataforma!"}), 409
    except Exception as erro:
        print("Erro ao gravar inscrição:", erro)
        return jsonify({"erro": "Erro interno ao salvar no banco."}), 500

# -----------------------------------------------------------------------------
# ROTA 4: ATENDIMENTO COM GOOGLE GEMINI (API REST Oficial com Blindagem)
# -----------------------------------------------------------------------------
PROMPT_SISTEMA = (
    "Você é o assistente virtual oficial da plataforma AprovaCast. "
    "Informações da plataforma: "
    "- O AprovaCast oferece resumos, legislação e aulas em áudio para concursos e OAB. "
    "- Nossos planos: "
    "  * Plano Básico: Gratuito (notícias de editais e podcasts introdutórios). "
    "  * Plano OAB & Jurídico: R$ 29,90/mês (leis narradas e súmulas STF/STJ). "
    "  * Plano Concursos Federais: R$ 49,90/mês (policiais, fiscais e tribunais). "
    "  * Plano AprovaCast VIP (IA): R$ 79,90/mês (acesso total + resumos com Gemini IA + flashcards). "
    "- Pagamento: PIX, cartão e boleto. Sem fidelidade (cancele quando quiser). "
    "Responda de forma educada, curta, prestativa e objetiva em português do Brasil, "
    "usando emojis (🎧, 📚, ⚖️, 🚀). Não responda sobre assuntos fora do contexto do AprovaCast."
)

@app.route("/api/chat", methods=["POST"])
def chat():
    dados = request.get_json()
    if not dados:
        return jsonify({"erro": "Mensagem não informada."}), 400

    mensagem = dados.get("mensagem", "").strip()
    if not mensagem:
        return jsonify({"erro": "A mensagem não pode estar vazia."}), 400

    gemini_key = os.getenv("GEMINI_API_KEY")
    if not gemini_key:
        return jsonify({"erro": "Chave do Gemini não configurada no servidor."}), 500

    try:
        # Chamada REST direta para a API Oficial do Google Gemini
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key={gemini_key}"
        
        payload = {
            "system_instruction": {
                "parts": [{"text": PROMPT_SISTEMA}]
            },
            "contents": [
                {
                    "parts": [{"text": mensagem}]
                }
            ]
        }

        resposta = requests.post(url, json=payload, headers={"Content-Type": "application/json"}, timeout=20)
        
        if resposta.status_code == 200:
            resultado = resposta.json()
            texto_ia = resultado["candidates"][0]["content"]["parts"][0]["text"].strip()
            return jsonify({"resposta": texto_ia}), 200
        else:
            print("Erro retornado pelo Gemini:", resposta.status_code, resposta.text)
            return jsonify({"erro": "Falha na comunicação com o Gemini."}), 502

    except Exception as erro:
        print("Erro no chat:", erro)
        return jsonify({"erro": "Erro de conexão com o serviço de IA."}), 500

# -----------------------------------------------------------------------------
# INICIALIZAÇÃO DO SERVIDOR
# -----------------------------------------------------------------------------
if __name__ == "__main__":
    print("🚀 Servidor AprovaCast com Google Gemini rodando em http://localhost:5000")
    app.run(debug=True, port=5000)