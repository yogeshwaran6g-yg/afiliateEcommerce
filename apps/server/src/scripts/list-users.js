import { queryRunner } from '../config/db.js';

async function listUsers() {
    try {
        const users = await queryRunner('SELECT id, name, phone, email, password FROM users');
        console.log('Users found:', users.length);
        console.table(users);
    } catch (error) {
        console.error('Error listing users:', error);
    }
}

listUsers();
