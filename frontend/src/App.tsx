import { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { ProgressSteps } from './components/layout/ProgressSteps';
import { UploadView } from './components/upload/UploadView';
import { ResultView } from './components/upload/ResultView';

function App() {
    const [currentStep, setCurrentStep] = useState<1 | 2>(1);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async (file: File, useAutoCorrection: boolean) => {
        setCurrentStep(2);
        setIsGenerating(true);

        // This is a placeholder for the actual API call
        console.log("Starting generation process with file:", file.name, "Auto-correction:", useAutoCorrection);
        setTimeout(() => {
            setIsGenerating(false);
            // We would set the generated image URL here from the response
        }, 3000);
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
                        imageUrl={!isGenerating ? "https://placehold.co/600x400/1e2f4a/e8f0fe?text=FOTO+PROCESSADA" : undefined}
                    />
                )}
            </div>
        </Layout>
    );
}

export default App;
