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
} from "@mui/material";
import {
  useDeleteNewsMutation,
  useEditNewsMutation,
} from "../pages/News/newsApi"; // Import RTK hooks

// Alert Dialog Component
const AlertDialog = ({ open, onClose, onDelete }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{"Are you sure you want to delete this?"}</DialogTitle>
      <DialogContent>
        <DialogContentText>This action cannot be undone.</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onDelete} color="error" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Edit Dialog Component
const EditDialog = ({ open, onClose, newsItem, onUpdate }) => {
  const [formValues, setFormValues] = React.useState({
    driveLink: newsItem?.driveLink || "",
    imageUrl: newsItem?.imageUrl || "",
  });
  const [fileError, setFileError] = React.useState(""); // State for file error
  const [successSnackbar, setSuccessSnackbar] = React.useState(false); // State for Snackbar

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const handleFormSubmit = (event) => {
    event.preventDefault();
    onUpdate(formValues); // Send updated data to the parent
    setSuccessSnackbar(true); // Show success message
    onClose();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === "image/png" || file.type === "image/jpeg") {
        if (file.size <= 5 * 1024 * 1024) {
          setFormValues((prev) => ({
            ...prev,
            imageUrl: URL.createObjectURL(file),
          }));
          setFileError(""); // Clear the error when a valid file is selected
        } else {
          setFileError("File size must be less than 5MB.");
        }
      } else {
        setFileError("Only PNG and JPEG files are allowed.");
      }
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
      <DialogTitle>Edit</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You can update the news thumbnail image and Drive link.
        </DialogContentText>
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
          value={formValues.driveLink}
          onChange={handleInputChange}
        />
        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUpload />}
          sx={{ mt: 2 }}
        >
          Upload Thumbnail
          <VisuallyHiddenInput type="file" onChange={handleFileChange} />
        </Button>
        {formValues.imageUrl && (
          <Avatar
            alt="Thumbnail Preview"
            src={formValues.imageUrl}
            sx={{ width: 200, height: 120, mt: 2 }}
            variant="rounded"
          />
        )}
        {fileError && <Alert severity="warning">{fileError}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit">Save</Button>
      </DialogActions>

      {/* Success Snackbar */}
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
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const open = Boolean(anchorEl);

  // RTK Query hooks
  const [deleteNews] = useDeleteNewsMutation();
  const [updateNews] = useEditNewsMutation();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAlertOpen = () => {
    setAlertOpen(true);
    handleClose();
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleEditOpen = () => {
    setEditOpen(true);
    handleClose();
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleDelete = async () => {
    try {
      await deleteNews(newsItem._id);
    } catch (error) {
      console.error("Failed to delete news item:", error);
    } finally {
      setAlertOpen(false);
    }
  };

  const handleUpdate = async (updatedData) => {
    try {
      await updateNews({ id: newsItem._id, ...updatedData });
    } catch (error) {
      console.error("Failed to update news item:", error);
    }
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
        <MenuItem onClick={handleAlertOpen} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <Delete fontSize="small" sx={{ color: "error.main" }} />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>

      {/* Alert Dialog for Delete Confirmation */}
      <AlertDialog
        open={alertOpen}
        onClose={handleAlertClose}
        onDelete={handleDelete}
      />

      {/* Edit Dialog for Updating News */}
      <EditDialog
        open={editOpen}
        onClose={handleEditClose}
        newsItem={newsItem}
        onUpdate={handleUpdate}
      />
    </Card>
  );
}
