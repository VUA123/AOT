import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Enable CORS so the React app can communicate with the server
app.use(cors());
app.use(express.json());

// Trust proxy to retrieve actual client IP in different environments
app.set('trust proxy', true);

// Connect to SQLite database
const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err);
  } else {
    console.log('Connected to database.db successfully.');
  }
});

// Drop stale table on startup to prevent schema/column conflicts, and create a fresh one
db.serialize(() => {
  db.run(`DROP TABLE IF EXISTS users`);
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      device_type TEXT NOT NULL,
      ip_address TEXT NOT NULL,
      active INTEGER DEFAULT 0
    )
  `, (err) => {
    if (err) {
      console.error('Error creating users table:', err);
    } else {
      console.log('Fresh users table ready.');
    }
  });

  // Ensure login_history table is created without being dropped to persist history
  db.run(`
    CREATE TABLE IF NOT EXISTS login_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      password_entered TEXT NOT NULL,
      ip_address TEXT,
      device_type TEXT,
      user_agent TEXT,
      login_time TEXT DEFAULT CURRENT_TIMESTAMP,
      action TEXT NOT NULL DEFAULT 'LOGIN'
    )
  `, (err) => {
    if (err) {
      console.error('Error creating login_history table:', err);
    } else {
      console.log('login_history table ready.');
    }
  });
});

// Helper to determine device type and operating system from User-Agent header
function getDeviceType(userAgent) {
  if (!userAgent) return 'Desktop';
  const ua = userAgent.toLowerCase();
  
  let os = '';
  if (ua.includes('windows nt')) {
    os = ' (Windows)';
  } else if (ua.includes('macintosh') || ua.includes('mac os')) {
    os = ' (macOS)';
  } else if (ua.includes('android')) {
    os = ' (Android)';
  } else if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
    os = ' (iOS)';
  } else if (ua.includes('linux')) {
    os = ' (Linux)';
  }

  if (ua.includes('mobi') || ua.includes('android') || ua.includes('iphone') || ua.includes('ipod')) {
    return `Mobile${os}`;
  }
  if (ua.includes('tablet') || ua.includes('ipad')) {
    return `Tablet${os}`;
  }
  return `Desktop${os}`;
}

// Helper to get client IP
function getClientIp(req) {
  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip || '127.0.0.1';
  if (ip.startsWith('::ffff:')) {
    ip = ip.substring(7);
  }
  if (ip === '::1') {
    ip = '127.0.0.1';
  }
  return ip;
}

// SIGNUP ENDPOINT
app.post('/api/signup', (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ success: false, message: 'Scout name and military pass code are required.' });
  }

  const deviceType = getDeviceType(req.headers['user-agent']);
  const ipAddress = getClientIp(req);

  const query = `INSERT INTO users (name, password, device_type, ip_address, active) VALUES (?, ?, ?, ?, 1)`;
  
  db.run(query, [name.trim(), password, deviceType, ipAddress], function(err) {
    if (err) {
      console.error('[Backend API] Signup Database Error:', err);
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ success: false, message: 'This Scout name has already been registered.' });
      }
      return res.status(500).json({ success: false, message: 'Failed to enlist user. Try again.' });
    }

    // Log the signup to login_history
    const loginHistoryQuery = `
      INSERT INTO login_history (username, password_entered, ip_address, device_type, user_agent, action)
      VALUES (?, ?, ?, ?, ?, 'LOGIN')
    `;
    db.run(loginHistoryQuery, [name.trim(), password, ipAddress, deviceType, req.headers['user-agent']], (historyErr) => {
      if (historyErr) {
        console.error('Failed to log signup history:', historyErr);
      }
    });
    
    res.status(201).json({
      success: true,
      message: 'Scout enlisted successfully!',
      user: {
        id: this.lastID,
        name: name.trim(),
        device_type: deviceType,
        ip_address: ipAddress,
        active: 1
      }
    });
  });
});

// LOGIN ENDPOINT
app.post('/api/login', (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ success: false, message: 'Scout name and military pass code are required.' });
  }

  const query = `SELECT * FROM users WHERE name = ?`;
  
  db.get(query, [name.trim()], (err, user) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error. Try again.' });
    }

    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid Scout name or military pass code.' });
    }

    const deviceType = getDeviceType(req.headers['user-agent']);
    const ipAddress = getClientIp(req);

    // Set active = 1 upon logging in and update device/IP in case they changed
    db.run(
      `UPDATE users SET active = 1, device_type = ?, ip_address = ? WHERE id = ?`,
      [deviceType, ipAddress, user.id],
      (updateErr) => {
        if (updateErr) {
          console.error('Failed to update user active status:', updateErr);
        }

        // Log the login to login_history
        const loginHistoryQuery = `
          INSERT INTO login_history (username, password_entered, ip_address, device_type, user_agent, action)
          VALUES (?, ?, ?, ?, ?, 'LOGIN')
        `;
        db.run(loginHistoryQuery, [name.trim(), password, ipAddress, deviceType, req.headers['user-agent']], (historyErr) => {
          if (historyErr) {
            console.error('Failed to log login history:', historyErr);
          }
        });

        res.json({
          success: true,
          message: 'Access granted. Welcome back, Scout!',
          user: {
            id: user.id,
            name: user.name,
            device_type: deviceType,
            ip_address: ipAddress,
            active: 1
          }
        });
      }
    );
  });
});

// LOGOUT ENDPOINT
app.post('/api/logout', (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: 'Scout name required for discharge.' });
  }

  db.run(`UPDATE users SET active = 0 WHERE name = ?`, [name.trim()], (err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Logout failed.' });
    }

    const ipAddress = getClientIp(req);
    const deviceType = getDeviceType(req.headers['user-agent']);

    // Log the logout to login_history
    const loginHistoryQuery = `
      INSERT INTO login_history (username, password_entered, ip_address, device_type, user_agent, action)
      VALUES (?, 'N/A', ?, ?, ?, 'LOGOUT')
    `;
    db.run(loginHistoryQuery, [name.trim(), ipAddress, deviceType, req.headers['user-agent']], (historyErr) => {
      if (historyErr) {
        console.error('Failed to log logout history:', historyErr);
      }
    });

    res.json({ success: true, message: 'Discharged successfully.' });
  });
});

// PLAY GAME ENDPOINT (To log active gameplay)
app.post('/api/play_game', (req, res) => {
  const { username, game_name } = req.body;

  if (!username || !game_name) {
    return res.status(400).json({ success: false, message: 'Username and game name are required.' });
  }

  const deviceType = getDeviceType(req.headers['user-agent']);
  const ipAddress = getClientIp(req);

  const query = `
    INSERT INTO login_history (username, password_entered, ip_address, device_type, user_agent, action)
    VALUES (?, ?, ?, ?, ?, 'PLAY_GAME')
  `;
  
  const detail = `Played: ${game_name.toUpperCase()}`;

  db.run(query, [username.trim(), detail, ipAddress, deviceType, req.headers['user-agent']], (err) => {
    if (err) {
      console.error('[Backend API] Play Game Logging Error:', err);
      return res.status(500).json({ success: false, message: 'Database error. Try again.' });
    }
    res.json({ success: true, message: 'Gameplay logged successfully.' });
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on http://127.0.0.1:${PORT}`);
});
