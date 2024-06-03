import { generateColorScale } from '@/lib/utils';

import { ScilentAudioFeatures } from '@/constant/types';

interface PropertiesChartProps {
  data: ScilentAudioFeatures[];
}

const PropertiesChart = ({ data }: PropertiesChartProps) => {
  console.log('properties', data);

  return (
    <div className='flex flex-col h-full w-full place-content-center'>
      {data.map((d) => (
        <div
          key={d.value}
          className='flex items-center justify-between px-6 gap-x-2'
        >
          <div className='inline-flex items-center gap-x-2'>
            <d.icon className='text-xl' />
            <h5 className='line-clamp-1 uppercase'>{d.labelShort}</h5>
          </div>
          <h1
            style={{
              color: generateColorScale(d.scale.min, d.scale.max, d.content),
            }}
          >
            {d.content}
          </h1>
        </div>
      ))}
    </div>
  );
};

export default PropertiesChart;
