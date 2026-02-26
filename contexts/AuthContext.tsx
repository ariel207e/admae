'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: string;
  cargo?: string;
  avatar?: string;
  nombreUsuario: string;
  carnet: string;
  oficina: string;
  entidad: string;
  mosca: string;
  documentosPermitidos: string[];
  cantidadIngresos: number;
  ultimoIngreso: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carga de usuario desde localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Asegurar que campos nuevos tengan valores por defecto si el objeto es antiguo
        const upgradedUser = {
          ...parsedUser,
          documentosPermitidos: parsedUser.documentosPermitidos || [],
          cantidadIngresos: parsedUser.cantidadIngresos || 0,
          ultimoIngreso: parsedUser.ultimoIngreso || null,
          mosca: parsedUser.mosca || '',
          carnet: parsedUser.carnet || '',
          nombreUsuario: parsedUser.nombreUsuario || parsedUser.email?.split('@')[0] || 'user',
          oficina: parsedUser.oficina || '',
          entidad: parsedUser.entidad || '',
        };
        setUser(upgradedUser);
      } catch (error) {
        console.error('Error al cargar usuario:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simular llamada a API con delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Validar credenciales (simulado)
      if (email === 'admin@test.com' && password === 'admin123') {
        const mockUser: User = {
          id: '1',
          email: 'admin@test.com',
          nombre: 'Juan Luis',
          apellido: 'Pérez Cervantes',
          rol: 'Administrador',
          cargo: 'Director General',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
          nombreUsuario: 'admin',
          carnet: '001-1234567-8',
          oficina: 'Dirección General',
          entidad: 'Ministerio de Administración Pública',
          mosca: 'JLPC',
          documentosPermitidos: ['Nota', 'Informe', 'Carta', 'Circular', 'Memorando'],
          cantidadIngresos: 156,
          ultimoIngreso: new Date().toISOString(),
        };
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
      } else {
        throw new Error('Credenciales inválidas');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
