import React, { useState } from "react";
import { useLocation } from "react-router-dom";
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
import { Edit, Delete, Send, RateReview, Person } from "@mui/icons-material";
import { perfumesAPI } from "../services/api";
import { Perfume, Comment } from "../types";
import { useAuth } from "../context/AuthContext";

// Helper function to format date
const formatTimeAgo = (date: string) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000)
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
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
  const location = useLocation();
  const { user, isAuthenticated, openAuthModal, setPreLoginPath } = useAuth();
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
    (comment) =>
      comment.author._id === user?._id || comment.author._id === user?.id
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
        err.response?.data?.message ||
          "Failed to add comment. Please try again."
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
        err.response?.data?.message ||
          "Failed to update comment. Please try again."
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
        err.response?.data?.message ||
          "Failed to delete comment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: 4,
        background: "var(--bg-elevated)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "0 24px 60px rgba(0, 0, 0, 0.35)",
        backdropFilter: "var(--surface-blur)",
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <RateReview
          sx={{
            color: "var(--accent-primary)",
            fontSize: 28,
            filter: "drop-shadow(0 6px 16px rgba(193, 156, 255, 0.45))",
          }}
        />
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: "var(--text-primary)", letterSpacing: "0.04em" }}
        >
          Reviews & Ratings
        </Typography>
        <Chip
          label={`${perfume.comments.length} ${
            perfume.comments.length === 1 ? "Review" : "Reviews"
          }`}
          size="small"
          sx={{
            background: "rgba(224, 212, 255, 0.18)",
            color: "var(--accent-primary)",
            fontWeight: 600,
            border: "1px solid rgba(224, 212, 255, 0.35)",
          }}
        />
      </Box>

      <Divider sx={{ mb: 3, borderColor: "var(--divider)" }} />

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

      {/* Add Comment Form - Only show if authenticated, not admin, and hasn't commented */}
      {isAuthenticated && !user?.isAdmin && !userComment && (
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "var(--text-primary)", mb: 2 }}
          >
            Write a Review
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography
              variant="body2"
              sx={{ color: "var(--text-secondary)", mb: 1, fontWeight: 500 }}
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
                color: "#f6c561",
                filter: "drop-shadow(0 6px 12px rgba(246, 197, 97, 0.4))",
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
                  borderColor: "rgba(224, 212, 255, 0.6)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "rgba(224, 212, 255, 0.9)",
                  boxShadow: "0 0 0 1px rgba(224, 212, 255, 0.35)",
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
              background:
                "linear-gradient(120deg, rgba(250, 244, 255, 0.92) 0%, rgba(227, 239, 255, 0.92) 60%, rgba(254, 248, 231, 0.92) 100%)",
              color: "#0b0d12",
              fontWeight: 600,
              textTransform: "none",
              px: 4,
              py: 1,
              borderRadius: 999,
              letterSpacing: "0.08em",
              boxShadow:
                "0 18px 32px rgba(193, 156, 255, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.12) inset",
              "&:hover": {
                background:
                  "linear-gradient(120deg, rgba(255, 255, 255, 0.96) 0%, rgba(233, 242, 255, 0.96) 55%, rgba(255, 241, 210, 0.96) 100%)",
                boxShadow:
                  "0 26px 42px rgba(193, 156, 255, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.18) inset",
              },
              "&:disabled": {
                background: "rgba(255, 255, 255, 0.12)",
                color: "var(--text-secondary)",
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
            background: "rgba(224, 212, 255, 0.08)",
            borderRadius: 3,
            border: "1px solid rgba(224, 212, 255, 0.35)",
            boxShadow: "0 18px 36px rgba(0, 0, 0, 0.35)",
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
                sx={{ fontWeight: 700, color: "var(--text-primary)" }}
              >
                Your Review
              </Typography>
              <Typography variant="caption" sx={{ color: "var(--text-secondary)" }}>
                {userComment.createdAt && formatTimeAgo(userComment.createdAt)}
              </Typography>
            </Box>
            <Box>
              <IconButton
                size="small"
                onClick={() => handleOpenEditDialog(userComment)}
                sx={{
                  color: "var(--accent-primary)",
                  border: "1px solid rgba(224, 212, 255, 0.25)",
                  borderRadius: 2,
                  "&:hover": { backgroundColor: "rgba(224, 212, 255, 0.1)" },
                }}
              >
                <Edit fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleOpenDeleteDialog(userComment._id)}
                sx={{
                  color: "#ef4444",
                  border: "1px solid rgba(239, 68, 68, 0.25)",
                  borderRadius: 2,
                  "&:hover": { backgroundColor: "rgba(239, 68, 68, 0.08)" },
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
            sx={{ mb: 1, color: "#f6c561" }}
          />
          <Typography variant="body1" sx={{ color: "var(--text-secondary)" }}>
            {userComment.content}
          </Typography>
        </Box>
      )}

      {/* Login prompt for unauthenticated users */}
      {!isAuthenticated && (
        <Alert severity="info" sx={{ mb: 4 }}>
          Please{" "}
          <Box
            component="span"
            onClick={() => {
              setPreLoginPath(location.pathname);
              openAuthModal("login");
            }}
            sx={{
              fontWeight: 700,
              color: "var(--accent-primary)",
              cursor: "pointer",
              textDecoration: "underline",
              "&:hover": {
                color: "var(--accent-strong)",
                textDecoration: "none",
              },
            }}
          >
            log in
          </Box>{" "}
          to write a review for this perfume.
        </Alert>
      )}

      {/* Admin cannot comment message */}
      {isAuthenticated && user?.isAdmin && (
        <Alert severity="info" sx={{ mb: 4 }}>
          Admins cannot write reviews. Only customers can leave reviews.
        </Alert>
      )}

      {/* Already commented message */}
      {isAuthenticated && !user?.isAdmin && userComment && (
        <Alert severity="info" sx={{ mb: 4 }}>
          You have already reviewed this perfume. You can edit or delete your
          review above.
        </Alert>
      )}

      {/* All Comments List */}
      <Typography
        variant="h6"
        sx={{ fontWeight: 600, color: "var(--text-primary)", mb: 3 }}
      >
        All Reviews ({perfume.comments.length})
      </Typography>

      {perfume.comments.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 6,
            color: "var(--text-secondary)",
          }}
        >
          <RateReview
            sx={{ fontSize: 64, opacity: 0.3, mb: 2, color: "var(--accent-primary)" }}
          />
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
                    background:
                      "linear-gradient(135deg, rgba(224, 212, 255, 0.85) 0%, rgba(149, 207, 255, 0.85) 100%)",
                    width: 48,
                    height: 48,
                    color: "#0b0d12",
                    boxShadow: "0 12px 24px rgba(193, 156, 255, 0.3)",
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
                        sx={{ fontWeight: 700, color: "var(--text-primary)" }}
                      >
                        {comment.author.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "var(--text-secondary)" }}>
                        {comment.createdAt && formatTimeAgo(comment.createdAt)}
                      </Typography>
                    </Box>
                    <Rating
                      value={comment.rating}
                      readOnly
                      size="small"
                      sx={{ color: "#f6c561" }}
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "var(--text-secondary)", lineHeight: 1.75 }}
                  >
                    {comment.content}
                  </Typography>
                </Box>
              </Box>
              {index < perfume.comments.length - 1 && (
                <Divider sx={{ borderColor: "var(--divider)" }} />
              )}
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
        PaperProps={{
          sx: {
            background: "var(--bg-elevated)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 24px 60px rgba(0, 0, 0, 0.45)",
            backdropFilter: "var(--surface-blur)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "var(--text-primary)" }}>
          Edit Your Review
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3, mt: 1 }}>
            <Typography
              variant="body2"
              sx={{ color: "var(--text-secondary)", mb: 1, fontWeight: 500 }}
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
                color: "#f6c561",
                filter: "drop-shadow(0 6px 12px rgba(246, 197, 97, 0.4))",
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
                  borderColor: "rgba(224, 212, 255, 0.6)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "rgba(224, 212, 255, 0.9)",
                  boxShadow: "0 0 0 1px rgba(224, 212, 255, 0.35)",
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={handleCloseEditDialog}
            sx={{
              color: "var(--text-secondary)",
              textTransform: "none",
              borderRadius: 999,
              px: 2.5,
              "&:hover": {
                backgroundColor: "rgba(224, 212, 255, 0.12)",
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
              background:
                "linear-gradient(120deg, rgba(250, 244, 255, 0.92) 0%, rgba(227, 239, 255, 0.92) 60%, rgba(254, 248, 231, 0.92) 100%)",
              color: "#0b0d12",
              fontWeight: 600,
              textTransform: "none",
              px: 3,
              borderRadius: 999,
              boxShadow:
                "0 16px 32px rgba(193, 156, 255, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.12) inset",
              "&:hover": {
                background:
                  "linear-gradient(120deg, rgba(255, 255, 255, 0.96) 0%, rgba(233, 242, 255, 0.96) 60%, rgba(255, 241, 210, 0.96) 100%)",
                boxShadow:
                  "0 24px 40px rgba(193, 156, 255, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.18) inset",
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
        PaperProps={{
          sx: {
            background: "var(--bg-elevated)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 24px 60px rgba(0, 0, 0, 0.45)",
            backdropFilter: "var(--surface-blur)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "var(--text-primary)" }}>
          Delete Review
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ color: "var(--text-secondary)" }}>
            Are you sure you want to delete your review? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={handleCloseDeleteDialog}
            sx={{
              color: "var(--text-secondary)",
              textTransform: "none",
              borderRadius: 999,
              px: 2.5,
              "&:hover": {
                backgroundColor: "rgba(224, 212, 255, 0.12)",
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
              background:
                "linear-gradient(120deg, rgba(255, 94, 94, 0.92) 0%, rgba(255, 150, 150, 0.92) 100%)",
              color: "#0b0d12",
              fontWeight: 600,
              textTransform: "none",
              px: 3,
              borderRadius: 999,
              boxShadow: "0 18px 32px rgba(255, 99, 132, 0.35)",
              "&:hover": {
                background:
                  "linear-gradient(120deg, rgba(255, 110, 110, 0.98) 0%, rgba(255, 166, 166, 0.98) 100%)",
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
