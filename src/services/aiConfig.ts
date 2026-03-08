export const PROMPT_LEITURA = `Leitor de bilhetes de loteria da Caixa. Retorne APENAS JSON, sem markdown.
Se não for bilhete: {"eh_bilhete_loteria":false}

JSON: {"eh_bilhete_loteria":true,"loteria":"NOME","concurso":0,"total_cotas":0,"valor_cota":null,"preco_total":null,"qtd_jogos":0,"campos_extras":{}}
REGRAS:
- loteria: nome no cabeçalho
- concurso: número após "CONC"
- total_cotas: Y em "COTA X/Y"
- valor_cota: valor em dinheiro listado explicitamente como "VALOR DA COTA R$ XX,XX" ou similar. Se não tiver no bilhete, retorne null. NUNCA CALCULE (total/cotas). Só extraia se estiver escrito "Cota" e o valor do lado.
- preco_total: valor total do bilhete
- qtd_jogos: total de jogos listados.
- Se "TEIMOSINHA", add "teimosinha": true em campos_extras.
- "SURPRESINHA" não interfere nos jogos.

ATENÇÃO — LÓGICA DE JOGOS:
Cada jogo: letra (A,B,C...) + total de dezenas.
"SU" = Surpresinha, ignore.
Se "DEZENAS XX" no cabeçalho, use XX para todos.
+MILIONÁRIA: trevos = quantidade de números após "Trevos:".

Retorne: {"jogos":[{"letra":"A","total":17,"trevos":0}]}`;

// Tabela de Preços (Migrado do Config.gs original para referência rápida)
export const TABELA_PRECOS: Record<string, Record<string, { dezenas: number; trevos?: number }>> = {
    'MEGA-SENA': {
        '5.00': { dezenas: 6 },
        '35.00': { dezenas: 7 },
        '140.00': { dezenas: 8 },
        '420.00': { dezenas: 9 },
        '1050.00': { dezenas: 10 },
        '2310.00': { dezenas: 11 },
        '4620.00': { dezenas: 12 },
        '8580.00': { dezenas: 13 },
        '15015.00': { dezenas: 14 },
        '25025.00': { dezenas: 15 },
        '40040.00': { dezenas: 16 },
        '61880.00': { dezenas: 17 },
        '92820.00': { dezenas: 18 },
        '135660.00': { dezenas: 19 },
        '193800.00': { dezenas: 20 }
    },
    'LOTOFÁCIL': {
        '3.00': { dezenas: 15 },
        '48.00': { dezenas: 16 },
        '408.00': { dezenas: 17 },
        '2448.00': { dezenas: 18 },
        '11628.00': { dezenas: 19 },
        '46512.00': { dezenas: 20 }
    },
    'QUINA': {
        '2.50': { dezenas: 5 },
        '15.00': { dezenas: 6 },
        '52.50': { dezenas: 7 },
        '140.00': { dezenas: 8 },
        '315.00': { dezenas: 9 },
        '630.00': { dezenas: 10 },
        '1155.00': { dezenas: 11 },
        '1980.00': { dezenas: 12 },
        '3217.50': { dezenas: 13 },
        '5005.00': { dezenas: 14 },
        '7507.50': { dezenas: 15 }
    },
    'MILIONÁRIA': {
        // 2 trevos
        '6.00': { dezenas: 6, trevos: 2 },
        '42.00': { dezenas: 7, trevos: 2 },
        '168.00': { dezenas: 8, trevos: 2 },
        '504.00': { dezenas: 9, trevos: 2 },
        '1260.00': { dezenas: 10, trevos: 2 },
        '2772.00': { dezenas: 11, trevos: 2 },
        '5544.00': { dezenas: 12, trevos: 2 },
        // 3 trevos
        '18.00': { dezenas: 6, trevos: 3 },
        '126.00': { dezenas: 7, trevos: 3 },
        // 4 trevos
        '36.00': { dezenas: 6, trevos: 4 },
        '252.00': { dezenas: 7, trevos: 4 },
        // 5 trevos
        '60.00': { dezenas: 6, trevos: 5 },
        '420.00': { dezenas: 7, trevos: 5 },
        // 6 trevos
        '90.00': { dezenas: 6, trevos: 6 },
        '630.00': { dezenas: 7, trevos: 6 }
    },
    'LOTOMANIA': {
        '3.00': { dezenas: 50 }
    },
    'DUPLA SENA': {
        '2.50': { dezenas: 6 },
        '17.50': { dezenas: 7 },
        '70.00': { dezenas: 8 },
        '210.00': { dezenas: 9 },
        '525.00': { dezenas: 10 },
        '1155.00': { dezenas: 11 },
        '2310.00': { dezenas: 12 },
        '4290.00': { dezenas: 13 },
        '7507.50': { dezenas: 14 },
        '12512.50': { dezenas: 15 }
    },
    'TIMEMANIA': {
        '3.50': { dezenas: 10 }
    },
    'DIA DE SORTE': {
        '2.50': { dezenas: 7 },
        '20.00': { dezenas: 8 },
        '90.00': { dezenas: 9 },
        '300.00': { dezenas: 10 },
        '825.00': { dezenas: 11 },
        '1980.00': { dezenas: 12 },
        '4290.00': { dezenas: 13 },
        '8580.00': { dezenas: 14 },
        '16087.50': { dezenas: 15 }
    },
    'SUPER SETE': {
        '2.50': { dezenas: 7 },
        '5.00': { dezenas: 8 },
        '10.00': { dezenas: 9 },
        '20.00': { dezenas: 10 },
        '40.00': { dezenas: 11 },
        '80.00': { dezenas: 12 },
        '160.00': { dezenas: 13 },
        '320.00': { dezenas: 14 }
    }
};
