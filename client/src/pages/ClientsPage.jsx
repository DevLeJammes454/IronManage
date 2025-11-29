import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    Search,
    UserPlus,
    Users,
    Phone,
    Mail,
    MapPin,
    MoreVertical,
    X,
    User,
    ExternalLink
} from 'lucide-react';
import api from '../api';
import Button from '../components/Button';
import Input from '../components/Input';

const ClientsPage = () => {
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const fetchClients = async () => {
        try {
            const res = await api.get('/clients');
            setClients(res.data);
            setFilteredClients(res.data);
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    // Filtro de búsqueda
    useEffect(() => {
        const results = clients.filter(client =>
            client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.phone?.includes(searchTerm)
        );
        setFilteredClients(results);
    }, [searchTerm, clients]);

    const onSubmit = async (data) => {
        try {
            await api.post('/clients', data);
            fetchClients();
            reset();
            setShowModal(false);
        } catch (error) {
            console.error('Error creating client:', error);
            alert('Error al crear cliente');
        }
    };

    // Helper para iniciales del avatar
    const getInitials = (name) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 p-4 md:p-8">

            {/* Header Section */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Users className="text-blue-600" />
                        Cartera de Clientes
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Administra tus contactos y datos de facturación</p>
                </div>

                <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                    <div className="relative group w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar cliente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm transition-all"
                        />
                    </div>

                    <div className="w-full sm:w-auto">
                        <Button onClick={() => setShowModal(true)} className="!w-auto flex items-center gap-2">
                            <UserPlus size={18} />
                            Nuevo Cliente
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                {/* Desktop View: Table */}
                <div className="hidden md:block bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cliente</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Contacto</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ubicación</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                            {filteredClients.map((client) => (
                                <tr key={client.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                                    {getInitials(client.name)}
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-bold text-slate-900 dark:text-white">{client.name}</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">ID: #{client.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col gap-1">
                                            {client.phone && (
                                                <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                                                    <Phone size={14} className="mr-2 text-slate-400" />
                                                    {client.phone}
                                                </div>
                                            )}
                                            {client.email && (
                                                <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                                                    <Mail size={14} className="mr-2 text-slate-400" />
                                                    {client.email}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-slate-600 dark:text-slate-300 max-w-xs truncate" title={client.address}>
                                            <MapPin size={14} className="mr-2 text-slate-400 flex-shrink-0" />
                                            {client.address || <span className="text-slate-400 italic">Sin dirección</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Ver perfil">
                                                <ExternalLink size={18} />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                                <MoreVertical size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredClients.length === 0 && (
                        <div className="p-12 text-center text-slate-400">
                            <Users className="mx-auto h-12 w-12 opacity-50 mb-3" />
                            <p>No se encontraron clientes.</p>
                        </div>
                    )}
                </div>

                {/* Mobile View: Enhanced Cards */}
                <div className="md:hidden grid grid-cols-1 gap-4">
                    {filteredClients.map((client) => (
                        <div key={client.id} className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/20">
                                        {getInitials(client.name)}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{client.name}</h3>
                                        <p className="text-xs text-slate-400">Cliente desde 2024</p>
                                    </div>
                                </div>
                                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                    <MoreVertical size={20} />
                                </button>
                            </div>

                            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                                <a href={`tel:${client.phone}`} className="flex items-center text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg -mx-2">
                                    <div className="w-8 flex justify-center"><Phone size={16} className="text-blue-500" /></div>
                                    {client.phone || 'Sin teléfono'}
                                </a>
                                <a href={`mailto:${client.email}`} className="flex items-center text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg -mx-2">
                                    <div className="w-8 flex justify-center"><Mail size={16} className="text-purple-500" /></div>
                                    {client.email || 'Sin email'}
                                </a>
                                <div className="flex items-start text-sm text-slate-600 dark:text-slate-300 p-2 -mx-2">
                                    <div className="w-8 flex justify-center mt-0.5"><MapPin size={16} className="text-red-500" /></div>
                                    <span className="flex-1">{client.address || 'Sin dirección'}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredClients.length === 0 && (
                        <div className="p-8 text-center text-slate-400 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                            <p>No hay resultados</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Client Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setShowModal(false)}></div>

                    <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <UserPlus className="text-blue-600" size={24} />
                                Registrar Cliente
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                <Input
                                    label="Nombre Completo"
                                    placeholder="Ej. Juan Pérez"
                                    icon={User}
                                    {...register('name', { required: 'El nombre es requerido' })}
                                    error={errors.name}
                                />

                                <Input
                                    label="Teléfono"
                                    placeholder="Ej. 55 1234 5678"
                                    icon={Phone}
                                    {...register('phone')}
                                />

                                <Input
                                    label="Correo Electrónico"
                                    type="email"
                                    placeholder="cliente@empresa.com"
                                    icon={Mail}
                                    {...register('email')}
                                />

                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Dirección</label>
                                    <div className="relative">
                                        <textarea
                                            rows="3"
                                            className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-slate-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 py-2.5 px-3 pl-10 outline-none transition-all resize-none"
                                            placeholder="Calle, Número, Colonia, Ciudad..."
                                            {...register('address')}
                                        ></textarea>
                                        <div className="absolute left-3 top-3 pointer-events-none text-slate-400">
                                            <MapPin size={18} />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <Button type="submit">
                                        Guardar Cliente
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientsPage;