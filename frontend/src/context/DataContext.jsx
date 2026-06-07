import { createContext, useState, useContext, useEffect } from "react";

// Test verilerini sildik, temiz bir başlangıç yapıyoruz.
// (Sadece dropdown'lar bozulmasın diye 4 tane temel kategori bıraktım)
const EMPTY_DATA = {
    gelirler: [],
    giderler: [],
    kategoriler: [
        { id: 1, ad: "E-Ticaret", tip: "gelir", renk: "#2563eb", aciklama: "" },
        { id: 2, ad: "Danışmanlık", tip: "gelir", renk: "#16a34a", aciklama: "" },
        { id: 3, ad: "Personel", tip: "gider", renk: "#dc2626", aciklama: "" },
        { id: 4, ad: "Hizmet", tip: "gider", renk: "#f59e0b", aciklama: "" }
    ],
    departmanlar: [],
    projeler: [],
    yatirimlar: [],
    butce: []
};

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [data, setData] = useState(EMPTY_DATA);
    const [loggedIn, setLoggedIn] = useState(false);

    // Uygulama açıldığında Backend'den gerçek gelirleri çek
    useEffect(() => {
        fetch("http://localhost:5001/api/gelirler")
            .then(res => res.json())
            .then(gelirlerDB => {
                // MongoDB'den gelen "_id" alanını, sistemimizin anladığı "id" formatına çeviriyoruz
                const formatliGelirler = gelirlerDB.map(g => ({ ...g, id: g._id }));
                setData(prev => ({ ...prev, gelirler: formatliGelirler }));
            })
            .catch(err => console.error("Backend'den veri çekilirken hata:", err));
    }, []);

    return (
        <DataContext.Provider value={{ data, setData, loggedIn, setLoggedIn }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);