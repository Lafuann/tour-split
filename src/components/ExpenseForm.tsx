import { useState } from "react";
import { Participant, Expense } from "@/types/expense";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Receipt, MapPin, User, Wallet, Clock, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { toTitleCase } from "@/lib/utils";
import { CalculatorInput } from "./ui/calculator-input";

interface ExpenseFormProps {
  participants: Participant[];
  onAdd: (expense: Omit<Expense, "id">) => void;
}

const defaultDateTime = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 16);
};

export function ExpenseForm({ participants, onAdd }: ExpenseFormProps) {
  const { toast } = useToast();
  const [location, setLocation] = useState("");
  const [paidById, setPaidById] = useState("");
  const [amount, setAmount] = useState("");
  const [datetime, setDatetime] = useState(defaultDateTime);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!location.trim() || !paidById || !amount) {
      toast({
        title: "Data tidak lengkap",
        description: "Mohon isi semua field yang diperlukan",
        variant: "destructive",
      });
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({
        title: "Nominal tidak valid",
        description: "Mohon masukkan nominal yang benar",
        variant: "destructive",
      });
      return;
    }

    onAdd({
      location: location.trim(),
      paidById,
      amount: amountNum,
      datetime: new Date(datetime),
    });

    // Reset form
    setLocation("");
    setAmount("");
    setPaidById("");
    setDatetime(defaultDateTime);

    toast({
      title: "Berhasil!",
      description: "Pengeluaran berhasil ditambahkan",
    });
  };

  const isDisabled = participants.length === 0;

  return (
    <Card className="gradient-card border-border/50 shadow-md animate-fade-in">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-display">
          <Receipt className="h-5 w-5 text-primary" />
          Tambah Pengeluaran
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isDisabled ? (
          <div className="py-8 text-center">
            <Receipt className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground text-sm">
              Tambahkan peserta terlebih dahulu sebelum mencatat pengeluaran.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="location"
                className="flex items-center gap-1.5 text-sm"
              >
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                Tempat / Lokasi
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onBlur={(e) => setLocation(toTitleCase(e.target.value))}
                placeholder="Warung Makan Sederhana, SPBU, dll..."
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="paidBy"
                className="flex items-center gap-1.5 text-sm"
              >
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                Yang Membayar
              </Label>
              <Select value={paidById} onValueChange={setPaidById}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Pilih peserta..." />
                </SelectTrigger>
                <SelectContent>
                  {participants.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: p.color }}
                        />
                        {p.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="amount"
                className="flex items-center gap-1.5 text-sm"
              >
                <Wallet className="h-3.5 w-3.5 text-muted-foreground" />
                Nominal (Rp)
              </Label>
              <CalculatorInput
                value={amount}
                onChange={setAmount}
                placeholder="50.000"
              />
              {/* <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="50000"
                min="0"
                className="bg-background/50"
              /> */}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="datetime"
                className="flex items-center gap-1.5 text-sm"
              >
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                Waktu
              </Label>
              <Input
                id="datetime"
                type="date"
                value={datetime}
                onChange={(e) => setDatetime(e.target.value)}
                className="bg-background/50"
              />
            </div>

            <Button
              type="submit"
              className="w-full gradient-primary shadow-glow"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Pengeluaran
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
