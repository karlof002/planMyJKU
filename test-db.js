const { PrismaClient } = require('@prisma/client');

async function testConnection() {
    const prisma = new PrismaClient();

    try {
        // Test connection
        await prisma.$connect();
        console.log('✅ Database connection successful!');

        // Test query
        const userCount = await prisma.user.count();
        console.log(`📊 Users in database: ${userCount}`);

    } catch (error) {
        console.error('❌ Database connection failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();