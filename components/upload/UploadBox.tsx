'use client';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileSpreadsheet, X } from 'lucide-react';
import { cn, formatBytes } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface UploadBoxProps {
  onFile: (file: File) => void;
  file?: File | null;
  onReset?: () => void;
  loading?: boolean;
  maxSizeMB?: number;
}

export function UploadBox({ onFile, file, onReset, loading, maxSizeMB = 50 }: UploadBoxProps) {
  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) onFile(accepted[0]);
  }, [onFile]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxSize: maxSizeMB * 1024 * 1024,
    disabled: loading,
    multiple: false,
  });

  if (file) {
    return (
      <div className="card border-[rgba(0,245,170,0.2)] bg-[rgba(0,245,170,0.03)] p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-[rgba(0,245,170,0.1)] flex items-center justify-center flex-shrink-0">
          <FileSpreadsheet size={20} className="text-[#00f5aa]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{file.name}</p>
          <p className="text-xs text-[#52525b] mt-0.5">{formatBytes(file.size)}</p>
        </div>
        {!loading && (
          <button onClick={onReset} className="text-[#52525b] hover:text-[#f87171] transition-colors p-1.5 rounded-lg hover:bg-[rgba(248,113,113,0.08)]">
            <X size={16} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border border-dashed rounded-xl p-10 flex flex-col items-center gap-4 cursor-pointer transition-all',
        isDragActive && !isDragReject
          ? 'border-[#00f5aa] bg-[rgba(0,245,170,0.05)]'
          : isDragReject
          ? 'border-[#f87171] bg-[rgba(248,113,113,0.05)]'
          : 'border-[#27272a] hover:border-[#3f3f46] hover:bg-white/[0.015]'
      )}
    >
      <input {...getInputProps()} />
      <div className={cn(
        'w-14 h-14 rounded-2xl flex items-center justify-center transition-colors',
        isDragActive && !isDragReject ? 'bg-[rgba(0,245,170,0.12)]' : 'bg-[#141416]'
      )}>
        <Upload size={24} className={isDragActive && !isDragReject ? 'text-[#00f5aa]' : 'text-[#52525b]'} />
      </div>

      <div className="text-center">
        <p className="text-sm font-medium mb-1">
          {isDragReject
            ? 'File type not supported'
            : isDragActive
            ? 'Drop your file here'
            : 'Drop CSV or Excel here'}
        </p>
        <p className="text-xs text-[#52525b]">
          {isDragReject ? 'Only .csv, .xlsx, .xls files are accepted' : `CSV, XLSX, XLS · Max ${maxSizeMB}MB`}
        </p>
      </div>

      <Button variant="ghost" size="sm" type="button">Browse files</Button>
    </div>
  );
}
