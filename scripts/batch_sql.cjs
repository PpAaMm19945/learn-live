const fs = require('fs');
const path = require('path');

const SQL_FILE = path.join(__dirname, '../db/seed_curriculum.sql');
const OUTPUT_DIR = path.join(__dirname, '../db/batches');

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const content = fs.readFileSync(SQL_FILE, 'utf8');
const lines = content.split('\n');

let batchCount = 0;
let currentBatch = [];
const BATCH_SIZE = 100; // Number of INSERT statements per batch

for (const line of lines) {
    currentBatch.push(line);
    if (line.trim().endsWith(';') && line.includes('INSERT')) {
        if (currentBatch.length >= BATCH_SIZE) {
            batchCount++;
            fs.writeFileSync(path.join(OUTPUT_DIR, `batch_${batchCount}.sql`), currentBatch.join('\n'));
            currentBatch = [];
        }
    }
}

if (currentBatch.length > 0) {
    batchCount++;
    fs.writeFileSync(path.join(OUTPUT_DIR, `batch_${batchCount}.sql`), currentBatch.join('\n'));
}

console.log(`Split into ${batchCount} batches.`);
