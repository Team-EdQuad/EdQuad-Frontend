import React from "react";
import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";

const ClubCard = ({ title, description, location, practiceTime, image }) => {
  return (
    <Card
      sx={{
        overflow: "hidden",
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
        border: "1px solid #e0e0e0"
      }}
    >
      
      <CardContent>
        <Typography variant="h3" fontWeight="bold" gutterBottom mt={2}>
          {title}
        </Typography>
        {/* <CardMedia component="img" height="140" image={image} alt={title} /> */}
        <img
            src={image}
            alt="Image"
            style={{
              height: 180,
              width: "100%",
              objectFit: "contain",
              alignItems: "center"

            }}
          />
        
        <Typography variant="h5" color="textSecondary" gutterBottom mt={2}>
          {description}
        </Typography>
        <Box mt={2}>
          <Typography variant="body1" fontWeight="bold">
            Location: {" "}
            <Typography variant="body1" component="span">
              {location}
            </Typography>
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            Practice Time: {" "}
              <Typography variant="body1" component="span">
                {practiceTime}
              </Typography>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ClubCard;