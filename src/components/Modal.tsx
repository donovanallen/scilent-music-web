'use client';

import * as Dialog from '@radix-ui/react-dialog';
import React from 'react';
import { IoMdClose } from 'react-icons/io';

import { cn } from '@/lib/utils';

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
  className,
}) => {
  return (
    <Dialog.Root open={isOpen} defaultOpen={isOpen} onOpenChange={onChange}>
      <Dialog.Portal>
        <Dialog.Overlay className='bg-dark/90 backdrop-blur-sm fixed inset-0 z-10' />
        <Dialog.Content
          className={cn(
            'fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-10',
            'drop-shadow-md border border-neutral-400 rounded-lg py-12 px-6 focus:outline-none',
            'max-h-[90vh] min-h-1/2 md:h-auto md:max-h-[85vh]',
            'max-w-[90vw] w-auto sm:min-w-1/2 md:w-[90vw] md:max-w-[450px]',
            className,
          )}
        >
          <Dialog.Close asChild>
            <IconButton
              icon={IoMdClose}
              variant='ghost'
              className='text-neutral-400 text-lg md:text-xl hover:text-white absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:outline-none'
            />
          </Dialog.Close>
          {title && (
            <Dialog.Title className='h1 font-normal text-lg md:text-3xl sm:text-2xl text-center mb-6 w-full'>
              {title}
            </Dialog.Title>
          )}
          {description && (
            <Dialog.Description className='font-thin text-sm md:text-base mb-6 text-center px-6'>
              {description}
            </Dialog.Description>
          )}
          <div className='flex flex-col w-full'>{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;
