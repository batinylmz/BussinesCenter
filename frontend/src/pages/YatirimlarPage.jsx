import { useState } from "react";
import { useData } from "../context/DataContext";
import { C, inputSt } from "../utils/constants";
import { PageHeader, ActionBtns, Modal, Field, Btn, BtnOutline } from "../components/SharedComponents";

export default function YatirimlarPage() {
    const { data, setData } = useData();
    const [modal, setModal] = useState(false);
    const [form, setForm] = useState({});
    const [editing, setEditing] = useState(null);
    const TIPLER = ["Hisse", "Fon", "Tahvil", "Emtia", "Kripto", "ETF"];

    const toplamPortfoy = data.yatirimlar.reduce((s, x) => s + x.deger, 0);
    const toplamKarZarar = data.yatirimlar.reduce((s, x) => s + x.karZarar, 0);
    const nakitRezev = 215000;
    const bugunDegisim = 3240;

    const open = (row = null) => {
        setEditing(row);
        setForm(row ? { ...row, alis: String(row.alis), guncel: String(row.guncel), adet: String(row.adet), maliyet: String(row.maliyet), deger: String(row.deger), karZarar: String(row.karZarar) }
            : { ad: "", sembol: "", tip: "Hisse", alis: "", guncel: "", adet: "", maliyet: "", deger: "", karZarar: "" });
        setModal(true);
    };
    const save = () => {
        if (!form.ad) return;
        const n = s => Number(s) || 0;
        const item = { ...form, alis: n(form.alis), guncel: n(form.guncel), adet: n(form.adet), maliyet: n(form.maliyet), deger: n(form.deger), karZarar: n(form.karZarar), id: editing?.id || Date.now() };
        setData(d => ({ ...d, yatirimlar: editing ? d.yatirimlar.map(x => x.id === editing.id ? item : x) : [...d.yatirimlar, item] }));
        setModal(false);
    };

    return (
        <div>
            <PageHeader title="Yatırım Portföyü" action={<Btn onClick={() => open()}>+ Yeni İşlem</Btn>} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 22px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Toplam Portföy</div>
                            <div style={{ fontSize: 30, fontWeight: 800, color: C.text }}>₺{toplamPortfoy.toLocaleString("tr-TR")}</div>
                            <div style={{ fontSize: 13, color: C.success, marginTop: 4 }}>+%8.3 bu ay</div>
                        </div>
                        <span style={{ fontSize: 26, color: C.primary }}>📈</span>
                    </div>
                </div>
                <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 22px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Toplam Kar/Zarar</div>
                            <div style={{ fontSize: 30, fontWeight: 800, color: toplamKarZarar >= 0 ? C.success : C.danger }}>+₺{toplamKarZarar.toLocaleString("tr-TR")}</div>
                        </div>
                        <span style={{ fontSize: 26 }}>📊</span>
                    </div>
                </div>
                <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 22px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Nakit Rezervi</div>
                            <div style={{ fontSize: 30, fontWeight: 800, color: C.text }}>₺{nakitRezev.toLocaleString("tr-TR")}</div>
                        </div>
                        <span style={{ fontSize: 26, color: C.purple }}>💎</span>
                    </div>
                </div>
                <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 22px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Bugünkü Değişim</div>
                            <div style={{ fontSize: 30, fontWeight: 800, color: C.success }}>+₺{bugunDegisim.toLocaleString("tr-TR")}</div>
                            <div style={{ fontSize: 13, color: C.success }}>+%0.25</div>
                        </div>
                        <span style={{ fontSize: 26, color: C.success }}>📈</span>
                    </div>
                </div>
            </div>

            <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}` }}>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Mevcut Varlıklar</h3>
                </div>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                        <thead style={{ background: C.bg }}>
                        <tr>
                            {["VARLIK", "SEMBOL", "TİP", "ALIŞ", "GÜNCEL", "ADET", "MALİYET", "DEĞER", "KAR/ZARAR", ""].map(h => (
                                <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {data.yatirimlar.map(y => (
                            <tr key={y.id} style={{ borderTop: `1px solid ${C.border}` }} onMouseEnter={e => e.currentTarget.style.background = C.bg} onMouseLeave={e => e.currentTarget.style.background = ""}>
                                <td style={{ padding: "12px 14px", fontWeight: 700 }}>{y.ad}</td>
                                <td style={{ padding: "12px 14px" }}>
                                    <span style={{ background: "#eff6ff", color: C.primary, fontWeight: 700, fontSize: 12, padding: "3px 8px", borderRadius: 6 }}>{y.sembol}</span>
                                </td>
                                <td style={{ padding: "12px 14px" }}>
                                    <span style={{ background: "#f3f4f6", color: C.textMuted, fontWeight: 600, fontSize: 12, padding: "3px 8px", borderRadius: 6 }}>{y.tip}</span>
                                </td>
                                <td style={{ padding: "12px 14px", color: C.textMuted }}>₺{y.alis}</td>
                                <td style={{ padding: "12px 14px", fontWeight: 600 }}>₺{y.guncel}</td>
                                <td style={{ padding: "12px 14px" }}>{y.adet.toLocaleString("tr-TR")}</td>
                                <td style={{ padding: "12px 14px" }}>₺{y.maliyet.toLocaleString("tr-TR")}</td>
                                <td style={{ padding: "12px 14px", fontWeight: 700 }}>₺{y.deger.toLocaleString("tr-TR")}</td>
                                <td style={{ padding: "12px 14px", fontWeight: 700, color: y.karZarar >= 0 ? C.success : C.danger }}>
                                    {y.karZarar >= 0 ? "+" : ""}₺{y.karZarar.toLocaleString("tr-TR")}
                                </td>
                                <td style={{ padding: "12px 14px" }}><ActionBtns onEdit={() => open(y)} onDelete={() => setData(d => ({ ...d, yatirimlar: d.yatirimlar.filter(x => x.id !== y.id) }))} /></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {modal && (
                <Modal title={editing ? "Yatırımı Düzenle" : "Yeni Yatırım Ekle"} wide onClose={() => setModal(false)}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <Field label="Varlık Adı" req><input style={inputSt} value={form.ad} onChange={e => setForm(f => ({ ...f, ad: e.target.value }))} /></Field>
                        <Field label="Sembol"><input style={inputSt} value={form.sembol} onChange={e => setForm(f => ({ ...f, sembol: e.target.value }))} placeholder="THYAO" /></Field>
                        <Field label="Tip">
                            <select style={inputSt} value={form.tip} onChange={e => setForm(f => ({ ...f, tip: e.target.value }))}>
                                {TIPLER.map(t => <option key={t}>{t}</option>)}
                            </select>
                        </Field>
                        <Field label="Adet"><input style={inputSt} type="number" value={form.adet} onChange={e => setForm(f => ({ ...f, adet: e.target.value }))} /></Field>
                        <Field label="Alış Fiyatı (₺)"><input style={inputSt} type="number" step="0.01" value={form.alis} onChange={e => setForm(f => ({ ...f, alis: e.target.value }))} /></Field>
                        <Field label="Güncel Fiyat (₺)"><input style={inputSt} type="number" step="0.01" value={form.guncel} onChange={e => setForm(f => ({ ...f, guncel: e.target.value }))} /></Field>
                        <Field label="Toplam Maliyet (₺)"><input style={inputSt} type="number" value={form.maliyet} onChange={e => setForm(f => ({ ...f, maliyet: e.target.value }))} /></Field>
                        <Field label="Güncel Değer (₺)"><input style={inputSt} type="number" value={form.deger} onChange={e => setForm(f => ({ ...f, deger: e.target.value }))} /></Field>
                    </div>
                    <Field label="Kar/Zarar (₺)"><input style={inputSt} type="number" value={form.karZarar} onChange={e => setForm(f => ({ ...f, karZarar: e.target.value }))} /></Field>
                    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
                        <BtnOutline onClick={() => setModal(false)}>İptal</BtnOutline>
                        <Btn onClick={save}>{editing ? "Güncelle" : "Kaydet"}</Btn>
                    </div>
                </Modal>
            )}
        </div>
    );
}