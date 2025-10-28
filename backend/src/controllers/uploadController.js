// backend/src/controllers/uploadController.js
import { upload, getFileUrl, deleteFile } from '../utils/upload.js';

/**
 * Upload single image
 */
export const uploadSingle = upload.single('image');

export const handleSingleUpload = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = getFileUrl(req.file.filename);
    
    res.json({
      message: 'File uploaded successfully',
      filename: req.file.filename,
      url: fileUrl,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed' });
  }
};

/**
 * Upload multiple images
 */
export const uploadMultiple = upload.array('images', 5); // Max 5 images

export const handleMultipleUpload = (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const files = req.files.map(file => ({
      filename: file.filename,
      url: getFileUrl(file.filename),
      size: file.size,
      mimetype: file.mimetype
    }));
    
    res.json({
      message: 'Files uploaded successfully',
      files
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed' });
  }
};

/**
 * Delete uploaded file
 */
export const deleteUploadedFile = async (req, res) => {
  try {
    const { filename } = req.params;
    
    if (!filename) {
      return res.status(400).json({ message: 'Filename is required' });
    }

    const success = await deleteFile(filename);
    
    if (success) {
      res.json({ message: 'File deleted successfully' });
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ message: 'Failed to delete file' });
  }
};
