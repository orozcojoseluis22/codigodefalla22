import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bluetooth, Wifi, CheckCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ConexionOBD({ conectado, conectando, onConectar, onDesconectar }) {
  return (
    <Card className="shadow-lg border border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl text-[#003366]">
          <Bluetooth className="w-6 h-6" />
          Conexión Escáner OBD-II
          {conectado && (
            <Badge className="bg-green-100 text-green-800 ml-auto border border-green-300">
              <CheckCircle className="w-4 h-4 mr-1" />
              Conectado
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!conectado ? (
          <>
            <Alert variant="info" className="bg-blue-50 border-blue-200 text-blue-800">
              <Wifi className="h-4 w-4" />
              <AlertDescription>
                Asegúrate de que tu escáner OBD-II Bluetooth esté conectado al vehículo y encendido.
              </AlertDescription>
            </Alert>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">Adaptador ELM327 / VCI</h3>
                <p className="text-sm text-gray-600">Compatible con Bluetooth LE</p>
              </div>
              <Button 
                onClick={onConectar}
                disabled={conectando}
                className="bg-[#003366] hover:bg-[#002244] text-white"
              >
                {conectando ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  <>
                    <Bluetooth className="w-4 h-4 mr-2" />
                    Conectar Escáner
                  </>
                )}
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <Alert variant="success" className="bg-green-50 border-green-200 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Conexión establecida. El sistema está listo para escanear códigos.
              </AlertDescription>
            </Alert>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">ELM327 - Conectado</h3>
                <p className="text-sm text-gray-600">Protocolo: ISO 15765-4 (CAN)</p>
              </div>
              <Button 
                onClick={onDesconectar}
                variant="destructive"
              >
                Desconectar
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}