import { useData } from "../context/DataContext";
import { C, fmt } from "../utils/constants";
import { PageHeader, BarChart } from "../components/SharedComponents";

export default function RaporlarPage() {
    const { data } = useData();
    const toplamGelir = data.gelirler.reduce((s, x) => s + x.tutar, 0);
    const toplamGider = data.giderler.reduce((s, x) => s + x.tutar, 0);
    const netKar = toplamGelir - toplamGider;

    return (
        <div>
            <PageHeader title="Raporlar" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
                    <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>Gelir–Gider Özeti</h3>
                    {[
                        { label: "Toplam Gelir", value: fmt(toplamGelir), color: C.success },
                        { label: "Toplam Gider", value: fmt(toplamGider), color: C.danger },
                        { label: "Net Kâr", value: fmt(netKar), color: netKar > 0 ? C.success : C.danger },
                        { label: "Kâr Marjı", value: `%${((netKar / toplamGelir) * 100).toFixed(1)}`, color: C.primary },
                    ].map(r => (
                        <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${C.border}` }}>
                            <span style={{ color: C.textMuted }}>{r.label}</span>
                            <span style={{ fontWeight: 700, color: r.color }}>{r.value}</span>
                        </div>
                    ))}
                </div>
                <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
                    <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>Yatırım Performansı</h3>
                    {data.yatirimlar.map(y => (
                        <div key={y.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: 14 }}>{y.ad}</div>
                                <div style={{ fontSize: 12, color: C.textMuted }}>{y.sembol} · {y.tip}</div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <div style={{ fontWeight: 700 }}>₺{y.deger.toLocaleString("tr-TR")}</div>
                                <div style={{ fontSize: 12, color: y.karZarar >= 0 ? C.success : C.danger }}>{y.karZarar >= 0 ? "+" : ""}₺{y.karZarar.toLocaleString("tr-TR")}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
                <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>Bütçe vs Gerçekleşen</h3>
                <BarChart data={data.butce.map(b => ({ departman: b.departman, hedef: b.yillik, gercek: b.q1g + b.q2g }))} />
            </div>
        </div>
    );
}