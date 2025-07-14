// Subject ID to Name mapping
export const SUBJECT_NAMES = {
    'SPT001': 'Cricket',
    'SPT002': 'Football',
    'SPT003': 'Basketball',
    'SPT004': 'Tennis',
    'SPT005': 'Swimming',
    'SPT006': 'Badminton',
    'CLB001': 'Netball',
    'CLB002': 'Dance',
    'CLB003': 'Drama',
    'CLB004': 'Singing',
    'CLB005': 'Scout',
    'CLB006': 'Science Club',
};

// Helper function to get subject name from ID
export const getSubjectName = (subjectId) => {
    return SUBJECT_NAMES[subjectId] || subjectId;
}; 