import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TissueType, FileInfo } from "../types";
import { getFromSession } from "../utils/storage";
import { formatFileSize } from "../utils/fileUtils";

const PreviewPage = () => {
  const navigate = useNavigate();
  const [tissueType, setTissueType] = useState<TissueType>("bone");
  const [huThreshold, setHuThreshold] = useState(300);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);

  useEffect(() => {
    // Load file info from session
    const savedFileInfo = getFromSession<FileInfo>("fileInfo");
    setFileInfo(savedFileInfo);
  }, []);

  const handleTissueChange = (type: TissueType) => {
    setTissueType(type);

    // Set appropriate HU threshold for tissue type
    const thresholds: Record<TissueType, number> = {
      bone: 300,
      skin: -200,
      muscle: 40,
    };
    setHuThreshold(thresholds[type]);
  };

  const handleNextClick = () => {
    navigate("/export");
  };

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <div className="flex gap-8">
      {/* Main Content */}
      <div className="flex-1 bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-semibold mb-2 text-gray-800">
          3D Preview & Tissue Selection
        </h2>
        <p className="text-gray-600 mb-6">
          Visualize and select anatomical tissue type
        </p>

        {/* 3D Preview Area */}
        <div
          className="relative bg-gray-100 rounded-lg mb-6 flex items-center justify-center"
          style={{ height: "400px" }}
        >
          <div className="text-center text-gray-500">
            <svg
              className="mx-auto h-24 w-24 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
              />
            </svg>
            <p className="text-lg font-medium">3D Model Preview</p>
            <p className="text-sm">Interactive visualization area</p>
            <p className="text-sm text-gray-400 mt-2">Rotate - Zoom - Pan</p>
          </div>
        </div>

        {/* View Controls */}
        <div className="flex gap-3 mb-6">
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
            Reset View
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
            Zoom In
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
            Zoom Out
          </button>
        </div>

        {/* Status Bar */}
        <div className="flex justify-between text-sm text-gray-600 bg-gray-50 p-4 rounded-md mb-6">
          <div>
            Performance: <span className="font-medium">60 FPS</span>
          </div>
          <div>
            Polygons: <span className="font-medium">0</span>
          </div>
          <div>
            Status: <span className="font-medium text-green-600">Ready</span>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleBackClick}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={handleNextClick}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Next: Export →
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 space-y-6">
        {/* Tissue Type Selection */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Tissue Type
          </h3>
          <div className="space-y-3">
            {(["bone", "skin", "muscle"] as TissueType[]).map((type) => (
              <label
                key={type}
                className="flex items-center gap-3 cursor-pointer p-3 rounded-md hover:bg-gray-50 transition-colors"
              >
                <input
                  type="radio"
                  name="tissue-type"
                  value={type}
                  checked={tissueType === type}
                  onChange={() => handleTissueChange(type)}
                  className="w-4 h-4 text-blue-500"
                />
                <span className="capitalize text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* File Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            File Info
          </h3>
          {fileInfo ? (
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <strong>File:</strong> {fileInfo.fileName}
              </p>
              <p>
                <strong>Slices:</strong> {fileInfo.fileCount}
              </p>
              <p>
                <strong>Dimensions:</strong> 512x512x{fileInfo.fileCount}
              </p>
              <p>
                <strong>Spacing:</strong> 0.5mm
              </p>
              <p>
                <strong>Size:</strong> {formatFileSize(fileInfo.fileSize)}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No file loaded</p>
          )}
        </div>

        {/* HU Threshold Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            HU Threshold Settings
          </h3>
          <label
            htmlFor="hu-threshold"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            HU Threshold
          </label>
          <input
            type="range"
            id="hu-threshold"
            min="-1024"
            max="3071"
            value={huThreshold}
            onChange={(e) => setHuThreshold(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="text-center mt-2 text-lg font-medium text-blue-600">
            {huThreshold} HU
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;
