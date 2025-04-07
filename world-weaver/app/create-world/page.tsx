'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type Quest = {
  id: string;
  title: string;
  description: string;
};

type Asset = {
  id: string;
  name: string;
  type: 'character' | 'item' | 'location';
  description: string;
};

type SavedMap = {
  id: string;
  name: string;
  url: string;
  date: string;
};

export default function CreateWorldPage() {
  const [worldName, setWorldName] = useState('');
  const [quests, setQuests] = useState<Quest[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [currentMap, setCurrentMap] = useState<SavedMap | null>(null);
  
  const searchParams = useSearchParams();
  const mapId = searchParams.get('mapId');
  
  // Load the map from localStorage using the mapId
  useEffect(() => {
    if (mapId) {
      const savedMapsJson = localStorage.getItem('worldWeaverMaps');
      if (savedMapsJson) {
        const savedMaps: SavedMap[] = JSON.parse(savedMapsJson);
        const map = savedMaps.find(m => m.id === mapId);
        if (map) {
          setCurrentMap(map);
          // Set default world name based on map name (without extension)
          const nameWithoutExt = map.name.split('.').slice(0, -1).join('.');
          setWorldName(nameWithoutExt || map.name);
        }
      }
    }
  }, [mapId]);
  
  // Placeholder data for AI-generated suggestions
  const suggestedQuests = [
    { id: 'q1', title: 'The Lost Artifact', description: 'Find the ancient artifact hidden in the eastern mountains.' },
    { id: 'q2', title: 'Sea Monster Hunt', description: 'Defeat the legendary sea monster terrorizing coastal villages.' },
    { id: 'q3', title: 'Political Intrigue', description: 'Navigate the complex political landscape and prevent a war.' }
  ];
  
  const suggestedAssets = [
    { id: 'a1', name: 'Elder Dragon', type: 'character' as const, description: 'An ancient dragon that guards forgotten knowledge.' },
    { id: 'a2', name: 'Desert Town', type: 'location' as const, description: 'A small settlement near an oasis in the desert.' },
    { id: 'a3', name: 'Enchanted Sword', type: 'item' as const, description: 'A magical sword that glows in the presence of evil.' }
  ];
  
  const addQuest = (quest: Quest) => {
    setQuests([...quests, quest]);
  };
  
  const addAsset = (asset: Asset) => {
    setAssets([...assets, asset]);
  };
  
  const handleSave = () => {
    // In a real application, you would save this data to a database
    alert('World saved successfully! In a complete app, this would be saved to a database.');
  };
  
  return (
    <div className="min-h-screen bg-emerald-50 text-gray-800">
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
      
      <main className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-md modern-card mb-6">
            <h2 className="text-2xl font-bold mb-4 section-title text-center">YOUR WORLD</h2>
            <input
              type="text"
              placeholder="Enter world name"
              value={worldName}
              onChange={(e) => setWorldName(e.target.value)}
              className="w-full p-3 mb-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-800 font-medium"
            />
            
            <div className="relative">
              <p className="text-sm text-gray-600 mb-2 font-medium">Your map:</p>
              <div className="bg-gray-50 h-60 rounded-lg flex items-center justify-center border border-gray-200 overflow-hidden">
                {currentMap ? (
                  <img 
                    src={currentMap.url} 
                    alt={currentMap.name} 
                    className="max-h-full object-contain"
                  />
                ) : (
                  <p className="text-gray-500">Map preview would appear here</p>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                AI analysis has detected possible points of interest marked on the map.
              </p>
            </div>
            
            <button
              onClick={handleSave}
              className="w-full mt-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white square-button"
            >
              Save World
            </button>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quests Section */}
            <div className="bg-white p-6 rounded-2xl shadow-md modern-card">
              <h2 className="text-2xl font-bold mb-4 section-title text-center">QUESTS</h2>
              
              <div className="mb-6">
                <h3 className="text-sm font-bold uppercase text-gray-500 mb-2">Your Quests</h3>
                {quests.length > 0 ? (
                  <ul className="space-y-3">
                    {quests.map(quest => (
                      <li key={quest.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <h4 className="font-bold text-gray-800">{quest.title}</h4>
                        <p className="text-sm text-gray-600">{quest.description}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                    <p className="text-gray-400 text-sm">No quests added yet</p>
                    <p className="text-xs text-gray-400">Add some quests from the suggestions below!</p>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-bold uppercase text-gray-500 mb-2">AI Suggestions</h3>
                <p className="text-xs text-gray-500 mb-2">Based on your map, here are some quest ideas:</p>
                <ul className="space-y-3">
                  {suggestedQuests.map(quest => (
                    <li key={quest.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-800">{quest.title}</h4>
                        <p className="text-sm text-gray-600">{quest.description}</p>
                      </div>
                      <button 
                        onClick={() => addQuest(quest)} 
                        className="ml-2 bg-emerald-500 hover:bg-emerald-600 px-3 py-2 text-white text-xs square-button"
                      >
                        Add
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Assets Section */}
            <div className="bg-white p-6 rounded-2xl shadow-md modern-card">
              <h2 className="text-2xl font-bold mb-4 section-title text-center">ASSETS</h2>
              
              <div className="mb-6">
                <h3 className="text-sm font-bold uppercase text-gray-500 mb-2">Your Assets</h3>
                {assets.length > 0 ? (
                  <ul className="space-y-3">
                    {assets.map(asset => (
                      <li key={asset.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div className="flex justify-between">
                          <h4 className="font-bold text-gray-800">{asset.name}</h4>
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">{asset.type}</span>
                        </div>
                        <p className="text-sm text-gray-600">{asset.description}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                    <p className="text-gray-400 text-sm">No assets added yet</p>
                    <p className="text-xs text-gray-400">Add some assets from the suggestions below!</p>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-bold uppercase text-gray-500 mb-2">AI Suggestions</h3>
                <p className="text-xs text-gray-500 mb-2">Based on your map, here are some asset ideas:</p>
                <ul className="space-y-3">
                  {suggestedAssets.map(asset => (
                    <li key={asset.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-800">{asset.name}</h4>
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">{asset.type}</span>
                        </div>
                        <p className="text-sm text-gray-600">{asset.description}</p>
                      </div>
                      <button 
                        onClick={() => addAsset(asset)} 
                        className="ml-2 bg-emerald-500 hover:bg-emerald-600 px-3 py-2 text-white text-xs square-button"
                      >
                        Add
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 