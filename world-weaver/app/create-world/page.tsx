'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import QuestEditor from '../components/QuestEditor';
import AssetEditor from '../components/AssetEditor';
import MapVisualization from '../components/MapVisualization';

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
  description: string;
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
  const [sidebarTab, setSidebarTab] = useState<'quests' | 'assets'>('quests');

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
              <p className="text-xs text-gray-400 mb-2 text-center">AI analysis has detected possible points of interest.</p>
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
                className={`flex-1 py-2 rounded-lg font-semibold transition-all duration-300 ${sidebarTab === 'quests' ? 'bg-emerald-100 text-emerald-700 shadow' : 'bg-gray-100 text-gray-500 hover:text-emerald-700'}`}
                onClick={() => setSidebarTab('quests')}
                role="tab"
                aria-selected={sidebarTab === 'quests'}
              >
                Quests
              </button>
              <button
                className={`flex-1 py-2 rounded-lg font-semibold transition-all duration-300 ${sidebarTab === 'assets' ? 'bg-emerald-100 text-emerald-700 shadow' : 'bg-gray-100 text-gray-500 hover:text-emerald-700'}`}
                onClick={() => setSidebarTab('assets')}
                role="tab"
                aria-selected={sidebarTab === 'assets'}
              >
                Assets
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
                  {/* AI Suggestions */}
                  <div className="mt-4">
                    <h4 className="text-xs font-bold uppercase text-gray-400 mb-2 tracking-wide">Suggestions</h4>
                    <div className="flex flex-col gap-2">
                      {suggestedQuests.map(quest => (
                        <div key={quest.id} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                          <div className="flex-1 cursor-pointer" onClick={() => openQuestEditor(quest)}>
                            <span className="font-semibold text-gray-700 text-sm">{quest.title}</span>
                            <span className="block text-xs text-gray-400">{quest.description}</span>
                          </div>
                          <button
                            onClick={() => addQuest(quest)}
                            className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-2 py-1 rounded text-xs font-semibold transition"
                          >
                            Add
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={`absolute w-full top-0 left-0 transition-opacity duration-500 ${sidebarTab === 'assets' ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'}`}
              >
                {/* Assets Section */}
                <div>
                  <h3 className="text-lg font-bold text-emerald-700 mb-2 tracking-wide">Assets</h3>
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
                        <span className="text-xs text-gray-500">{asset.description}</span>
                      </div>
                    )) : (
                      <div className="text-xs text-gray-400 text-center py-2">No assets added yet</div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      const newAsset = {
                        id: `asset-${Date.now()}`,
                        name: 'New Asset',
                        type: 'character' as const,
                        description: 'Add details to this asset'
                      };
                      addAsset(newAsset);
                      openAssetEditor(newAsset);
                    }}
                    className="w-full py-2 mt-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-emerald-700 font-semibold text-sm transition"
                  >
                    + Create New Asset
                  </button>
                  {/* AI Suggestions */}
                  <div className="mt-4">
                    <h4 className="text-xs font-bold uppercase text-gray-400 mb-2 tracking-wide">Suggestions</h4>
                    <div className="flex flex-col gap-2">
                      {suggestedAssets.map(asset => (
                        <div key={asset.id} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                          <div className="flex-1 cursor-pointer" onClick={() => openAssetEditor(asset)}>
                            <span className="font-semibold text-gray-700 text-sm">{asset.name}</span>
                            <span className="block text-xs text-gray-400">{asset.description}</span>
                          </div>
                          <button
                            onClick={() => addAsset(asset)}
                            className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-2 py-1 rounded text-xs font-semibold transition"
                          >
                            Add
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
          {/* Map Visualization */}
          <main className="flex-1 bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-stretch rounded-tl-2xl relative">
            <MapVisualization
              mapUrl={currentMap.url}
              quests={quests}
              assets={assets}
              onQuestClick={openQuestEditor}
              onAssetClick={openAssetEditor}
              onUpdateQuestPosition={updateQuestPosition}
              onUpdateAssetPosition={updateAssetPosition}
            />
            {/* Floating Quick Summary Box - now larger and interactive */}
            <div className="fixed bottom-8 right-8 bg-white/95 shadow-2xl rounded-2xl px-8 py-6 min-w-[340px] max-h-[60vh] z-40 border border-gray-200 backdrop-blur-lg animate-fade-in flex flex-col gap-4 overflow-y-auto">
              <div className="font-bold text-lg text-gray-700 mb-2">World Overview</div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-emerald-700 text-base">Quests</span>
                  <span className="text-xs text-gray-500">({quests.length})</span>
                </div>
                <div className="flex flex-col gap-2 max-h-32 overflow-y-auto">
                  {quests.length === 0 ? (
                    <div className="text-xs text-gray-400">No quests yet</div>
                  ) : (
                    quests.map(q => (
                      <div
                        key={q.id}
                        className="bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2 shadow-sm flex items-center gap-2 cursor-grab hover:bg-emerald-100 transition"
                        draggable
                        onDragStart={e => handleDragStart(e, q, 'quest')}
                      >
                        <span className="font-semibold text-emerald-800 text-sm">{q.title}</span>
                        <span className="text-xs text-gray-500 truncate">{q.description}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-blue-700 text-base">Assets</span>
                  <span className="text-xs text-gray-500">({assets.length})</span>
                </div>
                <div className="flex flex-col gap-2 max-h-32 overflow-y-auto">
                  {assets.length === 0 ? (
                    <div className="text-xs text-gray-400">No assets yet</div>
                  ) : (
                    assets.map(a => (
                      <div
                        key={a.id}
                        className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 shadow-sm flex items-center gap-2 cursor-grab hover:bg-blue-100 transition"
                        draggable
                        onDragStart={e => handleDragStart(e, a, 'asset')}
                      >
                        <span className="font-semibold text-blue-800 text-sm">{a.name}</span>
                        <span className="text-xs text-gray-500 truncate">{a.description}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
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
          objectives: Array.isArray((currentQuest as any).objectives) ? (currentQuest as any).objectives : [],
          rewards: typeof (currentQuest as any).rewards === 'string' ? (currentQuest as any).rewards : '',
          difficulty: typeof (currentQuest as any).difficulty === 'string' ? (currentQuest as any).difficulty : 'Medium',
        } : undefined}
        worldName={worldName}
      />
      <AssetEditor
        isOpen={isAssetEditorOpen}
        onClose={() => setIsAssetEditorOpen(false)}
        initialData={currentAsset ? {
          id: currentAsset.id,
          name: currentAsset.name || '',
          type: currentAsset.type === 'character' ? 'NPC'
                : currentAsset.type === 'location' ? 'Location' : 'Item',
          personality: typeof (currentAsset as any).personality === 'string' ? (currentAsset as any).personality : '',
          bio: typeof (currentAsset as any).bio === 'string' ? (currentAsset as any).bio
              : typeof currentAsset.description === 'string' ? currentAsset.description : '',
        } : undefined}
        worldName={worldName}
      />
    </div>
  );
}