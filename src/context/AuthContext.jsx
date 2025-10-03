import { createContext, useState, useEffect, Children } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    useEffect(() => {
        const userInfoFromStorage = localStorage.getItem('userInfo');
        if (userInfoFromStorage) {
            setUser(JSON.parse(userInfoFromStorage));
        }

    }, []);

    const login = (userInfo) => {
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        setUser(userInfo);
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
