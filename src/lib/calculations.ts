import { Expense, ParticipantBalance, Settlement, Participant } from "@/types";

export const calculateBalances = (
  expenses: Expense[],
  participants: Participant[]
): ParticipantBalance[] => {
  const balanceMap = new Map<string, { paid: number; owed: number }>();

  // Initialize all participants
  participants.forEach((p) => {
    balanceMap.set(p.id, { paid: 0, owed: 0 });
  });

  // Calculate totals
  expenses.forEach((expense) => {
    // Add what the payer paid
    const payerBalance = balanceMap.get(expense.paidById);
    if (payerBalance) {
      payerBalance.paid += expense.totalAmount;
    }

    // Add what each participant owes (using their individual share)
    expense.participantShares.forEach((share) => {
      const participantBalance = balanceMap.get(share.participantId);
      if (participantBalance) {
        participantBalance.owed += share.amount;
      }
    });
  });

  // Convert to array
  return participants.map((p) => {
    const balance = balanceMap.get(p.id) || { paid: 0, owed: 0 };
    return {
      participantId: p.id,
      name: p.name,
      totalPaid: balance.paid,
      totalOwed: balance.owed,
      balance: balance.paid - balance.owed, // positive = should receive money
    };
  });
};

export const calculateSettlements = (
  balances: ParticipantBalance[]
): Settlement[] => {
  const settlements: Settlement[] = [];

  // Create arrays of debtors and creditors
  const debtors = balances
    .filter((b) => b.balance < 0)
    .map((b) => ({ id: b.participantId, amount: Math.abs(b.balance) }))
    .sort((a, b) => b.amount - a.amount);

  const creditors = balances
    .filter((b) => b.balance > 0)
    .map((b) => ({ id: b.participantId, amount: b.balance }))
    .sort((a, b) => b.amount - a.amount);

  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const amount = Math.min(debtor.amount, creditor.amount);

    if (amount > 0.01) {
      // Avoid tiny amounts due to floating point
      settlements.push({
        from: debtor.id,
        to: creditor.id,
        amount: Math.round(amount * 100) / 100,
      });
    }

    debtor.amount -= amount;
    creditor.amount -= amount;

    if (debtor.amount < 0.01) i++;
    if (creditor.amount < 0.01) j++;
  }

  return settlements;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    // hour: "2-digit",
    // minute: "2-digit",
    // hour12: false,
  }).format(date);
};
