'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import QuestEditor from '../components/QuestEditor';
import AssetEditor from '../components/AssetEditor';
import MapVisualization from '../components/MapVisualization';
import QuestBoard from '../components/QuestBoard';

type Quest = {
  id: string;
  title: string;
  description: string;
  position?: { x: number, y: number };
};

type Asset = {
  id: string;
  name: string;
  type: 'character' | 'item' | 'location';
  // description: string;
  position?: { x: number, y: number };
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
  const [isQuestEditorOpen, setIsQuestEditorOpen] = useState(false);
  const [isAssetEditorOpen, setIsAssetEditorOpen] = useState(false);
  const [currentQuest, setCurrentQuest] = useState<Quest | null>(null);
  const [currentAsset, setCurrentAsset] = useState<Asset | null>(null);
  const [sidebarTab, setSidebarTab] = useState<'quests' | 'assets'>('assets');

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

  useEffect(() => {
    if (!mapId) return;
  
    // 1. Load quests and assets from localStorage
    const savedWorldDataRaw = localStorage.getItem('worldData');
    if (savedWorldDataRaw) {
      const savedWorldData = JSON.parse(savedWorldDataRaw);
  
      const worldAssets = savedWorldData[worldName] || {};
  
      // Collect all assets
      const loadedAssets: Asset[] = [];
      ['asset-npc', 'asset-location', 'asset-item'].forEach(typeKey => {
        const typeAssets = worldAssets[typeKey] || {};
        Object.entries(typeAssets).forEach(([name, data]: any) => {
          loadedAssets.push({
            id: name, // or use a better id if you store one
            name,
            type:
              typeKey === 'asset-npc'
                ? 'character'
                : typeKey === 'asset-location'
                ? 'location'
                : 'item',
            position: undefined,
          });
        });
      });
  
      setAssets(loadedAssets);
    }
  
  }, [mapId, worldName]);


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

  const openQuestEditor = (quest: Quest) => {
    setCurrentQuest(quest);
    setIsQuestEditorOpen(true);
  };

  const openAssetEditor = (asset: Asset) => {
    setCurrentAsset(asset);
    setIsAssetEditorOpen(true);
  };

  const updateQuestPosition = (questId: string, position: { x: number, y: number }) => {
    setQuests(quests.map(quest =>
      quest.id === questId ? { ...quest, position } : quest
    ));
  };

  const updateAssetPosition = (assetId: string, position: { x: number, y: number }) => {
    setAssets(assets.map(asset =>
      asset.id === assetId ? { ...asset, position } : asset
    ));
  };

  const handleDragStart = (e: React.DragEvent, item: Quest | Asset, type: 'quest' | 'asset') => {
    e.dataTransfer.setData('application/json', JSON.stringify({ id: item.id, type }));
    // Optionally, set drag image or effect
  };

  const refreshAssetsFromStorage = () => {
    const localDataRaw = localStorage.getItem('worldData');
    const localData = localDataRaw ? JSON.parse(localDataRaw) : {};

    const categories = ['asset-npc', 'asset-location', 'asset-item'];
    const newAssets: Asset[] = [];

    categories.forEach(cat => {
      const items = localData[worldName]?.[cat] || {};
      Object.entries(items).forEach(([name, value]: any) => {
        newAssets.push({
          id: `asset-${name}`, // use name or id scheme
          name,
          type: cat === 'asset-npc' ? 'character' : cat === 'asset-location' ? 'location' : 'item',
        });
      });
    });

    setAssets(newAssets);
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

      {/* --- FULL PAGE MAP VISUALIZATION WITH SIDEBAR --- */}
      {currentMap && (
        <div className="flex flex-row w-full h-[calc(100vh-64px)] bg-gray-50">
          {/* Sidebar with toggle */}
          <aside className="w-full max-w-sm bg-white/90 border-r border-gray-100 p-8 overflow-y-auto flex-shrink-0 shadow-xl rounded-tr-2xl rounded-br-2xl transition-all duration-500">
            {/* World Name & Map Preview */}
            <div className="mb-8">
              <input
                type="text"
                placeholder="World name"
                value={worldName}
                onChange={(e) => setWorldName(e.target.value)}
                className="w-full font-semibold text-xl px-4 py-2 rounded-lg border border-gray-200 mb-4 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
              />
              <div className="bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200 overflow-hidden mb-2 h-32">
                <img src={currentMap.url} alt={currentMap.name} className="max-h-full object-contain" />
              </div>
              <button
                onClick={handleSave}
                className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow transition mb-2"
              >
                Save World
              </button>
            </div>
            {/* Toggle Tabs */}
            <div className="flex mb-6 gap-2" role="tablist">
              <button
                className={`flex-1 py-2 rounded-lg font-semibold transition-all duration-300 ${sidebarTab === 'assets' ? 'bg-emerald-100 text-emerald-700 shadow' : 'bg-gray-100 text-gray-500 hover:text-emerald-700'}`}
                onClick={() => setSidebarTab('assets')}
                role="tab"
                aria-selected={sidebarTab === 'assets'}
              >
                Assets
              </button>
              <button
                className={`flex-1 py-2 rounded-lg font-semibold transition-all duration-300 ${sidebarTab === 'quests' ? 'bg-emerald-100 text-emerald-700 shadow' : 'bg-gray-100 text-gray-500 hover:text-emerald-700'}`}
                onClick={() => setSidebarTab('quests')}
                role="tab"
                aria-selected={sidebarTab === 'quests'}
              >
                Quests
              </button>
            </div>
            {/* Animated Content Switch */}
            <div className="relative min-h-[340px]">
              <div
                className={`absolute w-full top-0 left-0 transition-opacity duration-500 ${sidebarTab === 'quests' ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'}`}
              >
                {/* Quests Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-emerald-700 mb-2 tracking-wide">Quests</h3>
                  <div className="space-y-2 mb-2">
                    {quests.length > 0 ? quests.map(quest => (
                      <div
                        key={quest.id}
                        className="bg-white border border-gray-100 rounded-lg px-4 py-3 shadow-sm flex flex-col gap-1 hover:shadow-md transition cursor-grab active:scale-95"
                        draggable
                        onDragStart={e => handleDragStart(e, quest, 'quest')}
                        onClick={() => openQuestEditor(quest)}
                        tabIndex={0}
                        role="button"
                        aria-label={`Edit ${quest.title}`}
                      >
                        <span className="font-semibold text-gray-800 text-base">{quest.title}</span>
                        <span className="text-xs text-gray-500">{quest.description}</span>
                      </div>
                    )) : (
                      <div className="text-xs text-gray-400 text-center py-2">No quests added yet</div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      const newQuest = {
                        id: `quest-${Date.now()}`,
                        title: 'New Quest',
                        description: 'Add details to this quest'
                      };
                      addQuest(newQuest);
                      openQuestEditor(newQuest);
                    }}
                    className="w-full py-2 mt-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-emerald-700 font-semibold text-sm transition"
                  >
                    + Create New Quest
                  </button>

                </div>
              </div>
              <div
                className={`absolute w-full top-0 left-0 transition-opacity duration-500 ${sidebarTab === 'assets' ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'}`}
              >
                {/* Assets Section */}
                <div>
                  <h3 className="text-lg font-bold text-emerald-700 mb-2 tracking-wide">Assets</h3>
                  <button
                    onClick={() => {
                      setCurrentAsset(null);  // no pre-fill
                      setIsAssetEditorOpen(true);
                    }}
                    className="w-full py-2 mt-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-emerald-700 font-semibold text-sm transition"
                  >
                    + Create New Asset
                  </button>
                  {/* dynamic display */}
                  <div className="space-y-2 mb-2">
                    {assets.length > 0 ? assets.map(asset => (
                      <div
                        key={asset.id}
                        className="bg-white border border-gray-100 rounded-lg px-4 py-3 shadow-sm flex flex-col gap-1 hover:shadow-md transition cursor-grab active:scale-95"
                        draggable
                        onDragStart={e => handleDragStart(e, asset, 'asset')}
                        onClick={() => openAssetEditor(asset)}
                        tabIndex={0}
                        role="button"
                        aria-label={`Edit ${asset.name}`}
                      >
                        <span className="font-semibold text-gray-800 text-base">{asset.name}</span>
                        {/* <span className="text-xs text-gray-500">{asset.description}</span> */}
                      </div>
                    )) : (
                      <div className="text-xs text-gray-400 text-center py-2">No assets added yet</div>
                    )}
                  </div>

                </div>
              </div>
            </div>
          </aside>
          {/* Map Visualization */}
          <main className="flex-1 bg-gradient-to-br flex items-stretch rounded-tl-2xl relative">
            {sidebarTab === 'quests' ? (
              <div className="w-full h-full">
                <QuestBoard />
              </div>
            ) : (
              <MapVisualization
                mapUrl={currentMap.url}
                quests={quests}
                assets={assets}
                onQuestClick={openQuestEditor}
                onAssetClick={openAssetEditor}
                onUpdateQuestPosition={updateQuestPosition}
                onUpdateAssetPosition={updateAssetPosition}
              />
            )}
          </main>
        </div>
      )}

      {/* Modal Editors */}
      <QuestEditor
        isOpen={isQuestEditorOpen}
        onClose={() => setIsQuestEditorOpen(false)}
        initialData={currentQuest ? {
          id: currentQuest.id,
          name: currentQuest.title || '',
          description: currentQuest.description || '',
        } : undefined}
        worldName={worldName}
      />
      <AssetEditor
        isOpen={isAssetEditorOpen}
        onClose={() => {
          setIsAssetEditorOpen(false);
          refreshAssetsFromStorage();
        }}
        worldName={worldName}
      />
    </div>
  );
}