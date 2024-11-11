import React, { useState, useEffect } from 'react';
import {
    Drawer,
    Typography,
    Button,
    Modal,
    Divider,
    Avatar,
    Alert,
    TextField,
    CircularProgress,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    IconButton,
    Box,
    Paper,
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { Schema } from '../../amplify/data/resource';
import { generateClient } from 'aws-amplify/api';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { ChatBubbleOutline, Favorite, FavoriteOutlined, Share } from '@mui/icons-material';
import Comments from './Comments';

const client = generateClient<Schema>();

const Feeds = ({ setHeader }) => {
    const [deleteSubfeedLoading, setDeleteSubfeedLoading] = useState(false);
    const [confirmModalLoading, setConfirmModalLoading] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [componentLoading, setComponentLoading] = useState(false);
    const [titleError, setTitleError] = useState(false);
    const [contentError, setContentError] = useState(false);
    const { user, username } = useAuthenticator();
    const [posts, setPosts] = useState<Array<Schema["Post"]["type"]>>([]);
    const [subfeeds, setSubfeeds] = useState<any>([]);
    const [currentSubfeed, setCurrentSubfeed] = useState<string>('General');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [commentDrawerVisible, setCommentDrawerVisible] = useState(false);
    const [postId, setPostId] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        client.models.Post.observeQuery().subscribe({
            next: (data) => setPosts([...data.items]),
        });
    }, []);

    useEffect(() => {
        getPosts();
    }, [setHeader]);

    const handleChange = (type, value) => {
        if (type === 'title') {
            setTitle(value);
            setTitleError(false);
        } else if (type === 'content') {
            setContent(value);
            setContentError(false);
        }
    };

    const checkInput = () => {
        let error = false;
        if (title === '') {
            setTitleError(true);
            error = true;
        }
        if (content === '') {
            setContentError(true);
            error = true;
        }
        return error;
    };

    const createPost = async (post) => {
        return await client.models.Post.create(post);
    };

    const getPosts = async () => {
        try {
            const postsResponse = await client.models.Post.list();
            setPosts(postsResponse.data.map(e => e));
            setComponentLoading(false);
        } catch (error) {
            console.error('Error fetching posts:', error);
            setComponentLoading(false);
        }
    };

    const handleCommentDrawer = (id) => {
        setCommentDrawerVisible(true);
        setPostId(id);
    };

    const userEmail = user?.signInDetails?.loginId || "";

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (checkInput()) return;

        setButtonLoading(true);

        try {
            const timestamp = moment().format();
            await createPost({
                subfeed: currentSubfeed,
                likes: [user?.signInDetails?.loginId],
                dislikes: [],
                timestamp,
                id: `post-${uuidv4()}`,
                user: user?.signInDetails?.loginId,
                title,
                content,
            });
            setButtonLoading(false);
            setTitle('');
            setContent('');
            alert('Post has been created!');
            setDrawerVisible(false);
            getPosts();
        } catch (e) {
            setButtonLoading(false);
            alert('Could not create post.');
            console.error(e);
        }
    };

    async function toggleLike(post) {
        await client.models.Post.update({
            likes: post.likes.includes(userEmail)
                ? post.likes.filter((email) => email !== userEmail)
                : [...post.likes, userEmail],
            id: post.id,
        }, { selectionSet: ["likes", "id"] });
        getPosts();
    }

    return (
        <>
            <Typography variant="h4" align="center" style={{ marginBottom: '20px', fontWeight: 500 }}>
                Community Feed
            </Typography>
            <Box display="flex" justifyContent="center" mb={2}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setDrawerVisible(true)}
                    sx={{ boxShadow: 2 }}
                >
                    Create Post
                </Button>
            </Box>
            <Drawer anchor="right" open={drawerVisible} onClose={() => setDrawerVisible(false)}>
                <Box padding={2} width="400px">
                    <Typography variant="h6" gutterBottom>
                        Create a New Post
                    </Typography>
                    <TextField
                        label="Title"
                        fullWidth
                        value={title}
                        onChange={e => handleChange('title', e.target.value)}
                        error={titleError}
                        helperText={titleError ? 'Title is required' : ''}
                        margin="normal"
                        variant="outlined"
                    />
                    <TextField
                        label="Content"
                        fullWidth
                        multiline
                        minRows={4}
                        value={content}
                        onChange={e => handleChange('content', e.target.value)}
                        error={contentError}
                        helperText={contentError ? 'Content is required' : ''}
                        margin="normal"
                        variant="outlined"
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={buttonLoading}
                        sx={{ marginTop: 2, width: '100%' }}
                    >
                        {buttonLoading ? <CircularProgress size={24} /> : 'Submit'}
                    </Button>
                </Box>
            </Drawer>

            <Drawer anchor="right" open={commentDrawerVisible} onClose={() => setCommentDrawerVisible(false)}>
                <Comments id={postId} user={userEmail} commentDrawer={setCommentDrawerVisible} />
            </Drawer>

            {componentLoading ? (
                <Box display="flex" justifyContent="center" padding={2}>
                    <CircularProgress />
                </Box>
            ) : (
                posts.map(post => (
                    <Card key={post.id} sx={{ marginBottom: 2, boxShadow: 3 }}>
                        <CardHeader
                            avatar={<Avatar />}
                            title={post.title}
                            subheader={moment(post.timestamp).fromNow()}
                            sx={{ paddingBottom: 0 }}
                        />
                        <CardContent>
                            <Typography variant="body2">{post.content}</Typography>
                        </CardContent>
                        <Divider />
                        <CardActions sx={{ paddingTop: 1 }}>
                            <IconButton onClick={() => toggleLike(post)}>
                                {
                                    post?.likes?.includes(userEmail)
                                        ? <Favorite color="error" />
                                        : <FavoriteOutlined color="disabled" />
                                }
                                <Typography variant="caption" sx={{ marginLeft: 1 }}>
                                    {post.likes?.length}
                                </Typography>
                            </IconButton>
                            <IconButton onClick={() => handleCommentDrawer(post.id)}>
                                <ChatBubbleOutline />
                            </IconButton>
                            <IconButton>
                                <Share />
                            </IconButton>
                        </CardActions>
                    </Card>
                ))
            )}
        </>
    );
};

export default Feeds;
