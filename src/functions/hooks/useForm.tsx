"use client"

import React, { useEffect, useState } from "react";
import { auth } from '@/firebase/firebase'

type Element = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>

interface ErrorType {
    [name: string]: string
}

interface ValueType {
    [name: string]: string;
}

type RegisterType = (auth: any, email: string, password: string, name: string) => void;

const useForm = (initialValue = {}) => {

    const [values, setValues] = useState<ValueType>(initialValue);
    const [errors, setErrors] = useState<ErrorType>({});

    useEffect(() => {
        validateForm();
    }, []);

    const handleChange = (e: Element) => {
        const { name, value } = e.target;

        setValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleBlur = () => {
        validateForm();
    }

    const validateForm = () => {
        const newErrors: ErrorType = {};

        if (values.name_register.length > 35) {
            newErrors.name_register = "El nombre ha excedido los caracteres máximos"
        } else if (!values.name_register) {
            newErrors.name_register = "Campo obligatorio"
        } else if (values.name_register.length <= 35) {
            delete newErrors.name_register
        }

        if (values.email_register && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(values.email_register)) {
            newErrors.email_register = "E-mail invalido"
        } else if (!values.email_register) {
            newErrors.email_register = "Campo obligatorio"
        } else if (values.email_register && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(values.email_register)) {
            delete newErrors.email_register
        }

        if (values.password_register && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d\W_]{8,}$/.test(values.password_register)) {
            newErrors.password_register = "Es recomendable que tu contraseña tenga mayusculas, minusculas, números y al menos 8 caracteres"
        } else if (!values.password_register) {
            newErrors.password_register = "Campo obligatorio"
        } else if (values.password_register && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(values.password_register)) {
            delete newErrors.password_register
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async (submitAction: RegisterType) => {
        if (validateForm()) {
            try {
                submitAction(auth, values.email_register, values.password_register, values.name_register);
            } catch (error: any) {
                setErrors(prev => ({
                    ...prev,
                    submit: 'Error al intentar crear una cuenta, intenta nuevamente'
                }
                ));
            }
        } else {
            console.log(errors)
        }
    };

    return {
        values,
        errors,
        handleChange,
        setErrors,
        handleSubmit,
        handleBlur
    };
};

export default useForm;