import * as dotenv from 'dotenv';
import { ContentFetcher } from '../src/contentFetcher';
import { GenAINarrator } from '../src/gemini';
import { TTSService } from '../src/tts';

dotenv.config();

async function runSmokeTest() {
    console.log('🚀 Starting Learn Live Agent Smoke Test...\n');

    // 1. Test ContentFetcher
    console.log('--- 1. Testing ContentFetcher ---');
    const fetcher = new ContentFetcher('local', 'test-key');
    const manifest = await fetcher.fetchSection('ch01', 's01');
    if (manifest && manifest.beats.length > 0) {
        console.log(`✅ ContentFetcher: Loaded ${manifest.beats.length} beats for ${manifest.sectionId}`);
    } else {
        console.error('❌ ContentFetcher: Failed to load manifest or beats.');
        process.exit(1);
    }

    // 2. Test GenAINarrator
    console.log('\n--- 2. Testing GenAINarrator ---');
    const narrator = new GenAINarrator('You are a helpful teaching assistant.');
    const testPrompt = 'Briefly introduce the topic of ancient history in 10 words.';
    const narration = await narrator.narrate(testPrompt);
    if (narration && narration.length > 0) {
        console.log(`✅ GenAINarrator: Received narration: "${narration.trim()}"`);
    } else {
        console.error('❌ GenAINarrator: Failed to get narration.');
        process.exit(1);
    }

    // 3. Test TTSService
    console.log('\n--- 3. Testing TTSService ---');
    const tts = new TTSService();
    const audioBase64 = await tts.synthesize(narration || 'Hello world');
    if (audioBase64 && audioBase64.length > 500) {
        console.log(`✅ TTSService: Synthesized ${Math.round(audioBase64.length / 1024)} KB of audio data.`);
    } else {
        console.error('❌ TTSService: Audio synthesis failed or returned insufficient data.');
        process.exit(1);
    }

    console.log('\n✨ Smoke Test Passed Successfully!');
}

runSmokeTest().catch(err => {
    console.error('\n💥 Smoke Test Crashed:', err);
    process.exit(1);
});
