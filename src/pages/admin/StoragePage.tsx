import { useState } from 'react';
import { useNavigation } from '@/contexts/NavigationContext';
import { useStorage } from '@/contexts/StorageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ArrowLeft,
  HardDrive,
  Image,
  FileText,
  File,
  Trash2,
  ExternalLink,
  Search,
  AlertTriangle,
} from 'lucide-react';
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

export default function StoragePage() {
  const { goBack } = useNavigation();
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

  const imageCount = files.filter(f => f.type.startsWith('image/')).length;
  const pdfCount = files.filter(f => f.type === 'application/pdf').length;
  const otherCount = files.length - imageCount - pdfCount;

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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={goBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Storage</h1>
          <p className="text-sm text-muted-foreground hidden sm:block">Manage uploaded files</p>
        </div>
      </div>

      {/* Storage Overview */}
      <Card className="shadow-card">
        <CardHeader className="py-3 px-4 border-b border-border">
          <CardTitle className="text-base flex items-center gap-2">
            <HardDrive className="w-5 h-5" />
            Storage Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Space Used</span>
              <span className={`font-semibold ${isCritical ? 'text-danger' : isWarning ? 'text-warning' : 'text-foreground'}`}>
                {formatBytes(usedStorage)} / {formatBytes(totalStorage)}
              </span>
            </div>
            <Progress 
              value={usagePercentage} 
              className={`h-4 ${isCritical ? '[&>div]:bg-danger' : isWarning ? '[&>div]:bg-warning' : ''}`}
            />
            <p className="text-xs text-muted-foreground text-right">
              {usagePercentage.toFixed(1)}% used
            </p>
          </div>

          {isCritical && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <p className="text-sm">Storage is almost full! Delete files to free up space.</p>
            </div>
          )}
          {isWarning && !isCritical && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20 text-warning">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <p className="text-sm">Running low on storage space.</p>
            </div>
          )}

          {/* File Type Breakdown */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-lg bg-primary/10 text-center">
              <Image className="w-5 h-5 mx-auto mb-1 text-primary" />
              <p className="text-lg font-bold text-foreground">{imageCount}</p>
              <p className="text-xs text-muted-foreground">Images</p>
            </div>
            <div className="p-3 rounded-lg bg-danger/10 text-center">
              <FileText className="w-5 h-5 mx-auto mb-1 text-danger" />
              <p className="text-lg font-bold text-foreground">{pdfCount}</p>
              <p className="text-xs text-muted-foreground">PDFs</p>
            </div>
            <div className="p-3 rounded-lg bg-muted text-center">
              <File className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-lg font-bold text-foreground">{otherCount}</p>
              <p className="text-xs text-muted-foreground">Others</p>
            </div>
          </div>
        </CardContent>
      </Card>

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
          <SelectTrigger className="w-full sm:w-36">
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
        <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
          <span className="text-sm font-medium">
            {selectedFiles.length} file(s) selected
          </span>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleDeleteSelected}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
      )}

      {/* File List */}
      <Card className="shadow-card">
        <CardContent className="p-0">
          {filteredFiles.length > 0 ? (
            <div className="divide-y divide-border">
              {/* Select All Header */}
              <div className="flex items-center gap-3 p-3 border-b border-border bg-muted/30">
                <Checkbox
                  checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
                <span className="text-xs text-muted-foreground">
                  {filteredFiles.length} files ({formatBytes(filteredFiles.reduce((acc, f) => acc + f.size, 0))})
                </span>
              </div>

              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className={`
                    flex items-center gap-3 p-3 transition-colors
                    ${selectedFiles.includes(file.id) ? 'bg-primary/5' : ''}
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
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
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
                      onClick={() => window.open(file.url, '_blank')}
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
        </CardContent>
      </Card>

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
    </div>
  );
}
