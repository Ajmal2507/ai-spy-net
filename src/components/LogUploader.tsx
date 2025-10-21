import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Upload, FileText } from "lucide-react";
import { toast } from "sonner";

interface LogUploaderProps {
  onClose: () => void;
  onDataLoaded: (data: any) => void;
}

export const LogUploader = ({ onClose, onDataLoaded }: LogUploaderProps) => {
  const [uploading, setUploading] = useState(false);

  const parseLogFile = (content: string, fileName: string) => {
    const lines = content.split('\n').filter(line => line.trim());
    
    const ipRegex = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;
    const commandRegex = /Command:\s*(.+?)(?:\s*\||$)/i;
    const allIPs = new Set<string>();
    const commandCounts = new Map<string, number>();
    const ipCounts = new Map<string, number>();
    
    lines.forEach(line => {
      // Extract IPs
      const ips = line.match(ipRegex);
      if (ips) {
        ips.forEach(ip => {
          allIPs.add(ip);
          ipCounts.set(ip, (ipCounts.get(ip) || 0) + 1);
        });
      }
      
      // Extract commands
      const cmdMatch = line.match(commandRegex) || line.match(/(?:executed|ran|tried):\s*(.+?)(?:\s|$)/i);
      if (cmdMatch && cmdMatch[1]) {
        const cmd = cmdMatch[1].trim();
        if (cmd && cmd.length > 0) {
          commandCounts.set(cmd, (commandCounts.get(cmd) || 0) + 1);
        }
      }
      
      // Also try to extract raw commands from common formats
      if (line.includes('$') || line.includes('sudo') || line.includes('bash')) {
        const parts = line.split(/[\s\t]+/);
        const possibleCommands = parts.filter(p => 
          p.match(/^(ls|cat|wget|curl|rm|chmod|sudo|bash|sh|cd|pwd|whoami|id|uname|ps|netstat|ifconfig|ping)/i)
        );
        possibleCommands.forEach(cmd => {
          commandCounts.set(cmd, (commandCounts.get(cmd) || 0) + 1);
        });
      }
    });
    
    // Calculate threat levels for commands
    const getThreatLevel = (cmd: string): string => {
      const critical = /wget|curl.*http|rm\s+-rf|dd\s+if|mkfs|:\(\)\{|fork|bomb/i;
      const high = /passwd|shadow|sudoers|\.ssh|authorized_keys|crontab|service/i;
      const medium = /chmod|chown|kill|pkill|history/i;
      
      if (critical.test(cmd)) return "critical";
      if (high.test(cmd)) return "high";
      if (medium.test(cmd)) return "medium";
      return "low";
    };
    
    // Get top commands
    const sortedCommands = Array.from(commandCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([command, count]) => ({
        command,
        count,
        threat: getThreatLevel(command)
      }));
    
    // Get top IPs and simulate country data
    const sortedIPs = Array.from(ipCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    const totalAttacks = lines.length;
    const topCountries = sortedIPs.map((ip, index) => {
      const percentage = Math.round((ip[1] / totalAttacks) * 100);
      return {
        name: ip[0],
        attacks: ip[1],
        percentage
      };
    });
    
    return {
      totalAttacks,
      uniqueIPs: allIPs.size,
      blockedAttempts: Math.round(totalAttacks * 0.95),
      commandsCaptured: commandCounts.size,
      topCountries: topCountries.length > 0 ? topCountries : [
        { name: "No data", attacks: 0, percentage: 0 }
      ],
      topCommands: sortedCommands.length > 0 ? sortedCommands : [
        { command: "No commands found", count: 0, threat: "low" }
      ],
      rawLog: fileName
    };
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    try {
      const text = await file.text();
      const parsedData = parseLogFile(text, file.name);
      
      onDataLoaded(parsedData);
      toast.success(`Processed ${parsedData.totalAttacks} log entries!`);
      onClose();
    } catch (error) {
      toast.error("Failed to parse log file. Please check the format.");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full p-8 bg-card border-glow relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="text-center space-y-6">
          <div className="relative inline-block">
            <FileText className="w-20 h-20 text-primary mx-auto" />
            <div className="absolute inset-0 blur-2xl bg-primary/30 animate-pulse" />
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gradient-cyber mb-2">
              Upload Honeypot Logs
            </h2>
            <p className="text-muted-foreground">
              Support for cmd_audits.log, creds_audits.log, and http_audit.log
            </p>
          </div>

          <div className="border-2 border-dashed border-border rounded-lg p-12 hover:border-primary/50 transition-colors">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".log,.txt"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                .log or .txt files
              </p>
            </label>
          </div>

          {uploading && (
            <div className="text-sm text-muted-foreground">
              Processing logs...
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
