import PopupDialog from "@/components/PopupDialog";
import clsx from "clsx";
import { useState } from "react";

const DatasetConfig = ({ dataset, show, onApply, onClose }: any) => {
  const [name, setName] = useState(dataset?.name || "");
  const [description, setDescription] = useState(dataset?.description || "");
  return (
    <PopupDialog
      show={show}
      onClose={onClose}
      title="Dataset Config"
      className="w-full max-w-md"
      classNameBody="flex flex-col w-full p-2 gap-2"
    >
      <div className="form-control">
        <label className="label">
          <span className="label-text">Name</span>
        </label>
        <input
          type="text"
          placeholder="Dataset Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input input-sm input-bordered rounded"
        />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Description</span>
        </label>
        <textarea
          placeholder="Dataset Description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea textarea-sm textarea-bordered rounded"
        />
      </div>
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => onApply(name, description) && onClose()}
          className={clsx("btn btn-sm btn-primary min-w-24", {
            "btn-disabled": name === "",
          })}
        >
          OK
        </button>
      </div>
    </PopupDialog>
  );
};

export default DatasetConfig;
