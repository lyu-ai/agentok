import { LuConstruction } from 'react-icons/lu';

const UnderConstruction = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="flex flex-col items-center justify-center gap-2 p-2 text-gray-700">
        <LuConstruction className="w-20 h-20" />
        <h1>Under Construction ...</h1>
      </div>
    </div>
  );
};

export default UnderConstruction;
