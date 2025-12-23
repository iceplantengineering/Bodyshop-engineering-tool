import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardIcon from '@mui/icons-material/Keyboard';

interface ShortcutItem {
  key: string;
  description: string;
  category: string;
}

const shortcuts: ShortcutItem[] = [
  // Camera Controls
  { key: 'Mouse Left + Drag', description: 'カメラ回転', category: 'カメラ操作' },
  { key: 'Mouse Right + Drag', description: 'カメラパン', category: 'カメラ操作' },
  { key: 'Mouse Wheel', description: 'ズームイン/アウト', category: 'カメラ操作' },
  { key: 'X + Y + Z', description: '等角図（XYZビュー）', category: 'カメラ操作' },
  { key: 'X', description: 'X方向から見る', category: 'カメラ操作' },
  { key: 'Y', description: 'Y方向から見る', category: 'カメラ操作' },
  { key: 'Z', description: 'Z方向から見る', category: 'カメラ操作' },

  // Object Manipulation
  { key: 'Click on Object', description: 'オブジェクト選択', category: 'オブジェクト操作' },
  { key: 'Click Background', description: '選択解除', category: 'オブジェクト操作' },
  { key: 'G', description: '移動モード切替', category: 'オブジェクト操作' },
  { key: 'R', description: '回転モード切替', category: 'オブジェクト操作' },
  { key: 'S', description: 'スケールモード切替', category: 'オブジェクト操作' },
  { key: 'Delete / Del', description: '選択オブジェクト削除', category: 'オブジェクト操作' },
  { key: 'Ctrl+D', description: '選択オブジェクト複製', category: 'オブジェクト操作' },

  // Transform Controls
  { key: 'T', description: 'トランスフォームコントロール切替', category: 'トランスフォーム' },
  { key: '+', description: 'トランスフォームサイズ拡大', category: 'トランスフォーム' },
  { key: '-', description: 'トランスフォームサイズ縮小', category: 'トランスフォーム' },

  // General
  { key: 'Ctrl+Z', description: 'アンドウ（元に戻す）', category: '一般' },
  { key: 'Ctrl+Shift+Z', description: 'リドゥ（やり直し）', category: '一般' },
  { key: '?', description: 'キーボードショートカットヘルプ', category: '一般' },
  { key: 'Esc', description: '選択解除/ダイアログ閉じる', category: '一般' },
];

interface KeyboardShortcutsHelpProps {
  open: boolean;
  onClose: () => void;
}

const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({ open, onClose }) => {
  // Group shortcuts by category
  const categories = Array.from(new Set(shortcuts.map(s => s.category)));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'primary.main', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <KeyboardIcon />
          <Typography variant="h6">キーボードショートカット</Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        {categories.map((category) => (
          <Box key={category} sx={{ mb: 2 }}>
            <Typography
              variant="subtitle1"
              sx={{
                px: 2,
                py: 1,
                bgcolor: 'rgba(0, 0, 0, 0.05)',
                fontWeight: 'bold',
                color: 'primary.main'
              }}
            >
              {category}
            </Typography>
            <TableContainer component={Paper} elevation={0}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: '40%', fontWeight: 'bold' }}>キー</TableCell>
                    <TableCell>説明</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {shortcuts
                    .filter(s => s.category === category)
                    .map((shortcut, index) => (
                      <TableRow
                        key={index}
                        sx={{ '&:last-child td': { border: 0 } }}
                      >
                        <TableCell>
                          <Box
                            sx={{
                              display: 'inline-block',
                              px: 1,
                              py: 0.5,
                              bgcolor: 'grey.200',
                              borderRadius: 1,
                              fontFamily: 'monospace',
                              fontSize: '0.875rem'
                            }}
                          >
                            {shortcut.key}
                          </Box>
                        </TableCell>
                        <TableCell>{shortcut.description}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcutsHelp;
