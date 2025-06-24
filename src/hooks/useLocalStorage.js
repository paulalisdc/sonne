import { useState, useEffect } from 'react';

const useLocalStorage = (key, initialValue) => {
  // Función para obtener el valor inicial desde localStorage
  const getStoredValue = () => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error al leer localStorage para la clave "${key}":`, error);
      return initialValue;
    }
  };

  // Estado inicial
  const [storedValue, setStoredValue] = useState(getStoredValue);

  // Función para actualizar tanto el estado como localStorage
  const setValue = (value) => {
    try {
      // Permitir que value sea una función para que tenga la misma API que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Guardar en el estado
      setStoredValue(valueToStore);
      
      // Guardar en localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error al guardar en localStorage para la clave "${key}":`, error);
    }
  };

  // Sincronizar con localStorage cuando cambie la clave
  useEffect(() => {
    setStoredValue(getStoredValue());
  }, [key]);

  return [storedValue, setValue];
};

export default useLocalStorage; 