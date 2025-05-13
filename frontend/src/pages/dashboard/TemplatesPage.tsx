import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material"
import { Add, Delete, Edit } from "@mui/icons-material"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { fetchTemplates, createTemplateApi, updateTemplateApi, deleteTemplateApi } from "@/api/templatesApi"
import type { Template, TemplateType } from "@/types/Template"

const TemplatesPage = () => {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [title, setTitle] = useState("")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [type, setType] = useState<TemplateType>("EMAIL") // default EMAIL

  // Fetch templates
  const { data: templates = [] } = useQuery<Template[]>({
    queryKey: ["templates"],
    queryFn: fetchTemplates,
  })

  // Create template
  const createMutation = useMutation({
    mutationFn: createTemplateApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] })
      handleClose()
      toast.success("Template created successfully!")
    },
    onError: (error) => {
      toast.error(`Failed to create template: ${error instanceof Error ? error.message : "Unknown error"}`)
    },
  })

  // Update template
  const updateMutation = useMutation({
    mutationFn: updateTemplateApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] })
      handleClose()
      toast.success("Template updated successfully!")
    },
    onError: (error) => {
      toast.error(`Failed to update template: ${error instanceof Error ? error.message : "Unknown error"}`)
    },
  })

  // Delete template
  const deleteMutation = useMutation({
    mutationFn: deleteTemplateApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] })
      toast.success("Template deleted successfully!")
    },
    onError: (error) => {
      toast.error(`Failed to delete template: ${error instanceof Error ? error.message : "Unknown error"}`)
    },
  })

  const handleOpen = (template?: Template) => {
    if (template) {
      setSelectedTemplate(template)
      setTitle(template.title)
      setSubject(template.subject)
      setBody(template.body)
      setType(template.type)
    } else {
      setSelectedTemplate(null)
      setTitle("")
      setSubject("")
      setBody("")
      setType("EMAIL")
    }
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedTemplate(null)
    setTitle("")
    setSubject("")
    setBody("")
    setType("EMAIL")
  }

  const handleSave = async () => {
    if (!title.trim()) {
      toast.warning("Please enter a title for the template")
      return
    }

    const data = {
      title,
      subject,
      body,
      type,
    }

    if (selectedTemplate) {
      updateMutation.mutate({ id: selectedTemplate.id, ...data })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleDelete = (id: string) => {
    // Show confirmation toast before deleting
    toast.info(
      <div>
        <p>Are you sure you want to delete this template?</p>
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={() => {
            deleteMutation.mutate(id)
            toast.dismiss()
          }}
          sx={{ mr: 1 }}
        >
          Delete
        </Button>
        <Button variant="contained" color="primary" size="small" onClick={() => toast.dismiss()}>
          Cancel
        </Button>
      </div>,
      {
        autoClose: false,
        closeOnClick: false,
      },
    )
  }

  return (
    <Box p={3}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Templates</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          New Template
        </Button>
      </Box>

      <Box display="grid" gap={2}>
        {templates.length === 0 ? (
          <Typography variant="body1" color="text.secondary" textAlign="center" py={4}>
            No templates found. Create your first template by clicking the "New Template" button.
          </Typography>
        ) : (
          templates.map((template) => (
            <Box
              key={template.id}
              p={2}
              border="1px solid #ccc"
              borderRadius={2}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                transition: "all 0.2s ease",
                "&:hover": {
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  borderColor: "primary.main",
                },
              }}
            >
              <Box>
                <Typography variant="h6">{template.title}</Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {template.subject}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Type: {template.type}
                </Typography>
              </Box>
              <Box>
                <IconButton color="primary" onClick={() => handleOpen(template)} title="Edit template">
                  <Edit />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(template.id)} title="Delete template">
                  <Delete />
                </IconButton>
              </Box>
            </Box>
          ))
        )}
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{selectedTemplate ? "Edit Template" : "New Template"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            error={!title.trim()}
            helperText={!title.trim() ? "Title is required" : ""}
          />
          <TextField label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} fullWidth />
          <TextField
            label="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            multiline
            minRows={4}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select value={type} label="Type" onChange={(e) => setType(e.target.value as TemplateType)}>
              <MenuItem value="EMAIL">Email</MenuItem>
              <MenuItem value="SMS">SMS</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending
              ? "Saving..."
              : selectedTemplate
                ? "Update"
                : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default TemplatesPage

function getAuthenticatedUserId() {
  return "fake-user-id" // ➔ For now fake it
}
