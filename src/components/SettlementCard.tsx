import { Settlement } from '@/types/expense';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, ArrowRight, Wallet, Users, Receipt } from 'lucide-react';

interface SettlementCardProps {
  settlements: Settlement[];
  totalExpense: number;
  perPerson: number;
  participantCount: number;
}

export function SettlementCard({ settlements, totalExpense, perPerson, participantCount }: SettlementCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="gradient-card border-border/50 shadow-md animate-fade-in">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-display">
          <Calculator className="h-5 w-5 text-primary" />
          Kalkulasi Reimburse
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-secondary/50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mb-0.5">Total</p>
            <p className="font-semibold text-sm text-foreground">{formatCurrency(totalExpense)}</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mb-0.5">Peserta</p>
            <p className="font-semibold text-sm text-foreground">{participantCount} orang</p>
          </div>
          <div className="bg-primary/10 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <Wallet className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mb-0.5">Per Orang</p>
            <p className="font-semibold text-sm text-primary">{formatCurrency(perPerson)}</p>
          </div>
        </div>

        {/* Settlements */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">
            Transaksi yang perlu dilakukan:
          </h4>
          
          {settlements.length === 0 ? (
            <div className="py-8 text-center bg-secondary/30 rounded-lg">
              <Calculator className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-muted-foreground text-sm">
                {participantCount < 2 
                  ? "Minimal 2 peserta untuk menghitung"
                  : "Belum ada pengeluaran untuk dihitung"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {settlements.map((s, index) => (
                <div 
                  key={`${s.from.id}-${s.to.id}`}
                  className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div 
                      className="w-3 h-3 rounded-full shrink-0" 
                      style={{ backgroundColor: s.from.color }}
                    />
                    <span className="font-medium truncate">{s.from.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <span className="font-bold text-primary whitespace-nowrap">
                      {formatCurrency(s.amount)}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  
                  <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
                    <span className="font-medium truncate">{s.to.name}</span>
                    <div 
                      className="w-3 h-3 rounded-full shrink-0" 
                      style={{ backgroundColor: s.to.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {settlements.length > 0 && (
          <p className="text-xs text-center text-muted-foreground">
            Total {settlements.length} transaksi untuk menyelesaikan reimburse
          </p>
        )}
      </CardContent>
    </Card>
  );
}
