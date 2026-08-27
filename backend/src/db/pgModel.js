/**
 * PostgreSQL Mongoose-Compatible Model Bridge
 * Allows all existing controllers to seamlessly query PostgreSQL without code changes
 */

const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { generateId, formatDoc } = require('./pgAdapter');

const TABLE_MAP = {
  User: 'users',
  Module: 'modules',
  Lesson: 'lessons',
  StudentProgress: 'student_progress',
  Assignment: 'assignments',
  AssignmentQuestion: 'assignment_questions',
  Event: 'events',
  EventRegistration: 'event_registrations',
  Notification: 'notifications',
  SupportRequest: 'support_requests',
  ProfileUpdateRequest: 'profile_update_requests'
};

// Map JavaScript model fields to PostgreSQL column names
function toColumn(table, field) {
  const map = {
    users: {
      fullName: 'full_name',
      passwordHash: 'password_hash',
      contactNumber: 'contact_number',
      idDocumentPath: 'id_document_path',
      paymentProofPath: 'payment_proof_path',
      idVerified: 'id_verified',
      paymentVerified: 'payment_verified',
      resetPasswordToken: 'reset_password_token',
      resetPasswordExpires: 'reset_password_expires',
      enrolledCourses: 'enrolled_courses',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    modules: {
      order: 'order_num',
      createdAt: 'created_at'
    },
    lessons: {
      moduleId: 'module_id',
      youtubeURL: 'youtube_url',
      notesPath: 'notes_path',
      order: 'order_num',
      createdAt: 'created_at'
    },
    student_progress: {
      studentId: 'student_id',
      moduleId: 'module_id',
      currentLessonOrder: 'current_lesson_order',
      startedFirstLessonDate: 'started_first_lesson_date',
      enrollmentDate: 'enrollment_date',
      completedLessons: 'completed_lessons',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    assignments: {
      moduleId: 'module_id',
      studentId: 'student_id',
      totalQuestions: 'total_questions',
      passMark: 'pass_mark',
      timeLimit: 'time_limit',
      timeStarted: 'time_started',
      timeSubmitted: 'time_submitted',
      timeSpent: 'time_spent',
      retakeCount: 'retake_count',
      createdAt: 'created_at'
    },
    assignment_questions: {
      moduleId: 'module_id',
      questionNumber: 'question_number',
      correctAnswer: 'correct_answer',
      lessonReference: 'lesson_reference',
      createdAt: 'created_at'
    },
    events: {
      teamsLink: 'teams_link',
      createdAt: 'created_at'
    },
    event_registrations: {
      eventId: 'event_id',
      fullName: 'full_name',
      contactNumber: 'contact_number',
      linkSent: 'link_sent',
      createdAt: 'created_at'
    },
    notifications: {
      isRead: 'is_read',
      createdAt: 'created_at'
    },
    support_requests: {
      studentId: 'student_id',
      moduleId: 'module_id',
      lessonId: 'lesson_id',
      meetingLink: 'meeting_link',
      scheduledAt: 'scheduled_at',
      createdAt: 'created_at'
    },
    profile_update_requests: {
      studentId: 'student_id',
      requestedChanges: 'requested_changes',
      adminComment: 'admin_comment',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  };

  return map[table]?.[field] || field;
}

// Build WHERE clause and parameterized values from filter object
function buildWhere(table, filter = {}) {
  const clauses = [];
  const values = [];
  let paramIdx = 1;

  for (const [key, rawVal] of Object.entries(filter)) {
    if (rawVal === undefined) continue;
    const col = toColumn(table, key);

    if (rawVal !== null && typeof rawVal === 'object' && !Array.isArray(rawVal) && !(rawVal instanceof Date)) {
      if (rawVal.$in && Array.isArray(rawVal.$in)) {
        clauses.push(`${col} = ANY($${paramIdx})`);
        values.push(rawVal.$in);
        paramIdx++;
      } else if (rawVal.$ne !== undefined) {
        clauses.push(`${col} != $${paramIdx}`);
        values.push(rawVal.$ne);
        paramIdx++;
      } else if (rawVal.$gte !== undefined) {
        clauses.push(`${col} >= $${paramIdx}`);
        values.push(rawVal.$gte);
        paramIdx++;
      } else if (rawVal.$lte !== undefined) {
        clauses.push(`${col} <= $${paramIdx}`);
        values.push(rawVal.$lte);
        paramIdx++;
      }
    } else {
      let val = rawVal;
      if (key === 'email' && typeof val === 'string') {
        val = val.toLowerCase().trim();
      }
      clauses.push(`${col} = $${paramIdx}`);
      values.push(val);
      paramIdx++;
    }
  }

  const whereSql = clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';
  return { whereSql, values, paramIdx };
}

function attachMethods(modelName, doc) {
  if (!doc) return null;
  
  if (modelName === 'User') {
    doc.comparePassword = async function(plain) {
      if (!this.passwordHash) return false;
      return await bcrypt.compare(plain, this.passwordHash);
    };
  }

  doc.save = async function() {
    const table = TABLE_MAP[modelName] || modelName.toLowerCase();
    
    // Hash password if modified
    if (modelName === 'User' && this.passwordHash && !this.passwordHash.startsWith('$2a$') && !this.passwordHash.startsWith('$2b$')) {
      const salt = await bcrypt.genSalt(10);
      this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    }

    const checkRes = await db.query(`SELECT _id FROM ${table} WHERE _id = $1`, [this._id]);
    if (checkRes.rows.length > 0) {
      const updates = [];
      const values = [];
      let p = 1;
      for (const [k, v] of Object.entries(this)) {
        if (k === '_id' || typeof v === 'function' || k.startsWith('_')) continue;
        const col = toColumn(table, k);
        let val = v;
        if (Array.isArray(v) || (v !== null && typeof v === 'object' && !(v instanceof Date))) {
          val = JSON.stringify(v);
        }
        updates.push(`${col} = $${p}`);
        values.push(val);
        p++;
      }
      values.push(this._id);
      const sql = `UPDATE ${table} SET ${updates.join(', ')} WHERE _id = $${p} RETURNING *`;
      const res = await db.query(sql, values);
      const updated = formatDoc(table, res.rows[0]);
      return attachMethods(modelName, updated);
    } else {
      const cols = ['_id'];
      const placeholders = ['$1'];
      const values = [this._id];
      let p = 2;
      for (const [k, v] of Object.entries(this)) {
        if (k === '_id' || typeof v === 'function' || k.startsWith('_')) continue;
        const col = toColumn(table, k);
        cols.push(col);
        placeholders.push(`$${p}`);
        let val = v;
        if (Array.isArray(v) || (v !== null && typeof v === 'object' && !(v instanceof Date))) {
          val = JSON.stringify(v);
        }
        values.push(val);
        p++;
      }
      const sql = `INSERT INTO ${table} (${cols.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`;
      const res = await db.query(sql, values);
      const created = formatDoc(table, res.rows[0]);
      return attachMethods(modelName, created);
    }
  };

  doc.toObject = function() {
    const o = { ...this };
    delete o.save;
    delete o.toObject;
    delete o.comparePassword;
    return o;
  };

  return doc;
}

class PgQuery {
  constructor(modelName, executor) {
    this.modelName = modelName;
    this.table = TABLE_MAP[modelName] || modelName.toLowerCase();
    this.executor = executor;
    this._sort = null;
    this._limit = null;
    this._skip = null;
    this._populateFields = [];
  }

  sort(sortObj) {
    if (sortObj && typeof sortObj === 'object') {
      const parts = [];
      for (const [k, dir] of Object.entries(sortObj)) {
        const col = toColumn(this.table, k);
        parts.push(`${col} ${dir === -1 || dir === 'desc' ? 'DESC' : 'ASC'}`);
      }
      this._sort = parts.join(', ');
    }
    return this;
  }

  limit(n) {
    this._limit = parseInt(n, 10);
    return this;
  }

  skip(n) {
    this._skip = parseInt(n, 10);
    return this;
  }

  select() {
    return this;
  }

  lean() {
    return this;
  }

  populate(field) {
    if (field) this._populateFields.push(field);
    return this;
  }

  async exec() {
    return this.executor(this);
  }

  then(resolve, reject) {
    return this.exec().then(resolve, reject);
  }

  catch(reject) {
    return this.exec().catch(reject);
  }
}

function createModel(modelName) {
  const table = TABLE_MAP[modelName] || modelName.toLowerCase();

  class ModelInstance {
    constructor(data = {}) {
      Object.assign(this, data);
      if (!this._id) {
        this._id = generateId();
      }
      attachMethods(modelName, this);
    }

    async save() {
      if (modelName === 'User' && this.passwordHash && !this.passwordHash.startsWith('$2a$') && !this.passwordHash.startsWith('$2b$')) {
        const salt = await bcrypt.genSalt(10);
        this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
      }

      const cols = ['_id'];
      const placeholders = ['$1'];
      const values = [this._id];
      let p = 2;
      for (const [k, v] of Object.entries(this)) {
        if (k === '_id' || typeof v === 'function' || k.startsWith('_')) continue;
        const col = toColumn(table, k);
        cols.push(col);
        placeholders.push(`$${p}`);
        let val = v;
        if (Array.isArray(v) || (v !== null && typeof v === 'object' && !(v instanceof Date))) {
          val = JSON.stringify(v);
        }
        values.push(val);
        p++;
      }
      const sql = `INSERT INTO ${table} (${cols.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`;
      const res = await db.query(sql, values);
      const created = formatDoc(table, res.rows[0]);
      return attachMethods(modelName, created);
    }

    toObject() {
      const o = { ...this };
      delete o.save;
      delete o.toObject;
      delete o.comparePassword;
      return o;
    }
  }

  // Static Query Methods
  ModelInstance.find = function(filter = {}) {
    return new PgQuery(modelName, async (queryObj) => {
      let { whereSql, values } = buildWhere(table, filter);
      let sql = `SELECT * FROM ${table} ${whereSql}`;
      if (queryObj._sort) sql += ` ORDER BY ${queryObj._sort}`;
      if (queryObj._limit) sql += ` LIMIT ${queryObj._limit}`;
      if (queryObj._skip) sql += ` OFFSET ${queryObj._skip}`;

      const res = await db.query(sql, values);
      return res.rows.map(r => attachMethods(modelName, formatDoc(table, r)));
    });
  };

  ModelInstance.findOne = function(filter = {}) {
    return new PgQuery(modelName, async () => {
      const { whereSql, values } = buildWhere(table, filter);
      const sql = `SELECT * FROM ${table} ${whereSql} LIMIT 1`;
      const res = await db.query(sql, values);
      return res.rows.length > 0 ? attachMethods(modelName, formatDoc(table, res.rows[0])) : null;
    });
  };

  ModelInstance.findById = function(id) {
    return new PgQuery(modelName, async () => {
      if (!id) return null;
      const idStr = id.toString();
      const res = await db.query(`SELECT * FROM ${table} WHERE _id = $1 LIMIT 1`, [idStr]);
      return res.rows.length > 0 ? attachMethods(modelName, formatDoc(table, res.rows[0])) : null;
    });
  };

  ModelInstance.findByIdAndUpdate = function(id, update = {}, options = {}) {
    return new PgQuery(modelName, async () => {
      if (!id) return null;
      const idStr = id.toString();
      const updates = [];
      const values = [];
      let p = 1;

      for (const [k, rawVal] of Object.entries(update)) {
        if (k === '_id') continue;
        const col = toColumn(table, k);
        let val = rawVal;
        if (Array.isArray(rawVal) || (rawVal !== null && typeof rawVal === 'object' && !(rawVal instanceof Date))) {
          val = JSON.stringify(rawVal);
        }
        updates.push(`${col} = $${p}`);
        values.push(val);
        p++;
      }

      if (updates.length === 0) {
        return ModelInstance.findById(idStr).exec();
      }

      values.push(idStr);
      const sql = `UPDATE ${table} SET ${updates.join(', ')} WHERE _id = $${p} RETURNING *`;
      const res = await db.query(sql, values);
      return res.rows.length > 0 ? attachMethods(modelName, formatDoc(table, res.rows[0])) : null;
    });
  };

  ModelInstance.findOneAndUpdate = function(filter = {}, update = {}, options = {}) {
    return new PgQuery(modelName, async () => {
      const existing = await ModelInstance.findOne(filter).exec();
      if (!existing) return null;
      return ModelInstance.findByIdAndUpdate(existing._id, update, options).exec();
    });
  };

  ModelInstance.findByIdAndDelete = function(id) {
    return new PgQuery(modelName, async () => {
      if (!id) return null;
      const idStr = id.toString();
      const res = await db.query(`DELETE FROM ${table} WHERE _id = $1 RETURNING *`, [idStr]);
      return res.rows.length > 0 ? attachMethods(modelName, formatDoc(table, res.rows[0])) : null;
    });
  };

  ModelInstance.findOneAndDelete = function(filter = {}) {
    return new PgQuery(modelName, async () => {
      const { whereSql, values } = buildWhere(table, filter);
      const sql = `DELETE FROM ${table} WHERE _id IN (SELECT _id FROM ${table} ${whereSql} LIMIT 1) RETURNING *`;
      const res = await db.query(sql, values);
      return res.rows.length > 0 ? attachMethods(modelName, formatDoc(table, res.rows[0])) : null;
    });
  };

  ModelInstance.deleteMany = async function(filter = {}) {
    const { whereSql, values } = buildWhere(table, filter);
    const sql = `DELETE FROM ${table} ${whereSql}`;
    const res = await db.query(sql, values);
    return { deletedCount: res.rowCount };
  };

  ModelInstance.deleteOne = async function(filter = {}) {
    const { whereSql, values } = buildWhere(table, filter);
    const sql = `DELETE FROM ${table} WHERE _id IN (SELECT _id FROM ${table} ${whereSql} LIMIT 1)`;
    const res = await db.query(sql, values);
    return { deletedCount: res.rowCount };
  };

  ModelInstance.countDocuments = function(filter = {}) {
    return new PgQuery(modelName, async () => {
      const { whereSql, values } = buildWhere(table, filter);
      const sql = `SELECT COUNT(*) FROM ${table} ${whereSql}`;
      const res = await db.query(sql, values);
      return parseInt(res.rows[0].count, 10);
    });
  };

  ModelInstance.create = async function(data) {
    const items = Array.isArray(data) ? data : [data];
    const createdDocs = [];
    for (const item of items) {
      const doc = new ModelInstance(item);
      const saved = await doc.save();
      createdDocs.push(saved);
    }
    return Array.isArray(data) ? createdDocs : createdDocs[0];
  };

  return ModelInstance;
}

module.exports = {
  createModel
};
