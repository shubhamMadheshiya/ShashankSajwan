import * as React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
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
  styled,
  TextField,
  Avatar,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  useDeleteNewsMutation,
  useEditNewsMutation,
} from "../pages/News/newsApi"; // Import RTK hooks

// Delete Dialog Component
const DeleteDialog = ({ open, onClose, newsItem, setDeleteOpen }) => {
  const [deleteNews, { isLoading, error, isSuccess }] = useDeleteNewsMutation();
  const [successSnackbar, setSuccessSnackbar] = React.useState(false);

  const handleDelete = async () => {
    try {
      await deleteNews(newsItem._id);
    } catch (error) {
      console.error("Failed to delete news item:", error);
    } finally {
      setDeleteOpen(false);
    }
  };
  const handleSnackbarClose = () => {
    setSuccessSnackbar(false);
  };

  React.useEffect(() => {
    if (isSuccess) {
      setDeleteOpen(false);
    }
  }, [isSuccess, setDeleteOpen]);

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
        <Button onClick={handleDelete} color="error" disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} /> : "Delete"}
        </Button>
      </DialogActions>
      <Snackbar
        open={successSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message="News updated successfully!"
      />
    </Dialog>
  );
};

// Edit Dialog Component
const EditDialog = ({ open, onClose, newsItem }) => {
  const [thumbnailFile, setThumbnailFile] = React.useState(null);
  const [thumbnailPreview, setThumbnailPreview] = React.useState(
    newsItem?.imageUrl || ""
  ); // Default to current image
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [successSnackbar, setSuccessSnackbar] = React.useState(false);

  // RTK Query hook
  const [
    updateNews,
    {
      isLoading: updateIsLoading,
      error: updateIsError,
      isSuccess: updateIsSuccess,
    },
  ] = useEditNewsMutation();

  React.useEffect(() => {
    if (updateIsSuccess) {
      setSuccessSnackbar(true);
      onClose();
    }
  }, [updateIsSuccess, onClose]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget); // Form data
    formData.append("image", thumbnailFile); // Append the file to formData

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

  const handleSnackbarClose = () => {
    setSuccessSnackbar(false);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        />

        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUpload />}
          sx={{ mt: 2 }}
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
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={updateIsLoading || !!errorMessage}>
          {updateIsLoading ? <CircularProgress size={24} /> : "Update News"}
        </Button>
      </DialogActions>
      <Snackbar
        open={successSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message="News updated successfully!"
      />
    </Dialog>
  );
};

export default function NewsCard({ newsItem }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const open = Boolean(anchorEl);

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
    <Card sx={{ maxWidth: 345, minWidth: 280, position: "relative" }}>
      <CardMedia
        component="img"
        height="194"
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
        <IconButton
          size="small"
          sx={{ bgcolor: "rgba(0, 0, 0, 0.5);", m: 0.4 }}
        >
          <AttachFile sx={{ color: "#fff" }} fontSize="small" />
        </IconButton>
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ bgcolor: "rgba(0, 0, 0, 0.5);", m: 0.4 }}
        >
          <MoreVert sx={{ color: "#fff" }} fontSize="small" />
        </IconButton>
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
        // onDelete={handleDelete}
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
