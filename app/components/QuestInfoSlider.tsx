// QuestInfoSlider.tsx
import React, { useState } from 'react';

const buildTree = (edges, nodes) => {
  const nodeMap = new Map();
  nodes.forEach(node => {
    nodeMap.set(node.id, { 
      ...node.data,
      id: node.id,
      children: [],
      isAsset: node.data.isAsset
    });
  });

  const childToParent = new Map();
  edges.forEach(edge => {
    childToParent.set(edge.target, edge.source);
  });

  const roots = [];
  nodeMap.forEach((node, id) => {
    if (!childToParent.has(id)) {
      roots.push(node);
    }
  });

  edges.forEach(edge => {
    const parent = nodeMap.get(edge.source);
    const child = nodeMap.get(edge.target);
    if (parent && child) {
      parent.children.push(child);
    }
  });

  return roots;
};

const TreeNode = ({ node, onAssetClick }) => {
  const [open, setOpen] = useState(false);
  
  if (node.isAsset) {
    return (
      <div className="ml-4 mt-2">
        <button
          onClick={() => onAssetClick(node)}
          className="text-left font-medium text-gray-600 hover:underline"
        >
          ⚙️ {node.title}
        </button>
      </div>
    );
  }

  return (
    <div className="ml-4 mt-2">
      <button
        onClick={() => setOpen(!open)}
        className="text-left font-medium hover:underline"
      >
        {open ? '▼' : '▶'} {node.title}
      </button>
      {open && node.children.length > 0 && (
        <div className="ml-4">
          {node.children.map(child => (
            <TreeNode key={child.id} node={child} onAssetClick={onAssetClick} />
          ))}
        </div>
      )}
    </div>
  );
};

const SlidingPane = ({ show, onClose, edges = [], nodes = [], onAssetClick }) => {
  const treeData = buildTree(edges, nodes);

  return (
    <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transition-transform duration-300 ${show ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Details</h2>
          <button onClick={onClose} className="text-sm text-gray-500 hover:text-red-500">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {treeData.map(root => (
            <TreeNode key={root.id} node={root} onAssetClick={onAssetClick} />
          ))}
        </div>
      </div>
    </div>
  );
};


export default SlidingPane;
