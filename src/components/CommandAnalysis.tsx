import { Card } from "@/components/ui/card";
import { Terminal, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CommandAnalysisProps {
  data: any;
}

export const CommandAnalysis = ({ data }: CommandAnalysisProps) => {
  const topCommands = data?.topCommands || [
    { command: "ls -la", count: 234, threat: "low" },
    { command: "cat /etc/passwd", count: 189, threat: "high" },
    { command: "wget malicious.sh", count: 156, threat: "critical" },
    { command: "curl http://evil.com", count: 98, threat: "high" },
    { command: "rm -rf /", count: 67, threat: "critical" }
  ];

  const getThreatColor = (threat: string) => {
    switch (threat) {
      case "critical": return "bg-destructive text-destructive-foreground";
      case "high": return "bg-accent text-accent-foreground";
      case "medium": return "bg-yellow-500 text-yellow-50";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <Card className="p-6 bg-card border-glow">
      <div className="flex items-center gap-3 mb-6">
        <Terminal className="w-6 h-6 text-secondary" />
        <h2 className="text-xl font-bold">Top Commands</h2>
        <TrendingUp className="w-4 h-4 text-muted-foreground ml-auto" />
      </div>
      
      <div className="space-y-3">
        {topCommands.map((cmd, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border hover:border-primary/50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <code className="text-sm font-mono text-foreground block truncate">
                {cmd.command}
              </code>
            </div>
            <div className="flex items-center gap-3 ml-4">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {cmd.count}x
              </span>
              <Badge className={getThreatColor(cmd.threat)}>
                {cmd.threat}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
