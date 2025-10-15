import React, { useState } from "react";
import {
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Rating,
  Avatar,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
} from "@mui/material";
import {
  Edit,
  Delete,
  Send,
  RateReview,
  Person,
} from "@mui/icons-material";
import { perfumesAPI } from "../services/api";
import { Perfume, Comment } from "../types";
import { useAuth } from "../context/AuthContext";

// Helper function to format date
const formatTimeAgo = (date: string) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
};

interface CommentSectionProps {
  perfume: Perfume;
  onCommentAdded: () => void;
  onCommentUpdated: () => void;
  onCommentDeleted: () => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  perfume,
  onCommentAdded,
  onCommentUpdated,
  onCommentDeleted,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [rating, setRating] = useState<number>(5);
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  
  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editCommentId, setEditCommentId] = useState<string>("");
  const [editRating, setEditRating] = useState<number>(5);
  const [editContent, setEditContent] = useState<string>("");

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteCommentId, setDeleteCommentId] = useState<string>("");

  // Check if user has already commented
  const userComment = perfume.comments.find(
    (comment) => comment.author._id === user?._id || comment.author._id === user?.id
  );

  const handleSubmitComment = async () => {
    if (!content.trim()) {
      setError("Please enter a comment");
      return;
    }

    if (rating < 1 || rating > 5) {
      setError("Please select a rating");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await perfumesAPI.addComment(perfume._id, {
        rating,
        content: content.trim(),
      });

      setSuccess("Comment added successfully!");
      setRating(5);
      setContent("");
      onCommentAdded();
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to add comment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditDialog = (comment: Comment) => {
    setEditCommentId(comment._id);
    setEditRating(comment.rating);
    setEditContent(comment.content);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditCommentId("");
    setEditRating(5);
    setEditContent("");
  };

  const handleUpdateComment = async () => {
    if (!editContent.trim()) {
      setError("Please enter a comment");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await perfumesAPI.updateComment(perfume._id, editCommentId, {
        rating: editRating,
        content: editContent.trim(),
      });

      setSuccess("Comment updated successfully!");
      handleCloseEditDialog();
      onCommentUpdated();
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to update comment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteDialog = (commentId: string) => {
    setDeleteCommentId(commentId);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeleteCommentId("");
  };

  const handleDeleteComment = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await perfumesAPI.deleteComment(perfume._id, deleteCommentId);

      setSuccess("Comment deleted successfully!");
      handleCloseDeleteDialog();
      onCommentDeleted();
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to delete comment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 4,
        borderRadius: 3,
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <RateReview sx={{ color: "#0ea5e9", fontSize: 28 }} />
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#0f172a" }}>
          Reviews & Ratings
        </Typography>
        <Chip
          label={`${perfume.comments.length} ${
            perfume.comments.length === 1 ? "Review" : "Reviews"
          }`}
          size="small"
          sx={{
            backgroundColor: "#e0f2fe",
            color: "#0ea5e9",
            fontWeight: 600,
          }}
        />
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Success/Error Messages */}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Add Comment Form - Only show if authenticated and hasn't commented */}
      {isAuthenticated && !userComment && (
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "#0f172a", mb: 2 }}
          >
            Write a Review
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography
              variant="body2"
              sx={{ color: "#64748b", mb: 1, fontWeight: 500 }}
            >
              Your Rating
            </Typography>
            <Rating
              value={rating}
              onChange={(event, newValue) => {
                if (newValue !== null) setRating(newValue);
              }}
              size="large"
              sx={{
                color: "#f59e0b",
              }}
            />
          </Box>

          <TextField
            multiline
            rows={4}
            fullWidth
            placeholder="Share your experience with this perfume..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            variant="outlined"
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&:hover fieldset": {
                  borderColor: "#0ea5e9",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#0ea5e9",
                },
              },
            }}
          />

          <Button
            variant="contained"
            startIcon={<Send />}
            onClick={handleSubmitComment}
            disabled={loading}
            sx={{
              background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
              fontWeight: 600,
              textTransform: "none",
              px: 4,
              py: 1,
              borderRadius: 2,
              "&:hover": {
                background:
                  "linear-gradient(135deg, #0284c7 0%, #0891b2 100%)",
              },
              "&:disabled": {
                background: "#cbd5e1",
              },
            }}
          >
            {loading ? "Submitting..." : "Submit Review"}
          </Button>
        </Box>
      )}

      {/* User's existing comment - editable */}
      {isAuthenticated && userComment && (
        <Box
          sx={{
            mb: 4,
            p: 3,
            backgroundColor: "#f0f9ff",
            borderRadius: 2,
            border: "2px solid #0ea5e9",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
            }}
          >
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, color: "#0f172a" }}
              >
                Your Review
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                {userComment.createdAt && formatTimeAgo(userComment.createdAt)}
              </Typography>
            </Box>
            <Box>
              <IconButton
                size="small"
                onClick={() => handleOpenEditDialog(userComment)}
                sx={{
                  color: "#0ea5e9",
                  "&:hover": { backgroundColor: "#e0f2fe" },
                }}
              >
                <Edit fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleOpenDeleteDialog(userComment._id)}
                sx={{
                  color: "#ef4444",
                  "&:hover": { backgroundColor: "#fee2e2" },
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          <Rating
            value={userComment.rating}
            readOnly
            size="small"
            sx={{ mb: 1, color: "#f59e0b" }}
          />
          <Typography variant="body1" sx={{ color: "#475569" }}>
            {userComment.content}
          </Typography>
        </Box>
      )}

      {/* Login prompt for unauthenticated users */}
      {!isAuthenticated && (
        <Alert severity="info" sx={{ mb: 4 }}>
          Please log in to write a review for this perfume.
        </Alert>
      )}

      {/* Already commented message */}
      {isAuthenticated && userComment && (
        <Alert severity="info" sx={{ mb: 4 }}>
          You have already reviewed this perfume. You can edit or delete your
          review above.
        </Alert>
      )}

      {/* All Comments List */}
      <Typography
        variant="h6"
        sx={{ fontWeight: 600, color: "#0f172a", mb: 3 }}
      >
        All Reviews ({perfume.comments.length})
      </Typography>

      {perfume.comments.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 6,
            color: "#94a3b8",
          }}
        >
          <RateReview sx={{ fontSize: 64, opacity: 0.3, mb: 2 }} />
          <Typography variant="body1">
            No reviews yet. Be the first to review this perfume!
          </Typography>
        </Box>
      ) : (
        <Box>
          {perfume.comments.map((comment, index) => (
            <Box key={comment._id}>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  py: 3,
                }}
              >
                <Avatar
                  sx={{
                    backgroundColor: "#0ea5e9",
                    width: 48,
                    height: 48,
                  }}
                >
                  <Person />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 1,
                    }}
                  >
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 700, color: "#0f172a" }}
                      >
                        {comment.author.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#64748b" }}>
                        {comment.createdAt && formatTimeAgo(comment.createdAt)}
                      </Typography>
                    </Box>
                    <Rating
                      value={comment.rating}
                      readOnly
                      size="small"
                      sx={{ color: "#f59e0b" }}
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "#475569", lineHeight: 1.7 }}
                  >
                    {comment.content}
                  </Typography>
                </Box>
              </Box>
              {index < perfume.comments.length - 1 && <Divider />}
            </Box>
          ))}
        </Box>
      )}

      {/* Edit Comment Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#0f172a" }}>
          Edit Your Review
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3, mt: 1 }}>
            <Typography
              variant="body2"
              sx={{ color: "#64748b", mb: 1, fontWeight: 500 }}
            >
              Your Rating
            </Typography>
            <Rating
              value={editRating}
              onChange={(event, newValue) => {
                if (newValue !== null) setEditRating(newValue);
              }}
              size="large"
              sx={{
                color: "#f59e0b",
              }}
            />
          </Box>

          <TextField
            multiline
            rows={4}
            fullWidth
            placeholder="Share your experience with this perfume..."
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&:hover fieldset": {
                  borderColor: "#0ea5e9",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#0ea5e9",
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={handleCloseEditDialog}
            sx={{
              color: "#64748b",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#f1f5f9",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateComment}
            disabled={loading}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
              fontWeight: 600,
              textTransform: "none",
              px: 3,
              "&:hover": {
                background:
                  "linear-gradient(135deg, #0284c7 0%, #0891b2 100%)",
              },
            }}
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#0f172a" }}>
          Delete Review
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ color: "#475569" }}>
            Are you sure you want to delete your review? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={handleCloseDeleteDialog}
            sx={{
              color: "#64748b",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#f1f5f9",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteComment}
            disabled={loading}
            variant="contained"
            sx={{
              backgroundColor: "#ef4444",
              fontWeight: 600,
              textTransform: "none",
              px: 3,
              "&:hover": {
                backgroundColor: "#dc2626",
              },
            }}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default CommentSection;
