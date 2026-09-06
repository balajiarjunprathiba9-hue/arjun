-- =======================================================
-- Database Seed Data for Capstone Project
-- =======================================================

USE capstone_db;

-- Clear existing data
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE students;
TRUNCATE TABLE courses;
SET FOREIGN_KEY_CHECKS = 1;

-- Insert Seed Courses
INSERT INTO courses (course_id, course_code, title) VALUES
(1, 'CS101', 'Database Systems'),
(2, 'CS102', 'Operating Systems'),
(3, 'CS103', 'Computer Networks');

-- Insert Seed Students (Referencing courses 1 and 2)
INSERT INTO students (student_id, name, email, course_id) VALUES
(1, 'Ananya', 'ananya@simats.edu', 1),
(2, 'Kavin',  'kavin@simats.edu',  1),
(3, 'Arun',   'arun@simats.edu',   2);
