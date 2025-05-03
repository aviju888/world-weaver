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
        border: `4px solid ${data.color}`,
        padding: '1rem',
        borderRadius: '0.5rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        background: 'white'
      }}
    >
      <div className="text-center font-semibold p-2 rounded mb-2">
        {data.title}
      </div>
      <textarea 
        value={data.text}
        onChange={(e) => data.onTextChange(e.target.value)}
        placeholder="Description"
        className="border p-2 rounded w-full h-16"
      />
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default CustomCardNode;
