'use client';

import * as Dialog from '@radix-ui/react-dialog';
import React from 'react';
import { IoMdClose } from 'react-icons/io';

import IconButton from '@/components/buttons/IconButton';

interface ModalProps {
  isOpen: boolean;
  onChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onChange,
  title,
  description,
  children,
}) => {
  return (
    <Dialog.Root open={isOpen} defaultOpen={isOpen} onOpenChange={onChange}>
      <Dialog.Portal>
        <Dialog.Overlay className='bg-dark/90 backdrop-blur-sm fixed inset-0 z-10' />
        <Dialog.Content className='fixed drop-shadow-md border border-neutral-400 top-[50%] left-[50%] max-h-full min-h-1/3 md:h-auto md:max-h-[85vh] min-w-1/3 w-auto md:w-[90vw] md:max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-lg p-12 focus:outline-none z-10'>
          <Dialog.Close asChild>
            <IconButton
              icon={IoMdClose}
              variant='ghost'
              className='text-neutral-400 text-lg md:text-xl hover:text-white absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:outline-none'
            />
          </Dialog.Close>
          {title && (
            <Dialog.Title className='h1 font-normal text-2xl md:text-3xl text-center mb-6 w-full'>
              {title}
            </Dialog.Title>
          )}
          {description && (
            <Dialog.Description className='font-thin text-sm md:text-base mb-6 text-center'>
              {description}
            </Dialog.Description>
          )}
          <div className='flex flex-col'>{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;
