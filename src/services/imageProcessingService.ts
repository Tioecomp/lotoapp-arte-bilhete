import sharp from 'sharp';

/**
 * Processes the raw ticket image uploaded by the user.
 * It trims the background, enhances contrast and saturation,
 * and prepares it to be pasted onto the final artwork.
 * 
 * @param base64Image The raw image from the camera/gallery
 * @returns Buffer containing the processed PNG image
 */
export async function processImage(base64Image: string): Promise<Buffer> {
    // Strip the data URI prefix if present
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');

    // Use sharp to process the image
    const processed = await sharp(buffer)
        // Auto-crop uniform backgrounds (like dark tables or simple borders)
        .trim({ threshold: 30 })
        // Enhance colors (similar to the OpenCV pipeline in JS_geral)
        .modulate({
            brightness: 1.05,
            saturation: 1.3, // Boost colors
        })
        // Increase contrast: y = a*x + b 
        .linear(1.4, -(128 * 0.4))
        // Sharpen the image slightly
        .sharpen({
            sigma: 1.5,
            m1: 1,
            m2: 2,
            x1: 2,
            y2: 10,
            y3: 20,
        })
        .toFormat('png')
        .toBuffer();

    return processed;
}
