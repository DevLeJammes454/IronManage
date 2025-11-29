import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DashboardPage = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalRevenue: 0,
        activeProjects: 0,
        lowStockCount: 0,
        monthlySales: []
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/dashboard/stats');
                // Ensure we handle the response data structure correctly
                // The backend returns: { total_revenue_month, active_projects, low_stock_count, monthly_sales_history }
                // We map it to our component state structure
                if (res.data) {
                    setStats({
                        totalRevenue: res.data.total_revenue_month || 0,
                        activeProjects: res.data.active_projects || 0,
                        lowStockCount: res.data.low_stock_count || 0,
                        monthlySales: res.data.monthly_sales_history || []
                    });
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Ingresos Totales</h3>
                    <p className="text-3xl font-bold text-slate-900">${stats.totalRevenue.toFixed(2)}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Proyectos Activos</h3>
                    <p className="text-3xl font-bold text-blue-600">{stats.activeProjects}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Materiales Bajos en Stock</h3>
                    <p className="text-3xl font-bold text-red-600">{stats.lowStockCount}</p>
                </div>
            </div>

            {/* Chart Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Historial de Ventas</h2>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.monthlySales}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} tickFormatter={(value) => `$${value}`} />
                            <Tooltip
                                cursor={{ fill: '#f1f5f9' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="flex justify-end">
                <Link to="/settings" className="text-blue-600 hover:text-blue-800 font-medium text-sm">Ir a Configuración →</Link>
            </div>
        </div>
    );
};

export default DashboardPage;
