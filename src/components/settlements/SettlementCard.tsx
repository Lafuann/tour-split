import { ArrowRight, CheckCircle2, Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settlement, ParticipantBalance, Participant } from "@/types";
import { formatCurrency } from "@/lib/calculations";
import { cn } from "@/lib/utils";

interface SettlementCardProps {
  settlements: Settlement[];
  balances: ParticipantBalance[];
  participants: Participant[];
}

export const SettlementCard = ({
  settlements,
  balances,
  participants,
}: SettlementCardProps) => {
  const getParticipantName = (id: string) => {
    return participants.find((p) => p.id === id)?.name || "Unknown";
  };

  const totalExpense = balances.reduce((sum, b) => sum + b.totalOwed, 0);

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Calculator className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Total Pengeluaran
                </p>
                <p className="text-lg font-bold">
                  {formatCurrency(totalExpense)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-warning/10 p-2">
                <svg
                  className="h-5 w-5 text-warning"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Per Orang (Rata-rata)
                </p>
                <p className="text-lg font-bold">
                  {formatCurrency(totalExpense / participants.length || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-success/10 p-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Transaksi Reimburse
                </p>
                <p className="text-lg font-bold">
                  {settlements.length} transfer
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Balance Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rincian Saldo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {balances.map((balance) => (
              <div
                key={balance.participantId}
                className={cn(
                  "flex items-center justify-between rounded-lg border p-3",
                  balance.balance > 0 && "border-success/30 bg-success/5",
                  balance.balance < 0 &&
                    "border-destructive/30 bg-destructive/5"
                )}
              >
                <div>
                  <p className="font-medium">{balance.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Bayar: {formatCurrency(balance.totalPaid)} | Bagian:{" "}
                    {formatCurrency(balance.totalOwed)}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={cn(
                      "font-bold",
                      balance.balance > 0 && "text-success",
                      balance.balance < 0 && "text-destructive",
                      balance.balance === 0 && "text-muted-foreground"
                    )}
                  >
                    {balance.balance > 0 && "+"}
                    {formatCurrency(balance.balance)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {balance.balance > 0
                      ? "Harus diterima"
                      : balance.balance < 0
                      ? "Harus bayar"
                      : "Lunas"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Settlements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Transaksi Reimburse</CardTitle>
        </CardHeader>
        <CardContent>
          {settlements.length === 0 ? (
            <div className="text-center py-6">
              <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-2" />
              <p className="text-muted-foreground">
                Semua saldo sudah seimbang! 🎉
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {settlements.map((settlement, index) => (
                <div
                  key={index}
                  className="flex sm:flex-row sm:gap-0 gap-4 flex-col items-center justify-between rounded-lg bg-muted/50 p-4 animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="grid grid-cols-3 items-center w-full">
                    {/* LEFT */}
                    <div className="flex justify-end sm:justify-start">
                      <div className="rounded-full bg-destructive/10 px-3 py-1.5">
                        <span className="text-sm font-semibold text-destructive">
                          {getParticipantName(settlement.from)}
                        </span>
                      </div>
                    </div>

                    {/* CENTER */}
                    <div className="flex justify-center sm:justify-start">
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>

                    {/* RIGHT */}
                    <div className="flex justify-start">
                      <div className="rounded-full bg-success/10 px-3 py-1.5">
                        <span className="text-sm font-semibold text-success">
                          {getParticipantName(settlement.to)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">
                      {formatCurrency(settlement.amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
