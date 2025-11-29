const http = require('http');

const postData = (path, data) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data),
            },
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                resolve({ status: res.statusCode, body: JSON.parse(body) });
            });
        });

        req.on('error', (e) => reject(e));
        req.write(data);
        req.end();
    });
};

const runTests = async () => {
    try {
        console.log('Testing Register...');
        const registerData = JSON.stringify({
            email: `test${Date.now()}@example.com`,
            password: 'password123',
            company_name: 'IronForge',
        });
        const registerRes = await postData('/api/auth/register', registerData);
        console.log('Register Status:', registerRes.status);
        console.log('Register Body:', registerRes.body);

        if (registerRes.status !== 201) throw new Error('Registration failed');

        console.log('\nTesting Login...');
        const loginData = JSON.stringify({
            email: JSON.parse(registerData).email,
            password: 'password123',
        });
        const loginRes = await postData('/api/auth/login', loginData);
        console.log('Login Status:', loginRes.status);
        console.log('Login Body:', loginRes.body);

        if (loginRes.status !== 200 || !loginRes.body.token) throw new Error('Login failed');

        console.log('\nSUCCESS: All tests passed!');
    } catch (error) {
        console.error('\nFAILURE:', error.message);
        process.exit(1);
    }
};

// Wait for server to start
setTimeout(runTests, 2000);
