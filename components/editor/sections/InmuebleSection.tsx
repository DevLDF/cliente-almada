"use client";

import type { ContratoData } from "@/lib/contract-html-generator";
import { SectionCollapse } from "@/components/editor/SectionCollapse";
import { FormField, Input, Textarea } from "@/components/editor/FormField";

interface Props {
  data: ContratoData;
  onUpdate: (d: ContratoData) => void;
  onHighlight: (e: React.FocusEvent<HTMLElement>) => void;
  onScrollTo: (clauseId: string) => void;
  open: boolean;
  onToggle: () => void;
  onActivate: () => void;
}

export function InmuebleSection({ data, onUpdate, onHighlight, onScrollTo, open, onToggle, onActivate }: Props) {
  const { inmueble } = data;

  function setInmueble<K extends keyof typeof inmueble>(field: K, value: typeof inmueble[K]) {
    onUpdate({ ...data, inmueble: { ...inmueble, [field]: value } });
  }

  function setCatastro<K extends keyof NonNullable<typeof inmueble.catastro>>(
    field: K,
    value: string
  ) {
    onUpdate({
      ...data,
      inmueble: {
        ...inmueble,
        catastro: { ...inmueble.catastro, [field]: value },
      },
    });
  }

  function setServicio(field: keyof typeof inmueble.servicios, value: boolean) {
    onUpdate({
      ...data,
      inmueble: {
        ...inmueble,
        servicios: { ...inmueble.servicios, [field]: value },
      },
    });
  }

  function handleFocus(e: React.FocusEvent<HTMLElement>) {
    onActivate();
    onScrollTo("PRIMERA");
    onHighlight(e);
  }

  const badge = inmueble.direccion ? inmueble.direccion.split(",")[0] : undefined;

  return (
    <SectionCollapse title="Inmueble" badge={badge} open={open} onToggle={onToggle}>
      {/* Dirección */}
      <FormField label="Dirección" required>
        <Input
          type="text"
          value={inmueble.direccion}
          onChange={(e) => setInmueble("direccion", e.target.value)}
          onFocus={handleFocus}
          placeholder="Av. San Martín 123"
        />
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Ciudad">
          <Input
            type="text"
            value={inmueble.ciudad ?? "Las Flores"}
            onChange={(e) => setInmueble("ciudad", e.target.value)}
            onFocus={handleFocus}
          />
        </FormField>
        <FormField label="Provincia">
          <Input
            type="text"
            value={inmueble.provincia ?? "Buenos Aires"}
            onChange={(e) => setInmueble("provincia", e.target.value)}
            onFocus={handleFocus}
          />
        </FormField>
      </div>

      {/* Nomenclatura Catastral */}
      <div>
        <p
          className="text-xs font-semibold mb-2"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          Nomenclatura Catastral
        </p>
        <div className="grid grid-cols-2 gap-2">
          <FormField label="Circunscripción">
            <Input
              type="text"
              value={inmueble.catastro?.circunscripcion ?? "I"}
              onChange={(e) => setCatastro("circunscripcion", e.target.value)}
              onFocus={handleFocus}
            />
          </FormField>
          <FormField label="Sección">
            <Input
              type="text"
              value={inmueble.catastro?.seccion ?? ""}
              onChange={(e) => setCatastro("seccion", e.target.value)}
              onFocus={handleFocus}
            />
          </FormField>
          <FormField label="Manzana">
            <Input
              type="text"
              value={inmueble.catastro?.manzana ?? ""}
              onChange={(e) => setCatastro("manzana", e.target.value)}
              onFocus={handleFocus}
            />
          </FormField>
          <FormField label="Parcela">
            <Input
              type="text"
              value={inmueble.catastro?.parcela ?? ""}
              onChange={(e) => setCatastro("parcela", e.target.value)}
              onFocus={handleFocus}
            />
          </FormField>
          <div className="col-span-2">
            <FormField label="Partida Inmobiliaria">
              <Input
                type="text"
                value={inmueble.catastro?.partida ?? ""}
                onChange={(e) => setCatastro("partida", e.target.value)}
                onFocus={handleFocus}
              />
            </FormField>
          </div>
        </div>
      </div>

      {/* Descripción física */}
      <FormField label="Descripción física" hint="Detalles del inmueble (opcional)">
        <Textarea
          value={inmueble.descripcionFisica ?? ""}
          onChange={(e) => setInmueble("descripcionFisica", e.target.value)}
          onFocus={handleFocus}
          rows={3}
          placeholder="Casa de planta baja con jardín..."
        />
      </FormField>

      {/* Muebles */}
      <FormField label="Muebles / artefactos" hint="Si no hay, dejá vacío">
        <Textarea
          value={inmueble.muebles ?? ""}
          onChange={(e) => setInmueble("muebles", e.target.value)}
          onFocus={handleFocus}
          rows={2}
          placeholder="Heladera, cocina, lavarropas..."
        />
      </FormField>

      {/* Destino de uso */}
      <FormField label="Destino de uso">
        <Input
          type="text"
          value={inmueble.destinoUso ?? ""}
          onChange={(e) => setInmueble("destinoUso", e.target.value)}
          onFocus={handleFocus}
        />
      </FormField>

      {/* Servicios */}
      <div>
        <p
          className="text-xs font-semibold mb-2"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          Servicios incluidos
        </p>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              { key: "electricidad", label: "Electricidad", highlight: "Energía Eléctrica" },
              { key: "gas",          label: "Gas",          highlight: "Gas Natural" },
              { key: "agua",         label: "Agua",         highlight: "Agua Corriente" },
              { key: "cloacas",      label: "Cloacas",      highlight: "desagüe cloacal" },
            ] as const
          ).map(({ key, label, highlight }) => (
            <label
              key={key}
              className="flex items-center gap-2 cursor-pointer select-none"
              onFocus={handleFocus}
            >
              <input
                type="checkbox"
                checked={inmueble.servicios[key]}
                onChange={(e) => setServicio(key, e.target.checked)}
                data-highlight={highlight}
                style={{ accentColor: "var(--color-primary)", width: "14px", height: "14px" }}
              />
              <span
                className="text-xs"
                style={{ color: "var(--color-on-background)" }}
              >
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </SectionCollapse>
  );
}
