import { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { ProgressSteps } from './components/layout/ProgressSteps';
import { UploadView } from './components/upload/UploadView';
import { ResultView } from './components/upload/ResultView';

function App() {
    const [currentStep, setCurrentStep] = useState<1 | 2>(1);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

    const handleGenerate = async (file: File) => {
        setIsGenerating(true);
        setCurrentStep(2); // Muda para a tela de carregamento/resultado

        try {
            // Converter arquivo para Base64
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64Image = reader.result as string;

                // 1. Fase de Identificação (IA + Preços)
                console.log("Enviando para identificação...");
                const resIdentify = await fetch('http://localhost:3000/api/vision/identify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ base64Image })
                });

                if (!resIdentify.ok) {
                    throw new Error('Falha na identificação do bilhete.');
                }

                const identifyData = await resIdentify.json();
                console.log("Dados identificados:", identifyData.dados);

                // 2. Fase de Geração (Arte Canvas)
                const loteriaIdentificada = identifyData.dados.loteria || 'MEGA-SENA';

                // Mapeia os dados do JSON da IA para as chaves que o Canvas espera
                // Isso poderia ser mais sofisticado no backend, mas pro MVP vamos passar direto
                const mappedData: any = {
                    "CONCURSO": identifyData.dados.concurso || "0000",
                    "PREMIO": "R$ Consulte", // A IA pode não saber o prêmio de cabeça sem buscar na Caixa
                    "JOGOS": identifyData.dados.qtd_jogos?.toString() || "-",
                    "DEZENAS": identifyData.dados.dezenas_predominantes?.toString() || "-",
                    "PARTICIPANTES": identifyData.dados.total_cotas?.toString() || "-",
                    "VALOR_COTA": `R$ ${identifyData.dados.valor_cota?.toFixed(2).replace('.', ',') || "0,00"}`
                };

                // Trata exceção da Milionária
                if (loteriaIdentificada === "+MILIONARIA") {
                    mappedData["TREVOS"] = identifyData.dados.jogos?.[0]?.trevos?.toString() || "2";
                }

                console.log("Enviando para geração com dados:", mappedData);
                const resGenerate = await fetch('http://localhost:3000/api/vision/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        base64Image,
                        lottery: loteriaIdentificada,
                        data: mappedData
                    })
                });

                if (!resGenerate.ok) {
                    throw new Error('Falha na geração da arte.');
                }

                const generateData = await resGenerate.json();
                setGeneratedImageUrl(generateData.imageBase64);
                setIsGenerating(false);
            };

            reader.onerror = (error) => {
                console.error("Erro ao ler arquivo: ", error);
                setIsGenerating(false);
                alert("Erro ao processar imagem.");
            };

        } catch (error) {
            console.error(error);
            alert("Ocorreu um erro no servidor. Tente novamente.");
            setIsGenerating(false);
            setCurrentStep(1);
        }
    };

    return (
        <Layout>
            <div className="mb-6 -mt-5 -mx-4 bg-[#0a1628]">
                <ProgressSteps currentStep={currentStep} />
            </div>

            <div className="relative">
                {currentStep === 1 && <UploadView onGenerate={handleGenerate} />}
                {currentStep === 2 && (
                    <ResultView
                        onReset={() => setCurrentStep(1)}
                        imageUrl={!isGenerating && generatedImageUrl ? generatedImageUrl : undefined}
                    />
                )}
            </div>
        </Layout>
    );
}

export default App;
