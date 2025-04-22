"use client"

import type React from "react"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Badge,
  Tabs,
  Tab,
  Button,
} from "@mui/material"
import {
  Close as CloseIcon,
  Notifications as NotificationsIcon,
  Email as EmailIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from "@mui/icons-material"

// Notification types
type NotificationType = "all" | "messages" | "alerts" | "system"

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    type: "messages",
    title: "New Message",
    message: "You have received a new message from John Doe",
    time: "5 min ago",
    read: false,
    avatar: "/static/images/avatar/1.jpg",
    icon: <EmailIcon />,
  },
  {
    id: 2,
    type: "alerts",
    title: "System Alert",
    message: "Your storage is almost full. Please free up some space.",
    time: "1 hour ago",
    read: false,
    icon: <WarningIcon />,
  },
  {
    id: 3,
    type: "system",
    title: "Update Available",
    message: "A new system update is available. Please update your system.",
    time: "3 hours ago",
    read: true,
    icon: <InfoIcon />,
  },
  {
    id: 4,
    type: "messages",
    title: "New Message",
    message: "You have received a new message from Jane Smith",
    time: "1 day ago",
    read: true,
    avatar: "/static/images/avatar/2.jpg",
    icon: <EmailIcon />,
  },
]

interface NotificationsDrawerProps {
  open: boolean
  onClose: () => void
}

const NotificationsDrawer = ({ open, onClose }: NotificationsDrawerProps) => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<NotificationType>("all")
  const [notifications, setNotifications] = useState(mockNotifications)

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: NotificationType) => {
    setActiveTab(newValue)
  }

  // Filter notifications based on active tab
  const filteredNotifications =
    activeTab === "all" ? notifications : notifications.filter((notification) => notification.type === activeTab)

  // Count unread notifications
  const unreadCount = notifications.filter((notification) => !notification.read).length

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    )
  }

  // Mark notification as read
  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "100%", sm: 400 },
          boxSizing: "border-box",
        },
      }}
    >
      <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="h6" component="div">
          {t("notifications")}
          {unreadCount > 0 && <Badge badgeContent={unreadCount} color="error" sx={{ ml: 1 }} />}
        </Typography>
        <Box>
          <Button size="small" onClick={markAllAsRead} disabled={unreadCount === 0} sx={{ mr: 1 }}>
            {t("markAllAsRead")}
          </Button>
          <IconButton edge="end" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      <Divider />

      <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth" aria-label="notification tabs">
        <Tab label={t("all")} value="all" />
        <Tab label={t("messages")} value="messages" />
        <Tab label={t("alerts")} value="alerts" />
        <Tab label={t("system")} value="system" />
      </Tabs>

      <List sx={{ overflow: "auto", flexGrow: 1 }}>
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <Box key={notification.id}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  bgcolor: notification.read ? "transparent" : "action.hover",
                  cursor: "pointer",
                }}
                onClick={() => markAsRead(notification.id)}
              >
                <ListItemAvatar>
                  <Avatar src={notification.avatar}>{notification.icon}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      variant="subtitle2"
                      color="text.primary"
                      fontWeight={notification.read ? "normal" : "bold"}
                    >
                      {notification.title}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.primary" component="span">
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" component="div" sx={{ mt: 0.5 }}>
                        {notification.time}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </Box>
          ))
        ) : (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <NotificationsIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              {t("noNotifications")}
            </Typography>
          </Box>
        )}
      </List>
    </Drawer>
  )
}

export default NotificationsDrawer
