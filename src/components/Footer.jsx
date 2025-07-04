import React from 'react';
import { Box, Grid, Typography, Link, IconButton, useTheme } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { tokens } from "../theme";
import { useContext } from 'react';
import { StoreContext } from '../context/StoreContext'

const Footer = () => {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { role, setSelected } = useContext(StoreContext)

  return (
    <Box sx={{
      height: 'auto',
      // color: 'red',
      backgroundColor: colors.nav_bg_1

    }}>
      <Box sx={{ backgroundColor: colors.nav_bg_1, px: 0, pt: 4, pb: 1 }}>
        <Grid container spacing={6} sx={{ px: 4 }}>

          {/* Left section */}
          <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', flexDirection: 'column', maxWidth: '400px',  }}>
            <Box sx={{ wordWrap: 'break-word', overflowWrap: 'break-word', hyphens: 'auto', maxWidth: '100%' }}>
              <Typography sx={{ fontSize: '28px', fontWeight: 600, color: colors.nav_text }}>
                Ed<span style={{ color: 'blue' }}>Q</span>uad
              </Typography>
              <Typography mt={2}>
                Welcome to Sri Lanka's first inspirational global experience in online grocery retailing.
                Be a part of this experience, redefining convenience and freshness.
              </Typography>
            </Box>
          </Grid>

          {/* Middle: Links */}
          <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', flexDirection: 'column', maxWidth: '100%' }}>
            <Box sx={{ wordWrap: 'break-word', overflowWrap: 'break-word', hyphens: 'auto', maxWidth: '100%', paddingRight: '50px' }}>
              <Typography variant="h6" fontWeight="bold">Links</Typography>
            { role === 'Student' && (<ul style={{ paddingLeft: '1rem', margin: 0 }}>
                  <li><Link href="/student/attendance/analysis" onClick={() => setSelected("Material Progress")} underline="hover" color="inherit">Dashbord</Link></li>
                  <li><Link href="/student/attendance/analysis" underline="hover" color="inherit">My Profile</Link></li>
                  <li><Link href="/student/attendance/analysis" underline="hover" color="inherit">Calender</Link></li>
                  <li><Link href="/student/attendance/analysis" onClick={() => setSelected("Analysis View")} underline="hover" color="inherit">Acadamic</Link></li>
                  <li><Link href="/student/attendance/analysis" underline="hover" color="inherit">Sports</Link></li>
                  <li><Link href="/student/attendance/analysis" underline="hover" color="inherit">Clubs & Societies</Link></li>
                  <li><Link href="/student/attendance/analysis" underline="hover" color="inherit">Attendance</Link></li>
              </ul>)}
              { role === 'Teacher' && (<ul style={{ paddingLeft: '1rem', margin: 0 }}>
                  <li><Link href="/student/attendance/analysis" underline="hover" color="inherit">Dashbord</Link></li>
                  <li><Link href="/student/attendance/analysis" underline="hover" color="inherit">My Profile</Link></li>
                  <li><Link href="/student/attendance/analysis" underline="hover" color="inherit">Calender</Link></li>
                  <li><Link href="/student/attendance/analysis" onClick={() => setSelected("Analysis View")} underline="hover" color="inherit">Acadamic</Link></li>
                  <li><Link href="/student/attendance/analysis" underline="hover" color="inherit">Sports</Link></li>
                  <li><Link href="/student/attendance/analysis" underline="hover" color="inherit">Clubs & Societies</Link></li>
                  <li><Link href="/student/attendance/analysis" underline="hover" color="inherit">Attendance</Link></li>
              </ul>)}
              { role === 'Admin' && (<ul style={{ paddingLeft: '1rem', margin: 0 }}>
                  <li><Link href="/student/attendance/analysis" underline="hover" color="inherit">Dashbord</Link></li>
                  <li><Link href="/student/attendance/analysis" underline="hover" color="inherit">My Profile</Link></li>
                  <li><Link href="/student/attendance/analysis" underline="hover" color="inherit">Calender</Link></li>
                  <li><Link href="/student/attendance/analysis" underline="hover" color="inherit">Acadamic</Link></li>
                  <li><Link href="/student/attendance/analysis" underline="hover" color="inherit">Sports</Link></li>
                  <li><Link href="/student/attendance/analysis" underline="hover" color="inherit">Clubs & Societies</Link></li>
                  <li><Link href="/student/attendance/analysis" underline="hover" color="inherit">Attendance</Link></li>
              </ul>)}
            </Box>
          </Grid>

          {/* Right: Contact & Socials */}
          <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', flexDirection: 'column', maxWidth: '100%' }}>
            <Box sx={{ wordWrap: 'break-word', overflowWrap: 'break-word', hyphens: 'auto', maxWidth: '100%' }}>
              <Typography variant="h6" fontWeight="bold">Contact Us</Typography>
              <Typography>• Phone Number: 036-2385974</Typography>
              <Typography>• Email: customercair@edquad.com</Typography>
              <Typography>• EdQuad: <Link href="https://www.edquad.com" target="_blank" rel="noopener">https://www.edquad.com</Link></Typography>

              <Typography mt={2} fontWeight="bold">Follow Us</Typography>
              <IconButton color="primary"><FacebookIcon /></IconButton>
              <IconButton color="success"><WhatsAppIcon /></IconButton>
            </Box>
          </Grid>
        </Grid>
        <Box mt={2} textAlign="center">
          <hr />
          <Typography variant="caption">
            Copyright &copy; 2025 EdQuad
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;

