'use client';

import { useState } from 'react';
import EditorModal from './EditorModal';

interface QuestEditorProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    id?: string;
    name?: string;
    description?: string;
    objectives?: string[];
    rewards?: string;
    difficulty?: string;
  };
  worldName: string;
}

export default function QuestEditor({ isOpen, onClose, initialData, worldName }: QuestEditorProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [objectives, setObjectives] = useState<string[]>(initialData?.objectives || []);
  const [newObjective, setNewObjective] = useState('');
  const [rewards, setRewards] = useState(initialData?.rewards || '');
  const [difficulty, setDifficulty] = useState(initialData?.difficulty || 'Medium');
  const [notes, setNotes] = useState('');
  
  // Placeholder data for AI-generated examples
  const aiSuggestions = {
    name: "The Goblin's Revenge",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor aliis, lectus magna fringilla urna, p",
    objectives: [
      "• aliis, lectus magna fringilla urna, p",
      "• Lorem ipsum dolor sit amet, consecte"
    ],
    rewards: "Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit"
  };
  
  const handleAddObjective = () => {
    if (newObjective.trim()) {
      setObjectives([...objectives, newObjective.trim()]);
      setNewObjective('');
    }
  };
  
  const handleRemoveObjective = (index: number) => {
    setObjectives(objectives.filter((_, i) => i !== index));
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
    // In a real application, this would call an AI API to make the quest more unique
    alert('In a complete app, this would make the quest more unique using AI!');
  };
  
  return (
    <EditorModal isOpen={isOpen} onClose={onClose} title="Quest Editor">
      <div className="flex flex-col space-y-6">
        <div className="text-gray-700 text-sm font-medium">
          {worldName || "Your World"}
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <ul className="flex -mb-px">
            <li className="mr-1">
              <button
                className="py-2 px-4 text-sm font-medium text-emerald-600 border-b-2 border-emerald-500"
              >
                Current Quest: {name || "[Quest Name]"}
              </button>
            </li>
            <li className="mr-1">
              <button
                className="py-2 px-4 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Bosses
              </button>
            </li>
            <li className="mr-1">
              <button
                className="py-2 px-4 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Assets (NPCs, Locations, Items)
              </button>
            </li>
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
              <p className="text-gray-500 text-xs mb-4">Upload or paste images that inspire your quest. These can be AI-generated, hand-drawn, or sourced from elsewhere.</p>
              
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Quest Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder={aiSuggestions.name}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Bio</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-24 p-2 border border-gray-300 rounded-md"
                  placeholder={aiSuggestions.description}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Objectives</label>
                <ul className="mb-2">
                  {objectives.length > 0 ? (
                    objectives.map((objective, index) => (
                      <li key={index} className="flex items-center mb-1">
                        <span className="flex-grow text-sm">{objective}</span>
                        <button 
                          onClick={() => handleRemoveObjective(index)}
                          className="text-red-500 text-xs ml-2"
                        >
                          Remove
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-400 text-sm italic">No objectives yet</li>
                  )}
                </ul>
                <div className="flex">
                  <input
                    type="text"
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    className="flex-grow p-2 border border-gray-300 rounded-l-md text-sm"
                    placeholder="Add a new objective"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddObjective()}
                  />
                  <button
                    onClick={handleAddObjective}
                    className="px-3 py-2 bg-gray-600 text-white rounded-r-md text-sm"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rewards</label>
                <input
                  type="text"
                  value={rewards}
                  onChange={(e) => setRewards(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder={aiSuggestions.rewards}
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
                    placeholder="[Character] faces against their strongest boss yet."
                  />
                  <button className="px-3 py-2 bg-gray-600 text-white rounded-r-md text-sm">
                    Go
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-sm font-bold text-gray-700 mb-2">Smart Linking</h3>
              <p className="text-gray-500 text-xs">Link this Quest to characters/assets/locations in your project.</p>
            </div>
          </div>
        </div>
      </div>
    </EditorModal>
  );
} 