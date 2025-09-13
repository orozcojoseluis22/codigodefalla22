
import React, { useState, useEffect, useCallback } from 'react';
import { ForoPost } from '@/api/entities';
import { ForoComment } from '@/api/entities';
import { ForoLike } from '@/api/entities';
import { User } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, MessageSquare, ThumbsUp, Send, UserCircle, CheckCircle, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function ForoPostDetallePage() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false); // New state for editing
  const [deleting, setDeleting] = useState(false); // New state for deleting
  const postId = new URLSearchParams(window.location.search).get('id');

  const fetchData = useCallback(async () => {
    if (!postId) {
      setLoading(false);
      return;
    }
    try {
      const [postData, commentData, likeData, userData] = await Promise.all([
        ForoPost.get(postId),
        ForoComment.filter({ postId }),
        ForoLike.filter({ postId }),
        User.me(),
      ]);
      setPost(postData);
      setComments(commentData.sort((a, b) => new Date(a.created_date) - new Date(b.created_date)));
      setLikes(likeData);
      setCurrentUser(userData);
    } catch (error) {
      console.error("Error fetching post details:", error);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    try {
      await ForoComment.create({ postId, content: newComment });

      // Otorgar punto por comentar
      const user = await User.me();
      const nuevosPuntos = (user.puntos_foro || 0) + 1;
      await User.updateMyUserData({ puntos_foro: nuevosPuntos });

      setNewComment('');
      fetchData(); // Re-fetch data to show the new comment
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (commentId = null) => {
    if (!currentUser) return;
    try {
        const existingLike = likes.find(like => 
            like.created_by === currentUser.email && 
            (commentId ? like.commentId === commentId : like.postId === postId && !like.commentId)
        );

        if (existingLike) {
            await ForoLike.delete(existingLike.id);
        } else {
            await ForoLike.create({
                postId: postId,
                ...(commentId && { commentId: commentId })
            });
            
            // Otorgar punto al autor del contenido likeado
            let authorEmail;
            if (commentId) {
                const likedComment = comments.find(c => c.id === commentId);
                authorEmail = likedComment?.created_by;
            } else {
                authorEmail = post?.created_by;
            }

            if (authorEmail && authorEmail !== currentUser.email) {
                // NOTA: Esto requeriría una función de backend para actualizar puntos de otro usuario.
                // Por ahora, lo dejamos comentado como una mejora futura.
                // await awardForumPoints({ email: authorEmail, points: 1 });
            }
        }
        fetchData(); // Re-fetch likes
    } catch (error) {
        console.error("Error handling like:", error);
    }
  };
  
  const handleMarkAsSolution = async (commentId) => {
    try {
        const comment = comments.find(c => c.id === commentId);
        if(!comment) return;

        // Mark comment as solution and post as resolved
        await ForoComment.update(commentId, { is_solution: true });
        await ForoPost.update(postId, { is_resolved: true });
        
        // Otorgar puntos extra por resolver
        const author = await User.me(); // El que marca como resuelto (dueño del post)
        const solver = comments.find(c => c.id === commentId)?.created_by;
        if(solver && solver !== author.email) {
             // NOTA: Requeriría función de backend para dar puntos a otro.
        }

        fetchData(); // Re-fetch all data
    } catch (error) {
        console.error("Error marking as solution:", error);
    }
  };

  const handleEditPost = () => {
    setShowEditForm(true); // Placeholder for future edit form
    // In a real application, this would likely open a modal or navigate to an edit page.
    // For now, we just set the state.
    console.log("Edit post clicked!");
  };

  const handleDeletePost = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta publicación? Esto eliminará todos sus comentarios y likes asociados.')) return;
    
    setDeleting(true);
    try {
      await ForoPost.delete(postId);
      
      // Quitar punto del usuario si el autor es el que elimina
      if (currentUser?.email === post.created_by) {
        const user = await User.me(); // Fetch current user's latest data
        const nuevosPuntos = Math.max(0, (user.puntos_foro || 0) - 1);
        await User.updateMyUserData({ puntos_foro: nuevosPuntos });
      }
      
      alert('Publicación eliminada exitosamente');
      window.location.href = createPageUrl('Foro'); // Redirect to forum page
    } catch (error) {
      console.error('Error eliminando publicación:', error);
      alert('Error al eliminar la publicación');
    } finally {
      setDeleting(false);
    }
  };


  if (loading) {
    return <div className="flex justify-center items-center py-20"><Loader2 className="w-12 h-12 animate-spin text-[#003366]" /></div>;
  }

  if (!post) {
    return <div className="text-center py-10">Publicación no encontrada. <Link to={createPageUrl('Foro')} className="text-blue-500">Volver al foro</Link></div>;
  }

  const postLikes = likes.filter(like => !like.commentId).length;
  const hasUserLikedPost = currentUser && likes.some(like => like.created_by === currentUser.email && !like.commentId);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl font-bold text-gray-800">{post.title}</CardTitle>
            <Badge variant="secondary">{post.category}</Badge>
          </div>
          <p className="text-sm text-gray-500">
            Por {post.created_by.split('@')[0]} el {new Date(post.created_date).toLocaleDateString()}
          </p>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">{post.content}</div>
          
          {/* Mostrar datos del diagnóstico si existen */}
          {post.diagnostico_data && (
            <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-3">📊 Datos del Diagnóstico Compartido:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {post.diagnostico_data.codigo_falla && (
                  <div><span className="font-semibold text-blue-700">Código:</span> {post.diagnostico_data.codigo_falla}</div>
                )}
                {post.diagnostico_data.marca && (
                  <div><span className="font-semibold text-blue-700">Vehículo:</span> {post.diagnostico_data.marca} {post.diagnostico_data.modelo} {post.diagnostico_data.ano}</div>
                )}
                {post.diagnostico_data.motor && (
                  <div><span className="font-semibold text-blue-700">Motor:</span> {post.diagnostico_data.motor}</div>
                )}
              </div>
              
              {post.diagnostico_data.analisis_completo && (
                <div className="mt-4">
                  <h5 className="font-semibold text-blue-700 mb-2">🔍 Análisis de la Plataforma:</h5>
                  <div className="bg-white p-3 rounded border text-xs">
                    {(() => {
                      try {
                        const analisis = JSON.parse(post.diagnostico_data.analisis_completo);
                        return (
                          <div className="space-y-2">
                            <p><strong>Diagnóstico:</strong> {analisis.definicion_codigo}</p>
                            <p><strong>Urgencia:</strong> <span className={`px-2 py-1 rounded text-white ${analisis.urgencia === 'Alto' ? 'bg-red-500' : analisis.urgencia === 'Medio' ? 'bg-yellow-500' : 'bg-green-500'}`}>{analisis.urgencia}</span></p>
                            {analisis.pasos_diagnostico && <p><strong>Pasos Diagnóstico:</strong> {analisis.pasos_diagnostico}</p>}
                            {analisis.posibles_causas && <p><strong>Posibles Causas:</strong> {analisis.posibles_causas}</p>}
                            {analisis.soluciones_sugeridas && <p><strong>Soluciones Sugeridas:</strong> {analisis.soluciones_sugeridas}</p>}
                          </div>
                        );
                      } catch {
                        return <p>Datos de análisis disponibles.</p>;
                      }
                    })()}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Archivos adjuntos */}
          {post.attachments && post.attachments.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="font-semibold">Archivos adjuntos:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {post.attachments.map((attachment, index) => (
                  <div key={index} className="flex flex-col items-center p-2 border rounded-lg bg-gray-50">
                    {attachment.type === 'video' ? (
                      <video controls className="w-full rounded-lg max-h-60 object-contain">
                        <source src={attachment.url} type="video/mp4" />
                        Tu navegador no soporta la reproducción de video.
                      </video>
                    ) : (
                      <img src={attachment.url} alt={`Adjunto ${index + 1}`} className="w-full rounded-lg max-h-60 object-contain" />
                    )}
                    <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mt-2 text-sm">{attachment.name || `Archivo ${index + 1}`}</a>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => handleLike()}>
                <ThumbsUp className={`w-4 h-4 mr-2 ${hasUserLikedPost ? 'text-blue-500' : ''}`} />
                {postLikes} Me gusta
              </Button>
              <div className="flex items-center gap-2 text-gray-500">
                  <MessageSquare className="w-4 h-4" />
                  <span>{comments.length} Comentarios</span>
              </div>
              {post.is_resolved && <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-4 h-4 mr-2" />Resuelto</Badge>}
            </div>
            
            {/* Botones de editar/eliminar para el autor */}
            {currentUser?.email === post.created_by && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleEditPost}>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button variant="outline" size="sm" onClick={handleDeletePost} disabled={deleting}>
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                  Eliminar
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Comentarios</h3>
        {comments.map(comment => {
            const commentLikes = likes.filter(like => like.commentId === comment.id).length;
            const hasUserLikedComment = currentUser && likes.some(like => like.created_by === currentUser.email && like.commentId === comment.id);
            return (
                <Card key={comment.id} className={`${comment.is_solution ? 'border-2 border-green-500 bg-green-50' : ''}`}>
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <UserCircle className="w-8 h-8 text-gray-400 mt-1" />
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold text-gray-700">{comment.created_by.split('@')[0]}</p>
                                    <p className="text-xs text-gray-500">{new Date(comment.created_date).toLocaleString()}</p>
                                </div>
                                <p className="text-gray-600 mt-1 whitespace-pre-wrap">{comment.content}</p>
                                <div className="flex items-center gap-4 mt-3">
                                    <Button variant="ghost" size="sm" onClick={() => handleLike(comment.id)}>
                                        <ThumbsUp className={`w-4 h-4 mr-2 ${hasUserLikedComment ? 'text-blue-500' : ''}`} />
                                        {commentLikes}
                                    </Button>
                                    {currentUser?.email === post.created_by && !post.is_resolved && (
                                        <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700" onClick={() => handleMarkAsSolution(comment.id)}>
                                            <CheckCircle className="w-4 h-4 mr-2" /> Marcar como solución
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                        {comment.is_solution && <Badge className="mt-3 bg-green-200 text-green-800">✓ Solución Correcta</Badge>}
                    </CardContent>
                </Card>
            )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Añadir un comentario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Textarea
              placeholder="Escribe tu respuesta..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={4}
            />
            <div className="flex justify-end">
              <Button onClick={handleCommentSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enviando...</>
                ) : (
                  <><Send className="w-4 h-4 mr-2" /> Enviar Comentario</>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
