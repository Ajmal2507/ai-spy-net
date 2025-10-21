import { useState } from "react";
import { Shield, Activity, AlertTriangle, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThreatStats } from "@/components/ThreatStats";
import { AttackMap } from "@/components/AttackMap";
import { LogUploader } from "@/components/LogUploader";
import { AIAnalysis } from "@/components/AIAnalysis";
import { CommandAnalysis } from "@/components/CommandAnalysis";

const Index = () => {
  const [logData, setLogData] = useState<any>(null);
  const [showUploader, setShowUploader] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Shield className="w-8 h-8 text-primary" />
                <div className="absolute inset-0 blur-xl bg-primary/30 animate-pulse-glow" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient-cyber">HONEYPY AI</h1>
                <p className="text-xs text-muted-foreground">Threat Intelligence Platform</p>
              </div>
            </div>
            <Button 
              onClick={() => setShowUploader(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground cyber-glow"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Logs
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {!logData ? (
          <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
            <div className="relative">
              <div className="absolute inset-0 blur-3xl bg-primary/20 rounded-full animate-pulse" />
              <Shield className="w-32 h-32 text-primary relative z-10" />
            </div>
            <div className="text-center space-y-4 max-w-2xl">
              <h2 className="text-4xl font-bold text-gradient-cyber">
                AI-Powered Threat Analysis
              </h2>
              <p className="text-muted-foreground text-lg">
                Upload your honeypot logs to unlock advanced AI-driven insights,
                pattern recognition, and threat intelligence analysis
              </p>
              <Button 
                size="lg"
                onClick={() => setShowUploader(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground mt-6 cyber-glow"
              >
                <Upload className="w-5 h-5 mr-2" />
                Get Started
              </Button>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full max-w-5xl">
              <Card className="p-6 bg-card border-glow hover:scale-105 transition-transform">
                <Activity className="w-10 h-10 text-secondary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Pattern Recognition</h3>
                <p className="text-sm text-muted-foreground">
                  AI identifies attack patterns and common threat actor behaviors
                </p>
              </Card>
              
              <Card className="p-6 bg-card border-glow hover:scale-105 transition-transform">
                <AlertTriangle className="w-10 h-10 text-accent mb-4" />
                <h3 className="text-lg font-semibold mb-2">Threat Intelligence</h3>
                <p className="text-sm text-muted-foreground">
                  Real-time analysis of attack vectors and security recommendations
                </p>
              </Card>
              
              <Card className="p-6 bg-card border-glow hover:scale-105 transition-transform">
                <Shield className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Automated Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Generate comprehensive threat reports automatically
                </p>
              </Card>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <ThreatStats data={logData} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AttackMap data={logData} />
              <CommandAnalysis data={logData} />
            </div>
            <AIAnalysis data={logData} />
          </div>
        )}
      </main>

      {showUploader && (
        <LogUploader 
          onClose={() => setShowUploader(false)}
          onDataLoaded={setLogData}
        />
      )}
    </div>
  );
};

export default Index;
