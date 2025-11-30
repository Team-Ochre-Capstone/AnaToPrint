import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExportFormat } from "../types";

const ExportPage = () => {
  const navigate = useNavigate();
  const [exportFormat, setExportFormat] = useState<ExportFormat>("stl");
  const [filename, setFilename] = useState("ct_scan_bone_model");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!filename.trim()) {
      alert("Please enter a filename");
      return;
    }

    setIsExporting(true);

    try {
      // Simulate export process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real implementation, this would:
      // 1. Process the DICOM data with vtk.js
      // 2. Generate STL or G-code
      // 3. Trigger browser download

      const fullFilename = `${filename}.${exportFormat}`;
      alert(
        `Export complete! File: ${fullFilename}\n\nIn a production app, the file would download now.`
      );
    } catch (error) {
      alert("Export failed. Please try again.");
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleBack = () => {
    navigate("/preview");
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-semibold mb-2 text-gray-800">
          Export 3D Model
        </h2>
        <p className="text-gray-600 mb-8">
          Choose output format and save location
        </p>

        {/* Output Format Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Output Format
          </label>
          <div className="space-y-3">
            <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="export-format"
                value="stl"
                checked={exportFormat === "stl"}
                onChange={() => setExportFormat("stl")}
                className="mt-1 w-4 h-4 text-blue-500"
              />
              <div>
                <div className="font-medium text-gray-800">STL File</div>
                <div className="text-sm text-gray-600">
                  Standard 3D mesh format for 3D printing and CAD software
                </div>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="export-format"
                value="gcode"
                checked={exportFormat === "gcode"}
                onChange={() => setExportFormat("gcode")}
                className="mt-1 w-4 h-4 text-blue-500"
              />
              <div>
                <div className="font-medium text-gray-800">G-code</div>
                <div className="text-sm text-gray-600">
                  Direct 3D printer instructions with density information
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Filename Input */}
        <div className="mb-6">
          <label
            htmlFor="filename"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Output Filename
          </label>
          <input
            type="text"
            id="filename"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Enter filename"
          />
          <p className="mt-1 text-sm text-gray-500">
            Extension will be added automatically (.{exportFormat})
          </p>
        </div>

        {/* Save Location */}
        <div className="mb-8">
          <label
            htmlFor="save-location"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Save Location
          </label>
          <input
            type="text"
            id="save-location"
            value="/Downloads"
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
          />
          <p className="mt-1 text-sm text-gray-500">
            Browser default download location will be used
          </p>
        </div>

        {/* Export Summary */}
        <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Export Summary
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>
              <strong>Tissue Type:</strong> Bone
            </p>
            <p>
              <strong>Format:</strong> {exportFormat.toUpperCase()}
            </p>
            <p>
              <strong>Estimated Size:</strong> ~45 MB
            </p>
            <p>
              <strong>Processing Time:</strong> ~30 seconds
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleBack}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            disabled={isExporting}
          >
            Back
          </button>
          <button
            onClick={handleCancel}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            disabled={isExporting}
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isExporting ? "Processing..." : "Generate & Download"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportPage;
