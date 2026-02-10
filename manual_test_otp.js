// Native fetch is used in Node 18+

const API_URL = 'http://localhost:4000/api/auth';

async function testOtpFlow() {
    const randomSuffix = Math.floor(Math.random() * 10000);
    const phone = `98765${randomSuffix}`;
    const email = `test${randomSuffix}@example.com`;
    const password = 'password123';
    const name = 'Test User';

    console.log(`Testing with Phone: ${phone}, Email: ${email}`);

    // 1. Signup
    try {
        console.log('Sending Signup Request...');
        const signupRes = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, phone, email, password })
        });

        const signupData = await signupRes.json();
        console.log('Signup Response:', signupData);

        if (!signupData.success) {
            console.error('Signup failed');
            return;
        }

        const userId = signupData.data.userId;
        console.log(`User ID: ${userId}`);

        console.log('\n>>> PLEASE CHECK SERVER CONSOLE FOR OTP AND ENTER IT BELOW <<<');
        // In this automated script I can't easily pause and ask for input or read the other stream without complexity.
        // So I will just stop here and say "Signup successful".
        // The user (me, the agent) will then have to read the server log.

    } catch (err) {
        console.error('Error:', err);
    }
}

testOtpFlow();
