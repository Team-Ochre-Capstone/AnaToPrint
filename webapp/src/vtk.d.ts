declare module "@kitware/vtk.js/Filters/General/ImageMarchingCubes" {
  import { vtkAlgorithm } from "@kitware/vtk.js/interfaces";

  export interface vtkImageMarchingCubes extends vtkAlgorithm {
    setContourValue(value: number): boolean;
    getContourValue(): number;
    setComputeNormals(compute: boolean): boolean;
    getComputeNormals(): boolean;
    setMergePoints(merge: boolean): boolean;
    getMergePoints(): boolean;
  }

  export interface vtkImageMarchingCubesInitialValues {
    contourValue?: number;
    computeNormals?: boolean;
    mergePoints?: boolean;
  }

  export function newInstance(
    initialValues?: vtkImageMarchingCubesInitialValues
  ): vtkImageMarchingCubes;

  export function extend(
    publicAPI: object,
    model: object,
    initialValues?: vtkImageMarchingCubesInitialValues
  ): void;

  const vtkImageMarchingCubes: {
    newInstance: typeof newInstance;
    extend: typeof extend;
  };

  export default vtkImageMarchingCubes;
}

declare module "@kitware/vtk.js/IO/Geometry/STLWriter" {
  import { vtkAlgorithm } from "@kitware/vtk.js/interfaces";

  export interface vtkSTLWriter extends vtkAlgorithm {
    setBinary(binary: boolean): boolean;
    getBinary(): boolean;
    getOutputData(): Uint8Array;
    write(data?: any): void;
  }

  export interface vtkSTLWriterInitialValues {
    binary?: boolean;
  }

  export function newInstance(
    initialValues?: vtkSTLWriterInitialValues
  ): vtkSTLWriter;

  export function extend(
    publicAPI: object,
    model: object,
    initialValues?: vtkSTLWriterInitialValues
  ): void;

  const vtkSTLWriter: {
    newInstance: typeof newInstance;
    extend: typeof extend;
  };

  export default vtkSTLWriter;
}

declare module "@kitware/vtk.js/Filters/General/WindowedSincPolyDataFilter" {
  import { vtkAlgorithm } from "@kitware/vtk.js/interfaces";

  export interface vtkWindowedSincPolyDataFilter extends vtkAlgorithm {
    setNumberOfIterations(iterations: number): boolean;
    getNumberOfIterations(): number;
    setPassBand(band: number): boolean;
    getPassBand(): number;
    setNonManifoldSmoothing(smooth: number): boolean;
    getNonManifoldSmoothing(): number;
    setFeatureEdgeSmoothing(smooth: number): boolean;
    getFeatureEdgeSmoothing(): number;
    setBoundarySmoothing(smooth: number): boolean;
    getBoundarySmoothing(): number;
    setNormalizeCoordinates(normalize: boolean): boolean;
    getNormalizeCoordinates(): boolean;
  }

  export interface vtkWindowedSincPolyDataFilterInitialValues {
    numberOfIterations?: number;
    passBand?: number;
    nonManifoldSmoothing?: number;
    featureEdgeSmoothing?: number;
    boundarySmoothing?: number;
    normalizeCoordinates?: boolean;
  }

  export function newInstance(
    initialValues?: vtkWindowedSincPolyDataFilterInitialValues
  ): vtkWindowedSincPolyDataFilter;

  export function extend(
    publicAPI: object,
    model: object,
    initialValues?: vtkWindowedSincPolyDataFilterInitialValues
  ): void;

  const vtkWindowedSincPolyDataFilter: {
    newInstance: typeof newInstance;
    extend: typeof extend;
  };

  export default vtkWindowedSincPolyDataFilter;
}

declare module "@kitware/vtk.js/Rendering/Core/Camera" {
  export interface vtkCamera {
    setPosition(x: number, y: number, z: number): void;
    setViewUp(x: number, y: number, z: number): void;
    setFocalPoint(x: number, y: number, z: number): void;
  }
  export default interface vtkCamera {}
}

declare module "@kitware/vtk.js/Rendering/Core/Renderer" {
  import { vtkCamera } from "@kitware/vtk.js/Rendering/Core/Camera";

  export interface vtkRenderer {
    addVolume(actor: any): void;
    resetCamera(): void;
    getActiveCamera(): vtkCamera;
  }
  export default interface vtkRenderer {}
}

declare module "@kitware/vtk.js/Rendering/Core/RenderWindow" {
  export interface vtkRenderWindow {
    render(): void;
  }
  export default interface vtkRenderWindow {}
}

declare module "@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow" {
  import { vtkRenderer } from "@kitware/vtk.js/Rendering/Core/Renderer";
  import { vtkRenderWindow } from "@kitware/vtk.js/Rendering/Core/RenderWindow";

  export interface vtkFullScreenRenderWindow {
    getRenderer(): vtkRenderer;
    getRenderWindow(): vtkRenderWindow;
    getInteractor(): any;
    delete(): void;
    setContainer(container: HTMLElement): void;
    resize(): void;
  }

  export interface vtkFullScreenRenderWindowInitialValues {
    container?: HTMLElement | null;
    background?: [number, number, number];
    listenWindowResize?: boolean;
  }

  export function newInstance(
    initialValues?: vtkFullScreenRenderWindowInitialValues
  ): vtkFullScreenRenderWindow;

  const vtkFullScreenRenderWindow: {
    newInstance: typeof newInstance;
  };

  export default vtkFullScreenRenderWindow;
}

declare module "@kitware/vtk.js/Rendering/Core/Volume" {
  import { vtkProp3D } from "@kitware/vtk.js/Rendering/Core/Prop3D";

  export interface vtkVolumeProperty {
    setRGBTransferFunction(index: number, func: any): void;
    setScalarOpacity(index: number, func: any): void;
    setInterpolationTypeToLinear(): void;
    setShade(shade: boolean): void;
    setAmbient(ambient: number): void;
    setDiffuse(diffuse: number): void;
    setSpecular(specular: number): void;
    setSpecularPower(power: number): void;
  }

  export interface vtkVolume {
    setMapper(mapper: any): boolean;
    getProperty(): vtkVolumeProperty;
  }

  export function newInstance(initialValues?: any): vtkVolume;

  const vtkVolume: {
    newInstance: typeof newInstance;
  };

  export default vtkVolume;
}

declare module "@kitware/vtk.js/Rendering/Core/VolumeMapper" {
  import { vtkAbstractMapper3D } from "@kitware/vtk.js/Rendering/Core/AbstractMapper3D";

  export interface vtkVolumeMapper {
    setInputData(data: any): void;
    setSampleDistance(distance: number): void;
  }

  export function newInstance(initialValues?: any): vtkVolumeMapper;

  const vtkVolumeMapper: {
    newInstance: typeof newInstance;
  };

  export default vtkVolumeMapper;
}

declare module "@kitware/vtk.js/Rendering/Core/ColorTransferFunction" {
  export interface vtkColorTransferFunction {
    addRGBPoint(x: number, r: number, g: number, b: number): number;
    removeAllPoints(): void;
  }

  export function newInstance(initialValues?: any): vtkColorTransferFunction;

  const vtkColorTransferFunction: {
    newInstance: typeof newInstance;
  };

  export default vtkColorTransferFunction;
}

declare module "@kitware/vtk.js/Common/DataModel/PiecewiseFunction" {
  export interface vtkPiecewiseFunction {
    addPoint(x: number, y: number): number;
    removeAllPoints(): void;
  }

  export function newInstance(initialValues?: any): vtkPiecewiseFunction;

  const vtkPiecewiseFunction: {
    newInstance: typeof newInstance;
  };

  export default vtkPiecewiseFunction;
}
