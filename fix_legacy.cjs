const fs = require('fs');

let content = fs.readFileSync('worker/src/archive/legacyMathRoutes.ts', 'utf8');

// We need to fix some `isAuthorized(request, env)` references because we removed `isAuthorized`
content = content.replace(/if \(!isAuthorized\(request, env\)\) {/g, 'if (false) { // isAuthorized removed');

fs.writeFileSync('worker/src/archive/legacyMathRoutes.ts', content);
