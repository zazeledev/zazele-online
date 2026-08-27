-- Zazele Online PostgreSQL Database Schema
-- Centralized database for Afrihost cPanel

DROP TABLE IF EXISTS profile_update_requests CASCADE;
DROP TABLE IF EXISTS support_requests CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS event_registrations CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS assignment_questions CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS completed_lessons CASCADE;
DROP TABLE IF EXISTS student_progress CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS modules CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    _id VARCHAR(64) PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    country TEXT NOT NULL,
    province TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    id_document_path TEXT DEFAULT NULL,
    payment_proof_path TEXT DEFAULT NULL,
    approved BOOLEAN DEFAULT FALSE,
    id_verified BOOLEAN DEFAULT FALSE,
    payment_verified BOOLEAN DEFAULT FALSE,
    role VARCHAR(32) DEFAULT 'student',
    status VARCHAR(32) DEFAULT 'active',
    reset_password_token TEXT DEFAULT NULL,
    reset_password_expires TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    enrolled_courses JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE modules (
    _id VARCHAR(64) PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    code VARCHAR(32) DEFAULT NULL,
    order_num INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE lessons (
    _id VARCHAR(64) PRIMARY KEY,
    module_id VARCHAR(64) NOT NULL REFERENCES modules(_id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    youtube_url TEXT DEFAULT '',
    description TEXT DEFAULT '',
    notes_path TEXT DEFAULT NULL,
    quiz TEXT DEFAULT NULL,
    order_num INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE student_progress (
    _id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) NOT NULL REFERENCES users(_id) ON DELETE CASCADE,
    module_id VARCHAR(64) NOT NULL REFERENCES modules(_id) ON DELETE CASCADE,
    current_lesson_order INTEGER DEFAULT 1,
    started_first_lesson_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_lessons JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT uq_student_module UNIQUE (student_id, module_id)
);

CREATE TABLE assignments (
    _id VARCHAR(64) PRIMARY KEY,
    module_id VARCHAR(64) NOT NULL REFERENCES modules(_id) ON DELETE CASCADE,
    student_id VARCHAR(64) NOT NULL REFERENCES users(_id) ON DELETE CASCADE,
    score NUMERIC DEFAULT NULL,
    total_questions INTEGER DEFAULT 70,
    pass_mark INTEGER DEFAULT 80,
    time_limit INTEGER DEFAULT 3600,
    answers JSONB DEFAULT '[]'::jsonb,
    time_started TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    time_submitted TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    time_spent INTEGER DEFAULT NULL,
    retake_count INTEGER DEFAULT 0,
    passed BOOLEAN DEFAULT FALSE,
    status VARCHAR(32) DEFAULT 'not-started',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE assignment_questions (
    _id VARCHAR(64) PRIMARY KEY,
    module_id VARCHAR(64) NOT NULL REFERENCES modules(_id) ON DELETE CASCADE,
    question_number INTEGER NOT NULL,
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_answer VARCHAR(8) NOT NULL,
    section TEXT DEFAULT NULL,
    lesson_reference TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE events (
    _id VARCHAR(64) PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    time TEXT NOT NULL,
    teams_link TEXT DEFAULT '',
    archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE event_registrations (
    _id VARCHAR(64) PRIMARY KEY,
    event_id VARCHAR(64) NOT NULL REFERENCES events(_id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    link_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE notifications (
    _id VARCHAR(64) PRIMARY KEY,
    recipient VARCHAR(64) NOT NULL REFERENCES users(_id) ON DELETE CASCADE,
    sender VARCHAR(64) REFERENCES users(_id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    type VARCHAR(32) DEFAULT 'general',
    link TEXT DEFAULT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE support_requests (
    _id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) NOT NULL REFERENCES users(_id) ON DELETE CASCADE,
    module_id VARCHAR(64) NOT NULL REFERENCES modules(_id) ON DELETE CASCADE,
    lesson_id VARCHAR(64) NOT NULL REFERENCES lessons(_id) ON DELETE CASCADE,
    details TEXT NOT NULL,
    status VARCHAR(32) DEFAULT 'pending',
    meeting_link TEXT DEFAULT '',
    scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE profile_update_requests (
    _id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) NOT NULL REFERENCES users(_id) ON DELETE CASCADE,
    requested_changes JSONB NOT NULL,
    status VARCHAR(32) DEFAULT 'pending',
    admin_comment TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for optimal performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_lessons_module ON lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_student ON student_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_module ON student_progress(module_id);
CREATE INDEX IF NOT EXISTS idx_assignment_questions_module ON assignment_questions(module_id);
CREATE INDEX IF NOT EXISTS idx_assignments_student ON assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_assignments_module ON assignments(module_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient);
