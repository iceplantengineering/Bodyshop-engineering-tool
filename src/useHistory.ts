import { useState, useCallback, useRef } from 'react';

export interface HistoryState<T> {
  past: T[];
  present: T | null;
  future: T[];
}

export interface useHistoryReturn<T> {
  state: T | null;
  canUndo: boolean;
  canRedo: boolean;
  setState: (newState: T) => void;
  undo: () => void;
  redo: () => void;
  reset: (initialState: T) => void;
}

/**
 * カスタムフック: アンドウ/リドゥ機能を提供する
 * @param initialState - 初期状態
 * @param maxSize - 履歴の最大サイズ（デフォルト: 50）
 */
export function useHistory<T>(
  initialState: T | null = null,
  maxSize: number = 50
): useHistoryReturn<T> {
  const [past, setPast] = useState<T[]>([]);
  const [present, setPresent] = useState<T | null>(initialState);
  const [future, setFuture] = useState<T[]>([]);

  // デバウンス用の参照（連続する変更をまとめるため）
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const setState = useCallback((newState: T) => {
    // デバウンス処理をクリア
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // 現在の状態と新しい状態が同じ場合は履歴に追加しない
    if (present && JSON.stringify(present) === JSON.stringify(newState)) {
      return;
    }

    // 短時間の変更をまとめる（100ms）
    debounceRef.current = setTimeout(() => {
      setPast(prevPast => {
        const newPast = [...prevPast];
        if (present !== null) {
          newPast.push(present);
        }
        // 履歴サイズ制限
        if (newPast.length > maxSize) {
          newPast.shift();
        }
        return newPast;
      });
      setPresent(newState);
      setFuture([]); // 新しい状態を設定したら未来（リドゥ履歴）をクリア
    }, 100);
  }, [present, maxSize]);

  const undo = useCallback(() => {
    if (past.length === 0) return;

    setPast(prevPast => {
      const newPast = [...prevPast];
      const previousState = newPast.pop();

      if (previousState !== undefined) {
        setFuture(prevFuture => [...prevFuture, present]);
        setPresent(previousState);
      }

      return newPast;
    });
  }, [past, present]);

  const redo = useCallback(() => {
    if (future.length === 0) return;

    setFuture(prevFuture => {
      const newFuture = [...prevFuture];
      const nextState = newFuture.pop();

      if (nextState !== undefined) {
        setPast(prevPast => [...prevPast, present]);
        setPresent(nextState);
      }

      return newFuture;
    });
  }, [future, present]);

  const reset = useCallback((initialState: T) => {
    setPast([]);
    setPresent(initialState);
    setFuture([]);
  }, []);

  return {
    state: present,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    setState,
    undo,
    redo,
    reset
  };
}

/**
 * 複数のデータ型をまとめて管理するアンドウ/リドゥフック
 */
export interface AppHistoryState {
  weldPoints: any[];
  locators: any[];
  pins: any[];
}

export interface useHistoryActionsReturn {
  canUndo: boolean;
  canRedo: boolean;
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
}

/**
 * アプリケーション全体の履歴を管理するフック
 * 各データ配列のスナップショットを保存
 */
export function useHistoryActions(
  weldPoints: any[],
  locators: any[],
  pins: any[],
  setWeldPoints: React.Dispatch<React.SetStateAction<any[]>>,
  setLocators: React.Dispatch<React.SetStateAction<any[]>>,
  setPins: React.Dispatch<React.SetStateAction<any[]>>
): useHistoryActionsReturn {
  const pastRef = useRef<AppHistoryState[]>([]);
  const futureRef = useRef<AppHistoryState[]>([]);

  const pushHistory = useCallback(() => {
    const currentState: AppHistoryState = {
      weldPoints: JSON.parse(JSON.stringify(weldPoints)),
      locators: JSON.parse(JSON.stringify(locators)),
      pins: JSON.parse(JSON.stringify(pins))
    };

    pastRef.current.push(currentState);
    futureRef.current = []; // 新しい操作でリドゥ履歴をクリア

    // 履歴サイズ制限
    if (pastRef.current.length > 50) {
      pastRef.current.shift();
    }
  }, [weldPoints, locators, pins]);

  const undo = useCallback(() => {
    if (pastRef.current.length === 0) return;

    // 現在の状態を未来に保存
    const currentState: AppHistoryState = {
      weldPoints: JSON.parse(JSON.stringify(weldPoints)),
      locators: JSON.parse(JSON.stringify(locators)),
      pins: JSON.parse(JSON.stringify(pins))
    };
    futureRef.current.push(currentState);

    // 過去の状態を復元
    const previousState = pastRef.current.pop();
    if (previousState) {
      setWeldPoints(previousState.weldPoints);
      setLocators(previousState.locators);
      setPins(previousState.pins);
    }
  }, [weldPoints, locators, pins, setWeldPoints, setLocators, setPins]);

  const redo = useCallback(() => {
    if (futureRef.current.length === 0) return;

    // 現在の状態を過去に保存
    const currentState: AppHistoryState = {
      weldPoints: JSON.parse(JSON.stringify(weldPoints)),
      locators: JSON.parse(JSON.stringify(locators)),
      pins: JSON.parse(JSON.stringify(pins))
    };
    pastRef.current.push(currentState);

    // 未来の状態を復元
    const nextState = futureRef.current.pop();
    if (nextState) {
      setWeldPoints(nextState.weldPoints);
      setLocators(nextState.locators);
      setPins(nextState.pins);
    }
  }, [weldPoints, locators, pins, setWeldPoints, setLocators, setPins]);

  const clearHistory = useCallback(() => {
    pastRef.current = [];
    futureRef.current = [];
  }, []);

  return {
    canUndo: pastRef.current.length > 0,
    canRedo: futureRef.current.length > 0,
    pushHistory,
    undo,
    redo,
    clearHistory
  };
}
