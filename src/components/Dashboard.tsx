import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, FileText, Trash2, FolderInput, FileEdit, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CommandLog {
  id: string;
  command: string;
  status: "success" | "error" | "pending";
  timestamp: string;
  details: string;
}

const mockLogs: CommandLog[] = [
  {
    id: "1",
    command: "LIST",
    status: "success",
    timestamp: new Date().toISOString(),
    details: "/Documents - 12 files found",
  },
  {
    id: "2",
    command: "SUMMARY",
    status: "pending",
    timestamp: new Date(Date.now() - 60000).toISOString(),
    details: "/Reports - Generating AI summary...",
  },
  {
    id: "3",
    command: "MOVE",
    status: "success",
    timestamp: new Date(Date.now() - 120000).toISOString(),
    details: "report.pdf → /Archive",
  },
];

const getCommandIcon = (command: string) => {
  switch (command) {
    case "LIST":
      return <FileText className="h-4 w-4" />;
    case "DELETE":
      return <Trash2 className="h-4 w-4" />;
    case "MOVE":
      return <FolderInput className="h-4 w-4" />;
    case "RENAME":
      return <FileEdit className="h-4 w-4" />;
    case "UPLOAD":
      return <Upload className="h-4 w-4" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "success":
      return <Badge className="bg-success text-success-foreground">Success</Badge>;
    case "error":
      return <Badge className="bg-destructive text-destructive-foreground">Error</Badge>;
    case "pending":
      return <Badge className="bg-warning text-warning-foreground animate-pulse-glow">Pending</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export const Dashboard = () => {
  const [logs, setLogs] = useState<CommandLog[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    pending: 0,
  });

  useEffect(() => {
    // Fetch initial logs
    fetchLogs();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('command_logs_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'command_logs',
        },
        () => {
          fetchLogs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchLogs = async () => {
    const { data, error } = await supabase
      .from('command_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(10);

    if (!error && data) {
      setLogs(data.map((log) => ({
        id: log.id,
        command: log.command,
        status: log.status as "success" | "error" | "pending",
        timestamp: log.timestamp,
        details: log.details || '',
      })));

      // Calculate stats
      const total = data.length;
      const success = data.filter((l) => l.status === 'success').length;
      const pending = data.filter((l) => l.status === 'pending').length;
      setStats({ total, success, pending });
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Command Center
          </h2>
          <p className="text-muted-foreground mt-1">
            Real-time WhatsApp Drive operations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse-glow" />
          <span className="text-sm text-muted-foreground">Active</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-success/20">
              <Activity className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Commands</p>
              <h3 className="text-2xl font-bold">{stats.total}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-info/20">
              <FileText className="h-6 w-6 text-info" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Successful</p>
              <h3 className="text-2xl font-bold">{stats.success}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-warning/20">
              <Upload className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <h3 className="text-2xl font-bold">{stats.pending}</h3>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-lg bg-card/50 border border-border/30 animate-slide-up hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 rounded bg-primary/10 mt-0.5">
                      {getCommandIcon(log.command)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground">
                          {log.command}
                        </span>
                        {getStatusBadge(log.status)}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {log.details}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};
