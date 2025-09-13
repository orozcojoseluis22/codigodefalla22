

import React, { useEffect, useState } from "react";
import { Wrench, Loader2 } from "lucide-react";
import { User } from '@/api/entities';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

export default function Layout({ children, currentPageName }) {
  const [authStatus, setAuthStatus] = useState('loading');

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const user = await User.me();
        // Verificar si el usuario tiene suscripción activa o en periodo de prueba
        const isSubscribed = user.subscription_status === 'active' || user.subscription_status === 'trial';

        // Permitir acceso a AdminUsuarios solo para administradores
        if (currentPageName === 'AdminUsuarios' && user.role !== 'admin') {
          window.location.href = createPageUrl('Diagnostico');
          return;
        }

        // Permitir acceso a Foro si el usuario es administrador
        if (currentPageName === 'Foro' && user.role === 'admin') {
          setAuthStatus('authorized');
          return;
        }

        if (!isSubscribed && currentPageName !== 'Suscripcion' && currentPageName !== 'AdminUsuarios') {
          window.location.href = createPageUrl('Suscripcion');
        } else if (isSubscribed && currentPageName === 'Suscripcion') {
          window.location.href = createPageUrl('Diagnostico');
        } else {
          setAuthStatus('authorized');
        }
      } catch (error) {
        // Si hay error obteniendo el usuario, permitir acceso temporal
        console.log('Error checking user subscription:', error);
        setAuthStatus('authorized');
      }
    };

    checkSubscription();
  }, [currentPageName]);

  if (authStatus === 'loading') {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-100">
        <Loader2 className="w-12 h-12 text-[#003366] animate-spin mb-4" />
        <p className="text-lg text-gray-700">Cargando...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <style>{`
        :root {
          --brand-dark-blue: #003366;
          --brand-orange: #ff6600;
          --brand-light-blue: #00a8e1;
          --brand-background: #f0f2f5;
        }
        .btn-profesional {
          background-image: linear-gradient(to bottom, #ff7700, #ff5500);
          border: 1px solid #d95800;
          color: white;
          font-weight: bold;
          border-radius: 9999px;
          padding: 12px 24px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.3);
          transition: all 0.2s ease-in-out;
        }
        .btn-profesional:hover {
          background-image: linear-gradient(to bottom, #ff8811, #ff6600);
          box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.3);
          transform: translateY(-1px);
        }
        .btn-profesional:disabled {
            background-image: linear-gradient(to bottom, #a0a0a0, #808080);
            border-color: #666;
            cursor: not-allowed;
            opacity: 0.7;
        }
        
        /* Ocultar marca base44 */
        [data-testid="base44-branding"],
        .base44-footer,
        .base44-watermark,
        div[class*="base44"],
        div[id*="base44"],
        a[href*="base44"],
        span:contains("base44"),
        span:contains("Base44"),
        span:contains("made with base44"),
        span:contains("Made with Base44"),
        div:contains("made with base44"),
        div:contains("Made with Base44") {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          height: 0 !important;
          width: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
        }
      `}</style>
      
      {/* Header */}
      <header className="bg-[#003366] text-white shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                <Wrench className="w-7 h-7 text-white" />
              </div>
              <Link to={createPageUrl('Diagnostico')}>
                <div>
                  <h1 className="text-2xl font-bold">Codigodefalla22</h1>
                  <p className="text-sm opacity-80">Asistente de Diagnóstico Automotriz</p>
                </div>
              </Link>
            </div>
            <nav className="hidden md:flex items-center gap-6">
                <Link to={createPageUrl('Diagnostico')} className="text-white/80 hover:text-white font-medium">Diagnóstico</Link>
                <Link to={createPageUrl('Historial')} className="text-white/80 hover:text-white font-medium">Historial</Link>
                <Link to={createPageUrl('Foro')} className="text-white/80 hover:text-white font-medium">Foro</Link>
            </nav>
            <div className="flex items-center gap-3">
              {currentPageName !== 'AdminUsuarios' && (
                <Link to={createPageUrl('AdminUsuarios')} className="text-white/80 hover:text-white text-sm">
                  Admin
                </Link>
              )}
              <div className="w-10 h-10 bg-[#ff6600] rounded-full flex items-center justify-center ring-2 ring-white/50">
                <span className="text-white text-lg font-semibold">JL</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

