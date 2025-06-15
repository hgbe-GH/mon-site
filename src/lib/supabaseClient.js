import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qporukhklvymgupkoxdb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwb3J1a2hrbHZ5bWd1cGtveGRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5OTAzNzksImV4cCI6MjA2NTU2NjM3OX0.ofPUdIG219OrnG_TcLOhnl8qBd6CkA3wTySftx6F_4M';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);