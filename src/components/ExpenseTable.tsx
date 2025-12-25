import { Participant, Expense } from '@/types/expense';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { List, Trash2, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface ExpenseTableProps {
  expenses: Expense[];
  participants: Participant[];
  onRemove: (id: string) => void;
}

export function ExpenseTable({ expenses, participants, onRemove }: ExpenseTableProps) {
  const getParticipant = (id: string) => participants.find(p => p.id === id);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDateTime = (date: Date) => {
    return format(new Date(date), 'dd/MM/yyyy', { locale: id });
  };

  return (
    <Card className="gradient-card border-border/50 shadow-md animate-fade-in">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-display">
          <List className="h-5 w-5 text-primary" />
          Daftar Pengeluaran
        </CardTitle>
      </CardHeader>
      <CardContent>
        {expenses.length === 0 ? (
          <div className="py-12 text-center">
            <List className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground text-sm">
              Belum ada pengeluaran yang tercatat.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      Waktu
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      Lokasi
                    </div>
                  </TableHead>
                  <TableHead>Dibayar Oleh</TableHead>
                  <TableHead className="text-right">Nominal</TableHead>
                  <TableHead className="pr-6 w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense, index) => {
                  const payer = getParticipant(expense.paidById);
                  return (
                    <TableRow 
                      key={expense.id}
                      className="animate-slide-up"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <TableCell className="pl-6 font-mono text-sm text-muted-foreground">
                        {formatDateTime(expense.datetime)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {expense.location}
                      </TableCell>
                      <TableCell>
                        {payer && (
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-2.5 h-2.5 rounded-full shrink-0" 
                              style={{ backgroundColor: payer.color }}
                            />
                            <span>{payer.name}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-primary">
                        {formatCurrency(expense.amount)}
                      </TableCell>
                      <TableCell className="pr-6">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onRemove(expense.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
