'use client';

import { FaScroll, FaBox, FaUser, FaMapMarkerAlt } from 'react-icons/fa';

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

export default function Sidebar({ quests, assets, onQuestClick, onAssetClick }: Props) {
  return (
    <div className="bg-white w-full lg:w-80 p-6 rounded-2xl shadow-md modern-card h-fit">
      <h2 className="text-2xl font-bold mb-4 section-title text-center">SIDEBAR</h2>

      {/* Quests */}
      <div className="mb-6">
        <h3 className="text-sm font-bold uppercase text-gray-500 mb-2 flex items-center gap-2">
          <FaScroll /> Quests
        </h3>
        {quests.length > 0 ? (
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
        ) : (
          <p className="text-sm text-gray-400">No quests yet</p>
        )}
      </div>

      {/* Assets */}
      <div>
        <h3 className="text-sm font-bold uppercase text-gray-500 mb-2 flex items-center gap-2">
          <FaBox /> Assets
        </h3>
        {assets.length > 0 ? (
          <ul className="space-y-2">
            {assets.map((asset) => (
              <li
                key={asset.id}
                onClick={() => onAssetClick(asset)}
                className="cursor-pointer p-2 border border-gray-200 rounded-md hover:border-sky-400"
              >
                <p className="font-medium text-gray-800 flex items-center gap-2">
                  {asset.type === 'character' && <FaUser />}
                  {asset.type === 'location' && <FaMapMarkerAlt />}
                  {asset.type === 'item' && <FaBox />}
                  {asset.name}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400">No assets yet</p>
        )}
      </div>
    </div>
  );
}