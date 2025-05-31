import React, { useState } from "react";
import { Card, Typography, Select, MenuItem } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import CustomDropdown from './CustomDropdown';

// const DoughnutChart = () => {

//     const [period, setPeriod] = useState('Yearly');

//     const handlePeriodChange = (e) => {
//         setPeriod(e.target.value);
//     };

//     const periodOptions = [
//         { label: 'Yearly', value: 'Yearly' },
//         { label: 'Monthly', value: 'Monthly' },
//         { label: 'Daily', value: 'Daily' },
//     ];

//     const data = [
//         { name: "Present", value: 60, color: "#9C27B0" }, // Purple
//         { name: "Absent", value: 40, color: "#F44336" },   // Red
//     ];

//     return (
//         <Card sx={{ width: 200, height: 210, p: 2, borderRadius: '10px', textAlign: "center", padding: 0, boxShadow: 'none'}}>
//             <div style={{ marginBottom: '20px' }}>
//                 <CustomDropdown
//                     value={period}
//                     onChange={handlePeriodChange}
//                     menuItems={periodOptions}
//                 />
//             </div>

//             <ResponsiveContainer width="100%" height="70%">
//                 <PieChart>
//                     <Pie
//                         data={data}
//                         dataKey="value"
//                         nameKey="name"
//                         cx="50%"
//                         cy="50%"
//                         innerRadius={35}   // Make the hole smaller
//                         outerRadius={70}   // Keep the outer edge
//                         paddingAngle={0}
//                     >
//                         {data.map((entry, index) => (
//                             <Cell key={`cell-${index}`} fill={entry.color} />
//                         ))}
//                     </Pie>
//                 </PieChart>
//             </ResponsiveContainer>

//             {/* Legends inside the pie */}
//             <div style={{ position: "relative", marginTop: "-100px", fontSize: "12px", height: "250px" }}>
//                 {data.map((entry, index) => (
//                     <div
//                         key={index}
//                         style={{
//                             position: "absolute",
//                             top: index === 0 ? "-10%" : "30%",     // move up and down
//                             left: index === 0 ? "10%" : "90%",    // move left and right
//                             transform: "translate(-50%, -50%)",   // center at that point
//                             textAlign: "center",
//                             color: entry.color,
//                         }}
//                     >
//                         {entry.name}
//                         <br />
//                         {entry.value}%
//                     </div>
//                 ))}
//             </div>

//         </Card>
//     );
// };


const DoughnutChart = ({ data }) => { // Receive data as a prop

    return (
        <Card sx={{ width: 200, height: 150, p: 0, borderRadius: '10px', textAlign: "center", padding: 0, boxShadow: 'none' }}>

            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={70}
                        paddingAngle={0}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>

        </Card>
    );
};

export default DoughnutChart;
