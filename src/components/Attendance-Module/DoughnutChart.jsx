// import React, { useState } from "react";
// import { Card, Typography, Select, MenuItem } from "@mui/material";
// import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
// import CustomDropdown from './CustomDropdown';

// const DoughnutChart = ({ data }) => { // Receive data as a prop

//     return (
//         <Card sx={{ width: 200, height: 150, p: 0, borderRadius: '10px', textAlign: "center", padding: 0, boxShadow: 'none' }}>

//             <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                     <Pie
//                         data={data}
//                         dataKey="value"
//                         nameKey="name"
//                         cx="50%"
//                         cy="50%"
//                         innerRadius={35}
//                         outerRadius={70}
//                         paddingAngle={0}
//                     >
//                         {data.map((entry, index) => (
//                             <Cell key={`cell-${index}`} fill={entry.color} />
//                         ))}
//                     </Pie>
//                 </PieChart>
//             </ResponsiveContainer>

//         </Card>
//     );
// };

// export default DoughnutChart;






import React from 'react';
import { Card } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const DoughnutChart = ({ data }) => {
    const colorMap = {
        Present: '#49C3FB',
        Absent: '#BB109D'
    };

    const processedData = data.map(entry => ({
        ...entry,
        color: colorMap[entry.name] || '#ccc' // fallback color
    }));

    return (
        <Card sx={{ width: 200, height: 150, p: 0, borderRadius: '10px', textAlign: "center", boxShadow: 'none' }}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={processedData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={70}
                        paddingAngle={0}
                    >
                        {processedData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </Card>
    );
};

export default DoughnutChart;
