import React from "react";
import SubjectProgress from "../components/SubjectProgress";
import AssignmentTimeline from "../components/AssignmentTimeline";
import StudentExamMarksChart from "../components/AcademicPerformance";
import AttendanceOverview from "../components/AttendanceOverview";
import PerformancePrediction from "../components/PerformancePrediction";
import Calendar from "../components/DashbboardCalendar";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { useContext } from "react";
import { StoreContext } from "../context/StoreContext"; 



const StudentDashboard = () => {

  // const studentId = 'STU009';
  const classId = 'CLS001';
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
    <section id="subject-progress">
      <SubjectProgress studentId={studentId} classId={classId} />
    </section>

    <section id="assignment-timeline">
      <AssignmentTimeline studentId={studentId} classId={classId} />
    </section>

    <section id="attendance">
      <AttendanceOverview studentId="STU030" classId="CLS013" />
    </section>

    <section id="academic-performance">
      <StudentExamMarksChart studentId={studentId} classId={classId} examYear="2024" />
    </section>

    <section id="predictive-analysis">
      <PerformancePrediction />
    </section>
    <Calendar />
    </div>
    
  );
  
};

export default StudentDashboard;
