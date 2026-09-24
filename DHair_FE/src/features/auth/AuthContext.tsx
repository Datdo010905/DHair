import React, { createContext, useContext, useState } from 'react';
import type { AuthUser } from './types';

interface AuthContextValue {
    user: AuthUser | null;
    setUser: (user: AuthUser | null) => void;
    signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Giữ thông tin người dùng khi chuyển màn hình trong lần mở ứng dụng hiện tại.
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);

    const signOut = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth cần được dùng bên trong AuthProvider.');
    }
    return context;
}
