import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { Link } from "react-router-dom";
import { useGetUserQuery } from "../features/auth/authApiSlice";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch } from "react-redux";
import { clearAuth } from "../features/auth/authSlice";
import LogoImage from "../assets/shashank.webp";

// Pages array
const pages = [
  { name: "News", link: "/news" },
  { name: "Books", link: "/books" },
  { name: "Blog", link: "/auth" },
];

const settings = ["Profile", "Logout"];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [openProfileDialog, setOpenProfileDialog] = React.useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = React.useState(false); // State for logout dialog
  const dispatch = useDispatch();

  const { data: userData, isLoading, error } = useGetUserQuery();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // Open logout confirmation dialog
  const handleLogoClick = () => {
    setOpenLogoutDialog(true);
  };

  // Confirm logout and clear authentication
  const handleLogoutConfirm = () => {
    dispatch(clearAuth());
    setOpenLogoutDialog(false);
  };

  // Close logout dialog
  const handleCloseLogoutDialog = () => {
    setOpenLogoutDialog(false);
  };

  // Open dialog on clicking "Profile"
  const handleProfileClick = () => {
    setOpenProfileDialog(true);
    handleCloseUserMenu();
  };

  // Close dialog
  const handleCloseProfileDialog = () => {
    setOpenProfileDialog(false);
  };

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Large screen logo */}
            <Avatar
              sx={{
                display: { xs: "none", md: "flex" },
                mr: 1,
                cursor: "pointer",
              }}
              src={LogoImage}
              alt="Logo"
            />
            {/* <AdbIcon
              sx={{
                display: { xs: "none", md: "flex" },
                mr: 1,
                cursor: "pointer",
              }}
            /> */}
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              SHASHANK SAJWAN
            </Typography>

            {/* Mobile menu */}
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: "block", md: "none" } }}
              >
                {pages.map((page, index) => (
                  <MenuItem key={index} onClick={handleCloseNavMenu}>
                    <Typography
                      component={Link}
                      to={page.link}
                      sx={{
                        textAlign: "center",
                        color: "inherit",
                        textDecoration: "none",
                      }}
                    >
                      {page.name}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* Large screen menu */}
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={page.name}
                  component={Link}
                  to={page.link}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page.name}
                </Button>
              ))}
            </Box>

            {/* User menu */}
            <Box sx={{ flexGrow: 0 }}>
              {isLoading ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CircularProgress
                    color="success"
                    size={40}
                    sx={{ position: "absolute" }}
                  />
                  <Avatar sx={{ width: 40, height: 40 }} />
                </Box>
              ) : error ? (
                <Typography variant="body1" color="error">
                  Error loading user
                </Typography>
              ) : userData ? (
                <>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar
                        alt={userData.data.firstName}
                        src={userData.data.avatar}
                      />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: "45px" }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    {settings.map((setting, index) => (
                      <MenuItem
                        key={index}
                        onClick={
                          setting === "Profile"
                            ? handleProfileClick
                            : setting === "Logout"
                            ? handleLogoClick // Open logout dialog
                            : handleCloseUserMenu
                        }
                      >
                        <Typography textAlign="center">{setting}</Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              ) : null}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Profile Dialog */}
      <Dialog
        open={openProfileDialog}
        onClose={handleCloseProfileDialog}
        aria-labelledby="profile-dialog-title"
      >
        <DialogTitle id="profile-dialog-title">
          Profile
          <IconButton
            aria-label="close"
            onClick={handleCloseProfileDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Avatar
              alt={userData?.data?.firstName}
              src={userData?.data?.avatar}
              sx={{ width: 80, height: 80, mb: 2 }}
            />
            <TextField
              label="First Name"
              value={userData?.data?.firstName || ""}
              margin="normal"
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Last Name"
              value={userData?.data?.lastName || ""}
              margin="normal"
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Email"
              value={userData?.data?.email || ""}
              margin="normal"
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProfileDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={openLogoutDialog}
        onClose={handleCloseLogoutDialog}
        aria-labelledby="logout-dialog-title"
      >
        <DialogTitle id="logout-dialog-title">Confirm Logout</DialogTitle>
        <DialogContent>Are you sure you want to logout?</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLogoutDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleLogoutConfirm}
            color="error"
            variant="contained"
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ResponsiveAppBar;
