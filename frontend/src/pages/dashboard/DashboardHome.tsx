import type React from "react"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import {
  Box,
  Grid,
  Paper,
  Typography,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  LinearProgress,
  Avatar,
  Card,
  CardContent,
} from "@mui/material"
import {
  AttachMoney as RevenueIcon,
  People as UsersIcon,
  ShoppingCart as OrdersIcon,
  TrendingUp as ConversionIcon,
  Email as EmailIcon,
  Sms as SmsIcon,
  Notifications as PushIcon,
  MoreVert as MoreIcon,
  Refresh as RefreshIcon,
  CalendarToday as CalendarIcon,
  FilterList as FilterIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  AccessTime as TimeIcon,
} from "@mui/icons-material"
import { useAuth } from "../../contexts/AuthContext"
import { dashboardApi } from "../../api/dashboardApi"

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
}

// Dashboard stats card component
const StatsCard = ({
  icon,
  title,
  value,
  trend,
  trendValue,
}: {
  icon: React.ReactNode
  title: string
  value: string
  trend?: "up" | "down" | "neutral"
  trendValue?: string
}) => {
  const theme = useTheme()

  return (
    <motion.div variants={itemVariants}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          borderRadius: 2,
          overflow: "hidden",
          position: "relative",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: theme.shadows[4],
          },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              borderRadius: "12px",
              background:
                theme.palette.mode === "dark"
                  ? "rgba(59, 130, 246, 0.2)"
                  : "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.2))",
            }}
          >
            {icon}
          </Box>

          {trend && (
            <Chip
              size="small"
              icon={
                trend === "up" ? (
                  <ArrowUpIcon fontSize="small" />
                ) : trend === "down" ? (
                  <ArrowDownIcon fontSize="small" />
                ) : undefined
              }
              label={trendValue || "0%"}
              color={trend === "up" ? "success" : trend === "down" ? "error" : "default"}
              sx={{
                height: "24px",
                fontWeight: "bold",
                "& .MuiChip-icon": { fontSize: "0.8rem" },
              }}
            />
          )}
        </Box>

        <Typography variant="h3" fontWeight="bold" sx={{ mb: 0.5 }}>
          {value}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </Paper>
    </motion.div>
  )
}

// Dashboard home page
const DashboardHome = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"))
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [timeRange, setTimeRange] = useState("week")
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Fetch dashboard data
  const { refetch } = useQuery({
    queryKey: ["dashboardData"],
    queryFn: dashboardApi.getDashboardData,
  })

  // Handle menu open/close
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refetch()
    setTimeout(() => setIsRefreshing(false), 800)
  }

  // Handle time range change
  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range)
    handleMenuClose()
  }

  // Mock data for charts
  const activityData = [
    { day: "Mon", value: 20 },
    { day: "Tue", value: 45 },
    { day: "Wed", value: 30 },
    { day: "Thu", value: 80 },
    { day: "Fri", value: 45 },
    { day: "Sat", value: 65 },
    { day: "Sun", value: 75 },
  ]

  // Mock recent notifications data
  const recentNotifications = [
    {
      id: 1,
      recipient: "James Smith",
      channel: "email",
      status: "sent",
      timestamp: "Today, 9:24 AM",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      recipient: "Emma Johnson",
      channel: "sms",
      status: "sent",
      timestamp: "Yesterday, 4:10 PM",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      recipient: "Michael Brown",
      channel: "push",
      status: "failed",
      timestamp: "Apr 21, 2024, 3:15 PM",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      recipient: "Olivia Wilson",
      channel: "email",
      status: "sent",
      timestamp: "Apr 20, 2024, 10:05 AM",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  // Channel icon mapping
  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "email":
        return <EmailIcon fontSize="small" />
      case "sms":
        return <SmsIcon fontSize="small" />
      case "push":
        return <PushIcon fontSize="small" />
      default:
        return null
    }
  }

  // Get user name from the user object
  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ""}` : user?.name || "John Doe"

  // Animation for bar chart
  const [animateChart, setAnimateChart] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateChart(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {isRefreshing && (
        <LinearProgress
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
          }}
        />
      )}

      {/* Header with welcome message and actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 0 },
        }}
      >
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              background:
                theme.palette.mode === "dark"
                  ? "linear-gradient(90deg, #60a5fa, #93c5fd)"
                  : "linear-gradient(90deg, #3b82f6, #60a5fa)",
              backgroundClip: "text",
              textFillColor: "transparent",
            }}
          >
            {t("welcome")}, {userName}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's what's happening with your notifications today
          </Typography>
        </motion.div>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Refresh data">
            <IconButton onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Time range">
            <IconButton onClick={handleMenuClick}>
              <CalendarIcon />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={() => handleTimeRangeChange("day")} selected={timeRange === "day"}>
              Today
            </MenuItem>
            <MenuItem onClick={() => handleTimeRangeChange("week")} selected={timeRange === "week"}>
              This Week
            </MenuItem>
            <MenuItem onClick={() => handleTimeRangeChange("month")} selected={timeRange === "month"}>
              This Month
            </MenuItem>
            <MenuItem onClick={() => handleTimeRangeChange("year")} selected={timeRange === "year"}>
              This Year
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Stats cards */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              icon={<RevenueIcon sx={{ color: "#3b82f6" }} />}
              title="Total Notifications"
              value="23,456"
              trend="up"
              trendValue="+12.5%"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              icon={<UsersIcon sx={{ color: "#10b981" }} />}
              title="Success Rate"
              value="98.7%"
              trend="up"
              trendValue="+1.2%"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              icon={<OrdersIcon sx={{ color: "#ef4444" }} />}
              title="Failed Deliveries"
              value="304"
              trend="down"
              trendValue="-5.3%"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard icon={<ConversionIcon sx={{ color: "#8b5cf6" }} />} title="Active Channels" value="3" />
          </Grid>
        </Grid>
      </motion.div>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Line chart */}
        <Grid item xs={12} md={7}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                height: "100%",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Activity
                </Typography>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <Chip
                    label="Email"
                    size="small"
                    sx={{
                      backgroundColor:
                        theme.palette.mode === "dark" ? "rgba(96, 165, 250, 0.3)" : "rgba(96, 165, 250, 0.2)",
                      color: theme.palette.mode === "dark" ? "#93c5fd" : "#3b82f6",
                      fontWeight: "medium",
                    }}
                  />
                  <IconButton size="small">
                    <FilterIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              <Box sx={{ height: 240, display: "flex", alignItems: "flex-end", gap: 2, mt: 2 }}>
                {activityData.map((item) => (
                  <Box
                    key={item.day}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    <Box
                      sx={{
                        height: animateChart ? `${item.value}%` : "0%",
                        width: "100%",
                        maxWidth: "40px",
                        backgroundColor:
                          item.day === "Thu"
                            ? theme.palette.mode === "dark"
                              ? "#60a5fa"
                              : "#3b82f6"
                            : theme.palette.mode === "dark"
                              ? "rgba(96, 165, 250, 0.6)"
                              : "rgba(59, 130, 246, 0.5)",
                        borderRadius: "6px",
                        transition: "height 1s cubic-bezier(0.4, 0, 0.2, 1)",
                        position: "relative",
                        "&:hover": {
                          backgroundColor: theme.palette.mode === "dark" ? "#60a5fa" : "#3b82f6",
                          transform: "scaleY(1.05)",
                          transformOrigin: "bottom",
                          transition: "transform 0.3s ease, background-color 0.3s ease",
                          "&::after": {
                            content: `"${item.value}"`,
                            position: "absolute",
                            top: "-25px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            backgroundColor:
                              theme.palette.mode === "dark" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.8)",
                            color: theme.palette.mode === "dark" ? "#fff" : "#fff",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "bold",
                          },
                        },
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 1,
                        color: "text.secondary",
                        fontWeight: item.day === "Thu" ? "bold" : "normal",
                      }}
                    >
                      {item.day}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        {/* Pie chart */}
        <Grid item xs={12} md={5}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                height: "100%",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Channel Distribution
                </Typography>

                <Tooltip title="View detailed analytics">
                  <IconButton size="small">
                    <MoreIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>

              <Box sx={{ height: 200, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Box sx={{ position: "relative" }}>
                  <motion.div
                    initial={{ rotate: -90 }}
                    animate={{ rotate: 0 }}
                    transition={{ delay: 0.6, duration: 1, type: "spring" }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        width: 180,
                        height: 180,
                        borderRadius: "50%",
                        background: "conic-gradient(#60a5fa 0% 60%, #2563eb 60% 85%, #34d399 85% 100%)",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          width: "60%",
                          height: "60%",
                          borderRadius: "50%",
                          backgroundColor: theme.palette.background.paper,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                        }}
                      >
                        <Typography variant="h5" fontWeight="bold" sx={{ mb: -0.5 }}>
                          23,456
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Total
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                </Box>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "center", mt: 3, gap: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#60a5fa" }}></Box>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      Email
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      14,073 (60%)
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#2563eb" }}></Box>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      SMS
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      5,864 (25%)
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#34d399" }}></Box>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      Push
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      3,519 (15%)
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>

      {/* Recent notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          }}
        >
          <Box sx={{ p: 3, pb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" fontWeight="bold">
              Recent Notifications
            </Typography>

            <Tooltip title="View all notifications">
              <IconButton size="small">
                <MoreIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          {isSmallScreen ? (
            // Mobile card view
            <Box sx={{ p: 2 }}>
              {recentNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  elevation={0}
                  sx={{
                    mb: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Avatar src={notification.avatar} />
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {notification.recipient}
                          </Typography>
                          <Chip
                            size="small"
                            label={notification.status === "sent" ? "Sent" : "Failed"}
                            color={notification.status === "sent" ? "success" : "error"}
                            sx={{ height: 24 }}
                          />
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                          {getChannelIcon(notification.channel)}
                          <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
                            {notification.channel}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1 }}>
                          <TimeIcon fontSize="small" sx={{ fontSize: "0.875rem", color: "text.secondary" }} />
                          <Typography variant="caption" color="text.secondary">
                            {notification.timestamp}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            // Desktop table view
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Recipient</TableCell>
                    <TableCell>Channel</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Timestamp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentNotifications.map((notification) => (
                    <TableRow
                      key={notification.id}
                      sx={{
                        transition: "background-color 0.2s ease",
                        "&:hover": {
                          backgroundColor:
                            theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
                        },
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Avatar src={notification.avatar} sx={{ width: 32, height: 32 }} />
                          <Typography variant="body2" fontWeight="medium">
                            {notification.recipient}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          {getChannelIcon(notification.channel)}
                          <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
                            {notification.channel}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={notification.status === "sent" ? "Sent" : "Failed"}
                          color={notification.status === "sent" ? "success" : "error"}
                          sx={{ height: 24 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <TimeIcon fontSize="small" sx={{ fontSize: "0.875rem", color: "text.secondary" }} />
                          <Typography variant="body2" color="text.secondary">
                            {notification.timestamp}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </motion.div>
    </Box>
  )
}

export default DashboardHome
