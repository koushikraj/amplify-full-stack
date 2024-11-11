import { AddCircleOutlineOutlined } from '@mui/icons-material';
import { Box, Button, Drawer, TextField, Typography } from '@mui/material';
import { generateClient } from 'aws-amplify/api';
import React, { useEffect, useState } from 'react';
import { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

const ResourcePage: React.FC = () => {
    const [resources, setResources] = useState<Schema["Resource"]["type"][]>([]);
    const [selectedResource, setSelectedResource] = useState<Schema["Resource"]["type"] | null>(resources?.at(0) || null);

    const [selectedFlashcard, setSelectedFlashcard] = useState<number | null>(null);
    const [comments, setComments] = useState<string[]>([]);
    const [newComment, setNewComment] = useState("");

    const [isDrawerVisible, setIsDrawerVisible] = useState(false);

    const showDrawer = () => setIsDrawerVisible(true);
    const closeDrawer = () => setIsDrawerVisible(false);

    useEffect(() => {
        client.models.Resource.observeQuery().subscribe({
            next: (data) => {
                setResources([...data.items]);
                if (selectedResource === null && data.items.length > 0) setSelectedResource(data.items[0]);
            }
        });
    }, []);

    useEffect(() => {
        getResources()
    }, [])

    const getResources = async () => {
        try {
            const postsResponse = await client.models.Resource.list();
            setResources(postsResponse.data.map(e => e));
            if (selectedResource === null && postsResponse.data.length > 0) setSelectedResource(postsResponse.data[0]); 
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const handleResourceClick = (resource: Schema["Resource"]["type"]) => {
        setSelectedResource(resource);
        setSelectedFlashcard(null); // Reset flashcard selection
    };

    const handleFlashcardClick = (index: number) => {
        setSelectedFlashcard(selectedFlashcard === index ? null : index); // Toggle flashcard details
    };

    const handleAddComment = () => {
        if (newComment.trim()) {
            setComments([...comments, newComment]);
            setNewComment("");
        }
    };

    const handleAddResource = ({
        title,
        description,
        link,
        category,
        createdBy,
        flashcards,
    }: any) => {
        client.models.Resource.create({
            title,
            description,
            link,
            category,
            professor: createdBy,
            flashcards,
        })
        closeDrawer();
    };


    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Resources</h1>

            <div style={styles.sidebar}>
                <button style={styles.createFlashcardsButton} onClick={showDrawer}>Create Resource</button>
                {isDrawerVisible && <ResourceDrawer onAddResource={handleAddResource} setIsDrawerVisible={setIsDrawerVisible} isDrawerVisible={isDrawerVisible} />}
                {resources?.map(resource => (
                    <div
                        key={resource.id}
                        style={styles.resourceCard}
                        onClick={() => handleResourceClick(resource)}
                    >
                        <h2>{resource.title}</h2>
                        <p>{resource.description}</p>
                    </div>
                ))}
            </div>
            {resources?.length > 0 ?
                <div style={styles.mainContent}>
                    <h2>{selectedResource?.title}</h2>
                    <p style={styles.createdBy}>Professor: {selectedResource?.professor}</p>
                    <p style={styles.description}>{selectedResource?.description}</p>
                    <h3>Flashcards</h3>
                    <div style={styles.flashcardGrid}>
                        {selectedResource?.flashcards?.map((flashcard, index) => (
                            <div
                                key={index}
                                style={styles.flashcard}
                                onClick={() => handleFlashcardClick(index)}
                            >
                                <h4 style={styles.flashcardTitle}>{flashcard.title}</h4>
                                <p style={styles.flashcardDescription}>
                                    {selectedFlashcard === index ? flashcard.details : flashcard.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Comment Section */}
                    <div style={styles.commentsSection}>
                        <h3>Comments</h3>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment"
                            style={styles.commentInput}
                        />
                        <button onClick={handleAddComment} style={styles.addCommentButton}>Add Comment</button>

                        {comments.length > 0 && (
                            <div style={styles.commentList}>
                                {comments.map((comment, index) => (
                                    <p key={index} style={styles.commentItem}>• {comment}</p>
                                ))}
                            </div>
                        )}
                    </div>
                </div> : <div> No Resource Found </div>}
        </div>
    );
};


const ResourceDrawer: React.FC<{ onAddResource: (resource: any) => void, isDrawerVisible: boolean, setIsDrawerVisible: (state: boolean) => void }> = ({ onAddResource, isDrawerVisible, setIsDrawerVisible }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [category, setCategory] = useState('');
    const [link, setLink] = useState('')
    const [flashcards, setFlashcards] = useState<{ title: string; description: string; details: string }[]>([]);

    const handleAddFlashcard = () => {
        setFlashcards([...flashcards, { title: '', description: '', details: '' }]);
    };

    const handleFlashcardChange = (index: number, field: string, value: string) => {
        const updatedFlashcards = flashcards.map((flashcard, i) =>
            i === index ? { ...flashcard, [field]: value } : flashcard
        );
        setFlashcards(updatedFlashcards);
    };

    const handleAddResource = () => {
        onAddResource({
            title,
            description,
            link,
            category,
            createdBy,
            flashcards,
        });

    };

    return (
        <>
            <Drawer anchor="right" open={isDrawerVisible} onClose={() => setIsDrawerVisible(false)}>
                <Box sx={{ width: 400, padding: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        Create a New Resource
                    </Typography>
                    <TextField
                        label="Title"
                        fullWidth
                        margin="normal"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        margin="normal"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <TextField
                        label="Professor"
                        fullWidth
                        margin="normal"
                        value={createdBy}
                        onChange={(e) => setCreatedBy(e.target.value)}
                    />
                    <TextField
                        label="Link"
                        fullWidth
                        margin="normal"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                    />

                    <TextField
                        label="Category"
                        fullWidth
                        margin="normal"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />

                    <Typography variant="h6" sx={{ marginTop: 2 }}>
                        Flashcards
                    </Typography>
                    {flashcards.map((flashcard, index) => (
                        <Box key={index} sx={{ marginBottom: 2 }}>
                            <TextField
                                label="Flashcard Title"
                                fullWidth
                                required
                                margin="dense"
                                value={flashcard.title}
                                onChange={(e) => handleFlashcardChange(index, 'title', e.target.value)}
                            />
                            <TextField
                                label="Flashcard Description"
                                fullWidth
                                required
                                margin="dense"
                                value={flashcard.description}
                                onChange={(e) => handleFlashcardChange(index, 'description', e.target.value)}
                            />
                            <TextField
                                label="Flashcard Details"
                                fullWidth
                                margin="dense"
                                value={flashcard.details}
                                onChange={(e) => handleFlashcardChange(index, 'details', e.target.value)}
                            />
                        </Box>
                    ))}
                    <Button
                        startIcon={<AddCircleOutlineOutlined />}
                        onClick={handleAddFlashcard}
                        sx={{ marginTop: 1 }}
                    >
                        Add Flashcard
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleAddResource}
                        sx={{ marginTop: 3 }}
                    >
                        Submit Resource
                    </Button>
                </Box>
            </Drawer>
        </>
    );
};



const styles = {
    container: {
        display: 'flex',
        flexDirection: 'row' as const,
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    header: {
        fontSize: '24px',
        marginBottom: '20px',
    },
    sidebar: {
        width: '25%',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '15px',
        paddingRight: '20px',
    },
    createFlashcardsButton: {
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        padding: '10px',
        fontSize: '14px',
        cursor: 'pointer',
        borderRadius: '5px',
    },
    resourceCard: {
        backgroundColor: '#f1f1f1',
        padding: '15px',
        borderRadius: '8px',
        cursor: 'pointer',
    },
    mainContent: {
        width: '75%',
        paddingLeft: '20px',
        backgroundColor: '#ffffff',
    },
    createdBy: {
        fontSize: '14px',
        color: '#666',
    },
    description: {
        fontSize: '14px',
        color: '#666',
        marginBottom: '20px',
    },
    flashcardGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px',
        marginTop: '20px',
    },
    flashcard: {
        backgroundColor: '#f9f9f9',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
    },
    flashcardTitle: {
        margin: '0',
        fontSize: '16px',
        fontWeight: 'bold' as const,
    },
    flashcardDescription: {
        fontSize: '14px',
        color: '#555',
    },
    commentsSection: {
        marginTop: '30px',
    },
    commentInput: {
        width: '100%',
        padding: '10px',
        margin: '10px 0',
        borderRadius: '5px',
        border: '1px solid #ddd',
        fontSize: '14px',
    },
    addCommentButton: {
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        padding: '10px',
        cursor: 'pointer',
        borderRadius: '5px',
    },
    commentList: {
        marginTop: '15px',
    },
    commentItem: {
        fontSize: '14px',
        color: '#333',
        margin: '5px 0',
    },
};

export default ResourcePage;
