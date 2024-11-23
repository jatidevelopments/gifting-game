import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { motion } from 'framer-motion';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}: ConfirmationModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl 
                bg-white/10 backdrop-blur-sm p-6 text-left align-middle shadow-xl transition-all 
                border border-white/20">
                <Dialog.Title
                  as="h3"
                  className="flex items-center gap-2 text-lg leading-6 
                    bg-gradient-to-r from-purple-400 to-red-400 text-transparent bg-clip-text"
                >
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
                  {title}
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-300">
                    {message}
                  </p>
                </div>

                <div className="mt-4 flex justify-end gap-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex justify-center rounded-lg border border-white/10 
                      bg-white/5 px-4 py-2 text-sm font-medium text-white/80 
                      hover:bg-white/10 transition-colors focus:outline-none 
                      focus-visible:ring-2 focus-visible:ring-purple-500/50"
                    onClick={onClose}
                  >
                    {cancelText}
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex justify-center rounded-lg border border-red-500/20 
                      bg-gradient-to-r from-red-500/20 to-purple-500/20 px-4 py-2 
                      text-sm font-medium text-white hover:from-red-500/30 hover:to-purple-500/30 
                      transition-all focus:outline-none focus-visible:ring-2 
                      focus-visible:ring-red-500/50"
                    onClick={() => {
                      onConfirm();
                      onClose();
                    }}
                  >
                    {confirmText}
                  </motion.button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
