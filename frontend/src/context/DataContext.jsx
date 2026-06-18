import { createContext, useState, useContext, useEffect, useCallback } from "react";

const EMPTY_DATA = {
    gelirler: [],
    giderler: [],
    departmanlar: [],
    projeler: [],
    yatirimlar: [],
    butce: [],
    kategoriler: []
};

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [data, setData] = useState(EMPTY_DATA);
    const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [toast, setToast] = useState(null);

    const login = (jwt) => {
        localStorage.setItem("token", jwt);
        setToken(jwt);
        setLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setLoggedIn(false);
    };

    const showToast = useCallback((message, type = "error") => {
        setToast({ message, type });
    }, []);

    const apiFetch = useCallback(async (url, options = {}) => {
        const t = localStorage.getItem("token");
        const headers = { ...options.headers };
        if (t) headers["Authorization"] = `Bearer ${t}`;
        const res = await fetch(url, { ...options, headers });
        if (res.status === 403) {
            showToast("Bu işlem için yetkiniz yok. Admin veya Manager rolü gereklidir.", "error");
        } else if (res.status === 401) {
            showToast("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.", "warning");
        }
        return res;
    }, [showToast]);

    // SAYFA AÇILDIĞINDA TÜM VERİLERİ MONGODB'DEN ÇEK
    useEffect(() => {
        const tumVerileriGetir = async () => {
            try {
                // 4 farklı rotamıza aynı anda istek atıyoruz (Hız için Promise.all kullanıyoruz)
                const [gelirRes, giderRes, depRes, projeRes, katRes] = await Promise.all([
                    fetch("http://localhost:5001/api/gelirler"),
                    fetch("http://localhost:5001/api/giderler"),
                    fetch("http://localhost:5001/api/departmanlar"),
                    fetch("http://localhost:5001/api/projeler"),
                    fetch("http://localhost:5001/api/kategoriler")
                ]);

                const gelirlerDB = await gelirRes.json();
                const giderlerDB = await giderRes.json();
                const departmanlarDB = await depRes.json();
                const projelerDB = await projeRes.json();
                const kategorilerDB = await katRes.json();

                const norm = arr => arr.map(x => ({ ...x, id: x._id }));
                setData(prev => ({
                    ...prev,
                    gelirler: norm(gelirlerDB),
                    giderler: norm(giderlerDB),
                    departmanlar: norm(departmanlarDB),
                    projeler: norm(projelerDB),
                    kategoriler: norm(kategorilerDB)
                }));
            } catch (error) {
                console.error("Veritabanından veri çekilirken hata oluştu:", error);
            }
        };

        tumVerileriGetir();
    }, []);

    return (
        <DataContext.Provider value={{ data, setData, loggedIn, token, login, logout, apiFetch, toast, setToast }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);