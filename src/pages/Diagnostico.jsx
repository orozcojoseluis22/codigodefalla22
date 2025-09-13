
import React, { useState } from "react";
import { InvokeLLM, UploadFile } from "@/api/integrations";
import { Diagnostico } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Loader2, Search, Upload, History, Terminal } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import CodigoAnalisis from "../components/diagnostico/CodigoAnalisis";

export default function DiagnosticoPage() {
  const [codigoFalla, setCodigoFalla] = useState("");
  const [descripcionFalla, setDescripcionFalla] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [ano, setAno] = useState("");
  const [motor, setMotor] = useState("");
  const [vin, setVin] = useState("");
  const [kilometraje, setKilometraje] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [codigosDetectados, setCodigosDetectados] = useState([]);
  const [analizando, setAnalizando] = useState(false);
  const [tipoAnalisis, setTipoAnalisis] = useState(""); // 'breve' o 'extenso'

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        alert('Por favor selecciona un archivo de video válido.');
        return;
      }
      if (file.size > 100 * 1024 * 1024) {
        alert('El video es demasiado grande. Máximo 100MB permitido.');
        return;
      }
      setVideoFile(file);
    }
  };

  const analizarCodigo = async (codigo, descripcionAdicional = "", datosVehiculo = {}, videoUrl = "", tipo) => {
    try {
      const vehiculoInfo = `
        Vehículo: ${datosVehiculo.marca || 'No especificado'} ${datosVehiculo.modelo || 'No especificado'}
        Año: ${datosVehiculo.ano || 'No especificado'}
        Motor: ${datosVehiculo.motor || 'No especificado'}
        VIN: ${datosVehiculo.vin || 'No especificado'}
        Kilometraje: ${datosVehiculo.kilometraje || 'No especificado'}
      `;

      const basePrompt = `
        Contexto: Soy Profesor de Electronica y Electricidad Automotriz para mecánicos y estudiantes principalmente en Mexico y pocos en Latinoamérica, aunque igual mecanicos que no saben de electronica / electricidad tambien les enseño desde cero.

        Formato de salida: Quiero que siempre uses un tono formal y profesional, pero didáctico, de manera que los conceptos técnicos sean claros y fáciles de entender.

        Alcance de mis temas: trabajo principalmente con vehículos de combustión interna convencionales, aunque empiezo a buscar información de híbridos y en menor medida de eléctricos. 

        Formato y estilo de las respuestas que espero:
        - Explicaciones técnicas con ejemplos prácticos aplicados a vehículos reales.
        - Lenguaje claro en español, con términos automotrices correctos.
        - Estructura organizada: Carta de diagnostico → definición de codigo de falla → fallas comunes (síntomas observables) → posibles fallas del vehículo (piezas o sistemas) → pruebas recomendadas → procedimiento de diagnostico detallado.
        - Nivel de detalle ajustado: accesible para estudiantes, pero con suficiente profundidad para mecánicos en formación.

        ${codigo ? `Código de falla OBD-II: ${codigo}` : ''}
        
        Información del vehículo:
        ${vehiculoInfo}
        
        Descripción de la falla (proporcionada por el mecánico):
        "${descripcionAdicional || 'No se proporcionó descripción adicional.'}"
        
        ${videoUrl ? `Se ha proporcionado un video que muestra la falla: ${videoUrl}` : ''}
        
        Proporciona tu análisis en formato JSON siguiendo la estructura de carta de diagnóstico.
      `;

      const jsonSchema = {
          type: "object",
          properties: {
            carta_diagnostico: { type: "string" },
            definicion_codigo: { type: "string" },
            fallas_comunes: { type: "array", items: { type: "string" } },
            posibles_fallas_vehiculo: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  componente: { type: "string" },
                  solucion_recomendada: { type: "string" },
                }
              }
            },
            pruebas_recomendadas: { type: "array", items: { type: "string" } },
            procedimiento_diagnostico: { type: "array", items: { type: "string" } },
            diagnostico_detallado: { type: "string" },
            guia_paso_a_paso: { type: "array", items: { type: "string" } },
            urgencia: { type: "string", enum: ["Bajo", "Medio", "Alto"] },
            repuestos_sugeridos: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  nombre: { type: "string" },
                  descripcion: { type: "string" },
                  termino_busqueda: { type: "string" }
                }
              }
            }
          }
        };

      // Llamada única al LLM para evitar problemas de timeout
      const response = await InvokeLLM({ 
        prompt: basePrompt, 
        response_json_schema: jsonSchema 
      });

      // Añadir enlaces de Amazon a los repuestos
      if (response.repuestos_sugeridos && response.repuestos_sugeridos.length > 0) {
        response.repuestos_sugeridos = response.repuestos_sugeridos.map(repuesto => ({
          ...repuesto,
          enlaces: {
            amazon: `https://www.amazon.com.mx/s?k=${encodeURIComponent(repuesto.termino_busqueda || repuesto.nombre)}&tag=the-vegan-pear-20`
          }
        }));
      }

      return response;
    } catch (error) {
      console.error("Error analizando código:", error);
      throw error; // Re-lanzar el error para que sea manejado por handleStartAnalysis
    }
  };

  const handleStartAnalysis = async (tipo) => {
    if (!codigoFalla.trim() && !descripcionFalla.trim()) {
      alert('Por favor ingresa al menos el código de falla O la descripción de la falla.');
      return;
    }
    if (analizando) return;
    
    setAnalizando(true);
    setTipoAnalisis(tipo);
    setCodigosDetectados([]); // Limpiar resultados anteriores al iniciar un nuevo análisis
    
    try {
      let videoUrl = "";
      if (videoFile) {
        setUploadingVideo(true);
        try {
          const { file_url } = await UploadFile({ file: videoFile });
          videoUrl = file_url;
        } catch (error) {
          console.error("Error subiendo video:", error);
          alert("Error subiendo el video. Continuando sin video.");
        } finally {
          setUploadingVideo(false);
        }
      }

      const datosVehiculo = { marca, modelo, ano, motor, vin, kilometraje };
      const analisis = await analizarCodigo(codigoFalla, descripcionFalla, datosVehiculo, videoUrl, tipo);
      
      if (analisis) {
        const diagnosticoGuardado = await Diagnostico.create({
          codigo_falla: codigoFalla,
          descripcion_falla: descripcionFalla,
          marca, modelo, ano, motor, vin, kilometraje,
          video_url: videoUrl,
          analisis_completo: JSON.stringify(analisis)
        });

        // Solo mostrar el resultado más reciente
        const nuevoCodigo = {
            codigo: codigoFalla || `DESC-${Date.now()}`,
            descripcion: analisis.definicion_codigo,
            analisis,
            datosVehiculo,
            diagnosticoId: diagnosticoGuardado.id,
            diagnosticoCompleto: diagnosticoGuardado // Pasar el objeto completo
        };
        
        setCodigosDetectados([nuevoCodigo]); // Reemplazar con el nuevo resultado
        
        // Limpiar formulario
        setCodigoFalla(""); setDescripcionFalla(""); setMarca(""); setModelo("");
        setAno(""); setMotor(""); setVin(""); setKilometraje(""); setVideoFile(null);
        const fileInput = document.getElementById('video-upload');
        if (fileInput) fileInput.value = '';
      }
    } catch (error) {
      console.error("Error en análisis:", error);
      alert("Ocurrió un error durante el análisis. Por favor, intenta de nuevo.");
    } finally {
      setAnalizando(false);
      setTipoAnalisis("");
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">
      
      {/* Header con botón de historial */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Diagnóstico Automotriz PRO</h1>
          <p className="text-gray-600">Análisis experto de fallas vehiculares</p>
        </div>
        <Link to={createPageUrl('Historial')}>
          <Button variant="outline" className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Ver Historial
          </Button>
        </Link>
      </div>

      <Card className="shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl text-[#003366]">
            <Search className="w-6 h-6" />
            Nuevo Diagnóstico
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm font-semibold text-blue-800 mb-3">
              <span className="text-red-500">*</span> Ingresa al menos UNO de estos campos:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigoFalla" className="font-semibold text-gray-700">Código de Falla (DTC)</Label>
                <Input id="codigoFalla" placeholder="Ej: P0301, P0420" value={codigoFalla} onChange={(e) => setCodigoFalla(e.target.value.toUpperCase())} className="uppercase text-lg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descripcionFalla" className="font-semibold text-gray-700">Descripción de la Falla</Label>
                <Textarea id="descripcionFalla" placeholder="Describe los síntomas con el mayor detalle posible: ruidos, comportamiento, cuándo ocurre, qué se ha revisado, etc." value={descripcionFalla} onChange={(e) => setDescripcionFalla(e.target.value)} rows={4} className="text-base" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2"><Label htmlFor="marca" className="font-semibold text-gray-700">Marca <span className="text-sm text-gray-500">(Opcional - recomendado)</span></Label><Input id="marca" placeholder="Ej: Toyota" value={marca} onChange={(e) => setMarca(e.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="modelo" className="font-semibold text-gray-700">Modelo <span className="text-sm text-gray-500">(Opcional - recomendado)</span></Label><Input id="modelo" placeholder="Ej: Corolla" value={modelo} onChange={(e) => setModelo(e.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="ano" className="font-semibold text-gray-700">Año <span className="text-sm text-gray-500">(Opcional - recomendado)</span></Label><Input id="ano" placeholder="Ej: 2018" value={ano} onChange={(e) => setAno(e.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="motor" className="font-semibold text-gray-700">Motor <span className="text-sm text-gray-500">(Opcional - recomendado)</span></Label><Input id="motor" placeholder="Ej: 1.8L" value={motor} onChange={(e) => setMotor(e.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="vin" className="font-semibold text-gray-700">VIN <span className="text-sm text-gray-500">(Opcional)</span></Label><Input id="vin" placeholder="Número de identificación" value={vin} onChange={(e) => setVin(e.target.value.toUpperCase())} className="uppercase"/></div>
            <div className="space-y-2"><Label htmlFor="kilometraje" className="font-semibold text-gray-700">Kilometraje <span className="text-sm text-gray-500">(Opcional)</span></Label><Input id="kilometraje" placeholder="Ej: 150000" value={kilometraje} onChange={(e) => setKilometraje(e.target.value)} /></div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="video-upload" className="font-semibold text-gray-700">Video de la Falla <span className="text-sm text-gray-500">(Opcional - alta definición preferida)</span></Label>
            <div className="flex items-center gap-4">
              <Input id="video-upload" type="file" accept="video/*" onChange={handleVideoUpload} />
              <Upload className="w-4 h-4" />
              {videoFile && <span className="text-sm text-green-600">{videoFile.name}</span>}
            </div>
            <p className="text-xs text-gray-500">Formatos soportados: MP4, MOV, AVI. Tamaño máximo: 100MB</p>
          </div>

          <div className="text-center text-sm text-green-600"><p className="font-semibold">¡Tienes análisis ilimitados!</p></div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
            <button onClick={() => handleStartAnalysis('breve')} disabled={analizando || uploadingVideo || (!codigoFalla.trim() && !descripcionFalla.trim())} className="btn-profesional w-full sm:w-auto text-lg flex items-center justify-center gap-2">
              {analizando ? <><Loader2 className="w-5 h-5 animate-spin" />Analizando...</> : "Diagnóstico Detallado"}
            </button>
          </div>

        </CardContent>
      </Card>

      {codigosDetectados.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3"><AlertTriangle className="w-7 h-7 text-[#ff6600]" /><h2 className="text-2xl font-bold text-gray-800">Resultados del Diagnóstico</h2></div>
          {codigosDetectados.map((codigo, index) => (
            <CodigoAnalisis key={`${codigo.codigo}-${index}-${codigo.diagnosticoId}`} codigo={codigo} />
          ))}
        </div>
      )}
      
      <footer className="text-center pt-8"><p className="text-gray-600">Aplicación hecha por Jose Luis Orozco. Contacto: +52 55 5217 3484</p></footer>
    </div>
  );
}
