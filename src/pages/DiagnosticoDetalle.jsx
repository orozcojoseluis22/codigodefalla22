import React, { useState, useEffect } from "react";
import { Diagnostico } from "@/api/entities";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Car, Calendar, Star, ShieldCheck, AlertTriangle, FileText, Wrench, ClipboardList, BookOpen, ListOrdered, ShoppingCart, CheckCircle, Phone, Award } from "lucide-react";

const urgenciaColors = { "Bajo": "bg-green-100 text-green-800", "Medio": "bg-yellow-100 text-yellow-800", "Alto": "bg-red-100 text-red-800" };

export default function DiagnosticoDetallePage() {
  const [diagnostico, setDiagnostico] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiagnostico = async () => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      if (id) {
        try {
          const data = await Diagnostico.get(id);
          setDiagnostico(data);
        } catch (err) { setError("No se pudo cargar el diagnóstico."); console.error(err); }
      } else { setError("ID de diagnóstico no encontrado."); }
      setLoading(false);
    };
    fetchDiagnostico();
  }, []);

  const handleRetroalimentacion = () => {
    // This function will trigger a re-fetch of the data to show updated state
    const fetchAgain = async () => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      const data = await Diagnostico.get(id);
      setDiagnostico(data);
    };
    fetchAgain();
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="w-12 h-12 animate-spin text-[#003366]" /></div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!diagnostico) return <div className="text-center py-10">No se encontró el diagnóstico.</div>;

  const analisis = diagnostico.analisis_completo ? JSON.parse(diagnostico.analisis_completo) : null;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-3 text-2xl text-[#003366]"><Car className="w-7 h-7" /> {diagnostico.marca} {diagnostico.modelo} {diagnostico.ano}</CardTitle>
              <div className="flex items-center gap-2 mt-2 text-gray-600"><Calendar className="w-4 h-4" />{new Date(diagnostico.created_date).toLocaleString('es-MX')}</div>
            </div>
            {analisis?.urgencia && <Badge className={`${urgenciaColors[analisis.urgencia]} text-sm px-3 py-1`}>Urgencia: {analisis.urgencia}</Badge>}
          </div>
        </CardHeader>
        <CardContent>
            <p><strong>Código de Falla:</strong> {diagnostico.codigo_falla || "N/A"}</p>
            <p><strong>Descripción:</strong> {diagnostico.descripcion_falla || "N/A"}</p>
            <p><strong>VIN:</strong> {diagnostico.vin || "N/A"}</p>
            <p><strong>Kilometraje:</strong> {diagnostico.kilometraje || "N/A"}</p>
        </CardContent>
      </Card>
      
      {analisis ? (
        <div className="space-y-8">
            <AnalisisSection title="Carta de Diagnóstico" icon={<FileText />} content={<p>{analisis.carta_diagnostico}</p>} />
            <AnalisisSection title="Definición del Código" icon={<BookOpen />} content={<p>{analisis.definicion_codigo}</p>} />
            <AnalisisSection title="Fallas Comunes (Síntomas)" icon={<AlertTriangle />} content={<List items={analisis.fallas_comunes} />} />
            <AnalisisSection title="Posibles Fallas del Vehículo y Solución" icon={<Wrench />} content={<FallasSoluciones items={analisis.posibles_fallas_vehiculo} />} />
            <AnalisisSection title="Pruebas Recomendadas" icon={<ClipboardList />} content={<List items={analisis.pruebas_recomendadas} />} />
            <AnalisisSection title="Procedimiento de Diagnóstico" icon={<ListOrdered />} content={<List items={analisis.procedimiento_diagnostico} />} />
            <AnalisisSection title="Diagnóstico Detallado Profesional" icon={<BookOpen />} content={<div>{analisis.diagnostico_detallado.split('\n\n').map((p, i) => <p key={i} className="mb-4">{p}</p>)}</div>} />
            <AnalisisSection title="Guía de Reparación Paso a Paso" icon={<Wrench />} content={<List items={analisis.guia_paso_a_paso} />} />
            <AnalisisSection title="Refacciones Sugeridas" icon={<ShoppingCart />} content={<Repuestos items={analisis.repuestos_sugeridos} />} />
        </div>
      ) : <p>No hay datos de análisis para mostrar.</p>}

      {!diagnostico.retroalimentacion_proporcionada ? (
        <RetroalimentacionSection diagnostico={diagnostico} onRetroalimentacion={handleRetroalimentacion} />
      ) : (
        <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6 text-center">
                <p className="font-semibold text-green-800">✓ ¡Gracias! Ya proporcionaste retroalimentación para este diagnóstico y ganaste {diagnostico.puntos_otorgados} puntos.</p>
                <p className="text-green-700 mt-2"><strong>Solución confirmada:</strong> {diagnostico.falla_confirmada}</p>
            </CardContent>
        </Card>
      )}

       <Card className="bg-gradient-to-r from-blue-50 to-orange-50 p-6 rounded-lg text-center border border-gray-200">
         <h3 className="text-xl font-bold text-[#003366] mb-2">¿Necesitas Asesoría Personalizada?</h3>
         <p className="text-gray-700 mb-4">Para casos complejos o dudas, puedes solicitar una consulta directa.</p>
         <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-md">
            <Phone className="w-6 h-6 text-[#003366]"/>
            <div className="text-left">
                <p className="text-sm text-gray-600">Asesorías por Jose Luis Orozco</p>
                <p className="text-lg font-bold text-gray-900 tracking-wider">+52 55 5217 3484</p>
            </div>
         </div>
       </Card>
    </div>
  );
}

function RetroalimentacionSection({ diagnostico, onRetroalimentacion }) {
    const [mostrar, setMostrar] = useState(false);
    const [otraFallaTexto, setOtraFallaTexto] = useState("");
    const [mostrarOtraFallaInput, setMostrarOtraFallaInput] = useState(false);
    const analisis = diagnostico.analisis_completo ? JSON.parse(diagnostico.analisis_completo) : null;

    const proporcionarRetroalimentacion = async (fallaConfirmada) => {
        if (!fallaConfirmada?.trim()) { alert("Por favor, especifica la falla."); return; }
        try {
            const puntosGanados = 50;
            const user = await User.me();
            const nuevosPuntos = (user.puntos_acumulados || 0) + puntosGanados;
            let nuevoStatus = user.status_titulo || 'Principiante';
            if (nuevosPuntos >= 10000) nuevoStatus = 'Profesional Experto';
            else if (nuevosPuntos >= 1000) nuevoStatus = 'Experto';

            await Diagnostico.update(diagnostico.id, { falla_confirmada: fallaConfirmada, retroalimentacion_proporcionada: true, puntos_otorgados: puntosGanados, reparacion_completada: true });
            await User.updateMyUserData({ puntos_acumulados: nuevosPuntos, status_titulo: nuevoStatus });
            
            alert(`¡Gracias por tu retroalimentación! Has ganado ${puntosGanados} puntos.`);
            onRetroalimentacion();
        } catch (error) { console.error(error); alert("Error al guardar retroalimentación."); }
    };

    return (
        <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Award />Proporcionar Retroalimentación y Ganar Puntos</CardTitle></CardHeader>
            <CardContent>
                <p className="text-gray-700 mb-4">Una vez reparado el auto, ¿cuál fue la solución correcta? Tu aporte mejora la app para todos y te otorga <strong>50 puntos</strong>. Con suficientes puntos, puedes obtener desde <strong>1 mes gratis hasta 1 anualidad</strong>.</p>
                {!mostrar ? <Button onClick={() => setMostrar(true)} className="w-full">Proporcionar Retroalimentación</Button> :
                <div className="space-y-2">
                    <p className="font-semibold">Selecciona la solución que aplicaste:</p>
                    {analisis?.posibles_fallas_vehiculo?.map((falla, i) => (
                        <Button key={i} onClick={() => proporcionarRetroalimentacion(falla.solucion_recomendada)} variant="outline" className="w-full justify-start text-left">{falla.solucion_recomendada}</Button>
                    ))}
                    <Button onClick={() => setMostrarOtraFallaInput(true)} variant="outline" className="w-full justify-start text-left bg-blue-50 border-blue-200">Otra solución (especificar)</Button>
                    {mostrarOtraFallaInput && (
                        <div className="pt-2 space-y-2">
                            <Textarea placeholder="Describe la solución que realmente funcionó..." value={otraFallaTexto} onChange={(e) => setOtraFallaTexto(e.target.value)} />
                            <Button onClick={() => proporcionarRetroalimentacion(otraFallaTexto)} className="w-full">Enviar Solución Especificada</Button>
                        </div>
                    )}
                </div>}
            </CardContent>
        </Card>
    );
}

// Helper components for rendering sections
const AnalisisSection = ({ icon, title, content }) => <Card><CardHeader><CardTitle className="flex items-center gap-3 text-xl text-[#003366]">{icon}{title}</CardTitle></CardHeader><CardContent>{content}</CardContent></Card>;
const List = ({ items }) => <ul className="list-disc pl-5 space-y-2">{items?.map((item, i) => <li key={i}>{item}</li>)}</ul>;
const FallasSoluciones = ({ items }) => <div className="space-y-4">{items?.map((item, i) => <div key={i} className="p-3 bg-gray-50 rounded-md"><strong>{item.componente}:</strong> {item.solucion_recomendada}</div>)}</div>;
const Repuestos = ({ items }) => <div className="space-y-4">{items?.map((item, i) => <Card key={i} className="p-4"><h5 className="font-bold">{item.nombre}</h5><p>{item.descripcion}</p><a href={item.enlaces.amazon} target="_blank" rel="noopener noreferrer"><Button className="mt-2 w-full bg-[#ff6600] hover:bg-[#e65c00]"><CheckCircle className="mr-2"/>Ver en Amazon México</Button></a></Card>)}</div>;