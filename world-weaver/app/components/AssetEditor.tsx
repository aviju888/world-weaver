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
  // Fallback: render a visible message if modal is open but no initialData is provided
  if (isOpen && !initialData) {
    return (
      <EditorModal isOpen={isOpen} onClose={onClose} title="Asset Editor">
        <div style={{ color: 'red', padding: 24, fontWeight: 'bold' }}>
          No initial data provided to AssetEditor!
        </div>
      </EditorModal>
    );
  }

  const [activeTab, setActiveTab] = useState<AssetType>(initialData?.type || 'NPC');
  const [name, setName] = useState(initialData?.name || '');

  useEffect(() => {
    const newOptions = getAttributeOptions(activeTab);
    setSelectedAttribute(newOptions[0]);
  }, [activeTab]);

  useEffect(() => {
    if (!isOpen) {
      // Reset states when modal closes
      setCards([]);
      setAttributeContent('');
      setSelectedAttribute(getAttributeOptions(activeTab)[0]);
      setIsLoading(false);
      setError(null);
    }
  }, [isOpen]);

  const [cards, setCards] = useState<
    { id: string; image?: string; text?: string; title?: string; editing: boolean }[]
  >([]);
  const [selectedAttribute, setSelectedAttribute] = useState<string>('');
  const [attributeContent, setAttributeContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

  const stringifyCards = (cards: { id: string; title?: string; text?: string; image?: string; editing: boolean }[]) => {
    return cards
      .filter(card => card.title || card.text)
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
      .filter(Boolean)
      .join('; ');
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
        assetCategory = 'asset-npc';
    }
  
    if (!localData[worldName][assetCategory]) {
      localData[worldName][assetCategory] = {};
    }
  
    localData[worldName][assetCategory][name] = assetData;
  
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
              <button className="py-2 px-4 text-sm font-medium text-gray-400">•••</button>
            </li>
          </ul>
        </div>

        {/* Name Input */}
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

        {/* Inspirations & AI Generator code omitted for brevity */}
      </div>
    </EditorModal>
  );
}