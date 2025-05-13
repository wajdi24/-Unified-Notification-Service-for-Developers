import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  Paper,
  useTheme,
  useMediaQuery,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  Link,
  Chip,
  alpha,
} from "@mui/material"
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Email as EmailIcon,
  Sms as SmsIcon,
  Notifications as PushIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
  Code as CodeIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
} from "@mui/icons-material"
import { useAuth } from "../contexts/AuthContext"
import { motion } from "framer-motion"

// Import the theme context
import { useThemeMode } from "../contexts/ThemeModeContext"

const LandingPage = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"))
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isAuthenticated } = useAuth()
  const { themeMode, toggleThemeMode } = useThemeMode()
  const isDark = themeMode === "dark"

  // Animated text for hero section
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const animatedTexts = ["Email", "SMS", "Push", "In-app", "Web"]
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const [isHeroVisible, setIsHeroVisible] = useState(false)
  const [areFeaturesVisible, setAreFeaturesVisible] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % animatedTexts.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === heroRef.current) {
            setIsHeroVisible(entry.isIntersecting)
          } else if (entry.target === featuresRef.current) {
            setAreFeaturesVisible(entry.isIntersecting)
          }
        })
      },
      { threshold: 0.1 },
    )

    if (heroRef.current) {
      observer.observe(heroRef.current)
    }

    if (featuresRef.current) {
      observer.observe(featuresRef.current)
    }

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current)
      }
      if (featuresRef.current) {
        observer.unobserve(featuresRef.current)
      }
    }
  }, [])

  // Modern gradient colors
  const gradients = {
    primary: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
    secondary: "linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)",
    accent: "linear-gradient(135deg, #10B981 0%, #3B82F6 100%)",
    dark: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
  }

  // Pricing tiers
  const pricingTiers = [
    {
      title: "Free",
      price: "$0",
      description: "Perfect for small projects and individual developers",
      features: ["100 notifications/month", "Email channel only", "Basic templates", "Community support"],
      buttonText: "Get Started",
      buttonVariant: "outlined",
      gradient: "linear-gradient(135deg, #94A3B8 0%, #CBD5E1 100%)",
    },
    {
      title: "Pro",
      price: "$29",
      description: "For growing teams and applications",
      features: [
        "10,000 notifications/month",
        "Email, SMS, and Push channels",
        "Advanced templates",
        "Priority support",
        "Analytics dashboard",
      ],
      buttonText: "Start Free Trial",
      buttonVariant: "contained",
      highlighted: true,
      gradient: gradients.primary,
    },
    {
      title: "Enterprise",
      price: "Custom",
      description: "For large-scale applications and businesses",
      features: [
        "Unlimited notifications",
        "All channels + custom integrations",
        "Advanced analytics",
        "Dedicated support",
        "SLA guarantees",
        "Custom branding",
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outlined",
      gradient: "linear-gradient(135deg, #334155 0%, #475569 100%)",
    },
  ]

  // Features list with modern icons and animations
  const features = [
    {
      icon: <EmailIcon fontSize="large" sx={{ color: "#6366F1" }} />,
      title: "Email Notifications",
      description:
        "Send beautiful, responsive emails with our powerful template system. Track opens, clicks, and more.",
      delay: 0.1,
    },
    {
      icon: <SmsIcon fontSize="large" sx={{ color: "#8B5CF6" }} />,
      title: "SMS Messaging",
      description:
        "Reach your users instantly with SMS notifications. Perfect for time-sensitive alerts and verification codes.",
      delay: 0.2,
    },
    {
      icon: <PushIcon fontSize="large" sx={{ color: "#EC4899" }} />,
      title: "Push Notifications",
      description: "Engage users with targeted push notifications across web and mobile platforms.",
      delay: 0.3,
    },
    {
      icon: <SpeedIcon fontSize="large" sx={{ color: "#10B981" }} />,
      title: "High Performance",
      description:
        "Built for scale with a distributed architecture that handles millions of notifications with low latency.",
      delay: 0.4,
    },
    {
      icon: <SecurityIcon fontSize="large" sx={{ color: "#3B82F6" }} />,
      title: "Enterprise Security",
      description: "Bank-level security with encryption at rest and in transit. GDPR and HIPAA compliant.",
      delay: 0.5,
    },
    {
      icon: <AnalyticsIcon fontSize="large" sx={{ color: "#F59E0B" }} />,
      title: "Detailed Analytics",
      description: "Gain insights with comprehensive delivery, engagement, and performance metrics.",
      delay: 0.6,
    },
  ]

  // Testimonials
  const testimonials = [
    {
      quote:
        "This notification service has transformed how we communicate with our users. The reliability and analytics are unmatched.",
      author: "Sarah Johnson",
      title: "CTO, TechStart Inc.",
      avatar: "/placeholder.svg?height=60&width=60",
      delay: 0.1,
    },
    {
      quote:
        "We reduced our notification development time by 80% and improved delivery rates. Absolutely worth every penny.",
      author: "Michael Chen",
      title: "Lead Developer, FinApp",
      avatar: "/placeholder.svg?height=60&width=60",
      delay: 0.2,
    },
    {
      quote:
        "The multi-channel approach and template system make it incredibly easy to maintain consistent messaging across all platforms.",
      author: "Emma Rodriguez",
      title: "Product Manager, HealthConnect",
      avatar: "/placeholder.svg?height=60&width=60",
      delay: 0.3,
    },
  ]

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const handleLogin = () => {
    navigate("/login")
  }

  const handleSignUp = () => {
    navigate("/register")
  }

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard")
    } else {
      navigate("/register")
    }
  }

  const handleDashboard = () => {
    navigate("/dashboard")
  }

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const textVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const scaleUp = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", overflow: "hidden" }}>
      {/* Navigation */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: "blur(8px)",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <motion.div
                initial={{ rotate: -10, scale: 0.9 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <PushIcon sx={{ mr: 1, color: "#6366F1" }} />
              </motion.div>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: "bold",
                  background: gradients.primary,
                  backgroundClip: "text",
                  textFillColor: "transparent",
                }}
              >
                NotifyHub
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 4 }}>
              <Link href="#features" color="inherit" underline="none" sx={{ fontWeight: 500 }}>
                Features
              </Link>
              <Link href="#pricing" color="inherit" underline="none" sx={{ fontWeight: 500 }}>
                Pricing
              </Link>
              <Link href="#testimonials" color="inherit" underline="none" sx={{ fontWeight: 500 }}>
                Testimonials
              </Link>
              <Link href="#developers" color="inherit" underline="none" sx={{ fontWeight: 500 }}>
                Developers
              </Link>

              <IconButton onClick={toggleThemeMode} color="inherit" sx={{ ml: 1 }}>
                {isDark ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>

              {isAuthenticated ? (
                <Button
                  variant="contained"
                  onClick={handleDashboard}
                  sx={{
                    background: gradients.primary,
                    boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.3)",
                  }}
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    onClick={handleLogin}
                    sx={{
                      ml: 2,
                      borderColor: "#6366F1",
                      color: "#6366F1",
                      "&:hover": {
                        borderColor: "#4F46E5",
                        backgroundColor: alpha("#6366F1", 0.04),
                      },
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSignUp}
                    sx={{
                      background: gradients.primary,
                      boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.3)",
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Box>

            {/* Mobile Menu Button */}
            <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center" }}>
              <IconButton onClick={toggleThemeMode} color="inherit" sx={{ mr: 1 }}>
                {isDark ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
              <IconButton edge="end" color="inherit" aria-label="menu" onClick={toggleMobileMenu}>
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        sx={{
          "& .MuiDrawer-paper": {
            width: "100%",
            maxWidth: 300,
            boxSizing: "border-box",
            bgcolor: "background.paper",
          },
        }}
      >
        <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
          <IconButton onClick={toggleMobileMenu}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>
          <ListItem button component="a" href="#features" onClick={toggleMobileMenu}>
            <ListItemText primary="Features" />
          </ListItem>
          <ListItem button component="a" href="#pricing" onClick={toggleMobileMenu}>
            <ListItemText primary="Pricing" />
          </ListItem>
          <ListItem button component="a" href="#testimonials" onClick={toggleMobileMenu}>
            <ListItemText primary="Testimonials" />
          </ListItem>
          <ListItem button component="a" href="#developers" onClick={toggleMobileMenu}>
            <ListItemText primary="Developers" />
          </ListItem>
          <Divider sx={{ my: 2 }} />

          {isAuthenticated ? (
            <ListItem>
              <Button
                variant="contained"
                onClick={handleDashboard}
                fullWidth
                sx={{
                  background: gradients.primary,
                }}
              >
                Dashboard
              </Button>
            </ListItem>
          ) : (
            <>
              <ListItem>
                <Button
                  variant="outlined"
                  onClick={handleLogin}
                  fullWidth
                  sx={{
                    borderColor: "#6366F1",
                    color: "#6366F1",
                  }}
                >
                  Login
                </Button>
              </ListItem>
              <ListItem>
                <Button
                  variant="contained"
                  onClick={handleSignUp}
                  fullWidth
                  sx={{
                    background: gradients.primary,
                  }}
                >
                  Sign Up
                </Button>
              </ListItem>
            </>
          )}
        </List>
      </Drawer>

      {/* Hero Section with Animated Elements */}
      <Box
        ref={heroRef}
        sx={{
          position: "relative",
          overflow: "hidden",
          pt: isSmall ? 8 : 12,
          pb: isSmall ? 10 : 16,
        }}
      >
        {/* Background gradient */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
            background: isDark
              ? "radial-gradient(circle at 30% 20%, rgba(99, 102, 241, 0.15), transparent 40%)"
              : "radial-gradient(circle at 30% 20%, rgba(99, 102, 241, 0.1), transparent 40%)",
          }}
        />

        {/* Animated shapes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1 }}
          style={{
            position: "absolute",
            top: "10%",
            right: "5%",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0) 70%)",
            zIndex: -1,
          }}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1, delay: 0.3 }}
          style={{
            position: "absolute",
            bottom: "10%",
            left: "5%",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, rgba(236, 72, 153, 0) 70%)",
            zIndex: -1,
          }}
        />

        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div initial="hidden" animate={isHeroVisible ? "visible" : "hidden"} variants={staggerContainer}>
                <motion.div variants={textVariant}>
                  <Typography
                    variant="h2"
                    component="h1"
                    sx={{
                      fontWeight: 800,
                      fontSize: { xs: "2.5rem", sm: "3rem", md: "3.75rem" },
                      mb: 2,
                      background: gradients.primary,
                      backgroundClip: "text",
                      textFillColor: "transparent",
                      lineHeight: 1.2,
                    }}
                  >
                    Unified Notification Service for Developers
                  </Typography>
                </motion.div>

                <motion.div variants={textVariant}>
                  <Typography
                    variant="h5"
                    sx={{
                      mb: 4,
                      fontWeight: 400,
                      lineHeight: 1.5,
                      color: "text.secondary",
                    }}
                  >
                    One API for all your notification needs.{" "}
                    <Box
                      component="span"
                      sx={{
                        position: "relative",
                        display: "inline-block",
                        minWidth: "80px",
                      }}
                    >
                      <motion.div
                        key={currentTextIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        style={{
                          position: "absolute",
                          background: gradients.secondary,
                          backgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          fontWeight: 600,
                        }}
                      >
                        {animatedTexts[currentTextIndex]}
                      </motion.div>
                    </Box>{" "}
                    notifications made simple.
                  </Typography>
                </motion.div>

                <motion.div variants={fadeIn}>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleGetStarted}
                      sx={{
                        py: 1.5,
                        px: 3,
                        fontWeight: 600,
                        background: gradients.primary,
                        boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.3)",
                        "&:hover": {
                          boxShadow: "0 15px 20px -3px rgba(99, 102, 241, 0.4)",
                        },
                      }}
                    >
                      Get Started Free
                    </Button>
                    {isAuthenticated && (
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={handleDashboard}
                        sx={{
                          py: 1.5,
                          px: 3,
                          borderColor: "#6366F1",
                          color: "#6366F1",
                          "&:hover": {
                            borderColor: "#4F46E5",
                            backgroundColor: alpha("#6366F1", 0.04),
                          },
                        }}
                      >
                        View Dashboard
                      </Button>
                    )}
                  </Box>
                </motion.div>

                <motion.div variants={fadeIn} transition={{ delay: 0.4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 4 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                      Trusted by 2,000+ companies
                    </Typography>
                    <Box sx={{ display: "flex", gap: 3 }}>
                      {/* Company logos */}
                      {[1, 2, 3].map((i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                        >
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              bgcolor: alpha(theme.palette.primary.main, 0.2),
                              borderRadius: "50%",
                            }}
                          />
                        </motion.div>
                      ))}
                    </Box>
                  </Box>
                </motion.div>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "center" }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isHeroVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box
                  sx={{
                    position: "relative",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: "-10%",
                      left: "-10%",
                      width: "120%",
                      height: "120%",
                      background: "radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0) 70%)",
                      borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
                      zIndex: -1,
                      animation: "morphing 15s ease-in-out infinite",
                    },
                    "@keyframes morphing": {
                      "0%": {
                        borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
                      },
                      "25%": {
                        borderRadius: "70% 30% 30% 70% / 70% 70% 30% 30%",
                      },
                      "50%": {
                        borderRadius: "30% 30% 70% 70% / 60% 40% 60% 40%",
                      },
                      "75%": {
                        borderRadius: "50% 50% 30% 70% / 40% 60% 40% 60%",
                      },
                      "100%": {
                        borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
                      },
                    },
                  }}
                >
                  <Box
                    component="img"
                    src="/placeholder.svg?height=400&width=500"
                    alt="Notification Dashboard"
                    sx={{
                      maxWidth: "100%",
                      height: "auto",
                      borderRadius: "12px",
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                      transform: "perspective(1000px) rotateY(-5deg) rotateX(5deg)",
                      transition: "transform 0.3s ease-in-out",
                      "&:hover": {
                        transform: "perspective(1000px) rotateY(0deg) rotateX(0deg)",
                      },
                    }}
                  />
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section with Animated Cards */}
      <Box
        id="features"
        ref={featuresRef}
        sx={{
          py: { xs: 8, md: 12 },
          position: "relative",
        }}
      >
        <Container maxWidth="lg">
          <motion.div initial="hidden" animate={areFeaturesVisible ? "visible" : "hidden"} variants={staggerContainer}>
            <Box sx={{ textAlign: "center", mb: 8 }}>
              <motion.div variants={textVariant}>
                <Typography
                  variant="h3"
                  component="h2"
                  sx={{
                    fontWeight: 800,
                    mb: 2,
                    background: gradients.primary,
                    backgroundClip: "text",
                    textFillColor: "transparent",
                  }}
                >
                  Powerful Features for Developers
                </Typography>
              </motion.div>

              <motion.div variants={textVariant}>
                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: "auto" }}>
                  Everything you need to build, send, and track notifications across all channels
                </Typography>
              </motion.div>
            </Box>

            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <motion.div variants={scaleUp} transition={{ delay: feature.delay }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 4,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: "16px",
                        transition: "all 0.3s ease-in-out",
                        border: "1px solid",
                        borderColor: "divider",
                        "&:hover": {
                          transform: "translateY(-8px)",
                          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                          borderColor: "transparent",
                        },
                      }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                      </motion.div>
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 700, mb: 1 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* How It Works Section with Animated Steps */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: isDark ? alpha(theme.palette.background.paper, 0.6) : theme.palette.background.paper,
            zIndex: -1,
          },
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <Box sx={{ textAlign: "center", mb: 8 }}>
              <motion.div variants={textVariant}>
                <Typography
                  variant="h3"
                  component="h2"
                  sx={{
                    fontWeight: 800,
                    mb: 2,
                    background: gradients.primary,
                    backgroundClip: "text",
                    textFillColor: "transparent",
                  }}
                >
                  How It Works
                </Typography>
              </motion.div>

              <motion.div variants={textVariant}>
                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: "auto" }}>
                  Get up and running in minutes with our simple integration process
                </Typography>
              </motion.div>
            </Box>

            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <List>
                  {[
                    {
                      title: "Sign up for an account",
                      description: "Create your free account in seconds",
                    },
                    {
                      title: "Configure your channels",
                      description: "Set up email, SMS, and push notification providers",
                    },
                    {
                      title: "Create templates",
                      description: "Design reusable notification templates",
                    },
                    {
                      title: "Integrate our API",
                      description: "Add a few lines of code to your application",
                    },
                    {
                      title: "Send notifications",
                      description: "Start sending notifications to your users",
                    },
                  ].map((step, index) => (
                    <motion.div key={index} variants={fadeIn} transition={{ delay: index * 0.1 }}>
                      <ListItem
                        alignItems="flex-start"
                        sx={{
                          py: 2,
                          position: "relative",
                          "&::after":
                            index < 4
                              ? {
                                  content: '""',
                                  position: "absolute",
                                  left: 18,
                                  top: 60,
                                  bottom: 0,
                                  width: 2,
                                  background: `linear-gradient(to bottom, ${alpha("#6366F1", 0.7)}, ${alpha("#6366F1", 0.1)})`,
                                  zIndex: 0,
                                }
                              : {},
                        }}
                      >
                        <ListItemIcon>
                          <Avatar
                            sx={{
                              background: gradients.primary,
                              color: "white",
                              width: 36,
                              height: 36,
                              fontSize: "1rem",
                              fontWeight: "bold",
                              boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.3)",
                            }}
                          >
                            {index + 1}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
                              {step.title}
                            </Typography>
                          }
                          secondary={step.description}
                        />
                      </ListItem>
                    </motion.div>
                  ))}
                </List>
              </Grid>
              <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "center" }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: "-5%",
                        left: "-5%",
                        width: "110%",
                        height: "110%",
                        background: "radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0) 70%)",
                        borderRadius: "30% 70% 50% 50% / 50%",
                        zIndex: -1,
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src="/placeholder.svg?height=400&width=500"
                      alt="Integration Process"
                      sx={{
                        maxWidth: "100%",
                        height: "auto",
                        borderRadius: "16px",
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                      }}
                    />
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Pricing Section with Animated Cards */}
      <Box
        id="pricing"
        sx={{
          py: { xs: 8, md: 12 },
          position: "relative",
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <Box sx={{ textAlign: "center", mb: 8 }}>
              <motion.div variants={textVariant}>
                <Typography
                  variant="h3"
                  component="h2"
                  sx={{
                    fontWeight: 800,
                    mb: 2,
                    background: gradients.primary,
                    backgroundClip: "text",
                    textFillColor: "transparent",
                  }}
                >
                  Simple, Transparent Pricing
                </Typography>
              </motion.div>

              <motion.div variants={textVariant}>
                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: "auto" }}>
                  Choose the plan that fits your needs. All plans include access to our API and dashboard.
                </Typography>
              </motion.div>
            </Box>

            <Grid container spacing={4} justifyContent="center">
              {pricingTiers.map((tier, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <motion.div variants={scaleUp} transition={{ delay: index * 0.1 }}>
                    <Card
                      elevation={0}
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: "16px",
                        position: "relative",
                        overflow: "visible",
                        border: tier.highlighted ? "none" : "1px solid",
                        borderColor: "divider",
                        transition: "transform 0.3s ease-in-out",
                        "&:hover": {
                          transform: "translateY(-8px)",
                          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        },
                        ...(tier.highlighted && {
                          background: isDark
                            ? "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)"
                            : "linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)",
                          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        }),
                      }}
                    >
                      {tier.highlighted && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: -12,
                            left: 0,
                            right: 0,
                            textAlign: "center",
                          }}
                        >
                          <Chip
                            label="Most Popular"
                            sx={{
                              fontWeight: 600,
                              px: 1,
                              background: gradients.primary,
                              color: "white",
                            }}
                          />
                        </Box>
                      )}
                      <CardContent sx={{ flexGrow: 1, p: 4 }}>
                        <Typography variant="h5" component="h3" sx={{ fontWeight: 700, mb: 1 }}>
                          {tier.title}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "baseline", mb: 2 }}>
                          <Typography
                            variant="h3"
                            component="span"
                            sx={{
                              fontWeight: 800,
                              background: tier.gradient,
                              backgroundClip: "text",
                              textFillColor: "transparent",
                            }}
                          >
                            {tier.price}
                          </Typography>
                          {tier.price !== "Custom" && (
                            <Typography variant="subtitle1" component="span" sx={{ ml: 1 }}>
                              /month
                            </Typography>
                          )}
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          {tier.description}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <List sx={{ mb: 2 }}>
                          {tier.features.map((feature, featureIndex) => (
                            <ListItem key={featureIndex} disableGutters sx={{ py: 1 }}>
                              <ListItemIcon sx={{ minWidth: 36 }}>
                                <CheckCircleIcon
                                  fontSize="small"
                                  sx={{
                                    color: tier.highlighted ? "#6366F1" : "primary.main",
                                  }}
                                />
                              </ListItemIcon>
                              <ListItemText primary={feature} />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                      <CardActions sx={{ p: 4, pt: 0 }}>
                        <Button
                          fullWidth
                          variant={tier.buttonVariant as "text" | "outlined" | "contained"}
                          size="large"
                          onClick={handleGetStarted}
                          sx={
                            tier.buttonVariant === "contained"
                              ? {
                                  background: gradients.primary,
                                  boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.3)",
                                  "&:hover": {
                                    boxShadow: "0 15px 20px -3px rgba(99, 102, 241, 0.4)",
                                  },
                                }
                              : {
                                  borderColor: "#6366F1",
                                  color: "#6366F1",
                                  "&:hover": {
                                    borderColor: "#4F46E5",
                                    backgroundColor: alpha("#6366F1", 0.04),
                                  },
                                }
                          }
                        >
                          {tier.buttonText}
                        </Button>
                      </CardActions>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Testimonials Section with Animated Cards */}
      <Box
        id="testimonials"
        sx={{
          py: { xs: 8, md: 12 },
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: isDark ? alpha(theme.palette.background.paper, 0.6) : theme.palette.background.paper,
            zIndex: -1,
          },
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <Box sx={{ textAlign: "center", mb: 8 }}>
              <motion.div variants={textVariant}>
                <Typography
                  variant="h3"
                  component="h2"
                  sx={{
                    fontWeight: 800,
                    mb: 2,
                    background: gradients.primary,
                    backgroundClip: "text",
                    textFillColor: "transparent",
                  }}
                >
                  What Our Customers Say
                </Typography>
              </motion.div>

              <motion.div variants={textVariant}>
                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: "auto" }}>
                  Join thousands of satisfied developers who trust our notification service
                </Typography>
              </motion.div>
            </Box>

            <Grid container spacing={4}>
              {testimonials.map((testimonial, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <motion.div variants={fadeIn} transition={{ delay: testimonial.delay }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 4,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: "16px",
                        border: "1px solid",
                        borderColor: "divider",
                        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                        "&:hover": {
                          transform: "translateY(-8px)",
                          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                          borderColor: "transparent",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          mb: 3,
                          display: "flex",
                          justifyContent: "flex-start",
                          color: alpha("#6366F1", 0.7),
                        }}
                      >
                        <Typography variant="h4" component="span" sx={{ fontWeight: 800 }}>
                          "
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          mb: 3,
                          fontStyle: "italic",
                          lineHeight: 1.6,
                        }}
                      >
                        {testimonial.quote}
                      </Typography>
                      <Box sx={{ mt: "auto", display: "flex", alignItems: "center" }}>
                        <Avatar
                          src={testimonial.avatar}
                          sx={{
                            mr: 2,
                            border: "2px solid",
                            borderColor: alpha("#6366F1", 0.3),
                          }}
                        />
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {testimonial.author}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {testimonial.title}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Developers Section with Animated Code */}
      <Box
        id="developers"
        sx={{
          py: { xs: 8, md: 12 },
          position: "relative",
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <motion.div variants={textVariant}>
                  <Typography
                    variant="h3"
                    component="h2"
                    sx={{
                      fontWeight: 800,
                      mb: 2,
                      background: gradients.primary,
                      backgroundClip: "text",
                      textFillColor: "transparent",
                    }}
                  >
                    Built for Developers, by Developers
                  </Typography>
                </motion.div>

                <motion.div variants={fadeIn}>
                  <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                    Our API is designed to be simple, intuitive, and powerful. Get started with just a few lines of
                    code.
                  </Typography>
                </motion.div>

                <motion.div variants={scaleUp} transition={{ delay: 0.2 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: "12px",
                      bgcolor: isDark ? "#1E293B" : "#1A1A1A",
                      color: "white",
                      fontFamily: "monospace",
                      mb: 3,
                      overflow: "auto",
                      position: "relative",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: "10px",
                        left: "15px",
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        backgroundColor: "#FF5F56",
                        boxShadow: "20px 0 0 #FFBD2E, 40px 0 0 #27C93F",
                        zIndex: 1,
                      },
                    }}
                  >
                    <Box sx={{ mt: 2 }}>
                      <pre style={{ margin: 0, overflow: "auto" }}>
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: 0.4, duration: 0.8 }}
                          viewport={{ once: true }}
                        >
                          {`// Send a notification with just a few lines of code
const notifyHub = require('notifyhub');

notifyHub.send({
  channel: 'email',
  to: 'user@example.com',
  template: 'welcome',
  data: {
    name: 'John Doe',
    activationLink: 'https://example.com/activate'
  }
});`}
                        </motion.div>
                      </pre>
                    </Box>
                  </Paper>
                </motion.div>

                <motion.div variants={fadeIn} transition={{ delay: 0.3 }}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<CodeIcon />}
                      onClick={handleGetStarted}
                      sx={{
                        background: gradients.primary,
                        boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.3)",
                      }}
                    >
                      View Documentation
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleGetStarted}
                      sx={{
                        borderColor: "#6366F1",
                        color: "#6366F1",
                      }}
                    >
                      Get API Key
                    </Button>
                  </Box>
                </motion.div>
              </Grid>

              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: "-5%",
                        right: "-5%",
                        width: "110%",
                        height: "110%",
                        background: "radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, rgba(236, 72, 153, 0) 70%)",
                        borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
                        zIndex: -1,
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src="/placeholder.svg?height=400&width=500"
                      alt="Developer API"
                      sx={{
                        maxWidth: "100%",
                        height: "auto",
                        borderRadius: "16px",
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        transform: "perspective(1000px) rotateY(5deg) rotateX(5deg)",
                        transition: "transform 0.3s ease-in-out",
                        "&:hover": {
                          transform: "perspective(1000px) rotateY(0deg) rotateX(0deg)",
                        },
                      }}
                    />
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* CTA Section with Animated Background */}
      <Box
        sx={{
          position: "relative",
          color: "white",
          py: { xs: 8, md: 12 },
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        {/* Animated background */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: gradients.primary,
            zIndex: -2,
          }}
        />

        {/* Animated shapes */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          style={{
            position: "absolute",
            top: "20%",
            left: "10%",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 70%)",
            zIndex: -1,
          }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          style={{
            position: "absolute",
            bottom: "10%",
            right: "10%",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 70%)",
            zIndex: -1,
          }}
        />

        <Container maxWidth="md">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.div variants={textVariant}>
              <Typography variant="h3" component="h2" sx={{ fontWeight: 800, mb: 3 }}>
                Ready to Simplify Your Notifications?
              </Typography>
            </motion.div>

            <motion.div variants={textVariant}>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, fontWeight: 400 }}>
                Join thousands of developers who trust NotifyHub for their notification needs.
              </Typography>
            </motion.div>

            <motion.div variants={scaleUp} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                onClick={handleGetStarted}
                sx={{
                  bgcolor: "white",
                  color: "#6366F1",
                  py: 1.5,
                  px: 4,
                  fontWeight: 600,
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.9)",
                    boxShadow: "0 15px 20px -3px rgba(0, 0, 0, 0.3)",
                  },
                }}
              >
                Get Started for Free
              </Button>
            </motion.div>
          </motion.div>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: "background.paper", py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <PushIcon sx={{ mr: 1, color: "#6366F1" }} />
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    fontWeight: "bold",
                    background: gradients.primary,
                    backgroundClip: "text",
                    textFillColor: "transparent",
                  }}
                >
                  NotifyHub
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                The unified notification service for developers. Email, SMS, and push notifications made simple.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                © {new Date().getFullYear()} NotifyHub. All rights reserved.
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Product
              </Typography>
              <List disablePadding>
                {["Features", "Pricing", "Documentation", "API Reference"].map((item) => (
                  <ListItem key={item} disablePadding sx={{ py: 0.5 }}>
                    <Link href="#" color="text.secondary" underline="hover">
                      {item}
                    </Link>
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Company
              </Typography>
              <List disablePadding>
                {["About", "Blog", "Careers", "Contact"].map((item) => (
                  <ListItem key={item} disablePadding sx={{ py: 0.5 }}>
                    <Link href="#" color="text.secondary" underline="hover">
                      {item}
                    </Link>
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Resources
              </Typography>
              <List disablePadding>
                {["Guides", "Examples", "Status", "Support"].map((item) => (
                  <ListItem key={item} disablePadding sx={{ py: 0.5 }}>
                    <Link href="#" color="text.secondary" underline="hover">
                      {item}
                    </Link>
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Legal
              </Typography>
              <List disablePadding>
                {["Privacy", "Terms", "Security", "Compliance"].map((item) => (
                  <ListItem key={item} disablePadding sx={{ py: 0.5 }}>
                    <Link href="#" color="text.secondary" underline="hover">
                      {item}
                    </Link>
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}

export default LandingPage
