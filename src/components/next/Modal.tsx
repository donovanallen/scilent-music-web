'use client';

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/modal';
import React from 'react';

import { cn } from '@/lib/utils';

interface NextModalProps {
  isOpen: boolean;
  onChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  size?:
    | 'md'
    | 'sm'
    | 'lg'
    | 'xl'
    | '2xl'
    | 'xs'
    | '3xl'
    | '4xl'
    | '5xl'
    | 'full';
}

const NextModal: React.FC<NextModalProps> = ({
  isOpen,
  onChange,
  title,
  description,
  children,
  className,
  size = 'md',
}) => {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onChange}
        isDismissable
        isKeyboardDismissDisabled
        className={cn(className)}
        classNames={{
          wrapper: '',
          base: 'bg-dark/80',
          backdrop: '',
          header: 'my-2',
          body: '',
          footer: '',
          closeButton: 'hover:bg-transparent hover:text-brand-dark',
        }}
        size={size}
        radius='lg'
        shadow='lg'
        backdrop='blur'
        placement='center'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h1 className='font-normal text-lg md:text-3xl sm:text-2xl text-center w-full'>
                  {title}
                </h1>
              </ModalHeader>
              <ModalBody>
                <p className='font-thin text-sm md:text-base text-center '>
                  {description}
                </p>
                {children}
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default NextModal;