import { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { ProgressSteps } from './components/layout/ProgressSteps';
import { UploadView } from './components/upload/UploadView';
import { ResultView } from './components/upload/ResultView';

function App() {
    const [currentStep, setCurrentStep] = useState<1 | 2>(1);

    return (
        <Layout>
            <div className="mb-6 -mt-5 -mx-4 bg-[#0a1628]">
                <ProgressSteps currentStep={currentStep} />
            </div>

            <div className="relative">
                {currentStep === 1 && <UploadView />}
                {currentStep === 2 && <ResultView onReset={() => setCurrentStep(1)} />}
            </div>
        </Layout>
    );
}

export default App;
