import { Router } from 'express';
import { identificarBilhete } from '../services/visionService.js';

const router = Router();

router.post('/identify', async (req, res) => {
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

export default router;
