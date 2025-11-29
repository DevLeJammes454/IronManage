import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api';
import Input from '../components/Input';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
    const { register, handleSubmit, setValue } = useForm();
    const [logoPreview, setLogoPreview] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/user/profile');
                const { company_name, address, phone, tax_rate, logo_url } = res.data;
                setValue('company_name', company_name);
                setValue('address', address);
                setValue('phone', phone);
                setValue('tax_rate', tax_rate);
                if (logo_url) setLogoPreview(`${api.defaults.baseURL.replace('/api', '')}${logo_url}`);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
        fetchProfile();
    }, [setValue]);

    const onSubmit = async (data) => {
        try {
            await api.put('/user/settings', data);
            alert('Configuración actualizada');
        } catch (error) {
            console.error('Error updating settings:', error);
            alert('Error al actualizar configuración');
        }
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('logo', file);

        try {
            const res = await api.post('/user/logo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setLogoPreview(`${api.defaults.baseURL.replace('/api', '')}${res.data.logo_url}`);
            alert('Logo subido exitosamente');
        } catch (error) {
            console.error('Error uploading logo:', error);
            alert('Error al subir logo');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Configuración de la Empresa</h1>
                    <button onClick={() => navigate('/')} className="text-blue-600 hover:underline">Volver al Dashboard</button>
                </div>

                <div className="mb-8 border-b pb-8">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Logo de la Empresa</h2>
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
                            {logoPreview ? (
                                <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
                            ) : (
                                <span className="text-gray-400 text-xs text-center">Sin Logo</span>
                            )}
                        </div>
                        <div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            <p className="text-xs text-gray-500 mt-2">Formatos: JPG, PNG. Máx 5MB.</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input label="Nombre de la Empresa" {...register('company_name')} />
                    <Input label="Dirección" {...register('address')} />
                    <Input label="Teléfono" {...register('phone')} />
                    <Input label="Impuesto / IVA (%)" type="number" step="0.01" {...register('tax_rate')} />

                    <div className="pt-4">
                        <Button type="submit">Guardar Cambios</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SettingsPage;
