import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Trophy, Award, UserCircle } from 'lucide-react';

export default function ForoLeaderboardPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadLeaderboard = async () => {
            try {
                const allUsers = await User.list();
                const sortedUsers = allUsers
                    .filter(u => (u.puntos_foro || 0) > 0)
                    .sort((a, b) => (b.puntos_foro || 0) - (a.puntos_foro || 0));
                setUsers(sortedUsers);
            } catch (error) {
                console.error("Error loading leaderboard:", error);
            } finally {
                setLoading(false);
            }
        };
        loadLeaderboard();
    }, []);

    const getRankColor = (rank) => {
        if (rank === 0) return 'text-yellow-500';
        if (rank === 1) return 'text-gray-400';
        if (rank === 2) return 'text-yellow-700';
        return 'text-gray-500';
    };

    if (loading) {
        return <div className="flex justify-center items-center py-20"><Loader2 className="w-12 h-12 animate-spin text-[#003366]" /></div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
            <div className="text-center">
                <Trophy className="w-16 h-16 mx-auto text-yellow-500" />
                <h1 className="text-3xl font-bold text-gray-800 mt-2">Tabla de Líderes del Foro</h1>
                <p className="text-gray-600">Reconocimiento a los miembros más participativos de la comunidad.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Top Participantes</CardTitle>
                </CardHeader>
                <CardContent>
                    {users.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">Aún no hay participantes con puntos. ¡Anímate a publicar!</p>
                    ) : (
                        <div className="space-y-4">
                            {users.map((user, index) => (
                                <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <span className={`text-2xl font-bold w-8 text-center ${getRankColor(index)}`}>{index + 1}</span>
                                        <UserCircle className="w-10 h-10 text-gray-400" />
                                        <div>
                                            <p className="font-semibold text-lg text-gray-800">{user.full_name || user.email.split('@')[0]}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-blue-600 font-bold text-lg">
                                        <Award className="w-5 h-5" />
                                        <span>{user.puntos_foro} pts</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}