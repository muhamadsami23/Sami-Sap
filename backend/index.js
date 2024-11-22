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




const executeQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.query(query, params, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

// Function to get course details
async function getCourseDetails(studentId) {
  const query = `
    SELECT sc.course_id, c.course_name, c.description 
    FROM student_courses sc 
    JOIN courses c ON sc.course_id = c.course_id 
    WHERE sc.student_id = ?`;
  return await executeQuery(query, [studentId]);
}

// Function to get grade items for a course
async function getGradeItems(studentId, courseId) {
  const gradeItems = [];
  let id = 1;

  // Fetch assignments
 
 // Query to get student assignments for a specific course
const studentAssignmentsQuery = `
SELECT sa.assignment_id, sa.obtained_marks
FROM student_assignment sa
JOIN assignments a ON sa.assignment_id = a.assignment_id
WHERE sa.student_id = ? AND a.course_id = ?`;

// Fetch assignment details
const assignmentRows = await executeQuery(studentAssignmentsQuery, [studentId, courseId]);

if (assignmentRows.length > 0) {
const assignmentIds = assignmentRows.map((row) => row.assignment_id);

const assignmentDetailsQuery = `
  SELECT assignment_id, upload_date, total_marks 
  FROM assignments 
  WHERE assignment_id IN (${assignmentIds.map(() => '?').join(',')})`;

const assignments = await executeQuery(assignmentDetailsQuery, assignmentIds);

assignments.forEach((assignment) => {
  const obtainedMarks = assignmentRows.find(
    (row) => row.assignment_id === assignment.assignment_id
  )?.obtained_marks;

  gradeItems.push({
    id: id++,
    student_id: studentId,
    item_id: assignment.assignment_id,
    course_id: courseId,
    description: `Assignment ${gradeItems.length + 1}`,
    upload_date: assignment.upload_date,
    total_marks: assignment.total_marks,
    obtained_marks: obtainedMarks,
    type: 'assignment',
  });
});
}

  // Fetch quizzes
  const quizzesQuery = `
    SELECT * FROM quizzes_tasks
    WHERE student_id = ? AND course_id = ?`;
  const quizzes = await executeQuery(quizzesQuery, [studentId, courseId]);
  quizzes.forEach((quiz, index) => {
    gradeItems.push({
      id: id++,
      student_id: studentId,
      item_id: quiz.quiz_id,
      course_id: courseId,
      description: `Quiz ${index + 1}`,
      upload_date: quiz.upload_date,
      total_marks: quiz.total_marks,
      obtained_marks: quiz.obtained_marks,
      type: 'quiz'
    });
  });

  // Fetch midterm
  const midtermQuery = `
    SELECT * FROM mid_term 
    WHERE student_id = ? AND course_id = ?`;
  const midterms = await executeQuery(midtermQuery, [studentId, courseId]);
  if (midterms.length > 0) {
    const midterm = midterms[0];
    gradeItems.push({
      id: id++,
      student_id: studentId,
      item_id: midterm.mid_term_id,
      course_id: courseId,
      description: 'Midterm Exam',
      total_marks: midterm.total_marks,
      obtained_marks: midterm.obtained_marks,
      type: 'exam'
    });
  }

  // Fetch final
  const finalQuery = `
    SELECT * FROM final_term
    WHERE student_id = ? AND course_id = ?`;
  const finals = await executeQuery(finalQuery, [studentId, courseId]);
  if (finals.length > 0) {
    const final = finals[0];
    gradeItems.push({
      id: id++,
      student_id: studentId,
      item_id: final.final_term_id,
      course_id: courseId,
      description: 'Final Exam',
      total_marks: final.total_marks,
      obtained_marks: final.obtained_marks,
      type: 'exam'
    });
  }

  return gradeItems;
}

// API endpoint to fetch grades
app.post('/grades', async (req, res) => {
  const { student_id } = req.body;

  if (!student_id) {
    return res.status(400).json({ error: 'Student ID is required' });
  }

  try {
    const courses = await getCourseDetails(student_id);
    const coursesWithGrades = await Promise.all(
      courses.map(async (course) => {
        const gradeItems = await getGradeItems(student_id, course.course_id);
        return {
          ...course,
          gradeItems
        };
      })
    );

    res.json(coursesWithGrades);
  } catch (error) {
    console.error('Error fetching grades:', error);
    res.status(500).json({ error: 'An error occurred while fetching grades' });
  }
});


const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = [
  '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
  '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00'
];
const rooms = [
  ...Array.from({ length: 7 }, (_, i) => `A-${i + 1}`),
  ...Array.from({ length: 7 }, (_, i) => `B-${i + 8}`),
  ...Array.from({ length: 8 }, (_, i) => `C-${i + 15}`),
  ...Array.from({ length: 4 }, (_, i) => `D-${i + 23}`),
  ...Array.from({ length: 4 }, (_, i) => `E-${i + 27}`)
];

// API to generate a timetable
app.post('/timetable', (req, res) => {
  const { student_id } = req.body;

  // Fetch student's section
  db.query(
    'SELECT section_id FROM students WHERE student_id = ?',
    [student_id],
    (err, sectionResults) => {
      if (err) {
        console.error('Error fetching section:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (sectionResults.length === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }

      const section_id = sectionResults[0].section_id;

      // Fetch courses for the student's section
      db.query(
        `SELECT c.course_id, c.course_name
         FROM courses c
         JOIN sections sc ON c.course_id = sc.course_id
         WHERE sc.section_id = ?`,
        [section_id],
        (err, courseResults) => {
          if (err) {
            console.error('Error fetching courses:', err);
            return res.status(500).json({ error: 'Internal server error' });
          }

          if (courseResults.length === 0) {
            return res.status(404).json({ error: 'No courses found for this section' });
          }

          // Generate timetable
          const timetable = generateTimetable(courseResults);

          res.json(timetable);
        }
      );
    }
  );
});

// Function to generate timetable
function generateTimetable(courses) {
  const timetable = {};
  days.forEach(day => {
    timetable[day] = [];
  });

  courses.forEach(course => {
    const availableDays = [...days];
    for (let i = 0; i < 4 && availableDays.length > 0; i++) {
      const dayIndex = Math.floor(Math.random() * availableDays.length);
      const day = availableDays[dayIndex];
      availableDays.splice(dayIndex, 1);

      if (timetable[day].length < 4) {
        const availableSlots = timeSlots.filter(slot =>
          !timetable[day].some(entry => entry.time === slot)
        );
        if (availableSlots.length > 0) {
          const slot = availableSlots[Math.floor(Math.random() * availableSlots.length)];
          const room = rooms[Math.floor(Math.random() * rooms.length)];
          timetable[day].push({
            course_name: course.course_name,
            time: slot,
            room_no: room
          });
        }
      }
    }
  });

  return timetable;
}

app.post('/student-courses', (req, res) => {
  const { student_id } = req.body;

  // Fetch student's semester
  db.query(
    'SELECT semester FROM students WHERE student_id = ?',
    [student_id],
    (err, studentRows) => {
      if (err) {
        console.error('Error fetching student semester:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (studentRows.length === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }

      const semester = studentRows[0].semester;

      // Fetch all courses for the student's semester
      db.query(
        'SELECT c.course_id, c.course_name, c.description as course_description, c.credit FROM courses c WHERE c.semester = ?',
        [semester],
        (err, coursesRows) => {
          if (err) {
            console.error('Error fetching courses:', err);
            return res.status(500).json({ error: 'Internal server error' });
          }

          // Fetch courses the student is registered for
          db.query(
            'SELECT course_id FROM student_courses WHERE student_id = ?',
            [student_id],
            (err, registeredRows) => {
              if (err) {
                console.error('Error fetching registered courses:', err);
                return res.status(500).json({ error: 'Internal server error' });
              }

              const registeredCourses = new Set(registeredRows.map(row => row.course_id));

              // Combine the data
              const courseData = coursesRows.map(course => ({
                ...course,
                status: registeredCourses.has(course.course_id) ? 'Registered' : 'Not Registered'
              }));

              res.json({
                semester,
                courses: courseData
              });
            }
          );
        }
      );
    }
  );
});

app.post('/student-assignments', (req, res) => {
  const { student_id } = req.body;

  // Get student's courses
  db.query(
    'SELECT course_id FROM student_courses WHERE student_id = ?',
    [student_id],
    (err, courses) => {
      if (err) {
        console.error('Error fetching student courses:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      const courseIds = courses.map(course => course.course_id);

      if (courseIds.length === 0) {
        return res.json([]); // No courses found
      }

      // Get course names from the courses table
      db.query(
        'SELECT course_id, course_name FROM courses WHERE course_id IN (?)',
        [courseIds],
        (err, courseNames) => {
          if (err) {
            console.error('Error fetching course names:', err);
            return res.status(500).json({ error: 'Internal server error' });
          }

          // Map course_id to course_name
          const courseNameMap = new Map(
            courseNames.map(course => [course.course_id, course.course_name])
          );

          // Get all assignments for these courses
          db.query(
            'SELECT * FROM assignments WHERE course_id IN (?)',
            [courseIds],
            (err, assignments) => {
              if (err) {
                console.error('Error fetching assignments:', err);
                return res.status(500).json({ error: 'Internal server error' });
              }

              if (assignments.length === 0) {
                return res.json([]); // No assignments found
              }

              // Get submitted assignments for this student
              db.query(
                'SELECT assignment_id FROM student_assignment WHERE student_id = ?',
                [student_id],
                (err, submittedAssignments) => {
                  if (err) {
                    console.error('Error fetching submitted assignments:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                  }

                  const currentDate = new Date();

                  // Create a set for submitted assignments
                  const submittedSet = new Set(
                    submittedAssignments.map(sa => `${sa.assignment_id}`)
                  );

                  const processedAssignments = assignments.map(assignment => {
                    let status;

                    // If the student has submitted the assignment, mark it as 'submitted'
                    if (submittedSet.has(assignment.assignment_id)) {
                      status = 'submitted';
                    } 
                    // If the submission date has passed, check if the student has submitted the assignment
                    else if (new Date(assignment.submission_date) < currentDate) {
                      // Check if there's a record for this student and assignment
                      const isSubmitted = submittedAssignments.some(sa => sa.assignment_id === assignment.assignment_id);
                      status = isSubmitted ? 'submitted' : 'missed';
                    } 
                    // Otherwise, it's 'due'
                    else {
                      status = 'due';
                    }

                    // Add the course name to the assignment
                    return {
                      ...assignment,
                      status,
                      course_name: courseNameMap.get(assignment.course_id) // Add course name here
                    };
                  });

                  res.json(processedAssignments);
                }
              );
            }
          );
        }
      );
    }
  );
});





// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
