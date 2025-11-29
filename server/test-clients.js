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

        console.log('Creating Client...');
        const createRes = await request('/api/clients', 'POST', {
            name: 'Juan Perez',
            phone: '555-1234',
            address: 'Calle Falsa 123',
            email: 'juan@example.com'
        }, token);
        console.log('Create Status:', createRes.status);
        if (createRes.status !== 201) throw new Error('Create Client failed');
        const clientId = createRes.body.id;

        console.log('Fetching Clients...');
        const getRes = await request('/api/clients', 'GET', null, token);
        console.log('Get Status:', getRes.status);
        if (getRes.status !== 200 || getRes.body.length === 0) throw new Error('Get Clients failed');

        console.log('Updating Client...');
        const updateRes = await request(`/api/clients/${clientId}`, 'PUT', {
            name: 'Juan Perez Updated',
            phone: '555-9876'
        }, token);
        console.log('Update Status:', updateRes.status);
        if (updateRes.status !== 200) throw new Error('Update Client failed');

        console.log('Deleting Client...');
        const deleteRes = await request(`/api/clients/${clientId}`, 'DELETE', null, token);
        console.log('Delete Status:', deleteRes.status);
        if (deleteRes.status !== 200) throw new Error('Delete Client failed');

        console.log('\nSUCCESS: All Client tests passed!');
    } catch (error) {
        console.error('\nFAILURE:', error.message);
        process.exit(1);
    }
};

runTests();
