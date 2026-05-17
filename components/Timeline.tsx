'use client';

import { ShipmentStatusHistory } from '@/lib/supabase';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CheckCircle2, Clock } from 'lucide-react';

interface TimelineProps {
  history: ShipmentStatusHistory[];
}

export default function Timeline({ history }: TimelineProps) {
  if (!history || history.length === 0) {
    return (
      <div className="card text-center py-8">
        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Aucun historique disponible</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-cargo-orange" />
        Historique de suivi
      </h2>

      <div className="space-y-0">
        {history.map((item, index) => (
          <div
            key={item.id}
            className={`timeline-item ${
              index === history.length - 1 ? 'current' : 'completed'
            } ${index < history.length - 1 ? 'pb-6' : ''}`}
          >
            <div>
              <p className="font-semibold text-cargo-dark">{item.status}</p>
              <p className="text-sm text-gray-600 mt-1">
                {format(new Date(item.created_at), 'dd MMMM yyyy à HH:mm', {
                  locale: fr,
                })}
              </p>
              {item.note && (
                <p className="text-sm text-gray-700 mt-2 bg-gray-50 p-2 rounded border-l-2 border-gray-300">
                  {item.note}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
