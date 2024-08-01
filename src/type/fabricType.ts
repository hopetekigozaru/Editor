import { Dispatch, MouseEvent, SetStateAction } from "react";

export interface BubbleMenuProps {
  canvas: fabric.Canvas | null;
  saveState: () => void;
  bubbleRef: React.RefObject<HTMLDivElement>;
  selectObject: boolean
  bubbleMenuPosition: {
    left: number | undefined;
    top: number | undefined;
  }
}

export interface DeleteBtnProps {
  canvas: fabric.Canvas | null;
  saveState: () => void;
}

export interface ExpansionBtnsProps {
  canvas: fabric.Canvas | null
  constrainViewport: () => void
  isMobile : boolean
}

export interface PanningBtnProps {
  canvas: fabric.Canvas | null
  constrainViewport: () => void;
  isPan: boolean
  setIsPan: Dispatch<SetStateAction<boolean>>
  setIsZoom: Dispatch<SetStateAction<boolean>>
  isMobile :boolean
}

export interface ZoomBtnProps {
  canvas: fabric.Canvas | null
  constrainViewport: () => void
  isZoom: boolean
  setIsZoom: Dispatch<SetStateAction<boolean>>
  setIsPan: Dispatch<SetStateAction<boolean>>
  isMobile :boolean
}

export interface AddFileProps {
  canvas: fabric.Canvas | null;
  saveState: () => void;
  clickInput: (e: MouseEvent<HTMLButtonElement>) => void
}

export interface AddTextProps {
  canvas: fabric.Canvas | null;
  saveState: () => void;
}

export interface DefaultMenuProps {
  canvas: fabric.Canvas | null;
  gridLines: fabric.Line[];
  setGridLines: React.Dispatch<React.SetStateAction<fabric.Line[]>>;
  containerElm: HTMLDivElement | null;
  drawGrid: (canvas: fabric.Canvas) => void;
  undoStack: string[];
  setUndoStack: React.Dispatch<React.SetStateAction<string[]>>;
  continuous: boolean;
  setContinuous: React.Dispatch<React.SetStateAction<boolean>>;
  redoStack: string[];
  setRedoStack: React.Dispatch<React.SetStateAction<string[]>>;
  saveState: () => void;
  clickInput: (e: MouseEvent<HTMLButtonElement>) => void;
  keep: {
    uuid: string;
    title: string
    fabric_object: fabric.Object | null; // fabric_objectがnullになる可能性も考慮
    width: number;
    height: number;
  } | null;
  isMobile: boolean
  addToStack: (stack: string[], item: string) => string[]
  restoreGridProperties: (canvas: fabric.Canvas) => void
}

export interface exportImageBtnProps {
  canvas: fabric.Canvas | null;
  gridLines: fabric.Line[];
  setGridLines: React.Dispatch<React.SetStateAction<fabric.Line[]>>;
  drawGrid: (canvas: fabric.Canvas) => void;
}

export interface exportPdfBtnProps {
  canvas: fabric.Canvas | null;
  gridLines: fabric.Line[];
  setGridLines: React.Dispatch<React.SetStateAction<fabric.Line[]>>;
  containerElm: HTMLDivElement | null;
  drawGrid: (canvas: fabric.Canvas) => void;
}

export interface UndoBtnProps {
  canvas: fabric.Canvas | null;
  undoStack: string[];
  setUndoStack: React.Dispatch<React.SetStateAction<string[]>>;
  continuous: boolean;
  setContinuous: React.Dispatch<React.SetStateAction<boolean>>;
  setRedoStack: React.Dispatch<React.SetStateAction<string[]>>;
  isMobile : boolean
  addToStack: (stack: string[], item: string) => string[]
  restoreGridProperties: (canvas: fabric.Canvas) => void
}

export interface RedoBtnProps {
  canvas: fabric.Canvas | null;
  redoStack: string[];
  setUndoStack: React.Dispatch<React.SetStateAction<string[]>>;
  setRedoStack: React.Dispatch<React.SetStateAction<string[]>>;
  isMobile : boolean
  addToStack:(stack: string[], item: string) => string[]
  restoreGridProperties:(canvas:fabric.Canvas) => void
}

export interface SaveBtnProps {
  canvas: fabric.Canvas | null;
  gridLines: fabric.Line[];
  setGridLines: React.Dispatch<React.SetStateAction<fabric.Line[]>>;
  keep: {
    uuid: string;
    title: string
    fabric_object: fabric.Object | null; // fabric_objectがnullになる可能性も考慮
    width: number;
    height: number;
  } | null;
  isMobile:boolean
}

export interface BackBtnProps {
  setIsFontSize: React.Dispatch<React.SetStateAction<boolean>>
}

export interface ChangeFontSizeSliderProps {
  canvas: fabric.Canvas | null;
  saveState: () => void;
}

export interface FontSizeMenuProps {
  canvas: fabric.Canvas | null;
  saveState: () => void;
  setIsFontSize: React.Dispatch<React.SetStateAction<boolean>>
}

export interface ChangeFontSizeSliderMbProps {
  canvas: fabric.Canvas | null;
  saveState: () => void;
}

export interface ChangeColorBtnProps {
  canvas: fabric.Canvas | null;
  clickInput: (e: MouseEvent<HTMLButtonElement>) => void
  saveState: () => void;
}

export interface ChangeColorBtnMbProps {
  canvas: fabric.Canvas | null;
  clickInput: (e: MouseEvent<HTMLButtonElement>) => void
  saveState: () => void;
}

export interface ChangeFontBtnProps {
  canvas: fabric.Canvas | null;
  saveState: () => void;
}

export interface ChangeFontBtnMbProps {
  canvas: fabric.Canvas | null;
  saveState: () => void;
}

export interface ChangeFontSizeBtnProps {
  setIsFontSize: React.Dispatch<React.SetStateAction<boolean>>
}

export interface TextMenuProps {
  canvas: fabric.Canvas | null;
  saveState: () => void;
  clickInput: (e: MouseEvent<HTMLButtonElement>) => void
  setIsFontSize: React.Dispatch<React.SetStateAction<boolean>>
  isMobile: boolean
}

export interface MenuProps {
  canvas: fabric.Canvas | null;
  undoStack: string[];
  setUndoStack: React.Dispatch<React.SetStateAction<string[]>>;
  redoStack: string[];
  setRedoStack: React.Dispatch<React.SetStateAction<string[]>>;
  continuous: boolean;
  setContinuous: React.Dispatch<React.SetStateAction<boolean>>;
  saveState: () => void;
  containerElm: HTMLDivElement | null;
  canvasElm: HTMLCanvasElement | null;
  bubbleElm: HTMLDivElement | null;
  setBubbleMenuPosition: React.Dispatch<React.SetStateAction<{
    left: number | undefined;
    top: number | undefined;
  }>>;
  setSelectObject: React.Dispatch<React.SetStateAction<boolean>>;
  selectObject: boolean;
  gridLines: fabric.Line[];
  setGridLines: React.Dispatch<React.SetStateAction<fabric.Line[]>>;
  drawGrid: (canvas: fabric.Canvas) => void;
  keep: {
    uuid: string;
    title: string
    fabric_object: fabric.Object | null; // fabric_objectがnullになる可能性も考慮
    width: number;
    height: number;
  } | null;
  isMobile: boolean
  MAX_HISTORY: number,
  addToStack: (stack: string[], item: string) => string[]
  restoreGridProperties: (canvas: fabric.Canvas) => void
}

export interface EditorProps {
  aspectRatio: number;
  keep: {
    uuid: string;
    title: string;
    fabric_object: fabric.Object | null; // fabric_objectがnullになる可能性も考慮
    width: number;
    height: number;
  } | null;
}

export interface keep {
  uuid: string;
  title: string;
  fabric_object: fabric.Object | null; // fabric_objectがnullになる可能性も考慮
  width: number;
  height: number;
}

// カスタムインターフェースを定義
export interface CustomFabricObject extends fabric.Object {
  lastScaleX?: number;
  lastScaleY?: number;
}

export interface CustomLineOptions extends fabric.ILineOptions {
  isGrid?: boolean;
}