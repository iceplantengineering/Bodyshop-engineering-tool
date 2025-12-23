import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, IconButton,
  Box, Typography, Button, Grid, Paper, Tooltip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import DeleteIcon from '@mui/icons-material/Delete';

export interface SliceImage {
  id: string;
  locatorId: string;
  locatorName?: string;
  url: string;
  timestamp: Date;
}

interface SliceGalleryProps {
  open: boolean;
  onClose: () => void;
  images: SliceImage[];
  onDelete?: (id: string) => void;
  onDownload?: (image: SliceImage) => void;
}

const SliceGallery: React.FC<SliceGalleryProps> = ({
  open,
  onClose,
  images,
  onDelete,
  onDownload
}) => {
  const [selectedImage, setSelectedImage] = useState<SliceImage | null>(null);

  const handleDownload = (image: SliceImage) => {
    if (onDownload) {
      onDownload(image);
    } else {
      // Default download behavior
      const link = document.createElement('a');
      link.href = image.url;
      link.download = `slice_${image.locatorId}_${image.timestamp.getTime()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleImageClick = (image: SliceImage) => {
    setSelectedImage(image);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">スライス画像ギャラリー</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {images.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                生成されたスライス画像はありません
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {images.map((image) => (
                <Grid item xs={12} sm={6} md={4} key={image.id}>
                  <Paper
                    sx={{
                      p: 1,
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'scale(1.02)' }
                    }}
                    onClick={() => handleImageClick(image)}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        width: '100%',
                        paddingTop: '75%', // 4:3 aspect ratio
                        bgcolor: '#000',
                        borderRadius: 1,
                        overflow: 'hidden'
                      }}
                    >
                      <img
                        src={image.url}
                        alt={`Slice ${image.locatorId}`}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </Box>
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" display="block" noWrap>
                        {image.locatorName || image.locatorId}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {image.timestamp.toLocaleString('ja-JP')}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                      <Tooltip title="ダウンロード">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(image);
                          }}
                        >
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {onDelete && (
                        <Tooltip title="削除">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(image.id);
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog
        open={selectedImage !== null}
        onClose={() => setSelectedImage(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {selectedImage?.locatorName || selectedImage?.locatorId}
          </Typography>
          <IconButton onClick={() => setSelectedImage(null)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedImage && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box
                component="img"
                src={selectedImage.url}
                alt={`Slice ${selectedImage.locatorId}`}
                sx={{
                  maxWidth: '100%',
                  maxHeight: '70vh',
                  objectFit: 'contain'
                }}
              />
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={() => handleDownload(selectedImage)}
                >
                  ダウンロード
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SliceGallery;
