import React from 'react';
import { Header } from './Header';

type LayoutProps = {
    children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-[#0a1628] text-[#e8f0fe] font-['Inter',sans-serif] selection:bg-[#00e676]/30">
            <Header />
            <main className="px-4 py-5 pb-10 max-w-3xl mx-auto">
                {children}
            </main>
        </div>
    );
}
