export interface Participant {
  id: string;
  name: string;
  color: string;
}

export interface Expense {
  id: string;
  location: string;
  paidById: string;
  amount: number;
  datetime: Date;
  description?: string;
}

export interface Settlement {
  from: Participant;
  to: Participant;
  amount: number;
}
