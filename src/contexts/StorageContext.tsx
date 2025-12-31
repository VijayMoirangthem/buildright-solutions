import React, { createContext, useContext, useState, useEffect } from 'react';

export interface StoredFile {
  id: string;
  name: string;
  url: string;
  size: number; // in bytes
  type: string;
  uploadedAt: string;
  linkedTo?: {
    type: 'client' | 'labour' | 'resource' | 'project';
    id: string;
    recordId?: string;
  };
}

interface StorageContextType {
  files: StoredFile[];
  totalStorage: number; // 5GB in bytes
  usedStorage: number;
  remainingStorage: number;
  usagePercentage: number;
  isWarning: boolean; // 80%+
  isCritical: boolean; // 90%+
  addFile: (file: Omit<StoredFile, 'id' | 'uploadedAt'>) => StoredFile;
  deleteFile: (fileId: string) => void;
  deleteFiles: (fileIds: string[]) => void;
  getFilesByLink: (type: string, id: string, recordId?: string) => StoredFile[];
  formatBytes: (bytes: number) => string;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

const TOTAL_STORAGE = 5 * 1024 * 1024 * 1024; // 5GB in bytes
const STORAGE_KEY = 'app_stored_files';

// Demo files to simulate existing uploads
const demoFiles: StoredFile[] = [
  {
    id: 'demo-1',
    name: 'cement_receipt_july.pdf',
    url: '/placeholder.svg',
    size: 245000,
    type: 'application/pdf',
    uploadedAt: '2024-07-15T10:30:00',
    linkedTo: { type: 'client', id: '1', recordId: 'f1' },
  },
  {
    id: 'demo-2',
    name: 'steel_delivery_photo.jpg',
    url: '/placeholder.svg',
    size: 1200000,
    type: 'image/jpeg',
    uploadedAt: '2024-08-01T14:20:00',
    linkedTo: { type: 'client', id: '1', recordId: 'f2' },
  },
  {
    id: 'demo-3',
    name: 'project_blueprint.pdf',
    url: '/placeholder.svg',
    size: 3500000,
    type: 'application/pdf',
    uploadedAt: '2024-08-15T09:00:00',
    linkedTo: { type: 'project', id: '1' },
  },
];

export function StorageProvider({ children }: { children: React.ReactNode }) {
  const [files, setFiles] = useState<StoredFile[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return demoFiles;
      }
    }
    return demoFiles;
  });

  // Save to localStorage whenever files change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
  }, [files]);

  const usedStorage = files.reduce((acc, file) => acc + file.size, 0);
  const remainingStorage = TOTAL_STORAGE - usedStorage;
  const usagePercentage = (usedStorage / TOTAL_STORAGE) * 100;
  const isWarning = usagePercentage >= 80;
  const isCritical = usagePercentage >= 90;

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const addFile = (file: Omit<StoredFile, 'id' | 'uploadedAt'>): StoredFile => {
    const newFile: StoredFile = {
      ...file,
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      uploadedAt: new Date().toISOString(),
    };
    setFiles(prev => [...prev, newFile]);
    return newFile;
  };

  const deleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const deleteFiles = (fileIds: string[]) => {
    setFiles(prev => prev.filter(f => !fileIds.includes(f.id)));
  };

  const getFilesByLink = (type: string, id: string, recordId?: string): StoredFile[] => {
    return files.filter(f => {
      if (!f.linkedTo) return false;
      if (f.linkedTo.type !== type || f.linkedTo.id !== id) return false;
      if (recordId && f.linkedTo.recordId !== recordId) return false;
      return true;
    });
  };

  return (
    <StorageContext.Provider
      value={{
        files,
        totalStorage: TOTAL_STORAGE,
        usedStorage,
        remainingStorage,
        usagePercentage,
        isWarning,
        isCritical,
        addFile,
        deleteFile,
        deleteFiles,
        getFilesByLink,
        formatBytes,
      }}
    >
      {children}
    </StorageContext.Provider>
  );
}

export function useStorage() {
  const context = useContext(StorageContext);
  if (context === undefined) {
    throw new Error('useStorage must be used within a StorageProvider');
  }
  return context;
}
