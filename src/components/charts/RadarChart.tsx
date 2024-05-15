'use client';

import { ReactNode } from 'react';
import {
  VictoryArea,
  VictoryChart,
  VictoryGroup,
  VictoryPolarAxis,
  VictoryScatter,
} from 'victory';

import { getAudioFeature } from '@/actions/getProfileAura';
import { ScilentAudioFeatures } from '@/constant/types';

const getMaxima = (data: ScilentAudioFeatures[]): any => {
  const contentValues = data.map((feature: any) => parseFloat(feature.content));
  const maxValue = Math.max(...contentValues);

  const maxima: any = {};
  data.forEach((feature: any) => {
    maxima[feature.value] = maxValue * 1.5; // make chart max relative to values (can be illegible at smaller values)
    // maxima[feature.value] = feature.scale.max;
  });
  return maxima;
};

const processData = (data: ScilentAudioFeatures[]): RadarChartData[] => {
  const maxByGroup = getMaxima(data);

  return data.map((feature: any) => {
    return {
      x: feature.value,
      y: parseFloat(feature.content) / maxByGroup[feature.value],
    };
  });
};

const ChartLabelIcon = (props: {
  x: number;
  y: number;
  datum: any;
}): ReactNode | undefined => {
  const { x, y, datum } = props;

  const iconName = datum.icon
    ? datum.icon.name
    : datum.xName
      ? getAudioFeature(datum.xName).icon.name
      : undefined;

  if (datum.icon) {
    return (
      <foreignObject x={x - 10} y={y - 10}>
        {iconName}
      </foreignObject>
    );
  } else if (datum.xName) {
    return (
      <foreignObject x={x - 10} y={y - 10}>
        {iconName}
      </foreignObject>
    );
  }
};

interface RadarChartProps {
  width: number;
  data: ScilentAudioFeatures[];
  fullSize?: boolean;
}

interface RadarChartData {
  x: number;
  y: number;
}

const RadarChart = ({
  data,
  width = 200,
  fullSize = false,
}: RadarChartProps) => {
  const chartData: RadarChartData[] = processData(data);
  const maxima = getMaxima(data);
  const maximum = Math.max(...(Object.values(maxima) as number[]));
  // console.log(maxima, { maximum });
  console.log(data, { data });

  const SmallRadarChart = () => (
    // Wrapper Svg needed for onPress events to work properly
    <div className='flex flex-col items-center justify-around h-full'>
      <VictoryChart
        width={width}
        height={width / 2}
        polar
        domain={{ y: [0, 1] }}
        padding={8}
      >
        {Object.keys(maxima).map((key, i) => {
          // const aura = getAudioFeature(key);

          return (
            // {/* POLAR */}
            <VictoryPolarAxis
              key={`polar-${i}`}
              dependentAxis
              axisValue={i + 1}
              labelPlacement='vertical'
              tickFormat={() => ``}
              tickCount={2}
              style={{
                axisLabel: {
                  fill: 'gray',
                },
                grid: {
                  stroke: 'gray',
                  strokeWidth: 0.5,
                  opacity: 0.5,
                },
              }}
            />
          );
        })}

        {/* CHART DATA */}
        <VictoryGroup>
          {/* AREA */}
          <VictoryArea
            interpolation='catmullRom' // "basis", "cardinal", "catmullRom", "linear"
            data={chartData}
            style={{
              data: {
                fillOpacity: 0.7,
                strokeWidth: 2,
                strokeLinejoin: 'round',
                fill: 'white',
                stroke: 'white',
              },
            }}
          />

          {/* POINTS */}
          <VictoryScatter
            data={chartData}
            polar
            size={4}
            style={{
              data: {
                stroke: 'white',
                fill: 'white',
                strokeWidth: 1,
              },
              // labels: {
              // 	stroke: SCILENT_COLORS.scilentWhite,
              // },
            }}
            dataComponent={<ChartLabelIcon />}
            // labels={() => ''}
            // labelComponent={<ChartLabelIcon />}
          />
        </VictoryGroup>
      </VictoryChart>
      <div className='w-4/5 flex items-center justify-evenly'>
        {data.map((d) => (
          <div key={d.labelShort} className='flex gap-x-2 items-center my-2'>
            <d.icon />

            <span className='subtitle text-xs text-neutral-500'>
              {d.labelShort}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return <SmallRadarChart />;
};

export default RadarChart;
