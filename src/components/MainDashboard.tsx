import React, { useState } from 'react';
import {
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Divider,
  Box,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  Feed,
  Book,
  Group,
  Person,
  ExitToApp,
} from '@mui/icons-material';
import Feeds from './Feeds';
import StudyGroupsPage from './StudyGroups';
import Profile from './MyProfile';
import Dashboard from './Dashboard';
import { useAuthenticator } from '@aws-amplify/ui-react';
import ResourcePage from './Resources';

function MainDashboard(props) {
  const [component, setComponent] = useState(1);
  const [header, setHeader] = useState('Campus Connect');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(1); // Track the active menu item

  const switchComponent = (page) => {
    setComponent(page);
    setActiveItem(page); // Update the active item
    setDrawerOpen(false);
  };

  const renderComponent = () => {
    switch (component) {
      case 1:
        return <Dashboard handler={setHeader} />;
      case 2:
        return <Feeds setHeader={setHeader} />;
      case 3:
        return <ResourcePage setHeader={setHeader} />;
      case 4:
        return <StudyGroupsPage handler={setHeader} />;
      case 5:
        return <Profile handler={setHeader} />;
      default:
        return <div>{component}</div>;
    }
  };

  const { signOut } = useAuthenticator();

  const trySignOut = () => {
    signOut();
  };

  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  };

  const handleNavigation = [
    { text: 'Dashboard', icon: <Home />, component: 1 },
    { text: 'Feeds', icon: <Feed />, component: 2 },
    { text: 'Resources', icon: <Book />, component: 3 },
    { text: 'Study Groups', icon: <Group />, component: 4 },
    { text: 'My Profile', icon: <Person />, component: 5 },
    { text: 'Sign Out', icon: <ExitToApp />, action: trySignOut },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: 1300, bgcolor: '#1a73e8' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => toggleDrawer(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            {header}
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 250, // Adjusted width for a richer feel
            bgcolor: 'linear-gradient(180deg, #1a73e8, #66bbff)', // Gradient background
            color: '#fff', // White text for contrast
            paddingTop: '24px',
            boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.2)', // Shadow for depth
            borderRadius: '16px 0 0 16px', // Rounded corners for sidebar
            transition: 'all 0.3s ease-in-out', // Smooth transition effect
          },
        }}
      >
        <Box sx={{ padding: '0 16px' }}>
          <Typography variant="h6" sx={{ padding: '8px 0', color: '#fff' }}>
            Campus Connect
          </Typography>
          <Divider sx={{ marginBottom: '24px', bgcolor: '#fff' }} />
          <List>
            {handleNavigation.map((item, index) => (
              <Tooltip title={item.text} placement="right" key={index}>
                <ListItem
                  button
                  onClick={item.action ? item.action : () => switchComponent(item.component)}
                  sx={{
                    '&:hover': {
                      bgcolor: '#ffffff26', // Light hover effect
                    },
                    padding: '12px 16px',
                    borderRadius: '8px',
                    margin: '8px 0',
                    backgroundColor: activeItem === item.component ? '#ffffff26' : 'transparent', // Highlight active item
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: 'inherit',
                    }}
                  />
                </ListItem>
              </Tooltip>
            ))}
          </List>
        </Box>
      </Drawer>

      <main style={{ flex: 1, marginTop: '64px', padding: '16px' }}>
        {renderComponent()}
      </main>
    </div>
  );
}

export default MainDashboard;
