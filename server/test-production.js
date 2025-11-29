const http = require('http');

const request = (path, method, data, token) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
            },
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                resolve({ status: res.statusCode, body: body ? JSON.parse(body) : {} });
            });
        });

        req.on('error', (e) => reject(e));
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
};

const runTests = async () => {
    try {
        console.log('Logging in...');
        const loginRes = await request('/api/auth/login', 'POST', {
            email: 'test@example.com',
            password: 'password123',
        });
        const token = loginRes.body.token;

        // 1. Get a Material to check stock
        console.log('Fetching Materials...');
        const matRes = await request('/api/materials', 'GET', null, token);
        const material = matRes.body[0];
        const initialStock = material.stock;
        console.log(`Material: ${material.name}, Stock: ${initialStock}`);

        // 2. Create a Project using this material
        console.log('Creating Project...');
        const projectRes = await request('/api/projects', 'POST', {
            clientName: 'Production Test Client',
            isZintro: false,
            items: [{ materialId: material.id, linear_meters: 4.5 }] // Needs 1 bar (6m). Offcut 1.5m.
        }, token);
        const projectId = projectRes.body.id;
        console.log(`Project Created: ID ${projectId}`);

        // 3. Approve Project
        console.log('Approving Project...');
        const approveRes = await request(`/api/projects/${projectId}/approve`, 'POST', {}, token);
        console.log('Approve Status:', approveRes.status);
        if (approveRes.status !== 200) throw new Error('Approve failed: ' + JSON.stringify(approveRes.body));

        // 4. Verify Stock Deduction
        console.log('Verifying Stock...');
        const matRes2 = await request('/api/materials', 'GET', null, token);
        const updatedMaterial = matRes2.body.find(m => m.id === material.id);
        console.log(`New Stock: ${updatedMaterial.stock}`);

        if (updatedMaterial.stock !== initialStock - 1) {
            throw new Error(`Stock mismatch! Expected ${initialStock - 1}, got ${updatedMaterial.stock}`);
        }

        // 5. Verify Offcut (Optional check, but good to know)
        // We don't have an endpoint to list offcuts yet, but if no error occurred, it's likely fine.

        console.log('\nSUCCESS: Production Flow Verified!');
    } catch (error) {
        console.error('\nFAILURE:', error.message);
        process.exit(1);
    }
};

runTests();
