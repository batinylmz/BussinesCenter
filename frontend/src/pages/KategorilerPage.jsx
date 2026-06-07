import { useState } from "react";
import { useData } from "../context/DataContext";
import { C, inputSt, PRESET_COLORS } from "../utils/constants";
import { PageHeader, ActionBtns, Modal, Field, Btn, BtnOutline } from "../components/SharedComponents";

export default function KategorilerPage() {
    const { data, setData } = useData();
    const [modal, setModal] = useState(false);
    const [form, setForm] = useState({ ad: "", tip: "gelir", renk: "#2563eb", aciklama: "" });
    const [editing, setEditing] = useState(null);

    const gelirKats = data.kategoriler.filter(k => k.tip === "gelir");
    const giderKats = data.kategoriler.filter(k => k.tip === "gider");

    const getIslem = (katAd, tip) => {
        const list = tip === "gelir" ? data.gelirler : data.giderler;
        return list.filter(x => x.kategori === katAd).length;
    };
    const getToplam = (katAd, tip) => {
        const list = tip === "gelir" ? data.gelirler : data.giderler;
        return list.filter(x => x.kategori === katAd).reduce((s, x) => s + x.tutar, 0);
    };

    const open = (row = null) => {
        setEditing(row);
        setForm(row ? { ...row } : { ad: "", tip: "gelir", renk: "#2563eb", aciklama: "" });
        setModal(true);
    };
    const save = () => {
        if (!form.ad) return;
        const item = { ...form, id: editing?.id || Date.now() };
        setData(d => ({ ...d, kategoriler: editing ? d.kategoriler.map(x => x.id === editing.id ? item : x) : [...d.kategoriler, item] }));
        setModal(false);
    };
    const del = id => setData(d => ({ ...d, kategoriler: d.kategoriler.filter(x => x.id !== id) }));

    const KatTable = ({ kats, tip }) => (
        <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 14, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: C.textMuted }}>🏷️</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: C.text }}>
            {tip === "gelir" ? "Gelir Kategorileri" : "Gider Kategorileri"}
          </span>
                </div>
                <span style={{ fontSize: 13, color: C.textMuted }}>{kats.length} kategori</span>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead style={{ background: C.bg }}>
                <tr>
                    {["KATEGORİ", "İŞLEM", "TOPLAM", "AKSİYON"].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "10px 20px", fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {kats.map(k => (
                    <tr key={k.id} style={{ borderTop: `1px solid ${C.border}` }} onMouseEnter={e => e.currentTarget.style.background = C.bg} onMouseLeave={e => e.currentTarget.style.background = ""}>
                        <td style={{ padding: "13px 20px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <span style={{ width: 12, height: 12, borderRadius: "50%", background: k.renk, display: "inline-block", flexShrink: 0 }} />
                                <span style={{ fontWeight: 600 }}>{k.ad}</span>
                            </div>
                        </td>
                        <td style={{ padding: "13px 20px", color: C.textMuted }}>{getIslem(k.ad, tip)}</td>
                        <td style={{ padding: "13px 20px", fontWeight: 700 }}>₺{getToplam(k.ad, tip).toLocaleString("tr-TR")}</td>
                        <td style={{ padding: "13px 20px" }}><ActionBtns onEdit={() => open(k)} onDelete={() => del(k.id)} /></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div>
            <PageHeader title="Kategoriler" action={<Btn onClick={() => open()}>+ Kategori Ekle</Btn>} />
            <KatTable kats={gelirKats} tip="gelir" />
            <KatTable kats={giderKats} tip="gider" />

            {modal && (
                <Modal title={editing ? "Kategoriyi Düzenle" : "Yeni Kategori"} onClose={() => setModal(false)}>
                    <Field label="Kategori Adı" req>
                        <input style={inputSt} value={form.ad} onChange={e => setForm(f => ({ ...f, ad: e.target.value }))} placeholder="Kategori adı" />
                    </Field>
                    <Field label="Tip">
                        <select style={inputSt} value={form.tip} onChange={e => setForm(f => ({ ...f, tip: e.target.value }))}>
                            <option value="gelir">Gelir Kategorisi</option>
                            <option value="gider">Gider Kategorisi</option>
                        </select>
                    </Field>
                    <Field label="Renk">
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                            {PRESET_COLORS.map(col => (
                                <button key={col} onClick={() => setForm(f => ({ ...f, renk: col }))} style={{
                                    width: 36, height: 36, borderRadius: "50%", background: col, border: form.renk === col ? `3px solid ${C.text}` : "3px solid transparent",
                                    cursor: "pointer", outline: "none", transition: "border 0.15s"
                                }} />
                            ))}
                        </div>
                    </Field>
                    <Field label="Açıklama">
                        <textarea style={{ ...inputSt, resize: "vertical", minHeight: 72 }} value={form.aciklama} onChange={e => setForm(f => ({ ...f, aciklama: e.target.value }))} />
                    </Field>
                    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                        <BtnOutline onClick={() => setModal(false)}>İptal</BtnOutline>
                        <Btn onClick={save}>{editing ? "Güncelle" : "Kaydet"}</Btn>
                    </div>
                </Modal>
            )}
        </div>
    );
}