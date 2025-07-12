import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useContext } from 'react';
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
import { StoreContext } from '../context/StoreContext';

const Url = import.meta.env.VITE_BACKEND_URL;

// ✅ Timezone-safe date formatting (no shifting for "YYYY-MM-DD")
const formatDate = (dateStr) => {
  const [year, month, day] = dateStr.split("-");
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Use midnight time to avoid UTC shift
  const date = new Date(`${year}-${month}-${day}T00:00:00`);
  const weekday = weekdays[date.getDay()];
  const monthName = months[date.getMonth()];
  return `${weekday} ${monthName} ${day} ${year}`;
};

const SubjectContent = () => {
  const navigate = useNavigate();
  const [groupedItems, setGroupedItems] = useState({});
  const [allContent, setAllContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const { subjectId } = useParams();
  const { id: studentId } = useContext(StoreContext);

  const getIconForItem = (item) => {
    if (item.type === 'assignment') return '📝';

    const ext = item.filePath?.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return '📄';
      case 'txt': return '📃';
      case 'mp3': return '🎵';
      case 'mp4': return '🎬';
      default: return '📁';
    }
  };

  const handleClick = async (item) => {
    if (item.type === 'assignment') {
      navigate(`/assignment-view/${encodeURIComponent(item.id)}`);
    } else if (item.type === 'content') {
      try {
        if (!item.filePath) {
          alert('This content does not have an attached file.');
          return;
        }

        const formData = new FormData();
        formData.append('student_id', studentId);
        formData.append('content_id', item.id);

        await fetch(`${Url}/api/startContentAccess`, {
          method: 'POST',
          body: formData,
        });

        await fetch(`${Url}/api/content/${item.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ student_id: studentId }),
        });

        navigate(`/content-view/${item.id}`, {
          state: {
            contentUrl: `${Url}/api/content/file/${item.id}`,
            contentName: item.filePath
              ? item.filePath.split('/').pop().split('\\').pop()
              : item.name,
            contentDescription: item.description,
          },
        });
      } catch (err) {
        console.error('Failed to notify backend or mark content as complete', err);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contentRes, assignmentRes] = await Promise.all([
          fetch(`${Url}/api/content/${studentId}/${subjectId}`),
          fetch(`${Url}/api/assignments/${studentId}/${subjectId}`),
        ]);

        const contentData = await contentRes.json();
        const assignmentData = await assignmentRes.json();
        setAllContent(contentData);

        const allItems = [];

        // ✅ Add content items (preserve date string to avoid timezone shift)
        if (Array.isArray(contentData)) {
          contentData.forEach((item) => {
            const rawDate = item.upload_date || item.Date;
            if (rawDate) {
              const normalizedDate = rawDate.includes('T')
                ? new Date(rawDate).toISOString().split('T')[0]
                : rawDate;

              allItems.push({
                type: 'content',
                id: item.content_id,
                name: item.content_name,
                description: item.description,
                filePath: item.content_file_path,
                date: normalizedDate,
              });
            }
          });
        }

        // ✅ Add assignment items (created_at is full ISO)
        if (assignmentData.assignments) {
          assignmentData.assignments.forEach((asm) => {
            if (asm.created_at) {
              const parsedDate = new Date(asm.created_at);
              if (!isNaN(parsedDate)) {
                allItems.push({
                  type: 'assignment',
                  id: asm.assignment_id,
                  name: asm.assignment_name,
                  date: parsedDate.toISOString().split('T')[0],
                });
              }
            }
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
  }, [subjectId]);

  if (loading) return <Typography>Loading content...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      {Object.keys(groupedItems).length === 0 ? (
        <Typography>No content or assignments available.</Typography>
      ) : (
        Object.entries(groupedItems)
          .sort((a, b) => new Date(b[0]) - new Date(a[0]))
          .map(([date, items]) => (
            <Box key={date} mb={4}>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ mb: 2, color: theme.palette.primary.main }}
              >
                {formatDate(date)}
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
                      primary={`${getIconForItem(item)} ${item.name}`}
                      secondary={
                        item.description || (item.type === 'assignment' ? 'Assignment' : '')
                      }
                      sx={{ mr: 2 }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleClick(item)}
                    >
                      {item.type === 'assignment' ? 'View' : 'Open'}
                    </Button>
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
