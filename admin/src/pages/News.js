import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Pagination,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { Add, CloudUpload } from "@mui/icons-material";
import Breadcrumb from "../components/Breadcrumb";
import NewsCard from "../components/NewsCard";

// AddNews Dialog Component
const AddNews = ({ open, onClose }) => {
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
      <DialogTitle>Add News</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Create the news by adding thumbnail image and Drive link.
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
        <Button type="submit">Add News</Button>
      </DialogActions>
    </Dialog>
  );
};

const News = () => {
  const array = [1, 2, 3, 4, 5, 6, 7, 8];
  const [openAddNewsDialog, setOpenAddNewsDialog] = useState(false);

  const handleOpenAddNewsDialog = () => {
    setOpenAddNewsDialog(true);
  };

  const handleCloseAddNewsDialog = () => {
    setOpenAddNewsDialog(false);
  };

  return (
    <Stack justifyContent="center" alignItems="center" sx={{ p: 2 }}>
      <Stack
        spacing={2}
        direction="column"
        width="100%"
        divider={<Divider orientation="horizontal" flexItem />}
      >
        {/* Header with Title and Add News button */}
        <Stack
          direction="row"
          justifyContent="space-between"
          //   alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
        >
          <Typography variant="h4" component="h1">
            News
          </Typography>
          <Button
            startIcon={<Add />}
            variant="contained"
            sx={{ bgcolor: "black" }}
            aria-label="Add News"
            onClick={handleOpenAddNewsDialog}
          >
            Add News
          </Button>
        </Stack>

        {/* Breadcrumb navigation */}
        <Breadcrumb />
      </Stack>

      {/* NewsCard List */}
      {/* <Stack direction="row" flexWrap="wrap" my={8}>
        <NewsCard />
      </Stack> */}
      <Box minHeight="64vh">
        <Grid container spacing={2} my={4}>
          {array.map((e) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
              <NewsCard />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Pagination mt="auto" count={10} color="primary" />

      {/* AddNews Dialog */}
      <AddNews open={openAddNewsDialog} onClose={handleCloseAddNewsDialog} />
    </Stack>
  );
};

export default News;
