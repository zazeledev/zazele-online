/**
 * Migration script from MongoDB Atlas JSON Export to PostgreSQL
 * Preserves all users, bcrypt password hashes, student progress records, courses, lessons, and questions.
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('../src/config/db');

const exportDir = path.resolve(__dirname, '../db-backup-export');

function readJson(filename) {
  const file = path.join(exportDir, filename);
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

async function migrate() {
  console.log('==================================================');
  console.log('  Zazele Online - PostgreSQL Database Migration  ');
  console.log('==================================================\n');

  console.log('[1/12] Testing PostgreSQL connection...');
  const conn = await db.testConnection();
  if (!conn.connected) {
    console.error('❌ Failed to connect to PostgreSQL:', conn.error);
    console.error('\nPlease verify your environment variables:');
    console.error('  PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD (or DATABASE_URL)');
    process.exit(1);
  }
  console.log(`✅ Connected to PostgreSQL database: "${conn.database}"\n`);

  console.log('[2/12] Initializing database schema...');
  await db.initSchema();
  console.log('✅ Tables and indexes ready.\n');

  // 1. Users
  console.log('[3/12] Migrating Users...');
  const users = readJson('users.json');
  for (const u of users) {
    await db.query(`
      INSERT INTO users (
        _id, full_name, email, country, province, password_hash,
        contact_number, id_document_path, payment_proof_path,
        approved, id_verified, payment_verified, role, status,
        enrolled_courses, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      ON CONFLICT (_id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        password_hash = EXCLUDED.password_hash,
        approved = EXCLUDED.approved,
        id_verified = EXCLUDED.id_verified,
        payment_verified = EXCLUDED.payment_verified,
        role = EXCLUDED.role,
        status = EXCLUDED.status,
        updated_at = EXCLUDED.updated_at
    `, [
      u._id,
      u.fullName || '',
      (u.email || '').toLowerCase().trim(),
      u.country || '',
      u.province || '',
      u.passwordHash || '',
      u.contactNumber || '',
      u.idDocumentPath || null,
      u.paymentProofPath || null,
      !!u.approved,
      !!u.idVerified,
      !!u.paymentVerified,
      u.role || 'student',
      u.status || 'active',
      JSON.stringify(u.enrolledCourses || []),
      u.createdAt || new Date(),
      u.updatedAt || new Date()
    ]);
  }
  console.log(`✅ Migrated ${users.length} users (including passwords & approvals).\n`);

  // 2. Modules
  console.log('[4/12] Migrating Modules...');
  const modules = readJson('modules.json');
  for (const m of modules) {
    await db.query(`
      INSERT INTO modules (_id, title, description, code, order_num, created_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (_id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        order_num = EXCLUDED.order_num
    `, [
      m._id,
      m.title || '',
      m.description || '',
      m.code || null,
      m.order || 1,
      m.createdAt || new Date()
    ]);
  }
  console.log(`✅ Migrated ${modules.length} course modules.\n`);

  // 3. Lessons
  console.log('[5/12] Migrating Lessons...');
  const lessons = readJson('lessons.json');
  for (const l of lessons) {
    await db.query(`
      INSERT INTO lessons (_id, module_id, title, youtube_url, description, notes_path, quiz, order_num, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (_id) DO UPDATE SET
        title = EXCLUDED.title,
        youtube_url = EXCLUDED.youtube_url,
        description = EXCLUDED.description,
        notes_path = EXCLUDED.notes_path,
        order_num = EXCLUDED.order_num
    `, [
      l._id,
      l.moduleId,
      l.title || '',
      l.youtubeURL || '',
      l.description || '',
      l.notesPath || null,
      l.quiz || null,
      l.order || 1,
      l.createdAt || new Date()
    ]);
  }
  console.log(`✅ Migrated ${lessons.length} lessons.\n`);

  // 4. Student Progress
  console.log('[6/12] Migrating Student Progress records...');
  const progresses = readJson('studentprogresses.json');
  for (const p of progresses) {
    await db.query(`
      INSERT INTO student_progress (
        _id, student_id, module_id, current_lesson_order,
        started_first_lesson_date, enrollment_date, completed_lessons,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (_id) DO UPDATE SET
        current_lesson_order = EXCLUDED.current_lesson_order,
        started_first_lesson_date = EXCLUDED.started_first_lesson_date,
        completed_lessons = EXCLUDED.completed_lessons,
        updated_at = EXCLUDED.updated_at
    `, [
      p._id,
      p.studentId,
      p.moduleId,
      p.currentLessonOrder || 1,
      p.startedFirstLessonDate || null,
      p.enrollmentDate || new Date(),
      JSON.stringify(p.completedLessons || []),
      p.createdAt || new Date(),
      p.updatedAt || new Date()
    ]);
  }
  console.log(`✅ Migrated ${progresses.length} student progress records.\n`);

  // 5. Assignments
  console.log('[7/12] Migrating Assignments...');
  const assignments = readJson('assignments.json');
  for (const a of assignments) {
    await db.query(`
      INSERT INTO assignments (
        _id, module_id, student_id, score, total_questions,
        pass_mark, time_limit, answers, time_started,
        time_submitted, time_spent, retake_count, passed,
        status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      ON CONFLICT (_id) DO UPDATE SET
        score = EXCLUDED.score,
        answers = EXCLUDED.answers,
        time_submitted = EXCLUDED.time_submitted,
        passed = EXCLUDED.passed,
        status = EXCLUDED.status
    `, [
      a._id,
      a.moduleId,
      a.studentId,
      a.score !== undefined ? a.score : null,
      a.totalQuestions || 70,
      a.passMark || 80,
      a.timeLimit || 3600,
      JSON.stringify(a.answers || []),
      a.timeStarted || null,
      a.timeSubmitted || null,
      a.timeSpent || null,
      a.retakeCount || 0,
      !!a.passed,
      a.status || 'not-started',
      a.createdAt || new Date()
    ]);
  }
  console.log(`✅ Migrated ${assignments.length} assignments.\n`);

  // 6. Assignment Questions
  console.log('[8/12] Migrating Assignment Questions...');
  const questions = readJson('assignmentquestions.json');
  for (const q of questions) {
    await db.query(`
      INSERT INTO assignment_questions (
        _id, module_id, question_number, question,
        options, correct_answer, section, lesson_reference, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (_id) DO UPDATE SET
        question = EXCLUDED.question,
        options = EXCLUDED.options,
        correct_answer = EXCLUDED.correct_answer,
        section = EXCLUDED.section,
        lesson_reference = EXCLUDED.lesson_reference
    `, [
      q._id,
      q.moduleId,
      q.questionNumber || 1,
      q.question || '',
      JSON.stringify(q.options || {}),
      q.correctAnswer || 'a',
      q.section || null,
      q.lessonReference || null,
      q.createdAt || new Date()
    ]);
  }
  console.log(`✅ Migrated ${questions.length} assignment questions.\n`);

  // 7. Events
  console.log('[9/12] Migrating Events...');
  const events = readJson('events.json');
  for (const e of events) {
    await db.query(`
      INSERT INTO events (_id, name, description, date, time, teams_link, archived, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (_id) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        teams_link = EXCLUDED.teams_link
    `, [
      e._id,
      e.name || '',
      e.description || '',
      e.date || new Date(),
      e.time || '',
      e.teamsLink || '',
      !!e.archived,
      e.createdAt || new Date()
    ]);
  }
  console.log(`✅ Migrated ${events.length} events.\n`);

  // 8. Event Registrations
  console.log('[10/12] Migrating Event Registrations...');
  const registrations = readJson('eventregistrations.json');
  for (const r of registrations) {
    await db.query(`
      INSERT INTO event_registrations (_id, event_id, full_name, email, contact_number, link_sent, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (_id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        link_sent = EXCLUDED.link_sent
    `, [
      r._id,
      r.eventId,
      r.fullName || '',
      r.email || '',
      r.contactNumber || '',
      !!r.linkSent,
      r.createdAt || new Date()
    ]);
  }
  console.log(`✅ Migrated ${registrations.length} event registrations.\n`);

  // 9. Notifications
  console.log('[11/12] Migrating Notifications...');
  const notifications = readJson('notifications.json');
  for (const n of notifications) {
    await db.query(`
      INSERT INTO notifications (_id, recipient, sender, message, type, link, is_read, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (_id) DO UPDATE SET
        message = EXCLUDED.message,
        is_read = EXCLUDED.is_read
    `, [
      n._id,
      n.recipient,
      n.sender || null,
      n.message || '',
      n.type || 'general',
      n.link || null,
      !!n.isRead,
      n.createdAt || new Date()
    ]);
  }
  console.log(`✅ Migrated ${notifications.length} notifications.\n`);

  // 10. Verification
  console.log('[12/12] Verifying Record Counts in PostgreSQL...');
  const counts = await Promise.all([
    db.query('SELECT COUNT(*) FROM users'),
    db.query('SELECT COUNT(*) FROM modules'),
    db.query('SELECT COUNT(*) FROM lessons'),
    db.query('SELECT COUNT(*) FROM student_progress'),
    db.query('SELECT COUNT(*) FROM assignments'),
    db.query('SELECT COUNT(*) FROM assignment_questions'),
    db.query('SELECT COUNT(*) FROM events'),
    db.query('SELECT COUNT(*) FROM event_registrations'),
    db.query('SELECT COUNT(*) FROM notifications')
  ]);

  console.log('--------------------------------------------------');
  console.log('  Database Migration Summary                      ');
  console.log('--------------------------------------------------');
  console.log(`  Users:                ${counts[0].rows[0].count} / ${users.length}`);
  console.log(`  Modules:              ${counts[1].rows[0].count} / ${modules.length}`);
  console.log(`  Lessons:              ${counts[2].rows[0].count} / ${lessons.length}`);
  console.log(`  Student Progress:     ${counts[3].rows[0].count} / ${progresses.length}`);
  console.log(`  Assignments:          ${counts[4].rows[0].count} / ${assignments.length}`);
  console.log(`  Assignment Questions: ${counts[5].rows[0].count} / ${questions.length}`);
  console.log(`  Events:               ${counts[6].rows[0].count} / ${events.length}`);
  console.log(`  Event Registrations:  ${counts[7].rows[0].count} / ${registrations.length}`);
  console.log(`  Notifications:        ${counts[8].rows[0].count} / ${notifications.length}`);
  console.log('--------------------------------------------------\n');
  console.log('🎉 MIGRATION COMPLETED SUCCESSFULLY!');
  process.exit(0);
}

migrate().catch(err => {
  console.error('❌ Migration Error:', err);
  process.exit(1);
});
