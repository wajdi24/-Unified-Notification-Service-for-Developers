"use client"

import { useState } from "react"
import { Link as RouterLink } from "react-router-dom"
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
  Alert,
  CircularProgress,
} from "@mui/material"
import { LockOutlined as LockOutlinedIcon } from "@mui/icons-material"

import { useAuth } from "../../contexts/AuthContext"
import LanguageSwitcher from "../../components/common/LanguageSwitcher"
import ThemeToggle from "../../components/common/ThemeToggle"

// Define validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

const ForgotPasswordPage = () => {
  const { t } = useTranslation()
  const { requestPasswordReset } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  // Handle form submission
  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setError(null)
      setSuccess(null)
      setIsLoading(true)
      await requestPasswordReset(data.email)
      setSuccess("Password reset link has been sent to your email.")
    } catch (err: any) {
      setError(err.message || "Failed to send reset link. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <Box sx={{ position: "absolute", top: 16, right: 16, display: "flex", gap: 1 }}>
          <LanguageSwitcher />
          <ThemeToggle />
        </Box>

        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {t("resetPassword")}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, mb: 3, textAlign: "center" }}>
            {t("resetPasswordDescription")}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mt: 2, width: "100%" }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1, width: "100%" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={t("email")}
              autoComplete="email"
              autoFocus
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} /> : t("sendResetLink")}
            </Button>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Link component={RouterLink} to="/login" variant="body2">
                {t("backToLogin")}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default ForgotPasswordPage
