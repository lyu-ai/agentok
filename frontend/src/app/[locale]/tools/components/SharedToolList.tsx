import { useSharedTools } from '@/hooks';
import SharedToolCard from './SharedToolCard';

const SharedToolList = ({ onFork }: any) => {
  const { tools } = useSharedTools();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mx-auto">
      {tools.map(tool => (
        <SharedToolCard key={tool.id} tool={tool} onFork={onFork} />
      ))}
    </div>
  );
};

export default SharedToolList;
