import React, { useRef, useEffect, useState } from 'react';
import { Camera, X } from 'lucide-react';

type CameraModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onCapture: (file: File) => void;
};

export function CameraModal({ isOpen, onClose, onCapture }: CameraModalProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    useEffect(() => {
        if (isOpen) {
            navigator.mediaDevices
                .getUserMedia({
                    video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
                    audio: false,
                })
                .then((s) => {
                    setStream(s);
                    if (videoRef.current) {
                        videoRef.current.srcObject = s;
                    }
                })
                .catch((err) => {
                    console.error("Erro ao acessar a câmera:", err);
                    alert("Não foi possível acessar a câmera. Verifique as permissões.");
                    onClose();
                });
        } else {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
                setStream(null);
            }
        }
        return () => {
            if (stream) stream.getTracks().forEach((track) => track.stop());
        };
    }, [isOpen]);

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], "camera_capture.jpg", { type: "image/jpeg" });
                        onCapture(file);
                    }
                }, 'image/jpeg', 0.95);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
            />

            {/* Viewfinder Guide */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[85%] h-[55%] border-2 border-[rgba(0,230,118,0.7)] rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.45)] relative">
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-[11px] text-[rgba(0,230,118,0.9)] tracking-[1.5px] whitespace-nowrap font-semibold">
                        ENQUADRE O BILHETE
                    </div>
                </div>
            </div>

            <div className="absolute bottom-10 w-full flex items-center justify-around px-8">
                <button
                    onClick={onClose}
                    className="bg-white/15 border border-white/30 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-white/25 transition-colors"
                >
                    <X size={20} />
                </button>
                <button
                    onClick={handleCapture}
                    className="bg-white border-4 border-white/50 rounded-full w-20 h-20 shadow-lg"
                ></button>
                <div className="w-12"></div> {/* Spacer to align the camera button */}
            </div>

            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
}
