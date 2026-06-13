import { createContext, useState, useContext, useEffect } from "react";

const EMPTY_DATA = {
    gelirler: [],
    giderler: [],
    departmanlar: [],
    projeler: [],
    yatirimlar: [], // Yatırımlar listesi
    butce: [],
    kategoriler: []
};

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [data, setData] = useState(EMPTY_DATA);
    const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
    const [token, setToken] = useState(localStorage.getItem("token"));

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

    // SAYFA AÇILDIĞINDA TÜM VERİLERİ MONGODB'DEN ÇEK
    useEffect(() => {
        const tumVerileriGetir = async () => {
            try {
                // yatirimlar rotasını da Promise.all içine ekledik
                const [gelirRes, giderRes, depRes, projeRes, katRes, butceRes, yatirimRes] = await Promise.all([
                    fetch("http://localhost:5001/api/gelirler"),
                    fetch("http://localhost:5001/api/giderler"),
                    fetch("http://localhost:5001/api/departmanlar"),
                    fetch("http://localhost:5001/api/projeler"),
                    fetch("http://localhost:5001/api/kategoriler"),
                    fetch("http://localhost:5001/api/butce"),
                    fetch("http://localhost:5001/api/yatirimlar") // YENİ EKLENDİ
                ]);

                const gelirlerDB = await gelirRes.json();
                const giderlerDB = await giderRes.json();
                const departmanlarDB = await depRes.json();
                const projelerDB = await projeRes.json();
                const kategorilerDB = await katRes.json();
                const butceDB = await butceRes.json();
                const yatirimlarDB = await yatirimRes.json(); // YENİ EKLENDİ

                const norm = arr => arr.map(x => ({ ...x, id: x._id }));
                setData(prev => ({
                    ...prev,
                    gelirler: norm(gelirlerDB),
                    giderler: norm(giderlerDB),
                    departmanlar: norm(departmanlarDB),
                    projeler: norm(projelerDB),
                    kategoriler: norm(kategorilerDB),
                    butce: norm(butceDB),
                    yatirimlar: norm(yatirimlarDB) // YENİ EKLENDİ
                }));
            } catch (error) {
                console.error("Veritabanından veri çekilirken hata oluştu:", error);
            }
        };

        tumVerileriGetir();
    }, []);

    return (
        <DataContext.Provider value={{ data, setData, loggedIn, token, login, logout }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);