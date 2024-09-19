import React, { useEffect, useState } from "react";
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
  TextField,
  Typography,
  Autocomplete,
  CircularProgress,
  Alert,
  Avatar,
  Snackbar,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import Breadcrumb from "../../components/Breadcrumb";
import NewsCard from "../../components/NewsCard";
import { useGetNewsQuery, useAddNewsMutation } from "./newsApi"; // Import RTK Query hooks
import { useDispatch } from "react-redux";
import { setMessage } from "../../features/messageSlice"; // Import the message actions
import { ReactComponent as MyIcon } from "../../assets/500.svg";

// Autocomplete options
const months = [
  { label: "January", value: 1 },
  { label: "February", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "June", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "October", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 },
];
const years = Array.from(
  new Array(10),
  (_, index) => `${new Date().getFullYear() - index}`
);

// AddNews Dialog Component
const AddNews = ({ open, onClose }) => {
  const [addNews, { isLoading, error, isSuccess }] = useAddNewsMutation();
  const [thumbnailFile, setThumbnailFile] = useState(null); // State for the file
  const [thumbnailPreview, setThumbnailPreview] = useState(""); // State for file preview
  const [fileError, setFileError] = useState(""); // State for file error
  const dispatch = useDispatch();
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file type and size
      if (file.type === "image/png" || file.type === "image/jpeg") {
        if (file.size <= 5 * 1024 * 1024) {
          setThumbnailFile(file); // Set the file
          setThumbnailPreview(URL.createObjectURL(file)); // Create preview URL
          setFileError(""); // Clear the error when a valid file is selected
        } else {
          setFileError("File size must be less than 5MB.");
          setThumbnailFile(null);
          setThumbnailPreview(""); // Clear preview if error
        }
      } else {
        setFileError("Only PNG and JPEG files are allowed.");
        setThumbnailFile(null);
        setThumbnailPreview(""); // Clear preview if error
      }
    }
  };
  useEffect(() => {
    if (error) {
      console.log(error.data.error);
      dispatch(setMessage({ message: error.data.error, severity: "error" }));
    }
    if (isSuccess) {
      dispatch(
        setMessage({
          message: "File is successfully Added",
          severity: "success",
        })
      );
    }
  }, [isSuccess, error]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Check if the file is selected
    if (!thumbnailFile) {
      setFileError("Thumbnail image is required.");
      return;
    }

    const formData = new FormData(event.currentTarget); // Form data
    formData.append("image", thumbnailFile); // Append the file to formData

    try {
      const newData = await addNews(formData); // Send formData, which includes the file
   
      onClose(); // Close the dialog on success
      setThumbnailFile(null); // Clear the file input after submission
      setThumbnailPreview(""); // Clear the preview after submission
    } catch (err) {
      console.error("Failed to add news:", err);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ component: "form", onSubmit: handleFormSubmit }}
    >
      <DialogTitle>Add News</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Create the news by adding a thumbnail image and Drive link.
        </DialogContentText>

        {fileError && <Alert severity="warning">{fileError}</Alert>}

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

        {/* Conditionally render avatar or upload button */}
        {thumbnailPreview ? (
          <Avatar
            alt="Thumbnail Preview"
            src={thumbnailPreview} // Preview of the selected image
            sx={{ width: 200, height: 120, mt: 2 }}
            variant="rounded"
          />
        ) : (
          <Button
            component="label"
            variant="contained"
            startIcon={
              isLoading ? (
                <CircularProgress color="success" size={24} />
              ) : (
                <Add />
              )
            }
            sx={{ mt: 2, bgcolor: "black" }}
            disabled={isLoading} // Disable button while loading
          >
            Upload Thumbnail
            <input
              type="file"
              hidden
              onChange={handleFileChange} // Handle file selection
            />
          </Button>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading || !!fileError}
          variant="contained"
        >
          {isLoading ? (
            <CircularProgress color="success" size={24} />
          ) : (
            "Add News"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Main News Component
const News = () => {
  const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-based, so add 1
  const currentYear = new Date().getFullYear(); // Get current year
  const [openAddNewsDialog, setOpenAddNewsDialog] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(
    months.find((month) => month.value === currentMonth)
  );
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [page, setPage] = useState(1); // Track current page
  const limit = 12; // Define items per page
  const dispatch = useDispatch();

  // Convert selectedMonth to number if selectedMonth is an object
  const monthNumber = selectedMonth ? selectedMonth.value : null;

  // Fetch News using RTK Query with pagination and filters
  const {
    data: newsData = [],
    isLoading,
    error,
  } = useGetNewsQuery({
    page,
    limit,
    month: monthNumber,
    year: selectedYear,
  });

  useEffect(() => {
    if (error) {
      console.log(error.data.error);
      dispatch(setMessage({ message: error.data.error, severity: "error" }));
    }
  }, [error]);

  const handleOpenAddNewsDialog = () => setOpenAddNewsDialog(true);
  const handleCloseAddNewsDialog = () => setOpenAddNewsDialog(false);

  const handlePageChange = (event, value) => {
    setPage(value); // Update page when Pagination component is used
  };

  if (isLoading)
    return (
      <Stack
        sx={{
          height: "80vh", // Ensures full viewport height
          width: "100%", // Ensures full width
          justifyContent: "center", // Centers content vertically
          alignItems: "center", // Centers content horizontally
        }}
      >
        <CircularProgress size="3rem" />
      </Stack>
    );
  if (error)
    return (
      <Stack
        sx={{
          height: "80vh", // Ensures full viewport height
          width: "100%", // Ensures full width
          justifyContent: "center", // Centers content vertically
          alignItems: "center", // Centers content horizontally
        }}
      >
        <MyIcon width={340} height={340} />
        <Typography variant="h6" color="error">
          {error.data.error}
        </Typography>
      </Stack>
    );

  return (
    <Stack justifyContent="center" alignItems="center" sx={{ p: 2 }}>
      <Stack
        spacing={2}
        direction="column"
        width="100%"
        divider={<Divider orientation="horizontal" flexItem />}
      >
        <Stack direction="row" justifyContent="space-between" spacing={2}>
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
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          rowGap={4}
        >
          <Breadcrumb />
          {/* Filter by Month and Year */}
          <Stack
            direction="row"
            spacing={2}
            my={2}
            justifyContent="center"
            alignItems="center"
          >
            <Autocomplete
              options={months}
              sx={{ width: 160 }}
              getOptionLabel={(option) => option.label}
              value={selectedMonth}
              onChange={(event, newValue) => setSelectedMonth(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Filter by Month"
                  variant="outlined"
                />
              )}
            />
            <Autocomplete
              options={years}
              sx={{ width: 160 }}
              getOptionLabel={(option) => option}
              value={selectedYear}
              onChange={(event, newValue) => setSelectedYear(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Filter by Year"
                  variant="outlined"
                />
              )}
            />
          </Stack>
        </Stack>
      </Stack>

      {/* News Cards */}
      <Box minHeight="64vh" width="100%">
        <Grid container spacing={2} my={4}>
          {newsData.data.length > 0 ? (
            newsData.data.map((newsItem) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={newsItem._id}>
                <NewsCard newsItem={newsItem} />
              </Grid>
            ))
          ) : (
            <Typography>No News Available</Typography>
          )}
        </Grid>
      </Box>

      {/* Pagination */}
      <Pagination
        count={Math.ceil(newsData.totalPages)} // Total number of pages
        page={newsData.currentPage}
        onChange={handlePageChange}
        sx={{ mt: 2 }}
      />

      {/* Add News Dialog */}
      <AddNews open={openAddNewsDialog} onClose={handleCloseAddNewsDialog} />
    </Stack>
  );
};

export default News;
