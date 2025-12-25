import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Participant, Expense, Settlement } from "@/types/expense";
import { useToast } from "@/hooks/use-toast";
import { toTitleCase } from "@/lib/utils";

export interface Trip {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

const COLORS = [
  "hsl(25, 95%, 53%)",
  "hsl(160, 60%, 40%)",
  "hsl(220, 70%, 55%)",
  "hsl(340, 75%, 55%)",
  "hsl(45, 95%, 50%)",
  "hsl(280, 65%, 55%)",
  "hsl(180, 60%, 45%)",
  "hsl(10, 80%, 55%)",
];

export function useExpenseStore(tripId: string | null) {
  const { toast } = useToast();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch participants
  const fetchParticipants = useCallback(async () => {
    if (!tripId) return;

    const { data, error } = await supabase
      .from("participants")
      .select("*")
      .eq("trip_id", tripId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching participants:", error);
      return;
    }

    setParticipants(
      data.map((p) => ({
        id: p.id,
        name: p.name,
        color: p.color,
      }))
    );
  }, [tripId]);

  // Fetch expenses
  const fetchExpenses = useCallback(async () => {
    if (!tripId) return;

    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("trip_id", tripId)
      .order("datetime", { ascending: true });

    if (error) {
      console.error("Error fetching expenses:", error);
      return;
    }

    setExpenses(
      data.map((e) => ({
        id: e.id,
        location: e.location,
        paidById: e.paid_by_id,
        amount: Number(e.amount),
        datetime: new Date(e.datetime),
        description: e.description || undefined,
      }))
    );
  }, [tripId]);

  // Load data when tripId changes
  useEffect(() => {
    if (tripId) {
      setLoading(true);
      Promise.all([fetchParticipants(), fetchExpenses()]).finally(() => {
        setLoading(false);
      });
    } else {
      setParticipants([]);
      setExpenses([]);
    }
  }, [tripId, fetchParticipants, fetchExpenses]);

  const addParticipant = useCallback(
    async (name: string) => {
      if (!tripId) return;

      const colorIndex = participants.length % COLORS.length;

      const { data, error } = await supabase
        .from("participants")
        .insert({
          trip_id: tripId,
          name: name.trim(),
          color: COLORS[colorIndex],
        })
        .select()
        .single();

      if (error) {
        toast({
          title: "Gagal menambahkan peserta",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setParticipants((prev) => [
        ...prev,
        {
          id: data.id,
          name: data.name,
          color: data.color,
        },
      ]);
    },
    [tripId, participants.length, toast]
  );

  const removeParticipant = useCallback(
    async (id: string) => {
      const { error } = await supabase
        .from("participants")
        .delete()
        .eq("id", id);

      if (error) {
        toast({
          title: "Gagal menghapus peserta",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setParticipants((prev) => prev.filter((p) => p.id !== id));
      setExpenses((prev) => prev.filter((e) => e.paidById !== id));
    },
    [toast]
  );

  const addExpense = useCallback(
    async (expense: Omit<Expense, "id">) => {
      if (!tripId) return;

      const { data, error } = await supabase
        .from("expenses")
        .insert({
          trip_id: tripId,
          paid_by_id: expense.paidById,
          location: toTitleCase(expense.location),
          amount: expense.amount,
          datetime: expense.datetime.toISOString(),
          description: expense.description,
        })
        .select()
        .single();

      if (error) {
        toast({
          title: "Gagal menambahkan pengeluaran",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      const newExpense: Expense = {
        id: data.id,
        location: data.location,
        paidById: data.paid_by_id,
        amount: Number(data.amount),
        datetime: new Date(data.datetime),
        description: data.description || undefined,
      };

      setExpenses((prev) =>
        [...prev, newExpense].sort(
          (a, b) =>
            new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
        )
      );
    },
    [tripId, toast]
  );

  const removeExpense = useCallback(
    async (id: string) => {
      const { error } = await supabase.from("expenses").delete().eq("id", id);

      if (error) {
        toast({
          title: "Gagal menghapus pengeluaran",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setExpenses((prev) => prev.filter((e) => e.id !== id));
    },
    [toast]
  );

  const calculateSettlements = useCallback((): Settlement[] => {
    if (participants.length < 2 || expenses.length === 0) return [];

    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
    const perPerson = totalExpense / participants.length;

    const balances: Map<string, number> = new Map();

    participants.forEach((p) => {
      const paid = expenses
        .filter((e) => e.paidById === p.id)
        .reduce((sum, e) => sum + e.amount, 0);
      balances.set(p.id, paid - perPerson);
    });

    const creditors: { participant: Participant; amount: number }[] = [];
    const debtors: { participant: Participant; amount: number }[] = [];

    participants.forEach((p) => {
      const balance = balances.get(p.id) || 0;
      if (balance > 0.01) {
        creditors.push({ participant: p, amount: balance });
      } else if (balance < -0.01) {
        debtors.push({ participant: p, amount: Math.abs(balance) });
      }
    });

    creditors.sort((a, b) => b.amount - a.amount);
    debtors.sort((a, b) => b.amount - a.amount);

    const settlements: Settlement[] = [];

    let i = 0,
      j = 0;
    while (i < creditors.length && j < debtors.length) {
      const creditor = creditors[i];
      const debtor = debtors[j];
      const amount = Math.min(creditor.amount, debtor.amount);

      if (amount > 0.01) {
        settlements.push({
          from: debtor.participant,
          to: creditor.participant,
          amount: Math.round(amount),
        });
      }

      creditor.amount -= amount;
      debtor.amount -= amount;

      if (creditor.amount < 0.01) i++;
      if (debtor.amount < 0.01) j++;
    }

    return settlements;
  }, [participants, expenses]);

  const getTotalExpense = useCallback(() => {
    return expenses.reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  const getPerPersonAmount = useCallback(() => {
    if (participants.length === 0) return 0;
    return Math.round(getTotalExpense() / participants.length);
  }, [participants.length, getTotalExpense]);

  return {
    participants,
    expenses,
    loading,
    addParticipant,
    removeParticipant,
    addExpense,
    removeExpense,
    calculateSettlements,
    getTotalExpense,
    getPerPersonAmount,
  };
}

// Hook for managing trips
export function useTripStore() {
  const { toast } = useToast();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrips = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching trips:", error);
      setLoading(false);
      return;
    }

    setTrips(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const createTrip = useCallback(
    async (name: string, description?: string) => {
      const { data, error } = await supabase
        .from("trips")
        .insert({ name, description })
        .select()
        .single();

      if (error) {
        toast({
          title: "Gagal membuat trip",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }

      setTrips((prev) => [data, ...prev]);
      toast({
        title: "Trip dibuat!",
        description: `"${name}" berhasil dibuat`,
      });
      return data;
    },
    [toast]
  );

  const deleteTrip = useCallback(
    async (id: string) => {
      const { error } = await supabase.from("trips").delete().eq("id", id);

      if (error) {
        toast({
          title: "Gagal menghapus trip",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setTrips((prev) => prev.filter((t) => t.id !== id));
      toast({
        title: "Trip dihapus",
      });
    },
    [toast]
  );

  return {
    trips,
    loading,
    createTrip,
    deleteTrip,
    refetch: fetchTrips,
  };
}
