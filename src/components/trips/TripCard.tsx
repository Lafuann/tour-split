import { Link } from "react-router-dom";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar, ChevronRight, MapPin, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trip, Participant } from "@/types";

interface TripCardProps {
  trip: Trip;
  participants: Participant[];
  expenseCount: number;
  totalAmount: number;
  onDelete: (id: string) => void;
}

export const TripCard = ({
  trip,
  participants,
  expenseCount,
  totalAmount,
  onDelete,
}: TripCardProps) => {
  const tripParticipants = participants.filter((p) =>
    trip.participants.includes(p.id)
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg animate-slide-up">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          <div className="flex-1 p-5">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {trip.name}
                </h3>
                {trip.description && (
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                    {trip.description}
                  </p>
                )}
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Trip?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Yakin ingin menghapus trip "{trip.name}"? Semua pengeluaran di trip ini juga akan dihapus.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(trip.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Hapus
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {format(trip.startDate, "dd MMM yyyy", { locale: id })}
                  {trip.endDate && ` - ${format(trip.endDate, "dd MMM yyyy", { locale: id })}`}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>
                  {tripParticipants.length} peserta
                  {tripParticipants.length > 0 && (
                    <span className="ml-1 text-xs">
                      ({tripParticipants.map((p) => p.name).join(", ")})
                    </span>
                  )}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{expenseCount} pengeluaran</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t sm:border-t-0 sm:border-l border-border bg-muted/30 p-5 sm:w-48">
            <div className="text-center sm:text-right flex-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Total
              </p>
              <p className="text-lg font-bold text-primary">
                {formatCurrency(totalAmount)}
              </p>
            </div>
            <Link to={`/trips/${trip.id}`}>
              <Button variant="primary-ghost" size="icon" className="ml-2">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
