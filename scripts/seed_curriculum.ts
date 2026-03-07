import fs from 'fs';
import path from 'path';

// This script reads Jules' curriculum JSON data and generates a
// `db/seed_curriculum.sql` file for Wrangler D1 ingestion.
//
// Run: npx ts-node scripts/seed_curriculum.ts
// Then: cd worker && npx wrangler d1 execute learnlive-db-prod --remote --file=../db/seed_curriculum.sql

const CURRICULUM_DATA_DIR = path.join(process.cwd(), 'curriculum_data');
const OUTPUT_SQL_FILE = path.join(process.cwd(), 'db', 'seed_curriculum.sql');

// Jules used string cognitive levels; our DB CHECK constraint expects integers
const COGNITIVE_LEVEL_MAP: Record<string | number, number> = {
    'Encounter': 1,
    'Execute': 2,
    'Discern': 3,
    'Own': 4,
    'Milestone': 4,
    1: 1,
    2: 2,
    3: 3,
    4: 4
};

const STRAND_ID_MAP: Record<number, string> = {
    1: 'Strand_1',
    2: 'Strand_2',
    3: 'Strand_3',
    4: 'Strand_4',
    5: 'Strand_5',
};

const MATH_CAPACITIES: Record<string, string> = {
    // Strand 1: Number & Quantity
    'D1': 'Place Value as Grouping',
    'D2': 'Addition as Combining',
    'D3': 'Subtraction as Separating',
    'D4': 'Multiplication as Equal Groups',
    'D5': 'Division as Equal Partitioning',
    'D6': 'Number Line as Model',
    'D7': 'Properties of Operations',
    'D8': 'Equivalence',
    'D9': 'Estimation & Reasonableness',

    // Strand 2: Algebraic Thinking
    'B1': 'Equivalence',
    'B2': 'Unknown Quantities',
    'B3': 'Function Machines',
    'B4': 'Generalization from Arithmetic',
    'B5': 'Growing Patterns',

    // Strand 3: Spatial Reasoning
    'G2a': '2D Shape Classification',
    'G2b': '3D Shape Recognition',
    'G2c': 'Standard Measurement — Length',
    'G2d': 'Standard Measurement — Mass & Capacity',
    'G2e': 'Perimeter',
    'G2f': 'Area — Conceptual',
    'G2g': 'Line Symmetry',
    'G2h': 'Directions & Simple Maps',

    // Strand 4: Data & Stats
    'P2a': 'Data Collection',
    'P2b': 'Bar Graphs & Tally Charts',
    'P2c': 'Asking Good Questions',
    'P2d': 'Mode',
    'P2e': 'Likely vs Unlikely',
    'P2f': 'Simple Experiments',
    'P2g': 'Comparing Data Sets',
};

// Load English capacity names from generated file
const ENG_CAPACITIES_PATH = path.join(CURRICULUM_DATA_DIR, 'english_capacity_names.json');
const ENG_CAPACITIES = fs.existsSync(ENG_CAPACITIES_PATH)
    ? JSON.parse(fs.readFileSync(ENG_CAPACITIES_PATH, 'utf8'))
    : {};

// Load Science capacity names
const SCI_CAPACITIES_PATH = path.join(CURRICULUM_DATA_DIR, 'science_capacity_names.json');
const SCI_CAPACITIES = fs.existsSync(SCI_CAPACITIES_PATH)
    ? JSON.parse(fs.readFileSync(SCI_CAPACITIES_PATH, 'utf8'))
    : {};

const CAPACITIES_NAME_MAP = { ...MATH_CAPACITIES, ...ENG_CAPACITIES, ...SCI_CAPACITIES };

interface JulesTemplate {
    capacity_id: string;
    strand: number;
    band: number;
    cognitive_level: string; // Jules uses strings
    variation_id: string;
    task_type: string;
    materials?: string[] | string | null;
    parent_prompt: string;
    success_condition: string;
    failure_condition?: string | null;
    reasoning_check: string;
    repetition_arc?: object;
    context_variants?: object | string;
    worksheet?: object;
    scientific_materials?: string[] | string | null;
    acceptable_alternatives?: string[] | string | null;
    risk_level?: string | null;
    safety_warning?: string | null;
    parent_primer?: string;
    worldview_connection?: string | null;
}

function escSQL(str?: string | null): string {
    if (!str) return 'NULL';
    return `'${str.replace(/'/g, "''")}'`;
}

function generateSQL() {
    let sql = `-- =============================================================================\n`;
    sql += `-- Learn Live — Curriculum Spine Seed Data\n`;
    sql += `-- Auto-generated from Jules JSON template files on ${new Date().toISOString()}\n`;
    sql += `-- =============================================================================\n\n`;

    // Idempotent: clear existing curriculum data
    sql += `-- Clear existing data (in order of dependencies)\n`;
    sql += `DELETE FROM Learner_Repetition_State;\n`;
    sql += `DELETE FROM Constraint_Templates;\n`;
    sql += `DELETE FROM Capacity_Dependencies;\n`;
    sql += `DELETE FROM Capacities;\n`;
    sql += `DELETE FROM Strands;\n`;
    sql += `DELETE FROM Developmental_Bands;\n\n`;

    // 1. Seed Developmental Bands
    sql += `-- ── Developmental Bands ─────────────────────────────────────────────────────\n`;
    const bands = [
        { id: 'Band_0', name: 'Infant/Toddler', age_range: '0-3' },
        { id: 'Band_1', name: 'Early Childhood', age_range: '3-6' },
        { id: 'Band_2', name: 'Early Primary', age_range: '6-9' },
        { id: 'Band_3', name: 'Upper Primary', age_range: '9-12' },
        { id: 'Band_4', name: 'Middle School', age_range: '12-15' },
        { id: 'Band_5', name: 'High School', age_range: '15-18' }
    ];
    for (const b of bands) {
        sql += `INSERT INTO Developmental_Bands (id, name, age_range) VALUES ('${b.id}', '${b.name}', '${b.age_range}');\n`;
    }
    sql += `\n`;

    // 2. Seed Strands
    sql += `-- ── Strands ─────────────────────────────────────────────────────────────────\n`;
    const strands = [
        // Math Strands
        { id: 'MATH_S1', name: 'Number & Quantity' },
        { id: 'MATH_S2', name: 'Algebraic Thinking & Structure' },
        { id: 'MATH_S3', name: 'Spatial Reasoning & Geometry' },
        { id: 'MATH_S4', name: 'Data, Probability & Statistics' },
        { id: 'MATH_S5', name: 'Mathematical Modeling & Systems' },
        // English Strands
        { id: 'ENG_S1', name: 'Phonics & Word Study' },
        { id: 'ENG_S2', name: 'Reading Comprehension' },
        { id: 'ENG_S3', name: 'Grammar & Mechanics' },
        { id: 'ENG_S4', name: 'Composition & Writing' },
        { id: 'ENG_S5', name: 'Oral Language & Listening' },
        // Science Strands
        { id: 'SCI_S1', name: 'Life Sciences & Inquiry' },
        { id: 'SCI_S2', name: 'Physical Sciences' },
        { id: 'SCI_S3', name: 'Earth & Space Sciences' }
    ];
    for (const s of strands) {
        sql += `INSERT INTO Strands (id, name) VALUES ('${s.id}', ${escSQL(s.name)});\n`;
    }
    sql += `\n`;

    // 3. Process JSON files
    if (!fs.existsSync(CURRICULUM_DATA_DIR)) {
        console.error(`ERROR: ${CURRICULUM_DATA_DIR} does not exist.`);
        process.exit(1);
    }

    const files = fs.readdirSync(CURRICULUM_DATA_DIR).filter(f => f.endsWith('.json') && !f.includes('capacity_names'));
    if (files.length === 0) {
        console.error(`ERROR: No JSON files found in ${CURRICULUM_DATA_DIR}.`);
        process.exit(1);
    }

    // Track unique capacities to insert them first
    const seenCapacities = new Set<string>();
    let totalTemplates = 0;

    sql += `-- ── Capacities ──────────────────────────────────────────────────────────────\n`;

    // First pass: extract unique capacities
    for (const file of files) {
        const raw = fs.readFileSync(path.join(CURRICULUM_DATA_DIR, file), 'utf8');
        const templates: JulesTemplate[] = JSON.parse(raw);
        const isEnglish = file.startsWith('english_');
        const isScience = file.startsWith('science_');
        const prefix = isEnglish ? 'ENG_S' : (isScience ? 'SCI_S' : 'MATH_S');

        for (const t of templates) {
            const capKey = t.capacity_id;
            if (!seenCapacities.has(capKey)) {
                seenCapacities.add(capKey);
                const strandId = `${prefix}${t.strand}`;
                const bandId = `Band_${t.band}`;
                // Use lookup map, fallback to task_type
                const capName = (CAPACITIES_NAME_MAP as any)[capKey] || t.task_type;
                sql += `INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('${capKey}', '${strandId}', '${bandId}', ${escSQL(capName)});\n`;
            }
        }
    }
    sql += `\n`;

    // Second pass: insert templates
    sql += `-- ── Constraint Templates ────────────────────────────────────────────────────\n`;
    for (const file of files) {
        sql += `-- File: ${file}\n`;
        console.log(`Processing: ${file}`);
        const raw = fs.readFileSync(path.join(CURRICULUM_DATA_DIR, file), 'utf8');
        const templates: JulesTemplate[] = JSON.parse(raw);
        const isEnglish = file.startsWith('english_');
        const isScience = file.startsWith('science_');
        const prefix = isEnglish ? 'ENG_S' : (isScience ? 'SCI_S' : 'MATH_S');

        for (const t of templates) {
            const cogLevel = COGNITIVE_LEVEL_MAP[t.cognitive_level];
            if (!cogLevel) {
                console.warn(`  WARN: Unknown cognitive_level '${t.cognitive_level}' in ${file}, capacity ${t.capacity_id}. Skipping.`);
                continue;
            }

            const id = `${t.capacity_id}_L${cogLevel}_${t.variation_id}`;

            // Normalize materials: array → joined string
            let materialsStr: string | null = null;
            if (Array.isArray(t.materials)) {
                materialsStr = t.materials.join(', ');
            } else if (typeof t.materials === 'string') {
                materialsStr = t.materials;
            }

            // Normalize context_variants: object → JSON string
            let contextStr = '';
            if (typeof t.context_variants === 'object') {
                contextStr = JSON.stringify(t.context_variants);
            } else if (typeof t.context_variants === 'string') {
                contextStr = t.context_variants;
            }

            // Science specific fields
            const scientificMaterials = Array.isArray(t.scientific_materials) ? t.scientific_materials.join(', ') : (t.scientific_materials || null);
            const acceptableAlternatives = Array.isArray(t.acceptable_alternatives) ? t.acceptable_alternatives.join(', ') : (t.acceptable_alternatives || null);
            const riskLevel = t.risk_level || null;
            const safetyWarning = t.safety_warning || null;

            sql += `INSERT OR IGNORE INTO Constraint_Templates (id, capacity_id, cognitive_level, variation_id, task_type, materials, scientific_materials, acceptable_alternatives, risk_level, safety_warning, parent_prompt, success_condition, failure_condition, reasoning_check, context_variants, requires_parent_primer) VALUES (${escSQL(id)}, ${escSQL(t.capacity_id)}, ${cogLevel}, ${escSQL(t.variation_id)}, ${escSQL(t.task_type)}, ${escSQL(materialsStr)}, ${escSQL(scientificMaterials)}, ${escSQL(acceptableAlternatives)}, ${escSQL(riskLevel)}, ${escSQL(safetyWarning)}, ${escSQL(t.parent_prompt)}, ${escSQL(t.success_condition)}, ${escSQL(t.failure_condition)}, ${escSQL(t.reasoning_check)}, ${escSQL(contextStr)}, ${t.parent_primer ? 1 : 0});\n`;
            totalTemplates++;
        }
        sql += `\n`;
    }

    fs.writeFileSync(OUTPUT_SQL_FILE, sql, 'utf8');
    console.log(`\n✅ Generated ${OUTPUT_SQL_FILE}`);
    console.log(`   Capacities: ${seenCapacities.size}`);
    console.log(`   Templates:  ${totalTemplates}`);
}

generateSQL();
