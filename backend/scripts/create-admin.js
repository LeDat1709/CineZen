require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const prisma = new PrismaClient();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function createAdmin() {
  try {
    console.log('=== Tạo tài khoản Admin ===\n');
    
    const email = await question('Email: ');
    const password = await question('Password: ');
    const name = await question('Tên: ');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'admin'
      }
    });

    console.log('\n✓ Tạo admin thành công!');
    console.log(`Email: ${user.email}`);
    console.log(`Name: ${user.name}`);
    
  } catch (error) {
    console.error('Lỗi:', error.message);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

createAdmin();
