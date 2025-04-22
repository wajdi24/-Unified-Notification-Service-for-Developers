"use client";

import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Alert,
  CircularProgress,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";

import { useAuth } from "../../contexts/AuthContext";
import LanguageSwitcher from "../../components/common/LanguageSwitcher";
import ThemeToggle from "../../components/common/ThemeToggle";

// Define validation schema
const profileSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  phone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const CompleteProfilePage = () => {
  const { t } = useTranslation();
  const { user, completeProfile } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
    },
  });

  // Handle avatar change
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setAvatarFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const onSubmit = async (data: ProfileFormData) => {
    try {
      setError(null);
      setIsLoading(true);

      // In a real app, you would upload the avatar file to a storage service
      // and get back a URL to store in the user profile
      let avatarUrl: string | undefined = user?.avatar || undefined;
      if (avatarFile) {
        // Mock avatar upload
        avatarUrl = avatarPreview ? avatarPreview : undefined; // Default to undefined if avatarPreview is null
      }

      await completeProfile({
        ...data,
        avatar: avatarUrl, // Now avatarUrl is safely either string or undefined
      });

      // Navigation is handled in the auth context
    } catch (err: any) {
      setError(err.message || "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          px: isMobile ? 2 : 0,
          py: 4,
        }}
      >
        <Box sx={{ position: "absolute", top: 16, right: 16, display: "flex", gap: 1 }}>
          <LanguageSwitcher />
          <ThemeToggle />
        </Box>

        <Paper
          elevation={2}
          sx={{
            p: isMobile ? 3 : 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main", width: 56, height: 56 }}>
            <PersonIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {t("completeProfile")}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, mb: 3, textAlign: "center" }}>
            {t("completeProfileDescription")}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1, width: "100%" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} display="flex" justifyContent="center" mb={2}>
                <Box sx={{ position: "relative" }}>
                  <Avatar src={avatarPreview || user?.avatar} sx={{ width: 100, height: 100, mb: 2 }} />
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="avatar-upload"
                    type="file"
                    onChange={handleAvatarChange}
                  />
                  <label htmlFor="avatar-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      size="small"
                      sx={{ position: "absolute", bottom: 0, right: -20 }}
                    >
                      {t("uploadAvatar")}
                    </Button>
                  </label>
                </Box>
              </Grid>

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
                  id="phone"
                  label={t("phoneNumber")}
                  autoComplete="tel"
                  {...register("phone")}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              </Grid>
            </Grid>

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} /> : t("save")}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default CompleteProfilePage;
