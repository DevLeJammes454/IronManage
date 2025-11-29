import React, { useState, useEffect } from 'react';
import {
    CheckCircle,
    Search,
    Calendar,
    DollarSign,
    Package,
    Filter,
    ArrowUpRight,
    FileText
} from 'lucide-react';

// --- MOCK API DATA ---
const mockCompletedProjects = [
    { id: 101, clientName: 'Constructora del Norte SA', createdAt: '2023-10-15T10:00:00Z', completedAt: '2023-11-01T14:30:00Z', items: [1, 2, 3], totalCost: 15400.00, status: 'COMPLETED' },
    { id: 102, clientName: 'Arq. Roberto Sánchez', createdAt: '2023-11-05T09:00:00Z', completedAt: '2023-11-20T11:15:00Z', items: [1, 2], totalCost: 4200.50, status: 'COMPLETED' },
    { id: 105, clientName: 'María Gonzalez', createdAt: '2023-12-01T16:20:00Z', completedAt: '2023-12-10T10:00:00Z', items: [1], totalCost: 1200.00, status: 'COMPLETED' },
    { id: 108, clientName: 'Desarrollos Inmobiliarios MX', createdAt: '2024-01-10T08:00:00Z', completedAt: '2024-01-25T17:45:00Z', items: [1, 2, 3, 4, 5], totalCost: 85600.00, status: 'COMPLETED' },
];

const api = {
    get: () => Promise.resolve({ data: mockCompletedProjects }),
};
// -----------------------------------------------------

/* EN TU PROYECTO REAL:
   import api from '../api';
*/

const CompletedProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({ totalCount: 0, totalRevenue: 0 });

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await api.get('/projects');
                // Filter only completed projects (simulado aquí, en real podría venir filtrado del backend)
                const completed = res.data.filter(p => p.status === 'COMPLETED');
                setProjects(completed);
                setFilteredProjects(completed);

                // Calcular estadísticas iniciales
                const revenue = completed.reduce((acc, curr) => acc + curr.totalCost, 0);
                setStats({ totalCount: completed.length, totalRevenue: revenue });

            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // Efecto de búsqueda
    useEffect(() => {
        const results = projects.filter(project =>
            (project.clientName || 'Cliente General').toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.id.toString().includes(searchTerm)
        );
        setFilteredProjects(results);
    }, [searchTerm, projects]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 bg-slate-200 dark:bg-slate-700 rounded-full mb-4"></div>
                    <div className="h-4 w-48 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 p-4 md:p-8">

            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <CheckCircle className="text-green-600" />
                            Historial de Entregas
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            Archivo histórico de todos los proyectos finalizados.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative group w-full md:w-72">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar por cliente o ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                        />
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl">
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Proyectos Entregados</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalCount}</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Ingresos Totales</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                ${stats.totalRevenue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                {/* Desktop Table */}
                <div className="hidden md:block bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Proyecto / Cliente</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fechas</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Items</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Costo Final</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                            {filteredProjects.map((project) => (
                                <tr key={project.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="font-bold text-slate-900 dark:text-white text-sm">{project.clientName || 'Cliente General'}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">ID: #{project.id}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                                                <Calendar size={12} className="mr-1.5" />
                                                Creado: {new Date(project.createdAt).toLocaleDateString()}
                                            </div>
                                            {project.completedAt && (
                                                <div className="flex items-center text-xs text-green-600 dark:text-green-400 font-medium">
                                                    <CheckCircle size={12} className="mr-1.5" />
                                                    Entregado: {new Date(project.completedAt).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300">
                                            {project.items.length}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="text-sm font-bold text-slate-900 dark:text-white">
                                            ${project.totalCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                                            <CheckCircle size={12} />
                                            Entregado
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <button className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                                            <ArrowUpRight size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredProjects.length === 0 && (
                        <div className="p-12 text-center text-slate-400">
                            <FileText className="mx-auto h-12 w-12 opacity-50 mb-3" />
                            <p>No se encontraron proyectos entregados.</p>
                        </div>
                    )}
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                    {filteredProjects.map((project) => (
                        <div key={project.id} className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <CheckCircle size={60} />
                            </div>

                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div>
                                    <span className="text-xs font-mono text-slate-400 mb-1 block">#{project.id}</span>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                                        {project.clientName || 'Cliente General'}
                                    </h3>
                                </div>
                                <span className="flex items-center justify-center h-8 w-8 bg-slate-50 dark:bg-slate-700 rounded-full text-slate-400">
                                    <ArrowUpRight size={16} />
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 py-3 border-t border-slate-100 dark:border-slate-700">
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Entregado el</p>
                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1">
                                        <Calendar size={14} className="text-green-500" />
                                        {project.completedAt ? new Date(project.completedAt).toLocaleDateString() : '-'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Costo Total</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                                        ${project.totalCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-2 pt-2 border-t border-slate-50 dark:border-slate-700 flex justify-between items-center">
                                <div className="text-xs text-slate-400">
                                    {project.items.length} items en el proyecto
                                </div>
                                <span className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-1 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                                    <CheckCircle size={10} /> Finalizado
                                </span>
                            </div>
                        </div>
                    ))}

                    {filteredProjects.length === 0 && (
                        <div className="p-8 text-center text-slate-400 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                            <p>No hay resultados</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompletedProjectsPage;