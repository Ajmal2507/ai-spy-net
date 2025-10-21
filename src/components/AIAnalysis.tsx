import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Sparkles, TrendingUp, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface AIAnalysisProps {
  data: any;
}

export const AIAnalysis = ({ data }: AIAnalysisProps) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockAnalysis = `
## Threat Intelligence Summary

### Attack Pattern Analysis
Based on the captured honeypot data, we've identified **3 major attack patterns**:

1. **Credential Stuffing Campaign** (High Severity)
   - 437 attempts from Chinese IP ranges
   - Common username/password combinations detected
   - Recommendation: Implement rate limiting and IP blocking

2. **Malware Distribution Attempts** (Critical)
   - 156 wget/curl commands attempting to download malicious scripts
   - Primary targets: /tmp and /var directories
   - Recommendation: Enhanced file system monitoring

3. **Reconnaissance Activity** (Medium Severity)
   - High volume of ls, cat, and find commands
   - Attackers mapping system architecture
   - Recommendation: Deploy honeytokens in sensitive directories

### Threat Actor Profiling
- **Primary threat actors**: APT groups from APAC region
- **Attack timing**: Peak activity between 02:00-06:00 UTC
- **Sophistication level**: Medium (automated tools with some manual intervention)

### Security Recommendations
1. Update firewall rules to block identified malicious IP ranges
2. Implement behavioral analysis for SSH sessions
3. Deploy additional honeypots in DMZ
4. Enhanced logging for lateral movement detection
5. Consider implementing MFA for all remote access
      `;
      
      setAnalysis(mockAnalysis);
      setAnalyzing(false);
      toast.success("AI analysis complete!");
    }, 3000);
  };

  return (
    <Card className="p-6 bg-card border-glow">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold">AI Threat Analysis</h2>
        </div>
        <Button
          onClick={handleAnalyze}
          disabled={analyzing}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {analyzing ? (
            <>
              <Sparkles className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <TrendingUp className="w-4 h-4 mr-2" />
              Generate Analysis
            </>
          )}
        </Button>
      </div>

      {!analysis && !analyzing && (
        <div className="text-center py-12 space-y-4">
          <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto opacity-50" />
          <p className="text-muted-foreground">
            Click "Generate Analysis" to get AI-powered threat intelligence insights
          </p>
        </div>
      )}

      {analyzing && (
        <div className="py-12 space-y-4">
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-primary via-secondary to-primary animate-scan" />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            AI is analyzing attack patterns and threat intelligence...
          </p>
        </div>
      )}

      {analysis && (
        <div className="prose prose-invert max-w-none">
          <div className="space-y-6 text-sm">
            {analysis.split('\n\n').map((section, index) => {
              if (section.startsWith('##')) {
                return (
                  <h3 key={index} className="text-lg font-bold text-foreground mt-6 mb-3">
                    {section.replace('##', '')}
                  </h3>
                );
              } else if (section.startsWith('###')) {
                return (
                  <h4 key={index} className="text-base font-semibold text-primary mt-4 mb-2">
                    {section.replace('###', '')}
                  </h4>
                );
              } else if (section.match(/^\d+\./)) {
                return (
                  <div key={index} className="ml-4 mb-2 text-muted-foreground">
                    {section}
                  </div>
                );
              } else {
                return (
                  <p key={index} className="text-muted-foreground leading-relaxed">
                    {section}
                  </p>
                );
              }
            })}
          </div>
        </div>
      )}
    </Card>
  );
};
