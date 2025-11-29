import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useReactToPrint } from 'react-to-print';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Button from '../components/Button';
import Input from '../components/Input';
import QuotePDFTemplate from '../components/QuotePDFTemplate';
import { useAuth } from '../context/AuthContext';

const QuoterPage = () => {
    const [materials, setMaterials] = useState([]);
    const [clients, setClients] = useState([]);
    const [cart, setCart] = useState([]);
    const [totalCost, setTotalCost] = useState(0);
    const [isZintro, setIsZintro] = useState(false);
    const [selectedClientId, setSelectedClientId] = useState('');
    const { register, handleSubmit, reset } = useForm();
    const componentRef = useRef();
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [materialsRes, clientsRes] = await Promise.all([
                    api.get('/materials'),
                    api.get('/clients')
                ]);
                setMaterials(materialsRes.data);
                setClients(clientsRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const calculateBars = (linearMeters) => {
        return Math.ceil(parseFloat(linearMeters) / 6.0);
    };

    useEffect(() => {
        const total = cart.reduce((sum, item) => sum + item.cost, 0);
        setTotalCost(total);
    }, [cart]);

    const addToCart = (data) => {
        const material = materials.find(m => m.id === parseInt(data.materialId));
        if (!material) return;

        const bars = calculateBars(data.linear_meters);
        const price = isZintro ? Number(material.price_zintro) : Number(material.price_black);
        const cost = bars * price;

        setCart([...cart, {
            ...data,
            name: material.name,
            bars: bars,
            cost: cost,
            id: Date.now()
        }]);
        reset();
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Cotizacion_${new Date().toISOString().slice(0, 10)}`,
    });

    const saveProject = async () => {
        if (!selectedClientId) {
            alert('Por favor seleccione un cliente');
            return;
        }

        try {
            await api.post('/projects', {
                clientId: parseInt(selectedClientId),
                isZintro,
                items: cart.map(item => ({
                    materialId: parseInt(item.materialId),
                    linear_meters: parseFloat(item.linear_meters)
                }))
            });
            alert('Proyecto guardado exitosamente');
            setCart([]);
            setTotalCost(0);
            navigate('/');
        } catch (error) {
            console.error('Error saving project:', error);
            alert('Error al guardar el proyecto');
        }
    };

    const selectedClient = clients.find(c => c.id === parseInt(selectedClientId));

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Cotizador de Proyectos</h1>

            {/* Global Config */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-col w-full md:w-auto gap-2">
                    <label className="text-sm font-medium text-slate-700">Seleccionar Cliente</label>
                    <select
                        value={selectedClientId}
                        onChange={(e) => setSelectedClientId(e.target.value)}
                        className="shadow-sm border border-slate-300 rounded-lg py-2.5 px-3 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Seleccione un Cliente...</option>
                        {clients.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center bg-slate-100 p-1 rounded-lg">
                    <button
                        onClick={() => setIsZintro(false)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${!isZintro ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Negro
                    </button>
                    <button
                        onClick={() => setIsZintro(true)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${isZintro ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Zintro
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Add Item Form */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-fit">
                    <h2 className="text-xl font-bold mb-6 text-slate-900">Agregar Material</h2>
                    <form onSubmit={handleSubmit(addToCart)} className="space-y-4">
                        <div>
                            <label className="block text-slate-700 text-sm font-medium mb-2">Material</label>
                            <select
                                {...register('materialId', { required: true })}
                                className="shadow-sm border border-slate-300 rounded-lg w-full py-2.5 px-4 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Seleccione...</option>
                                {materials.map(m => (
                                    <option key={m.id} value={m.id}>{m.name} ({m.category})</option>
                                ))}
                            </select>
                        </div>
                        <Input
                            label="Metros Lineales Requeridos"
                            type="number"
                            step="0.01"
                            {...register('linear_meters', { required: true, min: 0.1 })}
                        />
                        <div className="pt-2">
                            <Button type="submit">Agregar a la Lista</Button>
                        </div>
                    </form>
                </div>

                {/* Cart & Summary */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
                    <h2 className="text-xl font-bold mb-6 text-slate-900">Resumen del Proyecto</h2>

                    <div className="flex-1 overflow-y-auto max-h-[400px] pr-2">
                        {cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <p>No hay items agregados.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cart.map(item => (
                                    <div key={item.id} className="flex justify-between items-start p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <div>
                                            <p className="font-semibold text-slate-900">{item.name}</p>
                                            <p className="text-sm text-slate-500 mt-1">
                                                {item.linear_meters}m → <span className="font-medium text-blue-600">{item.bars} barras</span>
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-slate-900">${item.cost.toFixed(2)}</p>
                                            <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-500 hover:text-red-700 font-medium mt-1">Eliminar</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-8 border-t border-slate-200 pt-6">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-lg font-medium text-slate-600">Total Estimado</span>
                            <span className="text-3xl font-bold text-slate-900">${totalCost.toFixed(2)}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {cart.length > 0 && (
                                <>
                                    <Button onClick={saveProject} className="bg-green-600 hover:bg-green-700">
                                        Guardar
                                    </Button>
                                    <Button onClick={handlePrint} className="bg-slate-800 hover:bg-slate-900">
                                        Imprimir PDF
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Hidden PDF Template */}
            <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                <QuotePDFTemplate
                    ref={componentRef}
                    items={cart}
                    totalCost={totalCost}
                    user={user}
                    client={selectedClient}
                />
            </div>
        </div>
    );
};

export default QuoterPage;
