import React from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const QuotePDFTemplate = React.forwardRef(({ items, totalCost, clientName, client }, ref) => {
    const { user } = useAuth();
    const baseUrl = api.defaults.baseURL.replace('/api', '');

    return (
        <div ref={ref} className="p-10 bg-white text-gray-800 font-sans" style={{ width: '210mm', minHeight: '297mm' }}>
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-gray-800 pb-4 mb-8">
                <div className="flex items-center gap-4">
                    {user?.logo_url && (
                        <img
                            src={`${baseUrl}${user.logo_url}`}
                            alt="Logo"
                            className="h-16 w-auto object-contain"
                        />
                    )}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-wide">Cotización</h1>
                        <p className="text-sm text-gray-600 mt-1">Fecha: {new Date().toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-bold text-gray-800">{user?.company_name || 'Taller de Herrería'}</h2>
                    <p className="text-sm text-gray-600">{user?.address}</p>
                    <p className="text-sm text-gray-600">{user?.phone}</p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
            </div>

            {/* Client Info */}
            <div className="mb-8 bg-gray-50 p-4 rounded">
                <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Cliente</h3>
                <p className="text-lg font-bold text-gray-900">{client?.name || clientName || 'Cliente General'}</p>
                {client?.phone && <p className="text-sm text-gray-700">Tel: {client.phone}</p>}
                {client?.address && <p className="text-sm text-gray-700">{client.address}</p>}
            </div>

            {/* Items Table */}
            <table className="w-full mb-8 border-collapse">
                <thead>
                    <tr className="bg-gray-800 text-white">
                        <th className="py-2 px-4 text-left text-sm uppercase font-semibold">Material</th>
                        <th className="py-2 px-4 text-center text-sm uppercase font-semibold">Cant.</th>
                        <th className="py-2 px-4 text-right text-sm uppercase font-semibold">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {items && items.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                            <td className="py-2 px-4 border-b border-gray-200">
                                <p className="font-bold text-gray-800">{item.name}</p>
                                <p className="text-xs text-gray-500">{item.linear_meters}m requeridos</p>
                            </td>
                            <td className="py-2 px-4 text-center border-b border-gray-200">
                                {item.bars} barras
                            </td>
                            <td className="py-2 px-4 text-right border-b border-gray-200 font-mono">
                                ${item.cost.toFixed(2)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Total */}
            <div className="flex justify-end mb-12">
                <div className="w-1/2 border-t-2 border-gray-800 pt-4">
                    <div className="flex justify-between items-center text-2xl font-bold">
                        <span>Total:</span>
                        <span>${totalCost.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-500 text-right mt-1">* Precios sujetos a cambio sin previo aviso.</p>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-500 mt-auto pt-8 border-t border-gray-200">
                <p>Gracias por su preferencia.</p>
            </div>
        </div>
    );
});

export default QuotePDFTemplate;
