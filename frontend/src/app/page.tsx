'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Activity, TrendingUp, Database, ArrowLeftRight } from 'lucide-react';
import DataChart from '@/components/dashboard/DataChart';
import SummaryCard from '@/components/dashboard/SummaryCard';
import ComparisonView from '@/components/dashboard/ComparisonView';
import { apiService, SummaryData, ChartData } from '@/lib/api';

export default function Dashboard() {
  const [summaryData, setSummaryData] = useState<SummaryData[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedSymbol, setSelectedSymbol] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isComparisonMode, setIsComparisonMode] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch summary data
      const summary = await apiService.getSummary();
      
      // Deduplicate summary data based on source_type and symbol combination
      const deduplicatedSummary = summary.reduce((acc: SummaryData[], current) => {
        const existingIndex = acc.findIndex(
          item => item.source_type === current.source_type && item.symbol === current.symbol
        );
        
        if (existingIndex === -1) {
          acc.push(current);
        } else {
          // Keep the one with the most recent timestamp
          const existing = acc[existingIndex];
          if (new Date(current.last_updated) > new Date(existing.last_updated)) {
            acc[existingIndex] = current;
          }
        }
        
        return acc;
      }, []);
      
      setSummaryData(deduplicatedSummary);

      // Fetch chart data based on selection (only if not in comparison mode)
      if (!isComparisonMode) {
        const chartParams: any = { hours: 24 };
        if (selectedSource !== 'all') {
          chartParams.source_type = selectedSource;
        }
        if (selectedSymbol !== 'all') {
          chartParams.symbol = selectedSymbol;
        }

        const chart = await apiService.getChartData(chartParams);
        setChartData(chart);
      }
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedSource, selectedSymbol, isComparisonMode]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedSource, selectedSymbol, isComparisonMode]);

  const sourceTypes = ['all', ...new Set(summaryData.map(item => item.source_type))];
  const symbols = selectedSource === 'all' 
    ? ['all', ...new Set(summaryData.map(item => item.symbol))]
    : ['all', ...new Set(summaryData.filter(item => item.source_type === selectedSource).map(item => item.symbol))];

  const getChartColor = (sourceType: string) => {
    const colors: Record<string, string> = {
      crypto: '#f59e0b',
      stock: '#3b82f6',
      weather: '#10b981',
      currency: '#8b5cf6',
    };
    return colors[sourceType] || '#6b7280';
  };

  const filteredSummaryData = summaryData.filter(item => {
    if (selectedSource !== 'all' && item.source_type !== selectedSource) return false;
    if (selectedSymbol !== 'all' && item.symbol !== selectedSymbol) return false;
    return true;
  });

  // If in comparison mode, render the comparison view
  if (isComparisonMode) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <ComparisonView 
            summaryData={summaryData}
            onBackToNormal={() => setIsComparisonMode(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">DataDash Dashboard</h1>
            <p className="text-muted-foreground">
              Real-time data visualization and monitoring
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
            <Button 
              onClick={() => setIsComparisonMode(true)} 
              variant="outline" 
              size="sm"
              disabled={summaryData.length < 2}
            >
              <ArrowLeftRight className="h-4 w-4 mr-2" />
              Compare
            </Button>
            <Button onClick={fetchData} disabled={loading} size="sm">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex space-x-4 mb-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Source Type</label>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background text-sm"
            >
              {sourceTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Sources' : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Symbol</label>
            <select
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background text-sm"
            >
              {symbols.map(symbol => (
                <option key={symbol} value={symbol}>
                  {symbol === 'all' ? 'All Symbols' : symbol}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Data Points</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summaryData.reduce((sum, item) => sum + item.total_data_points, 0)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sources</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(summaryData.map(item => item.source_type)).size}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tracked Symbols</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summaryData.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chart Data Points</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {chartData.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        {chartData.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {selectedSource === 'all' ? 'All Data' : selectedSource.charAt(0).toUpperCase() + selectedSource.slice(1)} 
                {selectedSymbol !== 'all' && ` - ${selectedSymbol}`} Trend (24h)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DataChart 
                data={chartData} 
                color={selectedSource !== 'all' ? getChartColor(selectedSource) : '#3b82f6'}
              />
            </CardContent>
          </Card>
        )}

        {/* Summary Cards */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Current Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSummaryData.map((item, index) => (
              <SummaryCard 
                key={`summary-${item.source_type}-${item.symbol}-${index}`} 
                data={item} 
              />
            ))}
          </div>
        </div>

        {filteredSummaryData.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No data available. Try refreshing or check your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
