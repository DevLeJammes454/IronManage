import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';

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
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">IronManage</h2>
                <h3 className="text-xl font-semibold text-center mb-6 text-gray-600">Crear Cuenta</h3>

                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

                <form onSubmit={handleSubmit(onSubmit)}>
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

                    <Button type="submit" className="mt-4">
                        Registrarse
                    </Button>
                </form>

                <p className="mt-4 text-center text-gray-600">
                    ¿Ya tienes cuenta? <Link to="/login" className="text-blue-600 hover:underline">Inicia Sesión</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
