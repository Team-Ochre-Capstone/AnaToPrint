import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ExportProgressModal from "../ExportProgressModal";

describe("ExportProgressModal", () => {
  const defaultProps = {
    isOpen: true,
    stage: null,
    metrics: {},
    onClose: vi.fn(),
  };

  it("should not render when isOpen is false", () => {
    render(<ExportProgressModal {...defaultProps} isOpen={false} />);
    const modal = screen.queryByText("Processing 3D Model");
    expect(modal).not.toBeInTheDocument();
  });

  it("should render correct label for marching-cubes stage", () => {
    render(<ExportProgressModal {...defaultProps} stage="marching-cubes" />);
    expect(screen.getByText("Extracting surface mesh...")).toBeInTheDocument();
    expect(screen.getByText("30%")).toBeInTheDocument();
  });

  it("should render correct label for complete stage", () => {
    render(<ExportProgressModal {...defaultProps} stage="complete" />);
    expect(screen.getByText("Export complete!")).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("should display metrics when provided", () => {
    const metrics = {
      marchingCubesTime: 150,
      polygonCount: 5000,
    };

    render(<ExportProgressModal {...defaultProps} metrics={metrics} />);

    expect(screen.getByText("Marching Cubes:")).toBeInTheDocument();
  });
});
