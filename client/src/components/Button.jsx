import React from 'react';

const Button = ({ children, className = '', ...props }) => {
    return (
        <button
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
