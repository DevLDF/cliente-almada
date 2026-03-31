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

-- Índice GIN para búsqueda dentro del JSONB de contratos
CREATE INDEX IF NOT EXISTS contratos_data_gin_idx ON contratos USING GIN (data);

-- ─────────────────────────────────────────────────────────────────────────────
-- Tabla de calendario de pagos
-- Generada automáticamente al crear/actualizar un contrato
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS pagos_calendario (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contrato_id       UUID REFERENCES contratos(id) ON DELETE CASCADE NOT NULL,
  user_id           UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  numero_cuota      INT NOT NULL,
  fecha_vencimiento DATE NOT NULL,
  monto_calculado   NUMERIC(12, 2) NOT NULL,
  estado            TEXT NOT NULL DEFAULT 'pendiente'
                      CHECK (estado IN ('pendiente', 'pagado', 'vencido')),
  fecha_pago        DATE,
  notas             TEXT NOT NULL DEFAULT '',
  created_at        TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at        TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Row Level Security
ALTER TABLE pagos_calendario ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios gestionan sus propios pagos"
ON pagos_calendario FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Índices
CREATE INDEX IF NOT EXISTS pagos_contrato_id_idx       ON pagos_calendario (contrato_id);
CREATE INDEX IF NOT EXISTS pagos_user_id_idx            ON pagos_calendario (user_id);
CREATE INDEX IF NOT EXISTS pagos_fecha_vencimiento_idx  ON pagos_calendario (fecha_vencimiento);
CREATE INDEX IF NOT EXISTS pagos_estado_idx             ON pagos_calendario (estado);

-- Trigger updated_at
CREATE OR REPLACE TRIGGER pagos_calendario_updated_at
  BEFORE UPDATE ON pagos_calendario
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
