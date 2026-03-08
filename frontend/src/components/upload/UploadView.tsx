import { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, Lightbulb, RefreshCw, Wand2 } from 'lucide-react';
import { CameraModal } from './CameraModal';

export function UploadView() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [useAutoCorrection, setUseAutoCorrection] = useState(true);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (file: File) => {
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setIsCameraOpen(false);
    };

    const handleRetake = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    return (
        <div className="animate-fade-in">
            <CameraModal
                isOpen={isCameraOpen}
                onClose={() => setIsCameraOpen(false)}
                onCapture={handleFileSelect}
            />

            {/* Upload Options or Preview */}
            {!previewUrl ? (
                <div className="grid grid-cols-2 gap-3.5 mb-3.5">
                    <button
                        onClick={() => setIsCameraOpen(true)}
                        className="bg-[#111e35] border border-[#1e2f4a] rounded-xl p-5 flex flex-col items-center justify-center gap-2 transition-transform active:scale-95"
                    >
                        <Camera className="text-[#00c853]" size={32} />
                        <span className="text-[#e8f0fe] font-semibold text-[13px]">Abrir câmera</span>
                    </button>

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-[#111e35] border border-[#1e2f4a] rounded-xl p-5 flex flex-col items-center justify-center gap-2 transition-transform active:scale-95 relative overflow-hidden"
                    >
                        <ImageIcon className="text-[#7b93b8]" size={32} />
                        <span className="text-[#e8f0fe] font-semibold text-[13px]">Galeria / arquivo</span>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept="image/*"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    handleFileSelect(e.target.files[0]);
                                }
                            }}
                        />
                    </button>
                </div>
            ) : (
                <div className="rounded-[14px] overflow-hidden bg-black mb-3.5 relative">
                    <img src={previewUrl} alt="Preview" className="w-full block max-h-[300px] object-contain opacity-85" />
                    <div className="absolute top-3 left-3 bg-[#0a1628]/80 text-[#00e676] px-3 py-1 pb-1.5 rounded-full text-[11px] font-bold border border-[#00e676]/30 flex items-center gap-1 backdrop-blur-sm">
                        ✓ Foto carregada
                    </div>
                    <button
                        onClick={handleRetake}
                        className="absolute top-3 right-3 bg-[#0a1628]/80 text-white px-3 py-1 pb-1.5 rounded-full text-[11px] font-bold border border-white/20 flex items-center gap-1.5 backdrop-blur-sm hover:bg-[#1e2f4a]"
                    >
                        <RefreshCw size={12} />
                        Trocar
                    </button>
                </div>
            )}

            {/* Tip */}
            <div className="bg-[#111e35] border border-[#1e2f4a] rounded-[10px] p-2.5 px-3.5 text-xs text-[#7b93b8] mb-3.5 flex items-start gap-2">
                <Lightbulb className="text-yellow-500 shrink-0 mt-[1px]" size={14} />
                <span>Centralize o bilhete na foto com boa iluminação. Evite cortar as bordas.</span>
            </div>

            {/* Filter Toggle */}
            <div className="bg-[#111e35] border border-[#1e2f4a] rounded-[10px] p-3.5 mb-5 flex items-center">
                <label className="flex items-center gap-2.5 cursor-pointer w-full">
                    <input
                        type="checkbox"
                        className="hidden"
                        checked={useAutoCorrection}
                        onChange={(e) => setUseAutoCorrection(e.target.checked)}
                    />
                    <div className={`w-10 h-[22px] rounded-full p-[2px] transition-colors ${useAutoCorrection ? 'bg-[#00c853]' : 'bg-[#1e2f4a]'} flex relative shadow-inner`}>
                        <div className={`bg-white w-[18px] h-[18px] rounded-full shadow transition-transform ${useAutoCorrection ? 'translate-x-[18px]' : 'translate-x-0'}`}></div>
                    </div>
                    <span className="text-[13px] text-[#e8f0fe]">Correção automática de imagem</span>
                </label>
            </div>

            <button
                disabled={!selectedFile}
                className={`w-full p-[17px] rounded-[14px] font-['Inter',sans-serif] text-[15px] font-extrabold flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_rgba(0,0,0,0.15)]
          ${selectedFile
                        ? 'bg-gradient-to-br from-[#00e676] to-[#00c853] text-[#0a1628] hover:shadow-[0_6px_20px_rgba(0,230,118,0.3)] active:scale-[0.98]'
                        : 'bg-[#1e2f4a] text-[#7b93b8] opacity-60 cursor-not-allowed'
                    }
        `}
            >
                <Wand2 size={18} />
                CRIAR ARTE DO BILHETE
            </button>
        </div>
    );
}
