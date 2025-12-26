import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { ParticipantList } from "@/components/participants/ParticipantList";
import { Participant } from "@/types";
import {
  getParticipants,
  addParticipant,
  deleteParticipant,
} from "@/lib/storage";
import { Loader2 } from "lucide-react";

const Participants = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadParticipants();
  }, []);

  const loadParticipants = async () => {
    setLoading(true);
    const data = await getParticipants();
    setParticipants(data);
    setLoading(false);
  };

  const handleAdd = async (name: string) => {
    const newParticipant = await addParticipant(name);
    if (newParticipant) {
      setParticipants((prev) => [...prev, newParticipant]);
    }
  };

  const handleDelete = async (id: string) => {
    const success = await deleteParticipant(id);
    if (success) {
      setParticipants((prev) => prev.filter((p) => p.id !== id));
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Peserta</h1>
          <p className="text-muted-foreground">
            Kelola daftar peserta touring Anda
          </p>
        </div>
        <ParticipantList
          participants={participants}
          onAdd={handleAdd}
          onDelete={handleDelete}
        />
      </div>
    </Layout>
  );
};

export default Participants;
