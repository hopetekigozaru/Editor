import { useRef } from "react";
import { fabric } from 'fabric-with-gestures';
import { CustomFabricObject } from "@/type/fabricType";

export const useEvent = (canvas: fabric.Canvas | null, isMobile: boolean) => {
  const isDraggingRef = useRef(false);
  const lastPosXRef = useRef(0);
  const lastPosYRef = useRef(0);

  /**
   * Canvas内のビューポートの制限
   */
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

  /**
  // TODO オブジェクトを回転させ時の制限領域Fix
   * オブジェクト移動イベント
   * @param e
   * @returns
   */
  const handleObjectMoving = (e: fabric.IEvent) => {
    if (!canvas) return;
    const obj = e.target as fabric.Object;
    if (!obj) return;

    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();

    // オブジェクトの現在の位置、サイズ、回転を取得
    const angle = obj.angle || 0;
    const width = obj.getScaledWidth();
    const height = obj.getScaledHeight();

    // 回転を考慮したバウンディングボックスを計算
    const boundingRect = obj.getBoundingRect(true);
    const boundWidth = boundingRect.width;
    const boundHeight = boundingRect.height;

    // オブジェクトの中心からの左右、上下のオフセットを計算
    const offsetX = (boundWidth - width) / 2;
    const offsetY = (boundHeight - height) / 2;

    // 新しい位置を計算
    let left = obj.left as number;
    let top = obj.top as number;

    // 左右の制限
    const minLeft = offsetX;
    const maxLeft = canvasWidth - (boundWidth - offsetX);
    left = Math.min(Math.max(left, minLeft), maxLeft);

    // 上下の制限
    const minTop = offsetY;
    const maxTop = canvasHeight - (boundHeight - offsetY);
    top = Math.min(Math.max(top, minTop), maxTop);

    // 新しい位置をセット
    obj.set({ left, top });
  };

  /**
   * オブジェクトスケーリングイベント
   * @param e
   * @returns
   */
  const handleObjectScaling = (e: fabric.IEvent) => {
    if (!canvas) return;

    const obj = e.target as CustomFabricObject;
    if (!obj) return;

    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();

    // オブジェクトの現在のバウンディングボックスを取得
    const boundingRect = obj.getBoundingRect(true);

    // スケーリングの方向を判断
    const scalingX = obj.scaleX! > (obj.lastScaleX ?? obj.scaleX!);
    const scalingY = obj.scaleY! > (obj.lastScaleY ?? obj.scaleY!);

    let scaleX = obj.scaleX!;
    let scaleY = obj.scaleY!;

    // 左端の制限
    if (boundingRect.left < 0 && scalingX) {
      scaleX = obj.lastScaleX ?? obj.scaleX!;
    } else if (boundingRect.left + boundingRect.width > canvasWidth && scalingX) {
      scaleX = obj.lastScaleX ?? obj.scaleX!;
    }

    // 上端の制限
    if (boundingRect.top < 0 && scalingY) {
      scaleY = obj.lastScaleY ?? obj.scaleY!;
    } else if (boundingRect.top + boundingRect.height > canvasHeight && scalingY) {
      scaleY = obj.lastScaleY ?? obj.scaleY!;
    }

    // 新しいスケールをセット
    obj.set({ scaleX, scaleY });

    // 現在のスケールを保存
    obj.lastScaleX = scaleX;
    obj.lastScaleY = scaleY;

    // オブジェクトの座標を更新
    obj.setCoords();
    handleObjectMoving(e)

    // キャンバスを再描画
    canvas.renderAll();
  };

  /**
   * オブジェクトが追加されたときに初期スケールを設定
   * @param e
   */
  const handleObjectAdded = (e: fabric.IEvent) => {
    const obj = e.target as CustomFabricObject;
    if (obj) {
      obj.lastScaleX = obj.scaleX;
      obj.lastScaleY = obj.scaleY;
    }
  };

  /**
   * マウス移動イベント
   * @param opt
   * @returns
   */
  const handleMouseMove = (opt: fabric.IEvent) => {
    if (!canvas) return
    if (isDraggingRef.current) {
      const vpt = canvas.viewportTransform;
      if (isMobile) {
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

  /**
   * マウスアップイベント
   * @param e
   * @returns
   */
  const handleMouseUp = (e: fabric.IEvent) => {
    if (!canvas) return
    const object = e.target as fabric.Textbox
    if (object) {
      object.selectable = true;
      canvas.setActiveObject(object)
      canvas.renderAll()
    }
    isDraggingRef.current = false
  };


  /**
   * マウスダウンイベント
   * @param opt
   * @returns
   */
  const handleMouseDown = (opt: fabric.IEvent) => {
    if (!canvas) return
    const activeObj = canvas.getActiveObject()
    if (!activeObj) {
      isDraggingRef.current = true
      if (isMobile) {
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


  /**
 * オブジェクトの選択状態解除イベント
 * @param e
 */
  const handleSelectionClear = (e: fabric.IEvent) => {
    const objects = e.deselected as Array<fabric.Object>
    if (objects) {
      objects.map((obj) => {
        obj.selectable = false
      })
    }
  }

  return {
    handleObjectMoving,
    handleObjectScaling,
    handleObjectAdded,
    handleMouseMove,
    handleMouseUp,
    handleSelectionClear,
    handleMouseDown,
    constrainViewport,
  }
}