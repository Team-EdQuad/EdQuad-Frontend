import React from "react";
import CourseMatProgress from "../components/CourseMatProgress";
import ClassPerformance from "../components/ClassPerformance";
import StudentProgressMonitoring from "../components/StudentProgressMonitoring"
import ClassAttendanceAnalysis from "../components/ClassAttendanceAnalysis"
import Calendar from "../components/DashbboardCalendar";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { useContext } from "react";
import { StoreContext } from "../context/StoreContext"; 



const TeacherDashboard = () => {

  // const studentId = 'STU009';
//   const classId = 'CLS001';
  const location = useLocation();
  const { id: studentId } = useContext(StoreContext);
  // const { id: studentId, classId } = useContext(StoreContext);

  console.log("Dashboard is rendering...");

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <div className="p-6 space-y-8" >
      <section id="material-progress">
          <CourseMatProgress teacherId="TCH001" />
      </section>
      <section id="class-performance">
          <ClassPerformance/>
      </section>
      <section id="student-progress">
          <StudentProgressMonitoring/>
      </section>
      <section id="attendance-analysis">
        < ClassAttendanceAnalysis />
      </section>
      
      
    <Calendar />
    </div>
    
  );
  
};

export default TeacherDashboard;
