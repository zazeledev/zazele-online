const fs = require('fs');
const path = require('path');

const exportDir = path.resolve(__dirname, '../db-backup-export');

function readJson(f) {
  const p = path.join(exportDir, f);
  if (!fs.existsSync(p)) return [];
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function esc(str) {
  if (str === null || str === undefined) return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}

function escJson(obj) {
  if (obj === null || obj === undefined) return "'[]'::jsonb";
  return "'" + JSON.stringify(obj).replace(/'/g, "''") + "'::jsonb";
}

const schemaSql = fs.readFileSync(path.resolve(__dirname, '../src/db/schema.sql'), 'utf8');
let out = schemaSql + '\n\n-- ================= DATA INSERTS =================\n\n';

const users = readJson('users.json');
for (const u of users) {
  out += `INSERT INTO users (_id, full_name, email, country, province, password_hash, contact_number, id_document_path, payment_proof_path, approved, id_verified, payment_verified, role, status, enrolled_courses, created_at, updated_at) VALUES (${esc(u._id)}, ${esc(u.fullName)}, ${esc((u.email || '').toLowerCase().trim())}, ${esc(u.country)}, ${esc(u.province)}, ${esc(u.passwordHash)}, ${esc(u.contactNumber)}, ${esc(u.idDocumentPath)}, ${esc(u.paymentProofPath)}, ${!!u.approved}, ${!!u.idVerified}, ${!!u.paymentVerified}, ${esc(u.role || 'student')}, ${esc(u.status || 'active')}, ${escJson(u.enrolledCourses || [])}, ${esc(u.createdAt)}, ${esc(u.updatedAt)}) ON CONFLICT (_id) DO NOTHING;\n`;
}

const modules = readJson('modules.json');
for (const m of modules) {
  out += `INSERT INTO modules (_id, title, description, code, order_num, created_at) VALUES (${esc(m._id)}, ${esc(m.title)}, ${esc(m.description || '')}, ${esc(m.code)}, ${m.order || 1}, ${esc(m.createdAt)}) ON CONFLICT (_id) DO NOTHING;\n`;
}

const lessons = readJson('lessons.json');
for (const l of lessons) {
  out += `INSERT INTO lessons (_id, module_id, title, youtube_url, description, notes_path, quiz, order_num, created_at) VALUES (${esc(l._id)}, ${esc(l.moduleId)}, ${esc(l.title)}, ${esc(l.youtubeURL || '')}, ${esc(l.description || '')}, ${esc(l.notesPath)}, ${esc(l.quiz)}, ${l.order || 1}, ${esc(l.createdAt)}) ON CONFLICT (_id) DO NOTHING;\n`;
}

const progresses = readJson('studentprogresses.json');
for (const p of progresses) {
  out += `INSERT INTO student_progress (_id, student_id, module_id, current_lesson_order, started_first_lesson_date, enrollment_date, completed_lessons, created_at, updated_at) VALUES (${esc(p._id)}, ${esc(p.studentId)}, ${esc(p.moduleId)}, ${p.currentLessonOrder || 1}, ${esc(p.startedFirstLessonDate)}, ${esc(p.enrollmentDate)}, ${escJson(p.completedLessons || [])}, ${esc(p.createdAt)}, ${esc(p.updatedAt)}) ON CONFLICT (_id) DO NOTHING;\n`;
}

const assignments = readJson('assignments.json');
for (const a of assignments) {
  out += `INSERT INTO assignments (_id, module_id, student_id, score, total_questions, pass_mark, time_limit, answers, time_started, time_submitted, time_spent, retake_count, passed, status, created_at) VALUES (${esc(a._id)}, ${esc(a.moduleId)}, ${esc(a.studentId)}, ${a.score !== undefined && a.score !== null ? a.score : 'NULL'}, ${a.totalQuestions || 70}, ${a.passMark || 80}, ${a.timeLimit || 3600}, ${escJson(a.answers || [])}, ${esc(a.timeStarted)}, ${esc(a.timeSubmitted)}, ${a.timeSpent !== undefined && a.timeSpent !== null ? a.timeSpent : 'NULL'}, ${a.retakeCount || 0}, ${!!a.passed}, ${esc(a.status || 'not-started')}, ${esc(a.createdAt)}) ON CONFLICT (_id) DO NOTHING;\n`;
}

const questions = readJson('assignmentquestions.json');
for (const q of questions) {
  out += `INSERT INTO assignment_questions (_id, module_id, question_number, question, options, correct_answer, section, lesson_reference, created_at) VALUES (${esc(q._id)}, ${esc(q.moduleId)}, ${q.questionNumber || 1}, ${esc(q.question)}, ${escJson(q.options || {})}, ${esc(q.correctAnswer || 'a')}, ${esc(q.section)}, ${esc(q.lessonReference)}, ${esc(q.createdAt)}) ON CONFLICT (_id) DO NOTHING;\n`;
}

const events = readJson('events.json');
for (const e of events) {
  out += `INSERT INTO events (_id, name, description, date, time, teams_link, archived, created_at) VALUES (${esc(e._id)}, ${esc(e.name)}, ${esc(e.description)}, ${esc(e.date)}, ${esc(e.time)}, ${esc(e.teamsLink || '')}, ${!!e.archived}, ${esc(e.createdAt)}) ON CONFLICT (_id) DO NOTHING;\n`;
}

const registrations = readJson('eventregistrations.json');
for (const r of registrations) {
  out += `INSERT INTO event_registrations (_id, event_id, full_name, email, contact_number, link_sent, created_at) VALUES (${esc(r._id)}, ${esc(r.eventId)}, ${esc(r.fullName)}, ${esc(r.email)}, ${esc(r.contactNumber)}, ${!!r.linkSent}, ${esc(r.createdAt)}) ON CONFLICT (_id) DO NOTHING;\n`;
}

const notifications = readJson('notifications.json');
for (const n of notifications) {
  out += `INSERT INTO notifications (_id, recipient, sender, message, type, link, is_read, created_at) VALUES (${esc(n._id)}, ${esc(n.recipient)}, ${esc(n.sender)}, ${esc(n.message)}, ${esc(n.type || 'general')}, ${esc(n.link)}, ${!!n.isRead}, ${esc(n.createdAt)}) ON CONFLICT (_id) DO NOTHING;\n`;
}

const destPath = path.resolve(__dirname, '../src/db/full_migration.sql');
fs.writeFileSync(destPath, out, 'utf8');
console.log(`✅ Generated full_migration.sql (${out.length} bytes, ${(out.length / 1024).toFixed(1)} KB)`);
