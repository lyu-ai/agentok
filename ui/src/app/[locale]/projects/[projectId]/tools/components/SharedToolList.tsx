import { useSharedTools } from '@/hooks';
import SharedToolCard from './SharedToolCard';

const SharedToolList = ({ onFork }: any) => {
  const { tools } = useSharedTools();
  return (
    <div className="flex flex-col w-full gap-2">
      {tools.map(tool => (
        <SharedToolCard key={tool.id} tool={tool} onFork={onFork} />
      ))}
    </div>
  );
};

export default SharedToolList;
