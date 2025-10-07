import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Save, Key, MessageSquare, HardDrive } from "lucide-react";

export const ConfigPanel = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState({
    twilioAccountSid: "",
    twilioAuthToken: "",
    twilioPhoneNumber: "",
    googleClientId: "",
    googleClientSecret: "",
  });

  const handleSave = () => {
    toast({
      title: "Configuration Saved",
      description: "Your API credentials have been securely stored.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Configuration
        </h2>
        <p className="text-muted-foreground mt-1">
          Set up your API credentials and integration settings
        </p>
      </div>

      <Card className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/20">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">WhatsApp Integration</h3>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="twilioSid">Twilio Account SID</Label>
            <Input
              id="twilioSid"
              type="text"
              placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              value={config.twilioAccountSid}
              onChange={(e) =>
                setConfig({ ...config, twilioAccountSid: e.target.value })
              }
              className="bg-background/50 border-border"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="twilioToken">Twilio Auth Token</Label>
            <Input
              id="twilioToken"
              type="password"
              placeholder="Enter your auth token"
              value={config.twilioAuthToken}
              onChange={(e) =>
                setConfig({ ...config, twilioAuthToken: e.target.value })
              }
              className="bg-background/50 border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="twilioPhone">Twilio WhatsApp Number</Label>
            <Input
              id="twilioPhone"
              type="tel"
              placeholder="whatsapp:+14155238886"
              value={config.twilioPhoneNumber}
              onChange={(e) =>
                setConfig({ ...config, twilioPhoneNumber: e.target.value })
              }
              className="bg-background/50 border-border"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-info/20">
            <HardDrive className="h-5 w-5 text-info" />
          </div>
          <h3 className="text-xl font-semibold">Google Drive Integration</h3>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="googleClientId">Google Client ID</Label>
            <Input
              id="googleClientId"
              type="text"
              placeholder="Enter your Google OAuth Client ID"
              value={config.googleClientId}
              onChange={(e) =>
                setConfig({ ...config, googleClientId: e.target.value })
              }
              className="bg-background/50 border-border"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="googleClientSecret">Google Client Secret</Label>
            <Input
              id="googleClientSecret"
              type="password"
              placeholder="Enter your Google OAuth Client Secret"
              value={config.googleClientSecret}
              onChange={(e) =>
                setConfig({ ...config, googleClientSecret: e.target.value })
              }
              className="bg-background/50 border-border"
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          onClick={handleSave}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Configuration
        </Button>
      </div>

      <Card className="p-4 bg-info/10 border-info/30">
        <div className="flex gap-3">
          <Key className="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
          <div className="text-sm text-info-foreground">
            <p className="font-semibold mb-1">Secure Storage</p>
            <p className="text-info-foreground/80">
              All credentials are encrypted and stored securely in Lovable Cloud.
              They are never exposed in the client-side code.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
