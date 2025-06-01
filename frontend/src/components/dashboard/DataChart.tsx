'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { format } from 'date-fns';
import { ChartData } from '@/lib/api';

interface DataChartProps {
  data: ChartData[];
  title?: string;
  color?: string;
}

const DataChart: React.FC<DataChartProps> = ({ 
  data, 
  title = 'Data Trend', 
  color = '#3b82f6' 
}) => {
  const formatXAxis = (tickItem: any) => {
    try {
      return format(new Date(tickItem), 'HH:mm');
    } catch {
      return tickItem;
    }
  };

  const formatTooltip = (value: any, name: string, props: any) => {
    if (name === 'value') {
      const numValue = parseFloat(value);
      return [numValue.toFixed(6), 'Value'];
    }
    return [value, name];
  };

  const formatTooltipLabel = (label: any) => {
    try {
      return format(new Date(label), 'MMM dd, HH:mm:ss');
    } catch {
      return label;
    }
  };

  // Process and sort the data for better visualization
  const chartData = data
    .map(item => ({
      ...item,
      value: parseFloat(item.value),
      timestamp: new Date(item.timestamp).getTime(),
      rawTimestamp: item.timestamp,
    }))
    .sort((a, b) => a.timestamp - b.timestamp); // Sort by timestamp for proper line progression

  // Calculate min/max for better Y-axis scaling
  const values = chartData.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  
  // Enhanced padding calculation for better visualization
  let padding = (maxValue - minValue) * 0.1; // 10% padding
  
  // If values are very close (small variation), use a minimum padding
  if (padding < (maxValue * 0.001)) {
    padding = maxValue * 0.005; // 0.5% of the value as minimum padding
  }
  
  const yAxisDomain = [
    Math.max(0, minValue - padding),
    maxValue + padding
  ];

  if (chartData.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center">
        <p className="text-muted-foreground">No data available for chart</p>
      </div>
    );
  }

  // Determine if we should show dots for better visibility
  const shouldShowDots = chartData.length <= 10; // Show dots if few data points
  const isFlat = (maxValue - minValue) < (maxValue * 0.0001); // Very flat line detection

  return (
    <div className="w-full h-80">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="timestamp"
            type="number"
            scale="time"
            domain={['dataMin', 'dataMax']}
            tickFormatter={formatXAxis}
            className="text-xs"
            tickCount={6}
          />
          <YAxis 
            className="text-xs"
            domain={yAxisDomain}
            tickFormatter={(value) => {
              if (value >= 1000) {
                return `${(value / 1000).toFixed(1)}k`;
              }
              return parseFloat(value).toFixed(value > 1 ? 2 : 6);
            }}
          />
          <Tooltip 
            formatter={formatTooltip}
            labelFormatter={formatTooltipLabel}
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px',
              fontSize: '12px',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={shouldShowDots || isFlat} // Show dots for few points or flat lines
            dotSize={4}
            activeDot={{ 
              r: 6, 
              fill: color,
              strokeWidth: 2,
              stroke: '#fff'
            }}
            name="Value"
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="text-xs text-muted-foreground mt-2 text-center">
        Showing {chartData.length} data points over time
        {isFlat && <span className="text-yellow-600"> • Stable values (minimal variation)</span>}
      </div>
    </div>
  );
};

export default DataChart; 