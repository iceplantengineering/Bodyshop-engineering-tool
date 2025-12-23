import React from 'react';
import {
  Box, Button, ButtonGroup, Typography, Paper, Divider
} from '@mui/material';
import GridOnIcon from '@mui/icons-material/GridOn';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';
import VerticalAlignCenterIcon from '@mui/icons-material/VerticalAlignCenter';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import HorizontalAlignLeftIcon from '@mui/icons-material/AlignHorizontalLeft';
import HorizontalAlignCenterIcon from '@mui/icons-material/AlignHorizontalCenter';
import HorizontalAlignRightIcon from '@mui/icons-material/AlignHorizontalRight';

export interface AlignmentAction {
  type: 'snap-grid' | 'align-y' | 'align-x' | 'align-z' | 'distribute';
  value?: number;
}

interface AlignmentToolsProps {
  selectedObjectData: any;
  onAlign: (action: AlignmentAction) => void;
}

const AlignmentTools: React.FC<AlignmentToolsProps> = ({
  selectedObjectData,
  onAlign
}) => {
  if (!selectedObjectData) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Typography variant="caption" sx={{ color: 'lightgray', fontWeight: 'bold' }}>
        整列ツール
      </Typography>

      {/* Grid Snap */}
      <Button
        size="small"
        variant="outlined"
        startIcon={<GridOnIcon />}
        onClick={() => onAlign({ type: 'snap-grid', value: 10 })}
        sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}
      >
        グリッド(10)にスナップ
      </Button>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.3)' }} />

      {/* Vertical Alignment (Y-axis) */}
      <Typography variant="caption" sx={{ color: 'lightgray', fontSize: '0.65rem' }}>
        垂直整列 (Y)
      </Typography>
      <ButtonGroup size="small" fullWidth>
        <Button
          onClick={() => onAlign({ type: 'align-y', value: 0 })}
          sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', fontSize: '0.65rem' }}
        >
          <VerticalAlignTopIcon fontSize="small" />
        </Button>
        <Button
          onClick={() => onAlign({ type: 'align-y', value: 100 })}
          sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', fontSize: '0.65rem' }}
        >
          <VerticalAlignCenterIcon fontSize="small" />
        </Button>
        <Button
          onClick={() => onAlign({ type: 'align-y', value: -100 })}
          sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', fontSize: '0.65rem' }}
        >
          <VerticalAlignBottomIcon fontSize="small" />
        </Button>
      </ButtonGroup>

      {/* Horizontal Alignment (X-axis) */}
      <Typography variant="caption" sx={{ color: 'lightgray', fontSize: '0.65rem' }}>
        水平整列 (X)
      </Typography>
      <ButtonGroup size="small" fullWidth>
        <Button
          onClick={() => onAlign({ type: 'align-x', value: 0 })}
          sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', fontSize: '0.65rem' }}
        >
          <HorizontalAlignLeftIcon fontSize="small" />
        </Button>
        <Button
          onClick={() => onAlign({ type: 'align-x', value: 100 })}
          sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', fontSize: '0.65rem' }}
        >
          <HorizontalAlignCenterIcon fontSize="small" />
        </Button>
        <Button
          onClick={() => onAlign({ type: 'align-x', value: -100 })}
          sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', fontSize: '0.65rem' }}
        >
          <HorizontalAlignRightIcon fontSize="small" />
        </Button>
      </ButtonGroup>

      {/* Depth Alignment (Z-axis) */}
      <Typography variant="caption" sx={{ color: 'lightgray', fontSize: '0.65rem' }}>
        奥行整列 (Z)
      </Typography>
      <ButtonGroup size="small" fullWidth>
        <Button
          onClick={() => onAlign({ type: 'align-z', value: 0 })}
          sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}
        >
          前
        </Button>
        <Button
          onClick={() => onAlign({ type: 'align-z', value: 100 })}
          sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}
        >
          中
        </Button>
        <Button
          onClick={() => onAlign({ type: 'align-z', value: -100 })}
          sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}
        >
          奥
        </Button>
      </ButtonGroup>

      {/* Reset to Origin */}
      <Button
        size="small"
        variant="outlined"
        onClick={() => onAlign({ type: 'align-x', value: 0 })}
        sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}
      >
        原点に移動
      </Button>
    </Box>
  );
};

export default AlignmentTools;
