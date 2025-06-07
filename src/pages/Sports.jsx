import React from "react";
import { Box, Typography, Grid, Select, MenuItem } from "@mui/material";
import SportCard from "../components/SportCard";

import cricketImg from "../assets/cricket.png";
import netballImg from "../assets/netball.png";
import basketballImg from "../assets/basketball.png";
import badmintonImg from "../assets/badminton.png";
import swimmingImg from "../assets/swimming.png";
import tennisImg from "../assets/tennis.png";

const sportsData = [
  {
    title: "Cricket",
    category: ["Outdoor", "Team"],
    image: cricketImg,
    description:
      "Our cricket program focuses on developing both technical skills and tactical understanding of the game. Students receive specialized training in batting, bowling, and fielding.",
    location: "Main Cricket Ground",
    time: "Mon/Wed/Fri 3:30 PM - 6:00 PM",
  },
  {
    title: "Netball",
    category: ["Outdoor", "Team"],
    image: netballImg,
    description:
      "Our netball program emphasizes teamwork, agility, and strategic play. Players receive comprehensive training in all positions.",
    location: "Indoor Sports Complex - Court A",
    time: "Tue/Thu 3:30 PM - 5:30 PM",
  },
  {
    title: "Basketball",
    category: ["Outdoor", "Team"],
    image: basketballImg,
    description:
      "Our cricket program focuses on developing both technical skills and tactical understanding of the game. Students receive specialized training in batting, bowling, and fielding.",
    location: "Indoor Sports Complex - Court B",
    time: "Mon/Wed/Fri 4:00 PM - 6:00 PM",
  },
  {
    title: "Badminton",
    category: ["Indoor", "Individual"],
    image: badmintonImg,
    description:
      "Our badminton program combines technical training with physical conditioning, developing players’ agility, speed, and tactical awareness.",
    location: "Indoor Sports Complex - Court C",
    time: "Mon/Wed 3:30 PM - 5:30 PM",
  },
  {
    title: "Swimming",
    category: ["Indoor", "Individual"],
    image: swimmingImg,
    description:
      "Our swimming program covers all competitive strokes with specialized coaching for different events. Includes strength training and endurance building.",
    location: "School Swimming Pool",
    time: "Mon-Fri 4:00 PM - 6:00 PM",
  },
  {
    title: "Tennis",
    category: ["Indoor", "Individual"],
    image: tennisImg,
    description:
      "Our tennis program offers personalized coaching for players of all skill levels, focusing on technique, footwork, and match strategy.",
    location: "Tennis Complex Courts 1-3",
    time: "Tue/Thu 3:30 PM - 5:30 PM",
  },
];

const Sports = () => {
  return (
    <Box p={4} sx={{ backgroundColor: "#e6f0ff", minHeight: "100vh" }}>
      <Typography variant="h2" fontWeight="bold" mb={3} align="center">
        Sports Activities
      </Typography>

      {/* <Box display="flex" gap={2} mb={4}>
        <Select defaultValue="All Sports">
          <MenuItem value="All Sports">All Sports</MenuItem>
          <MenuItem value="Indoor Sports">Indoor Sports</MenuItem>
          <MenuItem value="Outdoor Sports">Outdoor Sports</MenuItem>
        </Select>
        <Select defaultValue="Team Sports">
          <MenuItem value="Team Sports">Team Sports</MenuItem>
          <MenuItem value="Individual Sports">Individual Sports</MenuItem>
        </Select>
      </Box> */}

      <Grid container spacing={3}>
        {sportsData.map((sport, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <SportCard {...sport} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Sports;
