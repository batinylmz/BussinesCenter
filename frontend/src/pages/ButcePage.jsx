import { useState } from "react";
import { useData } from "../context/DataContext";
import { C, inputSt } from "../utils/constants";
import { PageHeader, BarChart, ActionBtns, Modal, Field, Btn, BtnOutline } from "../components/SharedComponents";

export default function ButcePage() {
    const { data, setData } = useData();
    const [modal, setModal] = useState(false);
    const [form, setForm] = useState({});
    const [editing, setEditing] = useState(null);

    const open = (row = null) => {
        setEditing(row);
        setForm(row ? { ...row, yillik: String(row.yillik), q1: String(row.q1), q1g: String(row.q1g), q2: String(row.q2), q2g: String(row.q2g), q3plan: String(row.q3plan), q4plan: String(row.q4plan) }
            : { departman: "", yillik: "", q1: "", q1g: "0", q2: "", q2g: "0", q3plan: "", q4plan: "" });
        setModal(true);
    };
    const save = () => {
        if (!form.departman) return;
        const n = s => Number(s) || 0;
        const item = { ...form, yillik: n(form.yillik), q1: n(form.q1), q1g: n(form.q1g), q2: n(form.q2), q2g: n(form.q2g), q3plan: n(form.q3plan), q4plan: n(form.q4plan), id: editing?.id || Date.now() };
        setData(d => ({ ...d, butce: editing ? d.butce.map(x => x.id === editing.id ? item : x) : [...d.butce, item] }));
        setModal(false);
    };

    const chartData = data.butce.map(b => ({ departman: b.departman, hedef: b.yillik, gercek: b.q1g + b.q2g }));

    return (
        <div>
            <PageHeader title="Bütçe Planlama" action={<Btn onClick={() => open()}>+ Bütçe Ekle</Btn>} />

            <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 14, padding: 24, marginBottom: 20 }}>
                <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>Hedef vs Gerçek (Departman)</h3>
                <BarChart data={chartData} />
            </div>

            <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}` }}>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Bütçe Planlama Tablosu</h3>
                </div>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                        <thead style={{ background: C.bg }}>
                        <tr>
                            {["DEPARTMAN", "YILLIK BÜTÇE", "Q1 GERÇEK", "Q2 GERÇEK", "Q3 PLAN", "Q4 PLAN", "TOPLAM HARCAMA", "KALAN", ""].map(h => (
                                <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {data.butce.map(b => {
                            const toplamHarcama = b.q1g + b.q2g;
                            const kalan = b.yillik - toplamHarcama;
                            return (
                                <tr key={b.id} style={{ borderTop: `1px solid ${C.border}` }} onMouseEnter={e => e.currentTarget.style.background = C.bg} onMouseLeave={e => e.currentTarget.style.background = ""}>
                                    <td style={{ padding: "12px 16px", fontWeight: 600 }}>{b.departman}</td>
                                    <td style={{ padding: "12px 16px" }}>₺{b.yillik.toLocaleString("tr-TR")}</td>
                                    <td style={{ padding: "12px 16px", color: C.textMuted }}>₺{b.q1g.toLocaleString("tr-TR")}</td>
                                    <td style={{ padding: "12px 16px", color: C.textMuted }}>₺{b.q2g.toLocaleString("tr-TR")}</td>
                                    <td style={{ padding: "12px 16px", color: C.textMuted }}>₺{b.q3plan.toLocaleString("tr-TR")}</td>
                                    <td style={{ padding: "12px 16px", color: C.textMuted }}>₺{b.q4plan.toLocaleString("tr-TR")}</td>
                                    <td style={{ padding: "12px 16px", fontWeight: 700 }}>₺{toplamHarcama.toLocaleString("tr-TR")}</td>
                                    <td style={{ padding: "12px 16px", fontWeight: 700, color: kalan >= 0 ? C.success : C.danger }}>₺{Math.abs(kalan).toLocaleString("tr-TR")}</td>
                                    <td style={{ padding: "12px 16px" }}><ActionBtns onEdit={() => open(b)} onDelete={() => setData(d => ({ ...d, butce: d.butce.filter(x => x.id !== b.id) }))} /></td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>

            {modal && (
                <Modal title={editing ? "Bütçeyi Düzenle" : "Yeni Bütçe"} wide onClose={() => setModal(false)}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <Field label="Departman" req><input style={inputSt} value={form.departman} onChange={e => setForm(f => ({ ...f, departman: e.target.value }))} /></Field>
                        <Field label="Yıllık Bütçe (₺)"><input style={inputSt} type="number" value={form.yillik} onChange={e => setForm(f => ({ ...f, yillik: e.target.value }))} /></Field>
                        <Field label="Q1 Hedef (₺)"><input style={inputSt} type="number" value={form.q1} onChange={e => setForm(f => ({ ...f, q1: e.target.value }))} /></Field>
                        <Field label="Q1 Gerçek (₺)"><input style={inputSt} type="number" value={form.q1g} onChange={e => setForm(f => ({ ...f, q1g: e.target.value }))} /></Field>
                        <Field label="Q2 Hedef (₺)"><input style={inputSt} type="number" value={form.q2} onChange={e => setForm(f => ({ ...f, q2: e.target.value }))} /></Field>
                        <Field label="Q2 Gerçek (₺)"><input style={inputSt} type="number" value={form.q2g} onChange={e => setForm(f => ({ ...f, q2g: e.target.value }))} /></Field>
                        <Field label="Q3 Plan (₺)"><input style={inputSt} type="number" value={form.q3plan} onChange={e => setForm(f => ({ ...f, q3plan: e.target.value }))} /></Field>
                        <Field label="Q4 Plan (₺)"><input style={inputSt} type="number" value={form.q4plan} onChange={e => setForm(f => ({ ...f, q4plan: e.target.value }))} /></Field>
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