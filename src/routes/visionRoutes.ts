import { Router, Request, Response } from 'express';
import { identificarBilhete } from '../services/visionService.js';
import { processImage } from '../services/imageProcessingService.js';
import { generateArt } from '../services/canvasService.js';

const router = Router();

router.post('/identify', async (req: Request, res: Response) => {
    try {
        const { base64Image, tenantConfig } = req.body;

        if (!base64Image) {
            return res.status(400).json({ sucesso: false, erro: 'Imagem Base64 não fornecida.' });
        }

        const resultado = await identificarBilhete(base64Image, tenantConfig);

        if (resultado.sucesso) {
            res.json(resultado);
        } else {
            res.status(422).json(resultado); // Unprocessable Entity
        }

    } catch (error: any) {
        console.error('Route /identify Error:', error);
        res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor', detalhes: error.message });
    }
});

router.post('/generate', async (req: Request, res: Response) => {
    try {
        const { base64Image, lottery, data } = req.body;

        if (!base64Image || !lottery || !data) {
            return res.status(400).json({ sucesso: false, erro: 'Dados incompletos (base64Image, lottery, data são obrigatórios).' });
        }

        // 1. Process the raw image to remove background and enhance contrast
        const processedImageBuffer = await processImage(base64Image);

        // 2. Generate the final artwork using Canvas with the template and processed image
        const finalImageBase64 = await generateArt(lottery, processedImageBuffer, data);

        res.json({ sucesso: true, imageBase64: finalImageBase64 });

    } catch (error: any) {
        console.error('Route /generate Error:', error);
        res.status(500).json({ sucesso: false, erro: 'Erro ao gerar arte.', detalhes: error.message });
    }
});

export default router;
