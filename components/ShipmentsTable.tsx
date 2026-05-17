'use client';

import { Shipment } from '@/lib/supabase';
import Link from 'next/link';
import { Edit2, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ShipmentsTableProps {
  shipments: Shipment[];
  onDelete?: (id: string) => void;
}

const getStatusBgColor = (status: string) => {
  switch (status) {
    case 'Livré':
      return 'bg-green-100 text-green-800';
    case 'En transit':
      return 'bg-blue-100 text-blue-800';
    case 'Retardé':
      return 'bg-red-100 text-red-800';
    case 'Prêt pour livraison':
      return 'bg-orange-100 text-orange-800';
    case 'En dédouanement':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function ShipmentsTable({ shipments, onDelete }: ShipmentsTableProps) {
  if (shipments.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500">Aucun colis trouvé</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-6 py-3 font-semibold text-gray-700">Code de suivi</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-700">Client</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-700">Téléphone</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-700">Statut</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-700">Créé</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map((shipment) => (
              <tr
                key={shipment.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 font-mono font-semibold text-cargo-blue">
                  {shipment.tracking_code}
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium">{shipment.customer_name}</p>
                    {shipment.customer_email && (
                      <p className="text-sm text-gray-600">{shipment.customer_email}</p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">{shipment.customer_phone}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusBgColor(shipment.current_status)}`}>
                    {shipment.current_status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {format(new Date(shipment.created_at), 'dd/MM/yyyy', { locale: fr })}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/shipments/${shipment.id}/edit`}
                      className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit2 className="w-4 h-4 text-cargo-blue" />
                    </Link>
                    <button
                      onClick={() => onDelete && onDelete(shipment.id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
