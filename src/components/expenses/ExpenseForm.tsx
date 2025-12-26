import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock, Plus, Loader2, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Participant, Expense, ParticipantShare } from "@/types";
import { cn, strictTitleCase } from "@/lib/utils";
import { toast } from "sonner";
import { CalculatorInput } from "../ui/calculator-input";

interface ExpenseFormProps {
  tripId: string;
  participants: Participant[];
  onSubmit: (expense: Omit<Expense, "id" | "createdAt">) => Promise<void>;
}

export const ExpenseForm = ({
  tripId,
  participants,
  onSubmit,
}: ExpenseFormProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [paidById, setPaidById] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState(format(new Date(), "HH:mm"));
  const [isEqualSplit, setIsEqualSplit] = useState(true);
  const [shares, setShares] = useState<Record<string, string>>({});

  // Initialize shares when participants change or form opens
  useEffect(() => {
    const initialShares: Record<string, string> = {};
    participants.forEach((p) => {
      initialShares[p.id] = "";
    });
    setShares(initialShares);
  }, [participants]);

  // Update shares when total amount or split mode changes
  useEffect(() => {
    if (isEqualSplit && totalAmount) {
      const equalShare = parseFloat(totalAmount) / participants.length;
      const newShares: Record<string, string> = {};
      participants.forEach((p) => {
        newShares[p.id] = equalShare.toFixed(0);
      });
      setShares(newShares);
    }
  }, [totalAmount, isEqualSplit, participants]);

  const handleShareChange = (participantId: string, value: string) => {
    setShares((prev) => ({
      ...prev,
      [participantId]: value,
    }));
  };

  const calculateSharesTotal = () => {
    return Object.values(shares).reduce(
      (sum, val) => sum + (parseFloat(val) || 0),
      0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) {
      toast.error("Nama tempat tidak boleh kosong");
      return;
    }
    if (!totalAmount || parseFloat(totalAmount) <= 0) {
      toast.error("Total biaya harus lebih dari 0");
      return;
    }
    if (!paidById) {
      toast.error("Pilih siapa yang membayar");
      return;
    }

    const sharesTotal = calculateSharesTotal();
    const total = parseFloat(totalAmount);

    if (Math.abs(sharesTotal - total) > 1) {
      toast.error(
        `Total bagian (${sharesTotal.toLocaleString()}) tidak sama dengan total biaya (${total.toLocaleString()})`
      );
      return;
    }

    const participantShares: ParticipantShare[] = participants.map((p) => ({
      participantId: p.id,
      amount: parseFloat(shares[p.id]) || 0,
    }));

    // const [hours, minutes] = time.split(":").map(Number);
    const dateTime = new Date(date);
    // dateTime.setHours(hours, minutes, 0, 0);
    try {
      setIsSubmitting(true);
      await onSubmit({
        tripId,
        location: location.trim(),
        description: description.trim() || undefined,
        totalAmount: total,
        paidById,
        participantShares,
        dateTime,
      });
    } catch (error) {
      toast.error("Terjadi kesalahan. Coba lagi.");
    } finally {
      // Reset form
      setLocation("");
      setDescription("");
      setTotalAmount("");
      setPaidById("");
      setDate(new Date());
      setTime(format(new Date(), "HH:mm"));
      setIsEqualSplit(true);
      const resetShares: Record<string, string> = {};
      participants.forEach((p) => {
        resetShares[p.id] = "";
      });
      setShares(resetShares);
      setOpen(false);
      setIsSubmitting(false);
    }
  };

  const sharesTotal = calculateSharesTotal();
  const total = parseFloat(totalAmount) || 0;
  const difference = total - sharesTotal;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Tambah Pengeluaran
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Pengeluaran</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="location">Nama Tempat</Label>
            <Input
              id="location"
              placeholder="Contoh: Warung Makan Pak Djo"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onBlur={(e) => setLocation(strictTitleCase(e.target.value))}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Keterangan (opsional)</Label>
            <Input
              id="description"
              placeholder="Contoh: Makan siang"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {/* <div className="grid grid-cols-2 gap-4"> */}
          <div className="space-y-2">
            <Label>Tanggal</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  disabled={isSubmitting}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, "dd/MM/yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* <div className="space-y-2">
              <Label htmlFor="time">Waktu</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="pl-10"
                  disabled={isSubmitting}
                />
              </div>
            </div> */}
          {/* </div> */}

          <div className="space-y-2">
            <Label htmlFor="totalAmount">Total Biaya (Rp)</Label>
            <CalculatorInput
              value={totalAmount}
              onChange={setTotalAmount}
              placeholder="Masukkan angka"
            />
            {/* <Input
              id="totalAmount"
              type="number"
              placeholder="0"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              disabled={isSubmitting}
            /> */}
          </div>

          <div className="space-y-2">
            <Label>Dibayar oleh</Label>
            <Select
              value={paidById}
              onValueChange={setPaidById}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih pembayar" />
              </SelectTrigger>
              <SelectContent>
                {participants.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label>Pembagian Biaya</Label>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {isEqualSplit ? "Sama rata" : "Berbeda"}
                </span>
                <Switch
                  checked={!isEqualSplit}
                  onCheckedChange={(checked) => setIsEqualSplit(!checked)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="rounded-lg border p-3 space-y-3">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center gap-3">
                  <span className="flex-1 text-sm font-medium">
                    {participant.name}
                  </span>
                  <div className="relative w-32">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      Rp
                    </span>
                    <Input
                      type="number"
                      value={shares[participant.id] || ""}
                      onChange={(e) =>
                        handleShareChange(participant.id, e.target.value)
                      }
                      disabled={isEqualSplit || isSubmitting}
                      className="pl-10 text-right"
                      placeholder="0"
                    />
                  </div>
                </div>
              ))}

              {totalAmount && (
                <div className="flex items-center justify-between pt-2 border-t text-sm">
                  <span className="font-medium">Total Bagian</span>
                  <span
                    className={cn(
                      "font-bold",
                      Math.abs(difference) > 1
                        ? "text-destructive"
                        : "text-success"
                    )}
                  >
                    Rp {sharesTotal.toLocaleString()}
                    {Math.abs(difference) > 1 && (
                      <span className="ml-2 text-xs font-normal">
                        ({difference > 0 ? "kurang" : "lebih"} Rp{" "}
                        {Math.abs(difference).toLocaleString()})
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan Pengeluaran"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
