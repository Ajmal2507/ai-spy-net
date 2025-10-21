import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, Sparkles, TrendingUp, AlertCircle, Key } from "lucide-react";
import { toast } from "sonner";

interface AIAnalysisProps {
  data: any;
}

export const AIAnalysis = ({ data }: AIAnalysisProps) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");

  const handleAnalyze = async () => {
    if (!apiKey.trim()) {
      toast.error("Please enter your Groq API key");
      return;
    }

    if (!data) {
      toast.error("No log data available to analyze");
      return;
    }

    setAnalyzing(true);
    
    try {
      const prompt = `Analyze this SSH honeypot data and provide detailed threat intelligence:

Total Attacks: ${data.totalAttacks}
Unique IPs: ${data.uniqueIPs}
Top Countries: ${JSON.stringify(data.topCountries)}
Top Commands: ${JSON.stringify(data.topCommands)}

Provide a comprehensive analysis including:
1. Attack Pattern Analysis - identify major attack patterns with severity levels
2. Command Analysis - analyze the malicious commands and their intent
3. Threat Actor Profiling - profile potential threat actors based on behavior
4. Security Recommendations - provide 5-7 specific, actionable recommendations

Format your response in markdown with clear sections using ## and ### headers.`;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { 
              role: 'system', 
              content: 'You are a cybersecurity expert specializing in threat intelligence and honeypot analysis. Provide detailed, actionable insights.' 
            },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to generate analysis');
      }

      const result = await response.json();
      const generatedAnalysis = result.choices[0].message.content;
      
      setAnalysis(generatedAnalysis);
      toast.success("AI analysis complete!");
    } catch (error) {
      console.error('AI analysis error:', error);
      toast.error(error instanceof Error ? error.message : "Failed to generate analysis");
    } finally {
      setAnalyzing(false);
    }
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
          disabled={analyzing || !apiKey.trim()}
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
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="api-key" className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              Groq API Key
            </Label>
            <Input
              id="api-key"
              type="password"
              placeholder="gsk_..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-background"
            />
            <p className="text-xs text-muted-foreground">
              Your API key is only used locally and never stored. Get one at{" "}
              <a 
                href="https://console.groq.com/keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                console.groq.com
              </a>
            </p>
          </div>
          
          <div className="text-center py-8 space-y-4">
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto opacity-50" />
            <p className="text-muted-foreground">
              Enter your Groq API key above and click "Generate Analysis" to get AI-powered threat intelligence insights
            </p>
          </div>
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
