import { supabase } from "@/integrations/supabase/client";
import { Participant, Trip, Expense, ParticipantShare } from "@/types";
import { toTitleCase } from "./utils";

// Participants
export const getParticipants = async (): Promise<Participant[]> => {
  const { data, error } = await supabase
    .from("participants")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching participants:", error);
    return [];
  }

  return data.map((p) => ({
    id: p.id,
    name: p.name,
    createdAt: new Date(p.created_at),
  }));
};

export const addParticipant = async (
  name: string
): Promise<Participant | null> => {
  const { data, error } = await supabase
    .from("participants")
    .insert({ name: toTitleCase(name) })
    .select()
    .single();

  if (error) {
    console.error("Error adding participant:", error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    createdAt: new Date(data.created_at),
  };
};

export const deleteParticipant = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from("participants").delete().eq("id", id);

  if (error) {
    console.error("Error deleting participant:", error);
    return false;
  }

  return true;
};

// Trips
export const getTrips = async (): Promise<Trip[]> => {
  const { data: tripsData, error: tripsError } = await supabase
    .from("trips")
    .select("*")
    .order("created_at", { ascending: false });

  if (tripsError) {
    console.error("Error fetching trips:", tripsError);
    return [];
  }

  const { data: tripParticipants, error: tpError } = await supabase
    .from("trip_participants")
    .select("trip_id, participant_id");

  if (tpError) {
    console.error("Error fetching trip participants:", tpError);
  }

  const participantMap = new Map<string, string[]>();
  tripParticipants?.forEach((tp) => {
    const existing = participantMap.get(tp.trip_id) || [];
    existing.push(tp.participant_id);
    participantMap.set(tp.trip_id, existing);
  });

  return tripsData.map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description || undefined,
    startDate: new Date(t.start_date),
    endDate: t.end_date ? new Date(t.end_date) : undefined,
    participants: participantMap.get(t.id) || [],
    createdAt: new Date(t.created_at),
  }));
};

export const addTrip = async (
  trip: Omit<Trip, "id" | "createdAt">
): Promise<Trip | null> => {
  const { data: tripData, error: tripError } = await supabase
    .from("trips")
    .insert({
      name: trip.name,
      description: trip.description,
      start_date: trip.startDate.toISOString().split("T")[0],
      end_date: trip.endDate ? trip.endDate.toISOString().split("T")[0] : null,
    })
    .select()
    .single();

  if (tripError) {
    console.error("Error adding trip:", tripError);
    return null;
  }

  // Add trip participants
  if (trip.participants.length > 0) {
    const { error: tpError } = await supabase.from("trip_participants").insert(
      trip.participants.map((participantId) => ({
        trip_id: tripData.id,
        participant_id: participantId,
      }))
    );

    if (tpError) {
      console.error("Error adding trip participants:", tpError);
    }
  }

  return {
    id: tripData.id,
    name: tripData.name,
    description: tripData.description || undefined,
    startDate: new Date(tripData.start_date),
    endDate: tripData.end_date ? new Date(tripData.end_date) : undefined,
    participants: trip.participants,
    createdAt: new Date(tripData.created_at),
  };
};

export const updateTrip = async (
  id: string,
  updates: Partial<Trip>
): Promise<boolean> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData: any = {};
  if (updates.name) updateData.name = updates.name;
  if (updates.description !== undefined)
    updateData.description = updates.description;
  if (updates.startDate)
    updateData.start_date = updates.startDate.toISOString().split("T")[0];
  if (updates.endDate !== undefined)
    updateData.end_date = updates.endDate
      ? updates.endDate.toISOString().split("T")[0]
      : null;

  const { error } = await supabase
    .from("trips")
    .update(updateData)
    .eq("id", id);

  if (error) {
    console.error("Error updating trip:", error);
    return false;
  }

  return true;
};

export const deleteTrip = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from("trips").delete().eq("id", id);

  if (error) {
    console.error("Error deleting trip:", error);
    return false;
  }

  return true;
};

// Expenses
export const getExpenses = async (): Promise<Expense[]> => {
  const { data: expensesData, error: expensesError } = await supabase
    .from("expenses")
    .select("*")
    .order("date_time", { ascending: true });

  if (expensesError) {
    console.error("Error fetching expenses:", expensesError);
    return [];
  }

  const { data: sharesData, error: sharesError } = await supabase
    .from("expense_shares")
    .select("*");

  if (sharesError) {
    console.error("Error fetching expense shares:", sharesError);
  }

  const sharesMap = new Map<string, ParticipantShare[]>();
  sharesData?.forEach((s) => {
    const existing = sharesMap.get(s.expense_id) || [];
    existing.push({
      participantId: s.participant_id,
      amount: Number(s.amount),
    });
    sharesMap.set(s.expense_id, existing);
  });

  return expensesData.map((e) => ({
    id: e.id,
    tripId: e.trip_id,
    location: e.location,
    description: e.description || undefined,
    totalAmount: Number(e.total_amount),
    paidById: e.paid_by_id,
    participantShares: sharesMap.get(e.id) || [],
    dateTime: new Date(e.date_time),
    createdAt: new Date(e.created_at),
  }));
};

export const getExpensesByTrip = async (tripId: string): Promise<Expense[]> => {
  const { data: expensesData, error: expensesError } = await supabase
    .from("expenses")
    .select("*")
    .eq("trip_id", tripId)
    .order("date_time", { ascending: true });

  if (expensesError) {
    console.error("Error fetching expenses:", expensesError);
    return [];
  }

  if (expensesData.length === 0) return [];

  const expenseIds = expensesData.map((e) => e.id);
  const { data: sharesData, error: sharesError } = await supabase
    .from("expense_shares")
    .select("*")
    .in("expense_id", expenseIds);

  if (sharesError) {
    console.error("Error fetching expense shares:", sharesError);
  }

  const sharesMap = new Map<string, ParticipantShare[]>();
  sharesData?.forEach((s) => {
    const existing = sharesMap.get(s.expense_id) || [];
    existing.push({
      participantId: s.participant_id,
      amount: Number(s.amount),
    });
    sharesMap.set(s.expense_id, existing);
  });

  return expensesData.map((e) => ({
    id: e.id,
    tripId: e.trip_id,
    location: e.location,
    description: e.description || undefined,
    totalAmount: Number(e.total_amount),
    paidById: e.paid_by_id,
    participantShares: sharesMap.get(e.id) || [],
    dateTime: new Date(e.date_time),
    createdAt: new Date(e.created_at),
  }));
};

export const addExpense = async (
  expense: Omit<Expense, "id" | "createdAt">
): Promise<Expense | null> => {
  const { data: expenseData, error: expenseError } = await supabase
    .from("expenses")
    .insert({
      trip_id: expense.tripId,
      location: expense.location,
      description: expense.description,
      total_amount: expense.totalAmount,
      paid_by_id: expense.paidById,
      date_time: expense.dateTime.toISOString(),
    })
    .select()
    .single();

  if (expenseError) {
    console.error("Error adding expense:", expenseError);
    return null;
  }

  // Add expense shares
  if (expense.participantShares.length > 0) {
    const { error: sharesError } = await supabase.from("expense_shares").insert(
      expense.participantShares.map((share) => ({
        expense_id: expenseData.id,
        participant_id: share.participantId,
        amount: share.amount,
      }))
    );

    if (sharesError) {
      console.error("Error adding expense shares:", sharesError);
    }
  }

  return {
    id: expenseData.id,
    tripId: expenseData.trip_id,
    location: expenseData.location,
    description: expenseData.description || undefined,
    totalAmount: Number(expenseData.total_amount),
    paidById: expenseData.paid_by_id,
    participantShares: expense.participantShares,
    dateTime: new Date(expenseData.date_time),
    createdAt: new Date(expenseData.created_at),
  };
};

export const updateExpense = async (
  id: string,
  updates: Partial<Expense>
): Promise<boolean> => {
  // 1. Update expense utama
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData: any = {};
  if (updates.location) updateData.location = updates.location;
  if (updates.description !== undefined)
    updateData.description = updates.description;
  if (updates.totalAmount) updateData.total_amount = updates.totalAmount;
  if (updates.paidById) updateData.paid_by_id = updates.paidById;
  if (updates.dateTime) updateData.date_time = updates.dateTime.toISOString();

  const { error: expenseError } = await supabase
    .from("expenses")
    .update(updateData)
    .eq("id", id);

  if (expenseError) {
    console.error("Error updating expense:", expenseError);
    return false;
  }

  // 2. Update expense_shares (jika ada)
  if (updates.participantShares) {
    // hapus shares lama
    const { error: deleteError } = await supabase
      .from("expense_shares")
      .delete()
      .eq("expense_id", id);

    if (deleteError) {
      console.error("Error deleting expense shares:", deleteError);
      return false;
    }

    // insert shares baru
    const { error: insertError } = await supabase.from("expense_shares").insert(
      updates.participantShares.map((share) => ({
        expense_id: id,
        participant_id: share.participantId,
        amount: share.amount,
      }))
    );

    if (insertError) {
      console.error("Error inserting expense shares:", insertError);
      return false;
    }
  }

  return true;
};

export const deleteExpense = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from("expenses").delete().eq("id", id);

  if (error) {
    console.error("Error deleting expense:", error);
    return false;
  }

  return true;
};
