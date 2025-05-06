'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import QuestEditor from '../components/QuestEditor';
import AssetEditor from '../components/AssetEditor';
import MapVisualization from '../components/MapVisualization';
import QuestBoard from '../components/QuestBoard';
import { UserIcon, MapIcon, BoxIcon } from 'lucide-react';

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

  const [flowNodes, setFlowNodes] = useState<any[]>([]);
  const [flowEdges, setFlowEdges] = useState<any[]>([]);
  
  useEffect(() => {
    const loadFlow = () => {
      const savedFlow = localStorage.getItem('flow-data');
      if (savedFlow) {
        const { nodes: savedNodes, edges: savedEdges } = JSON.parse(savedFlow);
        setFlowNodes(savedNodes || []);
        setFlowEdges(savedEdges || []);
      } else {
        setFlowNodes([]);
        setFlowEdges([]);
      }
    };
  
    loadFlow();
  
    // Listen to localStorage changes across tabs or within same app
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'flow-data') {
        loadFlow();
      }
    };
  
    window.addEventListener('storage', handleStorage);
  
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      const savedFlow = localStorage.getItem('flow-data');
      if (savedFlow) {
        const { nodes: savedNodes, edges: savedEdges } = JSON.parse(savedFlow);
        setFlowNodes(savedNodes || []);
        setFlowEdges(savedEdges || []);
      }
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

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
    if (!mapId || !worldName) return;

    const savedWorldDataRaw = localStorage.getItem('worldData');
    if (savedWorldDataRaw) {
      const savedWorldData = JSON.parse(savedWorldDataRaw);

      const worldAssets = savedWorldData[worldName] || {};

      const loadedAssets: Asset[] = [];
      ['asset-npc', 'asset-location', 'asset-item'].forEach(typeKey => {
        const typeAssets = worldAssets[typeKey] || {};
        Object.entries(typeAssets).forEach(([name, data]: any) => {
          loadedAssets.push({
            id: name,
            name,
            type:
              typeKey === 'asset-npc'
                ? 'character'
                : typeKey === 'asset-location'
                  ? 'location'
                  : 'item',
            position: data.position ? data.position : undefined
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

  const updateAssetPosition = (assetId: string, position: { top: string, left: string }) => {
    const updatedAssets = assets.map(asset =>
      asset.id === assetId ? { ...asset, position } : asset
    );
    setAssets(updatedAssets);

    const localDataRaw = localStorage.getItem('worldData');
    const localData = localDataRaw ? JSON.parse(localDataRaw) : {};

    const asset = assets.find(a => a.id === assetId);
    if (!asset) return;

    let assetCategory = '';
    switch (asset.type) {
      case 'character': assetCategory = 'asset-npc'; break;
      case 'location': assetCategory = 'asset-location'; break;
      case 'item': assetCategory = 'asset-item'; break;
      default: return;
    }

    if (!localData[worldName]) return;
    if (!localData[worldName][assetCategory]) return;
    if (!localData[worldName][assetCategory][asset.name]) return;

    localData[worldName][assetCategory][asset.name].position = position;

    localStorage.setItem('worldData', JSON.stringify(localData));
  };

  const handleDragStart = (e: React.DragEvent, item: Quest | Asset, type: 'quest' | 'asset') => {
    e.dataTransfer.setData('application/json', JSON.stringify({ id: item.id, type }));

    // --- Create a small drag preview ---
    const ghost = document.createElement('div');
    ghost.style.width = '24px';
    ghost.style.height = '24px';
    ghost.style.backgroundColor = type === 'quest' ? '#8b5cf6' : '#059669'; // purple or emerald
    ghost.style.borderRadius = '50%';
    ghost.style.display = 'flex';
    ghost.style.alignItems = 'center';
    ghost.style.justifyContent = 'center';
    ghost.style.color = 'white';
    ghost.style.fontSize = '14px';
    ghost.style.fontWeight = 'bold';
    ghost.style.pointerEvents = 'none';
    ghost.style.zIndex = '9999';
    ghost.innerText = type === 'quest' ? 'Q' : 'A';
    document.body.appendChild(ghost);

    e.dataTransfer.setDragImage(ghost, 12, 12);

    // Remove the ghost after a tick (Firefox workaround)
    setTimeout(() => {
      document.body.removeChild(ghost);
    }, 0);
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
          id: name,  // keep consistent with original id usage
          name,
          type: cat === 'asset-npc' ? 'character' : cat === 'asset-location' ? 'location' : 'item',
          position: value.position ? value.position : undefined
        });
      });
    });

    setAssets(newAssets);
  };

  const formatNodeTitle = (node: any) => {
    return node.data.title;
  };
  
  const renderFlatChildren = (
    parentId: string,
    level: number,
    visited = new Set<string>()
  ): JSX.Element | null => {
    const childEdges = flowEdges.filter(edge => edge.source === parentId);
    if (childEdges.length === 0) return null;
  
    return (
      <ul className="space-y-1">
        {childEdges.map(edge => {
          const childNode = flowNodes.find(n => n.id === edge.target && !n.data.isAsset);
          if (!childNode) return null;
  
          // If we've already rendered this node, skip to prevent repeats
          if (visited.has(childNode.id)) return null;
          visited.add(childNode.id);
  
          return (
            <li key={childNode.id} className={`ml-${level * 4}`}>
              {'└' + '─'.repeat(level)} {childNode.data.title}
              {renderFlatChildren(childNode.id, level + 1, visited)}
            </li>
          );
        })}
      </ul>
    );
  };

  const renderChildren = (parentId: string, level: number): JSX.Element | null => {
    const childEdges = flowEdges.filter(edge => edge.source === parentId);
    if (childEdges.length === 0) return null;
  
    return (
      <ul className={`list-disc list-inside ml-${level * 4}`}>
        {childEdges.map(edge => {
          const childNode = flowNodes.find(n => n.id === edge.target && !n.data.isAsset);
          if (!childNode) return null;
          return (
            <li key={childNode.id}>
              {childNode.data.title}
              {renderChildren(childNode.id, level + 1)}
            </li>
          );
        })}
      </ul>
    );
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
              <div className="w-full font-bold text-xl text-center text-gray-800 mb-4">
                {worldName || "Unnamed World"}
              </div>
              <div className="bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200 overflow-hidden mb-2 h-32">
                <img src={currentMap.url} alt={currentMap.name} className="max-h-full object-contain" />
              </div>
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
  <div className="space-y-1 mb-2 text-sm text-gray-800">
    {flowNodes.length > 0 ? (
      <ul className="space-y-1">
        {flowNodes
          .filter(node => {
            if (node.data.isAsset) return false;
            const hasIncomingEdge = flowEdges.some(edge => edge.target === node.id);
            const sourceExists = flowEdges
              .filter(edge => edge.target === node.id)
              .every(edge => flowNodes.find(n => n.id === edge.source));
            return !hasIncomingEdge || !sourceExists;
          })
          .map(node => (
            <li key={node.id}>
              {formatNodeTitle(node)}
              {renderFlatChildren(node.id, 1, new Set([node.id]))}
            </li>
          ))}
      </ul>
    ) : (
      <div className="text-xs text-gray-400 text-center py-2">No quests added yet</div>
    )}
  </div>
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
                  <div className="text-xs text-gray-500 mb-2 italic">
  Tip: Drag assets onto the map to place them.
</div>
                  {/* dynamic display */}
                  <div className="space-y-2 mb-2">

                    {assets.length > 0 ? assets.map(asset => (
                      <div
                        key={asset.id}
                        className="bg-white border border-gray-100 rounded-lg px-4 py-3 shadow-sm flex items-center gap-3 hover:shadow-md transition cursor-grab active:scale-95"
                        draggable
                        onDragStart={e => handleDragStart(e, asset, 'asset')}
                        onClick={() => openAssetEditor(asset)}
                        tabIndex={0}
                        role="button"
                        aria-label={`Edit ${asset.name}`}
                      >
                        {/* Icon with background color */}
                        <div className={`rounded-full p-2 flex items-center justify-center shadow-sm border text-white
      ${asset.type === 'character' ? 'bg-blue-600' :
                            asset.type === 'location' ? 'bg-green-600' :
                              asset.type === 'item' ? 'bg-yellow-500' : 'bg-gray-400'
                          }`}>
                          {asset.type === 'character' && <UserIcon className="h-4 w-4" />}
                          {asset.type === 'location' && <MapIcon className="h-4 w-4" />}
                          {asset.type === 'item' && <BoxIcon className="h-4 w-4" />}
                        </div>

                        <span className="font-semibold text-gray-800 text-base truncate">{asset.name}</span>
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
                worldName={worldName}
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
        initialData={currentAsset ? {
          id: currentAsset.id,
          name: currentAsset.name,
          type: currentAsset.type === 'character' ? 'NPC'
            : currentAsset.type === 'location' ? 'Location'
              : 'Item',
        } : undefined}
      />
    </div>
  );
}