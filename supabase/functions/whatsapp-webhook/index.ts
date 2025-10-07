import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WhatsAppMessage {
  Body: string;
  From: string;
  MessageSid: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse WhatsApp webhook data
    const formData = await req.formData();
    const message: WhatsAppMessage = {
      Body: formData.get('Body') as string || '',
      From: formData.get('From') as string || '',
      MessageSid: formData.get('MessageSid') as string || '',
    };

    console.log('Received WhatsApp message:', message);

    // Parse command from message body
    const commandText = message.Body.trim().toUpperCase();
    const parts = commandText.split(' ');
    const command = parts[0];

    // Log the command
    const { data: logData, error: logError } = await supabase
      .from('command_logs')
      .insert({
        command: command,
        status: 'pending',
        details: message.Body,
        user_phone: message.From,
      })
      .select()
      .single();

    if (logError) {
      console.error('Error logging command:', logError);
    }

    let response = '';
    let status = 'success';

    try {
      // Route command to appropriate handler
      switch (command) {
        case 'LIST':
          response = await handleList(parts[1]);
          break;
        case 'DELETE':
          response = await handleDelete(parts[1]);
          break;
        case 'MOVE':
          response = await handleMove(parts[1], parts[2]);
          break;
        case 'RENAME':
          response = await handleRename(parts[1], parts[2]);
          break;
        case 'UPLOAD':
          response = await handleUpload(parts[1], parts[2]);
          break;
        case 'SUMMARY':
          response = await handleSummary(parts[1]);
          break;
        default:
          response = 'Unknown command. Available commands: LIST, DELETE, MOVE, RENAME, UPLOAD, SUMMARY';
          status = 'error';
      }
    } catch (error: unknown) {
      console.error('Command error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      response = `Error: ${errorMessage}`;
      status = 'error';
    }

    // Update log with result
    if (logData) {
      await supabase
        .from('command_logs')
        .update({
          status: status,
          details: response,
        })
        .eq('id', logData.id);
    }

    // Send response back via Twilio
    const twilioResponse = `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Message>${response}</Message>
      </Response>`;

    return new Response(twilioResponse, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/xml',
      },
    });
  } catch (error: unknown) {
    console.error('Webhook error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// Handler functions (these will call Google Drive API)
async function handleList(folder: string): Promise<string> {
  // TODO: Implement Google Drive API call
  console.log('LIST command for folder:', folder);
  return `Listing files in ${folder || 'root'}...\n\nFiles:\n- document.pdf\n- report.xlsx\n- image.png`;
}

async function handleDelete(filePath: string): Promise<string> {
  console.log('DELETE command for file:', filePath);
  return `File ${filePath} deleted successfully.`;
}

async function handleMove(source: string, destination: string): Promise<string> {
  console.log('MOVE command:', source, '->', destination);
  return `Moved ${source} to ${destination} successfully.`;
}

async function handleRename(oldName: string, newName: string): Promise<string> {
  console.log('RENAME command:', oldName, '->', newName);
  return `Renamed ${oldName} to ${newName} successfully.`;
}

async function handleUpload(folder: string, filename: string): Promise<string> {
  console.log('UPLOAD command to folder:', folder, 'filename:', filename);
  return `Ready to receive file for upload to ${folder}/${filename}`;
}

async function handleSummary(folder: string): Promise<string> {
  console.log('SUMMARY command for folder:', folder);
  
  // This will call the AI summary function
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase.functions.invoke('ai-summarize', {
    body: { folder: folder },
  });

  if (error) {
    throw error;
  }

  return data.summary;
}
