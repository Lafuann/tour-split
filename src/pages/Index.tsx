import { Link } from "react-router-dom";
import { ArrowRight, Calculator, Map, Receipt, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";

const Index = () => {
  const features = [
    {
      icon: Users,
      title: "Master Data Peserta",
      description: "Kelola daftar peserta touring dengan mudah",
      link: "/participants",
    },
    {
      icon: Map,
      title: "Kelola Trip",
      description: "Buat dan atur trip touring dengan peserta berbeda",
      link: "/trips",
    },
    {
      icon: Receipt,
      title: "Catat Pengeluaran",
      description: "Input pengeluaran dengan pembagian biaya yang fleksibel",
      link: "/trips",
    },
    {
      icon: Calculator,
      title: "Hitung Reimburse",
      description: "Kalkulasi otomatis siapa bayar ke siapa dan berapa",
      link: "/trips",
    },
  ];

  return (
    <Layout>
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80 p-8 md:p-12 text-primary-foreground">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          <div className="relative z-10 max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
              <Receipt className="h-4 w-4" />
              Split Biaya Touring
            </div>
            <h1 className="mb-4 text-3xl md:text-4xl font-bold tracking-tight">
              Hitung Reimburse Touring Jadi Mudah!
            </h1>
            <p className="mb-8 text-lg text-primary-foreground/90">
              Tidak perlu pusing menghitung siapa hutang berapa. TourSplit
              menghitung otomatis dengan pembagian biaya yang fleksibel - bisa
              sama rata atau berbeda per orang.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/participants">
                <Button
                  size="lg"
                  variant="secondary"
                  className="gap-2 font-semibold"
                >
                  Mulai Sekarang
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/trips">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 border-primary-foreground/30 text-primary hover:bg-primary-foreground/10 hover:text-primary-foreground"
                >
                  Lihat Trip
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section>
          <h2 className="mb-6 text-2xl font-bold text-foreground">
            Fitur Utama
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link key={index} to={feature.link}>
                  <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="mb-2 font-semibold text-foreground group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* How it works */}
        <section className="rounded-2xl bg-card p-8 border">
          <h2 className="mb-8 text-center text-2xl font-bold text-foreground">
            Cara Kerja
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Tambah Peserta",
                description:
                  "Daftarkan semua peserta touring ke dalam sistem",
              },
              {
                step: "2",
                title: "Buat Trip & Catat Pengeluaran",
                description:
                  "Catat setiap pengeluaran dengan pembagian biaya fleksibel",
              },
              {
                step: "3",
                title: "Lihat Hasil Reimburse",
                description:
                  "Sistem menghitung otomatis siapa bayar ke siapa",
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  {item.step}
                </div>
                <h3 className="mb-2 font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
