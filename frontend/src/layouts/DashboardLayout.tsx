import type React from "react"
import { useState, useEffect } from "react"
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { styled } from "@mui/material/styles"
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  useMediaQuery,
  useTheme,
  IconButton,
  Button,
  Badge,
  Divider,
  Tooltip,
  Menu,
  MenuItem,
  Breadcrumbs,
  Collapse,
  Paper,
} from "@mui/material"
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Language as LanguageIcon,
  Email as EmailIcon,
  Send as SendIcon,
  FolderSpecial as ProjectsIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  AccountCircle,
  Logout as LogoutIcon,
  ExpandLess,
  ExpandMore,
  NavigateNext as NavigateNextIcon,
  Help as HelpIcon,
} from "@mui/icons-material"

import { useAuth } from "../contexts/AuthContext"
import { useThemeMode } from "../contexts/ThemeModeContext"

// Drawer width
const drawerWidth = 280
const collapsedDrawerWidth = 72

// Styled components
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" && prop !== "collapsed" })<{
  open?: boolean
  collapsed?: boolean
}>(({ theme, open, collapsed }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: collapsed ? collapsedDrawerWidth : 0,
  width: `calc(100% - ${collapsed ? collapsedDrawerWidth : 0}px)`,
  ...(open && {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
  }),
}))

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "collapsed",
})<{ open?: boolean; collapsed?: boolean }>(({ theme, open, collapsed }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: theme.palette.mode === "light" ? "#ffffff" : "#1e1e1e",
  color: theme.palette.text.primary,
  boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
  zIndex: theme.zIndex.drawer + 1,
  marginLeft: collapsed ? collapsedDrawerWidth : 0,
  width: `calc(100% - ${collapsed ? collapsedDrawerWidth : 0}px)`,
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
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
  justifyContent: "space-between",
}))

// Dashboard layout component
const DashboardLayout = () => {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const { themeMode, toggleThemeMode } = useThemeMode()
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"))

  // State
  const [open, setOpen] = useState(!isMobile)
  const [collapsed, setCollapsed] = useState(false)
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(null)
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<null | HTMLElement>(null)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})

  // Update drawer state when screen size changes
  useEffect(() => {
    if (isMobile) {
      setOpen(false)
      setCollapsed(false)
    } else {
      setOpen(!collapsed)
    }
  }, [isMobile, collapsed])

  // Navigation groups
  const navGroups = [
    {
      id: "main",
      label: t("main"),
      items: [
        { text: t("dashboard"), icon: <DashboardIcon />, path: "/dashboard" },
        { text: t("projects"), icon: <ProjectsIcon />, path: "/dashboard/projects" },
      ],
    },
    {
      id: "notifications",
      label: t("notifications"),
      items: [
        { text: t("ProjectNotifications"), icon: <SendIcon />, path: "/dashboard/send-notification" },
        { text: t("templates"), icon: <EmailIcon />, path: "/dashboard/templates" },
      ],
    },
    {
      id: "account",
      label: t("account"),
      items: [
        { text: t("profile"), icon: <PersonIcon />, path: "/dashboard/profile" },
        { text: t("settings"), icon: <SettingsIcon />, path: "/dashboard/settings" },
      ],
    },
  ]

  // Handle navigation
  const handleNavigation = (path: string) => {
    navigate(path)
    if (isMobile) {
      setOpen(false)
    }
  }

  // Toggle drawer
  const toggleDrawer = () => {
    if (isMobile) {
      setOpen(!open)
    } else {
      if (open && !collapsed) {
        setCollapsed(true)
        setOpen(false)
      } else if (!open && collapsed) {
        setCollapsed(false)
        setOpen(true)
      } else {
        setOpen(!open)
      }
    }
  }

  // Toggle group expansion
  const toggleGroupExpansion = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }))
  }

  // Handle user menu
  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchorEl(event.currentTarget)
  }

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null)
  }

  // Handle notifications
  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget)
  }

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null)
  }

  // Generate breadcrumbs
  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split("/").filter((x) => x)

    // Don't show breadcrumbs on the main dashboard page
    if (pathnames.length <= 1) return null

    return (
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 3, mt: 1 }}>
        <Link
          to="/dashboard"
          style={{
            textDecoration: "none",
            color: theme.palette.text.secondary,
            display: "flex",
            alignItems: "center",
          }}
        >
          <DashboardIcon sx={{ mr: 0.5, fontSize: 18 }} />
          {t("dashboard")}
        </Link>

        {pathnames.slice(1).map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 2).join("/")}`
          const isLast = index === pathnames.slice(1).length - 1

          // Find the matching nav item to get the proper label
          let label = name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, " ")

          for (const group of navGroups) {
            for (const item of group.items) {
              if (item.path === routeTo) {
                label = item.text
                break
              }
            }
          }

          return isLast ? (
            <Typography key={name} color="text.primary" sx={{ display: "flex", alignItems: "center" }}>
              {label}
            </Typography>
          ) : (
            <Link
              key={name}
              to={routeTo}
              style={{
                textDecoration: "none",
                color: theme.palette.text.secondary,
                display: "flex",
                alignItems: "center",
              }}
            >
              {label}
            </Link>
          )
        })}
      </Breadcrumbs>
    )
  }

  // Check if a route is active
  const isRouteActive = (path: string) => {
    if (path === "/dashboard" && location.pathname === "/dashboard") {
      return true
    }
    return location.pathname.startsWith(path) && path !== "/dashboard"
  }

  return (
    <Box sx={{ display: "flex" }}>
      {/* App Bar */}
      <AppBarStyled position="fixed" open={open} collapsed={!open && collapsed}>
        <Toolbar>
          <IconButton color="inherit" aria-label="toggle drawer" onClick={toggleDrawer} edge="start" sx={{ mr: 2 }}>
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ display: { xs: "none", sm: "block" } }}>
            {t("appName")}
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          {/* Theme toggle */}
          <Tooltip title={t("toggleTheme")}>
            <IconButton onClick={toggleThemeMode} sx={{ ml: 1 }}>
              {themeMode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          {/* Language */}
          <Tooltip title={t("changeLanguage")}>
            <IconButton sx={{ ml: 1 }}>
              <LanguageIcon />
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title={t("notifications")}>
            <IconButton
              sx={{ ml: 1 }}
              onClick={handleNotificationsOpen}
              aria-controls={Boolean(notificationsAnchorEl) ? "notifications-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={Boolean(notificationsAnchorEl) ? "true" : undefined}
            >
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* User menu */}
          <Tooltip title={t("account")}>
            <IconButton
              onClick={handleUserMenuOpen}
              sx={{ ml: 1 }}
              aria-controls={Boolean(userMenuAnchorEl) ? "user-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={Boolean(userMenuAnchorEl) ? "true" : undefined}
            >
              <Avatar alt={user?.firstName || "User"} src={user?.avatar || undefined} sx={{ width: 32, height: 32 }} />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBarStyled>

      {/* Notifications Menu */}
      <Menu
        id="notifications-menu"
        anchorEl={notificationsAnchorEl}
        open={Boolean(notificationsAnchorEl)}
        onClose={handleNotificationsClose}
        PaperProps={{
          elevation: 3,
          sx: { width: 320, maxHeight: 400, mt: 1.5 },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="h6" component="div">
            {t("notifications")}
          </Typography>
        </Box>
        <MenuItem onClick={handleNotificationsClose}>
          <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <Typography variant="subtitle2">New project created</Typography>
            <Typography variant="body2" color="text.secondary">
              Project "Marketing Campaign" was created successfully
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              2 minutes ago
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={handleNotificationsClose}>
          <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <Typography variant="subtitle2">Template updated</Typography>
            <Typography variant="body2" color="text.secondary">
              "Welcome Email" template was updated
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              1 hour ago
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={handleNotificationsClose}>
          <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <Typography variant="subtitle2">Notification sent</Typography>
            <Typography variant="body2" color="text.secondary">
              Bulk notification to 250 recipients completed
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              Yesterday
            </Typography>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => navigate("/dashboard/notifications")}>
          <Typography sx={{ width: "100%", textAlign: "center", color: "primary.main" }}>{t("viewAll")}</Typography>
        </MenuItem>
      </Menu>

      {/* User Menu */}
      <Menu
        id="user-menu"
        anchorEl={userMenuAnchorEl}
        open={Boolean(userMenuAnchorEl)}
        onClose={handleUserMenuClose}
        PaperProps={{
          elevation: 3,
          sx: { width: 250, mt: 1.5 },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar alt={user?.firstName || "User"} src={user?.avatar || undefined} sx={{ width: 40, height: 40 }} />
          <Box>
            <Typography variant="subtitle1">
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
        </Box>
        <Divider />
        <MenuItem
          onClick={() => {
            handleUserMenuClose()
            navigate("/dashboard/profile")
          }}
        >
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("profile")}</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleUserMenuClose()
            navigate("/dashboard/settings")
          }}
        >
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("settings")}</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleUserMenuClose()
            navigate("/help")
          }}
        >
          <ListItemIcon>
            <HelpIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("help")}</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            handleUserMenuClose()
            logout()
          }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("logout")}</ListItemText>
        </MenuItem>
      </Menu>

      {/* Sidebar */}
      <Drawer
        sx={{
          width: open ? drawerWidth : collapsed ? collapsedDrawerWidth : 0,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? drawerWidth : collapsed ? collapsedDrawerWidth : 0,
            boxSizing: "border-box",
            bgcolor: theme.palette.mode === "light" ? "#1e293b" : "#121212",
            color: "white",
            borderRight: "none",
            overflowX: "hidden",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
        variant={isMobile ? "temporary" : "permanent"}
        anchor="left"
        open={open || collapsed}
        onClose={toggleDrawer}
      >
        {/* Logo */}
        <DrawerHeader>
          <Box
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
              justifyContent: open ? "flex-start" : "center",
              width: "100%",
            }}
          >
            <NotificationsIcon sx={{ fontSize: 28 }} />
            {open && (
              <Typography variant="h6" noWrap component="div">
                {t("appName")}
              </Typography>
            )}
          </Box>
          {!isMobile && open && (
            <IconButton onClick={toggleDrawer} sx={{ color: "white" }}>
              <ChevronLeftIcon />
            </IconButton>
          )}
        </DrawerHeader>

        <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />

        {/* Navigation groups */}
        <Box sx={{ overflow: "auto", flexGrow: 1 }}>
          {navGroups.map((group) => (
            <Box key={group.id} sx={{ my: 1 }}>
              {open && (
                <Box
                  sx={{
                    px: 3,
                    py: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                  }}
                  onClick={() => toggleGroupExpansion(group.id)}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "rgba(255,255,255,0.5)",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {group.label}
                  </Typography>
                  {expandedGroups[group.id] ? (
                    <ExpandLess fontSize="small" sx={{ color: "rgba(255,255,255,0.5)" }} />
                  ) : (
                    <ExpandMore fontSize="small" sx={{ color: "rgba(255,255,255,0.5)" }} />
                  )}
                </Box>
              )}

              <Collapse in={open ? expandedGroups[group.id] !== false : true}>
                <List sx={{ px: open ? 2 : 1, py: 0 }}>
                  {group.items.map((item) => {
                    const isActive = isRouteActive(item.path)
                    return (
                      <ListItem key={item.text} disablePadding sx={{ mb: 0.5, display: "block" }}>
                        <Tooltip title={open ? "" : item.text} placement="right">
                          <ListItemButton
                            onClick={() => handleNavigation(item.path)}
                            sx={{
                              borderRadius: 1,
                              minHeight: 48,
                              px: open ? 2 : 2.5,
                              py: 1,
                              justifyContent: open ? "initial" : "center",
                              bgcolor: isActive ? "rgba(255, 255, 255, 0.1)" : "transparent",
                              "&:hover": {
                                bgcolor: "rgba(255, 255, 255, 0.05)",
                              },
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                minWidth: 0,
                                mr: open ? 2 : "auto",
                                justifyContent: "center",
                                color: isActive ? "primary.main" : "white",
                              }}
                            >
                              {item.icon}
                            </ListItemIcon>
                            {open && (
                              <ListItemText
                                primary={item.text}
                                primaryTypographyProps={{
                                  fontWeight: isActive ? 500 : 400,
                                  color: isActive ? "primary.main" : undefined,
                                }}
                              />
                            )}
                          </ListItemButton>
                        </Tooltip>
                      </ListItem>
                    )
                  })}
                </List>
              </Collapse>
            </Box>
          ))}
        </Box>

        {/* Logout button */}
        {open && (
          <Box sx={{ p: 2 }}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<LogoutIcon />}
              onClick={logout}
              sx={{
                color: "white",
                borderColor: "rgba(255,255,255,0.3)",
                "&:hover": {
                  borderColor: "white",
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              {t("logout")}
            </Button>
          </Box>
        )}
        {!open && collapsed && (
          <Box sx={{ p: 1, display: "flex", justifyContent: "center" }}>
            <Tooltip title={t("logout")} placement="right">
              <IconButton
                onClick={logout}
                sx={{
                  color: "white",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Drawer>

      {/* Main content */}
      <Main
        open={open}
        collapsed={!open && collapsed}
        sx={{
          flexGrow: 1,
          bgcolor: theme.palette.mode === "light" ? "#f8fafc" : "#121212",
          minHeight: "100vh",
          pt: 8,
        }}
      >
        {/* Breadcrumbs */}
        {generateBreadcrumbs()}

        {/* Page content */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            bgcolor: theme.palette.background.paper,
            boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)",
          }}
        >
          <Outlet />
        </Paper>
      </Main>
    </Box>
  )
}

export default DashboardLayout
