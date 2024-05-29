'use client';

import { ReactNode } from 'react';
import {
  VictoryArea,
  VictoryChart,
  VictoryGroup,
  VictoryPolarAxis,
  VictoryScatter,
} from 'victory';

import { ScilentAudioFeatures } from '@/constant/types';
import { IconType } from 'react-icons';

interface RadarChartProps {
  width: number;
  data: ScilentAudioFeatures[];
  fullSize?: boolean;
}

interface RadarChartData {
  x: number;
  y: number;
  iconLabel?: IconType;
}

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
      iconLabel: feature.icon,
    };
  });
};

const ChartLabelIcon = (props: {
  x?: number;
  y?: number;
  datum?: any;
  scale?: any;
  polar?: boolean;
}): ReactNode | undefined => {
  const { x, y, datum } = props;

  const IconComponent = datum.iconLabel;

  return (
    <foreignObject x={x ? x - 5 : -5} y={y ? y - 5 : -5} width={10} height={10}>
      <IconComponent size={10} />
    </foreignObject>
  );
};

const RadarChart = ({
  data,
  width = 200,
  fullSize = false,
}: RadarChartProps) => {
  const chartData: RadarChartData[] = processData(data);
  const maxima = getMaxima(data);
  // const maximum = Math.max(...(Object.values(maxima) as number[]));

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
                strokeWidth: 1,
                strokeLinejoin: 'round',
                fill: '#f9d3b4',
                stroke: 'white',
              },
            }}
          />

          {/* POINTS */}
          <VictoryScatter
            data={chartData}
            polar
            size={2}
            style={{
              data: {
                stroke: 'white',
                fill: '#756456',
                strokeWidth: 0.5,
              },
            }}
            labelComponent={<ChartLabelIcon />}
            labels={({ datum }) => (datum.label ? '' : null)} // Ensure labels are processed only if there is an icon
          />
        </VictoryGroup>
      </VictoryChart>
      <div className='w-full flex self-center items-center justify-evenly gap-x-2'>
        {data.map((d) => (
          <div key={d.labelShort} className='flex gap-x-1 items-center my-2'>
            <d.icon />

            <span className='subtitle text-xs text-neutral-500 line-clamp-1'>
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
