import React from 'react';
import Input from '@/components/atoms/Input';
import TextArea from '@/components/atoms/TextArea';

const FormField = ({ label, id, multiline = false, rows = 3, placeholder = ' ', className = '', ...props }) => {
    const Component = multiline ? TextArea : Input;
    const inputId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-input' : undefined);

    return (
        <div className={`relative ${className}`}>
            <Component
                id={inputId}
                className="peer placeholder-transparent"
                placeholder={placeholder}
                {...props}
                rows={multiline ? rows : undefined}
            />
            <label
                htmlFor={inputId}
                className="absolute left-4 -top-2.5 bg-white dark:bg-surface-800 px-2 text-sm text-surface-600 dark:text-surface-400 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-surface-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary"
            >
                {label}
            </label>
        </div>
    );
};

export default FormField;