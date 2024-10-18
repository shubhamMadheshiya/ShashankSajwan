import * as React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import { setMessage } from "../features/messageSlice";
import { format } from "date-fns";
import {
  AttachFile,
  CloudUpload,
  Delete,
  Edit,
  MoreVert,
} from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ListItemIcon,
  Menu,
  MenuItem,
  TextField,
  Avatar,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  useDeleteNewsMutation,
  useEditNewsMutation,
} from "../pages/News/newsApi"; // Import RTK hooks
import { useDispatch } from "react-redux";

// Delete Dialog Component
const DeleteDialog = ({ open, onClose, newsItem, setDeleteOpen }) => {
  const dispatch = useDispatch(); // Get the dispatch function from Redux
  const [deleteNews, { isLoading, error, isSuccess }] = useDeleteNewsMutation();

  // Handle the delete action
  const handleDelete = async () => {
    try {
      await deleteNews(newsItem._id);
    } catch (error) {
      console.error("Failed to delete news item:", error);
    } finally {
      setDeleteOpen(false);
    }
  };

  // Handle success and error using useEffect
  React.useEffect(() => {
    if (error) {
      dispatch(
        setMessage({
          message: error?.data?.error || "Failed to delete news",
          severity: "error",
        })
      );
    }

    if (isSuccess) {
      dispatch(
        setMessage({
          message: "News item deleted successfully",
          severity: "success",
        })
      );
      setDeleteOpen(false);
    }
  }, [isSuccess, error, dispatch, setDeleteOpen]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Are you sure you want to delete this news item?</DialogTitle>
      <DialogContent>
        <DialogContentText>This action cannot be undone.</DialogContentText>
        {error && (
          <Alert severity="error">Failed to delete: {error.message}</Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Edit Dialog Component
const EditDialog = ({ open, onClose, newsItem }) => {
  const [thumbnailFile, setThumbnailFile] = React.useState(null);
  const [thumbnailPreview, setThumbnailPreview] = React.useState(
    newsItem?.imageUrl || ""
  );
  const [errorMessage, setErrorMessage] = React.useState(null);
  const dispatch = useDispatch();

  // RTK Query hook
  const [
    updateNews,
    {
      isLoading: updateIsLoading,
      error: updateIsError,
      isSuccess: updateIsSuccess,
      reset: resetUpdateNews, // Use the reset function to reset mutation state
    },
  ] = useEditNewsMutation();

  // Reset fields when dialog closes or newsItem changes
  React.useEffect(() => {
    if (!open) {
      setThumbnailFile(null);
      setThumbnailPreview(newsItem?.imageUrl || "");
      setErrorMessage(null);
    }
  }, [open, newsItem]);

  // Handle success and error states
  React.useEffect(() => {
    if (updateIsError) {
      dispatch(
        setMessage({ message: updateIsError?.data?.error, severity: "error" })
      );
    }
    if (updateIsSuccess) {
      dispatch(
        setMessage({
          message: "File successfully updated",
          severity: "success",
        })
      );
      resetUpdateNews(); // Reset the mutation state after success
      onClose();
    }
  }, [updateIsSuccess, updateIsError, dispatch, onClose, resetUpdateNews]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    formData.append("image", thumbnailFile);

    try {
      await updateNews({ id: newsItem._id, formData });
      setThumbnailFile(null);
      setThumbnailPreview("");
    } catch (error) {
      console.error("Failed to update news item:", error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (
      file &&
      (file.type === "image/png" || file.type === "image/jpeg") &&
      file.size <= 5 * 1024 * 1024
    ) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
      setErrorMessage(null);
    } else {
      setErrorMessage("Only PNG and JPEG files up to 5MB are allowed");
      setThumbnailFile(null);
      setThumbnailPreview("");
    }
  };

  const handleCancel = () => {
    setThumbnailFile(null);
    setThumbnailPreview(newsItem?.imageUrl || ""); // Reset to the original image
    setErrorMessage(null);
    onClose(); // Close the dialog
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel} // Use handleCancel to reset and close
      PaperProps={{ component: "form", onSubmit: handleFormSubmit }}
    >
      <DialogTitle>Edit News Item</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          required
          margin="dense"
          id="driveLink"
          name="driveLink"
          label="Drive Link"
          type="url"
          fullWidth
          variant="outlined"
          defaultValue={newsItem?.driveLink} // Use defaultValue to avoid controlled issue
        />

        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUpload />}
          sx={{ mt: 2, bgcolor: "black" }}
        >
          Upload Thumbnail
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
        {thumbnailPreview && (
          <Avatar
            src={thumbnailPreview}
            sx={{ width: 200, height: 120, mt: 2 }}
            variant="rounded"
          />
        )}
        {errorMessage && <Alert severity="warning">{errorMessage}</Alert>}
        {updateIsError && (
          <Alert severity="error">
            Failed to update news: {updateIsError.message}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button
          type="submit"
          variant="contained"
          disabled={updateIsLoading || !!errorMessage}
        >
          {updateIsLoading ? <CircularProgress size={24} /> : "Update News"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default function NewsCard({ newsItem }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const open = Boolean(anchorEl);

  // Format the date
  const formattedDate = newsItem.customDate
    ? format(new Date(newsItem.customDate), "dd/MM/yyyy")
    : ""; // Fallback to empty string if customDate is not present

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteOpen = () => {
    setDeleteOpen(true);
    handleClose();
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  const handleEditOpen = () => {
    setEditOpen(true);
    handleClose();
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  return (
    <Card sx={{ maxWidth: 345, minWidth: 240, position: "relative" }}>
      <CardMedia
        component="img"
        height="180"
        image={newsItem.imageUrl}
        // alt={newsItem.title}
        sx={{ width: "100%" }}
      />
      <CardActions
        disableSpacing
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          position: "absolute",
          top: 0,
          right: 0,
        }}
      >
        {/* AttachFile IconButton */}
        <IconButton
          size="small"
          sx={{ bgcolor: "rgba(0, 0, 0, 0.5);", m: 0.4 }}
          onClick={() => {
            window.open(newsItem.driveLink, "_blank"); // Open driveLink in a new tab
          }}
        >
          <AttachFile sx={{ color: "#fff" }} fontSize="small" />
        </IconButton>

        {/* MoreVert IconButton for Menu */}
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ bgcolor: "rgba(0, 0, 0, 0.5);", m: 0.4 }}
        >
          <MoreVert sx={{ color: "#fff" }} fontSize="small" />
        </IconButton>
      </CardActions>
      <CardActions
        disableSpacing
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          position: "absolute",
          bottom: 0,
          left: 0,
        }}
      >
        <Button
          size="small"
          variant="contained"
          sx={{ bgcolor: "rgba(0, 0, 0, 0.5);", m: 0.4 }}
        >
          {formattedDate} {/* Use the formatted date here */}
        </Button>
      </CardActions>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleEditOpen}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteOpen} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <Delete fontSize="small" sx={{ color: "error.main" }} />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>

      {/* Alert Dialog for Delete Confirmation */}
      <DeleteDialog
        open={deleteOpen}
        onClose={handleDeleteClose}
        newsItem={newsItem}
        setDeleteOpen={setDeleteOpen}
      />

      {/* Edit Dialog for Updating News */}
      <EditDialog
        open={editOpen}
        onClose={handleEditClose}
        newsItem={newsItem}
      />
    </Card>
  );
}
