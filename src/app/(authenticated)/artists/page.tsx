'use client';

import {
  Accordion,
  AccordionItem,
  Avatar,
  ScrollShadow,
} from '@nextui-org/react';
import { Autocomplete, AutocompleteItem } from '@nextui-org/react';
import { useFilter } from '@react-aria/i18n';
import { Artist } from '@spotify/web-api-ts-sdk';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FaMicrophone, FaMinus, FaPlus } from 'react-icons/fa6';
import { IoSearch } from 'react-icons/io5';
import { TbNumber1, TbNumber2, TbNumber3 } from 'react-icons/tb';

import { cn } from '@/lib/utils';
import { useFollowedArtists } from '@/hooks/useFollowedArtists';
import { useTopMusic } from '@/hooks/useTopMusic';

import ArtistsCollection from '@/components/ArtistsCollection';
import Box from '@/components/Box';
import FilterOptions from '@/components/FilterOptions';
import Header from '@/components/Header';
import InfoIcon from '@/components/InfoIcon';
import LoadingIndicator from '@/components/LoadingIndicator';
import HeaderCard from '@/components/next/HeaderCard';

type FieldState = {
  selectedKey: React.Key | null;
  inputValue: string;
  items: Artist[];
};

const Artists = () => {
  const router = useRouter();
  const {
    total: followedCount,
    followedArtists,
    isLoading,
  } = useFollowedArtists();

  const {
    artists: topArtists,
    filterOptions,
    selectedFilter,
    setSelectedFilter,
    isLoading: isLoadingTopMusic,
  } = useTopMusic('short_term');

  // Store Autocomplete input value, selected option, open state, and items
  // in a state tracker
  const [fieldState, setFieldState] = useState<FieldState>({
    selectedKey: '',
    inputValue: '',
    items: followedArtists,
  });
  // Implement custom filtering logic and control what items are
  // available to the Autocomplete.
  const { startsWith } = useFilter({ sensitivity: 'base' });
  // Specify how each of the Autocomplete values should change when an
  // option is selected from the list box
  const onSelectionChange = (key: React.Key) => {
    setFieldState((prevState) => {
      const selectedItem = prevState.items.find(
        (option) => option.name === key,
      );

      return {
        inputValue: selectedItem?.name || '',
        selectedKey: key,
        items: followedArtists.filter((item) =>
          startsWith(item.name, selectedItem?.name || ''),
        ),
      };
    });
  };
  // Specify how each of the Autocomplete values should change when the input
  // field is altered by the user
  const onInputChange = (value: string) => {
    setFieldState((prevState) => ({
      inputValue: value,
      selectedKey: value === '' ? null : prevState.selectedKey,
      items: followedArtists.filter((item) => startsWith(item.name, value)),
    }));
  };

  return (
    <Box className='h-full flex flex-col'>
      <Header title='Artists'>
        <Accordion
          className='flex flex-col'
          variant='light'
          disableIndicatorAnimation
          isCompact
          showDivider={false}
          fullWidth
          itemClasses={{
            base: 'bg-transparent',
            heading: 'inline-flex items-center gap-x-2 justify-start',
            title: 'h4 text-dark/50 dark:text-light/50',
          }}
          defaultExpandedKeys={['1']}
        >
          <AccordionItem
            key='1'
            aria-label='Top Artists'
            title='Top Artists'
            indicator={({ isOpen }) =>
              isOpen ? <FaMinus size={12} /> : <FaPlus size={12} />
            }
          >
            <div className='flex flex-col gap-y-4 w-full'>
              <div className={cn('flex w-full flex-col md:flex-row gap-4 ')}>
                {topArtists &&
                  topArtists.length > 0 &&
                  topArtists
                    .slice(0, 3)
                    .map((artist, i) => (
                      <HeaderCard
                        key={artist.id}
                        name={artist.name}
                        icon={
                          i + 1 === 1
                            ? TbNumber1
                            : i + 1 === 2
                              ? TbNumber2
                              : i + 1 === 3
                                ? TbNumber3
                                : undefined
                        }
                        image={artist.images[0].url}
                        onClick={() => router.push(`/artist/${artist.id}`)}
                        className='flex-1 max-h-[120px]'
                      />
                    ))}
              </div>

              {filterOptions && topArtists && (
                <div className='inline-flex items-center gap-x-4 self-end'>
                  <FilterOptions
                    filterOptions={filterOptions}
                    selectedFilter={selectedFilter}
                    onFilterSelect={setSelectedFilter as () => void}
                    tooltipsEnabled
                  />
                </div>
              )}
            </div>
          </AccordionItem>
        </Accordion>
        <Autocomplete
          fullWidth
          inputValue={fieldState.inputValue}
          items={fieldState.items}
          size='sm'
          // label='Followed Artists'
          placeholder='Search your followed artists'
          selectedKey={fieldState.selectedKey as string}
          variant='underlined'
          onInputChange={onInputChange}
          // onOpenChange={onOpenChange}
          onSelectionChange={onSelectionChange as () => void}
          startContent={
            <IoSearch className='text-light/50' strokeWidth={2.5} size={20} />
          }
        >
          {(item) => (
            <AutocompleteItem
              key={item.id}
              startContent={
                <Avatar
                  size='sm'
                  src={item.images[0].url}
                  fallback={<FaMicrophone />}
                  alt={item.name}
                  className='w-6 h-6'
                />
              }
            >
              {item.name}
            </AutocompleteItem>
          )}
        </Autocomplete>
      </Header>

      <ScrollShadow hideScrollBar>
        <div className='overflow-y-auto overflow-x-hidden py-4 px-6'>
          <div className='inline-flex items-center justify-between w-full mb-4'>
            <div className='inline-flex items-center gap-x-2'>
              <h4 className='text-dark/50 dark:text-light/50 text-lg sm:text-xl md:text-2xl'>
                Followed Artists
              </h4>
              <InfoIcon
                tooltipEnabled
                tooltip={{
                  content:
                    'Your collection of artists followed on Spotify. Follow you favorite artists to enhance your Scilent Music experience.',
                }}
              />
            </div>
            <h4 className='text-dark dark:text-light font-thin subtitle'>
              {followedCount} total
            </h4>
          </div>
          {isLoading ? (
            <div className='w-full h-full items-center justify-center'>
              <LoadingIndicator />
            </div>
          ) : (
            <ArtistsCollection
              artists={
                followedArtists.sort((a, b) =>
                  a.name.localeCompare(b.name),
                ) as Artist[]
              }
            />
          )}
        </div>
      </ScrollShadow>
    </Box>
  );
};

export default Artists;
