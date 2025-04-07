'use client';

import { useState } from 'react';
import EditorModal from './EditorModal';

type AssetType = 'NPC' | 'Location' | 'Item';

interface AssetEditorProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    id?: string;
    name?: string;
    type?: AssetType;
    personality?: string;
    bio?: string;
  };
  worldName: string;
}

export default function AssetEditor({ isOpen, onClose, initialData, worldName }: AssetEditorProps) {
  const [activeTab, setActiveTab] = useState<AssetType>(initialData?.type || 'NPC');
  const [name, setName] = useState(initialData?.name || '');
  const [personality, setPersonality] = useState(initialData?.personality || '');
  const [bio, setBio] = useState(initialData?.bio || '');
  const [notes, setNotes] = useState('');
  
  // Placeholder data for AI-generated examples
  const aiSuggestions = {
    name: "Kaelin Voss",
    personality: "A sharp-witted merchant with a hidden past.",
    bio: "Once a disgraced noble, Kaelin now thrives in the underbelly of the city dealing in rare artifacts. He keeps a dagger strapped to his wrist—just in case an old rival comes knocking."
  };
  
  const handleAddToNotes = () => {
    // In a real application, this would save to a database
    alert('Added to notes!');
  };
  
  const handleRegenerate = () => {
    // In a real application, this would call an AI API
    alert('In a complete app, this would generate new content using AI!');
  };
  
  const handleExpandDescription = () => {
    // In a real application, this would call an AI API to expand the description
    alert('In a complete app, this would expand the description using AI!');
  };
  
  const handleMakeMoreUnique = () => {
    // In a real application, this would call an AI API to make the asset more unique
    alert('In a complete app, this would make the asset more unique using AI!');
  };
  
  return (
    <EditorModal isOpen={isOpen} onClose={onClose} title="Asset Editor">
      <div className="flex flex-col space-y-6">
        <div className="text-gray-700 text-sm font-medium">
          {worldName || "Your World"}
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <ul className="flex -mb-px">
            {(['NPC', 'Location', 'Item'] as AssetType[]).map((type) => (
              <li key={type} className="mr-1">
                <button
                  onClick={() => setActiveTab(type)}
                  className={`py-2 px-4 text-sm font-medium ${
                    activeTab === type
                      ? 'text-emerald-600 border-b-2 border-emerald-500'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {type}
                </button>
              </li>
            ))}
            <li className="mr-1">
              <button
                className="py-2 px-4 text-sm font-medium text-gray-400"
              >
                •••
              </button>
            </li>
          </ul>
        </div>
        
        {/* Main content areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Inspirations */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-800">Your Inspirations</h2>
            
            {/* Images section */}
            <div className="mb-6">
              <h3 className="text-sm font-bold uppercase text-gray-500 mb-2">Images</h3>
              <p className="text-gray-500 text-xs mb-4">Upload or paste images that inspire your asset. These can be AI-generated, hand-drawn, or sourced from elsewhere.</p>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
                  <div className="w-full h-full flex items-center justify-center">+</div>
                </div>
                <div className="h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
                  <div className="w-full h-full flex items-center justify-center">+</div>
                </div>
                <div className="h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
                  <div className="w-full h-full flex items-center justify-center">+</div>
                </div>
              </div>
            </div>
            
            {/* Text & Notes section */}
            <div>
              <h3 className="text-sm font-bold uppercase text-gray-500 mb-2">Texts & Notes</h3>
              <p className="text-gray-500 text-xs mb-4">Write down key ideas, lore, or any relevant descriptions. Keep track of details that shape your world.</p>
              
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-40 p-3 border border-gray-300 rounded-lg text-gray-700 text-sm"
                placeholder="Write your notes here..."
              />
            </div>
          </div>
          
          {/* Right Column - AI Generator */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-800">AI-Assisted Generator</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder={aiSuggestions.name}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Personality</label>
                <input
                  type="text"
                  value={personality}
                  onChange={(e) => setPersonality(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder={aiSuggestions.personality}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full h-24 p-2 border border-gray-300 rounded-md"
                  placeholder={aiSuggestions.bio}
                />
              </div>
              
              <button
                onClick={handleAddToNotes}
                className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm"
              >
                Add to Notes
              </button>
            </div>
            
            <div className="mt-8">
              <h3 className="text-sm font-bold text-gray-700 mb-3">Quick Adjustments</h3>
              <div className="space-y-2">
                <button
                  onClick={handleRegenerate}
                  className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-sm"
                >
                  Regenerate
                </button>
                <button
                  onClick={handleExpandDescription}
                  className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-sm"
                >
                  Expand Description
                </button>
                <button
                  onClick={handleMakeMoreUnique}
                  className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-sm"
                >
                  Make It More Unique
                </button>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-sm font-bold text-gray-700 mb-2">Optional Customization</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enter a Brief Prompt</label>
                <div className="flex">
                  <input
                    type="text"
                    className="flex-1 p-2 border border-gray-300 rounded-l-md"
                    placeholder="A rogue with a tragic past."
                  />
                  <button className="px-3 py-2 bg-gray-600 text-white rounded-r-md text-sm">
                    Go
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-sm font-bold text-gray-700 mb-2">Smart Linking</h3>
              <p className="text-gray-500 text-xs">Link this NPC/Item/Location to other inspirations in your project.</p>
            </div>
          </div>
        </div>
      </div>
    </EditorModal>
  );
} 