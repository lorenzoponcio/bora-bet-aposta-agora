import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";

interface Team {
  id: number;
  name: string;
  logo: string;
}

interface Match {
  id: number;
  homeTeam: Team;
  awayTeam: Team;
  homeOdds: string;
  drawOdds: string;
  awayOdds: string;
  date: string;
}

interface MatchCardProps {
  match: Match;
  onBet: (matchId: number, betType: string, odds: string, amount: number) => void;
  userBalance: number;
}

const MatchCard = ({ match, onBet, userBalance }: MatchCardProps) => {
  const [selectedBet, setSelectedBet] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState("");

  const handleBetClick = (betType: string) => {
    setSelectedBet(betType);
    setBetAmount("");
  };

  const handleConfirmBet = () => {
    const amount = parseFloat(betAmount);
    if (!amount || amount <= 0) {
      return;
    }

    let odds = "0";
    if (selectedBet === "home") odds = match.homeOdds;
    if (selectedBet === "draw") odds = match.drawOdds;
    if (selectedBet === "away") odds = match.awayOdds;

    onBet(match.id, selectedBet!, odds, amount);
    setSelectedBet(null);
    setBetAmount("");
  };

  const getOddsForBet = () => {
    if (selectedBet === "home") return match.homeOdds;
    if (selectedBet === "draw") return match.drawOdds;
    if (selectedBet === "away") return match.awayOdds;
    return "0";
  };

  const getBetLabel = () => {
    if (selectedBet === "home") return match.homeTeam.name;
    if (selectedBet === "draw") return "Empate";
    if (selectedBet === "away") return match.awayTeam.name;
    return "";
  };

  return (
    <Card className="p-6 bg-card border-border shadow-card hover:shadow-glow transition-smooth">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{match.date}</span>
        </div>
      </div>

      {/* Teams */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-4xl mb-2">{match.homeTeam.logo}</div>
          <div className="font-semibold text-sm">{match.homeTeam.name}</div>
        </div>
        
        <div className="flex items-center justify-center">
          <span className="text-2xl font-bold text-muted-foreground">VS</span>
        </div>
        
        <div className="text-center">
          <div className="text-4xl mb-2">{match.awayTeam.logo}</div>
          <div className="font-semibold text-sm">{match.awayTeam.name}</div>
        </div>
      </div>

      {/* Odds Buttons */}
      {!selectedBet && (
        <div className="grid grid-cols-3 gap-2">
          <Button
            onClick={() => handleBetClick("home")}
            className="flex flex-col py-6 bg-muted hover:bg-primary hover:text-primary-foreground transition-smooth"
            variant="outline"
          >
            <span className="text-xs mb-1">Casa</span>
            <span className="text-lg font-bold">{match.homeOdds}</span>
          </Button>
          
          <Button
            onClick={() => handleBetClick("draw")}
            className="flex flex-col py-6 bg-muted hover:bg-primary hover:text-primary-foreground transition-smooth"
            variant="outline"
          >
            <span className="text-xs mb-1">Empate</span>
            <span className="text-lg font-bold">{match.drawOdds}</span>
          </Button>
          
          <Button
            onClick={() => handleBetClick("away")}
            className="flex flex-col py-6 bg-muted hover:bg-primary hover:text-primary-foreground transition-smooth"
            variant="outline"
          >
            <span className="text-xs mb-1">Fora</span>
            <span className="text-lg font-bold">{match.awayOdds}</span>
          </Button>
        </div>
      )}

      {/* Bet Input */}
      {selectedBet && (
        <div className="space-y-3 animate-in fade-in-50">
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Aposta:</span>
              <span className="font-semibold">{getBetLabel()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Odd:</span>
              <span className="font-bold text-primary">{getOddsForBet()}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Valor da aposta"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              max={userBalance}
              className="bg-background border-border"
            />
            
            {betAmount && (
              <div className="text-sm text-center p-2 bg-primary/10 rounded">
                <span className="text-muted-foreground">Retorno potencial: </span>
                <span className="font-bold text-primary">
                  R$ {(parseFloat(betAmount) * parseFloat(getOddsForBet())).toFixed(2)}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => setSelectedBet(null)}
              className="border-border hover:bg-muted"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmBet}
              disabled={!betAmount || parseFloat(betAmount) <= 0}
              className="bg-gradient-primary hover:opacity-90 transition-smooth"
            >
              Confirmar
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default MatchCard;
