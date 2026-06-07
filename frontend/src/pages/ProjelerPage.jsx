import { useState } from "react";
import { useData } from "../context/DataContext";
import { C, fmt, inputSt } from "../utils/constants";
import { PageHeader, Badge, ProgressBar, Modal, Field, Btn, BtnOutline } from "../components/SharedComponents";

export default function ProjelerPage() {
    const { data, setData } = useData();
    const [modal, setModal] = useState(false);
    const [form, setForm] = useState({});
    const [editing, setEditing] = useState(null);
    const DURUMLAR = ["Planlama", "Devam Ediyor", "Tamamlandı", "Askıya Alındı"];
    const ONCELIKLER = ["Kritik", "Yüksek", "Orta", "Düşük"];
    const durumRenk = { "Planlama": C.warning, "Devam Ediyor": C.primary, "Tamamlandı": C.success, "Askıya Alındı": C.danger };

    const open = (row = null) => {
        setEditing(row);
        setForm(row ? { ...row, butce: String(row.butce), harcanan: String(row.harcanan) }
            : { ad: "", departman: "", durum: "Planlama", butce: "", harcanan: "0", bitis: "", oncelik: "Orta" });
        setModal(true);
    };
    const save = () => {
        if (!form.ad) return;
        const item = { ...form, butce: Number(form.butce), harcanan: Number(form.harcanan), id: editing?.id || Date.now() };
        setData(d => ({ ...d, projeler: editing ? d.projeler.map(x => x.id === editing.id ? item : x) : [...d.projeler, item] }));
        setModal(false);
    };

    return (
        <div>
            <PageHeader title="Projeler" action={<Btn onClick={() => open()}>+ Proje Ekle</Btn>} />
            <div style={{ display: "grid", gap: 14 }}>
                {data.projeler.map(p => {
                    const pct = Math.round((p.harcanan / p.butce) * 100);
                    return (
                        <div key={p.id} style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 14, padding: 22 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 6 }}>{p.ad}</div>
                                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                        <Badge label={p.departman} color={C.primary} />
                                        <Badge label={p.durum} color={durumRenk[p.durum] || C.gray} />
                                        <Badge label={p.oncelik} color={p.oncelik === "Kritik" ? C.danger : p.oncelik === "Yüksek" ? C.warning : C.gray} />
                                    </div>
                                </div>
                                <div style={{ fontSize: 13, color: C.textMuted }}>Bitiş: {p.bitis}</div>
                            </div>
                            <div style={{ display: "flex", gap: 32, marginBottom: 12 }}>
                                <div><div style={{ fontSize: 12, color: C.textMuted }}>Bütçe</div><div style={{ fontWeight: 700, color: C.primary, fontSize: 16 }}>{fmt(p.butce)}</div></div>
                                <div><div style={{ fontSize: 12, color: C.textMuted }}>Harcanan</div><div style={{ fontWeight: 700, color: p.harcanan > p.butce ? C.danger : C.success, fontSize: 16 }}>{fmt(p.harcanan)}</div></div>
                                <div><div style={{ fontSize: 12, color: C.textMuted }}>Kalan</div><div style={{ fontWeight: 700, fontSize: 16 }}>{fmt(p.butce - p.harcanan)}</div></div>
                            </div>
                            <ProgressBar pct={pct} />
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
                                <span style={{ fontSize: 12, color: C.textMuted }}>%{pct} kullanıldı</span>
                                <div style={{ display: "flex", gap: 12 }}>
                                    <button onClick={() => open(p)} style={{ background: "none", border: "none", color: C.primary, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>Düzenle</button>
                                    <button onClick={() => setData(d => ({ ...d, projeler: d.projeler.filter(x => x.id !== p.id) }))} style={{ background: "none", border: "none", color: C.danger, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>Sil</button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {modal && (
                <Modal title={editing ? "Projeyi Düzenle" : "Yeni Proje"} onClose={() => setModal(false)}>
                    <Field label="Proje Adı" req><input style={inputSt} value={form.ad} onChange={e => setForm(f => ({ ...f, ad: e.target.value }))} /></Field>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <Field label="Departman"><input style={inputSt} value={form.departman} onChange={e => setForm(f => ({ ...f, departman: e.target.value }))} /></Field>
                        <Field label="Durum">
                            <select style={inputSt} value={form.durum} onChange={e => setForm(f => ({ ...f, durum: e.target.value }))}>
                                {DURUMLAR.map(d => <option key={d}>{d}</option>)}
                            </select>
                        </Field>
                        <Field label="Öncelik">
                            <select style={inputSt} value={form.oncelik} onChange={e => setForm(f => ({ ...f, oncelik: e.target.value }))}>
                                {ONCELIKLER.map(o => <option key={o}>{o}</option>)}
                            </select>
                        </Field>
                        <Field label="Bitiş Tarihi"><input style={inputSt} type="date" value={form.bitis} onChange={e => setForm(f => ({ ...f, bitis: e.target.value }))} /></Field>
                        <Field label="Bütçe (₺)"><input style={inputSt} type="number" value={form.butce} onChange={e => setForm(f => ({ ...f, butce: e.target.value }))} /></Field>
                        <Field label="Harcanan (₺)"><input style={inputSt} type="number" value={form.harcanan} onChange={e => setForm(f => ({ ...f, harcanan: e.target.value }))} /></Field>
                    </div>
                    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
                        <BtnOutline onClick={() => setModal(false)}>İptal</BtnOutline>
                        <Btn onClick={save}>{editing ? "Güncelle" : "Kaydet"}</Btn>
                    </div>
                </Modal>
            )}
        </div>
    );
}