import { useEffect, useRef } from "react";
import { fabric } from 'fabric-with-gestures';

export const useEvent = (canvas:fabric.Canvas | null,isMobail: boolean, saveState: () => void) => {
  const isDraggingRef = useRef(false);
  const lastPosXRef = useRef(0);
  const lastPosYRef = useRef(0);

  const constrainViewport = () => {
    if (canvas) {
      const vpt = canvas.viewportTransform;
      if (vpt) {
        // X方向の制限
        if (vpt[4] > 0) vpt[4] = 0;  // 左端
        const maxX = canvas.width! - canvas.getWidth() * vpt[0];
        if (vpt[4] < maxX) vpt[4] = maxX;  // 右端

        // Y方向の制限
        if (vpt[5] > 0) vpt[5] = 0;  // 上端
        const maxY = canvas.height! - canvas.getHeight() * vpt[3];
        if (vpt[5] < maxY) vpt[5] = maxY;  // 下端

        // Canvasに変更を反映
        canvas.setViewportTransform(vpt);
      }
    }
  };

  const handleObjectMove = (e: fabric.IEvent) => {
    if(!canvas) return
    const obj = e.target;

    // Canvasの境界を取得
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();
    if (obj) {
      if (obj.left! < 0) {
        obj.left = 0;
      } else if (obj.left! + obj.width! > canvasWidth) {
        obj.left = canvasWidth - obj.width!;
      }

      if (obj.top! < 0) {
        obj.top = 0;
      } else if (obj.top! + obj.height! > canvasHeight) {
        obj.top = canvasHeight - obj.height!;
      }
    }
    // オブジェクトの位置を制限
  }

  const handleMouseMove = (opt: fabric.IEvent) => {
    if(!canvas) return
    if (isDraggingRef.current) {
      const vpt = canvas.viewportTransform;
      if (isMobail) {
        const touch = opt.e as TouchEvent
        if (vpt && lastPosXRef.current !== undefined && lastPosYRef.current !== undefined) {
          vpt[4] += touch.touches[0].clientX - lastPosXRef.current;
          vpt[5] += touch.touches[0].clientY - lastPosYRef.current;
          constrainViewport();
          canvas.requestRenderAll();
          lastPosXRef.current = touch.touches[0].clientX;
          lastPosYRef.current = touch.touches[0].clientY;
        }
      } else {
        const e = opt.e as MouseEvent;
        if (vpt && lastPosXRef.current !== undefined && lastPosYRef.current !== undefined) {
          vpt[4] += e.clientX - lastPosXRef.current;
          vpt[5] += e.clientY - lastPosYRef.current;
          constrainViewport();
          canvas.requestRenderAll();
          lastPosXRef.current = e.clientX;
          lastPosYRef.current = e.clientY;
        }
      }
    }
  };

  const handleMouseUp = (e: fabric.IEvent) => {
    if(!canvas) return
    const object = e.target as fabric.Textbox
    if (object) {
      object.selectable = true;
      canvas.setActiveObject(object)
      canvas.renderAll()
    }
    isDraggingRef.current = false
  };

  const handleSelectionClear = (e: fabric.IEvent) => {
    const objects = e.deselected as Array<fabric.Object>
    objects.map((obj) => {
      obj.selectable = false
    })
  }

  const handleMouseDown = (opt: fabric.IEvent) => {
    if(!canvas) return
    const activeObj = canvas.getActiveObject()
    if (!activeObj) {
      isDraggingRef.current = true
      if (isMobail) {
        const touch = opt.e as TouchEvent
        lastPosXRef.current = touch.touches[0].clientX;
        lastPosYRef.current = touch.touches[0].clientY;
      } else {
        const e = opt.e as MouseEvent
        lastPosXRef.current = e.clientX;
        lastPosYRef.current = e.clientY;
      }
    }
  }

  return {
    handleObjectMove,
    handleMouseMove,
    handleMouseUp,
    handleSelectionClear,
    handleMouseDown,
    constrainViewport
  }
}