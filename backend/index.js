// Import required modules
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');


// Load environment variables from .env file
dotenv.config();

// Create an Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = 5002;

// Middleware to parse JSON bodies
app.use(express.json());

// Create a MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ?';

  db.query(query, [username], (err, results) => {
      if (err) {
          console.error('Database query error:', err.message); // Log error details
          return res.status(500).json({ message: 'Server error' });
      }

      if (results.length === 0) {
          return res.status(401).json({ message: 'Invalid username or password' });
      }

      const user = results[0];

      // Log the user data to ensure `student_id` is included in the results
      console.log('User:', user);

      if (user.password === password) {
          const role = user.role; // Get the role from the database
          const studentID = user.student_id; // Ensure this is correctly populated in the DB
          return res.status(200).json({
              message: 'Login successful',
              userRole: role, // Send the role in the response
              studentId: studentID, // Send student_id correctly
          });
      } else {
          return res.status(401).json({ message: 'Invalid username or password' });
      }
  });
});



// student details
app.post('/student', (req, res) => {
  const { student_id } = req.body;  // Expecting student_id to be in the JSON payload

  if (!student_id) {
    return res.status(400).json({ error: 'Student ID is required' });
  }

  // Query to fetch student information
  const studentQuery = `
    SELECT 
      s.name, s.student_id, s.contact, s.gender, s.enrollment_date, s.address, s.dob, 
      s.semester, s.section_id, s.program_id,
      sec.section_name AS section_name, 
      prog.program_name AS program_name
    FROM students s
    LEFT JOIN sections sec ON s.section_id = sec.section_id
    LEFT JOIN programs prog ON s.program_id = prog.program_id
    WHERE s.student_id = ?;
  `;

  // Execute the query
  db.execute(studentQuery, [student_id], (err, result) => {
    if (err) {
      console.error('Database error:', err);  // Add error logging
      return res.status(500).json({ error: 'Error fetching student data' });
    }

    if (result.length > 0) {
      const student = result[0];
      
      // Format the data
      const studentData = {
        name: student.name,
        roll_no: `${student.name.replace(/\s+/g, '')}_${student.student_id}`,
        email: `${student.name.replace(/\s+/g, '')}_${student.student_id}@university.edu.pk`,
        contact: student.contact,
        gender: student.gender,
        // Format date to remove time (YYYY-MM-DD)
        enrollment_date: new Date(student.enrollment_date).toISOString().split('T')[0], 
        address: student.address,
        // Format dob to remove time (YYYY-MM-DD)
        dob: new Date(student.dob).toISOString().split('T')[0], 
        semester: student.semester,
        section_name: student.section_name,
        program_name: student.program_name,
      };
      

      return res.json(studentData);
    } else {
      return res.status(404).json({ error: 'Student not found' });
    }
  });
});

app.post('/courses', (req, res) => {
  const { student_id } = req.body; // Expecting student_id to be in the JSON payload

  if (!student_id) {
    return res.status(400).json({ error: 'Student ID is required' });
  }

  // Query to fetch courses and attendance for the student
  const studentQuery = `
    SELECT 
      c.course_id,
      c.course_name,
      c.description,
      a.attendance_date,
      a.status 
    FROM 
      courses c
    JOIN 
      student_courses sc ON c.course_id = sc.course_id
    LEFT JOIN 
      attendance a ON c.course_id = a.course_id AND a.student_id = sc.student_id
    WHERE 
      sc.student_id = ?;
  `;

  // Execute the query
  db.execute(studentQuery, [student_id], (err, result) => {
    if (err) {
      console.error('Database error:', err); // Add error logging
      return res.status(500).json({ error: 'Error fetching courses and attendance' });
    }

    if (result.length > 0) {
      // Structure the courses and attendance data
      const courses = result.reduce((acc, course) => {
        const existingCourse = acc.find(c => c.course_id === course.course_id);

        if (existingCourse) {
          // Add attendance to the existing course
          if (course.attendance_date) {
            existingCourse.attendance.push({
              attendance_date: course.attendance_date,
              status: course.status
            });
          }
        } else {
          // Create a new course with attendance
          acc.push({
            course_id: course.course_id,
            course_name: course.course_name,
            description: course.description,
            attendance: course.attendance_date ? [{
              attendance_date: course.attendance_date,
              status: course.status
            }] : []
          });
        }

        return acc;
      }, []);

      return res.json({ courses });
    } else {
      return res.status(404).json({ error: 'No courses found for this student' });
    }
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
