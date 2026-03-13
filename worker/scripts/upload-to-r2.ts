import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const MAPS_DIR = path.join(process.cwd(), '../docs/curriculum/history/Maps/Maps');
const METADATA_DIR = path.join(process.cwd(), '../docs/curriculum/history/Maps');
const CHAPTERS_DIR = path.join(process.cwd(), '../docs/curriculum/history/my-first-textbook');

const MAP_MANIFEST_PATH = path.join(process.cwd(), 'scripts/output/map-manifest.json');
const CONTENT_MANIFEST_PATH = path.join(process.cwd(), 'scripts/output/content-manifest.json');

const OUTPUT_MANIFEST_FILE = path.join(process.cwd(), 'scripts/output/r2-upload-manifest.json');

const R2_BUCKET = 'learnlive-assets-prod'; // Change if different or make configurable via env

const { R2_Access_ID, R2_Access_Secret, R2_S3_API } = process.env;

if (!R2_Access_ID || !R2_Access_Secret || !R2_S3_API) {
    console.error("Missing required R2 environment variables. Ensure R2_Access_ID, R2_Access_Secret, and R2_S3_API are set.");
    process.exit(1);
}

const s3Client = new S3Client({
    region: 'auto',
    endpoint: R2_S3_API,
    credentials: {
        accessKeyId: R2_Access_ID,
        secretAccessKey: R2_Access_Secret,
    },
});

interface UploadResult {
    file: string;
    r2Key: string;
    status: 'success' | 'failed';
}

const uploadManifest: UploadResult[] = [];

function getContentType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
        case '.png': return 'image/png';
        case '.jpg':
        case '.jpeg': return 'image/jpeg';
        case '.json': return 'application/json';
        case '.md': return 'text/markdown';
        default: return 'application/octet-stream';
    }
}

async function uploadFile(localPath: string, r2Key: string) {
    console.log(`Uploading ${localPath} to ${r2Key}...`);
    try {
        if (!fs.existsSync(localPath)) {
             console.error(`  [!] File not found: ${localPath}`);
             uploadManifest.push({ file: localPath, r2Key, status: 'failed' });
             return;
        }

        const fileContent = fs.readFileSync(localPath);
        const contentType = getContentType(localPath);

        const command = new PutObjectCommand({
            Bucket: R2_BUCKET,
            Key: r2Key,
            Body: fileContent,
            ContentType: contentType,
        });

        await s3Client.send(command);

        uploadManifest.push({ file: localPath, r2Key, status: 'success' });
        console.log(`  [✓] Success`);
    } catch (e) {
        console.error(`  [X] Failed to upload ${localPath}:`, e instanceof Error ? e.message : e);
        uploadManifest.push({ file: localPath, r2Key, status: 'failed' });
    }
}

async function main() {
    console.log("Starting R2 Upload Process...");

    // 1. Upload chapter markdown files
    if (fs.existsSync(CONTENT_MANIFEST_PATH)) {
        const contentManifest = JSON.parse(fs.readFileSync(CONTENT_MANIFEST_PATH, 'utf-8'));

        // We also need the original metadata to find the filepaths
        const METADATA_PATH = path.join(CHAPTERS_DIR, 'metadata.json');
        if (fs.existsSync(METADATA_PATH)) {
           const textbookMetadata = JSON.parse(fs.readFileSync(METADATA_PATH, 'utf-8'));
           for (const chapter of textbookMetadata.chapters) {
              const localPath = path.join(CHAPTERS_DIR, chapter.filepath);
              const chapterId = `chapter_${chapter.chapterNumber.toString().padStart(2, '0')}`;
              const r2Key = `content/chapters/${chapterId}.md`;
              await uploadFile(localPath, r2Key);
           }
        }
    } else {
        console.warn(`Content manifest not found at ${CONTENT_MANIFEST_PATH}`);
    }

    // 2. Upload map images and metadata
    if (fs.existsSync(MAP_MANIFEST_PATH)) {
        const mapManifest = JSON.parse(fs.readFileSync(MAP_MANIFEST_PATH, 'utf-8'));

        for (const mapEntry of mapManifest) {
             // Upload Image
             // The images are in Maps/Maps/ - we need to find the correct extension (png, jpg)
             // The map filenames are "Map 001.png" format, but mapId is "map_001_post_babel_dispersion"
             const mapId = mapEntry.id;
             let imageLocalPath = '';

             // Extract "001" from "map_001_something"
             const match = mapId.match(/^map_(\d{3})/);
             if (match) {
                 const mapNumber = match[1];
                 const possibleFileName = `Map ${mapNumber}`;

                 imageLocalPath = path.join(MAPS_DIR, `${possibleFileName}.png`);
                 if (!fs.existsSync(imageLocalPath)) {
                     imageLocalPath = path.join(MAPS_DIR, `${possibleFileName}.jpg`);
                 }

                 // Fallback to exact mapId just in case
                 if (!fs.existsSync(imageLocalPath)) {
                     imageLocalPath = path.join(MAPS_DIR, `${mapId}.png`);
                 }
             } else {
                 imageLocalPath = path.join(MAPS_DIR, `${mapId}.png`);
             }

             if (fs.existsSync(imageLocalPath)) {
                 const imageR2Key = `assets/maps/${mapId}${path.extname(imageLocalPath)}`;
                 await uploadFile(imageLocalPath, imageR2Key);
             } else {
                 console.warn(`  [!] Could not find image for map ${mapId}`);
             }

             // Upload Metadata (Markdown file containing the description)
             const metadataLocalPath = path.join(METADATA_DIR, mapEntry.filename);
             const metadataR2Key = `assets/maps/${mapId}.json`;

             // Convert metadata to a JSON string and save temporarily, then upload
             const tempJsonPath = path.join(process.cwd(), 'scripts/output', `${mapId}.json`);
             fs.writeFileSync(tempJsonPath, JSON.stringify(mapEntry, null, 2));
             await uploadFile(tempJsonPath, metadataR2Key);

             // Clean up temp file
             if (fs.existsSync(tempJsonPath)) {
                 fs.unlinkSync(tempJsonPath);
             }
        }
    } else {
        console.warn(`Map manifest not found at ${MAP_MANIFEST_PATH}`);
    }

    // Write final upload manifest
    const manifestDir = path.dirname(OUTPUT_MANIFEST_FILE);
    if (!fs.existsSync(manifestDir)) {
        fs.mkdirSync(manifestDir, { recursive: true });
    }
    fs.writeFileSync(OUTPUT_MANIFEST_FILE, JSON.stringify(uploadManifest, null, 2));
    console.log(`\nUpload complete. Manifest written to ${OUTPUT_MANIFEST_FILE}`);
}

main().catch(console.error);
