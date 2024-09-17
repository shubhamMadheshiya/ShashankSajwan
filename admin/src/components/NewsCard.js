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
} from "@mui/material";

// Alert Dialog Component
const AlertDialog = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Are you sure you want to delete this?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onClose} color="error" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Edit Dialog Component
const EditDialog = ({ open, onClose }) => {
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
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const driveLink = formJson.driveLink;
    console.log("Drive Link:", driveLink);
    // Close dialog after submission
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: "form",
        onSubmit: handleFormSubmit,
      }}
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
        />
        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUpload />}
          sx={{ mt: 2 }}
        >
          Upload Thumbnail
          <VisuallyHiddenInput
            type="file"
            onChange={(event) => console.log(event.target.files)}
            multiple
          />
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default function RecipeReviewCard() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const open = Boolean(anchorEl);

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

  return (
    <Card sx={{ maxWidth: 345, position: "relative" }}>
      <CardMedia
        component="img"
        height="194"
        image="https://news.ubc.ca/wp-content/uploads/2023/08/AdobeStock_559145847.jpeg"
        alt="Paella dish"
      />
      <CardActions
        disableSpacing
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          position: "absolute",
          zIndex: 2,
          top: 0,
          right: 0,
          left: 0,
        }}
      >
        <IconButton
          aria-label="add to favorites"
          size="small"
          sx={{ bgcolor: "rgba(0, 0, 0, 0.5);", m: 0.4 }}
        >
          <AttachFile sx={{ color: "#fff" }} fontSize="small" />
        </IconButton>
        <IconButton
          aria-label="more options"
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
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
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

      {/* Alert Dialog */}
      <AlertDialog open={alertOpen} onClose={handleAlertClose} />

      {/* Edit Dialog */}
      <EditDialog open={editOpen} onClose={handleEditClose} />
    </Card>
  );
}
