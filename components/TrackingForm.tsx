'use client';

import { useState } from 'react';
import { Search, AlertCircle } from 'lucide-react';

interface TrackingFormProps {
  onSearch: (trackingCode: string) => void;
  isLoading?: boolean;
  error?: string;
}

export default function TrackingForm({ onSearch, isLoading, error }: TrackingFormProps) {
  const [trackingCode, setTrackingCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingCode.trim()) {
      onSearch(trackingCode.trim().toUpperCase());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="space-y-4">
        <div>
          <label htmlFor="tracking" className="label-base">
            Entrez votre numéro de suivi
          </label>
          <div className="flex gap-2">
            <input
              id="tracking"
              type="text"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              placeholder="ex: ACT-2024-001"
              className="input-base flex-1"
              disabled={isLoading}
              autoFocus
            />
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              Rechercher
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-900">Numéro de suivi introuvable</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
