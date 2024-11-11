import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  TextField,
  IconButton,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Schema } from '../../amplify/data/resource';
import { generateClient } from 'aws-amplify/api';
import { AddCircleOutline, Delete } from '@mui/icons-material';


const client = generateClient<Schema>();

function StudyGroupsPage() {
  const [studyGroups, setStudyGroups] = useState<Array<Schema["StudyGroup"]["type"]>>([]);
  const [selectedGroup, setSelectedGroup] = useState<Schema["StudyGroup"]["type"] | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({
    groupName: '',
    course: '',
    description: '',
    professor: '',
    memberEmails: [''], // Start with one empty email field
  });

  useEffect(() => {
    fetchStudyGroups();
  }, []);

  const fetchStudyGroups = async () => {
    try {
      const groups = await client.models.StudyGroup.list();
      setStudyGroups(groups.data);
    } catch (err) {
      console.error('Error fetching study groups:', err);
    }
  };

  const handleDrawerOpen = (group) => {
    setSelectedGroup(group);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedGroup(null);
  };

  const handleCommentSubmit = async () => {
    // if (!newComment.trim()) return;
    // try {
    //   await DataStore.save(
    //     StudyGroup.copyOf(selectedGroup, (updated) => {
    //       updated.comments = updated.comments
    //         ? [...updated.comments, { content: newComment, author: 'currentuser@example.com' }]
    //         : [{ content: newComment, author: 'currentuser@example.com' }];
    //     })
    //   );
    //   setNewComment('');
    //   fetchStudyGroups();
    // } catch (err) {
    //   console.error('Error adding comment:', err);
    // }
  };



  const handleCreateDrawerOpen = () => {
    setCreateDrawerOpen(true);
  };

  const handleCreateDrawerClose = () => {
    setCreateDrawerOpen(false);
    setNewGroup({ groupName: '', course: '', description: '', professor: '', memberEmails: [''] });
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedEmails = [...newGroup.memberEmails];
    updatedEmails[index] = value;
    setNewGroup((prev) => ({ ...prev, memberEmails: updatedEmails }));
  };

  const handleAddEmailField = () => {
    setNewGroup((prev) => ({
      ...prev,
      memberEmails: [...prev.memberEmails, ''],
    }));
  };

  const handleRemoveEmailField = (index) => {
    const updatedEmails = newGroup.memberEmails.filter((_, i) => i !== index);
    setNewGroup((prev) => ({ ...prev, memberEmails: updatedEmails }));
  };

  const handleCreateGroup = async () => {
    const { groupName, course, description, professor, memberEmails } = newGroup;
    
      try {
        await client.models.StudyGroup.create({
            title: groupName,
            subject: course,
            description,
            professor,
            members: memberEmails.filter((email) => email.trim() !== ''), // Remove empty emails
            comments: [],
      })
        handleCreateDrawerClose();
        fetchStudyGroups();
      } catch (err) {
        console.error('Error creating study group:', err);
      }
    
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Study Groups
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddCircleOutline />}
        onClick={handleCreateDrawerOpen}
        style={{ marginBottom: '20px' }}
      >
        Create Study Group
      </Button>
      <Grid container spacing={4}>
        {studyGroups.map((group) => (
          <Grid item xs={12} md={6} key={group.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{group.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {group.subject}
                </Typography>
                <Typography variant="body1">{group.description}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Professor: {group.professor}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Drawer anchor="right" open={createDrawerOpen} onClose={handleCreateDrawerClose}>
        <div style={{ width: 400, padding: '20px' }}>
          <IconButton onClick={handleCreateDrawerClose} style={{ float: 'right' }}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h5" gutterBottom>
            Create New Study Group
          </Typography>
          <TextField
            label="Group Name"
            name="groupName"
            fullWidth
            margin="normal"
            value={newGroup.groupName}
            onChange={(e) => setNewGroup({ ...newGroup, groupName: e.target.value })}
          />
          <TextField
            label="Course"
            name="course"
            fullWidth
            margin="normal"
            value={newGroup.course}
            onChange={(e) => setNewGroup({ ...newGroup, course: e.target.value })}
          />
          <TextField
            label="Description"
            name="description"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={newGroup.description}
            onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
          />
          <TextField
            label="Professor"
            name="professor"
            fullWidth
            margin="normal"
            value={newGroup.professor}
            onChange={(e) => setNewGroup({ ...newGroup, professor: e.target.value })}
          />

          {/* Dynamic Email Fields */}
          <Typography variant="body2" style={{ marginTop: '20px' }}>
            Group Member Emails
          </Typography>
          {newGroup.memberEmails.map((email, index) => (
            <Box key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <TextField
                label={`Email ${index + 1}`}
                name="memberEmails"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => handleInputChange(e, index)}
              />
              {newGroup.memberEmails.length > 1 && (
                <IconButton
                  color="secondary"
                  onClick={() => handleRemoveEmailField(index)}
                  style={{ marginLeft: '10px' }}
                >
                  <Delete />
                </IconButton>
              )}
            </Box>
          ))}
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleAddEmailField}
            style={{ marginTop: '10px' }}
          >
            Add Email
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateGroup}
            style={{ marginTop: '20px' }}
          >
            Create Group
          </Button>
        </div>
      </Drawer>
    </Container>
  );
}

export default StudyGroupsPage;
