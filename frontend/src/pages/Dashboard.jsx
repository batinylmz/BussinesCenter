import { useData } from "../context/DataContext";
import { C, fmt } from "../utils/constants";
import { PageHeader, StatCard, BarChart } from "../components/SharedComponents";

export default function Dashboard() {
    const { data } = useData();
    const toplamGelir = data.gelirler.reduce((s, x) => s + x.tutar, 0);
    const toplamGider = data.giderler.reduce((s, x) => s + x.tutar, 0);
    const netKar = toplamGelir - toplamGider;
    const toplamYatirim = data.yatirimlar.reduce((s, x) => s + x.deger, 0);
    const toplamKarZarar = data.yatirimlar.reduce((s, x) => s + x.karZarar, 0);

    return (
        <div>
            <PageHeader title="Dashboard" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
                <StatCard label="Toplam Gelir" value={fmt(toplamGelir)} sub="+%12 geçen aya göre" subColor={C.success} icon="📈" iconColor={C.success} />
                <StatCard label="Toplam Gider" value={fmt(toplamGider)} sub="Bu ay" icon="📉" iconColor={C.danger} />
                <StatCard label="Net Kâr" value={fmt(netKar)} sub={`Marj: %${((netKar / toplamGelir) * 100).toFixed(1)}`} subColor={netKar > 0 ? C.success : C.danger} icon="💰" iconColor={C.success} />
                <StatCard label="Yatırım Portföyü" value={fmt(toplamYatirim)} sub={`K/Z: ${toplamKarZarar >= 0 ? "+" : ""}${fmt(toplamKarZarar)}`} subColor={toplamKarZarar >= 0 ? C.success : C.danger} icon="📊" iconColor={C.purple} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
                    <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: C.text }}>Son Gelirler</h3>
                    {data.gelirler.slice(0, 4).map(g => (
                        <div key={g.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: 14 }}>{g.baslik}</div>
                                <div style={{ fontSize: 12, color: C.textMuted }}>{g.kategori} · {g.tarih}</div>
                            </div>
                            <span style={{ color: C.success, fontWeight: 700 }}>+{fmt(g.tutar)}</span>
                        </div>
                    ))}
                </div>
                <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
                    <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: C.text }}>Son Giderler</h3>
                    {data.giderler.slice(0, 4).map(g => (
                        <div key={g.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: 14 }}>{g.baslik}</div>
                                <div style={{ fontSize: 12, color: C.textMuted }}>{g.kategori} · {g.tarih}</div>
                            </div>
                            <span style={{ color: C.danger, fontWeight: 700 }}>-{fmt(g.tutar)}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
                <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>Bütçe Durumu (Departmanlar)</h3>
                <BarChart data={data.butce.map(b => ({ departman: b.departman, hedef: b.yillik, gercek: b.q1g + b.q2g }))} />
            </div>
        </div>
    );
}