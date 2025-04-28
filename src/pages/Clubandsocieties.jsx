import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import ClubCard from "../components/ClubCards";

// Import images
import scienceImg from "../assets/science.png";
import danceImg from "../assets/dance.png";
import singingImg from "../assets/singing.png";
import scoutImg from "../assets/scout.png";
import dramaImg from "../assets/drama.png";

const clubs = [
  {
    title: "Science Club",
    description:
      "Provides a platform for students to explore scientific concepts beyond the classroom. Members engage in practical experiments, research projects, and participate in national-level competitions.",
    location: "Science Laboratory Complex",
    practiceTime: "Tuesday 3:30 PM - 5:00 PM",
    image: scienceImg,
  },
  {
    title: "Dance Club",
    description:
      "Our Dance Club celebrates diverse dance forms including traditional Sri Lankan, contemporary, and modern styles.",
    location: "Dancing Hall",
    practiceTime: "Mon/Wed 4:00 PM - 5:30 PM",
    image: danceImg,
  },
  {
    title: "Singing Club",
    description:
      "The Singing Club nurtures vocal talents while promoting teamwork through choral singing.",
    location: "Music Room",
    practiceTime: "Thursday 3:30 PM - 5:00 PM",
    image: singingImg,
  },
  {
    title: "Scout Club",
    description:
      "The Scout Club focuses on character building, outdoor skills, and community service.",
    location: "Outdoor Activity Area",
    practiceTime: "Friday 3:30 PM - 5:30 PM",
    image: scoutImg,
  },
  {
    title: "Drama Club",
    description:
      "The Drama Club provides opportunities for students to explore theatrical arts, develop public speaking skills, and build confidence.",
    location: "School Auditorium",
    practiceTime: "Tue/Thu 4:30 PM - 5:30 PM",
    image: dramaImg,
  },
];

const Clubandsocieties = () => {
  return (
    <Box p={4} sx={{ backgroundColor: "#e6f0ff", minHeight: "100vh" }}>
      <Typography variant="h2" fontWeight="bold" mb={3} align="center">
        Clubs and Societies
      </Typography>

      <Grid container spacing={3}>
        {clubs.map((club, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <ClubCard {...club} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Clubandsocieties;