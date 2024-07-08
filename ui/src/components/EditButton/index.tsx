import { RiCheckLine, RiEdit2Line } from 'react-icons/ri';

const EditButton = ({
  editing,
  setEditing,
  defaultLabel,
  editingLabel,
}: any) => {
  return (
    <div
      className="cursor-pointer hover:text-white"
      onClick={() => setEditing(!editing)}
      data-tooltip-id="default-tooltip"
      data-tooltip-content={editing ? editingLabel : defaultLabel}
      data-tooltip-place="top"
    >
      {editing ? (
        <RiCheckLine className="w-4 h-4" />
      ) : (
        <RiEdit2Line className="w-4 h-4" />
      )}
    </div>
  );
};
export default EditButton;
