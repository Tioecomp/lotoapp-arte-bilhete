import { useState } from 'react';
import { Share2, Download, AlertTriangle, RefreshCw, Camera } from 'lucide-react';

type ResultViewProps = {
    imageUrl?: string;
    onReset: () => void;
};

export function ResultView({ imageUrl, onReset }: ResultViewProps) {
    const [isCorrectionOpen, setIsCorrectionOpen] = useState(false);

    return (
        <div className="animate-fade-in relative pb-10">
            <div className="bg-[#00e676]/10 border border-[#00e676]/20 text-[#00e676] text-center p-3 rounded-xl font-bold text-sm mb-4 shadow-[0_4px_20px_rgba(0,230,118,0.15)] flex items-center justify-center gap-2">
                <span className="text-lg">✨</span> Arte gerada com sucesso!
            </div>

            {/* Art Preview */}
            <div className="rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.5)] mb-4 bg-black min-h-[300px] flex items-center justify-center">
                {imageUrl ? (
                    <img src={imageUrl} alt="Arte Gerada" className="w-full h-auto block" />
                ) : (
                    <div className="text-white/50 text-sm">Imagem não disponível</div>
                )}
            </div>

            {/* Primary Actions */}
            <button className="w-full p-[17px] bg-gradient-to-br from-[#25D366] to-[#1DA851] text-white rounded-2xl font-['Inter',sans-serif] text-[15px] font-extrabold flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(37,211,102,0.25)] mb-2.5 transition-transform active:scale-95">
                <Share2 size={18} fill="currentColor" strokeWidth={1} />
                COMPARTILHAR NO WHATSAPP
            </button>

            <button className="w-full p-[17px] bg-gradient-to-br from-[#007aff] to-[#0056cc] text-white rounded-2xl font-['Inter',sans-serif] text-[15px] font-extrabold flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(0,122,255,0.25)] mb-4 transition-transform active:scale-95">
                <Download size={18} />
                BAIXAR ARTE
            </button>

            {/* Correction Panel Toggle */}
            <button
                onClick={() => setIsCorrectionOpen(!isCorrectionOpen)}
                className="w-full p-4 bg-transparent border border-[#1e2f4a] text-[#7b93b8] rounded-2xl font-['Inter',sans-serif] text-[13px] font-semibold flex items-center justify-center gap-2 mb-2 transition-colors hover:border-[#f5a623] hover:text-[#f5a623]"
            >
                <AlertTriangle size={16} className={isCorrectionOpen ? "text-[#f5a623]" : ""} />
                A arte saiu errada? Corrigir dados
            </button>

            {/* Collapsible Correction Form */}
            {isCorrectionOpen && (
                <div className="bg-[#111e35] border border-[#1e2f4a] p-5 rounded-2xl mt-2 mb-4 animate-fade-in">
                    <div className="text-[#f5a623] font-bold text-sm mb-4 flex items-center gap-2 pb-3 border-b border-[#1e2f4a]">
                        <span>✏️ Corrija os dados e regere</span>
                    </div>

                    <div className="space-y-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#7b93b8] flex items-center gap-2 uppercase tracking-wide">
                                Loteria
                                <span className="bg-[#00c853]/15 text-[#00c853] text-[9px] px-2 py-0.5 rounded-full font-bold">IA</span>
                            </label>
                            <select className="w-full p-3.5 bg-[#0a1628] border border-[#1e2f4a] rounded-xl text-[#e8f0fe] font-['Source_Sans_3',sans-serif] text-[15px] outline-none focus:border-[#00e676] appearance-none">
                                <option value="LOTOFACIL">Lotofácil</option>
                                <option value="MEGA-SENA">Mega-Sena</option>
                                <option value="QUINA">Quina</option>
                                <option value="+MILIONARIA">+Milionária</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#7b93b8] flex items-center gap-2 uppercase tracking-wide">
                                Jogos
                            </label>
                            <select className="w-full p-3.5 bg-[#0a1628] border border-[#1e2f4a] rounded-xl text-[#e8f0fe] font-['Source_Sans_3',sans-serif] text-[15px] outline-none appearance-none">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                    <option key={n} value={n}>{n.toString().padStart(2, '0')} Jogo{n > 1 ? 's' : ''}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#7b93b8] flex items-center gap-2 uppercase tracking-wide">
                                Dezenas por Jogo
                            </label>
                            <select className="w-full p-3.5 bg-[#0a1628] border border-[#1e2f4a] rounded-xl text-[#e8f0fe] font-['Source_Sans_3',sans-serif] text-[15px] outline-none appearance-none">
                                <option>Automático</option>
                                {/* Dynamically populated in future */}
                            </select>
                        </div>

                        <button className="w-full p-4 mt-2 bg-gradient-to-br from-[#00e676] to-[#00c853] text-[#0a1628] rounded-xl font-['Inter',sans-serif] font-bold flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(0,0,0,0.15)] active:scale-95 transition-transform">
                            <RefreshCw size={16} /> REGERAR ARTE
                        </button>
                    </div>
                </div>
            )}

            {/* New Flow */}
            <button
                onClick={onReset}
                className="w-full p-4 bg-transparent border border-[#1e2f4a] text-[#e8f0fe] rounded-2xl font-['Inter',sans-serif] text-[15px] font-semibold flex items-center justify-center gap-2 transition-colors active:bg-[#1e2f4a] mt-4"
            >
                <Camera size={18} /> Novo Bolão
            </button>

        </div>
    );
}
