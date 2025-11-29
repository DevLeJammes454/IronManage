import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api';
import Button from '../components/Button';
import Input from '../components/Input';

const MaterialsPage = () => {
    const [materials, setMaterials] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const fetchMaterials = async () => {
        try {
            const res = await api.get('/materials');
            setMaterials(res.data);
        } catch (error) {
            console.error('Error fetching materials:', error);
        }
    };

    useEffect(() => {
        fetchMaterials();
    }, []);

    const onSubmit = async (data) => {
        try {
            await api.post('/materials', data);
            fetchMaterials();
            reset();
            setShowModal(false);
        } catch (error) {
            console.error('Error creating material:', error);
            alert('Error al crear material');
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Inventario de Materiales</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow"
                >
                    + Nuevo Material
                </button>
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Nombre
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Categoría
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Stock
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Precio Negro
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Precio Zintro
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {materials.map((material) => (
                            <tr key={material.id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap font-medium">{material.name}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{material.category}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${material.stock > 0 ? 'text-green-900' : 'text-red-900'}`}>
                                        <span aria-hidden className={`absolute inset-0 ${material.stock > 0 ? 'bg-green-200' : 'bg-red-200'} opacity-50 rounded-full`}></span>
                                        <span className="relative">{material.stock}</span>
                                    </span>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">${material.price_black}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">${material.price_zintro}</p>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View: Cards */}
            <div className="md:hidden grid grid-cols-1 gap-4">
                {materials.map((material) => (
                    <div key={material.id} className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">{material.name}</h3>
                                <p className="text-sm text-gray-500">{material.category}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${material.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                Stock: {material.stock}
                            </span>
                        </div>
                        <div className="mt-4 flex justify-between items-center text-sm">
                            <div>
                                <p className="text-gray-600">Negro:</p>
                                <p className="font-semibold text-gray-800">${material.price_black}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Zintro:</p>
                                <p className="font-semibold text-gray-800">${material.price_zintro}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Material Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Agregar Nuevo Material</h2>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Input
                                label="Nombre"
                                placeholder="Ej. PTR 2x2 Cal 14"
                                {...register('name', { required: 'Requerido' })}
                                error={errors.name}
                            />
                            <Input
                                label="Categoría"
                                placeholder="Ej. PTR, Tubular, Solera"
                                {...register('category', { required: 'Requerido' })}
                                error={errors.category}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Precio Negro"
                                    type="number"
                                    step="0.01"
                                    {...register('price_black', { required: 'Requerido' })}
                                    error={errors.price_black}
                                />
                                <Input
                                    label="Precio Zintro"
                                    type="number"
                                    step="0.01"
                                    {...register('price_zintro', { required: 'Requerido' })}
                                    error={errors.price_zintro}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Largo (m)"
                                    type="number"
                                    step="0.01"
                                    defaultValue="6.00"
                                    {...register('length')}
                                />
                                <Input
                                    label="Stock Inicial"
                                    type="number"
                                    {...register('stock', { required: 'Requerido' })}
                                    error={errors.stock}
                                />
                            </div>
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

export default MaterialsPage;
