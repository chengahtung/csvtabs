'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  UploadCloud, 
  FileText, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Download, 
  Menu, 
  Settings 
} from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Logo } from '@/lib/LogoComponent';

const CONFIG = {
  maxFiles: 10,
  maxFileSizeMB: 10,
  maxTotalSizeMB: 50,
  allowedExtensions: ['csv'],
  maxSheetNameLength: 31,
  defaultExcelFilename: 'Combined_csvTabs',
  excelForbiddenCharsRegex: /[\\\/\?\*\[\]:]/g,
};

function trackEvent(eventName: string, properties: Record<string, any> = {}) {
  // Future: window.plausible?.(eventName, { props: properties });
  // Future: window.umami?.track(eventName, properties);
  console.debug('[Analytics stub]', eventName, properties);
}

type FileStatus = 'Ready' | 'Parsing Error' | 'Empty';

interface FileEntry {
  id: string;
  file: File;
  originalName: string;
  resolvedTabName: string;
  size: number;
  status: FileStatus;
  parseError?: boolean;
  data?: any[];
}

export default function CSVCombiner() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [filename, setFilename] = useState(CONFIG.defaultExcelFilename);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'error' | 'success'>('error');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    trackEvent('page_view');
  }, []);

  const showToast = (msg: string, type: 'error' | 'success' = 'error') => {
    setToastMessage(msg);
    setToastType(type);
    if (type === 'error') trackEvent('validation_error', { reason: msg });
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleBugReport = () => {
    // Strips any sensitive query parameters, e.g. tokens.
    const safeUrl = window.location.origin + window.location.pathname;
    const url = `https://docs.google.com/forms/d/e/1FAIpQLScGfjYKFXuTmqNwC-lKpZX_aNRYlZ1EV8wMx1ZO3hXf_Kvutw/viewform?usp=pp_url&entry.1011504990=${encodeURIComponent(window.navigator.userAgent)}&entry.235553531=${encodeURIComponent(safeUrl)}`;
    window.open(url, '_blank');
  };

  const resolveTabName = (originalName: string, existingNames: string[], index: number): string | null => {
    let name = originalName.replace(/\.csv$/i, '');
    name = name.replace(CONFIG.excelForbiddenCharsRegex, '');
    if (name.length > CONFIG.maxSheetNameLength) {
      name = name.substring(0, CONFIG.maxSheetNameLength);
    }
    if (name.trim() === '') {
      name = `Sheet_${index + 1}`;
    }
    const isDuplicate = existingNames.some(existing => existing.toLowerCase() === name.toLowerCase());
    if (isDuplicate) {
      return null;
    }
    return name;
  };

  const handleFiles = (newFiles: File[]) => {
    if (files.length >= CONFIG.maxFiles) {
      showToast(`You've reached the maximum of ${CONFIG.maxFiles} files. Remove a file to add more.`);
      return;
    }

    let currentTotalSize = files.reduce((sum, f) => sum + f.size, 0);
    const existingNames = files.map(f => f.resolvedTabName);
    const existingOriginalNames = files.map(f => f.originalName.toLowerCase());
    
    const validEntries: FileEntry[] = [];

    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      
      if (files.length + validEntries.length >= CONFIG.maxFiles) {
        showToast(`You've reached the maximum of ${CONFIG.maxFiles} files. Remove a file to add more.`);
        break;
      }

      if (!file.name.toLowerCase().endsWith('.csv')) {
        showToast(`"${file.name}" is not a CSV file. Only .csv files are accepted.`);
        continue;
      }

      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > CONFIG.maxFileSizeMB) {
        showToast(`"${file.name}" exceeds the ${CONFIG.maxFileSizeMB} MB file size limit and was not added.`);
        continue;
      }

      if (currentTotalSize + file.size > CONFIG.maxTotalSizeMB * 1024 * 1024) {
        showToast(`Adding "${file.name}" would exceed the ${CONFIG.maxTotalSizeMB} MB total limit. Remove some files first.`);
        continue;
      }

      if (existingOriginalNames.includes(file.name.toLowerCase())) {
        showToast(`"${file.name}" is already in the list. Duplicate filenames are not allowed.`);
        continue;
      }

      const resolvedName = resolveTabName(file.name, existingNames, files.length + validEntries.length);
      if (!resolvedName) {
        showToast(`"${file.name}" produces a tab name that conflicts with an existing file. Please rename the file before uploading.`);
        continue;
      }

      currentTotalSize += file.size;
      existingNames.push(resolvedName);
      existingOriginalNames.push(file.name.toLowerCase());

      validEntries.push({
        id: Math.random().toString(36).substring(7),
        file,
        originalName: file.name,
        resolvedTabName: resolvedName,
        size: file.size,
        status: 'Ready'
      });
    }

    if (validEntries.length > 0) {
      setFiles(prev => [...prev, ...validEntries]);
      trackEvent('files_uploaded', { count: validEntries.length });
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (files.length < CONFIG.maxFiles) {
      setIsDragging(true);
    }
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (files.length >= CONFIG.maxFiles) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const generateExcel = async () => {
    if (files.length === 0) return;
    
    setIsGenerating(true);
    
    try {
      const parsedFiles = await Promise.all(files.map(fileEntry => {
        return new Promise<FileEntry>((resolve) => {
          Papa.parse(fileEntry.file, {
            header: true,
            dynamicTyping: false,
            skipEmptyLines: true,
            encoding: 'UTF-8',
            complete: (results) => {
              if (results.data.length === 0) {
                resolve({ ...fileEntry, status: 'Empty', data: results.meta.fields ? [results.meta.fields] : [] });
              } else {
                resolve({ ...fileEntry, status: 'Ready', data: results.data });
              }
            },
            error: (error) => {
              console.error("Parse error:", error);
              resolve({ ...fileEntry, status: 'Parsing Error', parseError: true });
            }
          });
        });
      }));

      const wb = XLSX.utils.book_new();

      parsedFiles.forEach((fileEntry) => {
        let ws;
        if (fileEntry.parseError) {
          ws = XLSX.utils.aoa_to_sheet([
            ["Error: This file could not be parsed. It may be corrupted or in an unsupported format."]
          ]);
        } else if (fileEntry.status === 'Empty' && (!fileEntry.data || fileEntry.data.length === 0)) {
           ws = XLSX.utils.aoa_to_sheet([[]]);
        } else {
          ws = XLSX.utils.json_to_sheet(fileEntry.data || []);
        }
        XLSX.utils.book_append_sheet(wb, ws, fileEntry.resolvedTabName);
      });

      const finalFilename = (filename.trim() || CONFIG.defaultExcelFilename).replace(CONFIG.excelForbiddenCharsRegex, '');
      XLSX.writeFile(wb, `${finalFilename}.xlsx`);
      
      showToast('✓ Downloaded!', 'success');
      trackEvent('excel_downloaded', { 
        fileCount: files.length, 
        totalSizeMB: files.reduce((sum, f) => sum + f.size, 0) / (1024 * 1024) 
      });
      
      setFiles(parsedFiles.map(f => ({...f, data: undefined})));
      
    } catch (error) {
      console.error(error);
      showToast('Something went wrong while creating your Excel file. Please try again. If the problem persists, try with fewer files.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-blue-100">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-md w-full ${
            toastType === 'success' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-red-50 text-red-900 border border-red-200'
          }`}>
            {toastType === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />}
            <p className="text-sm font-medium">{toastMessage}</p>
            <button onClick={() => setToastMessage(null)} className="ml-auto text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
            <Logo size="md" />
            <span>CSV Tabs</span>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#how-to" className="hover:text-blue-600 transition-colors">How to</a>
            <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
            <button onClick={handleBugReport} className="hover:text-blue-600 transition-colors">Report a bug</button>
          </nav>

          {/* Mobile Nav Toggle */}
          <button 
            className="md:hidden p-2 text-slate-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Nav Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 flex flex-col gap-4 text-sm font-medium text-slate-600 shadow-lg absolute w-full">
            <a href="#how-to" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-600">How to</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-600">About</a>
            <button onClick={() => {
              setMobileMenuOpen(false);
              handleBugReport();
            }} className="hover:text-blue-600">Report a bug</button>
          </div>
        )}
      </header>

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-10 md:py-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            Convert Multiple CSVs to Excel Tabs
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Instantly import multiple CSV files into separate tabs (sheets) inside a single Excel workbook. 100% free and private.
          </p>
        </div>

        {/* Main Tool Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 mb-16">
          {/* Drop Zone */}
          <div className="mb-8">
            <input
              type="file"
              multiple
              accept=".csv"
              className="hidden"
              ref={fileInputRef}
              onChange={onFileInputChange}
              disabled={files.length >= CONFIG.maxFiles}
            />
            
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => files.length < CONFIG.maxFiles && fileInputRef.current?.click()}
              className={`
                relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-200 ease-in-out
                flex flex-col items-center justify-center p-10 md:p-16 text-center
                ${files.length >= CONFIG.maxFiles 
                  ? 'bg-slate-50 border-slate-200 cursor-not-allowed opacity-70' 
                  : isDragging 
                    ? 'bg-blue-50 border-blue-400 scale-[1.02]' 
                    : 'bg-slate-50 border-slate-300 hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer'
                }
              `}
            >
              {files.length >= CONFIG.maxFiles ? (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8 text-slate-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">Maximum Files Reached</h3>
                  <p className="text-slate-500">Remove a file to add more.</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${isDragging ? 'bg-blue-100 text-blue-600' : 'bg-white shadow-sm text-slate-500 border border-slate-100'}`}>
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2 hidden md:block">
                    Drag & drop CSV files here
                  </h3>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2 md:hidden">
                    Tap to select CSV files
                  </h3>
                  <p className="text-slate-500 mb-4 hidden md:block">or click to browse from your computer</p>
                  
                  <div className="flex flex-col items-center gap-2 mt-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500 bg-white shadow-sm border border-slate-200 px-3 py-1 rounded-full">
                      <span>{files.length} / {CONFIG.maxFiles} files</span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">Max total upload size: {CONFIG.maxTotalSizeMB}MB</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                  Selected Files ({files.length})
                </h2>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Tab names limited to 31 chars
                </span>
              </div>
              
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <ul className="divide-y divide-slate-100">
                  {files.map((file) => (
                    <li key={file.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors group">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 text-blue-600">
                        <FileText className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {file.originalName}
                          </p>
                          <span className="text-xs text-slate-400 shrink-0">
                            ({formatBytes(file.size)})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 truncate">
                            Tab: {file.resolvedTabName}
                          </span>
                          
                          {file.status === 'Parsing Error' && (
                            <span className="text-[10px] uppercase tracking-wider font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                              Parsing Error
                            </span>
                          )}
                          {file.status === 'Empty' && (
                            <span className="text-[10px] uppercase tracking-wider font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                              Empty
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => removeFile(file.id)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                        aria-label="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Action Area */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label htmlFor="filename" className="block text-sm font-medium text-slate-700 mb-2">
                  Excel Filename
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="filename"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    className="w-full pl-4 pr-12 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 font-medium shadow-sm"
                    placeholder="Combined_csvTabs"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <span className="text-slate-400 font-medium">.xlsx</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={generateExcel}
                disabled={files.length === 0 || isGenerating || !filename.trim()}
                className={`
                  w-full md:w-auto px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-sm
                  ${files.length === 0 || !filename.trim()
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : isGenerating
                      ? 'bg-blue-600 text-white opacity-80 cursor-wait'
                      : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:scale-[0.98]'
                  }
                `}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Generate Excel
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* How To Section */}
        <section id="how-to" className="mt-16 pt-16 border-t border-slate-200 scroll-mt-24">
          <h2 className="text-3xl font-bold mb-10 text-center text-slate-900">How to convert CSVs to Excel Tabs</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-100">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">1. Upload CSV files</h3>
              <p className="text-slate-600 leading-relaxed">Drag and drop your CSV files into the upload area. You can add up to 10 files at once.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-100">
                <Settings className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">2. Review & Rename</h3>
              <p className="text-slate-600 leading-relaxed">The tool automatically cleans filenames for valid Excel tabs. Enter a custom name for your final workbook.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-100">
                <Download className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">3. Download Excel</h3>
              <p className="text-slate-600 leading-relaxed">Click generate and your new Excel file will download instantly. All processing happens securely in your browser.</p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="mt-16 pt-16 border-t border-slate-200 max-w-3xl mx-auto text-center scroll-mt-24">
          <h2 className="text-3xl font-bold mb-6 text-slate-900">About this tool</h2>
          <div className="text-slate-600 leading-relaxed space-y-4 text-left">
            <p>
              There are many &quot;CSV Combiner&quot; tools on the internet, but most of them work by merging your data <em>vertically</em> stacking the rows of multiple CSV files into one giant list. 
            </p>
            <p>
              <strong>CSV Tabs</strong> is different. It takes your multiple CSV files and imports each one into its own separate worksheet (tab) within a single Excel (<code>.xlsx</code>) workbook. This is perfect for organizing monthly reports, separating data by category, or keeping distinct datasets together in one file without mixing the rows.
            </p>
            <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-3">100% Private & Secure</h3>
            <p>
              Your data is never uploaded to a server. All processing—parsing the CSVs and generating the Excel file happens entirely within your web browser using JavaScript. This means it&apos;s incredibly fast and completely safe for sensitive, confidential, or proprietary data.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12 mt-16">
        <div className="max-w-5xl mx-auto px-4 flex flex-col items-center justify-center gap-6">
          <div className="flex items-center gap-2 font-bold text-xl text-slate-800 opacity-80 hover:opacity-100 transition-opacity">
            <Logo size="md" />
            <span>CSV Tabs</span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-blue-600 transition-colors">Home</a>
            <a href="#how-to" className="hover:text-blue-600 transition-colors">How to Use</a>
            <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
            <button onClick={handleBugReport} className="hover:text-blue-600 transition-colors">Report a bug</button>
          </div>
          
          <div className="text-slate-500 text-sm mt-4 text-center space-y-2">
            <p>&copy; {new Date().getFullYear()} CSV Tabs. All rights reserved.</p>
            <p>Created by <a href="https://github.com/chengahtung/csvtabs" className="text-slate-700 hover:text-blue-600 transition-colors font-medium underline underline-offset-4">Cheng Zhen Tung</a>.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
