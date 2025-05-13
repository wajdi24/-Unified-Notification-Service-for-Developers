"use client"

import type React from "react"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
  Tab,
  Tabs,
  Badge,
} from "@mui/material"
import {
  Edit as EditIcon,
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
} from "@mui/icons-material"

import { useAuth } from "../../contexts/AuthContext"

// Define validation schema
const profileSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }).optional(),
  phone: z.string().optional(),

})

type ProfileFormData = z.infer<typeof profileSchema>

const ProfilePage = () => {
  const { t } = useTranslation()
  const { user, updateProfile } = useAuth()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"))

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState(0)

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      
    },
  })

  // Handle avatar change
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      setAvatarFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle avatar delete
  const handleAvatarDelete = () => {
    setAvatarFile(null)
    setAvatarPreview(null)
  }

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  // Handle form submission
  const onSubmit = async (data: ProfileFormData) => {
    try {
      setError(null)
      setSuccess(null)
      setIsLoading(true)

      // In a real app, you would upload the avatar file to a storage service
      // and get back a URL to store in the user profile
      let avatarUrl = user?.avatar
      if (avatarFile) {
        // Mock avatar upload
        avatarUrl = avatarPreview
      } else if (avatarPreview === null && user?.avatar) {
        // Avatar was deleted
        avatarUrl = undefined
      }

      await updateProfile({
        ...data,
        avatar: avatarUrl,
      })

      setSuccess(t("profileUpdatedSuccess"))
    } catch (err: any) {
      setError(err.message || t("profileUpdateError"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t("profile")}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="profile tabs">
          <Tab label={t("personalInfo")} id="profile-tab-0" />
          <Tab label={t("security")} id="profile-tab-1" />
          <Tab label={t("notifications")} id="profile-tab-2" />
          <Tab label={t("preferences")} id="profile-tab-3" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card elevation={0} sx={{ borderRadius: 2, overflow: "visible" }}>
              <CardContent
                sx={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}
              >
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  badgeContent={
                    <label htmlFor="avatar-upload">
                      <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="avatar-upload"
                        type="file"
                        onChange={handleAvatarChange}
                      />
                      <IconButton
                        component="span"
                        aria-label="upload picture"
                        sx={{
                          bgcolor: "primary.main",
                          color: "white",
                          "&:hover": { bgcolor: "primary.dark" },
                          width: 36,
                          height: 36,
                        }}
                      >
                        <PhotoCameraIcon sx={{ fontSize: 20 }} />
                      </IconButton>
                    </label>
                  }
                >
                  <Avatar
                    src={avatarPreview || user?.avatar}
                    sx={{
                      width: 120,
                      height: 120,
                      mb: 2,
                      border: `4px solid ${theme.palette.background.paper}`,
                      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    }}
                  >
                    {user?.firstName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
                  </Avatar>
                </Badge>

                {(avatarPreview || user?.avatar) && (
                  <Tooltip title={t("removeAvatar")}>
                    <IconButton
                      size="small"
                      onClick={handleAvatarDelete}
                      sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        bgcolor: "error.light",
                        color: "white",
                        "&:hover": { bgcolor: "error.main" },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}

                

                <Box sx={{ mt: 3, width: "100%" }}>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    {t("accountStatus")}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <SecurityIcon color="success" fontSize="small" />
                    <Typography variant="body2">
                      {user?.verified ? t("emailVerified") : t("emailNotVerified")}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <NotificationsIcon color={user?.notificationsEnabled ? "success" : "disabled"} fontSize="small" />
                    <Typography variant="body2">
                      {user?.notificationsEnabled ? t("notificationsEnabled") : t("notificationsDisabled")}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LanguageIcon color="primary" fontSize="small" />
                    <Typography variant="body2">{user?.language || "English"}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                p: isSmall ? 2 : 3,
                borderRadius: 2,
                boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6">{t("personalInformation")}</Typography>
                <Tooltip title={t("editProfile")}>
                  <IconButton size="small" color="primary">
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="firstName"
                      label={t("firstName")}
                      autoComplete="given-name"
                      {...register("firstName")}
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="lastName"
                      label={t("lastName")}
                      autoComplete="family-name"
                      {...register("lastName")}
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="email"
                      label={t("email")}
                      autoComplete="email"
                      {...register("email")}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="phone"
                      label={t("phoneNumber")}
                      autoComplete="tel"
                      {...register("phone")}
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                    />
                  </Grid>
                  
                </Grid>

                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isLoading || (!isDirty && !avatarFile && avatarPreview === null)}
                    startIcon={isLoading ? <CircularProgress size={20} /> : null}
                  >
                    {isLoading ? t("saving") : t("saveChanges")}
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)",
          }}
        >
          <Typography variant="h6" gutterBottom>
            {t("security")}
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Typography>{t("securityTabContent")}</Typography>
        </Paper>
      )}

      {activeTab === 2 && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)",
          }}
        >
          <Typography variant="h6" gutterBottom>
            {t("notifications")}
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Typography>{t("notificationsTabContent")}</Typography>
        </Paper>
      )}

      {activeTab === 3 && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)",
          }}
        >
          <Typography variant="h6" gutterBottom>
            {t("preferences")}
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Typography>{t("preferencesTabContent")}</Typography>
        </Paper>
      )}
    </Box>
  )
}

export default ProfilePage
