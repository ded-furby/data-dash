'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeftRight, TrendingUp, TrendingDown } from 'lucide-react';
import DataChart from './DataChart';
import SummaryCard from './SummaryCard';
import { apiService, SummaryData, ChartData } from '@/lib/api';

interface ComparisonViewProps {
  summaryData: SummaryData[];
  onBackToNormal: () => void;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ summaryData, onBackToNormal }) => {
  const [leftSelection, setLeftSelection] = useState<{ source_type: string; symbol: string }>({
    source_type: '',
    symbol: ''
  });
  const [rightSelection, setRightSelection] = useState<{ source_type: string; symbol: string }>({
    source_type: '',
    symbol: ''
  });
  
  const [leftChartData, setLeftChartData] = useState<ChartData[]>([]);
  const [rightChartData, setRightChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(false);

  // Set default selections if available
  useEffect(() => {
    if (summaryData.length >= 2) {
      setLeftSelection({
        source_type: summaryData[0].source_type,
        symbol: summaryData[0].symbol
      });
      setRightSelection({
        source_type: summaryData[1].source_type,
        symbol: summaryData[1].symbol
      });
    }
  }, [summaryData]);

  // Fetch chart data when selections change
  useEffect(() => {
    const fetchComparisonData = async () => {
      if (!leftSelection.symbol || !rightSelection.symbol) return;
      
      setLoading(true);
      try {
        const [leftData, rightData] = await Promise.all([
          apiService.getChartData({
            source_type: leftSelection.source_type,
            symbol: leftSelection.symbol,
            hours: 24
          }),
          apiService.getChartData({
            source_type: rightSelection.source_type,
            symbol: rightSelection.symbol,
            hours: 24
          })
        ]);
        
        setLeftChartData(leftData);
        setRightChartData(rightData);
      } catch (error) {
        console.error('Error fetching comparison data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComparisonData();
  }, [leftSelection, rightSelection]);

  const getSourceOptions = () => {
    return Array.from(new Set(summaryData.map(item => item.source_type)));
  };

  const getSymbolOptions = (sourceType: string) => {
    return summaryData
      .filter(item => item.source_type === sourceType)
      .map(item => item.symbol);
  };

  const getLeftSummary = () => {
    return summaryData.find(
      item => item.source_type === leftSelection.source_type && item.symbol === leftSelection.symbol
    );
  };

  const getRightSummary = () => {
    return summaryData.find(
      item => item.source_type === rightSelection.source_type && item.symbol === rightSelection.symbol
    );
  };

  const getChartColor = (sourceType: string) => {
    const colors: Record<string, string> = {
      crypto: '#f59e0b',
      stock: '#3b82f6',
      weather: '#10b981',
      currency: '#8b5cf6',
    };
    return colors[sourceType] || '#6b7280';
  };

  const calculateComparison = () => {
    const leftSummary = getLeftSummary();
    const rightSummary = getRightSummary();
    
    if (!leftSummary || !rightSummary) return null;
    
    const leftValue = parseFloat(leftSummary.current_value);
    const rightValue = parseFloat(rightSummary.current_value);
    const difference = leftValue - rightValue;
    const percentDiff = ((difference / rightValue) * 100);
    
    return {
      difference,
      percentDiff,
      leftValue,
      rightValue,
      isHigher: difference > 0
    };
  };

  const comparison = calculateComparison();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button onClick={onBackToNormal} variant="outline" size="sm">
            ← Back to Normal View
          </Button>
          <div className="flex items-center space-x-2">
            <ArrowLeftRight className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold">Comparison Mode</h2>
          </div>
        </div>
      </div>

      {/* Selection Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Left Side Selection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Source Type</label>
              <select
                value={leftSelection.source_type}
                onChange={(e) => setLeftSelection({ source_type: e.target.value, symbol: '' })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
              >
                <option value="">Select Source</option>
                {getSourceOptions().map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            {leftSelection.source_type && (
              <div>
                <label className="text-sm font-medium mb-2 block">Symbol</label>
                <select
                  value={leftSelection.symbol}
                  onChange={(e) => setLeftSelection({ ...leftSelection, symbol: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option value="">Select Symbol</option>
                  {getSymbolOptions(leftSelection.source_type).map(symbol => (
                    <option key={symbol} value={symbol}>{symbol}</option>
                  ))}
                </select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Right Side Selection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Source Type</label>
              <select
                value={rightSelection.source_type}
                onChange={(e) => setRightSelection({ source_type: e.target.value, symbol: '' })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
              >
                <option value="">Select Source</option>
                {getSourceOptions().map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            {rightSelection.source_type && (
              <div>
                <label className="text-sm font-medium mb-2 block">Symbol</label>
                <select
                  value={rightSelection.symbol}
                  onChange={(e) => setRightSelection({ ...rightSelection, symbol: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option value="">Select Symbol</option>
                  {getSymbolOptions(rightSelection.source_type).map(symbol => (
                    <option key={symbol} value={symbol}>{symbol}</option>
                  ))}
                </select>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Comparison Summary */}
      {comparison && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ArrowLeftRight className="h-5 w-5" />
              <span>Comparison Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Left Value</div>
                <div className="text-2xl font-bold">{comparison.leftValue.toFixed(4)}</div>
                <div className="text-sm">{leftSelection.symbol}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Difference</div>
                <div className={`text-2xl font-bold flex items-center justify-center space-x-2 ${
                  comparison.isHigher ? 'text-green-500' : 'text-red-500'
                }`}>
                  {comparison.isHigher ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                  <span>{Math.abs(comparison.percentDiff).toFixed(2)}%</span>
                </div>
                <div className="text-sm">{comparison.isHigher ? 'Higher' : 'Lower'}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Right Value</div>
                <div className="text-2xl font-bold">{comparison.rightValue.toFixed(4)}</div>
                <div className="text-sm">{rightSelection.symbol}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Split-Screen Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Chart */}
        <Card>
          <CardHeader>
            <CardTitle>
              {leftSelection.symbol} ({leftSelection.source_type})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {leftChartData.length > 0 ? (
              <DataChart 
                data={leftChartData}
                title=""
                color={getChartColor(leftSelection.source_type)}
              />
            ) : (
              <div className="h-80 flex items-center justify-center text-muted-foreground">
                {loading ? 'Loading...' : 'Select an item to view chart'}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Chart */}
        <Card>
          <CardHeader>
            <CardTitle>
              {rightSelection.symbol} ({rightSelection.source_type})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {rightChartData.length > 0 ? (
              <DataChart 
                data={rightChartData}
                title=""
                color={getChartColor(rightSelection.source_type)}
              />
            ) : (
              <div className="h-80 flex items-center justify-center text-muted-foreground">
                {loading ? 'Loading...' : 'Select an item to view chart'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Split-Screen Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {getLeftSummary() && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Left Side Details</h3>
            <SummaryCard data={getLeftSummary()!} />
          </div>
        )}
        {getRightSummary() && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Right Side Details</h3>
            <SummaryCard data={getRightSummary()!} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparisonView; 