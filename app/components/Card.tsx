import { Handle, Position } from 'reactflow';

interface CustomNodeData {
  title: string;
  text: string;
  color: string;
  onTextChange: (newText: string) => void;
}

const CustomCardNode = ({ data, id }: { data: CustomNodeData; id: string }) => {
  return (
    <div 
      style={{ 
        border: `2px solid ${data.color}`,
        background: 'white'
      }}
      className="p-2 rounded-md shadow-sm w-[10vw] max-w-[200px] min-w-[140px] text-gray-800"
    >
      <div className="text-center font-medium text-sm p-1 mb-1">
        {data.title}
      </div>
      <textarea 
        value={data.text}
        onChange={(e) => data.onTextChange(e.target.value)}
        placeholder="Description"
        className="border border-gray-200 p-1 rounded-md w-full min-h-[40px] text-xs resize-none"
      />
      {data.assets && data.assets.length > 0 && (
        <div className="mt-2 space-y-1">
          {data.assets.map((assetName: string) => (
            <div
              key={assetName}
              className="text-xs text-emerald-700 cursor-pointer hover:underline"
              onClick={() => {
                // We'll wire up the click in Step 3
                const event = new CustomEvent("asset-clicked", { detail: assetName });
                window.dispatchEvent(event);
              }}
            >
              {assetName}
            </div>
          ))}
        </div>
      )}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default CustomCardNode;