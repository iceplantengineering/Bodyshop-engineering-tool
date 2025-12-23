import React from 'react';
import { useThree } from '@react-three/fiber';

interface RotationCenterIndicatorProps {
  position: [number, number, number];
  show?: boolean;
}

/**
 * 回転中心（OrbitControlsのターゲット）を視覚的に表示するコンポーネント
 * X/Y/Z軸を表す色付きの矢印と中心点を表示
 */
const RotationCenterIndicator: React.FC<RotationCenterIndicatorProps> = ({
  position,
  show = true
}) => {
  const { camera } = useThree();

  if (!show) return null;

  // インジケーターのサイズ（カメラ距離に応じて調整）
  const posVec = { x: position[0], y: position[1], z: position[2] };
  const distance = camera.position.distanceTo(posVec as any);
  const size = Math.max(5, distance * 0.02);

  return (
    <group position={position}>
      {/* 中心点（白い球） */}
      <mesh>
        <sphereGeometry args={[size * 0.3, 16, 16]} />
        <meshBasicMaterial color="white" />
      </mesh>

      {/* X軸（赤い矢印） - 水平方向 */}
      <group rotation={[0, 0, -Math.PI / 2]} position={[size * 0.5, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[size * 0.08, size * 0.08, size, 8]} />
          <meshBasicMaterial color="#ff4444" />
        </mesh>
        <mesh position={[0, size * 0.7, 0]}>
          <coneGeometry args={[size * 0.2, size * 0.4, 8]} />
          <meshBasicMaterial color="#ff4444" />
        </mesh>
      </group>

      {/* Y軸（緑の矢印） - 垂直方向 */}
      <group position={[0, size * 0.5, 0]}>
        <mesh>
          <cylinderGeometry args={[size * 0.08, size * 0.08, size, 8]} />
          <meshBasicMaterial color="#44ff44" />
        </mesh>
        <mesh position={[0, size * 0.7, 0]}>
          <coneGeometry args={[size * 0.2, size * 0.4, 8]} />
          <meshBasicMaterial color="#44ff44" />
        </mesh>
      </group>

      {/* Z軸（青い矢印） - 奥行き方向 */}
      <group rotation={[Math.PI / 2, 0, 0]} position={[0, 0, size * 0.5]}>
        <mesh>
          <cylinderGeometry args={[size * 0.08, size * 0.08, size, 8]} />
          <meshBasicMaterial color="#4488ff" />
        </mesh>
        <mesh position={[0, size * 0.7, 0]}>
          <coneGeometry args={[size * 0.2, size * 0.4, 8]} />
          <meshBasicMaterial color="#4488ff" />
        </mesh>
      </group>

      {/* 外枠円（目立つように） */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[size * 0.8, size, 32]} />
        <meshBasicMaterial color="yellow" transparent opacity={0.3} side={2} />
      </mesh>
    </group>
  );
};

export default RotationCenterIndicator;
