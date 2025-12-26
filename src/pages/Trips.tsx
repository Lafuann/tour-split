import { useState, useEffect } from "react";
import { Map, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { TripForm } from "@/components/trips/TripForm";
import { TripCard } from "@/components/trips/TripCard";
import { Trip, Participant, Expense } from "@/types";
import {
  getTrips,
  addTrip,
  deleteTrip,
  getParticipants,
  getExpenses,
} from "@/lib/storage";
import { toast } from "sonner";

const Trips = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [tripsData, participantsData, expensesData] = await Promise.all([
      getTrips(),
      getParticipants(),
      getExpenses(),
    ]);
    setTrips(tripsData);
    setParticipants(participantsData);
    setExpenses(expensesData);
    setLoading(false);
  };

  const handleAddTrip = async (trip: Omit<Trip, "id" | "createdAt">) => {
    const newTrip = await addTrip(trip);
    if (newTrip) {
      setTrips((prev) => [newTrip, ...prev]);
      toast.success("Trip berhasil dibuat");
    } else {
      toast.error("Gagal membuat trip");
    }
  };

  const handleDeleteTrip = async (id: string) => {
    const success = await deleteTrip(id);
    if (success) {
      setTrips((prev) => prev.filter((t) => t.id !== id));
      setExpenses((prev) => prev.filter((e) => e.tripId !== id));
      toast.success("Trip berhasil dihapus");
    } else {
      toast.error("Gagal menghapus trip");
    }
  };

  const getTripExpenses = (tripId: string) => {
    return expenses.filter((e) => e.tripId === tripId);
  };

  const getTripTotal = (tripId: string) => {
    return getTripExpenses(tripId).reduce((sum, e) => sum + e.totalAmount, 0);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Trip</h1>
            <p className="text-muted-foreground">
              Kelola trip touring dan pengeluarannya
            </p>
          </div>
          <TripForm participants={participants} onSubmit={handleAddTrip} />
        </div>

        {trips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-muted p-6">
              <Map className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">
              Belum ada trip
            </h3>
            <p className="mb-6 text-muted-foreground max-w-sm">
              Buat trip baru untuk mulai mencatat pengeluaran touring Anda
            </p>
            <TripForm participants={participants} onSubmit={handleAddTrip} />
          </div>
        ) : (
          <div className="space-y-4">
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                participants={participants}
                expenseCount={getTripExpenses(trip.id).length}
                totalAmount={getTripTotal(trip.id)}
                onDelete={handleDeleteTrip}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Trips;
