import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { ArrowLeft } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const RegisterPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = React.useState('');

    const onSubmit = async (data) => {
        const result = await registerUser(data.email, data.password, data.company_name);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 transition-colors duration-300 relative">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>

            <div className="max-w-md w-full bg-white dark:bg-slate-800 shadow-lg rounded-xl p-8 border border-slate-200 dark:border-slate-700">
                <div className="mb-6">
                    <Link to="/" className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">
                        <ArrowLeft size={16} className="mr-2" />
                        Volver al Inicio
                    </Link>
                </div>

                <h2 className="text-3xl font-bold text-center mb-2 text-slate-900 dark:text-white">IronManage</h2>
                <h3 className="text-xl font-medium text-center mb-8 text-slate-500 dark:text-slate-400">Crear Cuenta</h3>

                {error && <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Nombre de la Herrería"
                        type="text"
                        placeholder="Ej. Herrería El Yunque"
                        {...register('company_name')}
                        error={errors.company_name}
                    />
                    <Input
                        label="Email"
                        type="email"
                        placeholder="tu@email.com"
                        {...register('email', { required: 'El email es requerido' })}
                        error={errors.email}
                    />
                    <Input
                        label="Contraseña"
                        type="password"
                        placeholder="********"
                        {...register('password', { required: 'La contraseña es requerida', minLength: { value: 6, message: 'Mínimo 6 caracteres' } })}
                        error={errors.password}
                    />

                    <Button type="submit" className="w-full mt-2">
                        Registrarse
                    </Button>
                </form>

                <p className="mt-6 text-center text-slate-600 dark:text-slate-400">
                    ¿Ya tienes cuenta? <Link to="/login" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">Inicia Sesión</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
