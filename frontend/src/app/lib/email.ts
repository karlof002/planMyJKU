import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // false for STARTTLS on port 587
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    requireTLS: true, // Ensure TLS is used
    tls: {
        minVersion: 'TLSv1.2', // GMX requires TLS 1.2 or higher
        ciphers: 'HIGH:MEDIUM:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA'
    }
});

export async function sendVerificationEmail(email: string, code: string) {
    const mailOptions = {
        from: `"planMyJKU" <${process.env.SMTP_FROM}>`,
        to: email,
        subject: 'Verify your planMyJKU account',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #333; font-size: 28px; margin-bottom: 10px;">planMyJKU</h1>
                    <h2 style="color: #666; font-size: 20px; font-weight: normal;">Welcome!</h2>
                </div>
                
                <p style="color: #333; font-size: 16px; line-height: 1.5;">
                    Thank you for registering with planMyJKU. Please verify your email address to complete your registration.
                </p>
                
                <div style="background-color: #f8f9fa; padding: 25px; text-align: center; margin: 30px 0; border-radius: 8px; border-left: 4px solid #007bff;">
                    <h3 style="color: #333; margin-bottom: 15px; font-size: 18px;">Your verification code is:</h3>
                    <div style="font-size: 42px; font-weight: bold; color: #007bff; letter-spacing: 8px; font-family: monospace;">
                        ${code}
                    </div>
                </div>
                
                <p style="color: #666; font-size: 14px; line-height: 1.5;">
                    • This code will expire in 10 minutes<br>
                    • If you didn't create this account, please ignore this email<br>
                    • For security, never share this code with anyone
                </p>
                
                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                    <p style="color: #999; font-size: 12px;">
                        This email was sent by planMyJKU<br>
                        JKU Linz Study Planning Platform
                    </p>
                </div>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Email sending error:', error);
        return { success: false, error };
    }
}