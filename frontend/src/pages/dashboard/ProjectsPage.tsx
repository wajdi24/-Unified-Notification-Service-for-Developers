import type React from "react"
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
  Snackbar,
} from "@mui/material"
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  VpnKey as VpnKeyIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createProjectApi,
  deleteProjectApi,
  fetchProjectsApi,
  generateApiKeyApi,
  type ProjectPayload,
  updateProjectApi,
} from "@/api/projectApi"
import { useAuth } from "@/contexts/AuthContext"

// Define validation schema for project - removed type requirement
const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  apiKey: z.string().optional(),
})

type ProjectFormValues = z.infer<typeof projectSchema>

const ProjectsPage = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [menuProject, setMenuProject] = useState<any>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const queryClient = useQueryClient()
  const { user } = useAuth()

  // React Hook Form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      apiKey: "",
    },
  })

  // Fetch projects
  const {
    data: projects = [],
    refetch: refetchProjects,
    isLoading,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjectsApi,
    // Ensure we don't show stale data
    staleTime: 0,
  })

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: createProjectApi,
    onSuccess: () => {
      setSuccessMessage("Project created successfully")
      setIsCreateDialogOpen(false)
      reset()
      // Invalidate and refetch to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      refetchProjects()
    },
    onError: (error: any) => {
      setErrorMessage(error.message || "Failed to create project")
    },
  })

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: updateProjectApi,
    onSuccess: () => {
      setSuccessMessage("Project updated successfully")
      setIsEditDialogOpen(false)
      reset()
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
    onError: (error: any) => {
      setErrorMessage(error.message || "Failed to update project")
    },
  })

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: () => deleteProjectApi(menuProject.id),
    onSuccess: () => {
      setSuccessMessage("Project deleted successfully")
      setIsDeleteDialogOpen(false)
      setAnchorEl(null)
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
    onError: (error: any) => {
      setErrorMessage(error.message || "Failed to delete project")
    },
  })

  // Generate API key mutation
  const generateApiKeyMutation = useMutation({
    mutationFn: generateApiKeyApi,
    onSuccess: (data) => {
      setSuccessMessage("API key generated successfully")
      reset((prev) => ({ ...prev, apiKey: data.apiKey }))
    },
    onError: (error: any) => {
      setErrorMessage(error.message || "Failed to generate API key")
    },
  })

  const handleCreateProject = () => {
    reset({
      name: "",
      apiKey: "",
    })
    setIsCreateDialogOpen(true)
  }

  const handleEditProject = (project: any) => {
    reset({
      name: project.name || project.name_project || project.nameProject,
      apiKey: project.apiKey || "",
    })
    setMenuProject(project)
    setIsEditDialogOpen(true)
    setAnchorEl(null)
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, project: any) => {
    setAnchorEl(event.currentTarget)
    setMenuProject(project)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true)
    setAnchorEl(null)
  }

  const handleDeleteProject = () => {
    deleteProjectMutation.mutate()
  }

  const handleGenerateApiKey = () => {
    generateApiKeyMutation.mutate()
  }

  const onSubmitCreate = (data: ProjectFormValues) => {
    if (!user) return

    const payload: ProjectPayload = {
      name_project: data.name,
      user_id: user.id,
      // No type field needed anymore
    }

    createProjectMutation.mutate(payload)
  }

  const onSubmitEdit = (data: ProjectFormValues) => {
    if (!menuProject || !user) return

    const payload: ProjectPayload = {
      id: menuProject.id,
      name_project: data.name,
      user_id: user.id,
      // No type field needed anymore
    }

    updateProjectMutation.mutate(payload)
  }

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSuccessMessage(null)
    setErrorMessage(null)
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

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Projects</Typography>
        <Box display="flex" gap={1}>
          <IconButton onClick={() => refetchProjects()} title="Refresh projects">
            <RefreshIcon />
          </IconButton>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateProject}>
            New Project
          </Button>
        </Box>
      </Box>

      {isLoading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : projects?.length ? (
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>API Key</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project: any) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <Typography variant="body1">
                      {project.name || project.name_project || project.nameProject}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {project.apiKey ? (
                      <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                        {project.apiKey.substring(0, 8)}...
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No API key
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleEditProject(project)} size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={(e) => handleMenuOpen(e, project)} size="small" color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper elevation={0} sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
          <Typography variant="body1" color="text.secondary">
            No projects found. Create your first project to get started.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateProject}
            sx={{ mt: 2 }}
          >
            Create Project
          </Button>
        </Paper>
      )}

      {/* Project Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => menuProject && handleEditProject(menuProject)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText sx={{ color: "error.main" }}>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Create Project Dialog */}
      <Dialog
        open={isCreateDialogOpen}
        onClose={() => !createProjectMutation.isPending && setIsCreateDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Create New Project</DialogTitle>
        <form onSubmit={handleSubmit(onSubmitCreate)}>
          <DialogContent>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Project Name"
                  fullWidth
                  margin="normal"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  required
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsCreateDialogOpen(false)} disabled={createProjectMutation.isPending}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={createProjectMutation.isPending}>
              {createProjectMutation.isPending ? <CircularProgress size={24} /> : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={() => !updateProjectMutation.isPending && setIsEditDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Project</DialogTitle>
        <form onSubmit={handleSubmit(onSubmitEdit)}>
          <DialogContent>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Project Name"
                  fullWidth
                  margin="normal"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  required
                />
              )}
            />

            <Box mt={2}>
              <Typography variant="subtitle2" gutterBottom>
                API Key
              </Typography>
              <Box display="flex" gap={2} alignItems="center">
                <Controller
                  name="apiKey"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      variant="outlined"
                      placeholder="No API key generated"
                      InputProps={{
                        readOnly: true,
                        sx: { fontFamily: "monospace" },
                      }}
                    />
                  )}
                />
                <Button
                  variant="outlined"
                  startIcon={<VpnKeyIcon />}
                  onClick={handleGenerateApiKey}
                  disabled={generateApiKeyMutation.isPending}
                >
                  {generateApiKeyMutation.isPending ? <CircularProgress size={20} /> : "Generate"}
                </Button>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsEditDialogOpen(false)} disabled={updateProjectMutation.isPending}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={updateProjectMutation.isPending}>
              {updateProjectMutation.isPending ? <CircularProgress size={24} /> : "Save"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => !deleteProjectMutation.isPending && setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Project</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the project "
            {menuProject?.name || menuProject?.name_project || menuProject?.nameProject}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)} disabled={deleteProjectMutation.isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteProject}
            color="error"
            variant="contained"
            disabled={deleteProjectMutation.isPending}
          >
            {deleteProjectMutation.isPending ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ProjectsPage
