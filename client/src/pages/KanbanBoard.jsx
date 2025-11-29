    };

const getColumnProjects = (status) => {
    return projects.filter(p => p.status === status);
};

return (
    <div className="p-6 bg-gray-100 min-h-screen overflow-x-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Tablero de Producción</h1>

        <div className="flex gap-6 min-w-[1000px]">
            {Object.keys(columns).map((status) => (
                <div key={status} className={`flex-1 rounded-lg p-4 shadow ${columns[status].color}`}>
                    <h2 className="font-bold text-gray-700 mb-4 uppercase tracking-wide border-b border-gray-300 pb-2">
                        {columns[status].title} ({getColumnProjects(status).length})
                    </h2>

                    <div className="space-y-4">
                        {getColumnProjects(status).map((project) => (
                            <div key={project.id} className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-gray-800">{project.clientName || 'Cliente General'}</h3>
                                    <span className="text-xs text-gray-500">{new Date(project.createdAt).toLocaleDateString()}</span>
                                </div>

                                <div className="text-sm text-gray-600 mb-2">
                                    {project.items.length} items
                                </div>

                                <div className="font-bold text-gray-900 mb-3">
                                    ${parseFloat(project.totalCost).toFixed(2)}
                                </div>

                                {status === 'DRAFT' && (
                                    <button
                                        onClick={() => approveProject(project.id)}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded"
                                    >
                                        Aprobar / Iniciar
                                    </button>
                                )}

                                {status === 'IN_PROGRESS' && (
                                    <div className="text-center text-xs text-blue-600 font-semibold bg-blue-50 py-1 rounded">
                                        En Taller
                                    </div>
                                )}
                            </div>
                        ))}

                        {getColumnProjects(status).length === 0 && (
                            <p className="text-center text-gray-400 text-sm italic">Sin proyectos</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </div>
);
};

export default KanbanBoard;
