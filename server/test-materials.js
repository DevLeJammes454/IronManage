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
            email: 'test@example.com', // Assuming this user exists from Phase 1
            password: 'password123',
        });

        if (loginRes.status !== 200) {
            // Try registering if login fails (maybe DB was reset)
            console.log('Login failed, trying to register...');
            await request('/api/auth/register', 'POST', {
                email: 'test@example.com',
                password: 'password123',
                company_name: 'IronForge',
            });
            // Login again
            const loginRes2 = await request('/api/auth/login', 'POST', {
                email: 'test@example.com',
                password: 'password123',
            });
            if (loginRes2.status !== 200) throw new Error('Login failed');
            var token = loginRes2.body.token;
        } else {
            var token = loginRes.body.token;
        }

        console.log('Creating Material...');
        const createRes = await request('/api/materials', 'POST', {
            name: 'PTR 2x2',
            category: 'PTR',
            price_black: 500.50,
            price_zintro: 550.00,
            stock: 10,
        }, token);
        console.log('Create Status:', createRes.status);
        if (createRes.status !== 201) throw new Error('Create failed');
        const materialId = createRes.body.id;

        console.log('Fetching Materials...');
        const getRes = await request('/api/materials', 'GET', null, token);
        console.log('Get Status:', getRes.status);
        if (getRes.status !== 200 || getRes.body.length === 0) throw new Error('Get failed');

        console.log('Updating Material...');
        const updateRes = await request(`/api/materials/${materialId}`, 'PUT', {
            price_black: 520.00,
            stock: 15,
        }, token);
        console.log('Update Status:', updateRes.status);
        if (updateRes.status !== 200) throw new Error('Update failed');

        console.log('Deleting Material...');
        const deleteRes = await request(`/api/materials/${materialId}`, 'DELETE', null, token);
        console.log('Delete Status:', deleteRes.status);
        if (deleteRes.status !== 200) throw new Error('Delete failed');

        console.log('\nSUCCESS: All Material tests passed!');
    } catch (error) {
        console.error('\nFAILURE:', error.message);
        process.exit(1);
    }
};

runTests();
