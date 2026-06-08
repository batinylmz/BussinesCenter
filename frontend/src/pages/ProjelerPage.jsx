import { useState } from "react";
import { useData } from "../context/DataContext";
import { C, fmt, inputSt } from "../utils/constants";
import { PageHeader, StatCard, Badge, ActionBtns, Modal, Field, Btn, BtnOutline } from "../components/SharedComponents";

export default function ProjelerPage() {
    const { data, setData } = useData();
    const [modal, setModal] = useState(false);
    const [form, setForm] = useState({ ad: "", departman: "", durum: "Planlama", butce: "", harcanan: "", bitis: "", oncelik: "Orta" });
    const [editing, setEditing] = useState(null);

    const open = (row = null) => {
        setEditing(row);
        setForm(row ? { ...row, butce: String(row.butce), harcanan: String(row.harcanan) } : { ad: "", departman: "", durum: "Planlama", butce: "", harcanan: "", bitis: "", oncelik: "Orta" });
        setModal(true);
    };

    const save = async () => {
        if (!form.ad) return;
        const veri = { ...form, butce: Number(form.butce || 0), harcanan: Number(form.harcanan || 0) };

        try {
            if (editing) {
                const res = await fetch(`http://localhost:5001/api/projeler/${editing.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(veri)
                });
                const guncel = await res.json();
                guncel.id = guncel._id;
                setData(d => ({ ...d, projeler: d.projeler.map(x => x.id === editing.id ? guncel : x) }));
            } else {
                const res = await fetch("http://localhost:5001/api/projeler", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(veri)
                });
                const yeni = await res.json();
                yeni.id = yeni._id;
                setData(d => ({ ...d, projeler: [...d.projeler, yeni] }));
            }
            setModal(false);
        } catch (error) { console.error("Proje kaydedilirken hata:", error); }
    };

    const del = async (id) => {
        try {
            await fetch(`http://localhost:5001/api/projeler/${id}`, { method: "DELETE" });
            setData(d => ({ ...d, projeler: d.projeler.filter(x => x.id !== id) }));
        } catch (error) {
            console.error("Proje silinirken hata:", error);
        }
    };

    return (
        <div>
            <PageHeader title="Projeler" action={<Btn onClick={() => open()}>+ Proje Ekle</Btn>} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
                <StatCard label="Aktif Projeler" value={data.projeler.filter(p => p.durum === "Devam Ediyor").length} icon="🚀" iconColor={C.primary} />
                <StatCard label="Toplam Bütçe" value={fmt(data.projeler.reduce((s, p) => s + p.butce, 0))} icon="💰" iconColor={C.success} />
                <StatCard label="Tamamlanan" value={data.projeler.filter(p => p.durum === "Tamamlandı").length} icon="✅" iconColor={C.success} />
            </div>
            <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                    <thead style={{ background: C.bg }}>
                    <tr>
                        {["PROJE ADI", "DEPARTMAN", "DURUM", "ÖNCELİK", "BÜTÇE", "HARCANAN", "BİTİŞ", ""].map(h => (
                            <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase" }}>{h}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {data.projeler.map(p => {
                        const drmColor = p.durum === "Tamamlandı" ? C.success : p.durum === "Devam Ediyor" ? C.primary : C.textMuted;
                        const oncColor = p.oncelik === "Kritik" ? C.danger : p.oncelik === "Yüksek" ? C.warning : C.success;
                        return (
                            <tr key={p.id} style={{ borderTop: `1px solid ${C.border}` }} onMouseEnter={e => e.currentTarget.style.background = C.bg} onMouseLeave={e => e.currentTarget.style.background = ""}>
                                <td style={{ padding: "12px 16px", fontWeight: 600 }}>{p.ad}</td>
                                <td style={{ padding: "12px 16px", color: C.textMuted }}>{p.departman}</td>
                                <td style={{ padding: "12px 16px" }}><Badge label={p.durum} color={drmColor} /></td>
                                <td style={{ padding: "12px 16px" }}><span style={{ color: oncColor, fontWeight: 600 }}>{p.oncelik}</span></td>
                                <td style={{ padding: "12px 16px" }}>{fmt(p.butce)}</td>
                                <td style={{ padding: "12px 16px", color: p.harcanan > p.butce ? C.danger : "inherit" }}>{fmt(p.harcanan)}</td>
                                <td style={{ padding: "12px 16px", color: C.textMuted }}>{p.bitis}</td>
                                <td style={{ padding: "12px 16px" }}><ActionBtns onEdit={() => open(p)} onDelete={() => del(p.id)} /></td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
            {modal && (
                <Modal title={editing ? "Projeyi Düzenle" : "Yeni Proje"} onClose={() => setModal(false)}>
                    <Field label="Proje Adı" req><input style={inputSt} value={form.ad} onChange={e => setForm(f => ({ ...f, ad: e.target.value }))} /></Field>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <Field label="Departman"><input style={inputSt} value={form.departman} onChange={e => setForm(f => ({ ...f, departman: e.target.value }))} /></Field>
                        <Field label="Durum">
                            <select style={inputSt} value={form.durum} onChange={e => setForm(f => ({ ...f, durum: e.target.value }))}>
                                {["Planlama", "Devam Ediyor", "Tamamlandı", "İptal"].map(o => <option key={o}>{o}</option>)}
                            </select>
                        </Field>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <Field label="Bütçe (₺)"><input style={inputSt} type="number" value={form.butce} onChange={e => setForm(f => ({ ...f, butce: e.target.value }))} /></Field>
                        <Field label="Harcanan (₺)"><input style={inputSt} type="number" value={form.harcanan} onChange={e => setForm(f => ({ ...f, harcanan: e.target.value }))} /></Field>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <Field label="Bitiş Tarihi"><input style={inputSt} type="date" value={form.bitis} onChange={e => setForm(f => ({ ...f, bitis: e.target.value }))} /></Field>
                        <Field label="Öncelik">
                            <select style={inputSt} value={form.oncelik} onChange={e => setForm(f => ({ ...f, oncelik: e.target.value }))}>
                                {["Düşük", "Orta", "Yüksek", "Kritik"].map(o => <option key={o}>{o}</option>)}
                            </select>
                        </Field>
                    </div>
                    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                        <BtnOutline onClick={() => setModal(false)}>İptal</BtnOutline>
                        <Btn onClick={save}>{editing ? "Güncelle" : "Kaydet"}</Btn>
                    </div>
                </Modal>
            )}
        </div>
    );
}