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

    // オブジェクトのコーナー座標を取得
    const corners = obj.getCoords().map((corner, index) => ({ ...corner, index }));

    // 最も右、左、上、下のコーナーを見つける
    const rightMostPoint = corners.reduce((max, corner) => corner.x > max.x ? corner : max, corners[0]);
    const leftMostPoint = corners.reduce((min, corner) => corner.x < min.x ? corner : min, corners[0]);
    const topMostPoint = corners.reduce((min, corner) => corner.y < min.y ? corner : min, corners[0]);
    const bottomMostPoint = corners.reduce((max, corner) => corner.y > max.y ? corner : max, corners[0]);

    // 新しい位置を計算
    let newLeft = obj.left as number;
    let newTop = obj.top as number;

    // 左右の制限
    if (rightMostPoint.x >= canvasWidth) { //右の制限
      if (rightMostPoint.index === 0) {
        newLeft = Math.min(newLeft, canvasWidth);
      } else if (rightMostPoint.index === 1 || rightMostPoint.index === 2) {
        newLeft = Math.min(newLeft, canvasWidth - (rightMostPoint.x - corners[0].x));
      } else if (rightMostPoint.index === 3) {
        newLeft = Math.min(newLeft, corners[0].x);
      }
    } else if (leftMostPoint.x <= 0) { //左の制限
      if (leftMostPoint.index === 0) {
        newLeft = Math.max(0, Math.min(newLeft, canvasWidth - (rightMostPoint.x - leftMostPoint.x)));
      } else if (leftMostPoint.index === 1 || leftMostPoint.index === 2) {
        newLeft = Math.max(newLeft, corners[0].x);
      } else if (leftMostPoint.index === 3) {
        newLeft = Math.max(corners[0].x, Math.min(newLeft, canvasWidth - (rightMostPoint.x - leftMostPoint.x)));
      }
    }

    // 上下の制限
    if (bottomMostPoint.y >= canvasHeight) { // 下の制限
      if (bottomMostPoint.index === 0) {
        newTop = Math.min(newTop, canvasHeight);
      } else if (bottomMostPoint.index === 1 || bottomMostPoint.index === 2) {
        newTop = Math.min(newTop, canvasHeight - (bottomMostPoint.y - corners[0].y));
      } else if (bottomMostPoint.index === 3) {
        newTop = Math.min(newTop, corners[0].y);
      }
    } else if (topMostPoint.y <= 0) { // 上の制限
      if (topMostPoint.index === 0) {
        newTop = Math.max(0, Math.min(newTop, canvasHeight - (bottomMostPoint.y - topMostPoint.y)));
      } else if (topMostPoint.index === 1 || topMostPoint.index === 2) {
        newTop = Math.max(newTop, corners[0].y);
      } else if (topMostPoint.index === 3) {
        newTop = Math.max(corners[0].y, Math.min(newTop, canvasHeight - (bottomMostPoint.y - topMostPoint.y)));
      }
    }

    // 新しい位置を設定
    obj.set({ left: newLeft, top: newTop });
    obj.setCoords(); // 座標の再計算
    canvas.renderAll(); // キャンバスを再描画
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


    // スケーリングと位置調整を行う関数
    const adjustScaleAndPosition = (scaleX: number, scaleY: number, left: number, top: number) => {
      obj.set({ scaleX, scaleY, left, top });
      obj.setCoords();
      const boundingRect = obj.getBoundingRect(true);

      // キャンバス内に収まるようにスケールと位置を調整
      if (boundingRect.left < 0) {
        left -= boundingRect.left;
      }
      if (boundingRect.top < 0) {
        top -= boundingRect.top;
      }
      if (boundingRect.left + boundingRect.width > canvasWidth) {
        const overflowX = boundingRect.left + boundingRect.width - canvasWidth;
        scaleX = Math.max(0.1, scaleX - (overflowX / obj.width!));
        left -= overflowX / 2;
      }
      if (boundingRect.top + boundingRect.height > canvasHeight) {
        const overflowY = boundingRect.top + boundingRect.height - canvasHeight;
        scaleY = Math.max(0.1, scaleY - (overflowY / obj.height!));
        top -= overflowY / 2;
      }

      return { scaleX, scaleY, left, top };
    };

    // 初期値を設定
    let { scaleX, scaleY, left, top } = {
      scaleX: obj.scaleX!,
      scaleY: obj.scaleY!,
      left: obj.left!,
      top: obj.top!
    };

    // スケーリングと位置調整を繰り返し適用（最大10回）
    for (let i = 0; i < 10; i++) {
      const result = adjustScaleAndPosition(scaleX, scaleY, left, top);
      if (result.scaleX === scaleX && result.scaleY === scaleY &&
        result.left === left && result.top === top) {
        break; // 変更がなければループを抜ける
      }
      ({ scaleX, scaleY, left, top } = result);
    }

    // 最終的な値を設定
    obj.set({ scaleX, scaleY, left, top });
    obj.setCoords();

    // 現在のスケールを保存
    obj.lastScaleX = scaleX;
    obj.lastScaleY = scaleY;

    // キャンバスを再描画
    canvas.renderAll();
  };

  /**
   * オブジェクトローテーションイベント
   // TODO 全然動かない
   * @param e
   * @returns
   */
  const handleObjectRotation = (e: fabric.IEvent<Event>) => {
    if (!canvas) return;
    const obj = e.target as fabric.Object;
    if (!obj) return;

    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();

    // 現在の角度と位置を記録
    const currentAngle = obj.angle!;
    const currentLeft = obj.left!;
    const currentTop = obj.top!;

    // コーナーがキャンバス内にあるかチェックする関数
    const isCornerWithinCanvas = (corner: fabric.Point) => {
        return corner.x >= 0 && corner.x <= canvasWidth && corner.y >= 0 && corner.y <= canvasHeight;
    };

    // オブジェクトがキャンバス内にあるかチェックする関数
    const isObjectWithinCanvas = () => {
        const corners = obj.getCoords();
        return corners.every(isCornerWithinCanvas);
    };

    // はみ出ない最大角度を求める関数（より精密な方法）
    const findMaxAngle = (startAngle: number, direction: number) => {
        let low = startAngle;
        let high = startAngle + 360 * direction;
        let maxAngle = startAngle;

        while (Math.abs(high - low) > 0.1) {
            const mid = (low + high) / 2;
            obj.set({ angle: mid, left: currentLeft, top: currentTop });
            obj.setCoords();

            if (isObjectWithinCanvas()) {
                maxAngle = mid;
                low = mid;
            } else {
                high = mid;
            }
        }

        return maxAngle;
    };

    // 新しい角度を取得
    let newAngle = obj.angle!;

    // 回転方向を決定
    const rotationDirection = Math.sign(newAngle - currentAngle);

    // はみ出ない最大角度を求める
    const maxAngle = findMaxAngle(currentAngle, rotationDirection);

    // 新しい角度が最大角度を超えている場合、最大角度に制限する
    if (rotationDirection > 0 && newAngle > maxAngle) {
        newAngle = maxAngle;
    } else if (rotationDirection < 0 && newAngle < maxAngle) {
        newAngle = maxAngle;
    }

    // 最終的な角度を設定（位置は元の位置に固定）
    obj.set({
        angle: newAngle,
        left: currentLeft,
        top: currentTop
    });
    obj.setCoords();
    canvas.renderAll();

    console.log(`Max Angle: ${maxAngle}, New Angle: ${newAngle}`);
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
    handleObjectRotation,
    handleObjectAdded,
    handleMouseMove,
    handleMouseUp,
    handleSelectionClear,
    handleMouseDown,
    constrainViewport,
  }
}