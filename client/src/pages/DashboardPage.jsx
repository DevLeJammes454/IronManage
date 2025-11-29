import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DashboardPage = () => {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/dashboard/stats');
                setStats(res.data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">IronManage Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600">Hola, {user?.company_name || user?.email}</span>
                        <a href="/settings" className="text-gray-600 hover:text-gray-900">Configuración</a>
                        <button
                            onClick={logout}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow container mx-auto px-4 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                        <h3 className="text-gray-500 text-sm uppercase font-bold">Ventas del Mes</h3>
                        <p className="text-3xl font-bold text-gray-800">${stats?.total_revenue_month?.toFixed(2) || '0.00'}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                        <h3 className="text-gray-500 text-sm uppercase font-bold">Proyectos Activos</h3>
                        <p className="text-3xl font-bold text-gray-800">{stats?.active_projects || 0}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
                        <h3 className="text-gray-500 text-sm uppercase font-bold">Stock Bajo</h3>
                        <p className="text-3xl font-bold text-red-600">{stats?.low_stock_count || 0}</p>
                    </div>
                </div>

                {/* Charts & Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Chart */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Historial de Ventas (6 Meses)</h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats?.monthly_sales_history || []}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="sales" fill="#4F46E5" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Acciones Rápidas</h3>
                        <div className="flex flex-col gap-3">
                            <a href="/materials" className="bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700 text-center font-semibold">
                                Gestionar Inventario
                            </a>
                            <a href="/clients" className="bg-indigo-600 text-white px-4 py-3 rounded hover:bg-indigo-700 text-center font-semibold">
                                Gestionar Clientes
                            </a>
                            <a href="/quoter" className="bg-green-600 text-white px-4 py-3 rounded hover:bg-green-700 text-center font-semibold">
                                Nuevo Proyecto
                            </a>
                            <a href="/kanban" className="bg-orange-600 text-white px-4 py-3 rounded hover:bg-orange-700 text-center font-semibold">
                                Producción (Kanban)
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
