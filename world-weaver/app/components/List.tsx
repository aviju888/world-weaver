// FlowCanvas.tsx
import React, { useCallback, useState, useEffect, useRef } from 'react';
import { ReactFlowProvider } from 'reactflow';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Node,
  Edge,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomCardNode from './Card';
import SlidingPane from './QuestInfoSlider';

let id = 1;
const getId = () => `${id++}`;
const storageKey = 'flow-data';

const questTypes = [
  { label: 'Main Quest', color: '#e9d5ff' },
  { label: 'Story Quest', color: '#99f6e4' },
  { label: 'Side Quest', color: '#86efac' },
  { label: 'Boss Fight', color: '#93c5fd' },
  // { label: 'Asset', color: '#6b7280' },
];

const defaultNodes: Node[] = [
  {
    id: '0',
    type: 'customCard',
    position: { x: 100, y: 100 },
    data: {
      title: 'World',
      text: 'This is your world.',
      color: '#000000',
      isAsset: false,
      onTextChange: () => {},
    },
  },
];

const FlowCanvasInner = () => {
  const { setViewport, toObject } = useReactFlow();
  const nodeTypes = React.useMemo(() => ({ customCard: CustomCardNode }), []);
  const [minimizedNodes, setMinimizedNodes] = useState<{ [key: string]: boolean }>({});
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>(defaultNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [showPane, setShowPane] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [newQuestName, setNewQuestName] = useState('');
  const [currentQuestType, setCurrentQuestType] = useState<{ color: string; label: string } | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [selectedAsset, setSelectedAsset] = useState<Node | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedFlow = localStorage.getItem(storageKey);
    if (savedFlow) {
      const { nodes: savedNodes, edges: savedEdges, viewport } = JSON.parse(savedFlow);
      setNodes(savedNodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          onTextChange: (newText: string) => {
            setNodes(nodes => nodes.map(n =>
              n.id === node.id ? { ...n, data: { ...n.data, text: newText } } : n
            ));
          }
        }
      })));
      setEdges(savedEdges);
      setViewport(viewport);
    }
  }, []);

  useEffect(() => {
    const saveTimer = setTimeout(() => {
      localStorage.setItem(storageKey, JSON.stringify(toObject()));
    }, 500);
    return () => clearTimeout(saveTimer);
  }, [nodes, edges, toObject]);

  const addCard = () => {
    if (!currentQuestType || !newQuestName.trim()) return;
    // const isAsset = currentQuestType.label === 'Asset';
    const newId = getId();
    
    setNodes(nds => [...nds, {
      id: newId,
      type: 'customCard',
      position: { x: 100 + Math.random() * 300, y: 100 + Math.random() * 300 },
      data: {
        title: newQuestName,
        text: 'Write something here.',
        color: currentQuestType.color,
        // isAsset,
        onTextChange: (newText: string) => {
          setNodes(nodes => nodes.map(node =>
            node.id === newId ? { ...node, data: { ...node.data, text: newText } } : node
          ));
        }
      },
    }]);
    
    setNewQuestName('');
    setCurrentQuestType(null);
    setShowAddPopup(false);
  };

  const getAllDescendants = (nodeId: string) => {
    const descendants = new Set<string>();
    const stack = [nodeId];
    while (stack.length > 0) {
      const currentId = stack.pop()!;
      const children = edges.filter(e => e.source === currentId).map(e => e.target);
      children.forEach(childId => {
        if (!descendants.has(childId)) {
          descendants.add(childId);
          stack.push(childId);
        }
      });
    }
    return Array.from(descendants);
  };

  const toggleAllDescendantsVisibility = (nodeId: string) => {
    const descendantIds = getAllDescendants(nodeId);
    setMinimizedNodes(prev => {
      const allMinimized = descendantIds.every(id => prev[id]);
      const newState = { ...prev };
      descendantIds.forEach(id => newState[id] = !allMinimized);
      return newState;
    });
  };

  const handleRightClick = (event: React.MouseEvent) => {
    event.preventDefault();
    if (!selectedNodeId) {
      setPopupPosition({ x: event.clientX - 450, y: event.clientY - 100});
      setShowPopup(true);
    }
  };

  const handleNodeRightClick = (event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedNodeId(node.id);
    setPopupPosition({ x: event.clientX - 450, y: event.clientY - 100});
    setShowPopup(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowPopup(false);
        setSelectedNodeId(null);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const onConnect = useCallback(
    (connection: Connection) => setEdges(eds => addEdge(connection, eds)),
    [setEdges]
  );

  const filteredEdges = edges.filter(edge => 
    !(minimizedNodes[edge.source] || minimizedNodes[edge.target])
  );
  const filteredNodes = nodes.filter(node => !minimizedNodes[node.id]);

  return (
    <div className="h-full bg-gray-900 flex items-center justify-center">
      <div 
        className="h-full w-full bg-white shadow-xl overflow-hidden relative"
        onContextMenu={handleRightClick}
      >
        <ReactFlow
          nodes={filteredNodes}
          edges={filteredEdges}
          onNodesChange={onNodesChange}
          onConnect={onConnect}
          onNodeContextMenu={handleNodeRightClick}
          nodeTypes={nodeTypes}
          connectionRadius={20}
          isValidConnection={(connection) => {
            const sourceNode = nodes.find(n => n.id === connection.source);
            return connection.source !== connection.target && !sourceNode?.data.isAsset;
          }}
          // fitView
          defaultViewport={{ x: 300, y: 300, zoom: 0.95 }}
        >
          <Background />
          <MiniMap />
          <Controls />
        </ReactFlow>

        <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
          {questTypes.map(({ label, color }) => (
            <button
              key={label}
              className="px-4 py-2 text-white rounded"
              style={{ backgroundColor: color }}
              onClick={() => {
                setCurrentQuestType({ color, label });
                setShowAddPopup(true);
              }}
            >
              Add {label}
            </button>
          ))}
          {/* <button onClick={() => localStorage.clear()}>
            Clear All Local Storage
          </button> */}
        </div>

        {showAddPopup && (
          <div className="absolute inset-0 flex items-center justify-center z-[1000] pointer-events-none">
            <div className="bg-white p-6 rounded-lg min-w-[300px] shadow-2xl pointer-events-auto">
              <h2 className="text-xl font-semibold mb-4">Name Your {currentQuestType?.label}</h2>
              <input
                type="text"
                value={newQuestName}
                onChange={e => setNewQuestName(e.target.value)}
                placeholder="Enter name"
                className="w-full p-2 border rounded mb-4"
                autoFocus
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowAddPopup(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={addCard}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {showPopup && (
          <div
            ref={popupRef}
            className="absolute bg-white p-4 rounded-lg shadow-lg z-[100] min-w-[200px]"
            style={{ top: popupPosition.y, left: popupPosition.x }}
          >
            <h2 className="text-lg font-semibold mb-2 text-gray-900">
              {selectedNodeId ? "Node Options" : "Canvas Options"}
            </h2>
            
            {selectedNodeId ? (
              <>
                {/* <button
                  onClick={() => {
                    setShowPane(true);
                    setShowPopup(false);
                  }}
                  className="mt-2 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  View Details
                </button> */}
                <button
                  onClick={() => {
                    toggleAllDescendantsVisibility(selectedNodeId);
                    setShowPopup(false);
                  }}
                  className="mt-2 w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  {getAllDescendants(selectedNodeId).every(id => minimizedNodes[id]) 
                    ? 'Expand All Children' 
                    : 'Minimize All Children'}
                </button>
                <button
                  onClick={() => {
                    if (selectedNodeId) {
                      setNodes(nds => nds.filter(node => node.id !== selectedNodeId));
                      setEdges(eds => eds.filter(edge => 
                        edge.source !== selectedNodeId && edge.target !== selectedNodeId
                      ));
                      setShowPopup(false);
                      setSelectedNodeId(null);
                    }
                  }}
                  className="mt-2 w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete Node
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowPopup(false)}
                className="mt-2 w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Clear Selection
              </button>
            )}
          </div>
        )}

        <SlidingPane 
          show={showPane} 
          onClose={() => setShowPane(false)}
          edges={edges}
          nodes={nodes}
          onAssetClick={setSelectedAsset}
        />
        
        {/* <AssetPane
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
        /> */}
      </div>
    </div>
  );
};

const FlowCanvas = () => (
  <ReactFlowProvider>
    <FlowCanvasInner />
  </ReactFlowProvider>
);

export default FlowCanvas;
