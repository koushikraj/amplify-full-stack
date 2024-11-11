import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Tab,
  Tabs,
  Typography,
  Paper,
  MenuItem,
  TextField,
} from '@mui/material';
import { Person, Book, Group } from '@mui/icons-material';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../amplify/data/resource';
import { useAuthenticator } from '@aws-amplify/ui-react';
import moment from 'moment';


const client = generateClient<Schema>();

const Profile = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [userDetails, setUser] = useState<Schema["User"]["createType"]>({
    // name: 'koushik',
    // familyName: 'k',
    // preferredName: 'koushikk',
    // email: 'kxb00560@ucmo.edu',
    // major: 'Computer Science'
  });

  const [posts, setPosts] = useState<Array<Schema["Post"]["type"]>>([]);
  const [resources, setResources] = useState<Array<Schema["Resource"]["type"]>>([]);
  const [studyGroups, setStudyGroups] = useState<Array<Schema["StudyGroup"]["type"]>>([]);


  const { user, username } = useAuthenticator();

  const userEmail = user?.signInDetails?.loginId || "";


  useEffect(() => {
    getUser();
    client.models.Post.observeQuery().subscribe({
        next: (data) => setPosts([...data.items]),
    });
    client.models.Resource.observeQuery().subscribe({
        next: (data) => setResources([...data.items]),
    });
    client.models.StudyGroup.observeQuery().subscribe({
        next: (data) => setStudyGroups([...data.items]),
    });
}, []);

useEffect(() => {
    getPosts();
    getResources();
    getStudyGroups();
}, []);

const getPosts = async () => {
    try {
        const postsResponse = await client.models.Post.list();
        setPosts(postsResponse.data.map(e => e));
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
};

const getResources = async () => {
    try {
        const postsResponse = await client.models.Resource.list();
        setResources(postsResponse.data.map(e => e));
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
};

const getStudyGroups = async () => {
    try {
        const postsResponse = await client.models.StudyGroup.list();
        setStudyGroups(postsResponse.data.map(e => e));
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
};

   
const getUser = async () => {
    const userDetails1 = await client.models.User.get({id: user.userId});
    userDetails1?.data && setUser(userDetails1.data);
}

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
      email: userEmail,
    }));
  };

  const handleSubmit = () => {
    // Add functionality to save the changes (e.g., call an API endpoint)
    console.log('Updated User Information:', userDetails);
    if(userDetails.id){
        client.models.User.update({
            id: userDetails.id,
            ...userDetails,
            userId: username
        })
    } else {
        client.models.User.create({
            ...userDetails,
            userId: username,
            id: user.userId
        }).then(data => data?.data && setUser({...userDetails, id: data.data.id}))
    }
    closeDrawer();
  };

  console.log(user);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', height: '100vh', p: 2}}>
      {/* Profile Sidebar */}
      <Box sx={{ width: '300px', p: 2 }}>
        <Paper
          elevation={1}
          sx={{
            p: 3,
            textAlign: 'center',
            backgroundColor: '#ffffff',
            borderRadius: 2,
          }}
        >
          <Avatar
            src="/path/to/profile-image.jpg"
            alt="Profile Picture"
            sx={{ width: 120, height: 120, margin: '0 auto', mb: 2 }}
          />
          <Typography variant="h6" sx={{ mb: 1 }}>
            {userDetails.name} {userDetails.familyName}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 2 }}>
            {userDetails.preferredName}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Major:</strong> {userDetails.major}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>Email:</strong> {userEmail}
          </Typography>
          <Button variant="contained" color="primary" fullWidth onClick={showDrawer}>
            Edit Account Information
          </Button>
        </Paper>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Paper
          elevation={1}
          sx={{
            p: 3,
            backgroundColor: '#ffffff',
            borderRadius: 2,
            height: '100%',
            overflow: 'auto',
          }}
        >
          {/* Tabs */}
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
          >
            <Tab icon={<Person />} label="Feeds" />
            <Tab icon={<Book />} label="Resources" />
            <Tab icon={<Group />} label="Study groups" />
          </Tabs>

          {/* Tab Content */}
          <Box>
            {selectedTab === 0 && (
              <Box>
                {posts.filter(post => post.owner === user?.userId).map((post, index) => (
                  <Paper
                    key={index}
                    sx={{
                      p: 2,
                      mb: 3,
                      backgroundColor: '#f8f8f8',
                      borderRadius: 2,
                      boxShadow: 'none',
                      border: '1px solid #e0e0e0',
                    }}
                  >
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {post.title}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 1 }}>
                      {moment(post.timestamp).fromNow()}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {post.content}
                    </Typography>
                    <Divider sx={{ mb: 1 }} />
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2">Likes: {post.likes.length}</Typography>
                      <Typography variant="body2">Dislikes: {post.dislikes}</Typography>
                      <Button size="small" variant="outlined" sx={{ textTransform: 'none' }}>
                        General
                      </Button>
                    </Box>
                  </Paper>
                ))}
              </Box>
            )}
            {/* Resources Tab Content */}
      {selectedTab === 1 && (
        <Box>
          {resources.filter(post => post.owner === user?.userId).map((resource, index) => (
            <Paper
              key={index}
              sx={{
                p: 2,
                mb: 3,
                backgroundColor: '#f8f8f8',
                borderRadius: 2,
                boxShadow: 'none',
                border: '1px solid #e0e0e0',
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                {resource.title}
              </Typography>
              <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 1 }}>
                Category: {resource.category}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {resource.description}
              </Typography>
              <Divider sx={{ mb: 1 }} />
              
            </Paper>
          ))}
        </Box>
      )}

      {/* Study Groups Tab Content */}
      {selectedTab === 2 && (
        <Box>
          {studyGroups.filter(post => post.owner === user?.userId).map((group, index) => (
            <Paper
              key={index}
              sx={{
                p: 2,
                mb: 3,
                backgroundColor: '#f8f8f8',
                borderRadius: 2,
                boxShadow: 'none',
                border: '1px solid #e0e0e0',
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                {group.title}
              </Typography>
              <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 1 }}>
                Professor: {group.professor}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Members: {group.members.join(', ')}
              </Typography>
              <Divider sx={{ mb: 1 }} />
              
            </Paper>
          ))}
          </Box>)}
          </Box>
        </Paper>
      </Box>

      {/* Drawer for Editing Account Information */}
      <Drawer anchor="right" open={drawerVisible} onClose={closeDrawer}>
        <Box p={3} sx={{ width: 350 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Edit Account Information</Typography>
          <form noValidate autoComplete="off">
            <TextField
              fullWidth
              label="First Name"
              variant="outlined"
              name="name"
              value={userDetails.name}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Last Name"
              variant="outlined"
              name="familyName"
              value={userDetails.familyName}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              name="preferredName"
              value={userDetails.preferredName}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
                select
                fullWidth
                label="Major"
                variant="outlined"
                name="major"
                value={userDetails.major}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                SelectProps={{
                    MenuProps: {
                    PaperProps: {
                        sx: {
                        backgroundColor: '#ffffff',
                        '& .Mui-selected': {
                            backgroundColor: '#e0f7fa !important', // Light blue for selected item
                            color: '#000000',                      // Black text color for better readability
                        },
                        },
                    },
                    },
                }}
                >
                <MenuItem value="Computer Science">Computer Science</MenuItem>
                <MenuItem value="Information Technology">Information Technology</MenuItem>
                <MenuItem value="Data Science">Data Science</MenuItem>
            </TextField>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSubmit}
              sx={{ mt: 2 }}
            >
              Submit
            </Button>
          </form>
          <Button variant="outlined" color="secondary" fullWidth onClick={closeDrawer} sx={{ mt: 1 }}>
            Cancel
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Profile;
