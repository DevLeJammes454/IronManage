import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, error, ...props }, ref) => {
    return (
        <div className="mb-4">
            {label && <label className="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2">{label}</label>}
            <input
                ref={ref}
                className={`shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-slate-700 dark:text-white bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${error ? 'border-red-500 dark:border-red-500' : ''}`}
                {...props}
            />
            {error && <p className="text-red-500 dark:text-red-400 text-xs italic mt-1">{error.message}</p>}
        </div>
    );
});

export default Input;
