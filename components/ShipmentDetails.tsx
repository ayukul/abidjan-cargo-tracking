'use client';

import { Shipment } from '@/lib/supabase';
import { MapPin, User, Phone, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ShipmentDetailsProps {
  shipment: Shipment;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Livré':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'En transit':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'Retardé':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'Prêt pour livraison':
      return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'En dédouanement':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

export default function ShipmentDetails({ shipment }: ShipmentDetailsProps) {
  return (
    <div className="space-y-6 animate-slide-in-up">
      {/* Status Banner */}
      <div className={`p-4 rounded-lg border-2 ${getStatusColor(shipment.current_status)}`}>
        <p className="text-sm font-medium opacity-75">Statut actuel</p>
        <p className="text-2xl font-bold">{shipment.current_status}</p>
      </div>

      {/* Tracking Code */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-cargo-orange" />
          Numéro de suivi
        </h2>
        <p className="text-2xl font-mono font-bold text-cargo-blue">{shipment.tracking_code}</p>
      </div>

      {/* Customer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
            <User className="w-4 h-4" />
            Client
          </h3>
          <p className="text-lg font-medium">{shipment.customer_name}</p>
          {shipment.customer_phone && (
            <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              {shipment.customer_phone}
            </p>
          )}
        </div>

        {shipment.estimated_arrival_date && (
          <div className="card">
            <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date estimée d'arrivée
            </h3>
            <p className="text-lg font-medium">
              {format(new Date(shipment.estimated_arrival_date), 'dd MMMM yyyy', {
                locale: fr,
              })}
            </p>
          </div>
        )}
      </div>

      {/* Origin & Destination */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-600 mb-4 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Itinéraire
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">Départ</p>
            <p className="text-lg font-medium mt-1">{shipment.origin}</p>
          </div>
          <div className="flex justify-center">
            <div className="text-cargo-orange">→</div>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">Destination</p>
            <p className="text-lg font-medium mt-1">{shipment.destination}</p>
          </div>
        </div>
      </div>

      {/* Notes */}
      {shipment.notes && (
        <div className="card bg-blue-50 border-blue-200">
          <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Notes
          </h3>
          <p className="text-sm text-blue-800">{shipment.notes}</p>
        </div>
      )}

      {/* Dates */}
      <div className="text-xs text-gray-500 text-center">
        <p>Créé: {format(new Date(shipment.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })}</p>
        <p>Mise à jour: {format(new Date(shipment.updated_at), 'dd/MM/yyyy HH:mm', { locale: fr })}</p>
      </div>
    </div>
  );
}

// Import at top with other imports
import { Package } from 'lucide-react';
