import { Card } from "@/components/ui/card";
import { Globe } from "lucide-react";

interface AttackMapProps {
  data: any;
}

export const AttackMap = ({ data }: AttackMapProps) => {
  const topCountries = data?.topCountries || [
    { name: "China", attacks: 145, percentage: 35 },
    { name: "Russia", attacks: 98, percentage: 24 },
    { name: "USA", attacks: 67, percentage: 16 },
    { name: "Germany", attacks: 45, percentage: 11 },
    { name: "Brazil", attacks: 32, percentage: 8 }
  ];

  return (
    <Card className="p-6 bg-card border-glow">
      <div className="flex items-center gap-3 mb-6">
        <Globe className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-bold">Attack Origins</h2>
      </div>
      
      <div className="space-y-4">
        {topCountries.map((country, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{country.name}</span>
              <span className="text-sm text-muted-foreground">{country.attacks} attacks</span>
            </div>
            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000"
                style={{ width: `${country.percentage}%` }}
              />
              <div 
                className="absolute left-0 top-0 h-full bg-primary/50 blur-sm animate-pulse"
                style={{ width: `${country.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
