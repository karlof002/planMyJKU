require('dotenv').config();
const nodemailer = require('nodemailer');

async function testGMXEmail() {
    console.log('Testing GMX email with:');
    console.log('Host:', process.env.SMTP_HOST);
    console.log('Port:', process.env.SMTP_PORT);
    console.log('User:', process.env.SMTP_USER);
    console.log('From:', process.env.SMTP_FROM);

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        requireTLS: true,
        tls: {
            minVersion: 'TLSv1.2'
        }
    });

    try {
        // Test connection
        console.log('Testing connection...');
        await transporter.verify();
        console.log('✅ GMX SMTP connection successful!');

        // Send test email
        console.log('Sending test email...');
        const info = await transporter.sendMail({
            from: `"planMyJKU Test" <${process.env.SMTP_FROM}>`,
            to: process.env.SMTP_USER, // Send to yourself
            subject: 'Test Email from planMyJKU',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h1>✅ GMX Email Test Successful!</h1>
                    <p>Your GMX email configuration is working correctly.</p>
                    <p><strong>Test Code:</strong> <span style="font-size: 24px; color: #007bff; font-family: monospace;">123456</span></p>
                </div>
            `
        });

        console.log('✅ Test email sent successfully!');
        console.log('Message ID:', info.messageId);

    } catch (error) {
        console.error('❌ Email test failed:', error.message);

        // Specific error handling
        if (error.code === 'EAUTH') {
            console.log('💡 Authentication failed. Please check:');
            console.log('   - Your GMX password is correct');
            console.log('   - "External email programs" is enabled in GMX settings');
        } else if (error.code === 'ECONNECTION') {
            console.log('💡 Connection failed. Please check:');
            console.log('   - Your internet connection');
            console.log('   - GMX servers are accessible');
        }
    }
}

testGMXEmail();