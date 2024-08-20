import { useRef } from "react";
import { fabric } from 'fabric-with-gestures';
import { CustomFabricObject } from "@/type/fabricType";


/**
 * Fabric.jsのイベントハンドリングを行うカスタムフック
 * @param canvas - Fabric.jsのキャンバスオブジェクト
 * @param isMobile - デバイスがモバイルであるかどうかを示すフラグ
 * @returns 各種イベントハンドラとビュー制約関数を返す
 */
export const useEvent = (canvas: fabric.Canvas | null, isMobile: boolean) => {
  // ドラッグ状態を管理するフラグ
  const isDraggingRef = useRef(false);
  // 最後に取得したX座標を格納
  const lastPosXRef = useRef(0);
  // 最後に取得したY座標を格納
  const lastPosYRef = useRef(0);


  /**
   * オブジェクトがCanvasに追加されたときに呼ばれるイベントハンドラです。
   * この関数は、新しく追加されたオブジェクトのスケールを初期値として保存します。
   * @param e - fabric.jsのイベントオブジェクト。追加されたオブジェクトの情報が含まれています。
   */
  const handleObjectAdded = (e: fabric.IEvent) => {
    // イベントから追加されたオブジェクトを取得します。
    const obj = e.target as CustomFabricObject;

    // オブジェクトが存在する場合のみ処理を行います。
    if (obj) {
      // 現在のX方向のスケールを保存します。
      // これは、オブジェクトがスケール変更前に持っていたX方向のサイズです。
      obj.lastScaleX = obj.scaleX;

      // 現在のY方向のスケールを保存します。
      // これは、オブジェクトがスケール変更前に持っていたY方向のサイズです。
      obj.lastScaleY = obj.scaleY;
    }
  };


  /**
  * Canvas内の表示領域を制限するための関数です。
  * この関数は、Canvasの表示領域がキャンバスの境界内に収まるように調整します。
  */
  const constrainViewport = () => {
    // Canvasが存在する場合のみ処理を行います。
    if (canvas) {
      // 現在のビューポートの変換行列を取得します。
      const vpt = canvas.viewportTransform;

      // ビューポートの変換行列が存在する場合のみ処理を行います。
      if (vpt) {
        // X方向の制限を設定します。
        // ビューポートの左端がキャンバスの左端を超えないように調整します。
        if (vpt[4] > 0) vpt[4] = 0;  // 左端

        // ビューポートの右端がキャンバスの右端を超えないように調整します。
        const maxX = canvas.width! - canvas.getWidth() * vpt[0];
        if (vpt[4] < maxX) vpt[4] = maxX;  // 右端

        // Y方向の制限を設定します。
        // ビューポートの上端がキャンバスの上端を超えないように調整します。
        if (vpt[5] > 0) vpt[5] = 0;  // 上端

        // ビューポートの下端がキャンバスの下端を超えないように調整します。
        const maxY = canvas.height! - canvas.getHeight() * vpt[3];
        if (vpt[5] < maxY) vpt[5] = maxY;  // 下端

        // 調整されたビューポートの変換行列をCanvasに適用します。
        canvas.setViewportTransform(vpt);
      }
    }
  };




  /**
  * Fabricオブジェクトが移動する際に、Canvas領域外に出ないように制限する関数です。
  * この関数は、オブジェクトがCanvasの境界を超えないように移動位置を調整します。
  * @param e - 移動イベントの情報
  * @returns なし
  */
  const handleObjectMoving = (e: fabric.IEvent) => {
    // Canvasが存在しない場合は処理を終了します。
    if (!canvas) return;

    // 移動中のオブジェクトを取得します。
    const obj = e.target as fabric.Object;
    if (!obj) return;

    const canvasWidth = canvas.getWidth(); // Canvasの幅を取得
    const canvasHeight = canvas.getHeight(); // Canvasの高さを取得

    // オブジェクトのコーナー座標を取得し、コーナーごとにインデックスを付与します。
    const corners = obj.getCoords().map((corner, index) => ({ ...corner, index }));

    // コーナー座標から最も右、左、上、下の点を求めます。
    const rightMostPoint = corners.reduce((max, corner) => corner.x > max.x ? corner : max, corners[0]);
    const leftMostPoint = corners.reduce((min, corner) => corner.x < min.x ? corner : min, corners[0]);
    const topMostPoint = corners.reduce((min, corner) => corner.y < min.y ? corner : min, corners[0]);
    const bottomMostPoint = corners.reduce((max, corner) => corner.y > max.y ? corner : max, corners[0]);

    // 新しい位置を計算します。
    let newLeft = obj.left as number;
    let newTop = obj.top as number;

    // X方向の制限を設定します。
    // オブジェクトの右端がCanvasの右端を超えないように調整します。
    if (rightMostPoint.x >= canvasWidth) {
      if (rightMostPoint.index === 0) {
        newLeft = Math.min(newLeft, canvasWidth);
      } else if (rightMostPoint.index === 1 || rightMostPoint.index === 2) {
        newLeft = Math.min(newLeft, canvasWidth - (rightMostPoint.x - corners[0].x));
      } else if (rightMostPoint.index === 3) {
        newLeft = Math.min(newLeft, corners[0].x);
      }
    } else if (leftMostPoint.x <= 0) {
      if (leftMostPoint.index === 0) {
        newLeft = Math.max(0, Math.min(newLeft, canvasWidth - (rightMostPoint.x - leftMostPoint.x)));
      } else if (leftMostPoint.index === 1 || leftMostPoint.index === 2) {
        newLeft = Math.max(newLeft, corners[0].x);
      } else if (leftMostPoint.index === 3) {
        newLeft = Math.max(corners[0].x, Math.min(newLeft, canvasWidth - (rightMostPoint.x - leftMostPoint.x)));
      }
    }

    // Y方向の制限を設定します。
    // オブジェクトの下端がCanvasの下端を超えないように調整します。
    if (bottomMostPoint.y >= canvasHeight) {
      if (bottomMostPoint.index === 0) {
        newTop = Math.min(newTop, canvasHeight);
      } else if (bottomMostPoint.index === 1 || bottomMostPoint.index === 2) {
        newTop = Math.min(newTop, canvasHeight - (bottomMostPoint.y - corners[0].y));
      } else if (bottomMostPoint.index === 3) {
        newTop = Math.min(newTop, corners[0].y);
      }
    } else if (topMostPoint.y <= 0) {
      if (topMostPoint.index === 0) {
        newTop = Math.max(0, Math.min(newTop, canvasHeight - (bottomMostPoint.y - topMostPoint.y)));
      } else if (topMostPoint.index === 1 || topMostPoint.index === 2) {
        newTop = Math.max(newTop, corners[0].y);
      } else if (topMostPoint.index === 3) {
        newTop = Math.max(corners[0].y, Math.min(newTop, canvasHeight - (bottomMostPoint.y - topMostPoint.y)));
      }
    }

    // 新しい位置をオブジェクトに設定します。
    obj.set({ left: newLeft, top: newTop });
    obj.setCoords(); // 座標を再計算します。
    canvas.renderAll(); // Canvasを再描画します。
  };


  /**
  * Fabricオブジェクトをスケーリングする際に、Canvas領域外に出ないように制限する関数です。
  * スケーリング中にオブジェクトがCanvasの境界を超えないように、スケールと位置を調整します。
  * @param e - スケーリングイベントの情報
  * @returns なし
  */
  const handleObjectScaling = (e: fabric.IEvent) => {
    // Canvasが存在しない場合は処理を終了します。
    if (!canvas) return;

    // スケーリング対象のオブジェクトを取得します。
    const obj = e.target as CustomFabricObject;
    if (!obj) return;

    const canvasWidth = canvas.getWidth(); // Canvasの幅を取得
    const canvasHeight = canvas.getHeight(); // Canvasの高さを取得

    /**
     * スケーリングと位置調整を行う関数です。
     * @param scaleX - X方向のスケール
     * @param scaleY - Y方向のスケール
     * @param left - オブジェクトの左端の位置
     * @param top - オブジェクトの上端の位置
     * @returns - 調整後のスケールと位置
     */
    const adjustScaleAndPosition = (scaleX: number, scaleY: number, left: number, top: number) => {
      obj.set({ scaleX, scaleY, left, top });
      obj.setCoords(); // 座標を再計算します。
      const boundingRect = obj.getBoundingRect(true); // オブジェクトのバウンディングボックスを取得

      // Canvas内に収まるようにスケールと位置を調整します。
      if (boundingRect.left < 0) {
        left -= boundingRect.left; // 左端がCanvasの左端より左に出ないように調整
      }
      if (boundingRect.top < 0) {
        top -= boundingRect.top; // 上端がCanvasの上端より上に出ないように調整
      }
      if (boundingRect.left + boundingRect.width > canvasWidth) {
        const overflowX = boundingRect.left + boundingRect.width - canvasWidth;
        scaleX = Math.max(0.1, scaleX - (overflowX / obj.width!)); // スケールを調整してCanvas内に収める
        left -= overflowX / 2; // 左右のオフセットを調整
      }
      if (boundingRect.top + boundingRect.height > canvasHeight) {
        const overflowY = boundingRect.top + boundingRect.height - canvasHeight;
        scaleY = Math.max(0.1, scaleY - (overflowY / obj.height!)); // スケールを調整してCanvas内に収める
        top -= overflowY / 2; // 上下のオフセットを調整
      }

      return { scaleX, scaleY, left, top }; // 調整後のスケールと位置を返します
    };

    // 初期のスケールと位置を設定します。
    let { scaleX, scaleY, left, top } = {
      scaleX: obj.scaleX!,
      scaleY: obj.scaleY!,
      left: obj.left!,
      top: obj.top!
    };

    // スケーリングと位置調整を最大10回繰り返します。
    for (let i = 0; i < 10; i++) {
      const result = adjustScaleAndPosition(scaleX, scaleY, left, top);
      // 調整結果が変わらなければループを終了します。
      if (result.scaleX === scaleX && result.scaleY === scaleY &&
        result.left === left && result.top === top) {
        break;
      }
      // 調整後のスケールと位置を更新します。
      ({ scaleX, scaleY, left, top } = result);
    }

    // 最終的なスケールと位置をオブジェクトに設定します。
    obj.set({ scaleX, scaleY, left, top });
    obj.setCoords(); // 座標を再計算します。

    // 現在のスケールを保存します。
    obj.lastScaleX = scaleX;
    obj.lastScaleY = scaleY;

    // Canvasを再描画します。
    canvas.renderAll();
  };





  /**
 * Fabricオブジェクトをローテーションする際に、Canvas領域外に出ないように制限する関数です。
 * 現在のローテーション角度を元に、オブジェクトがキャンバス領域内に収まる最大の角度を計算し、その角度に制限します。
 * @param e - ローテーションイベントの情報
 * @returns なし
 */
  const handleObjectRotation = (e: fabric.IEvent<Event>) => {
    // Canvasが存在しない場合は処理を終了します。
    if (!canvas) return;

    // ローテーション対象のオブジェクトを取得します。
    const obj = e.target as fabric.Object;
    if (!obj) return;

    const canvasWidth = canvas.getWidth(); // Canvasの幅を取得
    const canvasHeight = canvas.getHeight(); // Canvasの高さを取得

    // 現在の角度と位置を記録します。
    const currentAngle = obj.angle!;
    const currentLeft = obj.left!;
    const currentTop = obj.top!;

    /**
     * 指定したコーナーがキャンバス内に収まっているかをチェックする関数です。
     * @param corner - コーナーの位置を示すfabric.Point
     * @returns - コーナーがキャンバス内に収まっている場合はtrue、それ以外はfalse
     */
    const isCornerWithinCanvas = (corner: fabric.Point) => {
      return corner.x >= 0 && corner.x <= canvasWidth && corner.y >= 0 && corner.y <= canvasHeight;
    };

    /**
     * オブジェクト全体がキャンバス内に収まっているかをチェックする関数です。
     * @returns - オブジェクトがキャンバス内に収まっている場合はtrue、それ以外はfalse
     */
    const isObjectWithinCanvas = () => {
      const corners = obj.getCoords(); // オブジェクトのコーナー座標を取得
      return corners.every(isCornerWithinCanvas); // 全てのコーナーがキャンバス内に収まっているかチェック
    };

    /**
     * はみ出ない最大角度を求める関数です（より精密な方法）。
     * @param startAngle - ローテーションの開始角度
     * @param direction - ローテーションの方向（1: 時計回り、-1: 反時計回り）
     * @returns - 最大角度
     */
    const findMaxAngle = (startAngle: number, direction: number) => {
      let low = startAngle;
      let high = startAngle + 360 * direction;
      let maxAngle = startAngle;

      // 二分探索で最大角度を求める
      while (Math.abs(high - low) > 0.1) {
        const mid = (low + high) / 2;
        obj.set({ angle: mid, left: currentLeft, top: currentTop });
        obj.setCoords(); // 座標を再計算します。

        if (isObjectWithinCanvas()) {
          maxAngle = mid; // オブジェクトがキャンバス内に収まる場合は角度を更新
          low = mid;
        } else {
          high = mid;
        }
      }

      return maxAngle;
    };

    // 新しい角度を取得します。
    let newAngle = obj.angle!;

    // 回転方向を決定します。
    const rotationDirection = Math.sign(newAngle - currentAngle);

    // はみ出ない最大角度を求めます。
    const maxAngle = findMaxAngle(currentAngle, rotationDirection);

    // 新しい角度が最大角度を超えている場合、最大角度に制限します。
    if (rotationDirection > 0 && newAngle > maxAngle) {
      newAngle = maxAngle;
    } else if (rotationDirection < 0 && newAngle < maxAngle) {
      newAngle = maxAngle;
    }

    // 最終的な角度を設定し、位置は元の位置に固定します。
    obj.set({
      angle: newAngle,
      left: currentLeft,
      top: currentTop
    });
    obj.setCoords(); // 座標を再計算します。

    // Canvasを再描画します。
    canvas.renderAll();

    // デバッグ用のログ（コメントアウトされています）
    // console.log(`Max Angle: ${maxAngle}, New Angle: ${newAngle}`);
  };





  /**
 * マウスやタッチ操作によるCanvasの移動イベントを処理する関数です。
 * ドラッグ操作中にキャンバスの表示領域を移動させ、ビューを制限します。
 * @param opt - イベントの情報を含むオブジェクト
 * @returns なし
 */
  const handleMouseMove = (opt: fabric.IEvent) => {
    // Canvasが存在しない場合は処理を終了します。
    if (!canvas) return;

    // ドラッグ操作中かどうかを確認します。
    if (isDraggingRef.current) {
      const vpt = canvas.viewportTransform; // 現在のビューの変換行列を取得します。

      // モバイルデバイスかどうかをチェックします。
      if (isMobile) {
        const touch = opt.e as TouchEvent; // タッチイベントの場合
        if (vpt && lastPosXRef.current !== undefined && lastPosYRef.current !== undefined) {
          // タッチ操作による移動量を計算し、ビューの変換行列を更新します。
          vpt[4] += touch.touches[0].clientX - lastPosXRef.current;
          vpt[5] += touch.touches[0].clientY - lastPosYRef.current;

          // ビューの制限を適用します。
          constrainViewport();

          // Canvasを再描画します。
          canvas.requestRenderAll();

          // 最後のタッチ位置を更新します。
          lastPosXRef.current = touch.touches[0].clientX;
          lastPosYRef.current = touch.touches[0].clientY;
        }
      } else {
        const e = opt.e as MouseEvent; // マウスイベントの場合
        if (vpt && lastPosXRef.current !== undefined && lastPosYRef.current !== undefined) {
          // マウス操作による移動量を計算し、ビューの変換行列を更新します。
          vpt[4] += e.clientX - lastPosXRef.current;
          vpt[5] += e.clientY - lastPosYRef.current;

          // ビューの制限を適用します。
          constrainViewport();

          // Canvasを再描画します。
          canvas.requestRenderAll();

          // 最後のマウス位置を更新します。
          lastPosXRef.current = e.clientX;
          lastPosYRef.current = e.clientY;
        }
      }
    }
  };





  /**
 * マウスボタンを離したときのイベントを処理する関数です。
 * ドラッグ操作が終了したときに、オブジェクトを選択可能にし、Canvasを再描画します。
 * @param e - イベントの情報を含むオブジェクト
 * @returns なし
 */
  const handleMouseUp = (e: fabric.IEvent) => {
    // Canvasが存在しない場合は処理を終了します。
    if (!canvas) return;

    // イベントのターゲットとして選択されているオブジェクトを取得します。
    const object = e.target as fabric.Textbox;

    // オブジェクトが存在する場合の処理
    if (object) {
      // オブジェクトを選択可能に設定します。
      object.selectable = true;

      // Canvas上でアクティブなオブジェクトとして設定します。
      canvas.setActiveObject(object);

      // Canvasを再描画します。
      canvas.renderAll();
    }

    // ドラッグ操作フラグをfalseに設定し、ドラッグ操作が終了したことを示します。
    isDraggingRef.current = false;
  };



  /**
 * マウスボタンが押されたときのイベントを処理する関数です。
 * ドラッグ操作を開始するための初期設定を行います。
 * @param opt - イベントの情報を含むオブジェクト
 * @returns なし
 */
  const handleMouseDown = (opt: fabric.IEvent) => {
    // Canvasが存在しない場合は処理を終了します。
    if (!canvas) return;

    // 現在アクティブなオブジェクトを取得します。
    const activeObj = canvas.getActiveObject();

    // アクティブなオブジェクトが存在しない場合、ドラッグ操作を開始します。
    if (!activeObj) {
      // ドラッグ操作フラグをtrueに設定します。
      isDraggingRef.current = true;

      // モバイルデバイスの場合の処理
      if (isMobile) {
        const touch = opt.e as TouchEvent;
        // タッチの開始位置を記録します。
        lastPosXRef.current = touch.touches[0].clientX;
        lastPosYRef.current = touch.touches[0].clientY;
      } else {
        // デスクトップデバイスの場合の処理
        const e = opt.e as MouseEvent;
        // マウスの開始位置を記録します。
        lastPosXRef.current = e.clientX;
        lastPosYRef.current = e.clientY;
      }
    }
  };



  /**
  * オブジェクトの選択状態を解除するイベントを処理する関数です。
  * オブジェクトが選択解除された際に、そのオブジェクトを選択不可に設定します。
  * @param e - イベントの情報を含むオブジェクト
  * @returns なし
  */
  const handleSelectionClear = (e: fabric.IEvent) => {
    // deselected プロパティに含まれる、選択解除されたオブジェクトの配列を取得します。
    const objects = e.deselected as Array<fabric.Object>;

    // オブジェクトが存在する場合、その選択状態を解除します。
    if (objects) {
      // 各オブジェクトに対して処理を行います。
      objects.map((obj) => {
        // オブジェクトを選択不可に設定します。
        obj.selectable = false;
      });
    }
  };



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