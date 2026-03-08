import sharp from 'sharp';
import cv from '@techstark/opencv-js';

/**
 * Applies OpenCV perspective correction to find the lottery ticket
 * and wrap it to a perfect rectangle if it's placed on a background.
 */
function correctPerspective(src: any, width: number, height: number): any | null {
    let gray = new cv.Mat();
    let blur = new cv.Mat();
    let edges = new cv.Mat();
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    let bestContour: any = null;

    try {
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
        cv.GaussianBlur(gray, blur, new cv.Size(5, 5), 0);
        cv.Canny(blur, edges, 50, 150);

        let kernel = cv.Mat.ones(3, 3, cv.CV_8U);
        cv.dilate(edges, edges, kernel);
        kernel.delete();

        cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

        let maxArea = 0;
        for (let i = 0; i < contours.size(); i++) {
            let cnt = contours.get(i);
            let area = cv.contourArea(cnt);

            // Ignore small noise (<10% area) and the whole picture outline (>80% area)
            if (area < width * height * 0.10 || area > width * height * 0.80) {
                cnt.delete();
                continue;
            }

            let peri = cv.arcLength(cnt, true);
            let approx = new cv.Mat();
            cv.approxPolyDP(cnt, approx, 0.02 * peri, true);

            if (approx.rows === 4 && area > maxArea) {
                maxArea = area;
                if (bestContour) bestContour.delete();
                bestContour = approx;
            } else {
                approx.delete();
            }
            cnt.delete();
        }

        if (bestContour && maxArea > width * height * 0.15) {
            console.log(`OpenCV Canny perspective match: ${Math.round(maxArea / (width * height) * 100)}% area`);
            let result = applyWarp(src, bestContour);
            bestContour.delete();

            // Clean up
            gray.delete(); blur.delete(); edges.delete(); contours.delete(); hierarchy.delete();
            return result;
        }

    } catch (e) {
        console.warn('OpenCV correctPerspective failed:', e);
    }

    if (bestContour) bestContour.delete();
    try { gray.delete(); blur.delete(); edges.delete(); contours.delete(); hierarchy.delete(); } catch (e) { }

    return null; // Fallback to Sharp trim
}

function applyWarp(src: any, contour: any): any {
    let pts = [];
    for (let j = 0; j < 4; j++) {
        pts.push({ x: contour.data32S[j * 2], y: contour.data32S[j * 2 + 1] });
    }
    pts.sort((a, b) => a.y - b.y);
    let top2 = pts.slice(0, 2).sort((a, b) => a.x - b.x);
    let bottom2 = pts.slice(2, 4).sort((a, b) => a.x - b.x);
    let tl = top2[0], tr = top2[1], bl = bottom2[0], br = bottom2[1];

    let width = Math.round(Math.max(
        Math.hypot(br.x - bl.x, br.y - bl.y),
        Math.hypot(tr.x - tl.x, tr.y - tl.y)
    ));
    let height = Math.round(Math.max(
        Math.hypot(tr.x - br.x, tr.y - br.y),
        Math.hypot(tl.x - bl.x, tl.y - bl.y)
    ));

    let srcPts = cv.matFromArray(4, 1, cv.CV_32FC2, [tl.x, tl.y, tr.x, tr.y, br.x, br.y, bl.x, bl.y]);
    let dstPts = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, width, 0, width, height, 0, height]);
    let M = cv.getPerspectiveTransform(srcPts, dstPts);
    let warped = new cv.Mat();
    cv.warpPerspective(src, warped, M, new cv.Size(width, height));

    srcPts.delete(); dstPts.delete(); M.delete();

    return warped;
}

/**
 * Processes the raw ticket image uploaded by the user.
 * Ported from original Client-side OpenCV script.
 */
export async function processImage(base64Image: string): Promise<Buffer> {
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    let buffer = Buffer.from(base64Data, 'base64');

    try {
        // Step 1: Decode image to raw pixels using Sharp
        const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

        // Step 2: Load into OpenCV Mat
        const srcMat = cv.matFromArray(info.height, info.width, cv.CV_8UC4, new Uint8Array(data));

        // Step 3: Run OpenCV Perspective Correction
        let warpedMat = correctPerspective(srcMat, info.width, info.height);

        // Clean up source mat
        srcMat.delete();

        if (warpedMat) {
            // Convert back to Sharp buffer if OpenCV successfully warped the ticket
            buffer = await sharp(warpedMat.data, {
                raw: {
                    width: warpedMat.cols,
                    height: warpedMat.rows,
                    channels: 4
                }
            }).png().toBuffer();
            warpedMat.delete();
            console.log("Processed via OpenCV Perspective Warp");
        } else {
            console.log("OpenCV could not find a distinct 4-point document. Falling back to simple Sharp trim.");
        }
    } catch (e) {
        console.error("OpenCV Processing error (falling back to standard sharp): ", e);
    }

    // Step 4: Final Sharp post-processing (Trim edges that OpenCV might have missed, and apply color grading)
    const processed = await sharp(buffer)
        .trim({ threshold: 40 }) // Removes solid background completely
        .modulate({
            brightness: 1.05,
            saturation: 1.3, // Boost colors to make the ticket pop
        })
        .linear(1.4, -(128 * 0.4)) // Enhance contrast using linear equation
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
