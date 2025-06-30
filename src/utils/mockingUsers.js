import bcrypt from 'bcrypt';

function generateMockUsers(num) {
    const users = [];
    for (let i = 0; i < num; i++) {
        const role = Math.random() < 0.5 ? 'user' : 'admin';
        const hashedPassword = bcrypt.hashSync('coder123', 10);
        users.push({
            first_name: `User${i}`,
            last_name: `Test${i}`,
            email: `user${i}-${Date.now()}-${Math.floor(Math.random() * 10000)}@example.com`,
            password: hashedPassword,
            role,
            pets: []
        });
    }
    return users;
}

export default generateMockUsers;
