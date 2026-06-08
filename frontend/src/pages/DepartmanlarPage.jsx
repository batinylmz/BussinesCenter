import { useState } from "react";
import { useData } from "../context/DataContext";
import { C, fmt, inputSt } from "../utils/constants";
import { PageHeader, StatCard, ActionBtns, Modal, Field, Btn, BtnOutline } from "../components/SharedComponents";

export default function DepartmanlarPage() {
    const { data, setData } = useData();
    const [modal, setModal] = useState(false);
    const [form, setForm] = useState({ ad: "", yonetici: "", calisan: "", butce: "", harcanan: "" });
    const [editing, setEditing] = useState(null);

    const open = (row = null) => {
        setEditing(row);
        setForm(row ? { ...row, calisan: String(row.calisan), butce: String(row.butce), harcanan: String(row.harcanan) } : { ad: "", yonetici: "", calisan: "", butce: "", harcanan: "" });
        setModal(true);
    };

    const save = async () => {
        if (!form.ad) return;
        const veri = { ...form, calisan: Number(form.calisan || 0), butce: Number(form.butce || 0), harcanan: Number(form.harcanan || 0) };

        try {
            if (editing) {
                const res = await fetch(`http://localhost:5001/api/departmanlar/${editing.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(veri)
                });
                const guncel = await res.json();
                guncel.id = guncel._id;
                setData(d => ({ ...d, departmanlar: d.departmanlar.map(x => x.id === editing.id ? guncel : x) }));
            } else {
                const res = await fetch("http://localhost:5001/api/departmanlar", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(veri)
                });
                const yeni = await res.json();
                yeni.id = yeni._id;
                setData(d => ({ ...d, departmanlar: [...d.departmanlar, yeni] }));
            }
            setModal(false);
        } catch (error) { console.error("Departman kaydedilirken hata:", error); }
    };

    const del = async (id) => {
        try {
            await fetch(`http://localhost:5001/api/departmanlar/${id}`, { method: "DELETE" });
            setData(d => ({ ...d, departmanlar: d.departmanlar.filter(x => x.id !== id) }));
        } catch (error) {
            console.error("Departman silinirken hata:", error);
        }
    };

    return (
        <div>
            <PageHeader title="Departman Yönetimi" action={<Btn onClick={() => open()}>+ Departman Ekle</Btn>} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
                <StatCard label="Toplam Departman" value={data.departmanlar.length} icon="🏢" />
                <StatCard label="En Yüksek Harcama" value={data.departmanlar.reduce((max, d) => d.harcanan > max.harcanan ? d : max, { harcanan: 0, ad: "-" }).ad} subValue={fmt(Math.max(0, ...data.departmanlar.map(d => d.harcanan)))} icon="📈" />
                <StatCard label="Ort. Departman Gideri" value={fmt(data.departmanlar.reduce((s, d) => s + d.harcanan, 0) / (data.departmanlar.length || 1))} icon="👥" iconColor={C.purple} />
            </div>
            <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                    <thead style={{ background: C.bg }}>
                    <tr>
                        {["DEPARTMAN", "YÖNETİCİ", "ÇALIŞAN", "BÜTÇE", "HARCANAN", "DURUM", ""].map(h => (
                            <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase" }}>{h}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {data.departmanlar.map(d => {
                        const oran = d.butce > 0 ? (d.harcanan / d.butce) * 100 : 0;
                        const renk = oran > 90 ? C.danger : oran > 75 ? C.warning : C.success;
                        return (
                            <tr key={d.id} style={{ borderTop: `1px solid ${C.border}` }} onMouseEnter={e => e.currentTarget.style.background = C.bg} onMouseLeave={e => e.currentTarget.style.background = ""}>
                                <td style={{ padding: "12px 16px", fontWeight: 600 }}>{d.ad}</td>
                                <td style={{ padding: "12px 16px", color: C.textMuted }}>{d.yonetici}</td>
                                <td style={{ padding: "12px 16px" }}>{d.calisan} Kişi</td>
                                <td style={{ padding: "12px 16px" }}>{fmt(d.butce)}</td>
                                <td style={{ padding: "12px 16px", fontWeight: 600 }}>{fmt(d.harcanan)}</td>
                                <td style={{ padding: "12px 16px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <div style={{ width: 60, height: 6, background: C.border, borderRadius: 3, overflow: "hidden" }}>
                                            <div style={{ width: `${Math.min(oran, 100)}%`, height: "100%", background: renk }} />
                                        </div>
                                        <span style={{ fontSize: 12, color: renk, fontWeight: 600 }}>%{oran.toFixed(0)}</span>
                                    </div>
                                </td>
                                <td style={{ padding: "12px 16px" }}><ActionBtns onEdit={() => open(d)} onDelete={() => del(d.id)} /></td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
            {modal && (
                <Modal title={editing ? "Departmanı Düzenle" : "Yeni Departman"} onClose={() => setModal(false)}>
                    <Field label="Departman Adı" req><input style={inputSt} value={form.ad} onChange={e => setForm(f => ({ ...f, ad: e.target.value }))} /></Field>
                    <Field label="Yönetici"><input style={inputSt} value={form.yonetici} onChange={e => setForm(f => ({ ...f, yonetici: e.target.value }))} /></Field>
                    <Field label="Çalışan Sayısı"><input style={inputSt} type="number" value={form.calisan} onChange={e => setForm(f => ({ ...f, calisan: e.target.value }))} /></Field>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <Field label="Bütçe (₺)"><input style={inputSt} type="number" value={form.butce} onChange={e => setForm(f => ({ ...f, butce: e.target.value }))} /></Field>
                        <Field label="Harcanan (₺)"><input style={inputSt} type="number" value={form.harcanan} onChange={e => setForm(f => ({ ...f, harcanan: e.target.value }))} /></Field>
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