/**
 * PostgreSQL Data Access Layer for Zazele Online
 * Provides models with Mongoose-compatible query interfaces
 */

const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

function generateId() {
  return crypto.randomBytes(12).toString('hex');
}

// Convert snake_case row to camelCase doc
function formatDoc(tableName, row) {
  if (!row) return null;
  const doc = { ...row };

  // Common conversions
  if (doc._id) doc._id = doc._id.toString();

  switch (tableName) {
    case 'users':
      return {
        _id: doc._id,
        fullName: doc.full_name,
        email: doc.email,
        country: doc.country,
        province: doc.province,
        passwordHash: doc.password_hash,
        contactNumber: doc.contact_number,
        idDocumentPath: doc.id_document_path,
        paymentProofPath: doc.payment_proof_path,
        approved: !!doc.approved,
        idVerified: !!doc.id_verified,
        paymentVerified: !!doc.payment_verified,
        role: doc.role,
        status: doc.status,
        resetPasswordToken: doc.reset_password_token,
        resetPasswordExpires: doc.reset_password_expires,
        enrolledCourses: typeof doc.enrolled_courses === 'string' ? JSON.parse(doc.enrolled_courses) : (doc.enrolled_courses || []),
        createdAt: doc.created_at,
        updatedAt: doc.updated_at,
        comparePassword: async function(plain) {
          return bcrypt.compare(plain, this.passwordHash);
        },
        save: async function() {
          if (this.isModifiedPassword) {
            const salt = await bcrypt.genSalt(10);
            this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
            this.isModifiedPassword = false;
          }
          const res = await db.query(`
            UPDATE users SET
              full_name = $1, email = $2, country = $3, province = $4,
              password_hash = $5, contact_number = $6, id_document_path = $7,
              payment_proof_path = $8, approved = $9, id_verified = $10,
              payment_verified = $11, role = $12, status = $13,
              reset_password_token = $14, reset_password_expires = $15,
              enrolled_courses = $16, updated_at = NOW()
            WHERE _id = $17
            RETURNING *
          `, [
            this.fullName, (this.email || '').toLowerCase().trim(), this.country, this.province,
            this.passwordHash, this.contactNumber, this.idDocumentPath,
            this.paymentProofPath, this.approved, this.idVerified,
            this.paymentVerified, this.role, this.status,
            this.resetPasswordToken, this.resetPasswordExpires,
            JSON.stringify(this.enrolledCourses || []), this._id
          ]);
          return formatDoc('users', res.rows[0]);
        },
        toObject: function() {
          const o = { ...this };
          delete o.comparePassword;
          delete o.save;
          delete o.toObject;
          return o;
        }
      };

    case 'modules':
      return {
        _id: doc._id,
        title: doc.title,
        description: doc.description || '',
        code: doc.code,
        order: doc.order_num,
        createdAt: doc.created_at,
        toObject: function() { return { ...this }; }
      };

    case 'lessons':
      return {
        _id: doc._id,
        moduleId: doc.module_id,
        title: doc.title,
        youtubeURL: doc.youtube_url || '',
        description: doc.description || '',
        notesPath: doc.notes_path,
        quiz: doc.quiz,
        order: doc.order_num,
        createdAt: doc.created_at,
        toObject: function() { return { ...this }; }
      };

    case 'student_progress':
      return {
        _id: doc._id,
        studentId: doc.student_id,
        moduleId: doc.module_id,
        currentLessonOrder: doc.current_lesson_order || 1,
        startedFirstLessonDate: doc.started_first_lesson_date,
        enrollmentDate: doc.enrollment_date,
        completedLessons: typeof doc.completed_lessons === 'string' ? JSON.parse(doc.completed_lessons) : (doc.completed_lessons || []),
        createdAt: doc.created_at,
        updatedAt: doc.updated_at,
        save: async function() {
          const res = await db.query(`
            UPDATE student_progress SET
              current_lesson_order = $1, started_first_lesson_date = $2,
              completed_lessons = $3, updated_at = NOW()
            WHERE _id = $4
            RETURNING *
          `, [
            this.currentLessonOrder, this.startedFirstLessonDate,
            JSON.stringify(this.completedLessons || []), this._id
          ]);
          return formatDoc('student_progress', res.rows[0]);
        },
        toObject: function() { return { ...this }; }
      };

    case 'assignments':
      return {
        _id: doc._id,
        moduleId: doc.module_id,
        studentId: doc.student_id,
        score: doc.score !== null ? parseFloat(doc.score) : null,
        totalQuestions: doc.total_questions || 70,
        passMark: doc.pass_mark || 80,
        timeLimit: doc.time_limit || 3600,
        answers: typeof doc.answers === 'string' ? JSON.parse(doc.answers) : (doc.answers || []),
        timeStarted: doc.time_started,
        timeSubmitted: doc.time_submitted,
        timeSpent: doc.time_spent,
        retakeCount: doc.retake_count || 0,
        passed: !!doc.passed,
        status: doc.status || 'not-started',
        createdAt: doc.created_at,
        save: async function() {
          const res = await db.query(`
            UPDATE assignments SET
              score = $1, answers = $2, time_started = $3,
              time_submitted = $4, time_spent = $5, retake_count = $6,
              passed = $7, status = $8
            WHERE _id = $9
            RETURNING *
          `, [
            this.score, JSON.stringify(this.answers || []), this.timeStarted,
            this.timeSubmitted, this.timeSpent, this.retakeCount,
            this.passed, this.status, this._id
          ]);
          return formatDoc('assignments', res.rows[0]);
        },
        toObject: function() { return { ...this }; }
      };

    case 'assignment_questions':
      return {
        _id: doc._id,
        moduleId: doc.module_id,
        questionNumber: doc.question_number,
        question: doc.question,
        options: typeof doc.options === 'string' ? JSON.parse(doc.options) : (doc.options || {}),
        correctAnswer: doc.correct_answer,
        section: doc.section,
        lessonReference: doc.lesson_reference,
        createdAt: doc.created_at,
        toObject: function() { return { ...this }; }
      };

    case 'events':
      return {
        _id: doc._id,
        name: doc.name,
        description: doc.description,
        date: doc.date,
        time: doc.time,
        teamsLink: doc.teams_link,
        archived: !!doc.archived,
        createdAt: doc.created_at,
        toObject: function() { return { ...this }; }
      };

    case 'event_registrations':
      return {
        _id: doc._id,
        eventId: doc.event_id,
        fullName: doc.full_name,
        email: doc.email,
        contactNumber: doc.contact_number,
        linkSent: !!doc.link_sent,
        createdAt: doc.created_at,
        toObject: function() { return { ...this }; }
      };

    case 'notifications':
      return {
        _id: doc._id,
        recipient: doc.recipient,
        sender: doc.sender,
        message: doc.message,
        type: doc.type,
        link: doc.link,
        isRead: !!doc.is_read,
        createdAt: doc.created_at,
        save: async function() {
          const res = await db.query(`
            UPDATE notifications SET is_read = $1 WHERE _id = $2 RETURNING *
          `, [this.isRead, this._id]);
          return formatDoc('notifications', res.rows[0]);
        },
        toObject: function() { return { ...this }; }
      };

    case 'support_requests':
      return {
        _id: doc._id,
        studentId: doc.student_id,
        moduleId: doc.module_id,
        lessonId: doc.lesson_id,
        details: doc.details,
        status: doc.status,
        meetingLink: doc.meeting_link,
        scheduledAt: doc.scheduled_at,
        createdAt: doc.created_at,
        toObject: function() { return { ...this }; }
      };

    case 'profile_update_requests':
      return {
        _id: doc._id,
        studentId: doc.student_id,
        requestedChanges: typeof doc.requested_changes === 'string' ? JSON.parse(doc.requested_changes) : (doc.requested_changes || {}),
        status: doc.status,
        adminComment: doc.admin_comment,
        createdAt: doc.created_at,
        updatedAt: doc.updated_at,
        toObject: function() { return { ...this }; }
      };

    default:
      return doc;
  }
}

module.exports = {
  generateId,
  formatDoc
};
