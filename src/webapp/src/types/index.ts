export type TissueType = "bone" | "skin" | "muscle";

export type ExportFormat = "stl" | "gcode";

export type RenderQuality = "high" | "medium" | "low";

export type BackgroundColor = "light-gray" | "white" | "black";

export interface FileInfo {
  fileName: string;
  fileCount: number;
  fileSize: number;
  uploadDate: Date;
}

export interface AppSettings {
  renderQuality: RenderQuality;
  backgroundColor: BackgroundColor;
  showGrid: boolean;
  autoOptimize: boolean;
  defaultExport: ExportFormat;
}

export interface AppState {
  fileInfo: FileInfo | null;
  tissueType: TissueType;
  huThreshold: number;
  settings: AppSettings;
}

export interface UploadProgress {
  isUploading: boolean;
  progress: number;
  message: string;
}
