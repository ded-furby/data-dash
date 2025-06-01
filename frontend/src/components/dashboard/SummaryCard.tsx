'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { SummaryData } from '@/lib/api';
import { format } from 'date-fns';

interface SummaryCardProps {
  data: SummaryData;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ data }) => {
  const change24h = data.change_24h ? parseFloat(data.change_24h) : null;
  const changePercent = data.change_24h_percent ? parseFloat(data.change_24h_percent) : null;
  
  const getChangeIcon = () => {
    if (changePercent === null) return <Minus className="h-4 w-4" />;
    if (changePercent > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (changePercent < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4" />;
  };

  const getChangeColor = () => {
    if (changePercent === null) return 'text-muted-foreground';
    if (changePercent > 0) return 'text-green-500';
    if (changePercent < 0) return 'text-red-500';
    return 'text-muted-foreground';
  };

  const formatValue = (value: string) => {
    const num = parseFloat(value);
    if (data.source_type === 'crypto' || data.source_type === 'currency') {
      return `$${num.toFixed(4)}`;
    }
    if (data.source_type === 'stock') {
      return `$${num.toFixed(2)}`;
    }
    if (data.source_type === 'weather') {
      return `${num.toFixed(1)}°C`;
    }
    return num.toFixed(2);
  };

  const getSourceTypeLabel = (sourceType: string) => {
    const labels: Record<string, string> = {
      crypto: 'Cryptocurrency',
      stock: 'Stock',
      weather: 'Weather',
      currency: 'Currency',
    };
    return labels[sourceType] || sourceType;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {data.symbol}
        </CardTitle>
        <div className="text-xs text-muted-foreground">
          {getSourceTypeLabel(data.source_type)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {formatValue(data.current_value)}
        </div>
        <div className={`flex items-center text-xs ${getChangeColor()}`}>
          {getChangeIcon()}
          <span className="ml-1">
            {changePercent !== null ? `${changePercent.toFixed(2)}%` : 'N/A'}
          </span>
          {change24h !== null && (
            <span className="ml-2">
              ({change24h > 0 ? '+' : ''}{change24h.toFixed(4)})
            </span>
          )}
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          Updated: {format(new Date(data.last_updated), 'MMM dd, HH:mm')}
        </div>
        <div className="text-xs text-muted-foreground">
          {data.total_data_points} data points
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryCard; 