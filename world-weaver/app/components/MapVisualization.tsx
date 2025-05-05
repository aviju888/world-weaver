'use client';

import { useState, useRef } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
// import MapPin from './MapPin';
import Sidebar from './Sidebar';

type Quest = {
  id: string;
  title: string;
  description: string;
  position?: { top: string; left: string };
};

type Asset = {
  id: string;
  name: string;
  type: 'character' | 'item' | 'location';
  description: string;
  position?: { top: string; left: string };
};

interface MapVisualizationProps {
  mapUrl: string;
  quests?: Quest[];
  assets?: Asset[];
  onQuestClick: (quest: Quest) => void;
  onAssetClick: (asset: Asset) => void;
  onUpdateQuestPosition?: (questId: string, position: { top: string; left: string }) => void;
  onUpdateAssetPosition?: (assetId: string, position: { top: string; left: string }) => void;
}

export default function MapVisualization({
  mapUrl,
  quests = [],
  assets = [],
  onQuestClick,
  onAssetClick,
  onUpdateQuestPosition,
  onUpdateAssetPosition,
}: MapVisualizationProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ type: 'quest' | 'asset'; data: Quest | Asset } | null>(null);
  const [isPlacingItem, setIsPlacingItem] = useState<{ type: 'quest' | 'asset'; id: string } | null>(null);

  const [isDragOver, setIsDragOver] = useState(false);
  const [dragItem, setDragItem] = useState<{ type: 'quest' | 'asset'; id: string } | null>(null);

  const transformWrapperRef = useRef<any>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handlePinClick = (item: Quest | Asset, type: 'quest' | 'asset') => {
    setSelectedItem({ type, data: item });
    setIsSidebarOpen(true);
  };

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isPlacingItem || !transformWrapperRef.current || !imageRef.current) return;

    const { instance } = transformWrapperRef.current;
    const state = instance.transformState;
    const imageElement = imageRef.current;
    const rect = imageElement.getBoundingClientRect();

    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const originalX = (clickX / state.scale) - (state.positionX / state.scale);
    const originalY = (clickY / state.scale) - (state.positionY / state.scale);

    const imageWidth = imageElement.naturalWidth;
    const imageHeight = imageElement.naturalHeight;

    if (!imageWidth || !imageHeight) {
      setIsPlacingItem(null);
      return;
    }

    const top = `${Math.max(0, Math.min(100, (originalY / imageHeight) * 100))}%`;
    const left = `${Math.max(0, Math.min(100, (originalX / imageWidth) * 100))}%`;

    if (isPlacingItem.type === 'quest' && onUpdateQuestPosition) {
      onUpdateQuestPosition(isPlacingItem.id, { top, left });
    } else if (isPlacingItem.type === 'asset' && onUpdateAssetPosition) {
      onUpdateAssetPosition(isPlacingItem.id, { top, left });
    }
    setIsPlacingItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = () => setIsDragOver(false);
  const handleDrop = (e: React.DragEvent) => {
    setIsDragOver(false);
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (!data || !imageRef.current) return;
      const rect = imageRef.current.getBoundingClientRect();
      const dropX = e.clientX - rect.left;
      const dropY = e.clientY - rect.top;
      const imageWidth = imageRef.current.naturalWidth;
      const imageHeight = imageRef.current.naturalHeight;
      if (!imageWidth || !imageHeight) return;
      const top = `${Math.max(0, Math.min(100, (dropY / rect.height) * 100))}%`;
      const left = `${Math.max(0, Math.min(100, (dropX / rect.width) * 100))}%`;
      if (data.type === 'quest' && onUpdateQuestPosition) {
        onUpdateQuestPosition(data.id, { top, left });
      } else if (data.type === 'asset' && onUpdateAssetPosition) {
        onUpdateAssetPosition(data.id, { top, left });
      }
    } catch {}
  };

  const startPlacingItem = (item: Quest | Asset, type: 'quest' | 'asset') => {
    setIsPlacingItem({ type, id: item.id });
    setIsSidebarOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="relative w-full h-full flex">
      {/* <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        selectedItem={selectedItem}
        onEditClick={(item) => {
          if (item.type === 'quest' && typeof onQuestClick === 'function') onQuestClick(item.data as Quest);
          if (item.type === 'asset' && typeof onAssetClick === 'function') onAssetClick(item.data as Asset);
        }}
        onPlaceClick={(item, type) => startPlacingItem(item, type)}
        quests={quests}
        assets={assets}
      /> */}

      <div className={`flex-1 relative`} style={{ minHeight: 400 }}>
        <TransformWrapper
          ref={transformWrapperRef}
          initialScale={1}
          minScale={0.2}
          limitToBounds={false}
          wheel={{ step: 0.1 }}
        >
          <TransformComponent
            wrapperStyle={{ width: '100%', height: '100%' }}
            contentStyle={{ width: 'auto', height: 'auto' }}
          >
            <div
              className={`relative w-full h-full${isDragOver ? ' ring-4 ring-emerald-200' : ''}`}
              onClick={handleMapClick}
              style={{ cursor: isPlacingItem ? 'crosshair' : 'grab' }}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragLeave={handleDragLeave}
            >
              <img
                ref={imageRef}
                src={mapUrl}
                alt="World Map"
                className="w-full h-full object-contain rounded-lg"
                draggable={false}
              />

              {quests.filter(q => q.position?.top && q.position?.left).map(quest => (
                <MapPin
                  key={`quest-${quest.id}`}
                  top={quest.position!.top}
                  left={quest.position!.left}
                  label={quest.title}
                  itemType="quest"
                  onClick={() => handlePinClick(quest, 'quest')}
                  isSelected={selectedItem?.type === 'quest' && selectedItem?.data.id === quest.id}
                />
              ))}

              {assets.filter(a => a.position?.top && a.position?.left).map(asset => (
                <MapPin
                  key={`asset-${asset.id}`}
                  top={asset.position!.top}
                  left={asset.position!.left}
                  label={asset.name}
                  itemType={asset.type}
                  onClick={() => handlePinClick(asset, 'asset')}
                  isSelected={selectedItem?.type === 'asset' && selectedItem?.data.id === asset.id}
                />
              ))}
            </div>
          </TransformComponent>
        </TransformWrapper>
        {isPlacingItem && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded shadow z-20 text-xs">
            Click on the map to place {isPlacingItem.type}
          </div>
        )}
      </div>
    </div>
  );
}