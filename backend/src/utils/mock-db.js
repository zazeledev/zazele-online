/**
 * PostgreSQL In-Memory Mock Database for QA & Test Runners
 * Allows full backend test execution without requiring an active PostgreSQL service.
 */

const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { generateId, formatDoc } = require('../db/pgAdapter');

console.log('[Mock DB] PostgreSQL In-Memory Mock Database active for testing.');

const store = {
  users: [
    {
      _id: '507f1f77bcf86cd799439011',
      full_name: 'Zazele Admin',
      email: 'admin@zazele.com',
      password_hash: bcrypt.hashSync('CHANGE_ME_IMMEDIATELY_IN_PROD', 10),
      role: 'admin',
      approved: true,
      country: 'South Africa',
      province: 'Gauteng',
      contact_number: '0821234567',
      status: 'active',
      enrolled_courses: JSON.stringify(['M1', 'M2']),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      _id: '507f1f77bcf86cd799439012',
      full_name: 'Zazele Student',
      email: 'student@zazele.com',
      password_hash: bcrypt.hashSync('student123', 10),
      role: 'student',
      approved: true,
      country: 'South Africa',
      province: 'Western Cape',
      contact_number: '0837654321',
      status: 'active',
      enrolled_courses: JSON.stringify(['M1']),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  modules: [
    {
      _id: '507f1f77bcf86cd799439021',
      title: 'Module 1: Introduction',
      description: 'Intro module',
      code: 'M1',
      order_num: 1,
      created_at: new Date().toISOString()
    }
  ],
  lessons: [
    {
      _id: '507f1f77bcf86cd799439031',
      module_id: '507f1f77bcf86cd799439021',
      title: 'Lesson 1.1',
      description: 'Basic Lesson',
      order_num: 1,
      created_at: new Date().toISOString()
    }
  ],
  assignments: [],
  assignment_questions: [],
  events: [
    {
      _id: '507f1f77bcf86cd799439041',
      name: 'Orientation Webinar',
      description: 'Welcome',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      time: '18:00',
      teams_link: 'https://teams.microsoft.com',
      archived: false,
      created_at: new Date().toISOString()
    }
  ],
  event_registrations: [],
  notifications: [],
  profile_update_requests: [],
  student_progress: [],
  support_requests: []
};

// Simple SQL query parser & executor for mock DB
async function mockQuery(sql, params = []) {
  if (global.mockDbFail) {
    return Promise.reject(new Error('PostgreSQL connection timeout simulating DB failure'));
  }

  const normalized = sql.trim().replace(/\s+/g, ' ');

  // Health check query
  if (normalized.includes('current_database()') || normalized.includes('SELECT NOW()')) {
    return {
      rowCount: 1,
      rows: [{ now: new Date().toISOString(), db: 'zazele_test_mock' }]
    };
  }

  // Determine target table
  const tableMatch = normalized.match(/(?:FROM|INTO|UPDATE|TABLE)\s+([a-z_]+)/i);
  const table = tableMatch ? tableMatch[1].toLowerCase() : null;
  const list = (table && store[table]) ? store[table] : [];

  // 1. SELECT COUNT(*)
  if (normalized.startsWith('SELECT COUNT(*)')) {
    let count = list.length;
    return { rowCount: 1, rows: [{ count: String(count) }] };
  }

  // 2. SELECT
  if (normalized.startsWith('SELECT')) {
    let rows = [...list];

    // Filter by params
    if (params && params.length > 0) {
      if (normalized.includes('email = $1') || normalized.includes('LOWER(email) = LOWER($1)')) {
        rows = rows.filter(r => (r.email || '').toLowerCase() === String(params[0]).toLowerCase());
      } else if (normalized.includes('_id = $1')) {
        rows = rows.filter(r => String(r._id) === String(params[0]));
      } else if (normalized.includes('role = $1')) {
        rows = rows.filter(r => r.role === params[0]);
      } else if (normalized.includes('reset_password_token = $1')) {
        rows = rows.filter(r => r.reset_password_token === params[0]);
      } else if (normalized.includes('student_id = $1') && normalized.includes('module_id = $2')) {
        rows = rows.filter(r => String(r.student_id) === String(params[0]) && String(r.module_id) === String(params[1]));
      } else if (normalized.includes('module_id = $1')) {
        rows = rows.filter(r => String(r.module_id) === String(params[0]));
      } else if (normalized.includes('student_id = $1')) {
        rows = rows.filter(r => String(r.student_id) === String(params[0]));
      }
    }

    // Direct string match filter
    if (normalized.includes("role = 'student'")) {
      rows = rows.filter(r => r.role === 'student');
    } else if (normalized.includes("role = 'admin'")) {
      rows = rows.filter(r => r.role === 'admin');
    }

    // LIMIT
    const limitMatch = normalized.match(/LIMIT\s+(\d+)/i);
    if (limitMatch) {
      const l = parseInt(limitMatch[1], 10);
      rows = rows.slice(0, l);
    }

    return { rowCount: rows.length, rows };
  }

  // 3. INSERT
  if (normalized.startsWith('INSERT INTO')) {
    const colsMatch = normalized.match(/INSERT INTO\s+[a-z_]+\s*\(([^)]+)\)/i);
    if (colsMatch) {
      const cols = colsMatch[1].split(',').map(c => c.trim());
      const newRow = {};
      cols.forEach((col, idx) => {
        newRow[col] = params[idx] !== undefined ? params[idx] : null;
      });
      if (!newRow._id) {
        newRow._id = generateId();
      }
      if (!newRow.created_at) {
        newRow.created_at = new Date().toISOString();
      }
      list.push(newRow);
      return { rowCount: 1, rows: [newRow] };
    }
    return { rowCount: 1, rows: [] };
  }

  // 4. UPDATE
  if (normalized.startsWith('UPDATE')) {
    const idParam = params[params.length - 1];
    const idx = list.findIndex(r => String(r._id) === String(idParam));
    if (idx >= 0) {
      const row = list[idx];
      // Basic update extraction
      const setMatch = normalized.match(/SET\s+(.+?)\s+WHERE/i);
      if (setMatch) {
        const assignments = setMatch[1].split(',').map(a => a.trim());
        assignments.forEach((assign, pIdx) => {
          const colMatch = assign.match(/([a-z_]+)\s*=\s*\$(\d+)/i);
          if (colMatch) {
            const col = colMatch[1];
            const paramNumber = parseInt(colMatch[2], 10);
            row[col] = params[paramNumber - 1];
          }
        });
      }
      return { rowCount: 1, rows: [row] };
    }
    return { rowCount: 0, rows: [] };
  }

  // 5. DELETE
  if (normalized.startsWith('DELETE FROM')) {
    if (params && params.length > 0 && normalized.includes('_id = $1')) {
      const idx = list.findIndex(r => String(r._id) === String(params[0]));
      if (idx >= 0) list.splice(idx, 1);
    } else if (params && params.length > 0 && normalized.includes('module_id = $1')) {
      store[table] = list.filter(r => String(r.module_id) !== String(params[0]));
    } else {
      store[table] = [];
    }
    return { rowCount: 1, rows: [] };
  }

  return { rowCount: 0, rows: [] };
}

// Override db methods
db.query = mockQuery;
db.getPool = function() {
  return {
    query: mockQuery,
    on: () => {}
  };
};
db.testConnection = async function() {
  if (global.mockDbFail) {
    return { connected: false, error: 'PostgreSQL connection timeout simulating DB failure' };
  }
  return { connected: true, database: 'zazele_test_mock', timestamp: new Date().toISOString() };
};
db.initSchema = async function() {
  return Promise.resolve();
};

module.exports = { store, mockQuery };
