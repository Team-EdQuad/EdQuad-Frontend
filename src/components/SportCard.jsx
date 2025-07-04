// src/components/SportCard.jsx
import React from "react";
import { Box, Card, CardContent, Typography, Chip } from "@mui/material";

const SportCard = ({ title, category, description, location, time, image }) => {
  return (
    <Card 
      sx={{ 
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: 350,
        alignItems: "center",
        borderRadius: 4, 
        minHeight: "100%", 
        boxShadow: 3,
        "&:hover": {boxShadow: 6, },
        transition: "box-shadow 0.3s ease-in-out",
        // backgroundColor: "#f5f5f5", 
        border: "1px solid #e0e0e0"
      }}>
      
      <CardContent>

        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Box display="flex" gap={1} mb={1}>
              {category.map((cat, idx) => (
                <Chip key={idx} label={cat} size="small" color="info" />
              ))}
            </Box>

            <Typography variant="h3" fontWeight="bold">
              {title}
            </Typography>
          </Box>

          <img
            src={image}
            alt="Image"
            style={{
              height: 180,
              width: "100%",
              objectFit: "contain",
              paddingRight: 100,
              marginRight: 8,
            }}
          />
        </Box>

        <Typography variant="h5" gutterBottom>
          {description}
        </Typography>
        <Typography variant="body1" fontWeight="bold" mt={2}>
          Location:{" "}
          <Typography variant="body1" component="span">
            {location}
          </Typography>
        </Typography>
        <Typography variant="body1" fontWeight="bold">
          Practice Time:{" "}
          <Typography variant="body1" component="span">
            {time}
          </Typography>
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SportCard;
