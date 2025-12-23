import React, { useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Line, Text } from '@react-three/drei';

export interface MeasurementPoint {
  position: THREE.Vector3;
  id: string;
}

export interface MeasurementDistance {
  point1: MeasurementPoint;
  point2: MeasurementPoint;
  id: string;
}

export interface MeasurementAngle {
  vertex: MeasurementPoint;
  point1: MeasurementPoint;
  point2: MeasurementPoint;
  id: string;
}

interface MeasurementToolProps {
  mode: 'none' | 'distance' | 'angle';
  onComplete?: (result: { distance?: number; angle?: number; points: MeasurementPoint[] }) => void;
  onCancel?: () => void;
}

// 距離測定用ラインコンポーネント
const DistanceMeasurementLine: React.FC<{
  startPoint: THREE.Vector3;
  endPoint: THREE.Vector3;
  label?: string;
}> = ({ startPoint, endPoint, label }) => {
  const points = [startPoint, endPoint];
  const distance = startPoint.distanceTo(endPoint);
  const midPoint = new THREE.Vector3().addVectors(startPoint, endPoint).multiplyScalar(0.5);

  return (
    <>
      <Line
        points={points}
        color="yellow"
        lineWidth={2}
      />
      {label && (
        <Text
          position={midPoint}
          fontSize={5}
          color="yellow"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.5}
          outlineColor="black"
        >
          {label}
        </Text>
      )}
      <Text
        position={midPoint.clone().add(new THREE.Vector3(0, 5, 0))}
        fontSize={4}
        color="yellow"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.3}
        outlineColor="black"
      >
        {distance.toFixed(2)} mm
      </Text>
    </>
  );
};

// 角度測定用ラインコンポーネント
const AngleMeasurementLines: React.FC<{
  vertex: THREE.Vector3;
  point1: THREE.Vector3;
  point2: THREE.Vector3;
}> = ({ vertex, point1, point2 }) => {
  // 角度計算
  const v1 = new THREE.Vector3().subVectors(point1, vertex).normalize();
  const v2 = new THREE.Vector3().subVectors(point2, vertex).normalize();
  const angle = v1.angleTo(v2) * (180 / Math.PI);

  // 弧の描画用ポイント
  const arcPoints: THREE.Vector3[] = [];
  const arcSegments = 32;
  const arcRadius = Math.min(point1.distanceTo(vertex), point2.distanceTo(vertex)) * 0.3;

  // 2つのベクトルに垂直な軸を見つける
  const axis = new THREE.Vector3().crossVectors(v1, v2).normalize();
  if (axis.length() < 0.001) {
    // 平行な場合は別の軸を使用
    axis.set(0, 1, 0);
  }

  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), v1);
  for (let i = 0; i <= arcSegments; i++) {
    const t = i / arcSegments;
    const angleRad = v1.angleTo(v2) * t;
    const point = new THREE.Vector3(
      Math.cos(angleRad) * arcRadius,
      0,
      Math.sin(angleRad) * arcRadius
    );
    point.applyQuaternion(quaternion);
    point.add(vertex);
    arcPoints.push(point);
  }

  return (
    <>
      <Line points={[vertex, point1]} color="cyan" lineWidth={2} />
      <Line points={[vertex, point2]} color="cyan" lineWidth={2} />
      <Line points={arcPoints} color="cyan" lineWidth={2} />
      <Text
        position={vertex.clone().add(new THREE.Vector3(0, 10, 0))}
        fontSize={5}
        color="cyan"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.5}
        outlineColor="black"
      >
        {angle.toFixed(2)}°
      </Text>
    </>
  );
};

// 測定ツールメインコンポーネント
export const MeasurementTool: React.FC<MeasurementToolProps> = ({
  mode,
  onComplete,
  onCancel
}) => {
  const { camera, scene, raycaster, pointer } = useThree();
  const [points, setPoints] = useState<THREE.Vector3[]>([]);
  const [previewPoint, setPreviewPoint] = useState<THREE.Vector3 | null>(null);
  const isPlacingRef = useRef(false);

  // グリッド平面との交点を計算
  const getIntersectionPoint = (event: any): THREE.Vector3 | null => {
    raycaster.setFromCamera(pointer, camera);

    // シーン内のすべてのメッシュと交差判定
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      return intersects[0].point.clone();
    }

    // 交点がない場合は、グリッド平面（Y=0）との交点を計算
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const target = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, target);
    return target;
  };

  // クリックイベント処理
  const handleClick = (event: any) => {
    if (mode === 'none') return;

    event.stopPropagation();
    const point = getIntersectionPoint(event);

    if (point) {
      if (mode === 'distance') {
        const newPoints = [...points, point];
        setPoints(newPoints);

        if (newPoints.length === 2) {
          const distance = newPoints[0].distanceTo(newPoints[1]);
          onComplete?.({
            distance,
            points: newPoints.map((p, i) => ({ position: p, id: `point-${i}` }))
          });
          setPoints([]);
          setPreviewPoint(null);
        }
      } else if (mode === 'angle') {
        const newPoints = [...points, point];
        setPoints(newPoints);

        if (newPoints.length === 3) {
          const v1 = new THREE.Vector3().subVectors(newPoints[0], newPoints[1]).normalize();
          const v2 = new THREE.Vector3().subVectors(newPoints[2], newPoints[1]).normalize();
          const angle = v1.angleTo(v2) * (180 / Math.PI);
          onComplete?.({
            angle,
            points: newPoints.map((p, i) => ({ position: p, id: `point-${i}` }))
          });
          setPoints([]);
          setPreviewPoint(null);
        }
      }
    }
  };

  // プレビュー更新
  useFrame(() => {
    if (mode !== 'none' && points.length > 0) {
      const tempRaycaster = new THREE.Raycaster();
      tempRaycaster.setFromCamera(pointer, camera);

      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const target = new THREE.Vector3();
      const hit = tempRaycaster.ray.intersectPlane(plane, target);

      if (hit) {
        setPreviewPoint(target.clone());
      }
    }
  });

  // キャンセル
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setPoints([]);
      setPreviewPoint(null);
      onCancel?.();
    }
  };

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  if (mode === 'none') return null;

  return (
    <group onClick={handleClick}>
      {/* 既存のポイントを表示 */}
      {points.map((point, index) => (
        <mesh key={index} position={point}>
          <sphereGeometry args={[3, 16, 16]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      ))}

      {/* プレビューライン */}
      {previewPoint && points.length > 0 && (
        <>
          {mode === 'distance' && points.length === 1 && (
            <Line
              points={[points[0], previewPoint]}
              color="yellow"
              lineWidth={1}
              dashed
              dashSize={2}
              gapSize={1}
            />
          )}
          {mode === 'angle' && points.length >= 1 && (
            <>
              <Line
                points={[points[points.length - 1], previewPoint]}
                color="cyan"
                lineWidth={1}
                dashed
                dashSize={2}
                gapSize={1}
              />
            </>
          )}
        </>
      )}

      {/* 距離測定完了時の表示 */}
      {mode === 'distance' && points.length === 2 && (
        <DistanceMeasurementLine
          startPoint={points[0]}
          endPoint={points[1]}
        />
      )}

      {/* 角度測定完了時の表示 */}
      {mode === 'angle' && points.length === 3 && (
        <AngleMeasurementLines
          vertex={points[1]}
          point1={points[0]}
          point2={points[2]}
        />
      )}
    </group>
  );
};

// 測定結果表示コンポーネント
export const MeasurementResults: React.FC<{
  measurements: Array<{ id: string; type: 'distance' | 'angle'; value: number; points: MeasurementPoint[] }>;
  onDelete?: (id: string) => void;
}> = ({ measurements, onDelete }) => {
  return (
    <group>
      {measurements.map((measurement) => {
        if (measurement.type === 'distance' && measurement.points.length === 2) {
          return (
            <group key={measurement.id}>
              <DistanceMeasurementLine
                startPoint={measurement.points[0].position}
                endPoint={measurement.points[1].position}
              />
              {measurement.points.map((point, i) => (
                <mesh key={i} position={point.position}>
                  <sphereGeometry args={[2, 8, 8]} />
                  <meshStandardMaterial color="orange" />
                </mesh>
              ))}
            </group>
          );
        } else if (measurement.type === 'angle' && measurement.points.length === 3) {
          return (
            <group key={measurement.id}>
              <AngleMeasurementLines
                vertex={measurement.points[1].position}
                point1={measurement.points[0].position}
                point2={measurement.points[2].position}
              />
              {measurement.points.map((point, i) => (
                <mesh key={i} position={point.position}>
                  <sphereGeometry args={[2, 8, 8]} />
                  <meshStandardMaterial color="cyan" />
                </mesh>
              ))}
            </group>
          );
        }
        return null;
      })}
    </group>
  );
};

export default MeasurementTool;
