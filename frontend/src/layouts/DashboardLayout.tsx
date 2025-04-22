"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Outlet, useNavigate, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { styled } from "@mui/material/styles"
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  useMediaQuery,
  useTheme,
  Tooltip,
  Button,
  Container,
} from "@mui/material"
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Notifications as NotificationsIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material"

import { useAuth } from "../contexts/AuthContext"
import { useThemeMode } from "../contexts/ThemeModeContext"
import NotificationsDrawer from "../components/dashboard/NotificationsDrawer"
import LanguageSwitcher from "../components/common/LanguageSwitcher"
import ThemeToggle from "../components/common/ThemeToggle"

// Drawer width
const drawerWidth = 240

// Styled components
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean
  isMobile?: boolean
}>(({ theme, open, isMobile }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: isMobile ? 0 : `-${drawerWidth}px`,
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}))

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open?: boolean; isMobile?: boolean }>(({ theme, open, isMobile }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open &&
    !isMobile && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
}))

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}))

// Dashboard layout component
const DashboardLayout = () => {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const { themeMode } = useThemeMode()
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"))

  // State
  const [open, setOpen] = useState(!isMobile)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)

  // Update drawer state when screen size changes
  useEffect(() => {
    setOpen(!isMobile)
  }, [isMobile])

  // Handle drawer open/close
  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  // Handle notifications drawer
  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen)
  }

  // Handle user menu
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  // Navigation items
  const navItems = [
    { text: t("dashboard"), icon: <DashboardIcon />, path: "/dashboard" },
    { text: t("profile"), icon: <PersonIcon />, path: "/dashboard/profile" },
    { text: t("settings"), icon: <SettingsIcon />, path: "/dashboard/settings" },
  ]

  // Handle navigation
  const handleNavigation = (path: string) => {
    navigate(path)
    if (isMobile) {
      setOpen(false)
    }
  }

  return (
    <Box sx={{ display: "flex" }}>
      {/* App Bar */}
      <AppBarStyled position="fixed" open={open} isMobile={isMobile}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {t("appName")}
          </Typography>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Language selector - hide on very small screens */}
          {!isSmall && <LanguageSwitcher />}

          {/* Notifications */}
          <Tooltip title={t("notifications")}>
            <IconButton color="inherit" onClick={toggleNotifications}>
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* User menu */}
          <Box sx={{ ml: 2 }}>
            <Tooltip title={t("openSettings")}>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt={user?.firstName || user?.email}
                  src={user?.avatar || "/static/images/avatar/default.jpg"}
                />
              </IconButton>
            </Tooltip>
            <Menu anchorEl={anchorElUser} open={Boolean(anchorElUser)} onClose={handleCloseUserMenu}>
              <MenuItem
                onClick={() => {
                  handleCloseUserMenu()
                  navigate("/dashboard/profile")
                }}
              >
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <Typography textAlign="center">{t("profile")}</Typography>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleCloseUserMenu()
                  navigate("/dashboard/settings")
                }}
              >
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <Typography textAlign="center">{t("settings")}</Typography>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={() => {
                  handleCloseUserMenu()
                  logout()
                }}
              >
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <Typography textAlign="center">{t("logout")}</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBarStyled>

      {/* Sidebar */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant={isMobile ? "temporary" : "persistent"}
        anchor="left"
        open={open}
        onClose={handleDrawerClose}
      >
        <DrawerHeader>
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
            {t("appName")}
          </Typography>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />

        {/* Navigation list */}
        <List>
          {navItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton selected={location.pathname === item.path} onClick={() => handleNavigation(item.path)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider />

        {/* User info */}
        <Box sx={{ p: 2, mt: "auto" }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Avatar
              sx={{ width: 32, height: 32, mr: 1 }}
              alt={user?.firstName || user?.email}
              src={user?.avatar || "/static/images/avatar/default.jpg"}
            />
            <Typography variant="body2" noWrap>
              {user?.firstName ? `${user.firstName} ${user.lastName || ""}` : user?.email}
            </Typography>
          </Box>
          <Button variant="outlined" startIcon={<LogoutIcon />} onClick={logout} fullWidth size="small">
            {t("logout")}
          </Button>
        </Box>
      </Drawer>

      {/* Notifications drawer */}
      <NotificationsDrawer open={notificationsOpen} onClose={() => setNotificationsOpen(false)} />

      {/* Main content */}
      <Main open={open} isMobile={isMobile}>
        <DrawerHeader />
        <Container maxWidth="xl" disableGutters>
          <Outlet />
        </Container>
      </Main>
    </Box>
  )
}

export default DashboardLayout
