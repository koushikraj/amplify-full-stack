import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import {
  PostAdd as PostIcon,
  ThumbUp as LikeIcon,
  LibraryBooks as ResourceIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../amplify/data/resource';
import { useAuthenticator } from '@aws-amplify/ui-react';
import moment from 'moment';

const client = generateClient<Schema>();

function Dashboard() {
  const [posts, setPosts] = useState<Schema["Post"]["type"][]>([]);
  const [resources, setResources] = useState<Schema["Resource"]["type"][]>([]);
  const [studyGroups, setStudyGroups] = useState<Schema["StudyGroup"]["type"][]>([]);
  const [userDetails, setUsers] = useState<Schema["User"]["type"][]>([]);
  
  useEffect(() => {
    client.models.Post.observeQuery().subscribe({
        next: (data) => setPosts([...data.items]),
    });
    client.models.StudyGroup.observeQuery().subscribe({
        next: (data) => setStudyGroups([...data.items]),
    });

    client.models.Resource.observeQuery().subscribe({
        next: (data) => setResources([...data.items]),
    });

}, []);

useEffect(() => {
    getPosts();
    getResources();
    getStudyGroups();
    getUsers();
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



const getUsers = async () => {
    try {
        const postsResponse = await client.models.User.list();
        setUsers(postsResponse.data.map(e => e));
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
};

const {user} = useAuthenticator();



  const statCards = [
    { title: "Total Posts", icon: <PostIcon fontSize="large" color="primary" />, value: posts.length },
    { title: "Total Likes", icon: <LikeIcon fontSize="large" color="primary" />, value: posts.reduce((acc, curr) => (acc + curr.likes.length), 0) },
    { title: "Total Resources", icon: <ResourceIcon fontSize="large" color="primary" />, value: resources.length },
    { title: "Resource Views", icon: <ViewIcon fontSize="large" color="primary" />, value: 0 },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Container sx={{ flexGrow: 1, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="h5" sx={{ color: '#666' }}>
          Hello {userDetails.find(v => v.id === user.userId)?.name}
        </Typography>
        
        {/* Stats */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {statCards.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ bgcolor: '#f9f9f9', boxShadow: 2, borderRadius: 2 }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#333' }}>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" sx={{ color: '#007BFF', fontWeight: '700' }}>
                      {stat.value}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Feeds, Resources, and Study Groups */}
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Feeds</Typography>
            <Box
              sx={{
                maxHeight: { xs: '250px', md: '400px' },
                overflowY: 'auto',
                bgcolor: '#fafafa',
                borderRadius: 2,
                boxShadow: 2,
                p: 2,
              }}
            >
              {posts.map((post, index) => (
                <Box key={index} sx={{ pb: 1, borderBottom: '1px solid #ddd' }}>
                  <Typography variant="body1">
                    <strong>{userDetails.find(v => v.id===post.owner)?.preferredName || post?.user}</strong> posted '{post.content}' at <strong>{moment(post.timestamp).fromNow()}</strong>
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Resources</Typography>
            <Box
              sx={{
                maxHeight: { xs: '250px', md: '400px' },
                overflowY: 'auto',
                bgcolor: '#fafafa',
                borderRadius: 2,
                boxShadow: 2,
                p: 2,
              }}
            >
              {resources.map((resource, index) => (
                <Box key={index} sx={{ pb: 1, borderBottom: '1px solid #ddd' }}>
                  <Typography variant="body1">
                    <strong>{userDetails.find(v => v.id===resource.owner)?.preferredName || 'Anonymous'}</strong> created '{resource.title}' in Resources
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Study Groups</Typography>
            <Box
              sx={{
                maxHeight: { xs: '250px', md: '400px' },
                overflowY: 'auto',
                bgcolor: '#fafafa',
                borderRadius: 2,
                boxShadow: 2,
                p: 2,
              }}
            >
              {studyGroups.map((group, index) => (
                <Box key={index} sx={{ pb: 1, borderBottom: '1px solid #ddd' }}>
                  <Typography variant="body1">
                    <strong>{userDetails.find(v => v.id===group.owner)?.preferredName || 'Anonymous'}</strong> created '{group.title}' in Study Groups
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Dashboard;
