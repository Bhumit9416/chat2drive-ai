-- Create table for command logs
CREATE TABLE IF NOT EXISTS public.command_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  command TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'error', 'pending')),
  details TEXT,
  user_phone TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.command_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Public read access to command logs"
ON public.command_logs
FOR SELECT
USING (true);

-- Create policy for public insert access
CREATE POLICY "Public insert access to command logs"
ON public.command_logs
FOR INSERT
WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_command_logs_timestamp ON public.command_logs(timestamp DESC);
CREATE INDEX idx_command_logs_status ON public.command_logs(status);

-- Enable realtime for command_logs
ALTER PUBLICATION supabase_realtime ADD TABLE public.command_logs;