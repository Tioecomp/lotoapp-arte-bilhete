import { createCanvas, loadImage } from '@napi-rs/canvas';
import fs from 'fs';
import path from 'path';

// Load templates JSON
const templatesPath = path.join(__dirname, '../config/templates.json');
let templates: Record<string, any> = {};

try {
    templates = JSON.parse(fs.readFileSync(templatesPath, 'utf8'));
} catch (e) {
    console.warn("Could not load templates.json. Please ensure it exists at src/config/templates.json");
}

/**
 * Generates the final artwork by compositing the background template,
 * the processed ticket image, and the text data.
 * 
 * @param lottery The name of the lottery (e.g., 'MEGA-SENA')
 * @param ticketImageBuffer The processed ticket image as a Buffer
 * @param data The extracted data from Vision AI (prize, contest, etc.)
 * @returns Base64 string of the final generated image
 */
export async function generateArt(lottery: string, ticketImageBuffer: Buffer, data: Record<string, string>): Promise<string> {
    let templateName = lottery.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    if (templateName === 'MILIONARIA') templateName = '+MILIONARIA';
    const config = templates[templateName];

    if (!config) {
        throw new Error(`Template not found for lottery: ${lottery}. Please check templates.json.`);
    }

    // Load background
    const bgPath = path.join(__dirname, '../../assets/templates', config.background);
    if (!fs.existsSync(bgPath)) {
        throw new Error(`Background image not found at ${bgPath}. Please upload the template base image to assets/templates/.`);
    }

    const bgImage = await loadImage(bgPath);

    // Create canvas matching background size
    const canvas = createCanvas(bgImage.width, bgImage.height);
    const ctx = canvas.getContext('2d');

    // 1. Draw background
    ctx.drawImage(bgImage, 0, 0, bgImage.width, bgImage.height);

    // 2. Draw the processed ticket image
    const ticketImage = await loadImage(ticketImageBuffer);
    const tkConfig = config.ticket;

    ctx.save();
    // Move to center of ticket bounds to handle rotation
    ctx.translate(tkConfig.x + tkConfig.width / 2, tkConfig.y + tkConfig.height / 2);
    ctx.rotate((tkConfig.rotation || 0) * Math.PI / 180);
    // Draw from center
    ctx.drawImage(ticketImage, -tkConfig.width / 2, -tkConfig.height / 2, tkConfig.width, tkConfig.height);
    ctx.restore();

    // 3. Draw text fields
    if (config.texts) {
        for (const [key, textConfig] of Object.entries(config.texts as Record<string, any>)) {
            const textToDraw = data[key] || textConfig.default || '';

            ctx.font = textConfig.font;
            ctx.fillStyle = textConfig.color || '#FFFFFF';
            ctx.textAlign = textConfig.align || 'center';
            ctx.textBaseline = 'middle';

            ctx.fillText(textToDraw, textConfig.x, textConfig.y);
        }
    }

    // Return base64 JPEG
    return canvas.toDataURL('image/jpeg', 0.95);
}
