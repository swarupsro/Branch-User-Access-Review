import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

interface ParsedAccessData {
  userId: string;
  userName: string;
  role: string;
  permissions: string[];
  system: string;
  lastReview: string;
  status: string;
}

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedAccessData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      handleFileSelected(droppedFile);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      handleFileSelected(selectedFile);
    }
  };

  const handleFileSelected = (selectedFile: File) => {
    // Reset states
    setUploadSuccess(false);
    setUploadError(null);
    setParsedData([]);
    
    // Check file type
    if (!selectedFile.name.endsWith('.csv')) {
      setUploadError('Please upload a CSV file');
      return;
    }
    
    // Check file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setUploadError('File size exceeds the maximum limit of 5MB');
      return;
    }
    
    setFile(selectedFile);
  };

  const processFile = () => {
    if (!file) return;
    
    setIsProcessing(true);
    setUploadError(null);
    
    // In a real app, you would send this to your backend for processing
    // Here we'll simulate parsing the CSV file
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const lines = content.split('\n');
        
        // Basic validation of CSV format
        if (lines.length < 2) {
          throw new Error('The CSV file must contain a header row and at least one data row');
        }
        
        const headerRow = lines[0].split(',');
        const requiredHeaders = ['userId', 'userName', 'role', 'permissions', 'system', 'lastReview', 'status'];
        
        // Check if all required headers are present
        const missingHeaders = requiredHeaders.filter(header => !headerRow.includes(header));
        if (missingHeaders.length > 0) {
          throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
        }
        
        // Parse the data rows
        const data: ParsedAccessData[] = [];
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue; // Skip empty lines
          
          const values = lines[i].split(',');
          if (values.length !== headerRow.length) {
            throw new Error(`Line ${i + 1} has incorrect number of columns`);
          }
          
          const rowData: any = {};
          headerRow.forEach((header, index) => {
            if (header === 'permissions') {
              // Split permissions into an array
              rowData[header] = values[index].split(';').map(p => p.trim());
            } else {
              rowData[header] = values[index].trim();
            }
          });
          
          data.push(rowData as ParsedAccessData);
        }
        
        // Log the upload event (in a real app, this would be a server-side audit log)
        console.log(`[AUDIT] User ${user?.id} uploaded access data file "${file.name}" at ${new Date().toISOString()}`);
        
        // Set the parsed data and update state
        setParsedData(data);
        setUploadSuccess(true);
        setIsProcessing(false);
        
        // Simulate a delay before redirecting to the review page
        setTimeout(() => {
          // In a real app, you would store this data in state management or pass via URL/localStorage
          navigate('/review', { state: { accessData: data } });
        }, 1500);
        
      } catch (error) {
        console.error('Error processing CSV:', error);
        setUploadError((error as Error).message || 'Failed to process the CSV file');
        setIsProcessing(false);
      }
    };
    
    reader.onerror = () => {
      setUploadError('Failed to read the file');
      setIsProcessing(false);
    };
    
    reader.readAsText(file);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setFile(null);
    setUploadSuccess(false);
    setUploadError(null);
    setParsedData([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Upload size={24} className="text-[#0A2463] mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">Upload Access Data</h1>
        </div>
        <p className="text-gray-600 mb-6">
          Upload a CSV file containing user access permissions data for your branch. The system will validate the file format and prepare the data for your review.
        </p>

        {uploadSuccess ? (
          <div className="rounded-lg bg-green-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Upload successful</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>File processed successfully. Redirecting to review page...</p>
                </div>
              </div>
            </div>
          </div>
        ) : uploadError ? (
          <div className="rounded-lg bg-red-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Upload failed</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{uploadError}</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6">
          <div
            className={`flex flex-col items-center justify-center ${
              isDragging ? 'bg-blue-50 border-blue-300' : ''
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileInputChange}
            />
            
            {file ? (
              <div className="w-full">
                <div className="flex items-center justify-between p-3 bg-white rounded border border-gray-200 mb-3">
                  <div className="flex items-center">
                    <FileText size={24} className="text-[#0A2463] mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    className="p-1 rounded-full hover:bg-gray-100"
                    aria-label="Remove file"
                  >
                    <X size={18} className="text-gray-500" />
                  </button>
                </div>
                
                <button
                  type="button"
                  onClick={processFile}
                  disabled={isProcessing}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0A2463] hover:bg-[#143594] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A2463] disabled:opacity-50 transition-colors duration-200"
                >
                  {isProcessing ? (
                    <>
                      <LoadingSpinner size="small" color="#ffffff" />
                      <span className="ml-2">Processing...</span>
                    </>
                  ) : (
                    <>Process File</>
                  )}
                </button>
              </div>
            ) : (
              <>
                <Upload size={36} className="text-gray-400 mb-2" />
                <p className="text-lg font-medium text-gray-900 mb-1">
                  Drag and drop your CSV file here
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  or <button type="button" className="text-[#0A2463] font-medium hover:underline" onClick={handleBrowseClick}>browse</button> to upload
                </p>
                <p className="text-xs text-gray-500">Maximum file size: 5MB</p>
              </>
            )}
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">CSV Format Requirements</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p className="mb-1">Your CSV file must include the following columns:</p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                  <li>userId - Unique identifier for each user</li>
                  <li>userName - Full name of the user</li>
                  <li>role - User's job role</li>
                  <li>permissions - List of permissions (semicolon separated)</li>
                  <li>system - The system these permissions apply to</li>
                  <li>lastReview - Date of last review</li>
                  <li>status - Current status (Active/Inactive)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Sample CSV Template</h2>
        <p className="text-sm text-gray-600 mb-4">
          You can download this sample template and fill it with your branch's user data:
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">userId</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">userName</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">permissions</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">system</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">lastReview</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">U12345</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">John Smith</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Teller</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">view_accounts;process_transactions;print_statements</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Core Banking</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-03-15</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Active</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">U67890</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jane Doe</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Loan Officer</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">view_accounts;approve_loans;credit_check</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Loan System</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-04-20</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Active</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A2463] transition-colors duration-200"
          >
            <FileText size={16} className="mr-2" />
            Download Sample CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;