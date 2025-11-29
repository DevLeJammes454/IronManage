import React, { useState, useEffect } from 'react';
import { Layers, Activity, CheckCircle, ChevronRight, AlertCircle } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const KanbanBoard = () => {
    // Estado original
    const [projects, setProjects] = useState([]);
    const { user } = useAuth();

    // NUEVO ESTADO: Para controlar qué columna se ve en móvil
    const [activeTab, setActiveTab] = useState('DRAFT');

    const fetchProjects = async () => {
        try {
            const res = await api.get('/projects');
            setProjects(res.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    useEffect(() => {
        fetchProjects();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // --- LÓGICA DE NEGOCIO ORIGINAL ---
    const approveProject = async (id) => {
        if (!window.confirm('¿Aprobar proyecto? Esto descontará materiales del inventario.')) return;

        try {
            await api.post(`/projects/${id}/approve`);
            fetchProjects();
        } catch (error) {
            console.error('Error approving project:', error);
            alert('Error al aprobar proyecto');
        }
    };

    const completeProject = async (id) => {
        if (!window.confirm('¿Marcar proyecto como entregado?')) return;

        try {
            await api.post(`/projects/${id}/complete`);
            fetchProjects();
        } catch (error) {
            console.error('Error completing project:', error);
            alert('Error al completar proyecto');
        }
    };

    // Configuración de columnas con Iconos
    const columns = {
        DRAFT: {
            title: 'Pendiente',
            mobileTitle: 'Pendientes',
            color: 'bg-yellow-100 dark:bg-yellow-900/20',
            borderColor: 'border-yellow-200 dark:border-yellow-800',
            textColor: 'text-yellow-800 dark:text-yellow-200',
            icon: <Layers size={18} />
        },
        IN_PROGRESS: {
            title: 'En Producción',
            mobileTitle: 'Producción',
            color: 'bg-blue-100 dark:bg-blue-900/20',
            borderColor: 'border-blue-200 dark:border-blue-800',
            textColor: 'text-blue-800 dark:text-blue-200',
            icon: <Activity size={18} />
        },
        COMPLETED: {
            title: 'Entregado',
            mobileTitle: 'Listos',
            color: 'bg-green-100 dark:bg-green-900/20',
            borderColor: 'border-green-200 dark:border-green-800',
            textColor: 'text-green-800 dark:text-green-200',
            icon: <CheckCircle size={18} />
        },
    };

    const getColumnProjects = (status) => {
        return projects.filter(p => p.status === status);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 flex flex-col">

            {/* ENCABEZADO */}
            <header className="p-4 md:p-6 bg-white dark:bg-slate-800 shadow-sm z-10">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Activity className="text-blue-600" />
                        Tablero de Producción
                    </h1>
                    {/* Badge de usuario (opcional) */}
                    <span className="text-xs md:text-sm bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full text-slate-600 dark:text-slate-300">
                        {user?.name || 'Usuario'}
                    </span>
                </div>
            </header>

            {/* CONTROLES MÓVILES (SOLO VISIBLE EN PANTALLAS PEQUEÑAS) */}
            <div className="md:hidden sticky top-0 bg-white dark:bg-slate-900 z-10 border-b border-slate-200 dark:border-slate-800 px-2 py-2">
                <div className="flex gap-1">
                    {Object.keys(columns).map((status) => {
                        const isActive = activeTab === status;
                        const config = columns[status];
                        return (
                            <button
                                key={status}
                                onClick={() => setActiveTab(status)}
                                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex justify-center items-center gap-1
                                    ${isActive
                                        ? `${config.color} ${config.textColor} ring-2 ring-inset ring-opacity-50 ring-slate-400`
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'
                                    }`}
                            >
                                {config.icon}
                                {config.mobileTitle}
                                <span className="ml-1 bg-white dark:bg-slate-900 px-1.5 rounded-full text-[10px] shadow-sm">
                                    {getColumnProjects(status).length}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* CONTENEDOR PRINCIPAL */}
            <main className="flex-1 p-2 md:p-6 overflow-x-hidden">
                <div className="flex flex-col md:flex-row gap-4 h-full max-w-7xl mx-auto">

                    {Object.keys(columns).map((status) => {
                        const config = columns[status];
                        const colProjects = getColumnProjects(status);

                        // LOGICA RESPONSIVE:
                        // Si es móvil (hidden por defecto) -> solo mostrar si es activeTab
                        // Si es desktop (md:flex) -> siempre mostrar
                        const visibilityClass = activeTab === status ? 'flex' : 'hidden md:flex';

                        return (
                            <div
                                key={status}
                                className={`${visibilityClass} flex-col flex-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 h-fit md:h-auto
                                    ${config.color} transition-all duration-300`}
                            >
                                {/* Título de Columna (Desktop style) */}
                                <div className={`p-4 border-b ${config.borderColor} flex justify-between items-center`}>
                                    <h2 className={`font-bold uppercase tracking-wide flex items-center gap-2 ${config.textColor}`}>
                                        {config.icon}
                                        {config.title}
                                    </h2>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold bg-white/50 dark:bg-black/20 ${config.textColor}`}>
                                        {colProjects.length}
                                    </span>
                                </div>

                                {/* Lista de Tarjetas */}
                                <div className="p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-180px)] md:max-h-none">
                                    {colProjects.map((project) => (
                                        <div
                                            key={project.id}
                                            className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow group"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                                                        {project.clientName || 'Cliente General'}
                                                    </h3>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                                                        <Activity size={12} />
                                                        ID: #{project.id.toString().padStart(4, '0')}
                                                    </p>
                                                </div>
                                                <span className="text-xs font-mono text-slate-400">
                                                    {new Date(project.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-end border-t border-slate-100 dark:border-slate-700 pt-3 mt-3">
                                                <div className="text-sm">
                                                    <span className="text-slate-500 block text-xs">Costo Total</span>
                                                    <span className="font-bold text-slate-900 dark:text-white text-base">
                                                        ${parseFloat(project.totalCost).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                                                    {project.items.length} items
                                                </div>
                                            </div>

                                            {/* ACCIONES */}
                                            <div className="mt-4 pt-2">
                                                {status === 'DRAFT' && (
                                                    <button
                                                        onClick={() => approveProject(project.id)}
                                                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2.5 px-4 rounded-lg transition-colors active:scale-95"
                                                    >
                                                        Aprobar <ChevronRight size={16} />
                                                    </button>
                                                )}

                                                {status === 'IN_PROGRESS' && (
                                                    <button
                                                        onClick={() => completeProject(project.id)}
                                                        className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2.5 px-4 rounded-lg transition-colors active:scale-95"
                                                    >
                                                        <CheckCircle size={16} /> Completar
                                                    </button>
                                                )}

                                                {status === 'COMPLETED' && (
                                                    <div className="text-center text-xs text-green-600 dark:text-green-400 font-semibold flex items-center justify-center gap-1">
                                                        <CheckCircle size={14} /> Entregado exitosamente
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {colProjects.length === 0 && (
                                        <div className="text-center py-8 opacity-50">
                                            <AlertCircle className="mx-auto mb-2 w-8 h-8" />
                                            <p className="text-sm italic">No hay proyectos</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
};

export default KanbanBoard;