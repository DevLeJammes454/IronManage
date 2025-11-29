import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import {
    DollarSign,
    Activity,
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    Package,
    Plus,
    FileText,
    ArrowRight,
    Calendar,
    Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const StatCard = ({ title, value, icon: Icon, colorClass, trend, loading }) => (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-all hover:shadow-md relative overflow-hidden">
        {loading ? (
            <div className="animate-pulse space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
            </div>
        ) : (
            <>
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10 dark:bg-opacity-20`}>
                        <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
                    </div>
                    {trend && (
                        <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700'}`}>
                            {trend > 0 ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
                            {Math.abs(trend)}%
                        </div>
                    )}
                </div>
                <div>
                    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wide">{title}</h3>
                    <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
                </div>
            </>
        )}
    </div>
);

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-slate-800 p-4 border border-slate-100 dark:border-slate-700 shadow-xl rounded-xl">
                <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">{label}</p>
                <p className="text-blue-600 dark:text-blue-400 font-bold">
                    ${payload[0].value.toLocaleString()}
                    <span className="text-slate-400 text-xs font-normal ml-1">MXN</span>
                </p>
            </div>
        );
    }
    return null;
};

const DashboardPage = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
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
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const currentDate = new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header Welcome */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                            Hola, <span className="text-blue-600 dark:text-blue-400">{user?.name?.split(' ')[0] || 'Usuario'}</span> 👋
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-2">
                            <Calendar size={16} />
                            {currentDate.charAt(0).toUpperCase() + currentDate.slice(1)}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Link to="/projects/new" className="bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-blue-500/10 transition-all flex items-center gap-2">
                            <Plus size={18} /> Nuevo Proyecto
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Ingresos del Mes"
                        value={`$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                        icon={DollarSign}
                        colorClass="bg-green-500 text-green-500"
                        trend={12.5}
                        loading={loading}
                    />
                    <StatCard
                        title="Proyectos Activos"
                        value={stats.activeProjects}
                        icon={Activity}
                        colorClass="bg-blue-500 text-blue-500"
                        loading={loading}
                    />
                    <StatCard
                        title="Alertas de Stock"
                        value={stats.lowStockCount}
                        icon={AlertTriangle}
                        colorClass="bg-orange-500 text-orange-500"
                        trend={-2}
                        loading={loading}
                    />
                    {/* Tarjeta Extra para balancear layout */}
                    <StatCard
                        title="Clientes Nuevos"
                        value="4"
                        icon={Users}
                        colorClass="bg-purple-500 text-purple-500"
                        trend={5.2}
                        loading={loading}
                    />
                </div>

                {/* Main Content Split */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Chart Section (2/3 width) */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 flex flex-col h-[400px]">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <TrendingUp className="text-blue-500" size={20} />
                                Rendimiento Anual
                            </h2>
                            <select className="bg-slate-50 dark:bg-slate-700 border-none text-xs rounded-md px-2 py-1 text-slate-500 outline-none cursor-pointer">
                                <option>2024</option>
                                <option>2023</option>
                            </select>
                        </div>

                        <div className="flex-1 w-full min-h-0">
                            {loading ? (
                                <div className="h-full w-full flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                                    <Activity className="animate-spin text-slate-300" size={32} />
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={stats.monthlySales} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                                            tickFormatter={(value) => `$${value / 1000}k`}
                                        />
                                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }} />
                                        <Area
                                            type="monotone"
                                            dataKey="sales"
                                            stroke="#3b82f6"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorSales)"
                                            activeDot={{ r: 6, strokeWidth: 0 }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions / Recent Activity (1/3 width) */}
                    <div className="flex flex-col gap-6">
                        {/* Quick Actions */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-blue-900 dark:to-slate-900 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <DollarSign size={100} />
                            </div>
                            <h3 className="text-lg font-bold mb-1">Acciones Rápidas</h3>
                            <p className="text-slate-300 text-sm mb-6">Gestiona tu taller eficientemente.</p>

                            <div className="space-y-3 relative z-10">
                                <Link to="/inventory" className="flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-sm group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-500 rounded-lg">
                                            <Package size={16} />
                                        </div>
                                        <span className="font-medium text-sm">Ver Inventario</span>
                                    </div>
                                    <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                                </Link>
                                <Link to="/quotes" className="flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-sm group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-500 rounded-lg">
                                            <FileText size={16} />
                                        </div>
                                        <span className="font-medium text-sm">Nueva Cotización</span>
                                    </div>
                                    <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                                </Link>
                            </div>
                        </div>

                        {/* Recent Alerts List */}
                        <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
                            <h3 className="text-sm font-bold uppercase text-slate-400 tracking-wider mb-4">Actividad Reciente</h3>
                            <div className="space-y-4">
                                {[1, 2, 3].map((_, i) => (
                                    <div key={i} className="flex gap-3 items-start pb-4 border-b border-slate-50 dark:border-slate-700 last:border-0 last:pb-0">
                                        <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-blue-50 dark:ring-blue-900/20"></div>
                                        <div>
                                            <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">Proyecto "Reja Residencial" aprobado</p>
                                            <p className="text-xs text-slate-400 mt-1">Hace {i + 2} horas</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DashboardPage;