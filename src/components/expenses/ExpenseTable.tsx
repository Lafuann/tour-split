import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Expense, Participant } from "@/types";
import { formatCurrency, formatDateTime } from "@/lib/calculations";
import { cn } from "@/lib/utils";

interface ExpenseTableProps {
  expenses: Expense[];
  participants: Participant[];
  onDelete: (id: string) => void;
}

export const ExpenseTable = ({
  expenses,
  participants,
  onDelete,
}: ExpenseTableProps) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const getParticipantName = (id: string) => {
    return participants.find((p) => p.id === id)?.name || "Unknown";
  };

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-full bg-muted p-4">
          <svg
            className="h-8 w-8 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
            />
          </svg>
        </div>
        <p className="text-lg font-medium text-muted-foreground">
          Belum ada pengeluaran
        </p>
        <p className="text-sm text-muted-foreground">
          Tambahkan pengeluaran pertama untuk trip ini
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-10"></TableHead>
            <TableHead>Waktu</TableHead>
            <TableHead>Judul</TableHead>
            <TableHead>Dibayar oleh</TableHead>
            <TableHead>Pembagian</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="w-16"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => {
            const isExpanded = expandedRows.has(expense.id);
            const hasUnequalShares = expense.participantShares.some(
              (s, _, arr) => s.amount !== arr[0].amount
            );

            return (
              <Collapsible key={expense.id} asChild open={isExpanded}>
                <>
                  <TableRow className="animate-slide-up">
                    <TableCell>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => toggleRow(expense.id)}
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {formatDateTime(expense.dateTime)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{expense.location}</p>
                        {expense.description && (
                          <p className="text-xs text-muted-foreground">
                            {expense.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white ${
                          getParticipantName(
                            expense.paidById
                          )?.toLocaleLowerCase() === "naufal"
                            ? "bg-teal-500"
                            : getParticipantName(
                                expense.paidById
                              )?.toLocaleLowerCase() === "farhan"
                            ? "bg-red-500"
                            : getParticipantName(
                                expense.paidById
                              )?.toLocaleLowerCase() === "hasan"
                            ? "bg-gray-500"
                            : getParticipantName(
                                expense.paidById
                              )?.toLocaleLowerCase() === "rizki"
                            ? "bg-green-500"
                            : "bg-primary"
                        } `}
                      >
                        {getParticipantName(expense.paidById)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-sm font-normal px-2 py-0.5 rounded-full ${
                          hasUnequalShares
                            ? "text-white bg-purple-600"
                            : "text-white bg-muted-foreground/50"
                        }`}
                      >
                        {hasUnequalShares ? "Pembagian Fleksibel" : "Sama Rata"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(expense.totalAmount)}
                    </TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Hapus Pengeluaran?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Yakin ingin menghapus pengeluaran di "
                              {expense.location}"?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(expense.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                  <CollapsibleContent asChild>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableCell colSpan={6} className="py-3">
                        <div className="px-4">
                          <p className="text-xs font-medium text-muted-foreground mb-2">
                            Pembagian Biaya:
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {expense.participantShares.map((share) => (
                              <div
                                key={share.participantId}
                                className={cn(
                                  "flex items-center justify-between rounded-md bg-background px-3 py-2 text-sm",
                                  share.participantId === expense.paidById &&
                                    "ring-1 ring-primary/30"
                                )}
                              >
                                <span className="font-medium">
                                  {getParticipantName(share.participantId)}
                                </span>
                                <span className="text-muted-foreground">
                                  {formatCurrency(share.amount)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  </CollapsibleContent>
                </>
              </Collapsible>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
