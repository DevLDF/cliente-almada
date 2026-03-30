-- ─────────────────────────────────────────────────────────────────────────────
-- Vertical: Inmobiliaria — Schema SQL para Supabase
-- Ejecutar en el SQL Editor de Supabase al iniciar un cliente nuevo
-- ─────────────────────────────────────────────────────────────────────────────

-- Tabla principal de contratos
-- El campo "data" almacena el contrato completo en JSONB
-- (flexible: permite agregar campos sin alterar el schema)

CREATE TABLE IF NOT EXISTS contratos (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nombre      TEXT NOT NULL DEFAULT 'Sin nombre',
  tipo        TEXT NOT NULL CHECK (tipo IN ('vivienda', 'comercial', 'galpon')),
  data        JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Row Level Security: cada usuario ve y modifica solo sus propios contratos
ALTER TABLE contratos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios gestionan sus propios contratos"
ON contratos FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Índices para búsqueda y ordenamiento
CREATE INDEX IF NOT EXISTS contratos_user_id_idx ON contratos (user_id);
CREATE INDEX IF NOT EXISTS contratos_updated_at_idx ON contratos (updated_at DESC);
CREATE INDEX IF NOT EXISTS contratos_tipo_idx ON contratos (tipo);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER contratos_updated_at
  BEFORE UPDATE ON contratos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
