import { useState } from "react";
import { useData } from "../context/DataContext";
import { C, fmt, inputSt } from "../utils/constants";
import { PageHeader, StatCard, Badge, ActionBtns, Modal, Field, Btn, BtnOutline } from "../components/SharedComponents";

export default function GelirlerPage() {
    const { data, setData } = useData();
    const [modal, setModal] = useState(false);
    const [form, setForm] = useState({ baslik: "", tutar: "", kategori: "", tarih: "", departman: "", aciklama: "" });
    const [editing, setEditing] = useState(null);

    const gelirKats = data.kategoriler.filter(k => k.tip === "gelir");
    const toplam = data.gelirler.reduce((s, x) => s + x.tutar, 0);

    const open = (row = null) => {
        setEditing(row);
        setForm(row ? { ...row, tutar: String(row.tutar) } : { baslik: "", tutar: "", kategori: gelirKats[0]?.ad || "", tarih: new Date().toISOString().slice(0, 10), departman: "", aciklama: "" });
        setModal(true);
    };

    // GERÇEK BACKEND KAYDI (POST)
    const save = async () => {
        if (!form.baslik || !form.tutar) return;
        const yeniGelir = { ...form, tutar: Number(form.tutar) };

        try {
            if (editing) {
                // Düzenleme (PUT) rotasını backend'de yazmadığımız için şimdilik lokalde güncelliyoruz
                setData(d => ({ ...d, gelirler: d.gelirler.map(x => x.id === editing.id ? { ...yeniGelir, id: editing.id } : x) }));
            } else {
                // Gerçek Veritabanına Ekle!
                const response = await fetch("http://localhost:5001/api/gelirler", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(yeniGelir)
                });
                const kaydedilen = await response.json();
                kaydedilen.id = kaydedilen._id; // MongoDB ID uyumu

                setData(d => ({ ...d, gelirler: [...d.gelirler, kaydedilen] }));
            }
            setModal(false);
        } catch (error) {
            console.error("Gelir eklenirken hata:", error);
        }
    };

    // GERÇEK BACKEND SİLME (DELETE)
    const del = async (id) => {
        try {
            await fetch(`http://localhost:5001/api/gelirler/${id}`, { method: "DELETE" });
            setData(d => ({ ...d, gelirler: d.gelirler.filter(x => x.id !== id) }));
        } catch (error) {
            console.error("Gelir silinirken hata:", error);
        }
    };

    return (
        <div>
            <PageHeader title="Gelirler" action={<Btn onClick={() => open()}>+ Gelir Ekle</Btn>} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
                <StatCard label="Toplam Gelir" value={fmt(toplam)} icon="📈" iconColor={C.success} />
                <StatCard label="İşlem Sayısı" value={data.gelirler.length} icon="📋" />
                <StatCard label="Ortalama" value={fmt(toplam / (data.gelirler.length || 1))} icon="📊" iconColor={C.purple} />
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
                    {data.gelirler.map(g => (
                        <tr key={g.id} style={{ borderTop: `1px solid ${C.border}` }} onMouseEnter={e => e.currentTarget.style.background = C.bg} onMouseLeave={e => e.currentTarget.style.background = ""}>
                            <td style={{ padding: "12px 16px", fontWeight: 600 }}>{g.baslik}</td>
                            <td style={{ padding: "12px 16px" }}>
                                <Badge label={g.kategori} color={data.kategoriler.find(k => k.ad === g.kategori)?.renk || C.primary} />
                            </td>
                            <td style={{ padding: "12px 16px", color: C.textMuted }}>{g.departman}</td>
                            <td style={{ padding: "12px 16px", color: C.textMuted }}>{g.tarih}</td>
                            <td style={{ padding: "12px 16px", color: C.success, fontWeight: 700 }}>+{fmt(g.tutar)}</td>
                            <td style={{ padding: "12px 16px" }}><ActionBtns onEdit={() => open(g)} onDelete={() => del(g.id)} /></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {modal && (
                <Modal title={editing ? "Geliri Düzenle" : "Yeni Gelir"} onClose={() => setModal(false)}>
                    <Field label="Başlık" req><input style={inputSt} value={form.baslik} onChange={e => setForm(f => ({ ...f, baslik: e.target.value }))} /></Field>
                    <Field label="Tutar (₺)" req><input style={inputSt} type="number" value={form.tutar} onChange={e => setForm(f => ({ ...f, tutar: e.target.value }))} /></Field>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <Field label="Kategori">
                            <select style={inputSt} value={form.kategori} onChange={e => setForm(f => ({ ...f, kategori: e.target.value }))}>
                                {gelirKats.map(k => <option key={k.id}>{k.ad}</option>)}
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