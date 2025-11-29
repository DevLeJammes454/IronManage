import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    Search,
    Plus,
    Package,
    MoreVertical,
    X,
    AlertTriangle,
    CheckCircle
} from 'lucide-react';
import api from '../api';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';

const MATERIAL_CATEGORIES = [
    { value: 'PTR', label: 'PTR' },
    { value: 'Tubular', label: 'Tubular' },
    { value: 'Solera', label: 'Solera' },
    { value: 'Ángulo', label: 'Ángulo' },
    { value: 'Cuadrado', label: 'Cuadrado Macizo' },
    { value: 'Redondo', label: 'Redondo Macizo' },
    { value: 'Lámina', label: 'Lámina' },
    { value: 'Placa', label: 'Placa' },
    { value: 'Viga', label: 'Viga IPR/IPS' },
    { value: 'Canal', label: 'Canal CPS' },
    { value: 'Varilla', label: 'Varilla Corrugada' },
    { value: 'Malla', label: 'Malla Electrosoldada' },
    { value: 'Consumible', label: 'Consumible' },
    { value: 'Otro', label: 'Otro' },
];

const MaterialsPage = () => {
    const [materials, setMaterials] = useState([]);
    const [filteredMaterials, setFilteredMaterials] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const fetchMaterials = async () => {
        try {
            const res = await api.get('/materials');
            setMaterials(res.data);
            setFilteredMaterials(res.data);
        } catch (error) {
            console.error('Error fetching materials:', error);
        }
    };

    useEffect(() => {
        fetchMaterials();
    }, []);

    // Efecto para búsqueda en tiempo real
    useEffect(() => {
        const results = materials.filter(material =>
            material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            material.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMaterials(results);
    }, [searchTerm, materials]);

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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 p-4 md:p-8">

            {/* Header Section */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Package className="text-blue-600" />
                        Inventario
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Gestión de materiales y existencias</p>
                </div>

                <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                    {/* Barra de Búsqueda */}
                    <div className="relative group w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar material..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg leading-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow shadow-sm"
                        />
                    </div>

                    <Button onClick={() => setShowModal(true)}>
                        <Plus size={18} />
                        Nuevo Material
                    </Button>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto">

                {/* Desktop View: Styled Table */}
                <div className="hidden md:block bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                {['Nombre', 'Categoría', 'Stock', 'Precio Negro', 'Precio Zintro', ''].map((header) => (
                                    <th key={header} className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                            {filteredMaterials.map((material) => (
                                <tr key={material.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-slate-900 dark:text-white">{material.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                                            {material.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={`flex items-center gap-1.5 text-sm font-bold ${material.stock > 10 ? 'text-green-600 dark:text-green-400' : material.stock > 0 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-500'}`}>
                                            {material.stock > 10 ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                                            {material.stock}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300 font-mono">
                                        ${parseFloat(material.price_black).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300 font-mono">
                                        ${parseFloat(material.price_zintro).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredMaterials.length === 0 && (
                        <div className="p-12 text-center text-slate-400">
                            <Package className="mx-auto h-12 w-12 opacity-50 mb-3" />
                            <p>No se encontraron materiales.</p>
                        </div>
                    )}
                </div>

                {/* Mobile View: Enhanced Cards */}
                <div className="md:hidden space-y-4">
                    {filteredMaterials.map((material) => (
                        <div key={material.id} className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden">
                            {/* Borde de color basado en stock */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${material.stock > 0 ? 'bg-blue-500' : 'bg-red-500'}`}></div>

                            <div className="flex justify-between items-start mb-3 pl-3">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{material.name}</h3>
                                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded mt-1 inline-block">
                                        {material.category}
                                    </span>
                                </div>
                                <div className={`flex flex-col items-end ${material.stock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                                    <span className="text-xs uppercase font-bold tracking-wider opacity-70">Stock</span>
                                    <span className="text-xl font-bold leading-none">{material.stock}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pl-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Precio Negro</p>
                                    <p className="font-mono font-bold text-slate-700 dark:text-slate-200">${parseFloat(material.price_black).toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Precio Zintro</p>
                                    <p className="font-mono font-bold text-slate-700 dark:text-slate-200">${parseFloat(material.price_zintro).toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredMaterials.length === 0 && (
                        <div className="p-8 text-center text-slate-400 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                            <p>No hay resultados</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Material Modal with improved Backdrop and Layout */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setShowModal(false)}></div>

                    <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-700 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Plus className="text-blue-600" size={24} />
                                Nuevo Material
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                <Input
                                    label="Nombre del Material"
                                    placeholder="Ej. PTR 2x2 Cal 14"
                                    {...register('name', { required: 'El nombre es obligatorio' })}
                                    error={errors.name}
                                />

                                <Select
                                    label="Categoría"
                                    options={MATERIAL_CATEGORIES}
                                    {...register('category', { required: 'La categoría es obligatoria' })}
                                    error={errors.category}
                                />

                                <div className="grid grid-cols-2 gap-5">
                                    <Input
                                        label="Precio Negro ($)"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        {...register('price_black', { required: 'Requerido' })}
                                        error={errors.price_black}
                                    />
                                    <Input
                                        label="Precio Zintro ($)"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        {...register('price_zintro', { required: 'Requerido' })}
                                        error={errors.price_zintro}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-5">
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
                                        placeholder="0"
                                        {...register('stock', { required: 'Requerido' })}
                                        error={errors.stock}
                                    />
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
                                        Guardar Material
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

export default MaterialsPage;