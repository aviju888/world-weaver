import React from 'react';

interface AssetData {
  title?: string;
  text?: string;
}

interface AssetPaneProps {
  asset?: {
    data?: AssetData;
  };
  onClose: () => void;
}

const AssetPane = ({ asset, onClose }: AssetPaneProps) => {
  return (
    <div 
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transition-transform duration-300 ${
        asset ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {asset?.data?.title || 'Untitled Asset'}
          </h2>
          <button onClick={onClose} className="text-sm text-gray-500 hover:text-red-500">
            ✕
          </button>
        </div>
        <div className="flex-1">
          <p className="text-gray-600 mb-2">Asset Description:</p>
          <textarea 
            value={asset?.data?.text || ''}
            readOnly
            className="w-full p-2 border rounded"
            rows={4}
          />
        </div>
      </div>
    </div>
  );
};

export default AssetPane;
