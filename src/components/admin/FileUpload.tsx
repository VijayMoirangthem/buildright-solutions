import { useState, useCallback, useRef } from 'react';
import { Upload, X, FileText, Image, File, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useStorage, StoredFile } from '@/contexts/StorageContext';
import { toast } from 'sonner';

interface FileUploadProps {
  onFileUploaded: (file: StoredFile) => void;
  linkedTo?: {
    type: 'client' | 'labour' | 'resource' | 'project';
    id: string;
    recordId?: string;
  };
  maxSizeMB?: number;
  accept?: string;
}

// Simulated Cloudinary compression
const compressImage = async (file: File): Promise<{ blob: Blob; size: number }> => {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve({ blob: file, size: file.size });
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new window.Image();
    
    img.onload = () => {
      // Max dimensions: 1920x1080
      let width = img.width;
      let height = img.height;
      
      if (width > 1920) {
        height = (height * 1920) / width;
        width = 1920;
      }
      if (height > 1080) {
        width = (width * 1080) / height;
        height = 1080;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve({ blob, size: blob.size });
          } else {
            resolve({ blob: file, size: file.size });
          }
        },
        file.type,
        0.85 // 85% quality
      );
    };
    
    img.onerror = () => resolve({ blob: file, size: file.size });
    img.src = URL.createObjectURL(file);
  });
};

export function FileUpload({ onFileUploaded, linkedTo, maxSizeMB = 10, accept = 'image/*,.pdf' }: FileUploadProps) {
  const { addFile, remainingStorage, formatBytes, isWarning, isCritical } = useStorage();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = async (file: File) => {
    const maxSize = maxSizeMB * 1024 * 1024;
    
    if (file.size > maxSize) {
      toast.error(`File too large. Maximum size is ${maxSizeMB}MB`);
      return;
    }

    setSelectedFile(file);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 100);

      // Compress if it's an image
      const { blob, size } = await compressImage(file);
      
      // Check storage limit
      if (size > remainingStorage) {
        clearInterval(progressInterval);
        setIsUploading(false);
        setSelectedFile(null);
        toast.error('Not enough storage space. Please delete some files.');
        return;
      }

      // Simulate Cloudinary upload delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Create file URL (in real app, this would be Cloudinary URL)
      const url = URL.createObjectURL(blob);
      
      const storedFile = addFile({
        name: file.name,
        url,
        size,
        type: file.type,
        linkedTo,
      });

      await new Promise(resolve => setTimeout(resolve, 200));
      
      onFileUploaded(storedFile);
      toast.success(`File uploaded! Compressed to ${formatBytes(size)}`);
    } catch (error) {
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
      setUploadProgress(0);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [remainingStorage]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-8 h-8 text-primary" />;
    if (type === 'application/pdf') return <FileText className="w-8 h-8 text-danger" />;
    return <File className="w-8 h-8 text-muted-foreground" />;
  };

  return (
    <div className="space-y-3">
      {/* Storage Warning */}
      {isCritical && (
        <div className="p-2 rounded-lg bg-danger/10 border border-danger/20 text-danger text-xs">
          ⚠️ Storage almost full (90%+). Delete files to free up space.
        </div>
      )}
      {isWarning && !isCritical && (
        <div className="p-2 rounded-lg bg-warning/10 border border-warning/20 text-warning text-xs">
          ⚠️ Storage is getting low (80%+). Consider deleting old files.
        </div>
      )}

      {/* Upload Zone */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-4 text-center transition-all cursor-pointer
          ${isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50 hover:bg-muted/50'
          }
          ${isUploading ? 'pointer-events-none' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleFileSelect}
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              {selectedFile && getFileIcon(selectedFile.type)}
              <div className="text-left">
                <p className="text-sm font-medium truncate max-w-[200px]">
                  {selectedFile?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Compressing & uploading...
                </p>
              </div>
            </div>
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-xs text-muted-foreground">{uploadProgress}%</p>
          </div>
        ) : (
          <>
            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium">
              Drop file here or <span className="text-primary">browse</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Images & PDFs up to {maxSizeMB}MB • Auto-compressed
            </p>
          </>
        )}
      </div>

      {/* Storage Info */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Available: {formatBytes(remainingStorage)}</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 text-xs px-2"
          onClick={(e) => {
            e.stopPropagation();
            window.location.href = '/admin/storage';
          }}
        >
          Manage Storage
        </Button>
      </div>
    </div>
  );
}
