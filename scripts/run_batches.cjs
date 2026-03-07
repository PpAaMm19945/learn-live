const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const BATCH_DIR = path.join(__dirname, '../db/batches');
const WORKER_DIR = path.join(__dirname, '../worker');

const files = fs.readdirSync(BATCH_DIR).filter(f => f.endsWith('.sql')).sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)[0]);
    const numB = parseInt(b.match(/\d+/)[0]);
    return numA - numB;
});

files.forEach(file => {
    console.log(`Executing ${file}...`);
    const filePath = path.join(BATCH_DIR, file);
    try {
        // Using cmd /c npx wrangler to bypass potential power shell issues
        const command = `cmd /c npx wrangler d1 execute learnlive-db-prod --remote --file=../db/batches/${file}`;
        const output = execSync(command, { cwd: WORKER_DIR, encoding: 'utf8' });
        console.log(`Successfully executed ${file}`);
    } catch (error) {
        console.error(`Error executing ${file}:`, error.message);
        if (error.stdout) console.error(error.stdout);
        if (error.stderr) console.error(error.stderr);
        process.exit(1);
    }
});

console.log('All batches executed successfully!');
