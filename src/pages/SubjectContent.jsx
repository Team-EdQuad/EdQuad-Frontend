import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  useTheme,
} from '@mui/material';


const SubjectContent = () => {
  const [groupedItems, setGroupedItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const studentId = 'STU001';
    const subjectId = 'SUB001';

    const fetchData = async () => {
      try {
        const [contentRes, assignmentRes] = await Promise.all([
          fetch(`http://localhost:8000/api/content/${studentId}/${subjectId}`),
          fetch(`http://localhost:8000/api/assignments/${studentId}/${subjectId}`)
        ]);

        const contentData = await contentRes.json();
        const assignmentData = await assignmentRes.json();

        const allItems = [];

        // ✅ Prepare content
        if (Array.isArray(contentData)) {
          contentData.forEach(item => {
            allItems.push({
              type: 'content',
              id: item.content_id,
              name: item.content_name,
              description: item.description,
              filePath: item.content_file_path,
              date: new Date(item.Date).toISOString().split('T')[0],
            });
          });
        }

        // ✅ Prepare assignments
        if (assignmentData.assignments) {
          assignmentData.assignments.forEach(asm => {
            allItems.push({
              type: 'assignment',
              id: asm.assignment_id,
              name: asm.assignment_name,
              date: new Date(asm.created_at).toISOString().split('T')[0],
            });
          });
        }

        // ✅ Group by date
        const grouped = allItems.reduce((acc, item) => {
          const date = item.date;
          if (!acc[date]) acc[date] = [];
          acc[date].push(item);
          return acc;
        }, {});

        setGroupedItems(grouped);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch content or assignments.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenFile = (filePath) => {
    window.open(`http://localhost:8000/${filePath}`, '_blank');
  };

  if (loading) return <Typography>Loading content...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      {Object.keys(groupedItems).length === 0 ? (
        <Typography>No content or assignments available.</Typography>
      ) : (
        Object.entries(groupedItems)
          .sort((a, b) => new Date(b[0]) - new Date(a[0])) // Sort by date descending
          .map(([date, items]) => (
            <Box key={date} mb={4}>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ mb: 2, color: theme.palette.primary.main }}
              >
                {new Date(date).toDateString()}
              </Typography>

              <List>
                {items.map((item) => (
                  <ListItem
                    key={item.id}
                    sx={{
                      bgcolor: theme.palette.background.paper,
                      borderRadius: '10px',
                      mb: 2,
                      boxShadow: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <ListItemText
                      primary={`${item.type === 'assignment' ? '📝 ' : '📄 '}${item.name}`}
                      secondary={item.description || (item.type === 'assignment' ? 'Assignment' : '')}
                      sx={{ mr: 2 }}
                    />
                    {item.type === 'content' && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenFile(item.filePath)}
                      >
                        Open
                      </Button>
                    )}
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ mt: 3 }} />
            </Box>
          ))
      )}
    </Box>
  );
};

export default SubjectContent;
