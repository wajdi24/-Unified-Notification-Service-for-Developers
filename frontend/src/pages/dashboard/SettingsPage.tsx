import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion, AnimatePresence } from "framer-motion"
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  Switch,
  IconButton,
  InputAdornment,
  useMediaQuery,
  useTheme,
  Tabs,
  Tab,
  alpha,
  Card,
  CardContent,
} from "@mui/material"
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  Palette as PaletteIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Check as CheckIcon,
  Security as SecurityIcon,
  VpnKey as VpnKeyIcon,
  Devices as DevicesIcon,
  Tune as TuneIcon,
  Email as EmailIcon,
} from "@mui/icons-material"
import { useThemeMode } from "../../contexts/ThemeModeContext"
import LanguageSwitcher from "../../components/common/LanguageSwitcher"
import authApi from "@/api/authApi"

// Define validation schema for password change
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, { message: "Current password is required" }),
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
      .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type PasswordFormData = z.infer<typeof passwordSchema>

// Password strength component
const PasswordStrengthMeter = ({ password }: { password: string }) => {
  const getStrength = () => {
    if (!password) return 0
    let strength = 0
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1
    return strength
  }

  const strength = getStrength()
  const getColor = () => {
    if (strength <= 2) return "error.main"
    if (strength <= 3) return "warning.main"
    return "success.main"
  }

  const getLabel = () => {
    if (strength <= 2) return "Weak"
    if (strength <= 3) return "Medium"
    return "Strong"
  }

  return (
    <Box sx={{ mt: 1, mb: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
          Password Strength:
        </Typography>
        <Typography variant="body2" sx={{ color: getColor(), fontWeight: 500 }}>
          {getLabel()}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", gap: 0.5 }}>
        {[1, 2, 3, 4, 5].map((index) => (
          <Box
            key={index}
            component={motion.div}
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            sx={{
              height: 4,
              borderRadius: 1,
              flex: 1,
              bgcolor: index <= strength ? getColor() : "grey.300",
            }}
          />
        ))}
      </Box>
    </Box>
  )
}

// Theme preview component
const ThemePreview = ({
  mode,
  isActive,
  onClick,
}: {
  mode: "light" | "dark"
  isActive: boolean
  onClick: () => void
}) => {
  const theme = useTheme()

  return (
    <Card
      component={motion.div}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      sx={{
        cursor: "pointer",
        position: "relative",
        overflow: "visible",
        border: isActive ? `2px solid ${theme.palette.primary.main}` : "2px solid transparent",
        boxShadow: isActive ? `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}` : "none",
        transition: "all 0.3s ease",
        bgcolor: mode === "light" ? "#ffffff" : "#121212",
      }}
    >
      {isActive && (
        <Box
          component={motion.div}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          sx={{
            position: "absolute",
            top: -10,
            right: -10,
            width: 24,
            height: 24,
            borderRadius: "50%",
            bgcolor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
          }}
        >
          <CheckIcon sx={{ fontSize: 16, color: "white" }} />
        </Box>
      )}
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ mb: 1.5 }}>
          <Box
            sx={{
              height: 12,
              width: "70%",
              mb: 1,
              borderRadius: 1,
              bgcolor: mode === "light" ? "grey.300" : "grey.700",
            }}
          />
          <Box
            sx={{
              height: 8,
              width: "90%",
              borderRadius: 1,
              bgcolor: mode === "light" ? "grey.200" : "grey.800",
            }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
          <Box
            sx={{
              height: 20,
              width: 20,
              borderRadius: "50%",
              bgcolor: mode === "light" ? "primary.main" : "primary.dark",
            }}
          />
          <Box
            sx={{
              height: 20,
              width: "60%",
              borderRadius: 1,
              bgcolor: mode === "light" ? "grey.300" : "grey.700",
            }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Box
            sx={{
              height: 16,
              width: "40%",
              borderRadius: 1,
              bgcolor: mode === "light" ? "grey.200" : "grey.800",
            }}
          />
          <Box
            sx={{
              height: 16,
              width: "30%",
              borderRadius: 1,
              bgcolor: mode === "light" ? "success.light" : "success.dark",
            }}
          />
        </Box>
      </CardContent>
      <Box
        sx={{
          p: 1.5,
          borderTop: "1px solid",
          borderColor: mode === "light" ? "grey.200" : "grey.800",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        {mode === "light" ? (
          <LightModeIcon sx={{ fontSize: 18, color: mode === "light" ? "warning.main" : "grey.500" }} />
        ) : (
          <DarkModeIcon sx={{ fontSize: 18, color: mode === "light" ? "grey.500" : "primary.light" }} />
        )}
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            color: mode === "light" ? "text.primary" : "#ffffff",
          }}
        >
          {mode === "light" ? "Light Mode" : "Dark Mode"}
        </Typography>
      </Box>
    </Card>
  )
}

const SettingsPage = () => {
  const { t } = useTranslation()
  const { themeMode, setThemeMode } = useThemeMode()
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"))
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [themeChangeAnimation, setThemeChangeAnimation] = useState(false)

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const newPassword = watch("newPassword")

  // Handle password change
  const onSubmit = async (data: PasswordFormData) => {
    try {
      setError(null)
      setSuccess(null)
      setIsLoading(true)
      // Call the API to change password
      await authApi.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })

      setSuccess("Password changed successfully")
      reset()
    } catch (err: any) {
      setError(err.message || "Failed to change password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle theme change with animation
  const handleThemeChange = (mode: "light" | "dark") => {
    if (mode === themeMode) return

    setThemeChangeAnimation(true)
    setTimeout(() => {
      setThemeMode(mode)
      setThemeChangeAnimation(false)
    }, 300)
  }

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

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            mb: 4,
            fontWeight: 700,
            background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {t("settings")}
        </Typography>
      </motion.div>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant={isSmall ? "scrollable" : "standard"}
          scrollButtons={isSmall ? "auto" : undefined}
          sx={{ mb: 1 }}
        >
          <Tab icon={<PaletteIcon />} label="Appearance" iconPosition="start" sx={{ minHeight: 48 }} />
          <Tab icon={<NotificationsIcon />} label="Notifications" iconPosition="start" sx={{ minHeight: 48 }} />
          <Tab icon={<SecurityIcon />} label="Security" iconPosition="start" sx={{ minHeight: 48 }} />
        </Tabs>
      </Box>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 0 && (
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <Paper
                elevation={0}
                sx={{
                  p: isSmall ? 2 : 3,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  mb: 3,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <motion.div variants={itemVariants}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <PaletteIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="h6" fontWeight={600}>
                      {t("appearance")}
                    </Typography>
                  </Box>
                </motion.div>

                <Divider sx={{ mb: 4 }} />

                <motion.div variants={itemVariants}>
                  <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 3 }}>
                    Choose Theme Mode
                  </Typography>

                  <Box
                    component={motion.div}
                    animate={{ opacity: themeChangeAnimation ? 0.5 : 1 }}
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                      gap: 3,
                      mb: 4,
                    }}
                  >
                    <ThemePreview
                      mode="light"
                      isActive={themeMode === "light"}
                      onClick={() => handleThemeChange("light")}
                    />
                    <ThemePreview
                      mode="dark"
                      isActive={themeMode === "dark"}
                      onClick={() => handleThemeChange("dark")}
                    />
                  </Box>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 2 }}>
                    Language
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <LanguageIcon sx={{ mr: 2, color: "primary.main" }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1" fontWeight={500}>
                        {t("language")}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t("selectLanguage")}
                      </Typography>
                    </Box>
                    <LanguageSwitcher />
                  </Box>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 2 }}>
                      Advanced Options
                    </Typography>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <TuneIcon sx={{ mr: 2, color: "primary.main" }} />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body1" fontWeight={500}>
                            Reduced Motion
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Minimize animations throughout the interface
                          </Typography>
                        </Box>
                        <Switch />
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <DevicesIcon sx={{ mr: 2, color: "primary.main" }} />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body1" fontWeight={500}>
                            Use System Theme
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Automatically match your device's theme settings
                          </Typography>
                        </Box>
                        <Switch defaultChecked />
                      </Box>
                    </Box>
                  </Box>
                </motion.div>

                {/* Theme change animation overlay */}
                <AnimatePresence>
                  {themeChangeAnimation && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: themeMode === "light" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 10,
                      }}
                    >
                      <CircularProgress size={40} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Paper>
            </motion.div>
          )}

          {activeTab === 1 && (
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <Paper
                elevation={0}
                sx={{
                  p: isSmall ? 2 : 3,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <motion.div variants={itemVariants}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <NotificationsIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="h6" fontWeight={600}>
                      {t("notificationSettings")}
                    </Typography>
                  </Box>
                </motion.div>

                <Divider sx={{ mb: 4 }} />

                <motion.div variants={itemVariants}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        sx={{
                          mr: 2,
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <EmailIcon sx={{ color: "primary.main" }} />
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body1" fontWeight={500}>
                          {t("emailNotifications")}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t("receiveEmailNotifications")}
                        </Typography>
                      </Box>
                      <Switch
                        checked={emailNotifications}
                        onChange={() => setEmailNotifications(!emailNotifications)}
                      />
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        sx={{
                          mr: 2,
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <NotificationsIcon sx={{ color: "primary.main" }} />
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body1" fontWeight={500}>
                          {t("pushNotifications")}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t("receivePushNotifications")}
                        </Typography>
                      </Box>
                      <Switch checked={pushNotifications} onChange={() => setPushNotifications(!pushNotifications)} />
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        sx={{
                          mr: 2,
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <VpnKeyIcon sx={{ color: "primary.main" }} />
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body1" fontWeight={500}>
                          Security Alerts
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Get notified about important security events
                        </Typography>
                      </Box>
                      <Switch defaultChecked />
                    </Box>
                  </Box>
                </motion.div>
              </Paper>
            </motion.div>
          )}

          {activeTab === 2 && (
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <Paper
                elevation={0}
                sx={{
                  p: isSmall ? 2 : 3,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <motion.div variants={itemVariants}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <SecurityIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="h6" fontWeight={600}>
                      {t("security")}
                    </Typography>
                  </Box>
                </motion.div>

                <Divider sx={{ mb: 4 }} />

                {error && (
                  <motion.div variants={itemVariants}>
                    <Alert
                      severity="error"
                      sx={{
                        mb: 3,
                        borderRadius: 2,
                        "& .MuiAlert-icon": {
                          alignItems: "center",
                        },
                      }}
                    >
                      {error}
                    </Alert>
                  </motion.div>
                )}

                {success && (
                  <motion.div variants={itemVariants}>
                    <Alert
                      severity="success"
                      sx={{
                        mb: 3,
                        borderRadius: 2,
                        "& .MuiAlert-icon": {
                          alignItems: "center",
                        },
                      }}
                    >
                      {success}
                    </Alert>
                  </motion.div>
                )}

                <motion.div variants={itemVariants}>
                  <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          required
                          fullWidth
                          id="currentPassword"
                          label={t("currentPassword")}
                          type={showCurrentPassword ? "text" : "password"}
                          {...register("currentPassword")}
                          error={!!errors.currentPassword}
                          helperText={errors.currentPassword?.message}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle current password visibility"
                                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                  edge="end"
                                >
                                  {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          required
                          fullWidth
                          id="newPassword"
                          label={t("newPassword")}
                          type={showNewPassword ? "text" : "password"}
                          {...register("newPassword")}
                          error={!!errors.newPassword}
                          helperText={errors.newPassword?.message}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle new password visibility"
                                  onClick={() => setShowNewPassword(!showNewPassword)}
                                  edge="end"
                                >
                                  {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                            },
                          }}
                        />
                        {newPassword && <PasswordStrengthMeter password={newPassword} />}
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          required
                          fullWidth
                          id="confirmPassword"
                          label={t("confirmPassword")}
                          type={showConfirmPassword ? "text" : "password"}
                          {...register("confirmPassword")}
                          error={!!errors.confirmPassword}
                          helperText={errors.confirmPassword?.message}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle confirm password visibility"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  edge="end"
                                >
                                  {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                            },
                          }}
                        />
                      </Grid>
                    </Grid>

                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={isLoading}
                        sx={{
                          borderRadius: 2,
                          py: 1,
                          px: 3,
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : t("changePassword")}
                      </Button>
                    </Box>
                  </Box>
                </motion.div>
              </Paper>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </Box>
  )
}

export default SettingsPage
