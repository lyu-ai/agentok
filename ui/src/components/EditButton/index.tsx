import { GoCheck, GoPencil } from 'react-icons/go';

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
        <GoCheck className="w-4 h-4" />
      ) : (
        <GoPencil className="w-4 h-4" />
      )}
    </div>
  );
};
export default EditButton;
