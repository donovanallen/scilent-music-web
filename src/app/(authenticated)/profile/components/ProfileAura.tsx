'use client';

import React, { useEffect, useState } from 'react';

import sdk from '@/lib/spotify-sdk/ClientInstance';
import { cn } from '@/lib/utils';
import { useTopMusic } from '@/hooks/useTopMusic';

import MultiRadialChart from '@/components/charts/MultiRadialChart';
import PropertiesChart from '@/components/charts/PropertiesChart';
import RadarChart from '@/components/charts/RadarChart';
import FilterOptions from '@/components/FilterOptions';
import HeaderItem from '@/components/HeaderItem';
import InfoIcon from '@/components/InfoIcon';
import LoadingIndicator from '@/components/LoadingIndicator';

import {
  analyzeAudioFeatures,
  getAudioFeature,
  getAura,
} from '@/actions/getProfileAura';

const ProfileAura: React.FC = () => {
  // const [expanded, setExpanded] = useState(false);

  const {
    tracks: topTracks,
    filterOptions,
    selectedFilter,
    setSelectedFilter,
    isLoading,
  } = useTopMusic('short_term');

  const [auraFeatures, setAuraFeatures] = useState<{
    mood: any[];
    context: any[];
    properties: any[];
  }>();

  useEffect(() => {
    (async () => {
      if (topTracks) {
        const audioFeatures = await sdk.tracks.audioFeatures(
          topTracks?.map((track) => track.id),
        );

        const aura = analyzeAudioFeatures(audioFeatures);

        if (aura) {
          const { averages } = aura;
          const data = [];
          for (const average in averages) {
            if (Object.hasOwnProperty.call(averages, average)) {
              const value = averages[average];
              const auraItem = getAudioFeature(average);
              if (auraItem) {
                data.push({ ...auraItem, content: value });
              }
            }
          }

          const mood = data.filter((a) => a.type === 'mood');
          const context = data.filter((a) => a.type === 'context');
          const properties = data.filter((a) => a.type === 'property');
          setAuraFeatures({ mood, context, properties });
        }
      }
    })();
  }, [topTracks]);

  return (
    <div className={cn('w-full h-auto border-b py-6')}>
      {/* HEADER */}
      <div className='flex items-center justify-between text-dark dark:text-light mb-4 cursor-pointer gap-x-1'>
        {/* TITLE */}
        <div className='inline-flex items-center'>
          <h3
            className='w-fit text-lg sm:text-xl md:text-2xl'
            // onClick={() => setExpanded(!expanded)}
          >
            Aura
          </h3>
          {/* <div
            onClick={() => setExpanded(!expanded)}
            className='text-lg md:text-xl'
          >
            {expanded ? <FaMinus /> : <FaPlus />}
          </div> */}
          <InfoIcon
            tooltipEnabled
            tooltip={{
              content:
                'Your Aura consists of live insights from your listening data. For the given time periods, you can see how different aspects of your music preferences have changed. In future versions, this data will be much more extensive and you will be able to compare with friends and share socially.',
            }}
          />
        </div>

        {/* AURA ITEMS FILTER OPTIONS */}
        {filterOptions && topTracks && (
          <div className='inline-flex items-center gap-x-4'>
            <FilterOptions
              filterOptions={filterOptions}
              selectedFilter={selectedFilter}
              onFilterSelect={setSelectedFilter as () => void}
              tooltipsEnabled
            />
          </div>
        )}
      </div>

      {/* CONTAINER */}
      <div className='flex flex-col items-center'>
        {/* AURA ITEMS */}
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <div
            className={cn('flex w-full flex-col lg:flex-row gap-4 flex-wrap')}
          >
            {/* AURA - MOOD */}
            <div className='flex-1 w-full'>
              {auraFeatures?.mood && (
                <HeaderItem
                  title={getAura('mood')?.label}
                  icon={getAura('mood')?.icon}
                  className='h-full'
                >
                  {/* MULTIRADIAL CHART */}
                  <MultiRadialChart data={auraFeatures?.mood} width={200} />
                </HeaderItem>
              )}
            </div>

            {/* AURA - CONTEXT */}
            <div className='flex-1 w-full'>
              {auraFeatures?.context && (
                <HeaderItem
                  title={getAura('context')?.label}
                  icon={getAura('context')?.icon}
                  className='h-full'
                >
                  <RadarChart width={200} data={auraFeatures.context} />
                </HeaderItem>
              )}
            </div>
            {/* AURA - PROPERTIES */}
            <div className='flex-1 w-full'>
              {auraFeatures?.context && (
                <HeaderItem
                  title={getAura('property')?.label}
                  icon={getAura('property')?.icon}
                  className='h-full'
                >
                  <PropertiesChart data={auraFeatures?.properties} />
                </HeaderItem>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileAura;
