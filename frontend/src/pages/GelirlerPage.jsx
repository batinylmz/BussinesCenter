import { useState } from "react";
import { useData } from "../context/DataContext";
import { C, fmt, inputSt } from "../utils/constants";
import { PageHeader, StatCard, Badge, ActionBtns, Modal, Field, Btn, BtnOutline } from "../components/SharedComponents";

export default function GelirlerPage() {
    const { data, setData } = useData();
    const [modal, setModal] = useState(false);
    const [form, setForm] = useState({ baslik: "", tutar: "", kategori: "", tarih: "", departman: "", aciklama: "" });
    const [yeniKategori, setYeniKategori] = useState("");
    const [editing, setEditing] = useState(null);

    const gelirKats = data.kategoriler.filter(k => k.tip === "gelir");
    const benzersizKategoriler = [...new Set(gelirKats.map(k => k.ad))];
    const toplam = data.gelirler.reduce((s, x) => s + x.tutar, 0);

    const open = (row = null) => {
        setEditing(row);
        setForm(row ? { ...row, tutar: String(row.tutar) } : { baslik: "", tutar: "", kategori: "", tarih: new Date().toISOString().slice(0, 10), departman: "", aciklama: "" });
        setYeniKategori("");
        setModal(true);
    };

    const save = async () => {
        if (!form.baslik || !form.tutar) return;

        let finalKategori = form.kategori;
        if (form.kategori === "Diğer") {
            if (!yeniKategori.trim()) { alert("Lütfen kategori adı girin!"); return; }
            finalKategori = yeniKategori.trim();
        }

        const veri = { ...form, tutar: Number(form.tutar), kategori: finalKategori };

        try {
            if (editing) {
                const res = await fetch(`http://localhost:5001/api/gelirler/${editing.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(veri)
                });
                const guncel = await res.json();
                if (!res.ok) { alert("Hata: " + (guncel.mesaj || "Bilinmeyen hata")); return; }
                guncel.id = guncel._id;
                setData(d => ({ ...d, gelirler: d.gelirler.map(x => x.id === editing.id ? guncel : x) }));
            } else {
                const res = await fetch("http://localhost:5001/api/gelirler", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(veri)
                });
                const yeni = await res.json();
                if (!res.ok) { alert("Hata: " + (yeni.mesaj || "Bilinmeyen hata")); return; }
                yeni.id = yeni._id;
                setData(d => ({ ...d, gelirler: [...d.gelirler, yeni] }));
            }
            setModal(false);
        } catch (error) { console.error("Gelir kaydedilirken hata:", error); }
    };

    const del = async (id) => {
        try {
            await fetch(`http://localhost:5001/api/gelirler/${id}`, { method: "DELETE" });
            setData(d => ({ ...d, gelirler: d.gelirler.filter(x => x.id !== id) }));
        } catch (error) { console.error("Gelir silinirken hata:", error); }
    };

    const bugun = new Date().toISOString().split("T")[0];
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
                                <option value="" disabled>Kategori Seçiniz...</option>
                                {benzersizKategoriler.map(katAd => <option key={katAd} value={katAd}>{katAd}</option>)}
                                <option value="Diğer">+ Diğer (Yeni Ekle...)</option>
                            </select>
                            {form.kategori === "Diğer" && (
                                <input style={{ ...inputSt, marginTop: 8 }} placeholder="Kategori adı..." value={yeniKategori} onChange={e => setYeniKategori(e.target.value)} />
                            )}
                        </Field>
                        <Field label="Departman"><input style={inputSt} value={form.departman} onChange={e => setForm(f => ({ ...f, departman: e.target.value }))} /></Field>
                    </div>
                    <Field label="Tarih"><input style={inputSt} type="date" value={form.tarih} onChange={e => setForm(f => ({ ...f, tarih: e.target.value }))} max={bugun} /></Field>
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