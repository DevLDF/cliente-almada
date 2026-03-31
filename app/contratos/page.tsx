import { listarContratosAction } from "@/actions/contratos.actions";
import Link from "next/link";

export default async function ContratosPage() {
  const [contratos, err] = await listarContratosAction();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mis contratos</h1>
        <Link
          href="/contratos/nuevo"
          className="bg-[#0F3A5F] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#1E5A8A] transition-colors"
        >
          + Nuevo contrato
        </Link>
      </div>

      {err && (
        <p className="text-red-500 text-sm">Error al cargar contratos: {err.message}</p>
      )}

      {!err && contratos?.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg mb-2">No hay contratos todavía</p>
          <Link href="/contratos/nuevo" className="text-[#1E5A8A] underline text-sm">
            Crear el primero
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {contratos?.map((c) => (
          <div key={c.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
            <div>
              <p className="font-semibold text-gray-800">{c.nombre}</p>
              <p className="text-sm text-gray-400 capitalize">{c.tipo} · {new Date(c.updated_at).toLocaleDateString("es-AR")}</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href={`/contratos/${c.id}/calendario`}
                className="text-sm text-gray-400 hover:text-gray-600"
              >
                Pagos
              </Link>
              <Link
                href={`/contratos/${c.id}/editar`}
                className="text-sm text-[#1E5A8A] font-medium hover:underline"
              >
                Editar →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
