import Layout from "./Layout.jsx";

import Diagnostico from "./Diagnostico";

import Suscripcion from "./Suscripcion";

import Historial from "./Historial";

import DiagnosticoDetalle from "./DiagnosticoDetalle";

import AdminUsuarios from "./AdminUsuarios";

import Foro from "./Foro";

import ForoPostDetalle from "./ForoPostDetalle";

import ForoLeaderboard from "./ForoLeaderboard";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Diagnostico: Diagnostico,
    
    Suscripcion: Suscripcion,
    
    Historial: Historial,
    
    DiagnosticoDetalle: DiagnosticoDetalle,
    
    AdminUsuarios: AdminUsuarios,
    
    Foro: Foro,
    
    ForoPostDetalle: ForoPostDetalle,
    
    ForoLeaderboard: ForoLeaderboard,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Diagnostico />} />
                
                
                <Route path="/Diagnostico" element={<Diagnostico />} />
                
                <Route path="/Suscripcion" element={<Suscripcion />} />
                
                <Route path="/Historial" element={<Historial />} />
                
                <Route path="/DiagnosticoDetalle" element={<DiagnosticoDetalle />} />
                
                <Route path="/AdminUsuarios" element={<AdminUsuarios />} />
                
                <Route path="/Foro" element={<Foro />} />
                
                <Route path="/ForoPostDetalle" element={<ForoPostDetalle />} />
                
                <Route path="/ForoLeaderboard" element={<ForoLeaderboard />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}