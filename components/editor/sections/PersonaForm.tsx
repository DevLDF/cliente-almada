"use client";

import type { Persona } from "@/types/contrato";
import { FormField, Input } from "@/components/editor/FormField";

interface Props {
  persona: Persona;
  onUpdate: (updated: Persona) => void;
  onHighlight: (e: React.FocusEvent<HTMLElement>) => void;
  onActivate: () => void;
  showOptional?: boolean;
}

export function PersonaForm({ persona, onUpdate, onHighlight, onActivate, showOptional = true }: Props) {
  function set<K extends keyof Persona>(field: K, value: Persona[K]) {
    onUpdate({ ...persona, [field]: value });
  }

  const handleFocus = (e: React.FocusEvent<HTMLElement>) => {
    onActivate();
    onHighlight(e);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <FormField label="Nombre completo" required>
            <Input
              type="text"
              value={persona.nombre}
              onChange={(e) => set("nombre", e.target.value)}
              onFocus={handleFocus}
              placeholder="Ej: Juan Carlos García"
            />
          </FormField>
        </div>
        <FormField label="DNI" required>
          <Input
            type="text"
            value={persona.dni}
            onChange={(e) => set("dni", e.target.value)}
            onFocus={handleFocus}
            placeholder="12345678"
          />
        </FormField>
        {showOptional && (
          <FormField label="CUIT/CUIL">
            <Input
              type="text"
              value={persona.cuit ?? ""}
              onChange={(e) => set("cuit", e.target.value)}
              onFocus={handleFocus}
              placeholder="20-12345678-9"
            />
          </FormField>
        )}
      </div>

      {showOptional && (
        <>
          <FormField label="Fecha de nacimiento">
            <Input
              type="date"
              value={persona.nacimiento ?? ""}
              onChange={(e) => set("nacimiento", e.target.value)}
              onFocus={handleFocus}
            />
          </FormField>
          <FormField label="Domicilio real">
            <Input
              type="text"
              value={persona.domicilio ?? ""}
              onChange={(e) => set("domicilio", e.target.value)}
              onFocus={handleFocus}
              placeholder="Calle 123"
            />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Ciudad">
              <Input
                type="text"
                value={persona.ciudad ?? "Las Flores"}
                onChange={(e) => set("ciudad", e.target.value)}
                onFocus={handleFocus}
              />
            </FormField>
            <FormField label="Provincia">
              <Input
                type="text"
                value={persona.provincia ?? "Buenos Aires"}
                onChange={(e) => set("provincia", e.target.value)}
                onFocus={handleFocus}
              />
            </FormField>
          </div>
          <FormField label="Teléfono">
            <Input
              type="text"
              value={persona.telefono ?? ""}
              onChange={(e) => set("telefono", e.target.value)}
              onFocus={handleFocus}
              placeholder="+54 9 11 1234-5678"
            />
          </FormField>
        </>
      )}
    </div>
  );
}
