import React from 'react';
import {
  Paper, Box, Button, ButtonGroup, Typography, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import StraightenIcon from '@mui/icons-material/Straighten';
import AngleIcon from '@mui/icons-material/Architecture';
import CloseIcon from '@mui/icons-material/Close';

export interface MeasurementResult {
  id: string;
  type: 'distance' | 'angle';
  value: number;
  timestamp: Date;
}

interface MeasurementPanelProps {
  mode: 'none' | 'distance' | 'angle';
  onModeChange: (mode: 'none' | 'distance' | 'angle') => void;
  measurements: MeasurementResult[];
  onDelete?: (id: string) => void;
  onClearAll?: () => void;
}

const MeasurementPanel: React.FC<MeasurementPanelProps> = ({
  mode,
  onModeChange,
  measurements,
  onDelete,
  onClearAll
}) => {
  return (
    <Paper
      elevation={3}
      sx={{
        position: 'absolute',
        top: 10,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1,
        p: 1.5,
        minWidth: 300,
        maxWidth: 400,
        background: 'rgba(40, 40, 40, 0.9)',
        color: 'white',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {/* Mode Selection */}
        <Typography variant="caption" sx={{ color: 'lightgray', fontWeight: 'bold' }}>
          測定ツール
        </Typography>
        <ButtonGroup size="small" fullWidth>
          <Button
            variant={mode === 'none' ? 'contained' : 'outlined'}
            onClick={() => onModeChange('none')}
            sx={{
              color: mode === 'none' ? 'black' : 'white',
              borderColor: 'rgba(255,255,255,0.5)'
            }}
          >
            なし
          </Button>
          <Button
            variant={mode === 'distance' ? 'contained' : 'outlined'}
            onClick={() => onModeChange('distance')}
            startIcon={<StraightenIcon />}
            sx={{
              color: mode === 'distance' ? 'black' : 'white',
              borderColor: 'rgba(255,255,255,0.5)'
            }}
          >
            距離
          </Button>
          <Button
            variant={mode === 'angle' ? 'contained' : 'outlined'}
            onClick={() => onModeChange('angle')}
            startIcon={<AngleIcon />}
            sx={{
              color: mode === 'angle' ? 'black' : 'white',
              borderColor: 'rgba(255,255,255,0.5)'
            }}
          >
            角度
          </Button>
        </ButtonGroup>

        {/* Instructions */}
        {mode !== 'none' && (
          <Box
            sx={{
              p: 1,
              bgcolor: 'rgba(100, 100, 100, 0.3)',
              borderRadius: 1,
              fontSize: '0.75rem'
            }}
          >
            {mode === 'distance' && '2点をクリックして距離を測定'}
            {mode === 'angle' && '3点をクリックして角度を測定（最初の点で頂点）'}
          </Box>
        )}

        {/* Measurements List */}
        {measurements.length > 0 && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ color: 'lightgray' }}>
                測定結果 ({measurements.length})
              </Typography>
              {onClearAll && (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={onClearAll}
                  sx={{
                    fontSize: '0.7rem',
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.3)'
                  }}
                >
                  すべてクリア
                </Button>
              )}
            </Box>
            <TableContainer sx={{ maxHeight: 150 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: 'lightgray', fontSize: '0.7rem', pb: 0.5 }}>タイプ</TableCell>
                    <TableCell sx={{ color: 'lightgray', fontSize: '0.7rem', pb: 0.5 }}>値</TableCell>
                    <TableCell sx={{ color: 'lightgray', fontSize: '0.7rem', pb: 0.5 }}>操作</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {measurements.map((m) => (
                    <TableRow key={m.id} sx={{ '&:last-child td': { border: 0 } }}>
                      <TableCell sx={{ color: 'white', fontSize: '0.75rem', py: 0.5 }}>
                        {m.type === 'distance' ? '距離' : '角度'}
                      </TableCell>
                      <TableCell sx={{ color: 'white', fontSize: '0.75rem', py: 0.5 }}>
                        {m.type === 'distance'
                          ? `${m.value.toFixed(2)} mm`
                          : `${m.value.toFixed(2)}°`}
                      </TableCell>
                      <TableCell sx={{ py: 0.5 }}>
                        {onDelete && (
                          <IconButton
                            size="small"
                            onClick={() => onDelete(m.id)}
                            sx={{ color: 'lightgray', '&:hover': { color: 'red' } }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {/* Close button when mode is active */}
        {mode !== 'none' && (
          <Button
            size="small"
            variant="outlined"
            onClick={() => onModeChange('none')}
            startIcon={<CloseIcon />}
            sx={{
              color: 'white',
              borderColor: 'rgba(255,255,255,0.5)',
              fontSize: '0.75rem'
            }}
          >
            測定を終了
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default MeasurementPanel;
