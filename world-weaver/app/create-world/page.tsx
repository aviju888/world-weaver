'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import QuestEditor from '../components/QuestEditor';
import AssetEditor from '../components/AssetEditor';
import MapVisualization from '../components/MapVisualization';
import Sidebar from '../components/Sidebar'; // Added Sidebar

type Quest = {
  id: string;
  title: string;
  description: string;
  position?: { x: number; y: number };
};

type Asset = {
  id: string;
  name: string;
  type: 'character' | 'item' | 'location';
  description: string;
  position?: { x: number; y: number };
};

type SavedMap = {
  id: string;
  name: string;
  url: string;
  date: string;
};

export default function CreateWorldPage() {
  // States
  const [worldName, setWorldName] = useState('');
  const [quests, setQuests] = useState<Quest[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [currentMap, setCurrentMap] = useState<SavedMap | null>(null);
  const [isQuestEditorOpen, setIsQuestEditorOpen] = useState(false);
  const [isAssetEditorOpen, setIsAssetEditorOpen] = useState(false);
  const [currentQuest, setCurrentQuest] = useState<Quest | null>(null);
  const [currentAsset, setCurrentAsset] = useState<Asset | null>(null);
  const [showMapVisualization, setShowMapVisualization] = useState(false);

  const searchParams = useSearchParams();
  const mapId = searchParams.get('mapId');

  // Load saved map from localStorage
  useEffect(() => {
    if (mapId) {
      const savedMapsJson = localStorage.getItem('worldWeaverMaps');
      if (savedMapsJson) {
        const savedMaps: SavedMap[] = JSON.parse(savedMapsJson);
        const map = savedMaps.find((m) => m.id === mapId);
        if (map) {
          setCurrentMap(map);
          const nameWithoutExt = map.name.split('.').slice(0, -1).join('.');
          setWorldName(nameWithoutExt || map.name);
        }
      }
    }
  }, [mapId]);

  // Placeholder suggested data
  const suggestedQuests = [
    {
      id: 'q1',
      title: 'The Lost Artifact',
      description: 'Find the ancient artifact hidden in the eastern mountains.',
    },
    {
      id: 'q2',
      title: 'Sea Monster Hunt',
      description: 'Defeat the legendary sea monster terrorizing coastal villages.',
    },
    {
      id: 'q3',
      title: 'Political Intrigue',
      description: 'Navigate the complex political landscape and prevent a war.',
    },
  ];

  const suggestedAssets = [
    {
      id: 'a1',
      name: 'Elder Dragon',
      type: 'character' as const,
      description: 'An ancient dragon that guards forgotten knowledge.',
    },
    {
      id: 'a2',
      name: 'Desert Town',
      type: 'location' as const,
      description: 'A small settlement near an oasis in the desert.',
    },
    {
      id: 'a3',
      name: 'Enchanted Sword',
      type: 'item' as const,
      description: 'A magical sword that glows in the presence of evil.',
    },
  ];

  // Handlers
  const addQuest = (quest: Quest) => {
    setQuests([...quests, quest]);
  };

  const addAsset = (asset: Asset) => {
    setAssets([...assets, asset]);
  };

  const handleSave = () => {
    alert('World saved successfully! In a complete app, this would be saved to a database.');
  };

  const openQuestEditor = (quest: Quest) => {
    setCurrentQuest(quest);
    setIsQuestEditorOpen(true);
  };

  const openAssetEditor = (asset: Asset) => {
    setCurrentAsset(asset);
    setIsAssetEditorOpen(true);
  };

  const updateQuestPosition = (questId: string, position: { x: number; y: number }) => {
    setQuests(
      quests.map((quest) => (quest.id === questId ? { ...quest, position } : quest))
    );
  };

  const updateAssetPosition = (assetId: string, position: { x: number; y: number }) => {
    setAssets(
      assets.map((asset) => (asset.id === assetId ? { ...asset, position } : asset))
    );
  };
  
  return (
    <div className="min-h-screen bg-emerald-50 text-gray-800">
      {/* Header Section */}
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

      {/* Main Content Section */}
      <main className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        {/* Sidebar for World Name and Map Preview */}
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
              <div
                className="bg-gray-50 h-60 rounded-lg flex items-center justify-center border border-gray-200 overflow-hidden cursor-pointer"
                onClick={() => setShowMapVisualization(true)}
              >
                {currentMap ? (
                  <img
                    src={currentMap.url}
                    alt={currentMap.name}
                    className="max-h-full object-contain"
                  />
                ) : (
                  <p className="text-gray-500">Map preview would appear here</p>
                )}

                {/* Quest/Asset overlay indicator */}
                {(quests.length > 0 || assets.length > 0) && (
                  <div className="absolute bottom-2 right-2 bg-white bg-opacity-80 rounded-md p-1 text-xs">
                    {quests.length > 0 && (
                      <span className="mr-2">
                        <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-1"></span>
                        {quests.length} Quests
                      </span>
                    )}
                    {assets.length > 0 && (
                      <span>
                        <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-1"></span>
                        {assets.length} Assets
                      </span>
                    )}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                AI analysis has detected possible points of interest marked on the map.
              </p>
              <button
                onClick={() => setShowMapVisualization(true)}
                className="w-full mt-2 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-md"
              >
                View Full Map with Quests & Assets
              </button>
            </div>

            <button
              onClick={handleSave}
              className="w-full mt-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white square-button"
            >
              Save World
            </button>
          </div>
        </div>

        {/* Quests and Assets Section */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quests Block */}
            <div className="bg-white p-6 rounded-2xl shadow-md modern-card">
              <h2 className="text-2xl font-bold mb-4 section-title text-center">QUESTS</h2>

              {/* Your Quests */}
              <div className="mb-6">
                <h3 className="text-sm font-bold uppercase text-gray-500 mb-2">Your Quests</h3>
                {quests.length > 0 ? (
                  <ul className="space-y-3">
                    {quests.map((quest) => (
                      <li
                        key={quest.id}
                        className="bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-emerald-400 cursor-pointer"
                        onClick={() => openQuestEditor(quest)}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-gray-800">{quest.title}</h4>
                          {quest.position && (
                            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                              Placed on Map
                            </span>
                          )}
                        </div>
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
                <button
                  onClick={() => {
                    const newQuest = {
                      id: `quest-${Date.now()}`,
                      title: 'New Quest',
                      description: 'Add details to this quest',
                    };
                    addQuest(newQuest);
                    openQuestEditor(newQuest);
                  }}
                  className="mt-3 px-4 py-2 bg-gray-600 text-white rounded-md text-sm w-full"
                >
                  + Create New Quest
                </button>
              </div>

              {/* AI Suggested Quests */}
              <div>
                <h3 className="text-sm font-bold uppercase text-gray-500 mb-2">AI Suggestions</h3>
                <p className="text-xs text-gray-500 mb-2">Based on your map, here are some quest ideas:</p>
                <ul className="space-y-3">
                  {suggestedQuests.map((quest) => (
                    <li
                      key={quest.id}
                      className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex justify-between items-start"
                    >
                      <div
                        className="flex-grow cursor-pointer"
                        onClick={() => openQuestEditor(quest)}
                      >
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

            {/* Assets Block */}
            <div className="bg-white p-6 rounded-2xl shadow-md modern-card">
              <h2 className="text-2xl font-bold mb-4 section-title text-center">ASSETS</h2>

              {/* Your Assets */}
              <div className="mb-6">
                <h3 className="text-sm font-bold uppercase text-gray-500 mb-2">Your Assets</h3>
                {assets.length > 0 ? (
                  <ul className="space-y-3">
                    {assets.map((asset) => (
                      <li
                        key={asset.id}
                        className="bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-emerald-400 cursor-pointer"
                        onClick={() => openAssetEditor(asset)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <h4 className="font-bold text-gray-800">{asset.name}</h4>
                            <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
                              {asset.type}
                            </span>
                          </div>
                          {asset.position && (
                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                              Placed on Map
                            </span>
                          )}
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
                <button
                  onClick={() => {
                    const newAsset = {
                      id: `asset-${Date.now()}`,
                      name: 'New Asset',
                      type: 'character' as const,
                      description: 'Add details to this asset',
                    };
                    addAsset(newAsset);
                    openAssetEditor(newAsset);
                  }}
                  className="mt-3 px-4 py-2 bg-gray-600 text-white rounded-md text-sm w-full"
                >
                  + Create New Asset
                </button>
              </div>

              {/* AI Suggested Assets */}
              <div>
                <h3 className="text-sm font-bold uppercase text-gray-500 mb-2">AI Suggestions</h3>
                <p className="text-xs text-gray-500 mb-2">Based on your map, here are some asset ideas:</p>
                <ul className="space-y-3">
                  {suggestedAssets.map((asset) => (
                    <li
                      key={asset.id}
                      className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex justify-between items-start"
                    >
                      <div
                        className="flex-grow cursor-pointer"
                        onClick={() => openAssetEditor(asset)}
                      >
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-800">{asset.name}</h4>
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
                            {asset.type}
                          </span>
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

      {/* Full Map Modal with Sidebar */}
      {showMapVisualization && currentMap && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-lg max-w-6xl flex max-h-[90vh] h-fit">
            <Sidebar
              quests={quests}
              assets={assets}
              onQuestClick={openQuestEditor}
              onAssetClick={openAssetEditor}
            />
            <div className="flex-grow overflow-hidden flex flex-col">
              <div className="bg-gray-800 p-4 rounded-t-lg flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">{worldName} - World Map</h1>
                <button
                  onClick={() => setShowMapVisualization(false)}
                  className="text-white hover:text-gray-300 text-2xl"
                >
                  &times;
                </button>
              </div>
              <div className="flex-grow overflow-hidden p-1">
                <div className="w-full h-full min-h-[500px]">
                  <MapVisualization
                    mapUrl={currentMap.url}
                    quests={quests}
                    assets={assets}
                    onQuestClick={openQuestEditor}
                    onAssetClick={openAssetEditor}
                    onUpdateQuestPosition={updateQuestPosition}
                    onUpdateAssetPosition={updateAssetPosition}
                  />
                </div>
              </div>
              <div className="bg-gray-100 p-4 rounded-b-lg flex flex-wrap justify-between items-center">
                <div className="flex items-center space-x-4 text-sm text-gray-700">
                  <span className="flex items-center">
                    <span className="w-4 h-4 bg-red-500 rounded-full mr-1"></span>
                    Quests
                  </span>
                  <span className="flex items-center">
                    <span className="w-4 h-4 bg-blue-500 rounded-full mr-1"></span>
                    Characters
                  </span>
                  <span className="flex items-center">
                    <span className="w-4 h-4 bg-green-500 rounded-full mr-1"></span>
                    Locations
                  </span>
                  <span className="flex items-center">
                    <span className="w-4 h-4 bg-purple-500 rounded-full mr-1"></span>
                    Items
                  </span>
                </div>
                <button
                  onClick={() => setShowMapVisualization(false)}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md"
                >
                  Close Map
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QuestEditor Modal */}
      <QuestEditor
        isOpen={isQuestEditorOpen}
        onClose={() => setIsQuestEditorOpen(false)}
        initialData={currentQuest ? {
          id: currentQuest.id,
          name: currentQuest.title,
          description: currentQuest.description,
        } : undefined}
        worldName={worldName}
      />

      {/* AssetEditor Modal */}
      <AssetEditor
        isOpen={isAssetEditorOpen}
        onClose={() => setIsAssetEditorOpen(false)}
        initialData={currentAsset ? {
          id: currentAsset.id,
          name: currentAsset.name,
          type: currentAsset.type === 'character' ? 'NPC' : currentAsset.type === 'location' ? 'Location' : 'Item',
          bio: currentAsset.description,
        } : undefined}
        worldName={worldName}
      />
    </div>
  );
}
