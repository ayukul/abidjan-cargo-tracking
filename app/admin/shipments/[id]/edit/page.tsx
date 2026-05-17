'use client';

import { useState, useEffect } from 'react';
import { supabase, SHIPMENT_STATUSES, Shipment } from '@/lib/supabase';
import {
  getShipmentWithHistory,
  updateShipment,
  addStatusHistory,
  getShipmentHistory,
} from '@/lib/shipments';
import { sendWhatsAppNotification } from '@/lib/notifications';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, Loader, CheckCircle } from 'lucide-react';
import Timeline from '@/components/Timeline';
import { ShipmentStatusHistory } from '@/lib/supabase';

export default function EditShipmentPage() {
  const router = useRouter();
  const params = useParams();
  const shipmentId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [history, setHistory] = useState<ShipmentStatusHistory[]>([]);
  const [statusNote, setStatusNote] = useState('');
  const [sendNotification, setSendNotification] = useState(true);
  const [formData, setFormData] = useState({
    tracking_code: '',
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    origin: '',
    destination: '',
    current_status: '',
    estimated_arrival_date: '',
    notes: '',
  });

  useEffect(() => {
    loadShipment();
  }, [shipmentId]);

  const loadShipment = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        router.push('/admin/login');
        return;
      }

      const result = await getShipmentWithHistory(shipmentId);
      if (!result) {
        setError('Colis non trouvé');
        return;
      }

      setShipment(result.shipment);
      setHistory(result.history);
      setFormData({
        tracking_code: result.shipment.tracking_code,
        customer_name: result.shipment.customer_name,
        customer_phone: result.shipment.customer_phone,
        customer_email: result.shipment.customer_email || '',
        origin: result.shipment.origin,
        destination: result.shipment.destination,
        current_status: result.shipment.current_status,
        estimated_arrival_date: result.shipment.estimated_arrival_date || '',
        notes: result.shipment.notes || '',
      });
    } catch (err) {
      console.error('Error loading shipment:', err);
      setError('Erreur lors du chargement du colis');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        router.push('/admin/login');
        return;
      }

      const newStatus = formData.current_status;
      if (!newStatus || newStatus === shipment?.current_status) {
        setIsSaving(false);
        return;
      }

      // Update shipment status
      const updated = await updateShipment(shipmentId, {
        current_status: newStatus,
      });

      // Add to history
      await addStatusHistory(shipmentId, newStatus, statusNote || undefined);

      // Send WhatsApp notification
      if (sendNotification && shipment?.customer_phone) {
        await sendWhatsAppNotification({
          phoneNumber: shipment.customer_phone,
          customerName: shipment.customer_name,
          trackingCode: shipment.tracking_code,
          status: newStatus,
        });
      }

      setShipment(updated);
      setStatusNote('');
      setSuccess('Statut mis à jour avec succès!');

      // Reload history
      const updatedHistory = await getShipmentHistory(shipmentId);
      setHistory(updatedHistory);
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Erreur lors de la mise à jour du statut');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShipmentUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        router.push('/admin/login');
        return;
      }

      const updates = {
        customer_name: formData.customer_name.trim(),
        customer_phone: formData.customer_phone.trim(),
        customer_email: formData.customer_email.trim() || undefined,
        origin: formData.origin.trim(),
        destination: formData.destination.trim(),
        estimated_arrival_date: formData.estimated_arrival_date || undefined,
        notes: formData.notes.trim() || undefined,
      };

      const updated = await updateShipment(shipmentId, updates);
      setShipment(updated);
      setSuccess('Colis mis à jour avec succès!');
    } catch (err) {
      console.error('Error updating shipment:', err);
      setError('Erreur lors de la mise à jour du colis');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-[calc(100vh-80px)] bg-cargo-light flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-cargo-blue mx-auto mb-2" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </main>
    );
  }

  if (!shipment) {
    return (
      <main className="min-h-[calc(100vh-80px)] bg-cargo-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="card text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-lg text-gray-700 mb-4">{error}</p>
            <Link href="/admin" className="btn-primary inline-block">
              Retour au tableau de bord
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-80px)] bg-cargo-light">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <Link href="/admin" className="text-cargo-blue hover:text-cargo-dark font-medium">
            ← Retour au tableau de bord
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipment Details */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">
                Détails du colis - {shipment.tracking_code}
              </h2>

              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {success && (
                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              )}

              <form onSubmit={handleShipmentUpdate} className="space-y-4">
                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="customer_name" className="label-base">
                      Nom du client
                    </label>
                    <input
                      id="customer_name"
                      name="customer_name"
                      type="text"
                      value={formData.customer_name}
                      onChange={handleInputChange}
                      className="input-base"
                      disabled={isSaving}
                    />
                  </div>

                  <div>
                    <label htmlFor="customer_phone" className="label-base">
                      Téléphone
                    </label>
                    <input
                      id="customer_phone"
                      name="customer_phone"
                      type="tel"
                      value={formData.customer_phone}
                      onChange={handleInputChange}
                      className="input-base"
                      disabled={isSaving}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="customer_email" className="label-base">
                    Email
                  </label>
                  <input
                    id="customer_email"
                    name="customer_email"
                    type="email"
                    value={formData.customer_email}
                    onChange={handleInputChange}
                    className="input-base"
                    disabled={isSaving}
                  />
                </div>

                {/* Route */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="origin" className="label-base">
                      Origine
                    </label>
                    <input
                      id="origin"
                      name="origin"
                      type="text"
                      value={formData.origin}
                      onChange={handleInputChange}
                      className="input-base"
                      disabled={isSaving}
                    />
                  </div>

                  <div>
                    <label htmlFor="destination" className="label-base">
                      Destination
                    </label>
                    <input
                      id="destination"
                      name="destination"
                      type="text"
                      value={formData.destination}
                      onChange={handleInputChange}
                      className="input-base"
                      disabled={isSaving}
                    />
                  </div>
                </div>

                {/* Dates */}
                <div>
                  <label htmlFor="estimated_arrival_date" className="label-base">
                    Date estimée d'arrivée
                  </label>
                  <input
                    id="estimated_arrival_date"
                    name="estimated_arrival_date"
                    type="date"
                    value={formData.estimated_arrival_date}
                    onChange={handleInputChange}
                    className="input-base"
                    disabled={isSaving}
                  />
                </div>

                {/* Notes */}
                <div>
                  <label htmlFor="notes" className="label-base">
                    Notes générales
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="input-base resize-none"
                    rows={3}
                    disabled={isSaving}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving && <Loader className="w-4 h-4 animate-spin" />}
                  {isSaving ? 'Enregistrement...' : 'Mettre à jour le colis'}
                </button>
              </form>
            </div>

            {/* Status Update */}
            <div className="card">
              <h3 className="text-xl font-bold mb-4">Changer le statut</h3>

              <form onSubmit={handleStatusChange} className="space-y-4">
                <div>
                  <label htmlFor="current_status" className="label-base">
                    Nouveau statut
                  </label>
                  <select
                    id="current_status"
                    name="current_status"
                    value={formData.current_status}
                    onChange={handleInputChange}
                    className="input-base"
                    disabled={isSaving}
                  >
                    {SHIPMENT_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="statusNote" className="label-base">
                    Note (optionnel)
                  </label>
                  <textarea
                    id="statusNote"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="Ajouter une note à cet événement..."
                    className="input-base resize-none"
                    rows={2}
                    disabled={isSaving}
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendNotification}
                    onChange={(e) => setSendNotification(e.target.checked)}
                    disabled={isSaving}
                  />
                  <span className="text-sm font-medium">
                    Envoyer une notification WhatsApp au client
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-accent flex items-center gap-2 disabled:opacity-50 w-full"
                >
                  {isSaving && <Loader className="w-4 h-4 animate-spin" />}
                  {isSaving ? 'Mise à jour...' : 'Mettre à jour le statut'}
                </button>
              </form>
            </div>
          </div>

          {/* Timeline Sidebar */}
          <div className="lg:col-span-1">
            <Timeline history={history} />
          </div>
        </div>
      </div>
    </main>
  );
}
