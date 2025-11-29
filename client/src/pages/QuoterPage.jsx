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
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Cotizador de Proyectos</h1>

            {/* Global Config */}
            <div className="bg-white p-6 rounded-lg shadow mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <span className="text-lg font-semibold text-gray-700">Cliente:</span>
                    <select
                        value={selectedClientId}
                        onChange={(e) => setSelectedClientId(e.target.value)}
                        className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="">Seleccione un Cliente...</option>
                        {clients.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center">
                    <span className={`mr-2 font-bold ${!isZintro ? 'text-black' : 'text-gray-400'}`}>Negro</span>
                    <div
                        className={`relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer ${isZintro ? 'bg-blue-600' : 'bg-gray-300'}`}
                        onClick={() => setIsZintro(!isZintro)}
                    >
                        <span className={`absolute left-0 inline-block w-6 h-6 bg-white border-2 border-gray-300 rounded-full transform transition-transform duration-200 ease-in-out ${isZintro ? 'translate-x-6 border-blue-600' : 'translate-x-0'}`}></span>
                    </div>
                    <span className={`ml-2 font-bold ${isZintro ? 'text-blue-600' : 'text-gray-400'}`}>Zintro</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Add Item Form */}
                <div className="bg-white p-6 rounded-lg shadow h-fit">
                    <h2 className="text-xl font-bold mb-4 text-gray-700">Agregar Material</h2>
                    <form onSubmit={handleSubmit(addToCart)}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Material</label>
                            <select
                                {...register('materialId', { required: true })}
                                className="shadow border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                        <Button type="submit">Agregar a la Lista</Button>
                    </form>
                </div>

                {/* Cart & Summary */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4 text-gray-700">Resumen del Proyecto</h2>
                    {cart.length === 0 ? (
                        <p className="text-gray-500">No hay items agregados.</p>
                    ) : (
                        <div className="space-y-4">
                            {cart.map(item => (
                                <div key={item.id} className="flex justify-between items-center border-b pb-2">
                                    <div>
                                        <p className="font-bold text-gray-800">{item.name}</p>
                                        <p className="text-sm text-gray-600">
                                            {item.linear_meters}m requeridos → <span className="font-bold text-blue-600">{item.bars} barras (6m)</span>
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-800">${item.cost.toFixed(2)}</p>
                                        <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-500 hover:underline">Eliminar</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-6 border-t pt-4">
                        <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                            <span>Total Estimado:</span>
                            <span>${totalCost.toFixed(2)}</span>
                        </div>
                        <div className="flex gap-2 mt-4">
                            {cart.length > 0 && (
                                <>
                                    <Button onClick={saveProject} className="bg-green-600 hover:bg-green-700 flex-1">
                                        Guardar Proyecto
                                    </Button>
                                    <Button onClick={handlePrint} className="bg-gray-800 hover:bg-gray-900 flex-1">
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
