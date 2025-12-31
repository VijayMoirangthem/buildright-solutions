import { useState } from 'react';
import { Search, Trash2, ExternalLink, FileText, Image, File, HardDrive, AlertTriangle } from 'lucide-react';
import { useStorage, StoredFile } from '@/contexts/StorageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface StorageManagerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StorageManagerModal({ open, onOpenChange }: StorageManagerModalProps) {
  const {
    files,
    totalStorage,
    usedStorage,
    usagePercentage,
    isWarning,
    isCritical,
    deleteFile,
    deleteFiles,
    formatBytes,
  } = useStorage();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || 
      (filterType === 'image' && file.type.startsWith('image/')) ||
      (filterType === 'pdf' && file.type === 'application/pdf') ||
      (filterType === 'other' && !file.type.startsWith('image/') && file.type !== 'application/pdf');
    return matchesSearch && matchesType;
  });

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-5 h-5 text-primary" />;
    if (type === 'application/pdf') return <FileText className="w-5 h-5 text-danger" />;
    return <File className="w-5 h-5 text-muted-foreground" />;
  };

  const toggleSelectFile = (fileId: string) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredFiles.map(f => f.id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedFiles.length === 0) return;
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    const freedSpace = files
      .filter(f => selectedFiles.includes(f.id))
      .reduce((acc, f) => acc + f.size, 0);
    
    deleteFiles(selectedFiles);
    setSelectedFiles([]);
    setDeleteConfirmOpen(false);
    toast.success(`Deleted ${selectedFiles.length} files. Freed ${formatBytes(freedSpace)}`);
  };

  const handleViewFile = (file: StoredFile) => {
    window.open(file.url, '_blank');
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HardDrive className="w-5 h-5" />
              Storage Manager
            </DialogTitle>
          </DialogHeader>

          {/* Storage Overview */}
          <div className="p-4 rounded-lg bg-muted/50 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Storage Used</span>
              <span className={isCritical ? 'text-danger' : isWarning ? 'text-warning' : ''}>
                {formatBytes(usedStorage)} / {formatBytes(totalStorage)}
              </span>
            </div>
            <Progress 
              value={usagePercentage} 
              className={`h-3 ${isCritical ? '[&>div]:bg-danger' : isWarning ? '[&>div]:bg-warning' : ''}`}
            />
            {isCritical && (
              <div className="flex items-center gap-1 text-danger text-xs">
                <AlertTriangle className="w-3 h-3" />
                Critical! Delete files to free up space.
              </div>
            )}
            {isWarning && !isCritical && (
              <div className="flex items-center gap-1 text-warning text-xs">
                <AlertTriangle className="w-3 h-3" />
                Running low on storage.
              </div>
            )}
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Files</SelectItem>
                <SelectItem value="image">Images</SelectItem>
                <SelectItem value="pdf">PDFs</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions Bar */}
          {selectedFiles.length > 0 && (
            <div className="flex items-center justify-between p-2 rounded-lg bg-primary/10 border border-primary/20">
              <span className="text-sm font-medium">
                {selectedFiles.length} file(s) selected
              </span>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDeleteSelected}
                className="h-8"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete Selected
              </Button>
            </div>
          )}

          {/* File List */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {filteredFiles.length > 0 ? (
              <div className="space-y-1">
                {/* Select All Header */}
                <div className="flex items-center gap-3 p-2 border-b border-border sticky top-0 bg-background">
                  <Checkbox
                    checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                  <span className="text-xs text-muted-foreground flex-1">
                    {filteredFiles.length} files ({formatBytes(filteredFiles.reduce((acc, f) => acc + f.size, 0))})
                  </span>
                </div>

                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className={`
                      flex items-center gap-3 p-3 rounded-lg transition-colors
                      ${selectedFiles.includes(file.id) ? 'bg-primary/10' : 'hover:bg-muted/50'}
                    `}
                  >
                    <Checkbox
                      checked={selectedFiles.includes(file.id)}
                      onCheckedChange={() => toggleSelectFile(file.id)}
                    />
                    
                    <div className="flex-shrink-0">
                      {getFileIcon(file.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatBytes(file.size)}</span>
                        <span>•</span>
                        <span>{new Date(file.uploadedAt).toLocaleDateString('en-IN')}</span>
                        {file.linkedTo && (
                          <>
                            <span>•</span>
                            <span className="capitalize">{file.linkedTo.type}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleViewFile(file)}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          deleteFile(file.id);
                          toast.success(`Deleted ${file.name}`);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-danger" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <HardDrive className="w-12 h-12 mb-3 opacity-50" />
                <p className="text-sm">No files found</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Files</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedFiles.length} file(s)? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-danger hover:bg-danger/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
