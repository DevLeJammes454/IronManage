import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    Building,
    Save,
    Upload,
    MapPin,
    Phone,
    Percent,
    ArrowLeft,
    Mail,
    CreditCard,
    Loader2
} from 'lucide-react';

// --- MOCKS DE COMPONENTES UI ---
const Button = ({ children, className, variant = 'primary', loading, ...props }) => {
    const baseStyle = "font-bold py-3 px-6 rounded-xl shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed";
    const variants = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30",
        secondary: "bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200",
        outline: "border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
    };
    return (
        <button className={`${baseStyle} ${variants[variant]} ${className}`} disabled={loading} {...props}>
            {loading && <Loader2 className="animate-spin" size={18} />}
            {children}
        </button>
    );
};

const Input = React.forwardRef(({ label, error, icon: Icon, ...props }, ref) => (
    <div className="w-full">
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{label}</label>
        <div className="relative group">
            <input
                ref={ref}
                className={`w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white shadow-sm focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 py-3 px-4 ${Icon ? 'pl-11' : ''} outline-none transition-all ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
                {...props}
            />
            {Icon && (
                <div className="absolute left-3.5 top-3.5 pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <Icon size={20} />
                </div>
            )}
        </div>
        {error && <span className="text-red-500 text-xs mt-1 font-medium">{error.message}</span>}
    </div>
));

// --- MOCK API & HOOKS ---
const api = {
    defaults: { baseURL: 'https://api.midominio.com/api' },
    get: () => new Promise(resolve => setTimeout(() => resolve({
        data: {
            company_name: 'Herrería y Estructuras "El Forjador"',
            address: 'Av. Las Torres 123, Parque Industrial',
            phone: '55 8899 7766',
            email: 'contacto@elforjador.com',
            tax_rate: 16,
            tax_id: 'XAXX010101000',
            logo_url: null
        }
    }), 1000)),
    put: (url, data) => new Promise(resolve => setTimeout(() => resolve({ data }), 1500)),
    post: (url, data) => new Promise(resolve => setTimeout(() => resolve({
        data: { logo_url: '/uploads/logo-new.png' }
    }), 1000))
};

// Mock de navegación para preview
const useNavigateMock = () => (path) => console.log(`Navegando a: ${path}`);

// -----------------------------------------------------

const SettingsPage = () => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [logoPreview, setLogoPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigateMock();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/user/profile');
                const { company_name, address, phone, email, tax_rate, tax_id, logo_url } = res.data;

                setValue('company_name', company_name);
                setValue('address', address);
                setValue('phone', phone);
                setValue('email', email);
                setValue('tax_rate', tax_rate);
                setValue('tax_id', tax_id);

                if (logo_url) setLogoPreview(`${api.defaults.baseURL.replace('/api', '')}${logo_url}`);
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, [setValue]);

    const onSubmit = async (data) => {
        setIsSaving(true);
        try {
            await api.put('/user/settings', data);
            // Simulación de toast
            alert('¡Configuración guardada exitosamente!');
        } catch (error) {
            console.error('Error updating settings:', error);
            alert('Error al actualizar configuración');
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Preview inmediato
        const reader = new FileReader();
        reader.onloadend = () => {
            setLogoPreview(reader.result);
        };
        reader.readAsDataURL(file);

        const formData = new FormData();
        formData.append('logo', file);

        try {
            // En un caso real, subimos la imagen
            await api.post('/user/logo', formData);
        } catch (error) {
            console.error('Error uploading logo:', error);
            alert('Error al subir logo al servidor');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-blue-600" size={40} />
                    <p className="text-slate-500 font-medium">Cargando configuración...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 md:p-8 transition-colors duration-300">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center text-slate-500 hover:text-blue-600 transition-colors mb-2 text-sm font-bold group"
                        >
                            <ArrowLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                            Volver al Dashboard
                        </button>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            <Building className="text-blue-600" size={32} />
                            Configuración de Empresa
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            Administra los datos generales, logotipo y preferencias fiscales.
                        </p>
                    </div>

                    <Button onClick={handleSubmit(onSubmit)} loading={isSaving}>
                        <Save size={18} />
                        Guardar Cambios
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Columna Izquierda: Logo y Resumen */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Logotipo</h2>

                            <div className="flex flex-col items-center">
                                <div className="relative group cursor-pointer w-48 h-48 mb-6">
                                    <div className={`w-full h-full rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-all relative z-10 bg-slate-50 dark:bg-slate-900 ${logoPreview ? 'border-blue-500' : 'border-slate-300 dark:border-slate-600 hover:border-blue-400'}`}>
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-4" />
                                        ) : (
                                            <div className="text-center p-4">
                                                <div className="bg-blue-50 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-500">
                                                    <Upload size={24} />
                                                </div>
                                                <p className="text-sm text-slate-500 font-medium">Subir imagen</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Overlay de edición al hacer hover si ya hay logo */}
                                    {logoPreview && (
                                        <div className="absolute inset-0 bg-black/50 rounded-2xl z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            <p className="text-white font-bold text-sm flex items-center gap-2">
                                                <Upload size={16} /> Cambiar
                                            </p>
                                        </div>
                                    )}

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoUpload}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
                                    />
                                </div>
                                <p className="text-xs text-center text-slate-400">
                                    Recomendado: PNG transparente, 500x500px. Máx 5MB.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Columna Derecha: Formulario */}
                    <div className="lg:col-span-2 space-y-6">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                            {/* Sección Información General */}
                            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-8">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-4">
                                    <Building className="text-blue-500" size={20} />
                                    Información General
                                </h2>

                                <div className="space-y-5">
                                    <Input
                                        label="Nombre de la Empresa"
                                        placeholder="Ej. Herrería Los Arcos"
                                        icon={Building}
                                        {...register('company_name', { required: 'El nombre es requerido' })}
                                        error={errors.company_name}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <Input
                                            label="RFC / Tax ID"
                                            placeholder="XAXX010101000"
                                            icon={CreditCard}
                                            {...register('tax_id')}
                                        />
                                        <Input
                                            label="Impuesto / IVA (%)"
                                            type="number"
                                            step="0.01"
                                            icon={Percent}
                                            {...register('tax_rate')}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Sección Contacto */}
                            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-8">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-4">
                                    <MapPin className="text-green-500" size={20} />
                                    Datos de Contacto
                                </h2>

                                <div className="space-y-5">
                                    <Input
                                        label="Dirección Completa"
                                        placeholder="Calle, Número, Colonia, Ciudad"
                                        icon={MapPin}
                                        {...register('address')}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <Input
                                            label="Teléfono"
                                            placeholder="55 1234 5678"
                                            icon={Phone}
                                            {...register('phone')}
                                        />
                                        <Input
                                            label="Correo Electrónico"
                                            type="email"
                                            placeholder="contacto@empresa.com"
                                            icon={Mail}
                                            {...register('email')}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Botón flotante solo visible en móvil */}
                            <div className="md:hidden sticky bottom-4 z-10">
                                <Button type="submit" className="w-full shadow-xl" loading={isSaving}>
                                    <Save size={18} />
                                    Guardar Todo
                                </Button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;