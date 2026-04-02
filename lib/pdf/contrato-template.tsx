import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { Contrato } from "@/types/contrato";
import {
  numeroAPalabras,
  formatMontoPDF,
  fechaLarga,
  calcularFechaFin,
  descripcionAjuste,
  duracionEnPalabras,
  diaEnPalabras,
} from "./helpers";

// ── Estilos ───────────────────────────────────────────────────

const styles = StyleSheet.create({
  page: {
    fontFamily: "Times-Roman",
    fontSize: 10,
    paddingTop: 48,
    paddingBottom: 56,
    paddingHorizontal: 56,
    lineHeight: 1.5,
    color: "#1a1a1a",
  },
  header: {
    textAlign: "center",
    marginBottom: 16,
  },
  titulo: {
    fontSize: 13,
    fontFamily: "Times-Bold",
    textAlign: "center",
    letterSpacing: 1,
    marginBottom: 14,
    textTransform: "uppercase",
  },
  intro: {
    marginBottom: 10,
    textAlign: "justify",
  },
  clausulaTitulo: {
    fontFamily: "Times-Bold",
    marginTop: 10,
    marginBottom: 3,
  },
  parrafo: {
    textAlign: "justify",
    marginBottom: 6,
  },
  separador: {
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    borderBottomStyle: "solid",
    marginVertical: 8,
  },
  firmasContainer: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 20,
  },
  firmaBloque: {
    width: "45%",
    marginTop: 20,
  },
  firmaLinea: {
    borderTopWidth: 1,
    borderTopColor: "#333333",
    borderTopStyle: "solid",
    marginBottom: 4,
    marginTop: 30,
  },
  firmaNombre: {
    fontSize: 9,
    textAlign: "center",
  },
  firmaDni: {
    fontSize: 9,
    textAlign: "center",
    color: "#555555",
  },
  pageNumber: {
    position: "absolute",
    bottom: 24,
    right: 56,
    fontSize: 8,
    color: "#888888",
  },
});

// ── Props ─────────────────────────────────────────────────────

interface Props {
  contrato: Contrato & { id: string; nombre: string; tipo: string };
}

// ── Documento ─────────────────────────────────────────────────

export function ContratoTemplate({ contrato }: Props) {
  const {
    tipo,
    locador,
    locatarios,
    inmueble,
    condiciones,
    garantes,
    opcionales,
  } = contrato;

  const esVivienda = tipo === "vivienda";
  const esGalpon = tipo === "galpon";

  const fechaFin = condiciones.fechaInicio
    ? calcularFechaFin(condiciones.fechaInicio, condiciones.duracionMeses)
    : "";

  const lugarPago = condiciones.lugarPago?.trim()
    ? condiciones.lugarPago
    : "Almada & Cía. Avda. San Martín 349 esquina Sordeaux, Las Flores, Provincia de Buenos Aires";

  // Texto de locatarios para intro
  const locatariosTexto = locatarios
    .map((l) => {
      const partes = [`${l.nombre} argentino/a`];
      if (l.dni) partes.push(`con Documento Nacional de Identidad N° ${l.dni}`);
      if (l.cuit) partes.push(`CUIT/CUIL N° ${l.cuit}`);
      if (l.nacimiento) partes.push(`nacido/a el ${l.nacimiento}`);
      if (l.domicilio) partes.push(`con domicilio real en ${l.domicilio}, ${l.ciudad}, ${l.provincia}`);
      return partes.join(", ");
    })
    .join("; y ");

  // Texto instalaciones según tipo
  const instalaciones = [
    inmueble.servicios.electricidad && "energía eléctrica",
    inmueble.servicios.gas && "gas natural",
    inmueble.servicios.agua && "agua corriente",
    inmueble.servicios.cloacas && "desagüe cloacal",
  ]
    .filter(Boolean)
    .join(", ");

  // Número de cláusula siguiente (después de octavo/noveno opcionales)
  let clausulaActual = 8;

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Título */}
        <Text style={styles.titulo}>
          {esVivienda
            ? "CONTRATO DE LOCACIÓN DE VIVIENDA"
            : esGalpon
            ? "CONTRATO DE LOCACIÓN"
            : "CONTRATO DE LOCACIÓN"}
        </Text>

        {/* Introducción — partes */}
        <Text style={styles.intro}>
          Entre{" "}
          <Text style={{ fontFamily: "Times-Bold" }}>{locador.nombre.toUpperCase()}</Text>
          {locador.dni ? `, argentino/a, con Documento Nacional de Identidad N° ${locador.dni}` : ""}
          {locador.cuit ? `, CUIT/CUIL N° ${locador.cuit}` : ""}
          {locador.nacimiento ? `, nacido/a el ${locador.nacimiento}` : ""}
          {locador.domicilio ? `, con domicilio real en ${locador.domicilio}, ${locador.ciudad}, ${locador.provincia}` : ""}
          {", en lo sucesivo la parte LOCADORA; y por la otra "}
          <Text style={{ fontFamily: "Times-Bold" }}>
            {locatarios.map((l) => l.nombre.toUpperCase()).join(" y ")}
          </Text>
          {`, ${locatariosTexto.split(locatarios.map((l) => l.nombre.toUpperCase()).join(" y "))[1] ?? ""}`}
          {", en adelante denominada/s la parte LOCATARIA, todos hábiles para contratar, convienen celebrar el presente Contrato de Locación, sujeto a las siguientes cláusulas y/o condiciones."}
        </Text>

        <View style={styles.separador} />

        {/* PRIMERO — OBJETO */}
        <Text style={styles.clausulaTitulo}>PRIMERO – OBJETO:</Text>
        <Text style={styles.parrafo}>
          {"La parte LOCADORA cede en locación a la parte LOCATARIA, y esta acepta de plena conformidad, "}
          {esVivienda ? "el INMUEBLE DE USO HABITACIONAL" : esGalpon ? "el INMUEBLE" : "el INMUEBLE DE USO COMERCIAL"}
          {` situado en ${inmueble.direccion}, ${inmueble.ciudad}, Provincia de ${inmueble.provincia}.`}
        </Text>

        {/* Catastro */}
        {(inmueble.catastro?.circunscripcion || inmueble.catastro?.seccion) && (
          <Text style={styles.parrafo}>
            {"Nomenclatura Catastral: "}
            {inmueble.catastro.circunscripcion ? `Circunscripción ${inmueble.catastro.circunscripcion}` : ""}
            {inmueble.catastro.seccion ? `; Sección ${inmueble.catastro.seccion}` : ""}
            {inmueble.catastro.manzana ? `; Manzana ${inmueble.catastro.manzana}` : ""}
            {inmueble.catastro.parcela ? `; Parcela ${inmueble.catastro.parcela}` : ""}
            {inmueble.catastro.partida ? `; Partida Inmobiliaria ${inmueble.catastro.partida}` : ""}
            {"."}
          </Text>
        )}

        {/* Descripción física */}
        {inmueble.descripcionFisica && (
          <Text style={styles.parrafo}>{inmueble.descripcionFisica}</Text>
        )}

        {/* Muebles */}
        {inmueble.muebles && (
          <Text style={styles.parrafo}>
            {"Forman parte de la presente locación los siguientes muebles, artefactos y efectos: "}
            {inmueble.muebles}
            {", todo en perfecto estado de uso."}
          </Text>
        )}

        {/* Instalaciones */}
        {instalaciones && (
          <Text style={styles.parrafo}>
            {"Instalaciones: el inmueble cuenta con "}
            {instalaciones}
            {", de acuerdo a las reglamentaciones vigentes."}
          </Text>
        )}

        <View style={styles.separador} />

        {/* SEGUNDO — PLAZO */}
        <Text style={styles.clausulaTitulo}>SEGUNDO – PLAZO:</Text>
        <Text style={styles.parrafo}>
          {"El término de duración del presente contrato se ha estipulado en "}
          {duracionEnPalabras(condiciones.duracionMeses)}
          {" meses"}
          {condiciones.fechaInicio
            ? `, a contar del día ${fechaLarga(condiciones.fechaInicio)}, siendo su vencimiento impostergable el día ${fechaLarga(fechaFin)}.`
            : "."}
        </Text>

        <View style={styles.separador} />

        {/* TERCERO — IMPORTE */}
        <Text style={styles.clausulaTitulo}>TERCERO – IMPORTE DEL ALQUILER:</Text>
        <Text style={styles.parrafo}>
          {"Las partes convienen un alquiler mensual INICIAL en la suma de PESOS "}
          {numeroAPalabras(condiciones.montoInicial)}
          {` ($ ${formatMontoPDF(condiciones.montoInicial)}.-)`}
          {`, para los primeros ${
            condiciones.ajuste.tipo === "trimestral"
              ? "tres (3)"
              : condiciones.ajuste.tipo === "semestral"
              ? "seis (6)"
              : condiciones.ajuste.tipo === "cuatrimestral"
              ? "cuatro (4)"
              : "uno (1)"
          } meses del presente contrato; para los siguientes períodos y hasta su finalización, dicho importe se actualizará `}
          {descripcionAjuste(condiciones.ajuste)}
          {". Para el caso de que dicho coeficiente no se encuentre disponible al momento del recálculo, se aplicará el del mes inmediato anterior y luego se actualizará con el próximo vencimiento."}
          {tipo === "comercial"
            ? " El precio es libre de impuestos, contemplándose que deberá sumársele el IVA en caso de corresponder."
            : ""}
        </Text>

        <View style={styles.separador} />

        {/* CUARTO — EXPENSAS/SERVICIOS */}
        <Text style={styles.clausulaTitulo}>CUARTO – EXPENSAS, SERVICIOS Y TASAS:</Text>
        <Text style={styles.parrafo}>
          {"Se establece el siguiente acuerdo respecto al pago de servicios:"}
          {inmueble.servicios.electricidad
            ? " Energía Eléctrica: a cargo del 100% de la LOCATARIA. "
            : ""}
          {inmueble.servicios.agua
            ? " Agua Corriente y Cloaca: a cargo del 100% de la LOCATARIA. "
            : ""}
          {inmueble.servicios.gas && !esGalpon
            ? " Gas Natural: a cargo del 100% de la LOCATARIA. "
            : ""}
          {`Tasa Municipal (Alumbrado, Barrido y Limpieza): a cargo de ${
            condiciones.tasaMunicipal === "locatario" ? "la LOCATARIA" : "el LOCADOR"
          }. `}
          {`Impuesto Inmobiliario: a cargo de ${
            condiciones.impuestoInmobiliario === "locador" ? "el LOCADOR" : "la LOCATARIA"
          }. `}
          {"Todas las facturas originales, una vez abonadas, serán entregadas a la parte LOCADORA."}
        </Text>

        <View style={styles.separador} />

        {/* QUINTO — PERÍODO Y LUGAR DE PAGO */}
        <Text style={styles.clausulaTitulo}>QUINTO – PERÍODO Y LUGAR DE PAGO:</Text>
        <Text style={styles.parrafo}>
          {"Las partes pactan de pleno y común acuerdo que el pago del alquiler deberá ser efectuado por adelantado del uno (1) al "}
          {diaEnPalabras(condiciones.pagoDia)}
          {" de cada mes en el domicilio designado: "}
          {lugarPago}
          {"."}
        </Text>

        <View style={styles.separador} />

        {/* SEXTO — DESOCUPACIÓN */}
        <Text style={styles.clausulaTitulo}>SEXTO – DESOCUPACIÓN:</Text>
        <Text style={styles.parrafo}>
          {"Al término del contrato la parte LOCATARIA desocupará el inmueble y lo entregará a entera satisfacción de la parte LOCADORA, debiendo entregarlo en buen estado y limpio. Caso contrario, a partir del inmediato vencimiento del presente, deberá abonar además del importe equivalente al último mes de contrato que corresponda, una multa diaria equivalente al cincuenta por ciento (50%) del mencionado importe y hasta la entrega del inmueble a la parte LOCADORA. Esta suma será abonada en concepto de cláusula penal indemnizatoria."}
        </Text>

        <View style={styles.separador} />

        {/* SÉPTIMO — CONSERVACIÓN */}
        <Text style={styles.clausulaTitulo}>SÉPTIMO – CONSERVACIÓN DEL INMUEBLE:</Text>
        <Text style={styles.parrafo}>
          {"La parte LOCATARIA recibirá el inmueble en el estado que se encuentra y se obliga a conservarlo y restituirlo en el mismo estado, salvo el deterioro producido por el uso normal, siendo responsable de todo daño que por su culpa o negligencia sufriera el inmueble. Queda obligada a realizar todas las reparaciones locativas que sean necesarias durante la vigencia del contrato. Al momento de la devolución deberá entregarlo pintado en tonos claros."}
        </Text>

        {/* OCTAVO — INMUEBLE EN VENTA (condicional) */}
        {opcionales?.inmuebleEnVenta && (
          <>
            <View style={styles.separador} />
            <Text style={styles.clausulaTitulo}>{`${nombreClausula(clausulaActual++)} – INMUEBLE EN VENTA:`}</Text>
            <Text style={styles.parrafo}>
              {"La parte LOCATARIA manifiesta tener conocimiento que el inmueble objeto del presente contrato se encuentra a la venta; situación que acepta, y en caso de producirse la misma, se obliga a entregar el inmueble totalmente desocupado a la parte LOCADORA dentro de los ciento ochenta (180) días de recibir la notificación correspondiente."}
            </Text>
          </>
        )}

        {/* CLÁUSULA ESPECIAL (condicional) */}
        {opcionales?.clausulaEspecial?.trim() && (
          <>
            <View style={styles.separador} />
            <Text style={styles.clausulaTitulo}>{`${nombreClausula(clausulaActual++)} – CLÁUSULA ESPECIAL:`}</Text>
            <Text style={styles.parrafo}>{opcionales.clausulaEspecial}</Text>
          </>
        )}

        {/* GARANTES (condicional) */}
        {garantes && garantes.length > 0 && (
          <>
            <View style={styles.separador} />
            <Text style={styles.clausulaTitulo}>{`${nombreClausula(clausulaActual++)} – FIANZA:`}</Text>
            {garantes.map((g, i) => (
              <Text key={i} style={styles.parrafo}>
                {`${g.nombre.toUpperCase()}`}
                {g.dni ? `, DNI N° ${g.dni}` : ""}
                {g.cuit ? `, CUIT/CUIL ${g.cuit}` : ""}
                {g.domicilio ? `, con domicilio en ${g.domicilio}, ${g.ciudad}` : ""}
                {g.relacion ? ` (${g.relacion})` : ""}
                {", en carácter de fiador solidario, liso, llano y principal pagador, renunciando expresamente a los beneficios de excusión y división, garantiza el fiel cumplimiento de todas las obligaciones emergentes del presente contrato por parte de la LOCATARIA."}
              </Text>
            ))}
          </>
        )}

        <View style={styles.separador} />

        {/* En prueba de conformidad */}
        <Text style={styles.parrafo}>
          {"En prueba de conformidad, las partes firman el presente contrato en "}
          {garantes && garantes.length > 0 ? "tres (3)" : "dos (2)"}
          {" ejemplares de un mismo tenor y a un solo efecto, en la ciudad de Las Flores, Provincia de Buenos Aires."}
          {condiciones.fechaInicio ? ` Fecha: ${fechaLarga(condiciones.fechaInicio)}.` : ""}
        </Text>

        {/* Bloques de firma */}
        <View style={styles.firmasContainer}>
          {/* Locador */}
          <View style={styles.firmaBloque}>
            <View style={styles.firmaLinea} />
            <Text style={styles.firmaNombre}>{locador.nombre.toUpperCase()}</Text>
            {locador.dni && <Text style={styles.firmaDni}>DNI N° {locador.dni}</Text>}
            <Text style={styles.firmaDni}>LOCADOR/A</Text>
          </View>

          {/* Locatarios */}
          {locatarios.map((l, i) => (
            <View key={i} style={styles.firmaBloque}>
              <View style={styles.firmaLinea} />
              <Text style={styles.firmaNombre}>{l.nombre.toUpperCase()}</Text>
              {l.dni && <Text style={styles.firmaDni}>DNI N° {l.dni}</Text>}
              <Text style={styles.firmaDni}>LOCATARIO/A</Text>
            </View>
          ))}

          {/* Garantes */}
          {garantes?.map((g, i) => (
            <View key={i} style={styles.firmaBloque}>
              <View style={styles.firmaLinea} />
              <Text style={styles.firmaNombre}>{g.nombre.toUpperCase()}</Text>
              {g.dni && <Text style={styles.firmaDni}>DNI N° {g.dni}</Text>}
              <Text style={styles.firmaDni}>FIADOR/A SOLIDARIO/A</Text>
            </View>
          ))}

          {/* Almada & Cía */}
          <View style={styles.firmaBloque}>
            <View style={styles.firmaLinea} />
            <Text style={styles.firmaNombre}>ALMADA & CÍA.</Text>
            <Text style={styles.firmaDni}>Avda. San Martín 349, Las Flores</Text>
            <Text style={styles.firmaDni}>INMOBILIARIA</Text>
          </View>
        </View>

        {/* Número de página */}
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );
}

// Helper para nombre de cláusula ordinal
function nombreClausula(n: number): string {
  const nombres = ["", "PRIMERO", "SEGUNDO", "TERCERO", "CUARTO", "QUINTO",
    "SEXTO", "SÉPTIMO", "OCTAVO", "NOVENO", "DÉCIMO", "UNDÉCIMO", "DUODÉCIMO"];
  return nombres[n] ?? `${n}°`;
}
