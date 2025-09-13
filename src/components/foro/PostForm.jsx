import { useState } from 'react';
import { ForoPost } from '@/api/entities';
import { User } from '@/api/entities';
import { UploadFile } from '@/api/integrations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Send, Upload, X, Image, Video } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PropTypes from 'prop-types';

const categories = ["Diagnostico General", "Casos de Estudio", "Electricidad Automotriz", "Electronica Automotriz", "Preguntas y Respuestas"];

export default function PostForm({ onPostCreated, editingPost = null, diagnosticoData = null }) {
  const [title, setTitle] = useState(editingPost?.title || (diagnosticoData ? `Diagnóstico: ${diagnosticoData.codigo_falla || 'Consulta Técnica'}` : ''));
  const [content, setContent] = useState(editingPost?.content || (diagnosticoData ? `Comparto este caso para la comunidad:\n\n${diagnosticoData.descripcion_falla || ''}` : ''));
  const [category, setCategory] = useState(editingPost?.category || (diagnosticoData ? 'Diagnostico General' : ''));
  const [attachments, setAttachments] = useState(editingPost?.attachments || []);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      setError('El archivo es demasiado grande. Máximo 50MB.');
      return;
    }

    setUploadingFile(true);
    try {
      const { file_url } = await UploadFile({ file });
      const newAttachment = {
        url: file_url,
        type: file.type.startsWith('video/') ? 'video' : 'image',
        name: file.name
      };
      setAttachments([...attachments, newAttachment]);
    } catch (error) {
      setError('Error subiendo archivo: ' + error.message);
    } finally {
      setUploadingFile(false);
    }
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('El título es obligatorio.');
      return;
    }
    if (!content.trim()) {
      setError('El contenido es obligatorio.');
      return;
    }
    if (!category) {
      setError('Debes seleccionar una categoría.');
      return;
    }

    setError('');
    setIsSubmitting(true);
    
    try {
      console.log('=== INICIANDO CREACIÓN DE POST ===');
      console.log('Datos del post:', {
        title: title.trim(),
        content: content.trim(),
        category: category,
        attachments: attachments
      });

      const postData = {
        title: title.trim(),
        content: content.trim(),
        category: category,
        attachments: attachments
      };

      // Si hay datos de diagnóstico, incluirlos
      if (diagnosticoData) {
        postData.diagnostico_data = diagnosticoData;
        console.log('Incluyendo datos de diagnóstico:', diagnosticoData);
      }

      let result;
      try {
        if (editingPost) {
          console.log('Actualizando post existente:', editingPost.id);
          result = await ForoPost.update(editingPost.id, postData);
          console.log('Post actualizado exitosamente:', result);
        } else {
          console.log('Creando nuevo post...');
          result = await ForoPost.create(postData);
          console.log('Post creado exitosamente:', result);

          // Solo dar punto por crear nuevo post (no por editar)
          try {
            console.log('Actualizando puntos del usuario...');
            const user = await User.me();
            console.log('Usuario actual:', user);
            const nuevosPuntos = (user.puntos_foro || 0) + 1;
            console.log('Nuevos puntos calculados:', nuevosPuntos);
            await User.updateMyUserData({ puntos_foro: nuevosPuntos });
            console.log('Puntos actualizados exitosamente');
          } catch (pointsError) {
            console.warn('Error actualizando puntos:', pointsError);
            // No fallar la creación del post por error en puntos
          }
        }
      } catch (apiError) {
        // Si la API falla (por ejemplo, sin conexión), guardar en localStorage
        console.warn('Fallo al guardar en API, usando localStorage:', apiError);
        const storedPosts = JSON.parse(localStorage.getItem('foroPosts') || '[]');
        if (editingPost) {
          const index = storedPosts.findIndex(p => p.id === editingPost.id);
          if (index !== -1) {
            storedPosts[index] = { ...storedPosts[index], ...postData };
            result = storedPosts[index];
          }
        } else {
          result = {
            ...postData,
            id: Date.now(),
            created_by: 'local',
            created_date: new Date().toISOString(),
            is_resolved: false
          };
          storedPosts.unshift(result);
        }
        localStorage.setItem('foroPosts', JSON.stringify(storedPosts));
      }

      // Verificar que el post realmente se guardó
      if (!result || !result.id) {
        throw new Error('El post no se guardó correctamente en la base de datos');
      }

      console.log('Post guardado correctamente con ID:', result.id);

      // Limpiar formulario
      setTitle('');
      setContent('');
      setCategory('');
      setAttachments([]);

      // NO mostrar alert automático, dejar que onPostCreated maneje el éxito
      console.log('=== POST CREADO EXITOSAMENTE ===');
      onPostCreated(result);
      
    } catch (createError) {
      console.error('=== ERROR CREANDO POST ===');
      console.error('Error completo:', createError);
      console.error('Mensaje:', createError.message);
      console.error('Stack:', createError.stack);
      
      let errorMessage = 'Error desconocido al crear la publicación';
      if (createError.message) {
        errorMessage = createError.message;
      }
      
      setError(`No se pudo guardar la publicación: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-lg">
        <CardHeader>
            <CardTitle>{editingPost ? 'Editar Publicación' : 'Crear Nueva Publicación'}</CardTitle>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Input
                        placeholder="Título de la publicación"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={150}
                        className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">{title.length}/150 caracteres</p>
                </div>
                
                <Select onValueChange={setCategory} value={category}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                
                <div>
                    <Textarea
                        placeholder="Escribe tu pregunta, caso de estudio o experiencia aquí..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={6}
                        className="w-full"
                    />
                </div>

                {/* Mostrar datos del diagnóstico si existen */}
                {diagnosticoData && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-800 mb-2">Diagnóstico Compartido:</h4>
                        <div className="space-y-2 text-sm text-blue-700">
                            {diagnosticoData.codigo_falla && <p><strong>Código:</strong> {diagnosticoData.codigo_falla}</p>}
                            {diagnosticoData.marca && <p><strong>Vehículo:</strong> {diagnosticoData.marca} {diagnosticoData.modelo} {diagnosticoData.ano}</p>}
                            {diagnosticoData.motor && <p><strong>Motor:</strong> {diagnosticoData.motor}</p>}
                        </div>
                    </div>
                )}
                
                {/* Archivos adjuntos */}
                <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleFileUpload}
                            className="hidden"
                            disabled={uploadingFile}
                        />
                        <Button type="button" variant="outline" disabled={uploadingFile}>
                            {uploadingFile ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Subiendo...</>
                            ) : (
                                <><Upload className="w-4 h-4 mr-2" />Adjuntar Foto/Video</>
                            )}
                        </Button>
                    </label>
                    
                    {attachments.length > 0 && (
                        <div className="mt-2 space-y-2">
                            {attachments.map((attachment, index) => (
                                <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                                    <div className="flex items-center gap-2">
                                        {attachment.type === 'video' ? <Video className="w-4 h-4" /> : <Image className="w-4 h-4" />}
                                        <span className="text-sm">{attachment.name}</span>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeAttachment(index)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
                        <p className="font-semibold">Error:</p>
                        <p>{error}</p>
                    </div>
                )}
                
                <div className="flex justify-end">
                    <Button 
                        type="submit" 
                        disabled={isSubmitting || !title.trim() || !content.trim() || !category}
                        className="bg-[#003366] hover:bg-[#002244]"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 
                                {editingPost ? 'Actualizando...' : 'Publicando...'}
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4 mr-2" /> 
                                {editingPost ? 'Actualizar' : 'Publicar'}
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </CardContent>
    </Card>
  );
}

PostForm.propTypes = {
  onPostCreated: PropTypes.func.isRequired,
  editingPost: PropTypes.object,
  diagnosticoData: PropTypes.object
};