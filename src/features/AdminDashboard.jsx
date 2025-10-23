import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ShieldCheck, LogOut, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { RESERVATION_STATUSES } from '@/lib/reservations';

const STATUS_LABELS = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  cancelled: 'Annulée',
};

const STATUS_COLORS = {
  pending: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30',
  confirmed: 'bg-green-500/10 text-green-400 border border-green-500/30',
  cancelled: 'bg-red-500/10 text-red-400 border border-red-500/30',
};

const formatDate = (value) => {
  if (!value) return '—';

  try {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'full',
      timeStyle: 'short',
    }).format(date);
  } catch (error) {
    return value;
  }
};

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [reservations, setReservations] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [actionInProgress, setActionInProgress] = useState(null);

  const fetchReservations = useCallback(async (statusFilter) => {
    setLoading(true);

    const params = new URLSearchParams();
    if (statusFilter && statusFilter !== 'all') {
      params.set('status', statusFilter);
    }

    try {
      const response = await fetch(`/api/admin/reservations${params.toString() ? `?${params.toString()}` : ''}`);

      if (response.status === 401) {
        setIsAuthenticated(false);
        setReservations([]);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: 'Erreur inconnue.' }));
        throw new Error(body.error || 'Impossible de charger les réservations.');
      }

      const body = await response.json();
      setReservations(Array.isArray(body?.data) ? body.data : []);
      setIsAuthenticated(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inattendue.';
      toast({
        title: 'Erreur',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations(selectedStatus);
  }, [fetchReservations, selectedStatus]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: 'Mot de passe incorrect.' }));
        throw new Error(body.error || 'Mot de passe incorrect.');
      }

      toast({
        title: 'Connexion réussie',
        description: 'Bienvenue dans votre espace administrateur.',
      });
      setPassword('');
      await fetchReservations(selectedStatus);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Mot de passe incorrect.';
      setLoginError(message);
      toast({
        title: 'Connexion refusée',
        description: message,
        variant: 'destructive',
      });
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      setIsAuthenticated(false);
      setReservations([]);
      toast({ title: 'Déconnexion réussie', description: 'À bientôt !' });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: "Impossible de vous déconnecter pour le moment.",
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (reservationId, nextStatus) => {
    setActionInProgress(reservationId);

    try {
      const response = await fetch(`/api/admin/reservations/${reservationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: "Impossible de mettre à jour la réservation." }));
        throw new Error(body.error || "Impossible de mettre à jour la réservation.");
      }

      const body = await response.json();
      const updatedReservation = body?.data;

      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.id === reservationId
            ? { ...reservation, ...(updatedReservation ?? { status: nextStatus }) }
            : reservation,
        ),
      );

      toast({
        title: 'Statut mis à jour',
        description: 'La réservation a été mise à jour avec succès.',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur lors de la mise à jour.';
      toast({
        title: 'Erreur',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setActionInProgress(null);
    }
  };

  const filteredReservations = useMemo(() => {
    if (selectedStatus === 'all') {
      return reservations;
    }

    return reservations.filter((reservation) => reservation.status === selectedStatus);
  }, [reservations, selectedStatus]);

  if (!isAuthenticated) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-md">
          <div className="glass-effect rounded-xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="w-8 h-8 text-orange-400" />
              <h1 className="text-2xl font-semibold text-white">Accès administrateur</h1>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="admin-password" className="text-white">
                  Mot de passe
                </Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="bg-slate-800/50 border-slate-700 text-white"
                  disabled={loading}
                  required
                />
              </div>
              {loginError && <p className="text-sm text-red-400">{loginError}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-6 mb-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-10 h-10 text-orange-400" />
            <div>
              <h1 className="text-3xl font-semibold text-white">Gestion des réservations</h1>
              <p className="text-slate-300">Consultez les demandes et confirmez les réservations.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <select
              className="bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white"
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              disabled={loading}
            >
              <option value="all">Tous les statuts</option>
              {RESERVATION_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status]}
                </option>
              ))}
            </select>
            <Button variant="outline" onClick={handleLogout} disabled={loading}>
              <LogOut className="w-4 h-4 mr-2" /> Se déconnecter
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800">
            <thead>
              <tr className="text-left text-slate-300 text-sm uppercase tracking-wide">
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Forfait</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Personnes</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredReservations.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                    {loading
                      ? 'Chargement des réservations...'
                      : 'Aucune réservation pour le moment.'}
                  </td>
                </tr>
              )}

              {filteredReservations.map((reservation) => (
                <tr key={reservation.id} className="text-sm text-slate-200">
                  <td className="px-4 py-4 font-medium">
                    {reservation.firstName} {reservation.lastName}
                  </td>
                  <td className="px-4 py-4 space-y-1">
                    <div>{reservation.email}</div>
                    {reservation.phone && <div className="text-slate-400">{reservation.phone}</div>}
                  </td>
                  <td className="px-4 py-4">
                    {reservation.packageId ? `Forfait ${reservation.packageId}` : '—'}
                  </td>
                  <td className="px-4 py-4">{formatDate(reservation.date)}</td>
                  <td className="px-4 py-4">{reservation.people ?? '—'}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[reservation.status]}`}>
                      {reservation.status === 'confirmed' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : reservation.status === 'cancelled' ? (
                        <XCircle className="w-3 h-3" />
                      ) : null}
                      {STATUS_LABELS[reservation.status]}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                        onClick={() => handleStatusChange(reservation.id, 'confirmed')}
                        disabled={actionInProgress === reservation.id || reservation.status === 'confirmed'}
                      >
                        Confirmer
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                        onClick={() => handleStatusChange(reservation.id, 'cancelled')}
                        disabled={actionInProgress === reservation.id || reservation.status === 'cancelled'}
                      >
                        Refuser
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
