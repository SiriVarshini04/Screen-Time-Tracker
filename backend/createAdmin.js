const bcrypt = require('bcrypt');
const db = require('./config/db');

async function createAdmin(email, password) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // check if user exists
        const [existing] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
        
        if (existing.length > 0) {
            await db.query('UPDATE Users SET password = ?, role = "admin" WHERE email = ?', [hashedPassword, email]);
            console.log(`\n✅ SUCCESS: Updated existing user '${email}' to be an Admin with your new password!`);
        } else {
            const [result] = await db.query('INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)', ['Admin User', email, hashedPassword, 'admin']);
            await db.query('INSERT INTO Limits (user_id, daily_limit, weekly_limit) VALUES (?, ?, ?)', [result.insertId, 120, 600]);
            console.log(`\n✅ SUCCESS: Created brand new Admin account with email '${email}'!`);
        }
        process.exit(0);
    } catch (e) {
        console.error("\n❌ ERROR:", e.message);
        process.exit(1);
    }
}

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
    console.log("❌ Please provide an email and password.");
    console.log("Example: node createAdmin.js myemail@test.com mynewpassword123");
    process.exit(1);
}

console.log("Creating/Updating Admin...");
createAdmin(email, password);
