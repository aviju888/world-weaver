'use client';

import { useState } from 'react';

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

interface MapVisualizationProps {
  mapUrl: string;
  quests: Quest[];
  assets: Asset[];
  onQuestClick: (quest: Quest) => void;
  onAssetClick: (asset: Asset) => void;
  onUpdateQuestPosition?: (questId: string, position: { x: number, y: number }) => void;
  onUpdateAssetPosition?: (assetId: string, position: { x: number, y: number }) => void;
}

export default function MapVisualization({ 
  mapUrl, 
  quests, 
  assets, 
  onQuestClick, 
  onAssetClick,
  onUpdateQuestPosition,
  onUpdateAssetPosition
}: MapVisualizationProps) {
  const [draggingItem, setDraggingItem] = useState<{ id: string, type: 'quest' | 'asset' } | null>(null);
  const [showLabels, setShowLabels] = useState(true);

  // Function to handle drag start on a marker
  const handleDragStart = (id: string, type: 'quest' | 'asset') => {
    setDraggingItem({ id, type });
  };

  // Function to handle drag end and position update
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!draggingItem) return;
    
    const mapContainer = e.currentTarget;
    const rect = mapContainer.getBoundingClientRect();
    
    // Calculate position as percentage of container dimensions
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Update position in parent component
    if (draggingItem.type === 'quest' && onUpdateQuestPosition) {
      onUpdateQuestPosition(draggingItem.id, { x, y });
    } else if (draggingItem.type === 'asset' && onUpdateAssetPosition) {
      onUpdateAssetPosition(draggingItem.id, { x, y });
    }
    
    setDraggingItem(null);
  };

  // Calculate icons for different asset types
  const getAssetIcon = (type: 'character' | 'item' | 'location') => {
    switch (type) {
      case 'character':
        return '👤'; // Character icon
      case 'location':
        return '🏠'; // Location icon
      case 'item':
        return '⚔️'; // Item icon
    }
  };

  return (
    <div className="relative w-full h-full" onClick={handleMapClick}>
      {/* Map Image */}
      <img 
        src={mapUrl} 
        alt="World Map" 
        className="w-full h-full object-contain rounded-lg"
      />
      
      {/* Toggles */}
      <div className="absolute top-2 right-2 bg-white bg-opacity-70 p-2 rounded-md z-10">
        <label className="flex items-center text-xs text-gray-700">
          <input
            type="checkbox"
            checked={showLabels}
            onChange={(e) => setShowLabels(e.target.checked)}
            className="mr-2"
          />
          Show Labels
        </label>
      </div>
      
      {/* Instructions */}
      <div className="absolute top-2 left-2 bg-white bg-opacity-70 p-2 rounded-md z-10 text-xs text-gray-700">
        {draggingItem ? (
          <p>Click on the map to place the item</p>
        ) : (
          <p>Drag and drop quests & assets onto the map</p>
        )}
      </div>
      
      {/* Quest Markers */}
      {quests.map((quest) => (
        quest.position ? (
          <div
            key={quest.id}
            className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
            style={{ 
              left: `${quest.position.x}%`, 
              top: `${quest.position.y}%` 
            }}
            onClick={(e) => {
              e.stopPropagation();
              onQuestClick(quest);
            }}
            draggable
            onDragStart={() => handleDragStart(quest.id, 'quest')}
          >
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                Q
              </div>
              {showLabels && (
                <div className="mt-1 bg-white px-2 py-1 rounded text-xs shadow">
                  {quest.title}
                </div>
              )}
            </div>
          </div>
        ) : null
      ))}
      
      {/* Asset Markers */}
      {assets.map((asset) => (
        asset.position ? (
          <div
            key={asset.id}
            className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
            style={{ 
              left: `${asset.position.x}%`, 
              top: `${asset.position.y}%` 
            }}
            onClick={(e) => {
              e.stopPropagation();
              onAssetClick(asset);
            }}
            draggable
            onDragStart={() => handleDragStart(asset.id, 'asset')}
          >
            <div className="flex flex-col items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md
                ${asset.type === 'character' ? 'bg-blue-500' : 
                  asset.type === 'location' ? 'bg-green-500' : 'bg-purple-500'}
              `}>
                {getAssetIcon(asset.type)}
              </div>
              {showLabels && (
                <div className="mt-1 bg-white px-2 py-1 rounded text-xs shadow">
                  {asset.name}
                </div>
              )}
            </div>
          </div>
        ) : null
      ))}
      
      {/* Quest List for Dragging (if no position set yet) */}
      <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 p-2 rounded-md z-10 max-w-[40%] max-h-[30%] overflow-auto">
        <h4 className="text-xs font-bold mb-1">Unplaced Items:</h4>
        <div className="flex flex-wrap gap-1">
          {quests.filter(q => !q.position).map(quest => (
            <div
              key={quest.id}
              className="bg-red-500 text-white text-xs px-2 py-1 rounded cursor-grab"
              draggable
              onDragStart={() => handleDragStart(quest.id, 'quest')}
            >
              {quest.title}
            </div>
          ))}
          {assets.filter(a => !a.position).map(asset => (
            <div
              key={asset.id}
              className={`
                text-white text-xs px-2 py-1 rounded cursor-grab
                ${asset.type === 'character' ? 'bg-blue-500' : 
                  asset.type === 'location' ? 'bg-green-500' : 'bg-purple-500'}
              `}
              draggable
              onDragStart={() => handleDragStart(asset.id, 'asset')}
            >
              {asset.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 