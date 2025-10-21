import { Card } from "@/components/ui/card";
import { Shield, Users, Terminal, AlertTriangle } from "lucide-react";

interface ThreatStatsProps {
  data: any;
}

export const ThreatStats = ({ data }: ThreatStatsProps) => {
  const stats = [
    {
      icon: AlertTriangle,
      label: "Total Attacks",
      value: data?.totalAttacks || "0",
      color: "text-accent",
      glow: "threat-glow"
    },
    {
      icon: Users,
      label: "Unique IPs",
      value: data?.uniqueIPs || "0",
      color: "text-primary",
      glow: "cyber-glow"
    },
    {
      icon: Shield,
      label: "Blocked Attempts",
      value: data?.blockedAttempts || "0",
      color: "text-secondary",
      glow: ""
    },
    {
      icon: Terminal,
      label: "Commands Captured",
      value: data?.commandsCaptured || "0",
      color: "text-foreground",
      glow: ""
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card 
            key={index} 
            className={`p-6 bg-card border-glow hover:scale-105 transition-all ${stat.glow}`}
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <Icon className={`w-10 h-10 ${stat.color}`} />
                {stat.glow && (
                  <div className={`absolute inset-0 blur-xl ${stat.color} opacity-50 animate-pulse`} />
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
