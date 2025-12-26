import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Users, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout } from "@/components/layout/Layout";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { ExpenseTable } from "@/components/expenses/ExpenseTable";
import { SettlementCard } from "@/components/settlements/SettlementCard";
import { Trip, Participant, Expense } from "@/types";
import {
  getTrips,
  getParticipants,
  getExpensesByTrip,
  addExpense,
  deleteExpense,
  updateExpense,
} from "@/lib/storage";
import { calculateBalances, calculateSettlements } from "@/lib/calculations";
import { toast } from "sonner";

const TripDetail = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [allParticipants, setAllParticipants] = useState<Participant[]>([]);
  const [tripParticipants, setTripParticipants] = useState<Participant[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  useEffect(() => {
    if (tripId) {
      loadData();
    }
  }, [tripId]);

  const loadData = async () => {
    if (!tripId) return;

    setLoading(true);
    const [trips, participants, expensesData] = await Promise.all([
      getTrips(),
      getParticipants(),
      getExpensesByTrip(tripId),
    ]);

    const foundTrip = trips.find((t) => t.id === tripId);
    setTrip(foundTrip || null);
    setAllParticipants(participants);

    if (foundTrip) {
      setTripParticipants(
        participants.filter((p) => foundTrip.participants.includes(p.id))
      );
    }

    setExpenses(expensesData);
    setLoading(false);
  };

  const handleAddExpense = async (data: {
    id?: string;
    expense: Omit<Expense, "id" | "createdAt">;
  }) => {
    const newExpense = await addExpense(data.expense);
    if (newExpense) {
      setExpenses((prev) =>
        [...prev, newExpense].sort(
          (a, b) => a.dateTime.getTime() - b.dateTime.getTime()
        )
      );
      toast.success("Pengeluaran berhasil ditambahkan");
    } else {
      toast.error("Gagal menambahkan pengeluaran");
    }
  };

  const handleDeleteExpense = async (id: string) => {
    const success = await deleteExpense(id);
    if (success) {
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      toast.success("Pengeluaran berhasil dihapus");
    } else {
      toast.error("Gagal menghapus pengeluaran");
    }
  };

  const handleUpdateExpense = async ({
    id,
    expense,
  }: {
    id?: string;
    expense: Omit<Expense, "id" | "createdAt">;
  }) => {
    if (!id) {
      console.error("Expense ID is missing");
      return;
    }

    const success = await updateExpense(id, expense);

    if (!success) {
      toast.error("Gagal mengupdate pengeluaran");
      return;
    }

    toast.success("Pengeluaran berhasil diperbarui");

    // reload data / refetch
    loadData();
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

  if (!trip) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-muted-foreground">Trip tidak ditemukan</p>
          <Link to="/trips">
            <Button variant="outline" className="mt-4">
              Kembali ke Daftar Trip
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const balances = calculateBalances(expenses, tripParticipants);
  const settlements = calculateSettlements(balances);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Link
            to="/trips"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Daftar Trip
          </Link>
          <div className="flex flex-col gap-4 bg-background/80 rounded-lg p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {trip.name}
                </h1>
                {trip.description && (
                  <p className="text-muted-foreground mt-1">
                    {trip.description}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(trip.startDate, "dd MMM yyyy", { locale: id })}
                      {trip.endDate &&
                        ` - ${format(trip.endDate, "dd MMM yyyy", {
                          locale: id,
                        })}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{tripParticipants.length} peserta</span>
                  </div>
                </div>
              </div>

              <ExpenseForm
                tripId={trip.id}
                participants={tripParticipants}
                onSubmit={handleAddExpense}
              />

              {editingExpense && (
                <ExpenseForm
                  mode="edit"
                  tripId={tripId}
                  participants={allParticipants}
                  initialData={editingExpense}
                  open={!!editingExpense}
                  onOpenChange={(o) => !o && setEditingExpense(null)}
                  onSubmit={handleUpdateExpense}
                />
              )}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="expenses" className="space-y-6">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="expenses">Pengeluaran</TabsTrigger>
                <TabsTrigger value="settlements">Reimburse</TabsTrigger>
              </TabsList>
              <div className="overflow-y-auto max-h-[calc(100dvh-400px)]">
                <TabsContent
                  value="expenses"
                  className="space-y-4 animate-fade-in"
                >
                  <ExpenseTable
                    expenses={expenses}
                    participants={tripParticipants}
                    onDelete={handleDeleteExpense}
                    onEdit={setEditingExpense}
                  />
                </TabsContent>

                <TabsContent value="settlements" className="animate-fade-in">
                  <SettlementCard
                    settlements={settlements}
                    balances={balances}
                    participants={tripParticipants}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TripDetail;
