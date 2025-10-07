import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Code, Zap } from "lucide-react";

export const Documentation = () => {
  const commands = [
    {
      command: "LIST /FolderName",
      description: "Lists all files in the specified folder",
      example: "LIST /Documents",
    },
    {
      command: "DELETE /FolderName/file.pdf",
      description: "Deletes the specified file",
      example: "DELETE /Reports/old_report.pdf",
    },
    {
      command: "MOVE /source /destination",
      description: "Moves a file from source to destination",
      example: "MOVE /Documents/report.pdf /Archive",
    },
    {
      command: "RENAME oldfile.pdf newfile.pdf",
      description: "Renames a file",
      example: "RENAME report_draft.pdf report_final.pdf",
    },
    {
      command: "UPLOAD /FolderName filename.pdf",
      description: "Uploads a file to the specified folder (send file with this message)",
      example: "UPLOAD /Reports quarterly_summary.pdf",
    },
    {
      command: "SUMMARY /FolderName",
      description: "AI-powered summary of all files in the folder",
      example: "SUMMARY /Reports",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Documentation
        </h2>
        <p className="text-muted-foreground mt-1">
          Learn how to use WhatsApp commands to manage your Google Drive
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/20">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">WhatsApp Setup</h3>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>1. Configure Twilio WhatsApp in the Configuration tab</p>
            <p>2. Set up webhook URL for incoming messages</p>
            <p>3. Test by sending a command to your Twilio number</p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-info/20">
              <Code className="h-5 w-5 text-info" />
            </div>
            <h3 className="text-lg font-semibold">Google Drive OAuth</h3>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>1. Create OAuth credentials in Google Cloud Console</p>
            <p>2. Add credentials to Configuration tab</p>
            <p>3. Authorize access to your Google Drive</p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-success/20">
              <Zap className="h-5 w-5 text-success" />
            </div>
            <h3 className="text-lg font-semibold">AI Summaries</h3>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Powered by Lovable AI (Gemini 2.5 Flash)</p>
            <p>Automatically analyzes PDFs, Docs, and text files</p>
            <p>Provides concise, actionable summaries</p>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm">
        <h3 className="text-xl font-semibold mb-4">Available Commands</h3>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {commands.map((cmd, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-card/50 border border-border/30 animate-slide-up"
              >
                <div className="flex items-start gap-3 mb-2">
                  <Badge className="bg-primary text-primary-foreground font-mono text-xs">
                    {cmd.command}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {cmd.description}
                </p>
                <div className="bg-muted/30 rounded p-2 mt-2">
                  <code className="text-xs text-info">{cmd.example}</code>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      <Card className="p-4 bg-warning/10 border-warning/30">
        <div className="flex gap-3">
          <Zap className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold mb-1 text-warning-foreground">Note</p>
            <p className="text-warning-foreground/80">
              This is a functional prototype. Google Drive API integration and file upload handling
              need to be fully implemented in the edge functions. OAuth2 authentication flow
              should be added for production use.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
