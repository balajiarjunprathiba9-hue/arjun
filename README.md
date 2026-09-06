# Interactive Database System Structure Visualization Tool for Engineering Education

A full-stack, developer-grade educational web application designed for engineering students to visually comprehend database system structures, relational schemas, primary keys, foreign keys, relationships, SQL query execution flows, database mutations (INSERT/UPDATE/DELETE), and referential integrity constraints.

The platform embodies the educational pedagogical paradigm:
$$\text{THEORY} \longrightarrow \text{VISUALIZATION} \longrightarrow \text{INTERACTION} \longrightarrow \text{RESULT} \longrightarrow \text{LEARNING FEEDBACK}$$

---

## Architecture & Technology Stack

```
┌────────────────────────────────────────────────────────────┐
│                    REACT FRONTEND (Vite)                   │
│   React 18, React Router v6, Tailwind CSS, React Flow,     │
│       Monaco Editor (SQL), Lucide Icons, Axios             │
└────────────────────────────┬───────────────────────────────┘
                             │ HTTP / REST APIs (Port 5173 ↔ 5000)
┌────────────────────────────▼───────────────────────────────┐
│                    EXPRESS.JS BACKEND                      │
│   REST API Endpoints, MySQL Metadata Introspection,        │
│   SQL Query Analyzer & Flow Generator, Safe Executor,      │
│          Educational Error & Feedback Engine               │
└────────────────────────────┬───────────────────────────────┘
                             │ mysql2 / information_schema
┌────────────────────────────▼───────────────────────────────┐
│                     MYSQL DATABASE                         │
│   capstone_db: courses (PK: course_id)                     │
│                students (PK: student_id, FK: course_id)   │
└────────────────────────────────────────────────────────────┘
```

- **Frontend**:
  - **React 18 & Vite**: Blazing fast modern frontend tooling
  - **Tailwind CSS**: Dark developer-tool themed interface with custom palettes
  - **React Flow (`@xyflow/react`)**: Interactive, draggable entity-relationship canvas
  - **Monaco Editor (`@monaco-editor/react`)**: VS Code-grade SQL code editor with syntax highlighting
  - **Lucide React**: Clean developer-tool icons
  - **React Router v6**: Single-page application navigation
- **Backend**:
  - **Node.js & Express.js**: REST API server
  - **mysql2/promise**: High-performance MySQL connection pooling and query execution
  - **Dual-Mode Architecture**: Full live MySQL connection with automated fallback to an in-memory simulation engine for offline educational resilience
  - **Information Schema Introspection**: Introspects real database metadata dynamically
- **Database**:
  - **MySQL 8.0+**: Relational database (`capstone_db`)

---

## Database Schema & Referential Integrity

### Schema Definition (`database/schema.sql`)

```sql
CREATE DATABASE IF NOT EXISTS capstone_db;
USE capstone_db;

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
```

### Initial Seed Data (`database/seed.sql`)

```sql
INSERT INTO courses (course_id, course_code, title) VALUES
(1, 'CS101', 'Database Systems'),
(2, 'CS102', 'Operating Systems'),
(3, 'CS103', 'Computer Networks');

INSERT INTO students (student_id, name, email, course_id) VALUES
(1, 'Ananya', 'ananya@simats.edu', 1),
(2, 'Kavin',  'kavin@simats.edu',  1),
(3, 'Arun',   'arun@simats.edu',   2);
```

---

## Core Application Modules

### 1. Dashboard (`/dashboard`)
- Live system metrics: Tables (2), Relationships (1), Students, Courses, Queries executed
- Quick launch tiles to the 5 learning modules
- Real-time audit activity log tracking queries, schema refreshes, and database resets

### 2. Schema Visualization (`/schema`)
- Introspects metadata directly from MySQL `information_schema`
- Visual table cards detailing column attributes, types (`INT`, `VARCHAR`), nullability, and badges:
  - 🔑 Primary Key (`course_id`, `student_id`)
  - 🔗 Foreign Key (`students.course_id → courses.course_id`)
  - Unique Constraints & Auto Increment indicators
- Live data view inspecting real table rows with column-level types and instantaneous refresh

### 3. ER Diagram & Relationships (`/relationships`)
- Interactive graph built with **React Flow**
- Visualizes `courses (1) ────1:N────► students (N)`
- Displays parent table, child table, foreign key name, and constraint rules (`ON DELETE CASCADE`)
- Clicking any table or edge highlights the node and opens the relational inspector panel

### 4. SQL Execution Lab (`/sql`)
- Monaco Editor with dark mode and syntax highlighting
- Safe query execution classifier:
  - **READ**: `SELECT`, `SHOW`, `DESCRIBE`
  - **MUTATION**: `INSERT`, `UPDATE`, `DELETE`
  - **RESTRICTED**: `DROP`, `ALTER`, `TRUNCATE` (safely blocked to protect educational sandbox)
- **Visual Relational Query Flow Pipeline**:
  `SQL QUERY` → `PARSE` → `SCAN [students]` → `JOIN [courses] ON course_id` → `FILTER WHERE CS101` → `PROJECT` → `RESULT EMITTED`
- Result table highlighting matching rows (e.g. Ananya & Kavin for CS101)
- Plain-English Educational Explanation panel ("What happened?", "Tables Used", "Rows Returned")

### 5. Interactive Database Operations (`/operations`)
- Dedicated tabs for **INSERT**, **UPDATE**, and **DELETE**
- **Before / After Diff Visualization**:
  - Renders `Database State: BEFORE` vs `Database State: AFTER` side-by-side
  - Highlights newly inserted rows in green, updated rows in blue/amber, and deleted rows in rose
- Preloaded quick-test buttons:
  - Preload "Riya" (CS101)
  - Preload Foreign Key Error (Course ID: 99)
  - Preload Duplicate Unique Email

### 6. Educational Learning Feedback (`/learning`)
- Reusable `<LearningFeedback />` component translating engine errors into lessons:
  - **Error 1452 (Foreign Key Constraint Error)**:
    - Explains why `course_id = 99` failed: parent course does not exist
    - Renders visual ASCII/diagram hierarchy showing `courses` (1, 2, 3) vs orphaned student referencing `99` (❌)
    - Provides actionable recovery suggestions
  - **Error 1062 (Duplicate Unique Entry)**: Explains entity integrity rules for emails
  - **Destructive Command Guard**: Explains DBA privilege separation and sandboxing
- Core theoretical concept cards with interactive deep dives (PK, FK, Referential Integrity, JOIN, CASCADE)

---

## Environment Variables

### Backend Configuration (`backend/.env`)

| Variable | Description | Default Value |
| :--- | :--- | :--- |
| `DB_HOST` | Hostname of the MySQL server | `localhost` |
| `DB_PORT` | Port of the MySQL server | `3306` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | *(user provided)* |
| `DB_NAME` | Database name | `capstone_db` |
| `PORT` | Express server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |

---

## Installation & Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- MySQL Server 8.0+ (optional, app runs dual-mode with full simulation sandbox if MySQL credentials are not yet configured)

### Step 1: Clone or Open Project
```bash
cd c:\Users\arjun_m0kz5x4\Downloads\arjun
```

### Step 2: Initialize MySQL Database (If running live MySQL)
Open your MySQL terminal or Workbench and run:
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

### Step 3: Install Dependencies
Run the unified install script or install in both folders:
```bash
# In backend directory
cd backend
npm install

# In frontend directory
cd ../frontend
npm install
```

### Step 4: Configure Backend Environment
Copy `backend/.env.example` to `backend/.env` and update your MySQL password:
```ini
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=capstone_db
PORT=5000
```

### Step 5: Start the Application

**Terminal 1 (Backend API):**
```bash
cd backend
npm start
# Express runs on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd frontend
npm run dev
# Vite runs on http://localhost:5173
```

Open your browser at: **`http://localhost:5173`**

---

## REST API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | System health, database connection status, and uptime |
| `GET` | `/api/schema` | Complete schema metadata from `information_schema` |
| `GET` | `/api/tables` | List of all tables with column definitions and row counts |
| `GET` | `/api/tables/:tableName` | Actual row records of the specified table |
| `GET` | `/api/relationships` | Discovered foreign key relationships and cardinalities |
| `POST` | `/api/query` | Safe SQL query executor with execution flow & explanation |
| `POST` | `/api/operations/insert` | Insert student with before/after state capture |
| `PUT` | `/api/operations/update` | Update student with row diff tracking |
| `DELETE` | `/api/operations/delete` | Delete student with cascade checking |
| `POST` | `/api/reset` | Resets `capstone_db` to original 3 courses & 3 students |

---

## End-to-End Demo Workflow (Acceptance Testing)

Follow these steps to demonstrate the complete capstone workflow:

1. **Step 1: Open Dashboard (`/dashboard`)**
   - Verify table metrics: 2 tables, 1 relationship, 3 students, 3 courses.
   - Observe live connection status badge in the topbar.
2. **Step 2: Inspect Schema (`/schema`)**
   - View `courses` and `students` cards.
   - Verify 🔑 Primary Key (`course_id`, `student_id`) and 🔗 Foreign Key (`students.course_id`).
   - Switch tabs to inspect live database records.
3. **Step 3: View ER Diagram (`/relationships`)**
   - Click the interactive canvas. Observe `courses 1 ─── N students`.
   - Click `students` node to view relationship details: `students.course_id → courses.course_id` with `ON DELETE CASCADE`.
4. **Step 4: Execute SQL Join Query (`/sql`)**
   - In Monaco Editor, select the preset or run:
     ```sql
     SELECT s.student_id, s.name, c.course_code, c.title
     FROM students AS s
     INNER JOIN courses AS c
       ON s.course_id = c.course_id
     WHERE c.course_code = 'CS101';
     ```
   - Click **[ Run Query ]**.
   - Observe the visual **Query Flow Pipeline**:
     `SQL PARSE` → `SCAN [students]` → `JOIN [courses]` → `FILTER WHERE CS101` → `PROJECT` → `RESULT EMITTED`.
   - In the results table, observe that **Ananya** and **Kavin** are returned and highlighted.
   - Review the beginner-friendly **Query Explanation** card.
5. **Step 5: Insert Student (`/operations`)**
   - Under the **INSERT** tab, click **"Preload Riya (CS101)"** or enter:
     - Name: `Riya`
     - Email: `riya@simats.edu`
     - Course: `ID 1: CS101`
   - Click **INSERT STUDENT**.
   - Observe the **Before → After** visual diff with row 4 (`Riya`) highlighted in green.
6. **Step 6: Update Student (`/operations`)**
   - Switch to the **UPDATE** tab.
   - Select `Riya` and change name to `Riya Sharma`.
   - Click **UPDATE STUDENT**.
   - Observe the diff: `OLD: Riya` → `NEW: Riya Sharma`.
7. **Step 7: Delete Student (`/operations`)**
   - Switch to the **DELETE** tab.
   - Select `Riya Sharma`. Confirm the deletion warning.
   - Click **DELETE STUDENT**.
   - Observe row removed from the table.
8. **Step 8: Trigger Foreign Key Error (`/operations` or `/learning`)**
   - Under INSERT tab, click **"❌ Step 12: Trigger FK Error (course_id: 99)"**.
   - Click **INSERT STUDENT**.
   - Observe that the operation fails safely.
   - Look at the `<LearningFeedback />` component:
     - **What happened?**: Foreign Key Constraint Violation (Error 1452).
     - **Why?**: Course ID 99 does not exist in parent table `courses`.
     - **Visual Hierarchy Diagram**: Displays courses (1, 2, 3) vs orphaned student (❌).
     - **How to fix**: Suggests selecting an existing course ID (1, 2, or 3).
9. **Step 9: Reset Demo Database**
   - Click **Reset Demo DB** in the topbar.
   - Confirm the prompt.
   - Notice the database resets cleanly back to the original 3 courses and 3 students.

---

## Project Structure

```
arjun/
├── README.md                      # Comprehensive project documentation
├── package.json                   # Root workspace scripts
├── database/
│   ├── schema.sql                 # DDL for courses and students
│   └── seed.sql                   # Initial seed data
├── backend/
│   ├── package.json
│   ├── .env.example
│   ├── .env                       # Environment variables
│   └── src/
│       ├── server.js              # Express app & server startup
│       ├── config/
│       │   └── db.js              # MySQL connection pool & dual-mode executor
│       ├── controllers/
│       │   ├── schemaController.js       # Schema, health & reset handlers
│       │   ├── tableController.js        # Table data inspector
│       │   ├── queryController.js        # SQL query validator & runner
│       │   └── operationController.js    # INSERT, UPDATE, DELETE handlers
│       ├── services/
│       │   ├── metadataService.js        # information_schema reader
│       │   ├── sqlExplainerService.js    # Query flow & explanation engine
│       │   └── educationalErrorService.js# MySQL error code → visual lesson converter
│       └── routes/
│           └── api.js             # Consolidated REST endpoints
└── frontend/
    ├── package.json
    ├── vite.config.js             # Vite configuration with /api proxy
    ├── tailwind.config.js         # Custom dark developer palette
    ├── postcss.config.js
    ├── index.html
    └── src/
        ├── App.jsx                # Router & layout
        ├── main.jsx               # Entrypoint
        ├── index.css              # Custom styling & scrollbars
        ├── context/
        │   └── DatabaseContext.jsx# Central state & data synchronization
        ├── components/
        │   ├── common/
        │   │   ├── Sidebar.jsx            # Left navigation
        │   │   ├── Topbar.jsx             # Header with status & reset modal
        │   │   └── ResetDatabaseModal.jsx # Reset confirmation dialog
        │   ├── schema/
        │   │   ├── ColumnRow.jsx          # Attribute row with PK/FK icons
        │   │   ├── TableCard.jsx          # Schema entity card
        │   │   └── DatabaseTable.jsx      # Live data records grid
        │   ├── er/
        │   │   ├── CustomTableNode.jsx    # React Flow custom node
        │   │   ├── ERDiagram.jsx          # Interactive ER canvas
        │   │   └── RelationshipPanel.jsx  # 1:N cardinality inspector
        │   ├── sql/
        │   │   ├── SQLEditor.jsx          # Monaco SQL Editor wrapper
        │   │   ├── QueryFlow.jsx          # Relational execution pipeline
        │   │   ├── QueryResult.jsx        # Output records table
        │   │   └── QueryExplanation.jsx   # Plain-English explanation
        │   ├── operations/
        │   │   ├── InsertForm.jsx         # Insert student form
        │   │   ├── UpdateForm.jsx         # Update student form
        │   │   ├── DeleteForm.jsx         # Delete student form
        │   │   └── BeforeAfterView.jsx    # State transition diff viewer
        │   ├── learning/
        │   │   └── LearningFeedback.jsx   # Pedagogical error/success explainer
        │   └── dashboard/
        │       ├── StatsCard.jsx          # Metric tile
        │       └── ActivityLog.jsx        # Audit log
        └── pages/
            ├── DashboardPage.jsx
            ├── SchemaPage.jsx
            ├── RelationshipsPage.jsx
            ├── SqlLabPage.jsx
            ├── OperationsPage.jsx
            └── LearningPage.jsx
```

---

## Security & Reliability Guardrails
1. **Credentials Isolation**: Database passwords and connection details are strictly isolated in `backend/.env` and never leaked to client bundles.
2. **Destructive Query Protection**: Destructive DDL commands (`DROP`, `ALTER`, `TRUNCATE`) sent via the SQL Lab are intercepted by an educational safety guard that explains database administrator privilege concepts rather than wiping the database.
3. **Dual-Mode Engine**: Allows complete offline classroom demonstration with identical relational constraints even in labs without active MySQL service access.
