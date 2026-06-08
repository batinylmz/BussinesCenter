import { createContext, useState, useContext, useEffect } from "react";

const EMPTY_DATA = {
    gelirler: [],
    giderler: [],
    departmanlar: [],
    projeler: [],
    yatirimlar: [],
    butce: [],
    kategoriler: [
        { id: 1, ad: "E-Ticaret", tip: "gelir", renk: "#2563eb" },
        { id: 2, ad: "Danışmanlık", tip: "gelir", renk: "#16a34a" },
        { id: 3, ad: "Personel", tip: "gider", renk: "#dc2626" },
        { id: 4, ad: "Yazılım", tip: "gider", renk: "#7c3aed" },
        { id: 5, ad: "Kira", tip: "gider", renk: "#f59e0b" }
    ]
};

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [data, setData] = useState(EMPTY_DATA);
    const [loggedIn, setLoggedIn] = useState(false);

    // SAYFA AÇILDIĞINDA TÜM VERİLERİ MONGODB'DEN ÇEK
    useEffect(() => {
        const tumVerileriGetir = async () => {
            try {
                // 4 farklı rotamıza aynı anda istek atıyoruz (Hız için Promise.all kullanıyoruz)
                const [gelirRes, giderRes, depRes, projeRes] = await Promise.all([
                    fetch("http://localhost:5001/api/gelirler"),
                    fetch("http://localhost:5001/api/giderler"),
                    fetch("http://localhost:5001/api/departmanlar"),
                    fetch("http://localhost:5001/api/projeler")
                ]);

                // Gelen cevapları JSON'a çeviriyoruz
                const gelirlerDB = await gelirRes.json();
                const giderlerDB = await giderRes.json();
                const departmanlarDB = await depRes.json();
                const projelerDB = await projeRes.json();

                // React'ın id yapısı ile MongoDB'nin _id yapısını eşleştirip state'e yazıyoruz
                setData(prev => ({
                    ...prev,
                    gelirler: gelirlerDB.map(x => ({ ...x, id: x._id })),
                    giderler: giderlerDB.map(x => ({ ...x, id: x._id })),
                    departmanlar: departmanlarDB.map(x => ({ ...x, id: x._id })),
                    projeler: projelerDB.map(x => ({ ...x, id: x._id }))
                }));
            } catch (error) {
                console.error("Veritabanından veri çekilirken hata oluştu:", error);
            }
        };

        tumVerileriGetir();
    }, []);

    return (
        <DataContext.Provider value={{ data, setData, loggedIn, setLoggedIn }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);