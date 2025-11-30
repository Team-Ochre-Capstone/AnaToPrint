import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useFileUpload } from "../hooks/useFileUpload";
import { formatFileSize } from "../utils/fileUtils";

const UploadPage = () => {
  const navigate = useNavigate();
  const { uploadFiles, clearUpload, uploadProgress, fileInfo, error } =
    useFileUpload();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const fileArray = Array.from(files);
      setSelectedFiles(fileArray);
      uploadFiles(fileArray);
    },
    [uploadFiles]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearFiles = () => {
    setSelectedFiles([]);
    clearUpload();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleNextClick = () => {
    if (fileInfo) {
      navigate("/preview");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-semibold mb-2 text-gray-800">
          Upload DICOM File
        </h2>
        <p className="text-gray-600 mb-6">
          Select a DICOM file or folder from your local machine
        </p>

        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
        >
          {!selectedFiles.length && !uploadProgress.isUploading && (
            <div className="cursor-pointer">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-lg text-gray-600 mb-2">
                Drop DICOM files here
              </p>
              <p className="text-sm text-gray-500">or click to browse</p>
            </div>
          )}

          {selectedFiles.length > 0 && !uploadProgress.isUploading && (
            <div className="text-left">
              <p className="font-semibold mb-2">Selected files:</p>
              {selectedFiles.map((file, index) => {
                const isValid = file.name.toLowerCase().endsWith(".dcm");
                return (
                  <div key={index} className="flex items-center gap-2 mb-1">
                    <span
                      className={isValid ? "text-green-600" : "text-red-600"}
                    >
                      {isValid ? "✓" : "✗"}
                    </span>
                    <span className="text-gray-700">
                      {file.name} ({formatFileSize(file.size)})
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {uploadProgress.isUploading && (
            <div>
              <div className="w-full bg-gray-200 rounded-full h-5 mb-3">
                <div
                  className="bg-blue-500 h-5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress.progress}%` }}
                />
              </div>
              <p className="text-gray-700">{uploadProgress.message}</p>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".dcm,.DCM"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleBrowseClick}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            {selectedFiles.length > 0
              ? "Select Different Files"
              : "Browse Files"}
          </button>

          {selectedFiles.length > 0 && (
            <button
              onClick={handleClearFiles}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Clear Files
            </button>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {uploadProgress.progress === 100 && !uploadProgress.isUploading && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-700">Files uploaded successfully!</p>
          </div>
        )}

        {fileInfo && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="font-semibold text-blue-900 mb-2">
              File Information
            </h3>
            <div className="text-sm text-blue-800">
              <p>
                <strong>Files:</strong> {fileInfo.fileName}
              </p>
              <p>
                <strong>Count:</strong> {fileInfo.fileCount}
              </p>
              <p>
                <strong>Size:</strong> {formatFileSize(fileInfo.fileSize)}
              </p>
            </div>
            <button
              onClick={handleNextClick}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Next: Preview →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
