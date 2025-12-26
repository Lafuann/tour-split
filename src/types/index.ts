export interface Participant {
  id: string;
  name: string;
  createdAt: Date;
}

export interface Trip {
  id: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  participants: string[]; // participant IDs
  createdAt: Date;
}

export interface ParticipantShare {
  participantId: string;
  amount: number;
}

export interface Expense {
  id: string;
  tripId: string;
  location: string;
  description?: string;
  totalAmount: number;
  paidById: string; // participant who paid
  participantShares: ParticipantShare[]; // individual amounts each person owes
  dateTime: Date;
  createdAt: Date;
}

export interface Settlement {
  from: string; // participant ID
  to: string; // participant ID
  amount: number;
}

export interface ParticipantBalance {
  participantId: string;
  name: string;
  totalPaid: number;
  totalOwed: number;
  balance: number; // positive = should receive, negative = should pay
}
