-- =======================================================
-- Database Schema for Capstone Project:
-- Interactive Database System Structure Visualization Tool
-- =======================================================

CREATE DATABASE IF NOT EXISTS capstone_db;
USE capstone_db;

-- Drop child tables first if they exist to prevent FK constraint failures
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS courses;

-- 1. Courses Table (Parent Table)
CREATE TABLE courses (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    course_code VARCHAR(20) NOT NULL UNIQUE,
    title VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Students Table (Child Table with Foreign Key)
CREATE TABLE students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    course_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_students_course 
        FOREIGN KEY (course_id) 
        REFERENCES courses(course_id) 
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
