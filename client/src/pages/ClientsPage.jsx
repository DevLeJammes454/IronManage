import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api';
import Button from '../components/Button';
import Input from '../components/Input';

const ClientsPage = () => {
    const [clients, setClients] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const fetchClients = async () => {
        try {
            const res = await api.get('/clients');
            setClients(res.data);
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

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

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow"
                >
                    + Nuevo Cliente
                </button>
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nombre</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Teléfono</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Dirección</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client) => (
                            <tr key={client.id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap font-medium">{client.name}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{client.phone || '-'}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{client.email || '-'}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{client.address || '-'}</p>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View: Cards */}
            <div className="md:hidden grid grid-cols-1 gap-4">
                {clients.map((client) => (
                    <div key={client.id} className="bg-white p-4 rounded-lg shadow border-l-4 border-indigo-500">
                        <h3 className="text-lg font-bold text-gray-800">{client.name}</h3>
                        <p className="text-sm text-gray-600">Tel: {client.phone}</p>
                        <p className="text-sm text-gray-600">Email: {client.email}</p>
                        <p className="text-sm text-gray-500 mt-2">{client.address}</p>
                    </div>
                ))}
            </div>

            {/* Add Client Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Registrar Cliente</h2>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Input
                                label="Nombre Completo"
                                placeholder="Ej. Juan Pérez"
                                {...register('name', { required: 'Requerido' })}
                                error={errors.name}
                            />
                            <Input
                                label="Teléfono"
                                placeholder="Ej. 55 1234 5678"
                                {...register('phone')}
                            />
                            <Input
                                label="Email"
                                type="email"
                                placeholder="cliente@email.com"
                                {...register('email')}
                            />
                            <Input
                                label="Dirección"
                                placeholder="Calle, Número, Colonia"
                                {...register('address')}
                            />
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                >
                                    Cancelar
                                </button>
                                <Button type="submit" className="w-auto">
                                    Guardar
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientsPage;
