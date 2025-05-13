import { useState, useEffect } from "react"
import { Link as RouterLink, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  Avatar,
  IconButton,
  InputAdornment,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Divider,
  Fade,
} from "@mui/material"
import {
  LockOutlined as LockOutlinedIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Google as GoogleIcon,
  GitHub as GitHubIcon,
  Apple as AppleIcon,
} from "@mui/icons-material"
import { motion } from "framer-motion"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { authApi } from "../../api/authApi"

import LanguageSwitcher from "../../components/common/LanguageSwitcher"
import ThemeToggle from "../../components/common/ThemeToggle"

// Schema
const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  name: z.string().min(3, { message: "Name should be at least 3 characters" }),
  password: z.string().min(6, { message: "Password should be at least 6 characters" }),
  phone: z.string().min(10, { message: "Phone number should be at least 10 digits" }),
})

type RegisterFormData = z.infer<typeof registerSchema>

const RegisterPage = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const navigate = useNavigate()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Add decorative background elements
    const createBubble = () => {
      const section = document.querySelector(".bubble-background") as HTMLElement
      if (!section) return

      const bubble = document.createElement("span")
      const size = Math.random() * 60 + 20
      bubble.style.width = `${size}px`
      bubble.style.height = `${size}px`
      bubble.style.left = `${Math.random() * 100}%`
      bubble.style.top = `${Math.random() * 100}%`
      bubble.style.animationDuration = `${Math.random() * 10 + 5}s`
      bubble.style.animationDelay = `${Math.random() * 5}s`

      section.appendChild(bubble)

      setTimeout(() => {
        bubble.remove()
      }, 15000)
    }

    const interval = setInterval(createBubble, 1000)
    return () => clearInterval(interval)
  }, [])

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      phone: "",
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true)

      await authApi.register(data)

      toast.success("Registration successful! Please check your email to verify your account.", {
        position: "top-right",
        autoClose: 5000,
      })

      // Redirect to login after successful registration
      setTimeout(() => {
        navigate("/login")
      }, 3000)
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message, {
          position: "top-right",
          autoClose: 5000,
        })
      } else {
        toast.error("Registration failed. Please try again.", {
          position: "top-right",
          autoClose: 5000,
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Social signup handlers
  const handleSocialSignup = (provider: string) => {
    toast.info(`${provider} signup coming soon!`, {
      position: "top-right",
      autoClose: 3000,
    })
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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
        damping: 10,
      },
    },
  }

  return (
    <Box
      className="bubble-background"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
            : "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            theme.palette.mode === "dark"
              ? "radial-gradient(circle at 25% 25%, rgba(53, 92, 125, 0.2) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(120, 65, 150, 0.2) 0%, transparent 50%)"
              : "radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(173, 216, 230, 0.3) 0%, transparent 50%)",
          zIndex: 0,
        },
        "& span": {
          position: "absolute",
          borderRadius: "50%",
          background: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.3)",
          boxShadow:
            theme.palette.mode === "dark"
              ? "inset 0 0 10px rgba(255, 255, 255, 0.1)"
              : "inset 0 0 10px rgba(255, 255, 255, 0.5)",
          animation: "float 15s linear infinite",
          zIndex: 1,
        },
        "@keyframes float": {
          "0%": {
            transform: "translateY(0) rotate(0deg)",
            opacity: 0,
          },
          "10%": {
            opacity: 1,
          },
          "100%": {
            transform: "translateY(-1000%) rotate(720deg)",
            opacity: 0,
          },
        },
      }}
    >
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme.palette.mode}
      />

      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          display: "flex",
          gap: 1,
          zIndex: 10,
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderRadius: "30px",
          padding: "5px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <LanguageSwitcher />
        <ThemeToggle />
      </Box>

      <Container maxWidth="xs" sx={{ position: "relative", zIndex: 2 }}>
        <Fade in={mounted} timeout={1000}>
          <Box>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <motion.div variants={itemVariants} style={{ width: "100%" }}>
                <Paper
                  elevation={6}
                  sx={{
                    p: isMobile ? 3 : 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                    borderRadius: "16px",
                    backdropFilter: "blur(10px)",
                    backgroundColor:
                      theme.palette.mode === "dark" ? "rgba(30, 30, 45, 0.8)" : "rgba(255, 255, 255, 0.9)",
                    boxShadow:
                      theme.palette.mode === "dark"
                        ? "0 8px 32px rgba(0, 0, 0, 0.3)"
                        : "0 8px 32px rgba(31, 38, 135, 0.15)",
                    border:
                      theme.palette.mode === "dark"
                        ? "1px solid rgba(255, 255, 255, 0.1)"
                        : "1px solid rgba(255, 255, 255, 0.5)",
                    position: "relative",
                  }}
                >
                  <Box sx={{ position: "relative", width: "100%", display: "flex", justifyContent: "center" }}>
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: "primary.main",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        position: "absolute",
                        top: -28,
                      }}
                    >
                      <LockOutlinedIcon fontSize="large" />
                    </Avatar>
                  </Box>

                  <Box sx={{ mt: 4, width: "100%", textAlign: "center" }}>
                    <motion.div variants={itemVariants}>
                      <Typography
                        variant={isMobile ? "h5" : "h4"}
                        fontWeight="bold"
                        sx={{
                          mb: 1,
                          background: "linear-gradient(45deg, #1976d2, #9c27b0)",
                          backgroundClip: "text",
                          textFillColor: "transparent",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {t("Create Account")}
                      </Typography>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Join our community and start sending notifications
                      </Typography>
                    </motion.div>
                  </Box>

                  <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      gap: 2.5,
                    }}
                  >
                    <motion.div variants={itemVariants}>
                      <TextField
                        fullWidth
                        id="name"
                        label={t("name")}
                        variant="outlined"
                        required
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        {...formRegister("name")}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
                            },
                            "&.Mui-focused": {
                              boxShadow: "0 0 0 3px rgba(25, 118, 210, 0.3)",
                            },
                          },
                        }}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <TextField
                        fullWidth
                        id="email"
                        label={t("email")}
                        type="email"
                        variant="outlined"
                        required
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        {...formRegister("email")}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
                            },
                            "&.Mui-focused": {
                              boxShadow: "0 0 0 3px rgba(25, 118, 210, 0.3)",
                            },
                          },
                        }}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <TextField
                        fullWidth
                        id="password"
                        label={t("password")}
                        type={showPassword ? "text" : "password"}
                        variant="outlined"
                        required
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        {...formRegister("password")}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword((prev) => !prev)}
                                edge="end"
                                sx={{
                                  transition: "transform 0.2s",
                                  "&:hover": { transform: "scale(1.1)" },
                                }}
                              >
                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
                            },
                            "&.Mui-focused": {
                              boxShadow: "0 0 0 3px rgba(25, 118, 210, 0.3)",
                            },
                          },
                        }}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <TextField
                        fullWidth
                        id="phone"
                        label={t("phone")}
                        variant="outlined"
                        required
                        error={!!errors.phone}
                        helperText={errors.phone?.message}
                        {...formRegister("phone")}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
                            },
                            "&.Mui-focused": {
                              boxShadow: "0 0 0 3px rgba(25, 118, 210, 0.3)",
                            },
                          },
                        }}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        type="submit"
                        disabled={isLoading}
                        sx={{
                          mt: 1,
                          py: 1.5,
                          borderRadius: "10px",
                          textTransform: "none",
                          fontSize: "1rem",
                          fontWeight: 600,
                          boxShadow: "0 4px 10px rgba(25, 118, 210, 0.3)",
                          background: "linear-gradient(45deg, #1976d2, #2196f3)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            boxShadow: "0 6px 15px rgba(25, 118, 210, 0.4)",
                            transform: "translateY(-2px)",
                          },
                          "&:active": {
                            transform: "translateY(0)",
                          },
                        }}
                      >
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : t("Sign Up")}
                      </Button>
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        margin: "8px 0",
                      }}
                    >
                      <Divider sx={{ flexGrow: 1 }} />
                      <Typography variant="body2" color="text.secondary" sx={{ mx: 2 }}>
                        {t("or")}
                      </Typography>
                      <Divider sx={{ flexGrow: 1 }} />
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "16px",
                        width: "100%",
                      }}
                    >
                      <IconButton
                        onClick={() => handleSocialSignup("Google")}
                        sx={{
                          bgcolor: "#f2f2f2",
                          color: "#DB4437",
                          "&:hover": {
                            bgcolor: "#e0e0e0",
                            transform: "translateY(-3px)",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        <GoogleIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleSocialSignup("GitHub")}
                        sx={{
                          bgcolor: "#f2f2f2",
                          color: "#333",
                          "&:hover": {
                            bgcolor: "#e0e0e0",
                            transform: "translateY(-3px)",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        <GitHubIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleSocialSignup("Apple")}
                        sx={{
                          bgcolor: "#f2f2f2",
                          color: "#000",
                          "&:hover": {
                            bgcolor: "#e0e0e0",
                            transform: "translateY(-3px)",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        <AppleIcon />
                      </IconButton>
                    </motion.div>

                    <Box sx={{ mt: 2, textAlign: "center" }}>
                      <motion.div variants={itemVariants}>
                        <Link
                          component={RouterLink}
                          to="/login"
                          variant="body2"
                          sx={{
                            color: "primary.main",
                            textDecoration: "none",
                            position: "relative",
                            "&:after": {
                              content: '""',
                              position: "absolute",
                              width: "0",
                              height: "2px",
                              bottom: "-2px",
                              left: "50%",
                              transform: "translateX(-50%)",
                              backgroundColor: "primary.main",
                              transition: "width 0.3s",
                            },
                            "&:hover:after": {
                              width: "100%",
                            },
                          }}
                        >
                          {t("Already have an account? Sign in")}
                        </Link>
                      </motion.div>
                    </Box>
                  </Box>
                </Paper>
              </motion.div>
            </motion.div>
          </Box>
        </Fade>
      </Container>
    </Box>
  )
}

export default RegisterPage
