import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, LinearProgress, Typography, Box, Alert,
  CircularProgress
} from '@mui/material';

export interface SliceResult {
  locatorId: string;
  success: boolean;
  message: string;
  imagePath?: string;
}

interface SliceGenerationModalProps {
  open: boolean;
  onClose: () => void;
  locators: Array<{ id: string; name?: string }>;
  onGenerate: (onProgress: (current: number, total: number) => void) => Promise<SliceResult[]>;
}

const SliceGenerationModal: React.FC<SliceGenerationModalProps> = ({
  open,
  onClose,
  locators,
  onGenerate
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [current, setCurrent] = useState(0);
  const [total, setTotal] = useState(0);
  const [results, setResults] = useState<SliceResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setResults([]);

    try {
      const sliceResults = await onGenerate((currentProgress: number, totalProgress: number) => {
        setCurrent(currentProgress);
        setTotal(totalProgress);
      });
      setResults(sliceResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    if (!isGenerating) {
      setCurrent(0);
      setTotal(0);
      setResults([]);
      setError(null);
      onClose();
    }
  };

  const progress = total > 0 ? (current / total) * 100 : 0;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isGenerating ? '断面生成中...' : '断面生成結果'}
      </DialogTitle>
      <DialogContent>
        {isGenerating && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {current} / {total} 処理中...
            </Typography>
            <LinearProgress variant="determinate" value={progress} />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress size={24} />
            </Box>
          </Box>
        )}

        {!isGenerating && results.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              生成結果 ({results.filter(r => r.success).length} / {results.length})
            </Typography>
            {results.map((result, index) => (
              <Alert
                key={index}
                severity={result.success ? 'success' : 'error'}
                sx={{ mb: 1 }}
              >
                <Typography variant="body2">
                  {result.success ? `成功: ${result.locatorId}` : `失敗: ${result.locatorId}`}
                </Typography>
                {result.message && (
                  <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                    {result.message}
                  </Typography>
                )}
              </Alert>
            ))}
          </Box>
        )}

        {!isGenerating && error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {!isGenerating && results.length === 0 && !error && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">
              {locators.length}個のロケータの断面を生成します。
            </Typography>
            <Typography variant="body2" color="text.secondary">
              処理には時間がかかる場合があります。
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isGenerating}>
          {isGenerating ? '処理中...' : results.length > 0 || error ? '閉じる' : 'キャンセル'}
        </Button>
        {!isGenerating && results.length === 0 && !error && (
          <Button
            onClick={handleGenerate}
            variant="contained"
            color="primary"
          >
            生成開始
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SliceGenerationModal;
