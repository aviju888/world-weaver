'use client';

import { useState, useEffect, useRef } from 'react';
import EditorModal from './EditorModal';
import { RotateCcw, Wand2 } from 'lucide-react';

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
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const newOptions = getAttributeOptions(activeTab);
    setSelectedAttribute(newOptions[0]);
  }, [activeTab]);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name || '');
        setActiveTab(initialData.type || 'NPC');
  
        // LOAD FROM LOCALSTORAGE
        const localDataRaw = localStorage.getItem('worldData');
        const localData = localDataRaw ? JSON.parse(localDataRaw) : {};
  
        let assetCategory = '';
        switch (initialData.type) {
          case 'NPC': assetCategory = 'asset-npc'; break;
          case 'Location': assetCategory = 'asset-location'; break;
          case 'Item': assetCategory = 'asset-item'; break;
          default: assetCategory = 'asset-npc';
        }
  
        const saved = localData[worldName]?.[assetCategory]?.[name];
  
        if (saved) {
          const loadedCards = (saved.cards || []).map((c: any) => ({
            id: c.id || crypto.randomUUID(),
            image: c.image || '',
            text: c.text || '',
            title: c.title || '',
            editing: false
          }));
          setCards(loadedCards);
        } else {
          setCards([]);
        }
  
        setAttributeContent('');
        setSelectedAttribute(getAttributeOptions(initialData.type || 'NPC')[0]);
        setIsLoading(false);
        setError(null);
  
      } else {
        // Fresh state for new asset
        setName('');
        setActiveTab('NPC');
        setCards([]);
        setAttributeContent('');
        setSelectedAttribute(getAttributeOptions('NPC')[0]);
        setIsLoading(false);
        setError(null);
      }
    }
  }, [isOpen, initialData, worldName]);

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
          asset_name: name,
          asset_type: activeTab,
          inspirations: stringifyCards(cards),
          user_input: attributeContent,
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

  const handleEditWithAI = async (editPrompt: string) => {
    if (!attributeContent.trim()) {
      setError("Please write something first.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('https://noggin.rea.gent/organisational-duck-1340', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer rg_v1_gp47k92bfdcvzqww9i1nld5gcjlvkv2pnlmf_ngk',
        },
        body: JSON.stringify({
          prompt: editPrompt,
          input: attributeContent,
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

  const stringifyCards = (cards: { id: string; title?: string; text?: string; image?: string; editing: boolean }[]) => {
    return cards
      .filter(card => card.title || card.text) // only include cards that have something meaningful
      .map(card => {
        const title = card.title ? card.title.trim() : '';
        const text = card.text ? card.text.trim() : '';
        if (title && text) {
          return `${title}: ${text}`;
        } else if (text) {
          return text;
        } else if (title) {
          return title;
        } else {
          return '';
        }
      })
      .filter(Boolean) // remove empty strings
      .join('; '); // separate entries by ;
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert("Please enter a name before saving.");
      return false;
    }
  
    const assetData = {
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
  
    // Determine the correct category based on activeTab
    let assetCategory = '';
    switch (activeTab) {
      case 'NPC':
        assetCategory = 'asset-npc';
        break;
      case 'Location':
        assetCategory = 'asset-location';
        break;
      case 'Item':
        assetCategory = 'asset-item';
        break;
      default:
        assetCategory = 'asset-npc'; // fallback
    }
  
    if (!localData[worldName][assetCategory]) {
      localData[worldName][assetCategory] = {};
    }
  
    // preserve the previous position and other metadata
    const previous = localData[worldName][assetCategory][name] || {};
    const preservedPosition = previous.position || null;
  
    localData[worldName][assetCategory][name] = {
      ...previous,
      ...assetData,
      ...(preservedPosition ? { position: preservedPosition } : {})  // force keep position even if overwritten
    };
  
    localStorage.setItem('worldData', JSON.stringify(localData));
  
    alert(`${activeTab} "${name}" saved to world "${worldName}"`);
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


  const getAttributeOptions = (tab: AssetType) => {
    switch (tab) {
      case 'NPC':
        return [
          'Race & Species',
          'Background',
          'Personality',
          'Ideals',
          'Flaws & Quirks',
          'Notable Relationships',
          'Other',
        ];
      case 'Location':
        return [
          'Geography & Terrain',
          'Climate & Weather',
          'History',
          'Culture & Customs',
          'Important Landmarks',
          'Local Dangers',
          'Other',
        ];
      case 'Item':
        return [
          'Type & Category',
          'Origin Story',
          'Materials Used',
          'Magical Properties',
          'Usage Instructions',
          'Known Owners',
          'Other',
        ];
      default:
        return ['Other'];
    }
  };

  const [selectedAttribute, setSelectedAttribute] = useState(getAttributeOptions(activeTab)[0]);
  const [attributeContent, setAttributeContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <EditorModal isOpen={isOpen} onClose={onClose} title="Asset Editor" onSave={handleSave} disableBackdropClose={true}>
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

              {/* Attribute select + Generate Description */}
              <div className="flex items-center gap-2 mb-2">
                <select
                  value={selectedAttribute}
                  onChange={(e) => setSelectedAttribute(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  {getAttributeOptions(activeTab).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleGenerateDescription}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700 whitespace-nowrap"
                  disabled={isLoading}
                >
                  {isLoading ? 'Generating...' : 'Generate'}
                </button>
              </div>

              {/* Description Textarea */}
              <div className="mb-2">
                <textarea
                  value={attributeContent}
                  onChange={(e) => setAttributeContent(e.target.value)}
                  className="w-full h-32 p-2 border border-gray-300 rounded-md text-sm"
                  placeholder={`Write about the ${activeTab}'s ${selectedAttribute.toLowerCase()}...`}
                />
              </div>

              {/* Edit with AI + Add to Notes */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Wand2 className={`h-4 w-4 ${attributeContent.trim() ? 'text-gray-700' : 'text-gray-400'}`} />
                  <select
                    onChange={async (e) => {
                      if (e.target.value) {
                        await handleEditWithAI(e.target.value);
                        e.target.selectedIndex = 0; // reset to default after action
                      }
                    }}
                    disabled={!attributeContent.trim()}
                    className={`text-sm p-2 border rounded-md min-w-[10rem] ${attributeContent.trim()
                        ? 'bg-white text-gray-700 border-gray-300'
                        : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      }`}
                  >
                    <option value="">Edit with AI</option>
                    <option value="Expand Description">Expand Description</option>
                    <option value="Shorten Description">Shorten Description</option>
                    <option value="Simplify Language">Simplify Language</option>
                    <option value="Fix Spelling & Grammar">Fix Spelling & Grammar</option>
                    <option value="Be More Specific">Be More Specific</option>
                    <option value="Break into Bullet Points">Break into Bullet Points</option>
                    <option value="Add Inner Motivation">Add Inner Motivation</option>
                    <option value="Make More Vivid">Make More Vivid</option>
                  </select>
                </div>

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
              <h3 className="text-sm font-bold text-gray-700 mb-2">Smart Linking</h3>
              <p className="text-gray-500 text-xs">Link this NPC/Item/Location to other inspirations in your project.</p>
            </div>
          </div>
        </div>
      </div>
    </EditorModal>
  );
} 