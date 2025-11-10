import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, Clock } from "lucide-react";

interface Bet {
  id: number;
  match: string;
  betType: string;
  odds: string;
  amount: number;
  potentialWin: number;
  date: string;
  status: "pending" | "won" | "lost";
}

interface MyBetsProps {
  bets: Bet[];
}

const MyBets = ({ bets }: MyBetsProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-secondary text-secondary-foreground";
      case "won":
        return "bg-primary text-primary-foreground";
      case "lost":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Em andamento";
      case "won":
        return "Ganhou";
      case "lost":
        return "Perdeu";
      default:
        return status;
    }
  };

  if (bets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Clock className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">Nenhuma aposta ainda</h3>
        <p className="text-muted-foreground">
          Faça sua primeira aposta na aba "Partidas"
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">Minhas Apostas</h3>
        <Badge variant="outline" className="text-base">
          {bets.filter(b => b.status === "pending").length} em andamento
        </Badge>
      </div>

      <div className="grid gap-4">
        {bets.map((bet) => (
          <Card
            key={bet.id}
            className="p-5 bg-card border-border shadow-card hover:shadow-glow transition-smooth"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-1">{bet.match}</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{bet.date}</span>
                </div>
              </div>
              <Badge className={getStatusColor(bet.status)}>
                {getStatusLabel(bet.status)}
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Aposta</p>
                <p className="font-semibold">{bet.betType}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Odd</p>
                <p className="font-bold text-primary">{bet.odds}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Valor</p>
                <p className="font-semibold">R$ {bet.amount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Retorno Potencial</p>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <p className="font-bold text-primary">
                    R$ {bet.potentialWin.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyBets;
