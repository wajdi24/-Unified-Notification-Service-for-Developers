import type React from "react"
import { useState } from "react"
import {
  Box,
  Typography,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Snackbar,
  Tooltip,
  Divider,
  Chip,
  Tabs,
  Tab,
  SelectChangeEvent,
  Button,
} from "@mui/material"
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  FileCopy as TemplateIcon,
  FormatBold as BoldIcon,
  FormatItalic as ItalicIcon,
  FormatUnderlined as UnderlineIcon,
  FormatAlignLeft as AlignLeftIcon,
  FormatAlignCenter as AlignCenterIcon,
  FormatAlignRight as AlignRightIcon,
  FormatColorText as ColorIcon,
  InsertLink as LinkIcon,
  Image as ImageIcon,
  Code as CodeIcon,
  FormatListBulleted as ListBulletedIcon,
  FormatListNumbered as ListNumberedIcon,
  Preview as PreviewIcon,
  Save as SaveIcon,
} from "@mui/icons-material"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { fetchProjectsWithNotifications, createTemplateForNotification } from "@/api/projectNotificationsApi"
import { fetchProjectsApi } from "@/api/projectApi"

// Define notification types
interface Notification {
  id: string
  title: string
  external_id: string
  projectId: string
  createdAt: string
  updatedAt: string
  template?: Template
  category: string
}

// Define template types
interface Template {
  id: string
  title: string
  subject: string
  body: string
  type: "EMAIL" | "SMS"
  userId: string
  createdAt: string
  updatedAt: string
}

// Define project types
interface Project {
  id: string
  nameProject: string
  apiKey: string
  userId: string
  createdAt: string
  updatedAt: string
  notifications?: Notification[]
}

// Available template variables
const templateVariables = [
  { name: "name", description: "Recipient's name" },
  { name: "email", description: "Recipient's email" },
  { name: "resetLink", description: "Password reset link" },
  { name: "verificationCode", description: "Email verification code" },
  { name: "companyName", description: "Your company name" },
  { name: "month", description: "Current month" },
  { name: "year", description: "Current year" },
]



type TemplateFormValues = {
  name: string
  subject: string
  body: string
  type: "SMS" | "EMAIL"
  notification_id: string
}

// Template categories
const templateCategories = ["Onboarding", "Account", "Marketing", "Transactional", "Notification"]

const ProjectNotificationsPage = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>("")
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const [notificationForTemplate, setNotificationForTemplate] = useState<Notification | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [editorTab, setEditorTab] = useState<number>(0)
  const [previewMode, setPreviewMode] = useState<boolean>(false)

  const queryClient = useQueryClient()

  // Fetch all projects
  const { data: projects, isLoading: isLoadingProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjectsApi,
  })

  // Fetch notifications for selected project
  const { data: projectWithNotifications, isLoading: isLoadingNotifications } = useQuery({
    queryKey: ["projects-with-notifications", selectedProjectId],
    queryFn: () => fetchProjectsWithNotifications(selectedProjectId),
    enabled: !!selectedProjectId,
  })

  // Get notifications for selected project
  const notifications = projectWithNotifications?.[0]?.notifications || []

  // Form handling for templates
  const {
    control: templateControl,
    handleSubmit: handleSubmitTemplate,
    reset: resetTemplate,
    formState: { errors: templateErrors },
    watch: watchTemplate,
  } = useForm<TemplateFormValues>({
    defaultValues: {
      name: "",
      subject: "",
      body: "<p>Enter your email content here...</p>",
      type: "EMAIL",
      notification_id: "",
    },
  })

  // Watch template body for preview
  const templateBody = watchTemplate("body")

  // Create template mutation
  const createTemplateMutation = useMutation({
    mutationFn: async (data: TemplateFormValues) => {
      if (!data.notification_id) {
        throw new Error("Notification ID is required")
      }
      return createTemplateForNotification({
        notificationId: data.notification_id,
        template: {
          title: data.name,
          subject: data.subject,
          body: data.body,
          type: data.type,
        }
      })
    },
    onSuccess: () => {
      setSuccessMessage("Template created successfully")
      setIsTemplateDialogOpen(false)
      resetTemplate()
      setNotificationForTemplate(null)
      setEditorTab(0)
      setPreviewMode(false)
      queryClient.invalidateQueries({ queryKey: ["projects-with-notifications"] })
    },
    onError: (error: Error) => {
      setErrorMessage(error.message || "Failed to create template")
    },
  })

  // Handle project selection
  const handleProjectChange = (event: SelectChangeEvent<string>) => {
    const projectId = event.target.value
    setSelectedProjectId(projectId)
  }

  // Handle create template from notification
  const handleCreateTemplate = (notification: Notification) => {
    setNotificationForTemplate(notification)
    resetTemplate({
      name: `Template for ${notification.title}`,
      subject: notification.title,
      body: notification.template?.body || `<p>Dear {{name}},</p><p>This is a template for notification "${notification.title}".</p>`,
      type: "EMAIL",
      notification_id: notification.id,
    })
    setIsTemplateDialogOpen(true)
    setEditorTab(0)
    setPreviewMode(false)
  }

  // Handle form submission for templates
  const onSubmitTemplate = (data: TemplateFormValues) => {
    createTemplateMutation.mutate(data)
  }

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSuccessMessage(null)
    setErrorMessage(null)
  }

  // Handle editor tab change
  const handleEditorTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setEditorTab(newValue)
  }

  // Toggle preview mode
  const handleTogglePreview = () => {
    setPreviewMode(!previewMode)
  }

  // Insert variable into template body
  const handleInsertVariable = (variable: string) => {
    const variableText = `{{${variable}}}`
    const currentBody = watchTemplate("body") || ""
    resetTemplate({
      ...watchTemplate(),
      body: currentBody + variableText,
    })
  }

  return (
    <Box p={4}>
      {/* Success and Error Snackbars */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: "100%" }}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: "100%" }}>
          {errorMessage}
        </Alert>
      </Snackbar>

      <Typography variant="h5" gutterBottom>
        Project Notifications
      </Typography>

      {/* Project Selection */}
      <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <FormControl sx={{ minWidth: 250 }}>
            <InputLabel id="project-select-label">Select Project</InputLabel>
            <Select
              labelId="project-select-label"
              value={selectedProjectId}
              onChange={handleProjectChange}
              label="Select Project"
              disabled={isLoadingProjects}
            >
              <MenuItem value="">
                <em>Select a project</em>
              </MenuItem>
              {projects?.map((project: Project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.nameProject}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedProjectId && (
            <Box display="flex" gap={1}>
              <IconButton onClick={() => queryClient.invalidateQueries({ queryKey: ["projects-with-notifications"] })} title="Refresh notifications">
                <RefreshIcon />
              </IconButton>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Notifications List */}
      {selectedProjectId ? (
        isLoadingNotifications ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : notifications && notifications.length > 0 ? (
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>External ID</TableCell>
                  <TableCell>Template</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notifications.map((notification: Notification) => (
                  <TableRow key={notification.id}>
                    <TableCell>{notification.title}</TableCell>
                    <TableCell>{notification.external_id}</TableCell>
                    <TableCell>
                      {notification.template ? (
                        <Chip label="Configured" color="success" size="small" />
                      ) : (
                        <Chip label="Not configured" color="warning" size="small" />
                      )}
                    </TableCell>
                    <TableCell>{new Date(notification.createdAt).toLocaleString()}</TableCell>
                    <TableCell align="right">
                      <Tooltip title={notification.template ? "Edit template" : "Create template"}>
                        <IconButton
                          onClick={() => handleCreateTemplate(notification)}
                          size="small"
                          color="primary"
                          sx={{ mr: 1 }}
                        >
                          <TemplateIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Paper elevation={0} sx={{ p: 4, textAlign: "center" }}>
            <Typography color="text.secondary">No notifications found for this project.</Typography>
          </Paper>
        )
      ) : (
        <Paper elevation={0} sx={{ p: 4, textAlign: "center" }}>
          <Typography color="text.secondary">Select a project to view notifications.</Typography>
        </Paper>
      )}

      {/* Create Template Dialog */}
      <Dialog
        open={isTemplateDialogOpen}
        onClose={() => !createTemplateMutation.isPending && setIsTemplateDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>{notificationForTemplate ? "Create Template from Notification" : "Create Template"}</DialogTitle>
        <form onSubmit={handleSubmitTemplate(onSubmitTemplate)}>
          <DialogContent>
            {notificationForTemplate && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Creating template from notification: {notificationForTemplate?.title}
                </Typography>
              </Box>
            )}

            <Box sx={{ mb: 2 }}>
              <Controller
                name="name"
                control={templateControl}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Template Name"
                    fullWidth
                    margin="normal"
                    error={!!templateErrors.name}
                    helperText={templateErrors.name?.message}
                    required
                  />
                )}
              />
              <FormControl fullWidth margin="normal" error={!!templateErrors.type}>
                <InputLabel id="template-type-label">Type</InputLabel>
                <Controller
                  name="type"
                  control={templateControl}
                  render={({ field }) => (
                    <Select {...field} labelId="template-type-label" label="Type" required>
                      <MenuItem value="EMAIL">Email</MenuItem>
                      <MenuItem value="SMS">SMS</MenuItem>
                    </Select>
                  )}
                />
                {templateErrors.type && <Typography color="error">{templateErrors.type.message}</Typography>}
              </FormControl>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Tabs value={editorTab} onChange={handleEditorTabChange}>
              <Tab label="Design" />
              <Tab label="Code" />
            </Tabs>

            <Box sx={{ mt: 2 }}>
              {editorTab === 0 && (
                <Box>
                  <Controller
                    name="subject"
                    control={templateControl}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Subject"
                        fullWidth
                        margin="normal"
                        error={!!templateErrors.subject}
                        helperText={templateErrors.subject?.message}
                        required
                      />
                    )}
                  />

                  <Box sx={{ mb: 2, mt: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Template Variables
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {templateVariables.map((variable) => (
                        <Tooltip key={variable.name} title={variable.description}>
                          <Chip
                            label={variable.name}
                            onClick={() => handleInsertVariable(variable.name)}
                            size="small"
                            clickable
                          />
                        </Tooltip>
                      ))}
                    </Box>
                  </Box>

                  <Paper
                    elevation={0}
                    sx={{
                      p: 1,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1,
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      <Tooltip title="Bold">
                        <IconButton size="small">
                          <BoldIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Italic">
                        <IconButton size="small">
                          <ItalicIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Underline">
                        <IconButton size="small">
                          <UnderlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                      <Tooltip title="Align Left">
                        <IconButton size="small">
                          <AlignLeftIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Align Center">
                        <IconButton size="small">
                          <AlignCenterIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Align Right">
                        <IconButton size="small">
                          <AlignRightIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                      <Tooltip title="Text Color">
                        <IconButton size="small">
                          <ColorIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Insert Link">
                        <IconButton size="small">
                          <LinkIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Insert Image">
                        <IconButton size="small">
                          <ImageIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                      <Tooltip title="Bulleted List">
                        <IconButton size="small">
                          <ListBulletedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Numbered List">
                        <IconButton size="small">
                          <ListNumberedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Paper>

                  {previewMode ? (
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                        minHeight: 300,
                        maxHeight: 500,
                        overflow: "auto",
                      }}
                    >
                      <Box dangerouslySetInnerHTML={{ __html: templateBody || "" }} />
                    </Paper>
                  ) : (
                    <Controller
                      name="body"
                      control={templateControl}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          multiline
                          rows={12}
                          variant="outlined"
                          error={!!templateErrors.body}
                          helperText={templateErrors.body?.message}
                          sx={{ mb: 2 }}
                        />
                      )}
                    />
                  )}

                  <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={previewMode ? <CodeIcon /> : <PreviewIcon />}
                      onClick={handleTogglePreview}
                      sx={{ mr: 1 }}
                    >
                      {previewMode ? "Edit" : "Preview"}
                    </Button>
                  </Box>
                </Box>
              )}

              {editorTab === 1 && (
                <Controller
                  name="body"
                  control={templateControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      rows={20}
                      variant="outlined"
                      error={!!templateErrors.body}
                      helperText={templateErrors.body?.message}
                      sx={{ mt: 2, fontFamily: "monospace" }}
                    />
                  )}
                />
              )}
            </Box>

            <Controller
              name="notification_id"
              control={templateControl}
              render={({ field }) => <input type="hidden" {...field} />}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsTemplateDialogOpen(false)} disabled={createTemplateMutation.isPending}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={createTemplateMutation.isPending}
            >
              {createTemplateMutation.isPending ? <CircularProgress size={24} /> : "Save Template"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}

export default ProjectNotificationsPage