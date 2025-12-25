import { useState } from 'react';
import { ParticipantManager } from '@/components/ParticipantManager';
import { ExpenseForm } from '@/components/ExpenseForm';
import { ExpenseTable } from '@/components/ExpenseTable';
import { SettlementCard } from '@/components/SettlementCard';
import { TripSelector } from '@/components/TripSelector';
import { useExpenseStore, useTripStore } from '@/hooks/useExpenseStore';
import { Bike, Mountain, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const { trips, loading: tripsLoading, createTrip, deleteTrip } = useTripStore();
  
  const {
    participants,
    expenses,
    loading: dataLoading,
    addParticipant,
    removeParticipant,
    addExpense,
    removeExpense,
    calculateSettlements,
    getTotalExpense,
    getPerPersonAmount,
  } = useExpenseStore(selectedTripId);

  const settlements = calculateSettlements();
  const selectedTrip = trips.find(t => t.id === selectedTripId);

  const handleDeleteTrip = (id: string) => {
    deleteTrip(id);
    if (selectedTripId === id) {
      setSelectedTripId(null);
    }
  };

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl gradient-primary shadow-glow">
              <Bike className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-foreground">
                TourSplit
              </h1>
              <p className="text-xs text-muted-foreground">
                Hitung reimburse touring dengan mudah
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6 space-y-6">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl gradient-primary p-6 text-primary-foreground shadow-lg">
          <div className="relative z-10">
            <h2 className="text-2xl font-display font-bold mb-2">
              Selamat Touring! 🏍️
            </h2>
            <p className="text-primary-foreground/80 text-sm max-w-md">
              Catat semua pengeluaran selama touring dan biarkan sistem menghitung siapa yang harus bayar ke siapa.
            </p>
          </div>
          <Mountain className="absolute right-4 bottom-0 h-24 w-24 text-primary-foreground/10" />
        </div>

        {/* Trip Selection or Trip Detail */}
        {!selectedTripId ? (
          <TripSelector
            trips={trips}
            loading={tripsLoading}
            selectedTripId={selectedTripId}
            onSelectTrip={setSelectedTripId}
            onCreateTrip={createTrip}
            onDeleteTrip={handleDeleteTrip}
          />
        ) : (
          <>
            {/* Back Button & Trip Name */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedTripId(null)}
                className="shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h3 className="font-display font-semibold text-lg">{selectedTrip?.name}</h3>
                {selectedTrip?.description && (
                  <p className="text-sm text-muted-foreground">{selectedTrip.description}</p>
                )}
              </div>
            </div>

            {dataLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column - Forms */}
                <div className="space-y-6">
                  <ParticipantManager
                    participants={participants}
                    onAdd={addParticipant}
                    onRemove={removeParticipant}
                  />
                  <ExpenseForm
                    participants={participants}
                    onAdd={addExpense}
                  />
                </div>

                {/* Middle & Right - Table and Settlement */}
                <div className="lg:col-span-2 space-y-6">
                  <ExpenseTable
                    expenses={expenses}
                    participants={participants}
                    onRemove={removeExpense}
                  />
                  <SettlementCard
                    settlements={settlements}
                    totalExpense={getTotalExpense()}
                    perPerson={getPerPersonAmount()}
                    participantCount={participants.length}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-12">
        <div className="container py-4">
          <p className="text-center text-xs text-muted-foreground">
            TourSplit — Bagi pengeluaran touring dengan adil ✨
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
