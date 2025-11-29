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

        if (loginRes.status !== 200) throw new Error('Login failed');
        const token = loginRes.body.token;

        // Ensure we have a material
        console.log('Creating Material for Project Test...');
        const materialRes = await request('/api/materials', 'POST', {
            name: 'Test Profile',
            category: 'Test',
            price_black: 100.00,
            price_zintro: 120.00,
            stock: 100,
        }, token);
        const materialId = materialRes.body.id;

        console.log('Creating Project (Black)...');
        // 7 meters -> 2 bars (6m each). Cost should be 2 * 100 = 200.
        const projectRes = await request('/api/projects', 'POST', {
            clientName: 'Test Client',
            isZintro: false,
            items: [
                { materialId: materialId, linear_meters: 7.0 }
            ]
        }, token);

        console.log('Project Status:', projectRes.status);
        console.log('Project Total Cost:', projectRes.body.totalCost);

        if (projectRes.status !== 201) throw new Error('Project creation failed');
        if (parseFloat(projectRes.body.totalCost) !== 200.00) throw new Error(`Incorrect Cost Calculation. Expected 200, got ${projectRes.body.totalCost}`);

        console.log('Creating Project (Zintro)...');
        // 7 meters -> 2 bars. Cost should be 2 * 120 = 240.
        const projectZintroRes = await request('/api/projects', 'POST', {
            clientName: 'Test Client Zintro',
            isZintro: true,
            items: [
                { materialId: materialId, linear_meters: 7.0 }
            ]
        }, token);

        console.log('Project Zintro Total Cost:', projectZintroRes.body.totalCost);
        if (parseFloat(projectZintroRes.body.totalCost) !== 240.00) throw new Error(`Incorrect Zintro Cost Calculation. Expected 240, got ${projectZintroRes.body.totalCost}`);

        console.log('\nSUCCESS: All Project Calculation tests passed!');
    } catch (error) {
        console.error('\nFAILURE:', error.message);
        process.exit(1);
    }
};

runTests();
