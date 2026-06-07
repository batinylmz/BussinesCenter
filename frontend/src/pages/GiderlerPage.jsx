import { useState } from "react";
import { useData } from "../context/DataContext";
import { C, fmt, inputSt } from "../utils/constants";
import { PageHeader, StatCard, Badge, ActionBtns, Modal, Field, Btn, BtnOutline } from "../components/SharedComponents";

export default function GiderlerPage() {
    const { data, setData } = useData();
    const [modal, setModal] = useState(false);
    const [form, setForm] = useState({});
    const [editing, setEditing] = useState(null);
    const giderKats = data.kategoriler.filter(k => k.tip === "gider");
    const toplam = data.giderler.reduce((s, x) => s + x.tutar, 0);

    const open = (row = null) => {
        setEditing(row);
        setForm(row ? { ...row, tutar: String(row.tutar) } : { baslik: "", tutar: "", kategori: giderKats[0]?.ad || "", tarih: new Date().toISOString().slice(0, 10), departman: "", aciklama: "" });
        setModal(true);
    };

    const save = () => {
        if (!form.baslik || !form.tutar) return;
        const item = { ...form, tutar: Number(form.tutar), id: editing?.id || Date.now() };
        setData(d => ({ ...d, giderler: editing ? d.giderler.map(x => x.id === editing.id ? item : x) : [...d.giderler, item] }));
        setModal(false);
    };

    return (
        <div>
            <PageHeader title="Giderler" action={<Btn onClick={() => open()}>+ Gider Ekle</Btn>} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
                <StatCard label="Toplam Gider" value={fmt(toplam)} icon="📉" iconColor={C.danger} />
                <StatCard label="İşlem Sayısı" value={data.giderler.length} icon="📋" />
                <StatCard label="En Büyük Gider" value={fmt(Math.max(...data.giderler.map(g => g.tutar)))} icon="⚠️" iconColor={C.warning} />
            </div>
            <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                    <thead style={{ background: C.bg }}>
                    <tr>
                        {["BAŞLIK", "KATEGORİ", "DEPARTMAN", "TARİH", "TUTAR", ""].map(h => (
                            <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {data.giderler.map(g => (
                        <tr key={g.id} style={{ borderTop: `1px solid ${C.border}` }} onMouseEnter={e => e.currentTarget.style.background = C.bg} onMouseLeave={e => e.currentTarget.style.background = ""}>
                            <td style={{ padding: "12px 16px", fontWeight: 600 }}>{g.baslik}</td>
                            <td style={{ padding: "12px 16px" }}>
                                <Badge label={g.kategori} color={data.kategoriler.find(k => k.ad === g.kategori)?.renk || C.danger} />
                            </td>
                            <td style={{ padding: "12px 16px", color: C.textMuted }}>{g.departman}</td>
                            <td style={{ padding: "12px 16px", color: C.textMuted }}>{g.tarih}</td>
                            <td style={{ padding: "12px 16px", color: C.danger, fontWeight: 700 }}>-{fmt(g.tutar)}</td>
                            <td style={{ padding: "12px 16px" }}><ActionBtns onEdit={() => open(g)} onDelete={() => setData(d => ({ ...d, giderler: d.giderler.filter(x => x.id !== g.id) }))} /></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {modal && (
                <Modal title={editing ? "Gideri Düzenle" : "Yeni Gider"} onClose={() => setModal(false)}>
                    <Field label="Başlık" req><input style={inputSt} value={form.baslik} onChange={e => setForm(f => ({ ...f, baslik: e.target.value }))} /></Field>
                    <Field label="Tutar (₺)" req><input style={inputSt} type="number" value={form.tutar} onChange={e => setForm(f => ({ ...f, tutar: e.target.value }))} /></Field>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <Field label="Kategori">
                            <select style={inputSt} value={form.kategori} onChange={e => setForm(f => ({ ...f, kategori: e.target.value }))}>
                                {giderKats.map(k => <option key={k.id}>{k.ad}</option>)}
                            </select>
                        </Field>
                        <Field label="Departman"><input style={inputSt} value={form.departman} onChange={e => setForm(f => ({ ...f, departman: e.target.value }))} /></Field>
                    </div>
                    <Field label="Tarih"><input style={inputSt} type="date" value={form.tarih} onChange={e => setForm(f => ({ ...f, tarih: e.target.value }))} /></Field>
                    <Field label="Açıklama"><textarea style={{ ...inputSt, resize: "vertical", minHeight: 72 }} value={form.aciklama} onChange={e => setForm(f => ({ ...f, aciklama: e.target.value }))} /></Field>
                    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                        <BtnOutline onClick={() => setModal(false)}>İptal</BtnOutline>
                        <Btn onClick={save}>{editing ? "Güncelle" : "Kaydet"}</Btn>
                    </div>
                </Modal>
            )}
        </div>
    );
}