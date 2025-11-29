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

        // 1. Test Dashboard Stats
        console.log('Fetching Dashboard Stats...');
        const statsRes = await request('/api/dashboard/stats', 'GET', null, token);
        console.log('Stats Status:', statsRes.status);
        if (statsRes.status !== 200) throw new Error('Get Stats failed');
        console.log('Stats:', JSON.stringify(statsRes.body, null, 2));

        // 2. Test Update Settings
        console.log('Updating Settings...');
        const settingsRes = await request('/api/user/settings', 'PUT', {
            company_name: 'IronManage Corp',
            address: '123 Industrial Ave',
            phone: '555-0000',
            tax_rate: 16
        }, token);
        console.log('Settings Status:', settingsRes.status);
        if (settingsRes.status !== 200) throw new Error('Update Settings failed');

        // 3. Verify Profile
        console.log('Verifying Profile...');
        const profileRes = await request('/api/user/profile', 'GET', null, token);
        console.log('Profile Status:', profileRes.status);
        if (profileRes.body.company_name !== 'IronManage Corp') throw new Error('Profile verification failed');

        console.log('\nSUCCESS: Dashboard & Settings Verified!');
    } catch (error) {
        console.error('\nFAILURE:', error.message);
        process.exit(1);
    }
};

runTests();
