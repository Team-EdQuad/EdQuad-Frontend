import { Box, Typography, Grid } from "@mui/material";
import ClubCard from "../components/ClubCards";
import { getAllClubs } from "../services/sportClubService";
import React, { useEffect, useState } from "react";

import scienceImg from "../assets/science.png";
import danceImg from "../assets/dance.png";
import singingImg from "../assets/singing.png";
import scoutImg from "../assets/scout.png";
import dramaImg from "../assets/drama.png";


const imageMap = {
  "Science Club": scienceImg,
  "Dance Club": danceImg,
  "Singing Club": singingImg,
  "Scout Club": scoutImg,
  "Drama Club": dramaImg,
};

const Clubandsocieties = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  async function fetchClubs() {
    try {
      const data = await getAllClubs();  
      setClubs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  fetchClubs();
}, []);


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Typography>Loading clubs...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={4} sx={{ backgroundColor: "#e6f0ff", minHeight: "100vh" }}>
      <Typography variant="h2" fontWeight="bold" mb={3} align="center">
        Clubs and Societies
      </Typography>

      <Grid container spacing={3}>
        {clubs.map((club) => (
          <Grid item xs={12} sm={6} md={4} key={club.club_id}>
            <ClubCard
              title={club.club_name}
              description={club.description}
              location={club.location}
              practiceTime={club.schedule}
              image={imageMap[club.club_name]} // Use mapped image here
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Clubandsocieties;