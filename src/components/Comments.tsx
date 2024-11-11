import React, { useState, useEffect } from 'react';
import { Avatar, Button, TextField, Typography, Divider, List, Skeleton, Tooltip, IconButton, Paper } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { Schema } from '../../amplify/data/resource';
import { generateClient } from 'aws-amplify/api';
import DeleteIcon from '@mui/icons-material/Delete';

const client = generateClient<Schema>();

const Timestamp = ({ time }) => (
  <Tooltip title={moment(time).format('MMMM Do YYYY, h:mm:ss a')}>
    <span style={{ color: '#757575', fontSize: '0.875rem' }}>
      {moment(time).fromNow()}
    </span>
  </Tooltip>
);

const CommentItem = ({ item, handleDelete, user }) => (
  <Paper sx={{ padding: 2, marginBottom: 2, display: 'flex', flexDirection: 'column', boxShadow: 3 }}>
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
      <Avatar style={{ marginRight: '8px', backgroundColor: '#1976d2' }} />
      <Typography variant="subtitle1">{item.author}</Typography>
    </div>
    <Typography variant="body2" color="textSecondary" paragraph>
      {item.content}
    </Typography>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Timestamp time={item.datetime} />
      {user === item.author && (
        <Tooltip title="Delete Comment">
          <IconButton color="error" onClick={() => handleDelete(item.id)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </div>
  </Paper>
);

const Comments = ({ id, user }) => {
  const [commentContent, setCommentContent] = useState('');
  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchComments();
    }
  }, [id]);

  const fetchComments = async () => {
    try {
      setCommentsLoading(true);
      const response = (await client.models.SubFeed.list()).data.filter(e => e.post === id);
      if (response.length > 0) {
        const formattedComments = response.map((comment) => ({
          id: comment.id,
          datetime: comment.createdAt,
          author: comment.comementor,
          content: comment.content,
        }));
        setComments(formattedComments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!commentContent) return;

    setSubmitting(true);
    const commentId = `comment-${uuidv4()}`;
    const timestamp = moment().format();
    const apiName = 'posts';
    const path = '/comments/post-comment';
    const myInit = {
      body: {
        commentId,
        timestamp,
        user,
        content: commentContent,
        ref: id,
      },
    };

    try {
      await client.models.SubFeed.create({
        post: id,
        comementor: user,
        content: commentContent,
      });

      setCommentContent('');
      fetchComments();  // Re-fetch the comments after submitting
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setCommentsLoading(true);
    try {
      await client.models.SubFeed.delete(id);
      setComments((prevComments) => prevComments.filter((comment) => comment.id !== id));
    } catch (error) {
      console.error('Error deleting comment:', error);
    } finally {
      setCommentsLoading(false);
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '600px', margin: '0 auto' }}>
      <Divider orientation="left" sx={{ marginBottom: 2 }}>
        <Typography variant="h6">Add a Comment</Typography>
      </Divider>

      <TextField
        label="Write a comment..."
        multiline
        rows={4}
        fullWidth
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
        variant="outlined"
        sx={{ marginBottom: 2 }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={submitting}
        sx={{ width: '100%' }}
      >
        {submitting ? 'Submitting...' : 'Submit'}
      </Button>

      <div style={{ marginTop: '30px' }}>
        {commentsLoading ? (
          <Skeleton variant="rectangular" width="100%" height={80} sx={{ marginBottom: 2 }} />
        ) : (
          comments.map((item) => (
            <CommentItem
              key={item.id}
              item={item}
              handleDelete={handleDelete}
              user={user}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;
