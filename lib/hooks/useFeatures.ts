import { useState } from 'react';

// Diff generation hook
export function useDiffGenerator() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateDiff = async (before: string, after: string, fileName: string, language?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/diff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ before, after, fileName, language })
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate diff');
      }

      return result.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generateBatchDiffs = async (files: Array<{
    before: string;
    after: string;
    fileName: string;
    language?: string;
  }>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/diff', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files })
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate batch diffs');
      }

      return result.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { generateDiff, generateBatchDiffs, loading, error };
}

// Pipeline generation hook
export function usePipelineGenerator() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePipeline = async (config: {
    provider: string;
    target: string;
    projectName: string;
    environment?: string;
    options?: any;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate pipeline');
      }

      return result.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTemplate = async (provider: string, target: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/pipeline?provider=${provider}&target=${target}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to get template');
      }

      return result.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const validateConfig = async (config: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/pipeline', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to validate config');
      }

      return result.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { generatePipeline, getTemplate, validateConfig, loading, error };
}

// Cost calculation hook
export function useCostCalculator() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateCost = async (schema: any, provider?: string, region?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/cost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schema, provider, region })
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to calculate cost');
      }

      return result.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const compareProviders = async (schema: any, providers?: string[], region?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/cost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schema, compareProviders: providers, region })
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to compare providers');
      }

      return result.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const compareCosts = async (beforeSchema: any, afterSchema: any, provider?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/cost', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ beforeSchema, afterSchema, provider })
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to compare costs');
      }

      return result.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { calculateCost, compareProviders, compareCosts, loading, error };
}

// Combined hook for all features
export function useSnapinfraFeatures() {
  const diff = useDiffGenerator();
  const pipeline = usePipelineGenerator();
  const cost = useCostCalculator();

  return {
    diff,
    pipeline,
    cost,
    loading: diff.loading || pipeline.loading || cost.loading
  };
}

// Convenience exports with shorter names
export const useDiff = useDiffGenerator;
export const usePipeline = usePipelineGenerator;
export const useCost = useCostCalculator;
