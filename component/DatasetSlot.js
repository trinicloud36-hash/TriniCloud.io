import React, { useState } from 'react';
import { Upload, Link, FileText, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

const DatasetSlot = ({ slotNumber, dataset, onUpload, onDelete, onActivate, isActive }) => {
  const [uploadType, setUploadType] = useState('url');
  const [urlInput, setUrlInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) return;

    setIsProcessing(true);
    
    setTimeout(() => {
      onUpload(slotNumber, {
        type: 'url',
        source: urlInput,
        name: new URL(urlInput).hostname,
        timestamp: new Date().toISOString()
      });
      setUrlInput('');
      setIsProcessing(false);
    }, 1500);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      setIsProcessing(true);
      
      setTimeout(() => {
        onUpload(slotNumber, {
          type: 'file',
          source: file.name,
          name: file.name,
          size: file.size,
          fileType: file.type,
          timestamp: new Date().toISOString()
        });
        setIsProcessing(false);
      }, 1500);
    });
    
    e.target.value = '';
  };

  return (
    <div className={`border-2 rounded-xl p-6 transition-all ${
      isActive 
        ? 'border-blue-500 bg-blue-50 shadow-lg' 
        : 'border-gray-300 bg-white hover:border-gray-400'
    }`}>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
            isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            {slotNumber}
          </div>
          <div>
            <h3 className="font-bold text-lg">Dataset Slot {slotNumber}</h3>
            <p className="text-sm text-gray-500">
              {dataset.documents.length} document{dataset.documents.length !== 1 ? 's' : ''} loaded
            </p>
          </div>
        </div>
        
        {dataset.documents.length > 0 && (
          <button
            onClick={() => onActivate(slotNumber)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isActive
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {isActive ? '✓ Active' : 'Activate'}
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setUploadType('url')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            uploadType === 'url'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Link className="inline w-4 h-4 mr-2" />
          URL
        </button>
        <button
          onClick={() => setUploadType('file')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            uploadType === 'file'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Upload className="inline w-4 h-4 mr-2" />
          Upload
        </button>
      </div>

      {uploadType === 'url' && (
        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com or Google Docs link..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isProcessing}
              onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
            />
            <button
              onClick={handleUrlSubmit}
              disabled={isProcessing || !urlInput.trim()}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? 'Processing...' : 'Add'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Supports: Websites, Google Docs, Sheets, Slides, Drive links
          </p>
        </div>
      )}

      {uploadType === 'file' && (
        <div className="mb-4">
          <label className="block">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
              <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="font-medium text-gray-700 mb-1">Click to upload files</p>
              <p className="text-sm text-gray-500">PDF, DOCX, TXT, CSV, XLSX, PPT, and more</p>
            </div>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls,.ppt,.pptx"
              disabled={isProcessing}
            />
          </label>
        </div>
      )}

      {dataset.documents.length > 0 && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h4 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Loaded Documents
          </h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {dataset.documents.map((doc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {doc.type === 'url' ? (
                    <Link className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  ) : (
                    <FileText className="w-4 h-4 text-green-500 flex-shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{doc.name}</p>
                    <p className="text-xs text-gray-500 truncate">{doc.source}</p>
                  </div>
                </div>
                <button
                  onClick={() => onDelete(slotNumber, idx)}
                  className="text-red-500 hover:text-red-700 p-1 flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {dataset.documents.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No documents loaded in this slot</p>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [datasets, setDatasets] = useState([
    { id: 1, name: 'Dataset 1', documents: [] },
    { id: 2, name: 'Dataset 2', documents: [] },
    { id: 3, name: 'Dataset 3', documents: [] }
  ]);
  const [activeSlot, setActiveSlot] = useState(null);

  const handleUpload = (slotNumber, document) => {
    setDatasets(prev => prev.map((ds, idx) => 
      idx + 1 === slotNumber
        ? { ...ds, documents: [...ds.documents, document] }
        : ds
    ));
    
    if (datasets[slotNumber - 1].documents.length === 0) {
      setActiveSlot(slotNumber);
    }
  };

  const handleDelete = (slotNumber, docIndex) => {
    setDatasets(prev => prev.map((ds, idx) => 
      idx + 1 === slotNumber
        ? { ...ds, documents: ds.documents.filter((_, i) => i !== docIndex) }
        : ds
    ));
  };

  const handleActivate = (slotNumber) => {
    setActiveSlot(slotNumber);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Kimi K2 Platform</h1>
          <p className="text-lg text-gray-600">
            Three-Slot Dataset Manager • Single AI Agent Architecture
          </p>
        </div>

        {activeSlot && (
          <div className="bg-green-50 border-2 border-green-500 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-bold text-green-900">Active AI Context: Dataset Slot {activeSlot}</h3>
                <p className="text-sm text-green-700">
                  The AI agent is now operating on {datasets[activeSlot - 1].documents.length} document(s) from this slot only
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {datasets.map((dataset, idx) => (
            <DatasetSlot
              key={dataset.id}
              slotNumber={idx + 1}
              dataset={dataset}
              onUpload={handleUpload}
              onDelete={handleDelete}
              onActivate={handleActivate}
              isActive={activeSlot === idx + 1}
            />
          ))}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-blue-900 mb-2">How It Works:</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="font-bold mt-0.5">1.</span>
              <span>Upload URLs or files to any of the three slots</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold mt-0.5">2.</span>
              <span>Each slot creates an isolated dataset environment</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold mt-0.5">3.</span>
              <span>Click "Activate" to switch the AI agent's context to that slot</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold mt-0.5">4.</span>
              <span>The AI only sees and responds based on the active slot's documents</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
