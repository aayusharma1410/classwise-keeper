
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://etdojkisfotaszvbylpi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0ZG9qa2lzZm90YXN6dmJ5bHBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1ODEwNjEsImV4cCI6MjA1NzE1NzA2MX0.-DHes4H2XUtmWFPlMVzuCgzOAmnHfJuZZk1uqx4dvhU';

export const supabase = createClient(supabaseUrl, supabaseKey);
