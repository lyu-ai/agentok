import {
  Dialog,
  DialogTitle,
  DialogPanel,
  Transition,
} from '@headlessui/react';
import clsx from 'clsx';
import { Fragment, useState } from 'react';
import { GoX } from 'react-icons/go';

const PopupDialog = ({
  className,
  classNameTitle,
  classNameBody,
  title,
  show,
  onClose,
  children,
}: any) => {
  return (
    <Transition show={show} as={Fragment}>
      <Dialog
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={() => onClose(false)}
        onClick={e => e.stopPropagation()}
        static
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-md" />

          <Transition
            show={true}
            enter="ease-out duration-500"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel
              className={clsx(
                'relative z-10 bg-base-100 text-base-content dark:bg-gray-800/80 rounded-md',
                className
              )}
            >
              <DialogTitle
                className={clsx(
                  'text-base-content font-bold p-2 flex items-center justify-between',
                  classNameTitle
                )}
              >
                {title}
                <GoX
                  className="h-5 w-5 hover:text-red-500 cursor-pointer"
                  onClick={() => onClose(false)}
                />
              </DialogTitle>
              <div className={clsx(classNameBody)}>{children}</div>
            </DialogPanel>
          </Transition>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PopupDialog;
