
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { agentSDK } from "@/agents";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Users, MessageSquare, Send, Loader2, Shield, Calendar, CreditCard } from "lucide-react";

export default function AdminUsuariosPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [stats, setStats] = useState({ total: 0, active: 0, trial: 0, expired: 0 });
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUsers();
    initializeConversation();
  }, []);

  const loadUsers = async () => {
    try {
      const allUsers = await User.list();
      setUsers(allUsers);
      
      // Calcular estadísticas
      const total = allUsers.length;
      const active = allUsers.filter(u => u.subscription_status === 'active').length;
      const trial = allUsers.filter(u => u.subscription_status === 'trial').length;
      const expired = allUsers.filter(u => u.subscription_status === 'expired').length;
      
      setStats({ total, active, trial, expired });
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  const initializeConversation = async () => {
    try {
      setError(null);
      const newConversation = await agentSDK.createConversation({
        agent_name: "user_management",
        metadata: {
          name: "Administración Masiva de Usuarios",
          description: "Gestión masiva de suscripciones y configuraciones de usuario"
        }
      });
      setConversation(newConversation);

      // Mensaje inicial del sistema
      const initialMessage = {
        role: "assistant",
        content: "¡Hola! Soy tu asistente para administración masiva de usuarios. Puedo ayudarte con:\n\n• Cambiar subscription_status de múltiples usuarios\n• Configurar subscription_type\n• Asignar subscription_id\n• Establecer trial_ends_on\n\n**Ejemplos de comandos:**\n- 'Cambiar a activo todos los usuarios con status trial'\n- 'Configurar suscripción mensual para usuarios: email1@gmail.com, email2@gmail.com'\n- 'Asignar trial de 31 días a todos los usuarios con subscription_id vacío'\n\n¿En qué te puedo ayudar?"
      };
      
      setMessages([initialMessage]);
    } catch (error) {
      console.error("Error initializing conversation:", error);
      setError("Error inicializando el agente. Verifica que el agente 'user_management' esté configurado correctamente.");
    }
  };

  useEffect(() => {
    if (conversation) {
      const unsubscribe = agentSDK.subscribeToConversation(conversation.id, (data) => {
        setMessages(data.messages || []);
      });
      return () => unsubscribe();
    }
  }, [conversation]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !conversation || sending) return;

    setSending(true);
    setError(null);
    
    try {
      await agentSDK.addMessage(conversation, {
        role: "user",
        content: newMessage
      });
      setNewMessage("");
      
      // Recargar usuarios después de cambios
      setTimeout(() => {
        loadUsers();
      }, 3000);
      
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Error enviando mensaje. Intenta nuevamente.");
    } finally {
      setSending(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'trial': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="w-12 h-12 animate-spin text-[#003366]" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-8 h-8 text-[#003366]" />
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Administración de Usuarios</h1>
          <p className="text-gray-600">Gestión masiva mediante comandos de lenguaje natural</p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-[#003366]" />
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-sm text-gray-600">Total Usuarios</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CreditCard className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            <p className="text-sm text-gray-600">Activos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold text-blue-600">{stats.trial}</p>
            <p className="text-sm text-gray-600">En Prueba</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Shield className="w-6 h-6 mx-auto mb-2 text-red-600" />
            <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
            <p className="text-sm text-gray-600">Vencidos</p>
          </CardContent>
        </Card>
      </div>

      {error && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <p className="text-red-800 font-semibold">⚠️ {error}</p>
            <Button 
              onClick={initializeConversation}
              className="mt-2 bg-red-600 hover:bg-red-700 text-white"
              size="sm"
            >
              Reintentar Conexión
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chat con Agente */}
        <Card className="flex flex-col h-[600px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Asistente de Administración
              {conversation && <Badge className="bg-green-100 text-green-800 ml-2">Conectado</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col flex-1 space-y-4">
            <div className="flex-1 overflow-y-auto space-y-4 max-h-[400px]">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-[#003366] text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                    {message.tool_calls && message.tool_calls.length > 0 && (
                      <div className="mt-2 text-xs opacity-75">
                        ⚙️ Ejecutando {message.tool_calls.length} acción(es)...
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escribe tu comando aquí... Ej: 'Cambiar subscription_status a active para usuarios: email1@gmail.com, email2@gmail.com'"
                className="flex-1"
                rows={3}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <Button 
                onClick={sendMessage}
                disabled={sending || !newMessage.trim() || !conversation}
                className="bg-[#003366] hover:bg-[#002244]"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Usuarios */}
        <Card className="h-[600px]">
          <CardHeader>
            <CardTitle>Lista de Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-y-auto max-h-[500px] space-y-2">
              {users.map((user) => (
                <div key={user.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold">{user.full_name || 'Sin nombre'}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500">ID: {user.subscription_id || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(user.subscription_status)}>
                      {user.subscription_status || 'none'}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {user.subscription_type || 'N/A'}
                    </p>
                    {user.trial_ends_on && (
                      <p className="text-xs text-gray-500">
                        Trial: {new Date(user.trial_ends_on).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comandos de Ejemplo */}
      <Card>
        <CardHeader>
          <CardTitle>Comandos de Ejemplo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Cambios de Status:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• "Activar todos los usuarios con status trial"</li>
                <li>• "Cambiar a expired los usuarios sin suscripción"</li>
                <li>• "Poner en trial por 31 días a usuarios específicos"</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Configuración Masiva:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• "Asignar subscription_id del 13 al 50 consecutivos"</li>
                <li>• "Configurar suscripción mensual para estos emails: email1, email2"</li>
                <li>• "Extender trial 31 días más a todos los usuarios activos"</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
