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
import { authApi } from "../../api/authApi"

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
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

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
      setError(null)
      setSuccess(null)
      setIsLoading(true)

      const res = await authApi.register(data)

      setSuccess("Registration successful! Please check your email to verify your account.")
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message)
      } else {
        setError("Registration failed. Please try again.")
      }
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
        <Paper elevation={3} sx={{ p: 4, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {t("signUp")}
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

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3, width: "100%" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label={t("name")}
              autoFocus
              {...formRegister("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={t("email")}
              autoComplete="email"
              {...formRegister("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              label={t("password")}
              type="password"
              {...formRegister("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="phone"
              label={t("phone")}
              {...formRegister("phone")}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} /> : t("signUp")}
            </Button>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Link component={RouterLink} to="/login" variant="body2">
                {t("alreadyHaveAccount")}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default RegisterPage
