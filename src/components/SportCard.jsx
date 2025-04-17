// src/components/SportCard.jsx
import React from "react";
import { Box, Card, CardContent, Typography, Chip } from "@mui/material";

const SportCard = ({ title, category, description, location, time, image }) => {
  return (
    <Card sx={{ borderRadius: 4, minHeight: "100%", boxShadow: 3 }}>
      <Box
        component="img"
        src={image}
        alt={title}
        sx={{ height: 150, width: "100%", objectFit: "contain", p: 2 }}
      />
      <CardContent>
        <Box display="flex" gap={1} mb={1}>
          {category.map((cat, idx) => (
            <Chip key={idx} label={cat} size="small" color="info" />
          ))}
        </Box>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" gutterBottom>
          {description}
        </Typography>
        <Typography variant="body2" fontWeight="bold" mt={2}>
          Location:{" "}
          <Typography variant="body2" component="span">
            {location}
          </Typography>
        </Typography>
        <Typography variant="body2" fontWeight="bold">
          Practice Time:{" "}
          <Typography variant="body2" component="span">
            {time}
          </Typography>
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SportCard;
