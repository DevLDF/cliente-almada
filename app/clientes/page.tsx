import {
  listarLocadoresAction,
  listarLocatariosAction,
} from "@/actions/clientes.actions";
import DirectorioClientes from "@/components/clientes/DirectorioClientes";

export default async function ClientesPage() {
  const [[propietarios], [inquilinos]] = await Promise.all([
    listarLocadoresAction(),
    listarLocatariosAction(),
  ]);

  return (
    <DirectorioClientes
      propietarios={propietarios ?? []}
      inquilinos={inquilinos ?? []}
    />
  );
}
