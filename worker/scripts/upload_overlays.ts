import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

const OVERLAYS_DIR = path.join(process.cwd(), '../docs/curriculum/history/Maps/overlays');
const R2_BUCKET = 'learnlive-assets-prod';

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

async function main() {
    console.log("Starting SVG Overlays Upload...");

    if (!fs.existsSync(OVERLAYS_DIR)) {
        console.error(`Overlays directory not found at ${OVERLAYS_DIR}`);
        process.exit(1);
    }

    const files = fs.readdirSync(OVERLAYS_DIR);

    for (const file of files) {
        if (file.startsWith('map_') && file.endsWith('_overlay.svg')) {
            const localPath = path.join(OVERLAYS_DIR, file);
            const r2Key = `assets/maps/overlays/${file}`;

            console.log(`Uploading ${file} to ${r2Key}...`);

            const fileContent = fs.readFileSync(localPath);

            try {
                const command = new PutObjectCommand({
                    Bucket: R2_BUCKET,
                    Key: r2Key,
                    Body: fileContent,
                    ContentType: 'image/svg+xml',
                });

                await s3Client.send(command);
                console.log(`  [✓] Success`);
            } catch (e) {
                console.error(`  [X] Failed to upload ${file}:`, e instanceof Error ? e.message : e);
            }
        }
    }

    console.log("\nVerifying uploaded files:");
    try {
        const listCommand = new ListObjectsV2Command({
            Bucket: R2_BUCKET,
            Prefix: 'assets/maps/overlays/'
        });

        const response = await s3Client.send(listCommand);

        if (response.Contents && response.Contents.length > 0) {
            for (const item of response.Contents) {
                console.log(`- ${item.Key} (${item.Size} bytes)`);
            }
            console.log(`Total files listed: ${response.Contents.length}`);
        } else {
            console.log("No files found in assets/maps/overlays/");
        }
    } catch (e) {
        console.error("Failed to list objects:", e instanceof Error ? e.message : e);
    }
}

main().catch(console.error);
