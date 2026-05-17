'use client';

import { useState } from 'react';
import { supabase, SHIPMENT_STATUSES } from '@/lib/supabase';
import { createShipment } from '@/lib/shipments';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, Loader } from 'lucide-react';

export default function NewShipmentPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState({
    tracking_code: '',
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    origin: '',
    destination: '',
    current_status: 'Reçu en Chine',
    estimated_arrival_date: '',
    notes: '',
  });
  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Check auth
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        router.push('/admin/login');
        return;
      }

      // Validate required fields
      if (
        !formData.tracking_code ||
        !formData.customer_name ||
        !formData.customer_phone ||
        !formData.origin ||
        !formData.destination
      ) {
        setError('Veuillez remplir tous les champs obligatoires');
        setIsLoading(false);
        return;
      }

      const shipmentData = {
        tracking_code: formData.tracking_code.toUpperCase().trim(),
        customer_name: formData.customer_name.trim(),
        customer_phone: formData.customer_phone.trim(),
        customer_email: formData.customer_email.trim() || undefined,
        origin: formData.origin.trim(),
        destination: formData.destination.trim(),
        current_status: formData.current_status,
        estimated_arrival_date: formData.estimated_arrival_date || undefined,
        notes: formData.notes.trim() || undefined,
        created_by: session.session.user.id,
      };

      const newShipment = await createShipment(shipmentData as any);
      router.push('/admin');
    } catch (err) {
      console.error('Error creating shipment:', err);
      if ((err as any)?.code === '23505') {
        setError('Ce code de suivi existe déjà');
      } else {
        setError('Erreur lors de la création du colis. Veuillez réessayer.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-cargo-light">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card">
          <h1 className="text-3xl font-bold text-cargo-dark mb-2">Créer un nouveau colis</h1>
          <p className="text-gray-600 mb-8">
            Remplissez le formulaire ci-dessous pour ajouter un nouveau colis au système
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Tracking Code */}
            <div>
              <label htmlFor="tracking_code" className="label-base">
                Code de suivi <span className="text-red-500">*</span>
              </label>
              <input
                id="tracking_code"
                name="tracking_code"
                type="text"
                value={formData.tracking_code}
                onChange={handleInputChange}
                placeholder="ACT-2024-001"
                className="input-base"
                required
                disabled={isLoading}
              />
            </div>

            {/* Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="customer_name" className="label-base">
                  Nom du client <span className="text-red-500">*</span>
                </label>
                <input
                  id="customer_name"
                  name="customer_name"
                  type="text"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  placeholder="Jean Kouamé"
                  className="input-base"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="customer_phone" className="label-base">
                  Téléphone <span className="text-red-500">*</span>
                </label>
                <input
                  id="customer_phone"
                  name="customer_phone"
                  type="tel"
                  value={formData.customer_phone}
                  onChange={handleInputChange}
                  placeholder="+225 07 12 34 56"
                  className="input-base"
                  required
                  disabled={isLoading}
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
                placeholder="client@example.com"
                className="input-base"
                disabled={isLoading}
              />
            </div>

            {/* Shipment Route */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="origin" className="label-base">
                  Origine <span className="text-red-500">*</span>
                </label>
                <input
                  id="origin"
                  name="origin"
                  type="text"
                  value={formData.origin}
                  onChange={handleInputChange}
                  placeholder="Shanghai, China"
                  className="input-base"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="destination" className="label-base">
                  Destination <span className="text-red-500">*</span>
                </label>
                <input
                  id="destination"
                  name="destination"
                  type="text"
                  value={formData.destination}
                  onChange={handleInputChange}
                  placeholder="Abidjan, Côte d'Ivoire"
                  className="input-base"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Status & Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="current_status" className="label-base">
                  Statut <span className="text-red-500">*</span>
                </label>
                <select
                  id="current_status"
                  name="current_status"
                  value={formData.current_status}
                  onChange={handleInputChange}
                  className="input-base"
                  disabled={isLoading}
                >
                  {SHIPMENT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

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
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="label-base">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Ajouter des notes ou des remarques..."
                className="input-base resize-none"
                rows={4}
                disabled={isLoading}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                {isLoading && <Loader className="w-4 h-4 animate-spin" />}
                {isLoading ? 'Création...' : 'Créer le colis'}
              </button>
              <Link href="/admin" className="btn-secondary">
                Annuler
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
