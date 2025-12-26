import { useState } from "react";
import { Trash2, UserPlus, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Participant } from "@/types";
import { toast } from "sonner";
import { toTitleCase } from "@/lib/utils";

interface ParticipantListProps {
  participants: Participant[];
  onAdd: (name: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const ParticipantList = ({
  participants,
  onAdd,
  onDelete,
}: ParticipantListProps) => {
  const [newName, setNewName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAdd = async () => {
    const trimmedName = newName.trim();
    if (!trimmedName) {
      toast.error("Nama peserta tidak boleh kosong");
      return;
    }
    if (participants.some((p) => p.name.toLowerCase() === trimmedName.toLowerCase())) {
      toast.error("Nama peserta sudah ada");
      return;
    }
    
    setIsAdding(true);
    await onAdd(trimmedName);
    setNewName("");
    setIsAdding(false);
    toast.success(`${trimmedName} berhasil ditambahkan`);
  };

  const handleDelete = async (id: string, name: string) => {
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
    toast.success(`${name} berhasil dihapus`);
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Master Data Peserta
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleAdd} className="flex gap-3">
          <Input
            placeholder="Nama peserta baru..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={(e) => setNewName(toTitleCase(e.target.value))}
            className="flex-1"
            disabled={isAdding}
          />
          <Button onClick={handleAdd} className="gap-2" disabled={isAdding}>
            {isAdding ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            Tambah
          </Button>
        </form>

        {participants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium text-muted-foreground">
              Belum ada peserta
            </p>
            <p className="text-sm text-muted-foreground">
              Tambahkan peserta untuk memulai
            </p>
          </div>
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead className="w-24 text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participants.map((participant, index) => (
                  <TableRow key={participant.id} className="animate-slide-up">
                    <TableCell className="font-medium text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      {participant.name}
                    </TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            disabled={deletingId === participant.id}
                          >
                            {deletingId === participant.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Peserta?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Yakin ingin menghapus {participant.name}? Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(participant.id, participant.name)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
