'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type SavedMap = {
  id: string;
  name: string;
  url: string;
  date: string;
};

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [savedMaps, setSavedMaps] = useState<SavedMap[]>([]);
  const [showSavedMaps, setShowSavedMaps] = useState(false);
  const router = useRouter();

  // Load saved maps from localStorage on component mount
  useEffect(() => {
    const loadSavedMaps = () => {
      const maps = localStorage.getItem('worldWeaverMaps');
      if (maps) {
        setSavedMaps(JSON.parse(maps));
      } else {
        // Demo data for first time users
        const demoMaps = [
          { 
            id: 'demo1', 
            name: 'Fantasy Islands', 
            url: '/map-bg.jpg', 
            date: new Date().toLocaleDateString() 
          },
          { 
            id: 'demo2', 
            name: 'Mountain Kingdom', 
            url: '/map-mountain.jpeg', 
            date: new Date().toLocaleDateString() 
          }
        ];
        localStorage.setItem('worldWeaverMaps', JSON.stringify(demoMaps));
        setSavedMaps(demoMaps);
      }
    };

    loadSavedMaps();
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const uploadedFile = e.dataTransfer.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      
      if (validTypes.includes(uploadedFile.type)) {
        setFile(uploadedFile);
      } else {
        alert('Please upload a valid image file (JPG, PNG, GIF, or WEBP)');
      }
    }
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const uploadedFile = e.target.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      
      if (validTypes.includes(uploadedFile.type)) {
        setFile(uploadedFile);
      } else {
        alert('Please upload a valid image file (JPG, PNG, GIF, or WEBP)');
      }
    }
  }, []);

  const handleCreateWorld = useCallback(() => {
    if (!file) {
      alert('Please upload a map image first');
      return;
    }
    
    // In a real application, you would upload the file to your server here
    // For now, save to localStorage and navigate to world creation
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const newMap: SavedMap = {
        id: `map-${Date.now()}`,
        name: file.name,
        url: e.target?.result as string,
        date: new Date().toLocaleDateString()
      };
      
      // Save to localStorage
      const existingMaps = localStorage.getItem('worldWeaverMaps');
      const maps = existingMaps ? [...JSON.parse(existingMaps), newMap] : [newMap];
      localStorage.setItem('worldWeaverMaps', JSON.stringify(maps));
      
      // Navigate to create-world with the id
      router.push(`/create-world?mapId=${newMap.id}`);
    };
    
    fileReader.readAsDataURL(file);
  }, [file, router]);

  const selectSavedMap = (mapId: string) => {
    router.push(`/create-world?mapId=${mapId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-emerald-50">
      <header className="bg-gray-800 p-4 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold header-logo">WORLD WEAVER</h1>
          <div className="flex space-x-4">
            <Link href="/upload" className="text-white hover:text-emerald-300 font-medium">
              Maps
            </Link>
            <Link href="/" className="text-white hover:text-emerald-300 font-medium">
              Home
            </Link>
          </div>
        </div>
      </header>
      
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-4xl p-8 bg-white rounded-2xl shadow-md modern-card">
          <h1 className="text-4xl font-bold text-center mb-8 section-title">LOAD MAP</h1>
          
          <div className="flex justify-center mb-6 space-x-4">
            <button 
              onClick={() => setShowSavedMaps(false)}
              className={`px-6 py-2 square-button ${!showSavedMaps ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Upload New Map
            </button>
            <button 
              onClick={() => setShowSavedMaps(true)}
              className={`px-6 py-2 square-button ${showSavedMaps ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Saved Maps ({savedMaps.length})
            </button>
          </div>
          
          {!showSavedMaps ? (
            <>
              <div 
                className={`bg-gray-50 w-full max-w-2xl mx-auto p-12 mb-8 rounded-lg border-2 border-dashed ${
                  isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300'
                } flex items-center justify-center`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="text-center">
                  {file ? (
                    <div className="flex flex-col items-center">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt="Uploaded map" 
                        className="max-h-64 mb-4 border border-gray-200 rounded-lg shadow-sm"
                      />
                      <p className="text-gray-700 font-medium">{file.name}</p>
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-500 mb-4 font-medium text-xl">Drag file here</p>
                      <input
                        type="file"
                        id="map-upload"
                        accept=".jpg,.jpeg,.png,.gif,.webp"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <label 
                        htmlFor="map-upload" 
                        className="cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-6 square-button"
                      >
                        Select File
                      </label>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex justify-center">
                <button
                  onClick={handleCreateWorld}
                  disabled={!file}
                  className={`py-3 px-10 text-white square-button ${
                    file ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-gray-300 opacity-50 cursor-not-allowed'
                  }`}
                >
                  Create your world!
                </button>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {savedMaps.map((map) => (
                <div 
                  key={map.id} 
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-emerald-400 cursor-pointer modern-card"
                  onClick={() => selectSavedMap(map.id)}
                >
                  <div className="h-40 overflow-hidden rounded-lg mb-2 bg-white flex items-center justify-center border border-gray-200">
                    <img src={map.url} alt={map.name} className="max-h-full object-contain" />
                  </div>
                  <h3 className="font-bold text-gray-800">{map.name}</h3>
                  <p className="text-gray-500 text-sm">Created: {map.date}</p>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-8">
            <Link href="/" className="text-emerald-600 hover:text-emerald-700 font-medium">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 