import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import {
    LayoutDashboard,
    Calculator,
    Users,
    Package,
    Settings,
    LogOut,
    Menu,
    X,
    KanbanSquare,
    ClipboardList
} from 'lucide-react';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Cotizador', href: '/quoter', icon: Calculator },
        { name: 'Materiales', href: '/materials', icon: Package },
        { name: 'Producción', href: '/kanban', icon: KanbanSquare },
        { name: 'Historial', href: '/history', icon: ClipboardList },
        { name: 'Clientes', href: '/clients', icon: Users },
        { name: 'Configuración', href: '/settings', icon: Settings },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            {/* Mobile Header */}
            <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center fixed w-full top-0 z-20 shadow-md">
                <div className="font-bold text-xl tracking-tight">Hierro & Fuego</div>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-1">
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-10 w-64 bg-slate-900 text-slate-300 transform transition-transform duration-300 ease-in-out shadow-xl
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0
            `}>
                <div className="h-full flex flex-col">
                    {/* Logo */}
                    <div className="h-20 flex items-center px-8 border-b border-slate-800">
                        <h1 className="text-2xl font-bold text-white tracking-tight">Hierro & Fuego</h1>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`
                                        flex items-center px-4 py-3 rounded-lg transition-all duration-200 group
                                        ${isActive(item.href)
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                            : 'hover:bg-slate-800 hover:text-white'}
                                    `}
                                >
                                    <Icon size={20} className={`mr-3 ${isActive(item.href) ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile & Logout */}
                    <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                                    {user?.name?.charAt(0) || 'U'}
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-white">{user?.name || 'Usuario'}</p>
                                    <p className="text-xs text-slate-500 truncate max-w-[100px]">{user?.email}</p>
                                </div>
                            </div>
                            <div className="md:flex hidden">
                                <ThemeToggle />
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors text-sm font-medium"
                        >
                            <LogOut size={16} className="mr-2" />
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-0 md:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col md:pl-64 min-h-screen transition-all duration-300">
                <main className="flex-1 p-6 md:p-8 pt-20 md:pt-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
