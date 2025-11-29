const { PrismaClient } = require('@prisma/client');
console.log('Imported');
try {
    const prisma = new PrismaClient();
    console.log('Instantiated');
} catch (e) {
    console.error(e);
}
