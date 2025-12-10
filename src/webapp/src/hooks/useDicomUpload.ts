import { useState, useCallback } from "react";
import { convertItkToVtkImage } from "@kitware/vtk.js/Common/DataModel/ITKHelper";
import {
  parseDicomFiles,
  loadDicomImageSeries,
  groupDicomFiles,
  type DicomFileInfo,
  type ProgressCallback,
} from "../utils/dicomUtils";

export interface DicomSeriesInfo {
  patientID: string;
  studyInstanceID: string;
  seriesInstanceID: string;
  seriesDescription: string;
  numberOfSlices: number;
  files: DicomFileInfo[];
}

export interface DicomUploadState {
  isLoading: boolean;
  isComplete: boolean;
  error: string | null;
  progress: number;
  statusMessage: string;
  vtkImage: any | null;
  fileInfo: DicomFileInfo[];
  seriesList: DicomSeriesInfo[];
}

export function useDicomUpload() {
  const [state, setState] = useState<DicomUploadState>({
    isLoading: false,
    isComplete: false,
    error: null,
    progress: 0,
    statusMessage: "",
    vtkImage: null,
    fileInfo: [],
    seriesList: [],
  });

  const progressCallback: ProgressCallback = useCallback((event) => {
    const progress = event.lengthComputable
      ? (event.loaded / event.total) * 100
      : 0;

    setState((prev) => ({
      ...prev,
      progress,
    }));
  }, []);

  const loadSeries = useCallback(
    async (files: DicomFileInfo[]) => {
      try {
        // Load image series
        setState((prev) => ({
          ...prev,
          isLoading: true,
          seriesList: [], // Clear selection list
          statusMessage: `Loading image series (${files.length} slices)...`,
        }));

        const itkImage = await loadDicomImageSeries(
          files.map((f) => f.file),
          progressCallback
        );

        // Convert to VTK image
        setState((prev) => ({
          ...prev,
          statusMessage: "Converting to 3D image...",
        }));

        const vtkImage = convertItkToVtkImage(itkImage);

        setState({
          isLoading: false,
          isComplete: true,
          error: null,
          progress: 100,
          statusMessage: "Upload complete",
          vtkImage,
          fileInfo: files,
          seriesList: [],
        });
      } catch (error) {
        console.error("Error loading series:", error);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error:
            error instanceof Error ? error.message : "Unknown error occurred",
          statusMessage: "Error loading series",
        }));
      }
    },
    [progressCallback]
  );

  const uploadDicomFiles = useCallback(
    async (files: FileList | File[]) => {
      setState({
        isLoading: true,
        isComplete: false,
        error: null,
        progress: 0,
        statusMessage: "Loading DICOM files...",
        vtkImage: null,
        fileInfo: [],
        seriesList: [],
      });

      try {
        // Parse DICOM files
        setState((prev) => ({
          ...prev,
          statusMessage: "Parsing DICOM files...",
        }));
        const parsedFiles = await parseDicomFiles(files, progressCallback);

        const dicomFiles = parsedFiles.filter((f) => f.isDICOM);

        if (dicomFiles.length === 0) {
          throw new Error("No valid DICOM files found");
        }

        setState((prev) => ({
          ...prev,
          statusMessage: `Found ${dicomFiles.length} DICOM files`,
          fileInfo: dicomFiles,
        }));

        // Group files by series
        const groupedFiles = groupDicomFiles(dicomFiles);
        const allSeries: DicomSeriesInfo[] = [];

        groupedFiles.forEach((studies, patientID) => {
          studies.forEach((series, studyInstanceID) => {
            series.forEach((files, seriesInstanceID) => {
              allSeries.push({
                patientID,
                studyInstanceID,
                seriesInstanceID,
                seriesDescription:
                  files[0].seriesDescription || "No Description",
                numberOfSlices: files.length,
                files,
              });
            });
          });
        });

        if (allSeries.length === 0) {
          throw new Error("No image series found");
        }

        if (allSeries.length === 1) {
          // If only one series, load it automatically
          await loadSeries(allSeries[0].files);
        } else {
          // If multiple series, let user choose
          setState((prev) => ({
            ...prev,
            isLoading: false,
            statusMessage: "Please select a series",
            seriesList: allSeries,
          }));
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load DICOM files";

        setState({
          isLoading: false,
          isComplete: false,
          error: errorMessage,
          progress: 0,
          statusMessage: "",
          vtkImage: null,
          fileInfo: [],
          seriesList: [],
        });
      }
    },
    [progressCallback, loadSeries]
  );

  const clearUpload = useCallback(() => {
    setState({
      isLoading: false,
      isComplete: false,
      error: null,
      progress: 0,
      statusMessage: "",
      vtkImage: null,
      fileInfo: [],
      seriesList: [],
    });
  }, []);

  return {
    ...state,
    uploadDicomFiles,
    loadSeries,
    clearUpload,
  };
}
