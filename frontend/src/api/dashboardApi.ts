// Types
interface DashboardData {
  stats: {
    revenue: string
    users: string
    orders: string
    conversion: string
  }
  recentActivities: Array<{
    id: number
    user: string
    action: string
    time: string
    avatar?: string
  }>
  tasks: Array<{
    id: number
    title: string
    completed: boolean
    priority: "high" | "medium" | "low"
  }>
  performance: {
    current: number
    previous: number
    target: number
  }
}

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock dashboard data
const mockDashboardData: DashboardData = {
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
    { id: 2, user: "Jane Smith", action: "Updated profile", time: "1 hour ago", avatar: "/static/images/avatar/2.jpg" },
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
}

// Dashboard API methods
export const dashboardApi = {
  // Get dashboard data
  getDashboardData: async (): Promise<DashboardData> => {
    // Simulate API call
    await delay(500)

    // In a real app, this would fetch dashboard data from the backend
    return mockDashboardData
  },
}
