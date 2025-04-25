'use client';

import { useState, useEffect } from 'react';
import EditorModal from './EditorModal';
import { RotateCcw } from 'lucide-react';

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

  const handleAddToNotes = () => {
    if (!attributeContent.trim()) return;

    const newCard = {
      id: crypto.randomUUID(),
      title: selectedAttribute,
      text: attributeContent,
      image: '',
      editing: false,
    };

    setCards([...cards, newCard]);
    setAttributeContent('');
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

  const [cards, setCards] = useState<
    { id: string; image?: string; text?: string; title?: string; editing: boolean }[]
  >([]);

  const handleAddCard = () => {
    setCards([
      ...cards,
      {
        id: crypto.randomUUID(),
        image: '',
        text: '',
        editing: true,
      },
    ]);
  };

  const handleSubmitCard = (id: string) => {
    setCards(cards.map(card =>
      card.id === id ? { ...card, editing: false } : card
    ));
  };

  const handleCardChange = (id: string, field: 'image' | 'text', value: string) => {
    setCards(cards.map(card => card.id === id ? { ...card, [field]: value } : card));
  };

  const handleRemoveCard = (id: string) => {
    setCards(cards.filter(card => card.id !== id));
  };

  const handleGenerateDescription = async () => {
    if (!name.trim()) {
      setError("Please enter a character name.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('https://noggin.rea.gent/remaining-gerbil-7933', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer rg_v1_1z7gih66ihnzqf19eqb9ldrs3zlwd7aqi0sp_ngk',
        },
        body: JSON.stringify({
          attribute: selectedAttribute,
          character_name: name,
        }),
      });

      const text = await res.text();
      setAttributeContent(text);
    } catch (err: any) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert("Please enter a name before saving.");
      return false;
    }

    const npcData = {
      name,
      cards: cards.map(({ id, image, text, title }) => ({
        id,
        image,
        text,
        title,
      })),
    };

    const localDataRaw = localStorage.getItem('worldData');
    const localData = localDataRaw ? JSON.parse(localDataRaw) : {};

    if (!localData[worldName]) {
      localData[worldName] = {};
    }
    if (!localData[worldName]['asset-npc']) {
      localData[worldName]['asset-npc'] = {};
    }

    localData[worldName]['asset-npc'][name] = npcData;

    localStorage.setItem('worldData', JSON.stringify(localData));
    alert(`NPC "${name}" saved to world "${worldName}"`);
    return true;
  };

  const handleGenerateName = async () => {
    try {
      const res = await fetch('https://noggin.rea.gent/extreme-platypus-7812', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer rg_v1_vd6h7paoao9tc01r1jzlz0mklyjzajvoc20g_ngk',
        },
        body: JSON.stringify({
          asset_type: activeTab,
        }),
      });

      const generatedName = await res.text();
      setName(generatedName.trim());
    } catch (error) {
      console.error('Failed to generate name:', error);
      alert('Failed to generate name. Please try again.');
    }
  };

  const attributeOptions = [
    'Race & Species',
    'Background',
    'Personality',
    'Ideals',
    'Flaws & Quirks',
    'Notable Relationships',
    'Other',
  ];

  const [selectedAttribute, setSelectedAttribute] = useState(attributeOptions[0]);
  const [attributeContent, setAttributeContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <EditorModal isOpen={isOpen} onClose={onClose} title="Asset Editor" onSave={handleSave}>
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
                  className={`py-2 px-4 text-sm font-medium ${activeTab === type
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <div className="flex">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-l-md text-sm"
              placeholder="Enter a unique asset name"
            />
            <button
              onClick={handleGenerateName}
              className="px-3 bg-gray-300 hover:bg-gray-400 rounded-r-md text-gray-700 text-sm flex items-center justify-center"
              title="Generate Name"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Main content areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Inspirations */}
          {/* Card-based Inspirations Section */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-800">Your Inspirations</h2>
            <p className="text-gray-500 text-sm mb-4">Add cards containing text and/or images to help inspire or describe this asset.</p>

            <div className="space-y-4">
              {cards.map((card, index) => (
                <div key={card.id} className="border border-gray-300 rounded-lg p-4 shadow-sm relative">
                  <button
                    onClick={() => handleRemoveCard(card.id)}
                    className="absolute top-2 right-2 text-sm text-gray-400 hover:text-red-500"
                  >
                    ✕
                  </button>

                  {card.editing ? (
                    <>
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                        <input
                          type="text"
                          placeholder="Paste image URL here"
                          value={card.image}
                          onChange={(e) => handleCardChange(card.id, 'image', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
                        <textarea
                          placeholder="Write your inspiration text..."
                          value={card.text}
                          onChange={(e) => handleCardChange(card.id, 'text', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-sm"
                          rows={3}
                        />
                      </div>
                      <button
                        onClick={() => handleSubmitCard(card.id)}
                        className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700"
                      >
                        Submit
                      </button>
                    </>
                  ) : (
                    <>

                      <div className="flex space-x-4 items-start">
                        {card.image && (
                          <div className="w-32 flex-shrink-0">
                            <img
                              src={card.image}
                              alt={`Card ${index + 1}`}
                              className="rounded-md object-cover max-w-full max-h-40"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          {card.title && (
                            <h3 className="text-sm font-bold text-gray-800 mb-1">{card.title}</h3>
                          )}
                          {card.text && (
                            <p className="text-gray-700 text-sm whitespace-pre-wrap">
                              {card.text}
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  )
                  }
                </div>
              ))}
            </div>

            <button
              onClick={handleAddCard}
              className="mt-4 w-full px-4 py-2 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700"
            >
              + Add New Card
            </button>
          </div>

          {/* Right Column - AI Generator */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-800">AI-Assisted Generator</h2>

            <div className="space-y-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Attribute</label>
                <select
                  value={selectedAttribute}
                  onChange={(e) => setSelectedAttribute(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm mb-3"
                >
                  {attributeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>

                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={attributeContent}
                  onChange={(e) => setAttributeContent(e.target.value)}
                  className="w-full h-32 p-2 border border-gray-300 rounded-md text-sm"
                  placeholder={`Write about the character's ${selectedAttribute.toLowerCase()}...`}
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleGenerateDescription}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Generating...' : 'Generate Description'}
                </button>
                <button
                  onClick={handleAddToNotes}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm"
                >
                  Add to Notes
                </button>
              </div>
              {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
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