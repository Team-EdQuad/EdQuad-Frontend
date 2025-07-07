import React from "react";
import AdminStats from "../components/AdminStats";
import AccessUserProfiles from "../components/AccessUserProfiles";
import ClassPerformance from "../components/ClassPerformance";
import StudentProgressMonitoring from "../components/StudentProgressMonitoring"
import ClassAttendanceAnalysis from "../components/ClassAttendanceAnalysis"
import LowAttendanceRisk from "../components/LowAttendanceRisk";
import Calendar from "../components/DashboardCalendar2";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { useContext } from "react";
import { StoreContext } from "../context/StoreContext"; 



const AdminDashboard = () => {

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
      <AdminStats />
      <AccessUserProfiles />
      <section id="class-performance">
          <ClassPerformance/>
      </section>
      <section id="student-progress">
          <StudentProgressMonitoring/>
      </section>
      <section id="attendance-analysis">
        < ClassAttendanceAnalysis />
      </section>
      <section id="attendance-risk">
        <LowAttendanceRisk />
      </section>
      
    <Calendar />
    </div>
    
  );
  
};

export default AdminDashboard;
