import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Participant, Trip } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface TripFormProps {
  participants: Participant[];
  onSubmit: (trip: Omit<Trip, "id" | "createdAt">) => Promise<void>;
}

export const TripForm = ({ participants, onSubmit }: TripFormProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Nama trip tidak boleh kosong");
      return;
    }
    if (!startDate) {
      toast.error("Tanggal mulai harus diisi");
      return;
    }
    if (selectedParticipants.length < 2) {
      toast.error("Pilih minimal 2 peserta");
      return;
    }

    setIsSubmitting(true);
    await onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      startDate,
      endDate,
      participants: selectedParticipants,
    });

    // Reset form
    setName("");
    setDescription("");
    setStartDate(new Date());
    setEndDate(undefined);
    setSelectedParticipants([]);
    setOpen(false);
    setIsSubmitting(false);
  };

  const toggleParticipant = (id: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const selectAllParticipants = () => {
    if (selectedParticipants.length === participants.length) {
      setSelectedParticipants([]);
    } else {
      setSelectedParticipants(participants.map((p) => p.id));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Buat Trip Baru
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Buat Trip Baru</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="tripName">Nama Trip</Label>
            <Input
              id="tripName"
              placeholder="Contoh: Tour Bromo 2024"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tripDesc">Deskripsi (opsional)</Label>
            <Textarea
              id="tripDesc"
              placeholder="Deskripsi singkat trip..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tanggal Mulai</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                    disabled={isSubmitting}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "dd/MM/yyyy") : "Pilih"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Tanggal Selesai</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                    disabled={isSubmitting}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "dd/MM/yyyy") : "Pilih"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => (startDate ? date < startDate : false)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Peserta Trip</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={selectAllParticipants}
                className="h-auto py-1 px-2 text-xs"
                disabled={isSubmitting}
              >
                {selectedParticipants.length === participants.length
                  ? "Hapus Semua"
                  : "Pilih Semua"}
              </Button>
            </div>
            {participants.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">
                Belum ada peserta. Tambahkan peserta terlebih dahulu.
              </p>
            ) : (
              <div className="max-h-40 overflow-y-auto space-y-2 rounded-lg border p-3">
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center gap-3"
                  >
                    <Checkbox
                      id={`participant-${participant.id}`}
                      checked={selectedParticipants.includes(participant.id)}
                      onCheckedChange={() => toggleParticipant(participant.id)}
                      disabled={isSubmitting}
                    />
                    <label
                      htmlFor={`participant-${participant.id}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {participant.name}
                    </label>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              {selectedParticipants.length} peserta dipilih
            </p>
          </div>

          <Button onClick={handleSubmit} className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Buat Trip"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
