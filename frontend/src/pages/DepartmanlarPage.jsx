import { useState } from "react";
import { useData } from "../context/DataContext";
import { C, fmt, inputSt } from "../utils/constants";
import { PageHeader, StatCard, ProgressBar, Modal, Field, Btn, BtnOutline } from "../components/SharedComponents";

export default function DepartmanlarPage() {
    const { data, setData } = useData();
    const [modal, setModal] = useState(false);
    const [form, setForm] = useState({});
    const [editing, setEditing] = useState(null);

    const toplamDep = data.departmanlar.length;
    const enYuksek = data.departmanlar.reduce((a, b) => b.harcanan > a.harcanan ? b : a, data.departmanlar[0]);
    const ortGider = Math.round(data.departmanlar.reduce((s, d) => s + d.harcanan, 0) / (toplamDep || 1));

    const open = (row = null) => {
        setEditing(row);
        setForm(row ? { ...row, calisan: String(row.calisan), butce: String(row.butce), harcanan: String(row.harcanan) }
            : { ad: "", yonetici: "", calisan: "", butce: "", harcanan: "0" });
        setModal(true);
    };
    const save = () => {
        if (!form.ad) return;
        const item = { ...form, calisan: Number(form.calisan), butce: Number(form.butce), harcanan: Number(form.harcanan), id: editing?.id || Date.now() };
        setData(d => ({ ...d, departmanlar: editing ? d.departmanlar.map(x => x.id === editing.id ? item : x) : [...d.departmanlar, item] }));
        setModal(false);
    };

    return (
        <div>
            <PageHeader title="Departman Yönetimi" action={<Btn onClick={() => open()}>+ Departman Ekle</Btn>} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
                <StatCard label="Toplam Departman" value={toplamDep} icon="🏢" />
                <StatCard label="En Yüksek Harcama" value={enYuksek?.ad || "-"} sub={fmt(enYuksek?.harcanan)} icon="📈" iconColor={C.danger} />
                <StatCard label="Ort. Departman Gideri" value={fmt(ortGider)} icon="👥" iconColor={C.purple} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
                {data.departmanlar.map(dep => {
                    const pct = Math.round((dep.harcanan / dep.butce) * 100);
                    const isCritical = pct >= 80;
                    const isWarning = pct >= 60 && pct < 80;
                    return (
                        <div key={dep.id} style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 14, padding: 22 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                                <div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                        <span style={{ fontWeight: 800, fontSize: 16, color: C.text }}>{dep.ad}</span>
                                        {isCritical && <span title="Bütçe kritik seviyede" style={{ fontSize: 14 }}>🔴</span>}
                                        {isWarning && !isCritical && <span title="Dikkat" style={{ fontSize: 14 }}>⚠️</span>}
                                    </div>
                                    <div style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>{dep.yonetici}</div>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 4, color: C.textMuted, fontSize: 13 }}>
                                    <span>👥</span><span>{dep.calisan}</span>
                                </div>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, marginTop: 10 }}>
                                <span style={{ fontSize: 13, color: C.textMuted }}>Bütçe: <strong style={{ color: C.text }}>{fmt(dep.butce)}</strong></span>
                                <span style={{ fontSize: 13, color: isCritical ? C.danger : C.success }}>Harcanan: <strong>{fmt(dep.harcanan)}</strong></span>
                            </div>
                            <ProgressBar pct={pct} />
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6, marginBottom: 14 }}>
                                <span style={{ fontSize: 12, color: C.textMuted }}>%{pct} kullanıldı</span>
                                {isCritical && <span style={{ fontSize: 12, fontWeight: 700, color: C.danger }}>Kritik</span>}
                                {isWarning && <span style={{ fontSize: 12, fontWeight: 700, color: C.warning }}>Dikkat</span>}
                            </div>
                            <div style={{ display: "flex", gap: 12 }}>
                                <button onClick={() => open(dep)} style={{ background: "none", border: "none", color: C.primary, cursor: "pointer", fontWeight: 600, fontSize: 13, padding: 0 }}>Düzenle</button>
                                <button onClick={() => setData(d => ({ ...d, departmanlar: d.departmanlar.filter(x => x.id !== dep.id) }))} style={{ background: "none", border: "none", color: C.danger, cursor: "pointer", fontWeight: 600, fontSize: 13, padding: 0 }}>Sil</button>
                            </div>
                        </div>
                    );
                })}
            </div>
            {modal && (
                <Modal title={editing ? "Departmanı Düzenle" : "Yeni Departman"} onClose={() => setModal(false)}>
                    <Field label="Departman Adı" req><input style={inputSt} value={form.ad} onChange={e => setForm(f => ({ ...f, ad: e.target.value }))} /></Field>
                    <Field label="Yönetici"><input style={inputSt} value={form.yonetici} onChange={e => setForm(f => ({ ...f, yonetici: e.target.value }))} /></Field>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <Field label="Çalışan Sayısı"><input style={inputSt} type="number" value={form.calisan} onChange={e => setForm(f => ({ ...f, calisan: e.target.value }))} /></Field>
                        <Field label="Bütçe (₺)"><input style={inputSt} type="number" value={form.butce} onChange={e => setForm(f => ({ ...f, butce: e.target.value }))} /></Field>
                    </div>
                    <Field label="Harcanan (₺)"><input style={inputSt} type="number" value={form.harcanan} onChange={e => setForm(f => ({ ...f, harcanan: e.target.value }))} /></Field>
                    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                        <BtnOutline onClick={() => setModal(false)}>İptal</BtnOutline>
                        <Btn onClick={save}>{editing ? "Güncelle" : "Kaydet"}</Btn>
                    </div>
                </Modal>
            )}
        </div>
    );
}