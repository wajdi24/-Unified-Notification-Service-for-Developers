"use client"

import type React from "react"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useQuery } from "@tanstack/react-query"
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  LinearProgress,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  AttachMoney as AttachMoneyIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material"

import { dashboardApi } from "../../api/dashboardApi"

// Dashboard stats card component
const StatsCard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string
  value: string
  icon: React.ReactNode
  color: string
}) => (
  <Card>
    <CardContent sx={{ display: "flex", alignItems: "center" }}>
      <Avatar sx={{ bgcolor: color, width: 56, height: 56, mr: 2 }}>{icon}</Avatar>
      <Box>
        <Typography variant="h5" component="div">
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </Box>
    </CardContent>
  </Card>
)

// Dashboard home page
const DashboardHome = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isXs = useMediaQuery(theme.breakpoints.down("sm"))
  const isMd = useMediaQuery(theme.breakpoints.down("md"))

  // Fetch dashboard data
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["dashboardData"],
    queryFn: dashboardApi.getDashboardData,
    // Mock data for preview
    placeholderData: {
      stats: {
        revenue: "$12,500",
        users: "1,234",
        orders: "56",
        conversion: "12%",
      },
      recentActivities: [
        {
          id: 1,
          user: "John Doe",
          action: "Created a new order",
          time: "5 min ago",
          avatar: "/static/images/avatar/1.jpg",
        },
        {
          id: 2,
          user: "Jane Smith",
          action: "Updated profile",
          time: "1 hour ago",
          avatar: "/static/images/avatar/2.jpg",
        },
        {
          id: 3,
          user: "Bob Johnson",
          action: "Completed payment",
          time: "3 hours ago",
          avatar: "/static/images/avatar/3.jpg",
        },
      ],
      tasks: [
        { id: 1, title: "Review new orders", completed: false, priority: "high" },
        { id: 2, title: "Prepare monthly report", completed: false, priority: "medium" },
        { id: 3, title: "Update inventory", completed: true, priority: "low" },
        { id: 4, title: "Contact suppliers", completed: false, priority: "medium" },
      ],
      performance: {
        current: 78,
        previous: 65,
        target: 85,
      },
    },
  })

  // Task completion toggle
  const [tasks, setTasks] = useState(dashboardData?.tasks || [])

  const toggleTaskCompletion = (taskId: number) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
  }

  if (isLoading) {
    return <LinearProgress />
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t("dashboardTitle")}
      </Typography>

      {/* Stats cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title={t("revenue")}
            value={dashboardData?.stats.revenue || "$0"}
            icon={<AttachMoneyIcon />}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title={t("users")}
            value={dashboardData?.stats.users || "0"}
            icon={<PeopleIcon />}
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title={t("orders")}
            value={dashboardData?.stats.orders || "0"}
            icon={<ShoppingCartIcon />}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title={t("conversion")}
            value={dashboardData?.stats.conversion || "0%"}
            icon={<TrendingUpIcon />}
            color="#9c27b0"
          />
        </Grid>
      </Grid>

      {/* Main content */}
      <Grid container spacing={3}>
        {/* Performance card */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: isXs ? 2 : 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              {t("performance")}
            </Typography>
            <Box sx={{ mt: 4, mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                {t("currentPerformance")}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ width: "100%", mr: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={dashboardData?.performance.current || 0}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                  <Typography variant="body2" color="text.secondary">
                    {dashboardData?.performance.current || 0}%
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ mt: 4, mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                {t("previousPeriod")}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ width: "100%", mr: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={dashboardData?.performance.previous || 0}
                    sx={{ height: 10, borderRadius: 5 }}
                    color="secondary"
                  />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                  <Typography variant="body2" color="text.secondary">
                    {dashboardData?.performance.previous || 0}%
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ mt: 4, mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                {t("target")}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ width: "100%", mr: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={dashboardData?.performance.target || 0}
                    sx={{ height: 10, borderRadius: 5 }}
                    color="info"
                  />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                  <Typography variant="body2" color="text.secondary">
                    {dashboardData?.performance.target || 0}%
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
              <Button variant="outlined">{t("viewDetails")}</Button>
            </Box>
          </Paper>
        </Grid>

        {/* Recent activities */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: isXs ? 2 : 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              {t("recentActivities")}
            </Typography>
            <List>
              {dashboardData?.recentActivities.map((activity) => (
                <ListItem key={activity.id} alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar alt={activity.user} src={activity.avatar} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={activity.user}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {activity.action}
                        </Typography>
                        {` — ${activity.time}`}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button>{t("viewAll")}</Button>
            </Box>
          </Paper>
        </Grid>

        {/* Tasks */}
        <Grid item xs={12}>
          <Paper sx={{ p: isXs ? 2 : 3 }}>
            <Typography variant="h6" gutterBottom>
              {t("tasks")}
            </Typography>
            <List>
              {tasks.map((task) => (
                <ListItem
                  key={task.id}
                  sx={{
                    flexDirection: isXs ? "column" : "row",
                    alignItems: isXs ? "flex-start" : "center",
                    gap: isXs ? 1 : 0,
                  }}
                  secondaryAction={
                    !isXs && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Chip
                          label={t(task.priority)}
                          color={
                            task.priority === "high" ? "error" : task.priority === "medium" ? "warning" : "success"
                          }
                          size="small"
                        />
                        <Button
                          variant={task.completed ? "outlined" : "contained"}
                          size="small"
                          onClick={() => toggleTaskCompletion(task.id)}
                        >
                          {task.completed ? t("completed") : t("markComplete")}
                        </Button>
                      </Box>
                    )
                  }
                >
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        style={{
                          textDecoration: task.completed ? "line-through" : "none",
                          color: task.completed ? "text.secondary" : "text.primary",
                        }}
                      >
                        {task.title}
                      </Typography>
                    }
                  />
                  {isXs && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        width: "100%",
                        justifyContent: "space-between",
                        mt: 1,
                      }}
                    >
                      <Chip
                        label={t(task.priority)}
                        color={task.priority === "high" ? "error" : task.priority === "medium" ? "warning" : "success"}
                        size="small"
                      />
                      <Button
                        variant={task.completed ? "outlined" : "contained"}
                        size="small"
                        onClick={() => toggleTaskCompletion(task.id)}
                      >
                        {task.completed ? t("completed") : t("markComplete")}
                      </Button>
                    </Box>
                  )}
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default DashboardHome
