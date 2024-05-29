import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
import { IconType } from 'react-icons';

import { cn, generateColorScale } from '@/lib/utils';

import { ScilentAudioFeatures } from '@/constant/types';

const formatData = (data: ScilentAudioFeatures[]): RadialChartData[] =>
  data.map((c: ScilentAudioFeatures) => ({
    name: c.labelShort,
    value: Math.round(c.content * 100),
    color: generateColorScale(c.scale.min, c.scale.max, c.content),
    icon: c.icon,
    max: c.scale.max * 100,
  }));

interface MultiRadialChartProps {
  width: number;
  data: ScilentAudioFeatures[];
  fullSize?: boolean;
}

interface RadialChartData {
  name: string;
  value: number;
  color: string;
  icon: IconType;
  max: number;
  radius?: number; // Include this property
}

// INSPO https://yangdanny97.github.io/blog/2023/08/06/circular-bar-chart
const MultiRadialChart = ({
  width,
  data,
  fullSize = false,
}: MultiRadialChartProps) => {
  const chartData: RadialChartData[] = formatData(data);
  const ref = useRef(null);

  useEffect(() => {
    const svg = d3.select(ref.current);
    const chartRadius = width / 2;
    const nBars = chartData.length;
    const barWidth = chartRadius / nBars / (fullSize ? 2 : 1.65);
    const barPadding = fullSize ? barWidth * 2 : barWidth / 2;

    chartData.forEach((d, i) => {
      d.radius = (chartRadius / nBars) * (i * 0.7) + barPadding;
    });

    const angle = d3
      .scaleLinear()
      .domain([0, 100])
      .range([0, 2 * Math.PI]);

    const arc = d3
      .arc<RadialChartData>()
      .innerRadius((d) => (d.radius ? d.radius + 4 : 0))
      .outerRadius((d) => (d.radius ? d.radius + barWidth : 0))
      .cornerRadius(fullSize ? 18 : 6)
      .startAngle(Math.PI)
      .endAngle((d) => angle(d.value) + Math.PI);

    svg
      .selectAll('path')
      .data(chartData)
      .join('path')
      .attr('d', arc)
      .attr('fill', (d) => d.color)
      .attr('transform', `translate(${chartRadius}, ${chartRadius})`);

    // TODO integrate icon
    // Render text labels for each bar
    svg
      .selectAll('text')
      .data(chartData)
      .join('text')
      .append('tspan')
      .attr('class', 'value')
      .text((d) => `${d.value}`)
      .attr('fill', 'white')
      .attr('font-size', 18)
      .each(function (d) {
        const text = d3.select(this);
        // text
        //   .append('svg')
        //   .attr('class', 'icon')
        //   .html(() => `${d.icon as IconType}`)
        //   .attr('fill', 'white');
        text
          .append('tspan')
          .attr('class', 'scale')
          .text(' / 100')
          .attr('fill', 'gray')
          .attr('font-size', 12);
      })
      .attr('x', chartRadius + 10)
      .attr('y', (d) => chartRadius + (d.radius || 0) + barPadding + 8)
      .attr('text-anchor', 'left');
  }, [chartData, width, fullSize]);

  return (
    <div className='flex flex-col items-center justify-around h-full'>
      <svg ref={ref} width={width} height={width} className=''></svg>
      <div className='w-4/5 flex items-center justify-evenly gap-x-2'>
        {chartData.map((d) => (
          <div key={d.name} className='flex gap-x-1 items-center my-2'>
            <div
              className={cn('h-2 w-2 rounded-full')}
              style={{
                backgroundColor: d.color,
              }}
            ></div>
            <span className='subtitle text-xs text-neutral-500 line-clamp-1'>
              {d.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiRadialChart;
