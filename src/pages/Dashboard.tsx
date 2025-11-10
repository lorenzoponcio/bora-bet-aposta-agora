import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, LogOut, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import MatchCard from "@/components/MatchCard";
import MyBets from "@/components/MyBets";
import Standings from "@/components/Standings";

// Times do Brasileirão Série A 2025
const teams = [
  { id: 1, name: "Botafogo", logo: "⚫⚪" },
  { id: 2, name: "Palmeiras", logo: "🟢⚪" },
  { id: 3, name: "Fortaleza", logo: "🔴🔵" },
  { id: 4, name: "Internacional", logo: "🔴⚪" },
  { id: 5, name: "Flamengo", logo: "🔴⚫" },
  { id: 6, name: "São Paulo", logo: "🔴⚫" },
  { id: 7, name: "Cruzeiro", logo: "🔵⚪" },
  { id: 8, name: "Bahia", logo: "🔵🔴" },
  { id: 9, name: "Corinthians", logo: "⚫⚪" },
  { id: 10, name: "Vitória", logo: "🔴⚫" },
  { id: 11, name: "Vasco", logo: "⚫⚪" },
  { id: 12, name: "Juventude", logo: "🟢⚪" },
  { id: 13, name: "Grêmio", logo: "🔵⚫" },
  { id: 14, name: "Fluminense", logo: "🟢🔴" },
  { id: 15, name: "Atlético-MG", logo: "⚫⚪" },
  { id: 16, name: "RB Bragantino", logo: "⚪🔴" },
];

// Gerar partidas aleatórias
const generateMatches = () => {
  const matches = [];
  const shuffled = [...teams].sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < shuffled.length; i += 2) {
    if (i + 1 < shuffled.length) {
      matches.push({
        id: matches.length + 1,
        homeTeam: shuffled[i],
        awayTeam: shuffled[i + 1],
        homeOdds: (1.5 + Math.random() * 2).toFixed(2),
        drawOdds: (2.5 + Math.random() * 1.5).toFixed(2),
        awayOdds: (1.5 + Math.random() * 2).toFixed(2),
        date: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
      });
    }
  }
  
  return matches;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [balance, setBalance] = useState(1000);
  const [bets, setBets] = useState<any[]>([]); // Armazenar apostas

  useEffect(() => {
    // Verificar se usuário está logado
    const userData = localStorage.getItem("borabet_user");
    if (!userData) {
      navigate("/auth");
      return;
    }
    setUser(JSON.parse(userData));
    setMatches(generateMatches());
    
    // Carregar apostas do localStorage
    const savedBets = localStorage.getItem("borabet_bets");
    if (savedBets) {
      setBets(JSON.parse(savedBets));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("borabet_user");
    toast.success("Logout realizado com sucesso!");
    navigate("/auth");
  };

  const handleBet = (matchId: number, betType: string, odds: string, amount: number) => {
    if (amount > balance) {
      toast.error("Saldo insuficiente!");
      return;
    }

    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    const potentialWin = parseFloat((amount * parseFloat(odds)).toFixed(2));
    
    // Determinar o nome da aposta
    let betTypeName = "";
    if (betType === "home") betTypeName = match.homeTeam.name;
    else if (betType === "away") betTypeName = match.awayTeam.name;
    else betTypeName = "Empate";

    const newBet = {
      id: Date.now(),
      match: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
      betType: betTypeName,
      odds: odds,
      amount: amount,
      potentialWin: potentialWin,
      date: match.date,
      status: "pending"
    };

    const updatedBets = [newBet, ...bets];
    setBets(updatedBets);
    setBalance(balance - amount);
    
    // Salvar no localStorage
    localStorage.setItem("borabet_bets", JSON.stringify(updatedBets));
    
    toast.success(`Aposta realizada! Retorno potencial: R$ ${potentialWin.toFixed(2)}`);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                BoraBet
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Card className="px-4 py-2 bg-background border-border">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Saldo:</span>
                  <span className="font-bold text-primary">R$ {balance.toFixed(2)}</span>
                </div>
              </Card>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-border hover:bg-muted"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="matches" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mb-8">
            <TabsTrigger value="matches">Partidas</TabsTrigger>
            <TabsTrigger value="bets">Minhas Apostas</TabsTrigger>
            <TabsTrigger value="standings">Classificação</TabsTrigger>
          </TabsList>

          <TabsContent value="matches" className="space-y-6">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Brasileirão Série A 2025</h2>
              <p className="text-muted-foreground">
                Aposte nos melhores jogos do campeonato brasileiro
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {matches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onBet={handleBet}
                  userBalance={balance}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bets">
            <MyBets bets={bets} />
          </TabsContent>

          <TabsContent value="standings">
            <Standings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
