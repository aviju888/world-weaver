'use client';

import React from 'react';
import { MapPinIcon, UserIcon, MapIcon, BoxIcon } from 'lucide-react';

interface MapPinProps {
  top: string;
  left: string;
  label: string;
  itemType: 'quest' | 'character' | 'location' | 'item';
  onClick: () => void;
  isSelected?: boolean;
}

export default function MapPin({
  top,
  left,
  label,
  itemType,
  onClick,
  isSelected = false
}: MapPinProps) {

  const getColorClasses = () => {
    if (isSelected) return 'bg-emerald-600 text-white';
    switch (itemType) {
      case 'quest': return 'bg-purple-600 text-white';
      case 'character': return 'bg-blue-600 text-white';
      case 'location': return 'bg-green-600 text-white';
      case 'item': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const getIcon = () => {
    switch (itemType) {
      case 'quest': return <MapPinIcon className="h-5 w-5" />;
      case 'character': return <UserIcon className="h-5 w-5" />;
      case 'location': return <MapIcon className="h-5 w-5" />;
      case 'item': return <BoxIcon className="h-5 w-5" />;
      default: return <MapPinIcon className="h-5 w-5" />;
    }
  };

  return (
    <button
      onClick={onClick}
      style={{
        position: 'absolute',
        top: top,
        left: left,
        transform: 'translate(-50%, -100%)',
        zIndex: isSelected ? 20 : 10
      }}
      className="flex flex-col items-center group cursor-pointer"
    >
      {/* Label above icon */}
      <span className={`text-sm font-bold text-black bg-white/90 px-2 rounded shadow-sm mb-1 border border-gray-300
  group-hover:bg-gray-300 transition-colors duration-150`}>
        {label.length > 20 ? `${label.slice(0, 20)}…` : label}
      </span>
      {/* Colored icon */}
      <div
        className={`rounded-full p-2 shadow-lg border ${getColorClasses()} 
        group-hover:brightness-90 transition-colors duration-150`}
      >
        {getIcon()}
      </div>
    </button>
  );
}