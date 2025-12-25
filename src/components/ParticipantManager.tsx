import { useState } from 'react';
import { Participant } from '@/types/expense';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Plus, X, UserPlus } from 'lucide-react';

interface ParticipantManagerProps {
  participants: Participant[];
  onAdd: (name: string) => void;
  onRemove: (id: string) => void;
}

export function ParticipantManager({ participants, onAdd, onRemove }: ParticipantManagerProps) {
  const [newName, setNewName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onAdd(newName);
      setNewName('');
    }
  };

  return (
    <Card className="gradient-card border-border/50 shadow-md animate-fade-in">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-display">
          <Users className="h-5 w-5 text-primary" />
          Peserta Touring
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nama peserta..."
            className="flex-1 bg-background/50"
          />
          <Button type="submit" size="icon" className="gradient-primary shrink-0">
            <Plus className="h-4 w-4" />
          </Button>
        </form>

        {participants.length === 0 ? (
          <div className="py-8 text-center">
            <UserPlus className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground text-sm">
              Belum ada peserta. Tambahkan peserta touring di atas.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {participants.map((p, index) => (
              <div
                key={p.id}
                className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/80 animate-scale-in"
                style={{ 
                  animationDelay: `${index * 50}ms`,
                  borderLeft: `3px solid ${p.color}` 
                }}
              >
                <span className="text-sm font-medium text-secondary-foreground">{p.name}</span>
                <button
                  onClick={() => onRemove(p.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {participants.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Total: {participants.length} peserta
          </p>
        )}
      </CardContent>
    </Card>
  );
}
