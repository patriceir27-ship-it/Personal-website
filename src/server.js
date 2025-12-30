// Netlify Function for handling contact form submissions
const nodemailer = require('nodemailer');

exports.handler = async function(event, context) {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
    
    try {
        // Parse the request body
        const data = JSON.parse(event.body);
        
        // Validate required fields
        const requiredFields = ['name', 'email', 'subject', 'message'];
        for (const field of requiredFields) {
            if (!data[field] || data[field].trim() === '') {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ 
                        error: `Missing required field: ${field}` 
                    })
                };
            }
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ 
                    error: 'Invalid email address' 
                })
            };
        }
        
        // Configure email transporter
        // Note: In production, use environment variables for credentials
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
        
        // Email content
        const mailOptions = {
            from: process.env.SMTP_FROM || 'portfolio@patriceiradukunda.com',
            to: process.env.CONTACT_EMAIL || 'patriceir27@gmail.com',
            subject: `New Contact Form Submission: ${data.subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #667eea;">New Contact Form Submission</h2>
                    <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>From:</strong> ${data.name} (${data.email})</p>
                        <p><strong>Subject:</strong> ${data.subject}</p>
                        <p><strong>Message:</strong></p>
                        <div style="white-space: pre-wrap; background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #667eea;">
                            ${data.message}
                        </div>
                    </div>
                    <p style="color: #666; font-size: 12px;">
                        This message was sent from your portfolio website contact form.
                    </p>
                </div>
            `,
            text: `
                New Contact Form Submission
                
                From: ${data.name} (${data.email})
                Subject: ${data.subject}
                
                Message:
                ${data.message}
                
                ---
                This message was sent from your portfolio website contact form.
            `
        };
        
        // Send email
        await transporter.sendMail(mailOptions);
        
        // Log the submission (for debugging)
        console.log('Contact form submission received:', {
            name: data.name,
            email: data.email,
            subject: data.subject,
            timestamp: new Date().toISOString()
        });
        
        // Store in database (optional - if you want to add a database later)
        // await storeInDatabase(data);
        
        return {
            statusCode: 200,
            body: JSON.stringify({ 
                success: true, 
                message: 'Message sent successfully' 
            })
        };
        
    } catch (error) {
        console.error('Error processing contact form:', error);
        
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Failed to send message. Please try again later.' 
            })
        };
    }
};

// Optional: Function to store submissions in a database
async function storeInDatabase(data) {
    // This is where you would add database logic
    // For example, using MongoDB, PostgreSQL, or Supabase
    
    // Example with environment variables for database connection
    const databaseUrl = process.env.DATABASE_URL;
    
    if (databaseUrl) {
        // Connect to database and store the submission
        // const db = await connectToDatabase(databaseUrl);
        // await db.collection('submissions').insertOne({
        //     ...data,
        //     timestamp: new Date(),
        //     ip: context.clientContext?.ip
        // });
    }
}
