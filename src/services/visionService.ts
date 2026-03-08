import { OpenAI } from 'openai';
import { PROMPT_LEITURA, TABELA_PRECOS } from './aiConfig';
import dotenv from 'dotenv';

dotenv.config();

// Interfaces
export interface VisionResult {
    sucesso: boolean;
    dados?: any;
    erro?: string;
    detalhes?: string;
    ia_usada?: string;
}

// Configura o cliente OpenAI para apontar para o OpenRouter
const openRouter = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY || '',
    defaultHeaders: {
        'HTTP-Referer': 'https://lotoapp.com.br', // Opcional, para o painel do OpenRouter
        'X-Title': 'LotoApp', // Opcional
    }
});

export const identificarBilhete = async (base64Image: string, tenantConfig?: any): Promise<VisionResult> => {
    let resultado: VisionResult = { sucesso: false };
    const base64Clean = base64Image.replace(/^data:image\/[a-z]+;base64,/, '');

    if (!process.env.OPENROUTER_API_KEY) {
        return { sucesso: false, erro: 'Chave da API do OpenRouter não configurada no servidor (OPENROUTER_API_KEY).' };
    }

    try {
        // 1. Tenta Claude 3 Haiku via OpenRouter
        console.log('Tentando Claude 3 Haiku (OpenRouter)...');
        const respostaClaude = await chamarOpenRouter('anthropic/claude-3-haiku', base64Clean);
        if (respostaClaude) {
            resultado = processarRespostaIA(respostaClaude, base64Clean);
            resultado.ia_usada = 'Claude 3 Haiku (OpenRouter)';
            if (resultado.sucesso) return resultado;
        }

        // 2. Fallback Gemini Flash via OpenRouter
        if (!resultado.sucesso) {
            console.log('Fallback: Tentando Gemini Flash (OpenRouter)...');
            const respostaGemini = await chamarOpenRouter('google/gemini-flash-1.5', base64Clean);
            if (respostaGemini) {
                resultado = processarRespostaIA(respostaGemini, base64Clean);
                resultado.ia_usada = 'Gemini Flash (OpenRouter)';
                if (resultado.sucesso) return resultado;
            }
        }

        // 3. Fallback GPT-4o-mini via OpenRouter
        if (!resultado.sucesso) {
            console.log('Fallback: Tentando GPT-4o-mini (OpenRouter)...');
            const respostaGpt = await chamarOpenRouter('openai/gpt-4o-mini', base64Clean);
            if (respostaGpt) {
                resultado = processarRespostaIA(respostaGpt, base64Clean);
                resultado.ia_usada = 'GPT-4o-mini (OpenRouter)';
                if (resultado.sucesso) return resultado;
            }
        }

        return resultado;

    } catch (error: any) {
        console.error('Erro na identificação do bilhete:', error);
        return { sucesso: false, erro: 'Falha sistêmica na visão computacional', detalhes: error.message };
    }
};

// ============================================================================
// Chamadas para as APIs
// ============================================================================

async function chamarOpenRouter(modelId: string, base64Image: string): Promise<string | null> {
    try {
        const response = await openRouter.chat.completions.create({
            model: modelId,
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: PROMPT_LEITURA },
                        { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
                    ]
                }
            ],
            // Apenas OpenAI e alguns modelos suportam JSON Mode nativamente no OpenRouter, 
            // mas o nosso pre-processamento de regex lida bem com Markdown.
        });
        return response.choices[0]?.message?.content || null;
    } catch (e) {
        console.error(`Erro no OpenRouter (${modelId}):`, e);
        return null;
    }
}

// ============================================================================
// Pós-Processamento
// ============================================================================

function processarRespostaIA(textoIA: string, base64Image: string): VisionResult {
    try {
        const jsonStr = textoIA.replace(/```json/g, '').replace(/```/g, '').trim();
        const raw = JSON.parse(jsonStr);

        if (raw.eh_bilhete_loteria === false) {
            return { sucesso: false, erro: 'A imagem não parece ser um bilhete válido da Caixa.' };
        }

        const dadosProcessados = posProcessarLeitura(raw);

        return { sucesso: true, dados: dadosProcessados };
    } catch (e: any) {
        console.error('Erro no parse do JSON da IA:', e, textoIA);
        return { sucesso: false, erro: 'IA retornou formato inválido', detalhes: e.message };
    }
}

function posProcessarLeitura(raw: any): any {
    // Lógica de inferência de jogos e valores da tabela de preços
    let valorCota = raw.valor_cota;
    let totalCotas = raw.total_cotas;
    let qtdJogos = raw.qtd_jogos || (raw.jogos ? raw.jogos.length : 1);
    let loteria = (raw.loteria || '').toUpperCase();

    // Se tem os 3, podemos inferir pelas dezenas da tabela
    if (valorCota && totalCotas && qtdJogos && loteria) {
        const precoPorJogo = (valorCota * totalCotas) / qtdJogos;
        const precoFormatado = precoPorJogo.toFixed(2);

        if (TABELA_PRECOS[loteria] && TABELA_PRECOS[loteria][precoFormatado]) {
            const configTabela = TABELA_PRECOS[loteria][precoFormatado];

            // Aplica para todos os jogos se faltar info
            if (raw.jogos && raw.jogos.length > 0) {
                raw.jogos.forEach((j: any) => {
                    j.total = configTabela.dezenas;
                    if (configTabela.trevos) j.trevos = configTabela.trevos;
                });
            }
        }
    }

    // Calcular moda de dezenas para fallback geral
    if (raw.jogos && raw.jogos.length > 0) {
        const totais = raw.jogos.map((j: any) => j.total).filter((t: any) => t > 0);
        if (totais.length > 0) {
            const modaDezenas = calcularModa(totais);
            raw.dezenas_predominantes = modaDezenas;
            // Corrige jogos vazios
            raw.jogos.forEach((j: any) => {
                if (!j.total) j.total = modaDezenas;
            });
        }
    }

    return raw;
}

function calcularModa(arr: number[]): number {
    if (arr.length === 0) return 0;
    const contagem: Record<number, number> = {};
    let maxFreq = 0;
    let moda = arr[0];

    for (const num of arr) {
        contagem[num] = (contagem[num] || 0) + 1;
        if (contagem[num] > maxFreq) {
            maxFreq = contagem[num];
            moda = num;
        }
    }
    return moda;
}
