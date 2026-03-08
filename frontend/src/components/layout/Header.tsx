

export function Header() {
    return (
        <div className="flex items-center justify-between px-5 py-4 bg-[#0a1628] border-b border-[#1e2f4a]">
            <div className="flex items-center gap-3">
                {/* Placeholder Logo matching original dimensions roughly */}
                <div className="w-[100px] h-[35px] bg-[#111e35] rounded md flex items-center justify-center text-xs text-[#7b93b8]">Logo</div>
            </div>
            <div className="text-right">
                <div className="text-[#e8f0fe] font-bold text-lg leading-tight flex items-center justify-end gap-2">
                    Bolões
                    <span className="bg-[#00c853]/10 text-[#00c853] text-[9px] px-2 py-0.5 rounded-full tracking-wider font-bold">
                        IA
                    </span>
                </div>
                <div className="text-[#00c853] text-[10px] font-bold tracking-widest mt-0.5">
                    GERADOR DE ARTES
                </div>
            </div>
        </div>
    );
}
