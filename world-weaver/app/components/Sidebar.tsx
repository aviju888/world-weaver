'use client';

import { FaScroll, FaBox, FaUser, FaMapMarkerAlt } from 'react-icons/fa';
import React from 'react';

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

type Props = {
  quests: Quest[];
  assets: Asset[];
  onQuestClick: (quest: Quest) => void;
  onAssetClick: (asset: Asset) => void;
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: { type: 'quest' | 'asset'; data: any } | null;
  onEditClick: (item: { type: 'quest' | 'asset'; data: any }) => void;
  onPlaceClick: (item: any, type: 'quest' | 'asset') => void;
}

export function SidebarDetails({
  isOpen,
  onClose,
  selectedItem,
  onEditClick,
  onPlaceClick,
}: SidebarProps) {
  if (!isOpen || !selectedItem) return null;

  const { type, data } = selectedItem;

  return (
    <aside className="w-64 bg-white shadow-lg h-full p-4 absolute left-0 top-0 z-30 flex flex-col">
      <button className="self-end text-gray-500" onClick={onClose}>
        ✕
      </button>
      <h2 className="text-lg font-bold mb-2">{type === 'quest' ? 'Quest' : 'Asset'} Details</h2>
      <div className="mb-4">
        <div className="font-semibold">{type === 'quest' ? data.title : data.name}</div>
        <div className="text-xs text-gray-600">{data.description}</div>
        {data.position && (
          <div className="text-xs mt-2 text-gray-400">
            Position: {data.position.top}, {data.position.left}
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded text-xs"
          onClick={() => onEditClick(selectedItem)}
        >
          Edit
        </button>
        <button
          className="bg-yellow-500 text-white px-3 py-1 rounded text-xs"
          onClick={() => onPlaceClick(data, type)}
        >
          Place on Map
        </button>
      </div>
    </aside>
  );
}

export default function Sidebar({ quests = [], assets = [], onQuestClick, onAssetClick }: Props) {
  // Remove the entire sidebar content when there are no quests or assets
  if (quests.length === 0 && assets.length === 0) {
    return null;
  }
  return (
    <div className="bg-white w-full lg:w-80 p-6 rounded-2xl shadow-md modern-card h-fit">
      {/* Quests */}
      {quests.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-bold uppercase text-gray-500 mb-2 flex items-center gap-2">
            <FaScroll /> Quests
          </h3>
          <ul className="space-y-2">
            {quests.map((quest) => (
              <li
                key={quest.id}
                onClick={() => onQuestClick(quest)}
                className="cursor-pointer p-2 border border-gray-200 rounded-md hover:border-emerald-400"
              >
                <p className="font-medium text-gray-800">{quest.title}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Assets */}
      {assets.length > 0 && (
        <div>
          <h3 className="text-sm font-bold uppercase text-gray-500 mb-2 flex items-center gap-2">
            <FaBox /> Assets
          </h3>
          <ul className="space-y-2">
            {assets.map((asset) => (
              <li
                key={asset.id}
                onClick={() => onAssetClick(asset)}
                className="cursor-pointer p-2 border border-gray-200 rounded-md hover:border-emerald-400"
              >
                <p className="font-medium text-gray-800">{asset.name}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}