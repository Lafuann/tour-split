import { useState } from 'react';
import { Trip } from '@/hooks/useExpenseStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Plus, Trash2, ChevronRight, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface TripSelectorProps {
  trips: Trip[];
  loading: boolean;
  selectedTripId: string | null;
  onSelectTrip: (id: string) => void;
  onCreateTrip: (name: string, description?: string) => Promise<Trip | null>;
  onDeleteTrip: (id: string) => void;
}

export function TripSelector({
  trips,
  loading,
  selectedTripId,
  onSelectTrip,
  onCreateTrip,
  onDeleteTrip,
}: TripSelectorProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    
    setCreating(true);
    const trip = await onCreateTrip(name.trim(), description.trim() || undefined);
    setCreating(false);
    
    if (trip) {
      setName('');
      setDescription('');
      setOpen(false);
      onSelectTrip(trip.id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="gradient-card border-border/50 shadow-md animate-fade-in">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-display">
            <MapPin className="h-5 w-5 text-primary" />
            Pilih Touring
          </CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gradient-primary">
                <Plus className="h-4 w-4 mr-1" />
                Baru
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Buat Touring Baru</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="trip-name">Nama Touring</Label>
                  <Input
                    id="trip-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Touring Bromo 2024"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trip-desc">Deskripsi (opsional)</Label>
                  <Textarea
                    id="trip-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Touring tahunan ke Gunung Bromo..."
                    rows={3}
                  />
                </div>
                <Button 
                  onClick={handleCreate} 
                  className="w-full gradient-primary"
                  disabled={!name.trim() || creating}
                >
                  {creating ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Buat Touring
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {trips.length === 0 ? (
          <div className="py-8 text-center">
            <MapPin className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground text-sm mb-4">
              Belum ada touring. Buat touring baru untuk memulai.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {trips.map((trip, index) => (
              <div
                key={trip.id}
                className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all animate-slide-up ${
                  selectedTripId === trip.id
                    ? 'bg-primary/10 border border-primary/30'
                    : 'bg-secondary/50 hover:bg-secondary/80'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => onSelectTrip(trip.id)}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{trip.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(trip.created_at), 'dd MMM yyyy', { locale: id })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTrip(trip.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <ChevronRight className={`h-4 w-4 transition-colors ${
                    selectedTripId === trip.id ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
