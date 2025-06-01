import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface DataPoint {
  id: number;
  timestamp: string;
  value: string;
  source_type: 'crypto' | 'stock' | 'weather' | 'currency';
  symbol: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface ChartData {
  timestamp: string;
  value: string;
  label: string;
}

export interface SummaryData {
  source_type: string;
  symbol: string;
  current_value: string;
  change_24h: string | null;
  change_24h_percent: string | null;
  last_updated: string;
  total_data_points: number;
}

export interface Alert {
  id: number;
  source_type: string;
  symbol: string;
  condition: 'above' | 'below' | 'change_up' | 'change_down';
  threshold_value: string;
  is_active: boolean;
  email: string;
  last_triggered: string | null;
  created_at: string;
}

export const apiService = {
  // Data Points
  getDataPoints: async (params?: {
    source_type?: string;
    symbol?: string;
    hours?: number;
  }): Promise<{ results: DataPoint[] }> => {
    const response = await api.get('/api/datapoints/', { params });
    return response.data;
  },

  getChartData: async (params?: {
    source_type?: string;
    symbol?: string;
    hours?: number;
  }): Promise<ChartData[]> => {
    const response = await api.get('/api/datapoints/chart_data/', { params });
    return response.data;
  },

  getSummary: async (): Promise<SummaryData[]> => {
    const response = await api.get('/api/datapoints/summary/');
    return response.data;
  },

  // Alerts
  getAlerts: async (params?: {
    source_type?: string;
    symbol?: string;
    is_active?: boolean;
  }): Promise<{ results: Alert[] }> => {
    const response = await api.get('/api/alerts/', { params });
    return response.data;
  },

  createAlert: async (alert: Omit<Alert, 'id' | 'last_triggered' | 'created_at'>): Promise<Alert> => {
    const response = await api.post('/api/alerts/', alert);
    return response.data;
  },

  updateAlert: async (id: number, alert: Partial<Alert>): Promise<Alert> => {
    const response = await api.patch(`/api/alerts/${id}/`, alert);
    return response.data;
  },

  deleteAlert: async (id: number): Promise<void> => {
    await api.delete(`/api/alerts/${id}/`);
  },
};

export default apiService; 