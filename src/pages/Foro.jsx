import { useState, useEffect } from 'react';
import { ForoPost } from '@/api/entities';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, MessageSquare, Plus, CheckCircle, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import PostForm from '@/components/foro/PostForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const categories = ["Diagnostico General", "Casos de Estudio", "Electricidad Automotriz", "Electronica Automotriz", "Preguntas y Respuestas"];

export default function ForoPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [sharedDiagnostico, setSharedDiagnostico] = useState(null);

  const loadPosts = async () => {
    setLoading(true);
    try {
      console.log('Cargando posts del foro...');
      const postList = await ForoPost.list('-created_date', 200);
      console.log('Posts cargados:', postList?.length || 0);
      setPosts(postList);
      // Guardar copia local para disponibilidad sin conexión
      localStorage.setItem('foroPosts', JSON.stringify(postList));
    } catch (error) {
      console.error("Error loading posts:", error);
      // Intentar cargar desde almacenamiento local si la API falla
      const stored = JSON.parse(localStorage.getItem('foroPosts') || '[]');
      setPosts(stored);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
    
    // Verificar si hay un diagnóstico para compartir
    const shared = localStorage.getItem('shareToForum');
    if (shared) {
      setSharedDiagnostico(JSON.parse(shared));
      localStorage.removeItem('shareToForum');
      setShowForm(true);
    }
  }, []);

  const handlePostCreated = async (newPost) => {
    console.log('Post creado, manejando respuesta:', newPost);
    
    setShowForm(false);
    setSharedDiagnostico(null);
    
    // Verificar que el post realmente tiene ID (se guardó correctamente)
    if (newPost && newPost.id) {
      // Actualizar lista local inmediatamente
      setPosts(prevPosts => [newPost, ...prevPosts]);
      // Actualizar almacenamiento local para persistir posts
      const stored = JSON.parse(localStorage.getItem('foroPosts') || '[]');
      localStorage.setItem('foroPosts', JSON.stringify([newPost, ...stored]));

      // También recargar desde la base de datos para confirmar
      setTimeout(() => {
        console.log('Recargando posts para verificar guardado...');
        loadPosts();
      }, 1000);

      alert('¡Publicación creada exitosamente y guardada!');
    } else {
      console.error('El post no se guardó correctamente:', newPost);
      alert('Error: La publicación no se pudo guardar. Intenta de nuevo.');
    }
  };

  const renderPostList = (filteredPosts) => {
    if (loading) {
      return <div className="flex justify-center items-center py-20"><Loader2 className="w-12 h-12 animate-spin text-[#003366]" /></div>;
    }
    if (filteredPosts.length === 0) {
      return <p className="text-center text-gray-500 py-10">No hay publicaciones en esta categoría aún.</p>;
    }
    return (
      <div className="space-y-4">
        {filteredPosts.map(post => (
          <Link key={post.id} to={createPageUrl(`ForoPostDetalle?id=${post.id}`)} className="block">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   {post.is_resolved ? (
                      <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
                   ) : (
                      <MessageSquare className="w-8 h-8 text-blue-500 flex-shrink-0" />
                   )}
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">{post.title}</h3>
                    <p className="text-sm text-gray-500">
                      Por {post.created_by.split('@')[0]} el {new Date(post.created_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">{post.category}</Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Foro de la Comunidad</h1>
          <p className="text-gray-600">Comparte tus dudas y casos de estudio con otros profesionales.</p>
        </div>
        <div className="flex gap-2">
            <Link to={createPageUrl('ForoLeaderboard')}>
                <Button variant="outline"><Trophy className="w-5 h-5 mr-2" />Tabla de Líderes</Button>
            </Link>
            <Button onClick={() => setShowForm(!showForm)} className="bg-[#003366] hover:bg-[#002244]">
              <Plus className="w-5 h-5 mr-2" />
              {showForm ? 'Cerrar' : 'Crear Publicación'}
            </Button>
        </div>
      </div>

      {showForm && <PostForm onPostCreated={handlePostCreated} diagnosticoData={sharedDiagnostico} />}

      <Tabs defaultValue="todos" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
          <TabsTrigger value="todos">Todos</TabsTrigger>
          {categories.map(cat => (
            <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="todos" className="mt-4">
          {renderPostList(posts)}
        </TabsContent>
        {categories.map(cat => (
          <TabsContent key={cat} value={cat} className="mt-4">
            {renderPostList(posts.filter(p => p.category === cat))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}