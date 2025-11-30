import { useState, useCallback } from "react";
import { FileInfo, UploadProgress } from "../types";
import { validateDICOMFiles } from "../utils/fileUtils";
import { saveToSession } from "../utils/storage";

export const useFileUpload = () => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    isUploading: false,
    progress: 0,
    message: "",
  });
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadFiles = useCallback(async (files: File[]) => {
    setError(null);

    // Validate files
    const { validFiles, errors } = validateDICOMFiles(files);

    if (validFiles.length === 0) {
      setError(
        errors.length > 0 ? errors.join(", ") : "No valid DICOM files found"
      );
      return;
    }

    // Show progress
    setUploadProgress({
      isUploading: true,
      progress: 0,
      message: "Preparing upload...",
    });

    try {
      // Simulate processing since this is client-side only
      // In a real implementation, this would process DICOM files with vtk.js
      const totalSize = validFiles.reduce((sum, file) => sum + file.size, 0);

      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        setUploadProgress({
          isUploading: true,
          progress: i,
          message: i < 100 ? `Processing... ${i}%` : "Complete!",
        });
      }

      // Create file info
      const newFileInfo: FileInfo = {
        fileName:
          validFiles.length === 1
            ? validFiles[0].name
            : `${validFiles.length} files`,
        fileCount: validFiles.length,
        fileSize: totalSize,
        uploadDate: new Date(),
      };

      setFileInfo(newFileInfo);
      saveToSession("fileInfo", newFileInfo);

      setUploadProgress({
        isUploading: false,
        progress: 100,
        message: "Upload complete!",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed";
      setError(errorMessage);
      setUploadProgress({
        isUploading: false,
        progress: 0,
        message: "",
      });
    }
  }, []);

  const clearUpload = useCallback(() => {
    setFileInfo(null);
    setUploadProgress({
      isUploading: false,
      progress: 0,
      message: "",
    });
    setError(null);
  }, []);

  return {
    uploadFiles,
    clearUpload,
    uploadProgress,
    fileInfo,
    error,
  };
};
