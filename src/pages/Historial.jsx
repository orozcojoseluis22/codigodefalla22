
import React, { useState, useEffect } from "react";
import { Diagnostico } from "@/api/entities";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { History, Car, Calendar, Award, Plus, Star, ShieldCheck, ChevronsRight, Share } from "lucide-react";
import { createPageUrl } from "@/utils";
import { Link, useNavigate } from "react-router-dom";

export default function HistorialPage() {
  const [diagnosticos, setDiagnosticos] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        
        const historial = await Diagnostico.filter(
          { created_by: currentUser.email },
          '-created_date',
          50
        );
        setDiagnosticos(historial);
      } catch (error) {
        console.error("Error cargando historial:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarHistorial();
  }, []);

  const goToDetails = (id) => {
    navigate(createPageUrl(`DiagnosticoDetalle?id=${id}`));
  };

  const shareToForum = (diagnostico) => {
    // The `analisis_completo` might be a stringified JSON if stored this way.
    // Ensure it's passed as is or parsed if necessary for the forum page.
    // For now, passing it as stored.
    const diagnosticoData = {
      codigo_falla: diagnostico.codigo_falla,
      descripcion_falla: diagnostico.descripcion_falla,
      marca: diagnostico.marca,
      modelo: diagnostico.modelo,
      ano: diagnostico.ano,
      motor: diagnostico.motor,
      analisis_completo: diagnostico.analisis_completo // This field might contain complex JSON
    };
    
    // Guardar datos en localStorage para la página del foro
    localStorage.setItem('shareToForum', JSON.stringify(diagnosticoData));
    navigate(createPageUrl('Foro'));
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#003366]"></div></div>;
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <History className="w-8 h-8 text-[#003366]" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Historial de Diagnósticos</h1>
            <p className="text-gray-600">Revisa tus consultas y proporciona retroalimentación para ganar puntos</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 px-4 py-2 rounded-lg border border-yellow-200">
                <Award className="w-5 h-5 text-yellow-600" />
                <span className="font-semibold text-yellow-800">{user.puntos_acumulados || 0} puntos</span>
              </div>
              <Badge variant="secondary" className="px-3 py-1 text-sm bg-[#003366] text-white">
                <Star className="w-4 h-4 mr-2" />{user.status_titulo || 'Principiante'}
              </Badge>
            </div>
          )}
          <Link to={createPageUrl('Diagnostico')}>
            <Button className="bg-[#003366] hover:bg-[#002244] text-white"><Plus className="w-5 h-5 mr-2" />Nuevo Diagnóstico</Button>
          </Link>
        </div>
      </div>

      {diagnosticos.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No tienes diagnósticos previos</h3>
            <p className="text-gray-500 mb-6">Comienza tu primer análisis para ver tu historial aquí</p>
            <Link to={createPageUrl('Diagnostico')}><Button className="bg-[#003366] hover:bg-[#002244] text-white"><Plus className="w-5 h-5 mr-2" />Iniciar Diagnóstico</Button></Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {diagnosticos.map((d) => (
            <Card key={d.id} className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => goToDetails(d.id)}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-xl text-[#003366]"><Car className="w-5 h-5" />{d.marca} {d.modelo} {d.ano}</CardTitle>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600"><Calendar className="w-4 h-4" />{new Date(d.created_date).toLocaleString('es-MX')}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {d.retroalimentacion_proporcionada && <Badge className="bg-green-100 text-green-800">✓ Retroalimentación</Badge>}
                    <ChevronsRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="truncate"><strong>{d.codigo_falla || "Falla por descripción:"}</strong> {d.descripcion_falla}</p>
                {d.falla_confirmada && <p className="text-green-700 mt-2"><strong>Solución confirmada:</strong> {d.falla_confirmada}</p>}
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card's onClick from triggering
                      shareToForum(d);
                    }}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                  >
                    <Share className="w-4 h-4" />
                    Compartir en Foro
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="bg-gradient-to-r from-blue-50 to-orange-50 border-2 border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4"><Award className="w-6 h-6 text-[#ff6600]" /><h3 className="text-xl font-bold text-[#003366]">Sistema de Puntos y Estatus</h3></div>
          <div className="grid md:grid-cols-2 gap-4 text-gray-700">
            <div><p>• <strong>50 puntos</strong> por cada retroalimentación que proporciones.</p><p>• <strong>1,000 puntos</strong> = 1 mes gratis + Estatus <Badge><Star className="w-3 h-3 mr-1"/>Experto</Badge></p></div>
            <div><p>• <strong>10,000 puntos</strong> = 1 año gratis + Estatus <Badge className="bg-green-600 hover:bg-green-600"><ShieldCheck className="w-3 h-3 mr-1"/>Profesional Experto</Badge></p></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
