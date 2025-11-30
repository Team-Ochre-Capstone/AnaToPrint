/**
 * Format file size from bytes to human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Validate if a file is a valid DICOM file
 */
export const validateDICOMFile = (
  file: File
): { valid: boolean; error?: string } => {
  const maxSize = 1024 * 1024 * 1024; // 1GB

  // Check file size
  if (file.size > maxSize) {
    return { valid: false, error: "File too large. Maximum size is 1GB." };
  }

  // Check file extension
  const fileName = file.name.toLowerCase();
  if (!fileName.endsWith(".dcm")) {
    return {
      valid: false,
      error: "Invalid file type. Only DICOM (.dcm) files are allowed.",
    };
  }

  return { valid: true };
};

/**
 * Validate multiple DICOM files
 */
export const validateDICOMFiles = (
  files: File[]
): { validFiles: File[]; errors: string[] } => {
  const validFiles: File[] = [];
  const errors: string[] = [];

  files.forEach((file) => {
    const result = validateDICOMFile(file);
    if (result.valid) {
      validFiles.push(file);
    } else if (result.error) {
      errors.push(`${file.name}: ${result.error}`);
    }
  });

  return { validFiles, errors };
};

/**
 * Format date to locale string
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString();
};
