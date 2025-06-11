import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ChallengeModal = ({ open, onClose, onCreate }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    longDescription: "",
    totalDays: "",
    imageUrl: "",
    externalLink: "",
    pdfs: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    setError("");
    if (!form.title || !form.description || !form.totalDays) {
      setError("Title, Description, and Total Days are required.");
      return;
    }
    onCreate({
      ...form,
      totalDays: Number(form.totalDays),
      externalLink: form.externalLink
        ? form.externalLink.split(",").map((l) => l.trim())
        : [],
      pdfs: form.pdfs
        ? form.pdfs.split(",").map((l) => l.trim())
        : []
    });
    setForm({
      title: "",
      description: "",
      longDescription: "",
      totalDays: "",
      imageUrl: "",
      externalLink: "",
      pdfs: ""
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Create New Challenge
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          margin="normal"
          label="Title"
          name="title"
          fullWidth
          value={form.title}
          onChange={handleChange}
          required
        />
        <TextField
          margin="normal"
          label="Short Description"
          name="description"
          fullWidth
          value={form.description}
          onChange={handleChange}
          required
        />
        <TextField
          margin="normal"
          label="Long Description"
          name="longDescription"
          fullWidth
          multiline
          minRows={3}
          value={form.longDescription}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          label="Total Days"
          name="totalDays"
          type="number"
          fullWidth
          value={form.totalDays}
          onChange={handleChange}
          required
        />
        <TextField
          margin="normal"
          label="Image URL"
          name="imageUrl"
          fullWidth
          value={form.imageUrl}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          label="External Links (comma separated)"
          name="externalLink"
          fullWidth
          value={form.externalLink}
          onChange={handleChange}
          placeholder="https://youtube.com/..., https://resource.com/..."
        />
        <TextField
          margin="normal"
          label="PDF Links (comma separated)"
          name="pdfs"
          fullWidth
          value={form.pdfs}
          onChange={handleChange}
          placeholder="https://example.com/file.pdf"
        />
        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChallengeModal;