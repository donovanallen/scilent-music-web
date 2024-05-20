'use client';

import React, { Suspense, useEffect, useState } from 'react';

import sdk from '@/lib/spotify-sdk/ClientInstance';
import { cn } from '@/lib/utils';
import { useTopMusic } from '@/hooks/useTopMusic';

import MultiRadialChart from '@/components/charts/MultiRadialChart';
import RadarChart from '@/components/charts/RadarChart';
import HeaderItem from '@/components/HeaderItem';
import Skeleton from '@/components/Skeleton';

import {
  analyzeAudioFeatures,
  getAudioFeature,
  getAura,
} from '@/actions/getProfileAura';
import PropertiesChart from '@/components/charts/PropertiesChart';

const ProfileAura = () => {
  const [expanded, setExpanded] = useState(false);

  const {
    tracks: topTracks,
    // artists: topArtists,
    // filterOptions,
    // selectedFilter,
    // setSelectedFilter,
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
        // console.log({ audioFeatures });

        const aura = analyzeAudioFeatures(audioFeatures);
        // console.log({ aura });

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
          // console.log('auraFeatures :: properties', { properties });
          setAuraFeatures({ mood, context, properties });
        }
      }
    })();
  }, [topTracks]);

  return (
    <div className={cn('w-full h-auto border-b p-6')}>
      {/* TITLE */}
      <div
        className='flex items-center justify-between text-light mb-4 cursor-pointer gap-x-1'
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className='w-fit text-lg sm:text-xl md:text-2xl'>Aura</h3>
        {/* TOP ITEMS FILTER OPTIONS */}
      </div>

      {/* CONTAINER */}
      <div className='flex items-center'>
        {/* AURA ITEMS */}
        <Suspense fallback={<Skeleton />}>
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
        </Suspense>

        {/* AURA ITEMS FILTER OPTIONS */}

        {/* SHOW MORE BUTTON */}
      </div>
    </div>
  );
};

export default ProfileAura;
