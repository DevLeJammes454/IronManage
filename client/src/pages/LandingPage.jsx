import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    LayoutDashboard,
    Calculator,
    Package,
    Users,
    CheckCircle,
    BarChart3,
    ShieldCheck,
    Zap,
    Menu,
    X,
    ArrowRight,
    Moon,
    Sun,
    Hammer,
    ChevronRight
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

// --- COMPONENTE LANDING PAGE ---
const LandingPage = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans selection:bg-blue-500 selection:text-white">

            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        {/* Logo */}
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                                <Hammer size={20} fill="currentColor" />
                            </div>
                            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                                Iron<span className="text-blue-600">Manage</span>
                            </span>
                        </div>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Características</a>
                            <a href="#testimonials" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Testimonios</a>
                            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
                            <ThemeToggle />
                            <Link to="/login" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                                Iniciar Sesión
                            </Link>
                            <Link
                                to="/register"
                                className="bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-blue-500/10 transition-all hover:-translate-y-0.5"
                            >
                                Prueba Gratis
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex md:hidden items-center gap-4">
                            <ThemeToggle />
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="text-slate-600 dark:text-slate-300"
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-4 shadow-xl animate-in slide-in-from-top-5">
                        <a href="#features" className="block text-base font-medium text-slate-600 dark:text-slate-300 py-2">Características</a>
                        <Link to="/login" className="block text-base font-medium text-slate-600 dark:text-slate-300 py-2">Iniciar Sesión</Link>
                        <Link to="/register" className="block w-full text-center bg-blue-600 text-white font-bold py-3 rounded-lg">
                            Comenzar Ahora
                        </Link>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0 opacity-40 dark:opacity-20 pointer-events-none">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-20 blur-[100px]"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    <div className="flex-1 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wide mb-6 border border-blue-100 dark:border-blue-800 animate-fade-in">
                            <Zap size={14} fill="currentColor" /> Nueva versión 2.0 disponible
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
                            El sistema operativo para tu <br className="hidden lg:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                                Taller de Herrería
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            IronManage elimina el caos de las cotizaciones y el inventario. Digitaliza tu negocio, reduce el desperdicio y entrega tus proyectos a tiempo.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link
                                to="/register"
                                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold px-8 py-4 rounded-xl shadow-lg shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-200"
                            >
                                Empezar Gratis <ArrowRight size={20} />
                            </Link>
                            <Link
                                to="/login"
                                className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-white text-lg font-semibold px-8 py-4 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
                            >
                                Ver Demo
                            </Link>
                        </div>

                        <div className="mt-10 flex items-center justify-center lg:justify-start gap-4 text-sm text-slate-500 dark:text-slate-400">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-900"></div>
                                ))}
                            </div>
                            <p>Usado por <span className="font-bold text-slate-700 dark:text-slate-200">+500 talleres</span> en México.</p>
                        </div>
                    </div>

                    {/* Hero Visual / Dashboard Preview */}
                    <div className="flex-1 w-full max-w-xl lg:max-w-full relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-30 animate-pulse"></div>
                        <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                            {/* Mockup Header */}
                            <div className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 p-4 flex items-center gap-4">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                </div>
                                <div className="h-2 w-32 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                            </div>
                            {/* Mockup Body */}
                            <div className="p-6 grid gap-6">
                                <div className="flex gap-4">
                                    <div className="flex-1 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 p-4">
                                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-lg mb-2"></div>
                                        <div className="h-2 w-16 bg-blue-200 dark:bg-blue-700 rounded mb-1"></div>
                                        <div className="h-6 w-12 bg-blue-300 dark:bg-blue-600 rounded"></div>
                                    </div>
                                    <div className="flex-1 h-24 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800 p-4">
                                        <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-lg mb-2"></div>
                                        <div className="h-2 w-16 bg-green-200 dark:bg-green-700 rounded mb-1"></div>
                                        <div className="h-6 w-20 bg-green-300 dark:bg-green-600 rounded"></div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded"></div>
                                    <div className="h-2 w-5/6 bg-slate-100 dark:bg-slate-700 rounded"></div>
                                    <div className="h-2 w-4/6 bg-slate-100 dark:bg-slate-700 rounded"></div>
                                </div>
                                <div className="h-32 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center justify-center">
                                    <BarChart3 className="text-slate-300 dark:text-slate-600 w-16 h-16" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div id="features" className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-sm font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase mb-2">
                            Características Principales
                        </h2>
                        <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
                            Todo lo que necesitas para crecer tu taller
                        </h3>
                        <p className="text-lg text-slate-500 dark:text-slate-400">
                            Diseñado por expertos en metalmecánica para resolver los problemas reales del día a día.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Calculator,
                                title: 'Cotizador Inteligente',
                                desc: 'Calcula costos de materiales lineales (PTR, Viga), mano de obra y desperdicios automáticamente.'
                            },
                            {
                                icon: Package,
                                title: 'Control de Inventario',
                                desc: 'Rastrea perfiles, láminas y consumibles. Gestiona retazos utilizables y recibe alertas de stock.'
                            },
                            {
                                icon: LayoutDashboard,
                                title: 'Dashboard en Tiempo Real',
                                desc: 'Visualiza tus ventas, proyectos activos y ganancias con gráficas claras y actualizadas.'
                            },
                            {
                                icon: Users,
                                title: 'CRM de Clientes',
                                desc: 'Mantén un registro detallado de tus clientes, historial de proyectos y estados de cuenta.'
                            },
                            {
                                icon: CheckCircle,
                                title: 'Seguimiento de Proyectos',
                                desc: 'Kanban para controlar el estado de cada trabajo, desde el corte hasta la instalación.'
                            },
                            {
                                icon: ShieldCheck,
                                title: 'Datos Seguros',
                                desc: 'Tus cotizaciones y diseños están protegidos en la nube. Accede desde cualquier lugar.'
                            }
                        ].map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div key={index} className="group bg-slate-50 dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300">
                                    <div className="bg-white dark:bg-slate-700 rounded-xl p-3 w-fit mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                        <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-slate-900 relative overflow-hidden py-24">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                    <div className="absolute -top-[50%] -left-[10%] w-[500px] h-[500px] rounded-full bg-blue-600 blur-[120px] opacity-20"></div>
                    <div className="absolute bottom-[0%] right-[0%] w-[400px] h-[400px] rounded-full bg-cyan-500 blur-[100px] opacity-20"></div>
                </div>

                <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        ¿Listo para modernizar tu taller?
                    </h2>
                    <p className="text-xl text-slate-300 mb-10">
                        Únete a IronManage hoy y recupera el control de tu tiempo y dinero.
                        Empieza con 14 días gratis, sin tarjeta de crédito.
                    </p>
                    <Link
                        to="/register"
                        className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-lg font-bold px-10 py-4 rounded-xl shadow-lg shadow-blue-900/50 transform hover:scale-105 transition-all duration-200"
                    >
                        Comenzar Prueba Gratuita <ChevronRight />
                    </Link>
                    <p className="mt-4 text-sm text-slate-500">
                        Cancela cuando quieras. Soporte incluido.
                    </p>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 py-12 border-t border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col items-center md:items-start">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="bg-blue-600 p-1 rounded-md text-white">
                                <Hammer size={16} fill="currentColor" />
                            </div>
                            <span className="text-lg font-bold text-slate-900 dark:text-white">
                                Iron<span className="text-blue-600">Manage</span>
                            </span>
                        </div>
                        <p className="text-sm">© {new Date().getFullYear()} IronManage Inc.</p>
                    </div>

                    <div className="flex gap-8 text-sm font-medium">
                        <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Términos</a>
                        <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacidad</a>
                        <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Soporte</a>
                    </div>

                    <div className="flex gap-4">
                        {/* Social Icons placeholders */}
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors cursor-pointer">
                            <span className="font-bold text-xs">Tw</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors cursor-pointer">
                            <span className="font-bold text-xs">Fb</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;