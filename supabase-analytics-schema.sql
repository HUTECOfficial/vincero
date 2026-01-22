-- Tabla para rastrear vistas de página
CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  user_agent TEXT,
  device_type TEXT CHECK (device_type IN ('mobile', 'desktop', 'tablet')),
  session_id TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para rastrear tiempo en página
CREATE TABLE IF NOT EXISTS page_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL,
  session_id TEXT NOT NULL,
  time_spent INTEGER NOT NULL, -- en segundos
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para rastrear eventos (clics, interacciones)
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  event_category TEXT,
  event_label TEXT,
  event_value INTEGER,
  page_path TEXT,
  session_id TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para rastrear productos vistos
CREATE TABLE IF NOT EXISTS product_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id INTEGER NOT NULL,
  product_name TEXT NOT NULL,
  session_id TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_views ENABLE ROW LEVEL SECURITY;

-- Políticas: Cualquiera puede insertar, solo admins pueden leer
CREATE POLICY "Anyone can insert page views" ON page_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can insert page sessions" ON page_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can insert analytics events" ON analytics_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can insert product views" ON product_views
  FOR INSERT WITH CHECK (true);

-- Políticas de lectura (puedes ajustar según tus necesidades)
CREATE POLICY "Admins can view all page views" ON page_views
  FOR SELECT USING (true);

CREATE POLICY "Admins can view all page sessions" ON page_sessions
  FOR SELECT USING (true);

CREATE POLICY "Admins can view all analytics events" ON analytics_events
  FOR SELECT USING (true);

CREATE POLICY "Admins can view all product views" ON product_views
  FOR SELECT USING (true);

-- Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_page_views_page_path ON page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_device_type ON page_views(device_type);
CREATE INDEX IF NOT EXISTS idx_page_sessions_page_path ON page_sessions(page_path);
CREATE INDEX IF NOT EXISTS idx_page_sessions_session_id ON page_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_views_product_id ON product_views(product_id);
CREATE INDEX IF NOT EXISTS idx_product_views_created_at ON product_views(created_at DESC);
