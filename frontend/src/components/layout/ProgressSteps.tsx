import React from 'react';

type ProgressStepsProps = {
    currentStep: 1 | 2;
};

export function ProgressSteps({ currentStep }: ProgressStepsProps) {
    return (
        <div className="px-5 pt-4 pb-0 bg-[#0a1628]">
            <div className="flex items-center">
                {/* Step 1 */}
                <div className="flex flex-col items-center gap-1 flex-1 relative after:content-[''] after:absolute after:top-[13px] after:left-1/2 after:right-[-50%] after:h-[2px] after:bg-[#1e2f4a] after:z-0">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow-md z-10 transition-colors ${currentStep >= 1 ? 'bg-[#00e676] text-[#0a1628] shadow-[#00e676]/30' : 'bg-[#1e2f4a] text-[#7b93b8]'}`}>
                        1
                    </div>
                    <div className={`text-[11px] font-semibold tracking-wide transition-colors ${currentStep >= 1 ? 'text-[#00e676]' : 'text-[#7b93b8]'}`}>
                        Foto
                    </div>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center gap-1 flex-1 relative z-10">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow-md z-10 transition-colors ${currentStep === 2 ? 'bg-[#00e676] text-[#0a1628] shadow-[#00e676]/30' : 'bg-[#1e2f4a] text-[#7b93b8]'}`}>
                        2
                    </div>
                    <div className={`text-[11px] font-semibold tracking-wide transition-colors ${currentStep === 2 ? 'text-[#00e676]' : 'text-[#7b93b8]'}`}>
                        Arte
                    </div>
                </div>
            </div>
        </div>
    );
}
