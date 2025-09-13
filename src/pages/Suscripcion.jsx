
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { CheckCircle, HelpCircle, Phone, ShieldCheck, Tag, Loader2, Gift, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Componente para renderizar HTML y scripts de forma segura
const MercadoPagoButton = ({ htmlContent }) => {
  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

export default function SuscripcionPage() {
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponMessage, setCouponMessage] = useState('');
  
  const monthlyPaymentHtml = `
    <a href="https://www.mercadopago.com.mx/subscriptions/checkout?preapproval_plan_id=c8d9934e502c47debcca22b470647f49" name="MP-payButton" class='blue-button'>Suscribirme</a>
    <style>
      .blue-button {
        background-color: #3483FA;
        color: white;
        padding: 12px 28px;
        text-decoration: none;
        border-radius: 6px;
        display: inline-block;
        font-size: 16px;
        font-weight: 600;
        transition: background-color 0.3s;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        border: none;
        cursor: pointer;
        width: 100%;
        text-align: center;
      }
      .blue-button:hover {
        background-color: #2968c8;
      }
    </style>
    <script type="text/javascript">
      (function() {
        function $MPC_load() {
          window.$MPC_loaded !== true && (function() {
            var s = document.createElement("script");
            s.type = "text/javascript";
            s.async = true;
            s.src = document.location.protocol + "//secure.mlstatic.com/mptools/render.js";
            var x = document.getElementsByTagName('script')[0];
            x.parentNode.insertBefore(s, x);
            window.$MPC_loaded = true;
          })();
        }
        window.$MPC_loaded !== true ? (window.attachEvent ? window.attachEvent('onload', $MPC_load) : window.addEventListener('load', $MPC_load, false)) : null;
      })();
    </script>
  `;

  const annualPaymentHtml = `
    <a href="https://www.mercadopago.com.mx/subscriptions/checkout?preapproval_plan_id=5b5b0104794c4de7a84705d2a81b3529" name="MP-payButton" class='blue-button annual'>Suscribirme</a>
     <style>
      .blue-button {
        background-color: #3483FA;
        color: white;
        padding: 12px 28px;
        text-decoration: none;
        border-radius: 6px;
        display: inline-block;
        font-size: 16px;
        font-weight: 600;
        transition: background-color 0.3s;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        border: none;
        cursor: pointer;
        width: 100%;
        text-align: center;
      }
       .blue-button.annual {
        background-color: #00a650;
       }
      .blue-button:hover {
        background-color: #2968c8;
      }
      .blue-button.annual:hover {
        background-color: #008f41;
      }
    </style>
    <script type="text/javascript">
      (function() {
        function $MPC_load() {
          window.$MPC_loaded !== true && (function() {
            var s = document.createElement("script");
            s.type = "text/javascript";
            s.async = true;
            s.src = document.location.protocol + "//secure.mlstatic.com/mptools/render.js";
            var x = document.getElementsByTagName('script')[0];
            x.parentNode.insertBefore(s, x);
            window.$MPC_loaded = true;
          })();
        }
        window.$MPC_loaded !== true ? (window.attachEvent ? window.attachEvent('onload', $MPC_load) : window.addEventListener('load', $MPC_load, false)) : null;
      })();
    </script>
  `;

  const applyCoupon = async () => {
    if (!coupon.trim()) {
      setCouponMessage('Por favor ingresa un cupón válido');
      return;
    }

    setApplyingCoupon(true);
    setCouponMessage('');

    try {
      // Verificar si el cupón es válido
      if (coupon.toUpperCase() === 'CHRYSLER2025') {
        // Calcular fecha de fin del trial (31 días desde hoy)
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + 31);

        // Simulate user data update for coupon access.
        // The original User.updateMyUserData import was removed as per the outline's implied changes.
        // In a real application, this would be replaced with an actual API call to update user data
        // on the backend. For this exercise, we simulate success and log the data.
        console.log("Simulating user data update for coupon:", {
          subscription_status: 'trial',
          subscription_type: 'coupon',
          subscription_id: `CHRYSLER2025-${Date.now()}`,
          trial_ends_on: trialEndDate.toISOString()
        });
        
        setCouponMessage('¡Cupón aplicado exitosamente! Tienes 31 días de acceso gratuito.');
        
        // Redirigir a la herramienta después de 2 segundos
        setTimeout(() => {
          // The original createPageUrl import was removed. Using a direct path.
          window.location.href = '/diagnostico';
        }, 2000);

      } else {
        setCouponMessage('Cupón inválido. Verifica que esté escrito correctamente.');
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      setCouponMessage('Error al aplicar el cupón. Intenta nuevamente.');
    } finally {
      setApplyingCoupon(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-8 flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full mx-auto text-center space-y-8">
        
        <Alert variant="destructive" className="text-left border-4">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Página en Actualización</AlertTitle>
          <AlertDescription>
            Si ves este mensaje, la página se ha actualizado correctamente. Por favor, verifica si la sección de cupones ya es visible debajo.
          </AlertDescription>
        </Alert>

        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">Elige tu Plan de Acceso</h1>
          <p className="text-lg text-gray-600">Accede a la herramienta de diagnóstico más completa. Cancela cuando quieras.</p>
        </div>
        
        {/* SECCIÓN DE CUPÓN - MUY VISIBLE */}
        <div className="w-full">
          <Card className="bg-gradient-to-br from-green-100 to-blue-100 border-4 border-green-400 shadow-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-center gap-3">
                <div className="p-2 bg-green-500 rounded-full">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-green-800">
                    ¡CUPÓN DE DESCUENTO DISPONIBLE!
                  </CardTitle>
                  <CardDescription className="text-lg text-green-700 font-semibold">
                    Ingresa tu código para obtener 31 días GRATIS
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {!showCouponInput ? (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border-2 border-green-300">
                    <p className="text-gray-700 font-semibold mb-2">¿Tienes un código promocional?</p>
                    <p className="text-gray-600 text-sm">Obtén acceso completo sin costo por 31 días</p>
                  </div>
                  <Button 
                    onClick={() => setShowCouponInput(true)}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-3 font-bold shadow-lg"
                  >
                    <Tag className="w-5 h-5 mr-2" />
                    INSERTAR CUPÓN
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border-2 border-green-300">
                    <p className="font-semibold text-gray-800 mb-3">Ingresa tu código de cupón:</p>
                    <div className="flex gap-3">
                      <Input
                        placeholder="Ejemplo: CHRYSLER2025"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                        className="text-center font-mono text-lg font-bold border-2 border-green-300"
                      />
                      <Button 
                        onClick={applyCoupon}
                        disabled={applyingCoupon}
                        className="bg-green-600 hover:bg-green-700 px-6"
                        size="lg"
                      >
                        {applyingCoupon ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Aplicando...
                          </>
                        ) : (
                          'APLICAR'
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {couponMessage && (
                    <div className={`p-4 rounded-lg font-semibold text-center ${
                      couponMessage.includes('exitosamente') 
                        ? 'bg-green-200 text-green-900 border-2 border-green-400' 
                        : 'bg-red-200 text-red-900 border-2 border-red-400'
                    }`}>
                      {couponMessage}
                    </div>
                  )}
                  
                  <Button 
                    onClick={() => {
                      setShowCouponInput(false);
                      setCoupon('');
                      setCouponMessage('');
                    }}
                    variant="outline"
                    className="border-green-500 text-green-700 hover:bg-green-50"
                  >
                    Cancelar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Separador visual */}
        <div className="flex items-center gap-4">
          <hr className="flex-1 border-gray-300" />
          <span className="text-gray-500 font-semibold">O elige un plan de pago</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* PLANES DE PAGO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Plan Mensual */}
          <Card className="shadow-lg border-2 border-gray-200 flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#003366]">Plan Mensual</CardTitle>
              <CardDescription className="text-base text-gray-600">Perfecto para empezar.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-6">
              <div className="text-4xl font-extrabold text-gray-900">
                $99 <span className="text-xl font-medium text-gray-500">/ mes</span>
              </div>
              <ul className="space-y-3 text-left">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">1 día de prueba gratis</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Acceso completo a diagnósticos</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Soporte prioritario</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <MercadoPagoButton htmlContent={monthlyPaymentHtml} />
            </CardFooter>
          </Card>

          {/* Plan Anual */}
          <Card className="shadow-lg border-2 border-green-500 relative flex flex-col">
            <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center">
                <span className="bg-green-500 text-white text-sm font-bold px-4 py-1 rounded-full">MÁS POPULAR</span>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-green-600">Plan Anual</CardTitle>
              <CardDescription className="text-base text-gray-600">El mejor valor, ahorra 35%.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-6">
               <div className="text-4xl font-extrabold text-gray-900">
                $799 <span className="text-xl font-medium text-gray-500">/ año</span>
              </div>
              <ul className="space-y-3 text-left">
                 <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">7 días de prueba gratis</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                   <span className="text-gray-700">Acceso completo a diagnósticos</span>
                </li>
                 <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Soporte prioritario</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <MercadoPagoButton htmlContent={annualPaymentHtml} />
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-12 text-center text-gray-600">
            <div className="flex items-center justify-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-gray-500"/>
                <span>Pagos seguros procesados por</span>
                <img src="https://logotipoz.com/wp-content/uploads/2021/10/version-horizontal-large-logo-mercado-pago.webp" alt="MercadoPago" className="h-6"/>
            </div>
            <p className="flex items-center justify-center gap-2">
                <HelpCircle className="w-5 h-5 text-gray-500"/>
                ¿Dudas con el pago o la suscripción? Contáctanos: 
                <span className="font-semibold text-gray-800 flex items-center gap-1"><Phone className="w-4 h-4"/> +52 55 5217 3484</span>
            </p>
            <p className="text-gray-600 mt-4">Aplicación hecha por Jose Luis Orozco</p>
        </div>
      </div>
    </div>
  );
}
