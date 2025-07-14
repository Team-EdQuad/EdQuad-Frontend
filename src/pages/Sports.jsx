import React, { useEffect, useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import SportCard from "../components/SportCard";
import { getAllSports } from "../services/sportClubService";

import cricketImg from "../assets/cricket.png";
import netballImg from "../assets/netball.png";
import basketballImg from "../assets/basketball.png";
import badmintonImg from "../assets/badminton.png";
import swimmingImg from "../assets/swimming.png";
import tennisImg from "../assets/tennis.png";

const imageMap = {
  Cricket: cricketImg,
  Netball: netballImg,
  Basketball: basketballImg,
  Badminton: badmintonImg,
  Swimming: swimmingImg,
  Tennis: tennisImg,
};

const Sports = () => {
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSports() {
      try {
        const data = await getAllSports(); // Assuming this returns parsed JSON array
        setSports(data);
      } catch (err) {
        setError(err.message || "Failed to load sports");
      } finally {
        setLoading(false);
      }
    }
    fetchSports();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Typography>Loading sports...</Typography>
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
    <Box
      p={4}
      sx={{
        minHeight: "100vh",
        backgroundColor: "#e6f0ff",
      }}
    >
      <Typography variant="h2" fontWeight="bold" mb={3} align="center">
        Sports Activities
      </Typography>

      <Grid container spacing={3}>
        {sports.map((sport) => (
          <Grid item xs={12} sm={6} md={4} key={sport.sport_id}>
            <SportCard
              title={sport.sport_name}
              description={sport.description}
              location={sport.location}
              time={sport.schedule}
              image={imageMap[sport.sport_name] || null}
              category={[sport.type, sport.category]} // optional if SportCard supports it
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Sports;
