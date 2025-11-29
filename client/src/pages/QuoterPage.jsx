import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { useForm } from 'react-hook-form';
// import { useReactToPrint } from 'react-to-print'; // Comentado para evitar error en preview
import { useNavigate, Link } from 'react-router-dom';
import {
    Calculator,
    Plus,
    Trash2,
    User,
    FileText,
    Save,
    Package,
    Ruler,
    Layers,
    DollarSign,
    ShoppingCart
} from 'lucide-react';

// --- MOCKS PARA VISTA PREVIA (ELIMINAR EN TU PROYECTO REAL) ---
const mockUser = { name: 'Admin' };
const AuthContext = createContext({ user: mockUser });
const useAuth = () => useContext(AuthContext);
const LinkMock = ({ children, className }) => <span className={className}>{children}</span>; // Mock de Link
const QuotePDFTemplateMock = () => <div className="p-4 border">PDF Template Content</div>; // Mock de PDF

// Datos de prueba
const mockMaterials = [
    { id: 1, name: 'PTR 2x2 Cal 14', price_black: 450.50, price_zintro: 520.00 },
    { id: 2, name: 'Solera 1/2 x 1/8', price_black: 120.00, price_zintro: 145.00 },
    { id: 3, name: 'Angulo 1"', price_black: 200.00, price_zintro: 230.00 },
];
const mockClients = [
    { id: 1, name: 'Constructora del Norte' },
    { id: 2, name: 'Arq. Juan Pérez' },
];

const api = {
    get: (url) => {
        if (url === '/materials') return Promise.resolve({ data: mockMaterials });
        if (url === '/clients') return Promise.resolve({ data: mockClients });
        return Promise.resolve({ data: [] });
    },
    post: () => Promise.resolve({ data: { id: 999, status: 'saved' } })
};
// -----------------------------------------------------------------

/* EN TU CÓDIGO REAL:
   1. Elimina los MOCKS de arriba.
   2. Descomenta y usa tus imports originales:
*/
// import api from '../api';
// import QuotePDFTemplate from '../components/QuotePDFTemplate';
// import { useAuth } from '../context/AuthContext';
// import { useReactToPrint } from 'react-to-print'; // Asegúrate de tener instalado este paquete

const QuoterPage = () => {
    // Estado original
    const [materials, setMaterials] = useState([]);
    const [clients, setClients] = useState([]);
    const [cart, setCart] = useState([]);
    const [totalCost, setTotalCost] = useState(0);
    const [isZintro, setIsZintro] = useState(false); // Nota: Mantengo esto aunque no lo usabas en el form original directamente
    const [selectedClientId, setSelectedClientId] = useState('');
    const [projectName, setProjectName] = useState('');
    const [savedProject, setSavedProject] = useState(null);

    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
    const componentRef = useRef();

    // Mocks para demo (usar hooks reales en prod)
    const navigate = (path) => console.log('Navigate to:', path);
    const { user } = useAuth();

    // Watch para calcular precio dinámico en el formulario
    const watchedMaterialId = watch('materialId');
    const watchedFinish = watch('finish');

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

    const onSubmit = (data) => {
        const material = materials.find(m => m.id === parseInt(data.materialId));
        if (!material) return;

        const totalLinearMeters = (parseFloat(data.length) * parseInt(data.quantity)) / 100; // cm a m
        const bars = calculateBars(totalLinearMeters);
        const price = data.finish === 'Zintro' ? Number(material.price_zintro) : Number(material.price_black);
        const cost = bars * price;

        setCart([...cart, {
            ...data,
            name: material.name,
            materialName: material.name,
            linear_meters: totalLinearMeters,
            bars: bars,
            unitPrice: price, // Agregado para mostrar precio unitario
            cost: cost,
            id: Date.now()
        }]);
        reset({
            materialId: '',
            finish: 'Negro',
            length: '',
            quantity: ''
        });
    };

    const removeItem = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    // MODIFICADO PARA PREVIEW: Usamos window.print en lugar de useReactToPrint
    const handlePrint = () => {
        /* EN PRODUCCIÓN USARÍAS:
        useReactToPrint({
            content: () => componentRef.current,
            documentTitle: `Cotizacion_${new Date().toISOString().slice(0, 10)}`,
        });
        */
        window.print();
        alert("En producción, esto generaría el PDF específico usando react-to-print.");
    };

    const handleSaveProject = async () => {
        if (!selectedClientId) {
            alert('Por favor seleccione un cliente');
            return;
        }
        if (!projectName.trim()) {
            alert('Por favor ingrese un nombre para el proyecto');
            return;
        }

        try {
            const response = await api.post('/projects', {
                clientId: parseInt(selectedClientId),
                name: projectName,
                isZintro: isZintro,
                items: cart.map(item => ({
                    materialId: parseInt(item.materialId),
                    linear_meters: parseFloat(item.linear_meters),
                    finish: item.finish
                }))
            });
            alert('Proyecto guardado exitosamente');
            setSavedProject(response.data);
            setCart([]);
            setTotalCost(0);
            setProjectName('');
            setSelectedClientId('');
        } catch (error) {
            console.error('Error saving project:', error);
            alert('Error al guardar el proyecto');
        }
    };

    const selectedClient = clients.find(c => c.id === parseInt(selectedClientId));

    // Helper para obtener precio actual seleccionado en el form
    const getCurrentMaterialPrice = () => {
        if (!watchedMaterialId) return null;
        const mat = materials.find(m => m.id === parseInt(watchedMaterialId));
        if (!mat) return null;
        return watchedFinish === 'Zintro' ? mat.price_zintro : mat.price_black;
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-4 md:p-8 transition-colors duration-300">

            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <Calculator className="text-blue-600 h-8 w-8" />
                        Cotizador de Proyectos
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Calcula materiales, costos y genera presupuestos al instante.
                    </p>
                </div>
                <div className="flex gap-2">
                    {/* Botones de acción global si fueran necesarios */}
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* COLUMNA IZQUIERDA (Formulario y Lista) - Ocupa 8/12 columnas */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Tarjeta de Agregar Material */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <Package className="text-blue-500" size={20} />
                                Agregar Material
                            </h2>
                            {getCurrentMaterialPrice() && (
                                <span className="text-sm font-medium px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-full">
                                    Precio Base: ${getCurrentMaterialPrice()} / barra
                                </span>
                            )}
                        </div>

                        <div className="p-6">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Material Select */}
                                    <div className="col-span-1 md:col-span-2">
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                            Material
                                        </label>
                                        <div className="relative">
                                            <select
                                                {...register('materialId', { required: 'Seleccione un material' })}
                                                className="w-full pl-4 pr-10 py-3 rounded-xl border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none"
                                            >
                                                <option value="">Seleccionar material del catálogo...</option>
                                                {materials.map(m => (
                                                    <option key={m.id} value={m.id}>
                                                        {m.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400">
                                                <Package size={18} />
                                            </div>
                                        </div>
                                        {errors.materialId && <span className="text-red-500 text-xs mt-1 block">{errors.materialId.message}</span>}
                                    </div>

                                    {/* Acabado */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                            Acabado
                                        </label>
                                        <div className="relative">
                                            <select
                                                {...register('finish', { required: 'Seleccione un acabado' })}
                                                className="w-full pl-4 pr-10 py-3 rounded-xl border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none"
                                            >
                                                <option value="Negro">Negro (Económico)</option>
                                                <option value="Zintro">Zintro (Galvanizado)</option>
                                            </select>
                                            <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400">
                                                <Layers size={18} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cantidad */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                            Cantidad de Piezas
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                {...register('quantity', { required: 'Requerido', min: 1 })}
                                                className="w-full pl-4 pr-10 py-3 rounded-xl border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                                placeholder="Ej. 10"
                                            />
                                            <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400">
                                                <span className="text-xs font-bold">PZAS</span>
                                            </div>
                                        </div>
                                        {errors.quantity && <span className="text-red-500 text-xs mt-1 block">{errors.quantity.message}</span>}
                                    </div>

                                    {/* Longitud */}
                                    <div className="col-span-1 md:col-span-2">
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                            Longitud por Pieza (cm)
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                step="0.01"
                                                {...register('length', { required: 'Requerido', min: 1 })}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                                placeholder="Ej. 150"
                                            />
                                            <div className="absolute left-3 top-3.5 pointer-events-none text-slate-400">
                                                <Ruler size={18} />
                                            </div>
                                        </div>
                                        {errors.length && <span className="text-red-500 text-xs mt-1 block">{errors.length.message}</span>}
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2 active:scale-95"
                                    >
                                        <Plus size={20} />
                                        Agregar a la Lista
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Lista de Materiales (Cart) */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden min-h-[200px] flex flex-col">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                                <ShoppingCart className="text-slate-400" size={20} />
                                Materiales Agregados
                            </h3>
                            <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold px-2 py-1 rounded-md">
                                {cart.length} Items
                            </span>
                        </div>

                        {cart.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-400">
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-full mb-4">
                                    <ShoppingCart size={32} opacity={0.5} />
                                </div>
                                <p className="text-center font-medium">La lista está vacía</p>
                                <p className="text-sm text-center mt-1 opacity-70">Agrega materiales usando el formulario de arriba.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50 dark:bg-slate-700/30 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                                        <tr>
                                            <th className="p-4 rounded-tl-lg">Descripción</th>
                                            <th className="p-4 text-center">Cant.</th>
                                            <th className="p-4 text-center">Acabado</th>
                                            <th className="p-4 text-right">Barras (6m)</th>
                                            <th className="p-4 text-right">Subtotal</th>
                                            <th className="p-4 rounded-tr-lg w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                        {cart.map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors group">
                                                <td className="p-4">
                                                    <div className="font-bold text-slate-800 dark:text-slate-200">{item.materialName}</div>
                                                    <div className="text-xs text-slate-500 mt-0.5">Corte a: {item.length} cm</div>
                                                </td>
                                                <td className="p-4 text-center font-mono text-sm text-slate-600 dark:text-slate-400">
                                                    {item.quantity}
                                                </td>
                                                <td className="p-4 text-center">
                                                    <span className={`text-xs px-2 py-1 rounded-full font-medium border ${item.finish === 'Zintro'
                                                            ? 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-900'
                                                            : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600'
                                                        }`}>
                                                        {item.finish}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right font-mono text-sm">
                                                    {item.bars}
                                                </td>
                                                <td className="p-4 text-right font-bold text-slate-800 dark:text-slate-200">
                                                    ${item.cost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="p-4 text-center">
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* COLUMNA DERECHA (Resumen) - Ocupa 4/12 columnas */}
                <div className="lg:col-span-4 space-y-6">

                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 sticky top-6">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <FileText className="text-blue-600" />
                            Resumen del Proyecto
                        </h2>

                        {/* Total Grande */}
                        <div className="text-center py-6 bg-slate-50 dark:bg-slate-700/30 rounded-xl mb-6 border border-slate-100 dark:border-slate-700">
                            <span className="text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400 font-semibold">Costo Estimado</span>
                            <div className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2 flex justify-center items-start gap-1">
                                <span className="text-xl mt-1 text-slate-400">$</span>
                                {totalCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    <User size={16} /> Cliente
                                </label>
                                <div className="flex gap-2">
                                    <select
                                        value={selectedClientId}
                                        onChange={(e) => setSelectedClientId(e.target.value)}
                                        className="flex-1 rounded-xl border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-sm py-2.5 px-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="">Seleccionar Cliente...</option>
                                        {clients.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                    <LinkMock to="/clients" className="flex items-center justify-center w-10 bg-blue-100 hover:bg-blue-200 text-blue-600 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-300 rounded-xl transition-colors">
                                        <Plus size={18} />
                                    </LinkMock>
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    <FileText size={16} /> Nombre del Proyecto
                                </label>
                                <input
                                    type="text"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    className="w-full rounded-xl border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-sm py-2.5 px-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Ej. Reja Casa García"
                                />
                            </div>

                            <hr className="border-slate-100 dark:border-slate-700 my-4" />

                            <button
                                onClick={handleSaveProject}
                                disabled={cart.length === 0 || !projectName}
                                className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95"
                            >
                                <Save size={20} />
                                Guardar Proyecto
                            </button>

                            {savedProject && (
                                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-xl mt-4 animate-fade-in">
                                    <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-bold mb-2">
                                        <Save size={16} /> Guardado
                                    </div>
                                    <p className="text-xs text-green-600 dark:text-green-300 mb-3">
                                        El proyecto ha sido guardado exitosamente.
                                    </p>
                                    {/* Aquí iría tu componente real de PDF, usando el mock para evitar errores de renderizado en demo */}
                                    <button
                                        onClick={handlePrint}
                                        className="w-full bg-white dark:bg-slate-800 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-xs font-bold py-2 px-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors"
                                    >
                                        Descargar PDF
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            {/* Hidden PDF Template Container */}
            <div className="hidden">
                {/* Aquí deberías usar tu componente real <QuotePDFTemplate />. Usamos el mock para la demo */}
                <div ref={componentRef}>
                    <QuotePDFTemplateMock
                        items={cart}
                        totalCost={totalCost}
                        user={user}
                        client={selectedClient}
                    />
                </div>
            </div>
        </div>
    );
};

export default QuoterPage;