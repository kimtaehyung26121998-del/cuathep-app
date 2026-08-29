"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { createOrderCode, getOrderCode } from "./orderCode";

const NHAN_VIEN = {
  "Nguyễn Tuấn Vũ": "0335 952 952",
  "Nguyễn Văn Hướng": "0345 109 555",
  "Nguyễn Ngọc Vinh": "0356 197 836",
  "Lương Văn Nhạn": "0983 783 005",
  "Nguyễn Ngọc Tân": "0962 807 555",
  "Trần Trọng Tiến": "0971 333 758",
};

export const SAN_PHAM_NHAP_KHAU = [
  { code: "KLD-01", name: "Cửa hợp kim nguyên tấm mạ kẽm", dealer: 3500000, retail: 4800000, min: "door", spec: "Cánh 90mm, thép mạ kẽm 1,0mm; khung 70mm, thép 1,5mm; sơn 5D fluorocarbon." },
  { code: "KLD-02", name: "Cửa hợp kim mạ kẽm cánh kính", dealer: 3990000, retail: 5500000, min: "door", spec: "Cánh 90mm; khung 70mm; kính cường lực 2 lớp; khung hoa hợp kim." },
  { code: "KLD-03", name: "Cửa sổ hợp kim nhập khẩu", dealer: 4800000, retail: 5950000, min: "window", spec: "Cánh 90mm; khung 70mm; kính cường lực 2 lớp; khung hoa hợp kim." },
  { code: "KLD-04", name: "Cửa sổ Inox 380 nhập khẩu", dealer: 5500000, retail: 7500000, min: "window", spec: "Cánh Inox 95mm; khung 70mm; bản lề Inox 304; kính hộp cường lực 6mm." },
  { code: "KLD-05", name: "Song cửa sổ hợp kim Ø25", dealer: 750000, retail: 1500000, min: "none", spec: "Song cửa sổ hợp kim Ø25, tính theo m²." },
  { code: "KLD-06", name: "Cửa hợp kim mạ kẽm huỳnh ghép / huỳnh 2 mặt", dealer: 3990000, retail: 5500000, min: "door", spec: "Cánh 90mm; khung 70mm; sơn 6D fluorocarbon; bản lề hợp kim." },
  { code: "KLD-07", name: "Cửa hợp kim Magie huỳnh nhôm đúc mặt trước", dealer: 5500000, retail: 7000000, min: "door", spec: "Huỳnh nhôm đúc một mặt, mặt sau hợp kim; cánh 90mm; khung 70mm." },
  { code: "KLD-08", name: "Cửa hợp kim Magie cao cấp", dealer: 4500000, retail: 6300000, min: "door", spec: "Cánh hợp kim 1,2mm; kính cường lực 2 lớp; bản lề Inox 304 chịu lực 300kg." },
  { code: "KLD-09", name: "Cửa Inox 380 KLD", dealer: 4500000, retail: 6500000, min: "door", spec: "Cánh Inox 95mm; khung 70mm; sơn 6D; mẫu KLD-BXG-7006 đến KLD-BXG-7017." },
  { code: "KLD-10", name: "Cửa Inox 380 mẫu sơn thủy / tràn viền 2 mặt", dealer: 5800000, retail: 7500000, min: "door", spec: "Mẫu KLD-BXG-7001, 7002, 7003, 7005; bản lề Inox 304." },
  { code: "KLD-11", name: "Cửa Inox 380 KLD cánh kính", dealer: 5000000, retail: 7000000, min: "door", spec: "Cánh Inox 95mm; kính hộp cường lực 6mm; bản lề Inox 304." },
  { code: "KLD-12", name: "Cửa Inox 380 KLD 1,2mm", dealer: 5200000, retail: 7200000, min: "door", spec: "Cánh Inox 1,2mm; khung Inox 1,5mm; sơn 6D fluorocarbon." },
  { code: "KLD-13", name: "Cửa nhôm đúc 4mm mặt trước, mặt sau Inox 1,0mm", dealer: 5500000, retail: 16950000, min: "none", spec: "Mặt sau tiêu chuẩn nhôm đúc 2mm; mỗi mm tăng thêm ở mặt sau cộng 1.000.000đ/m²." },
  { code: "KLD-14", name: "Cửa nhôm điêu khắc cao cấp 8,0mm", dealer: 12950000, retail: 16950000, min: "none", spec: "Cấu tạo 5 lớp; sơn BASF Đức; bản lề và khóa Đức; foam chống cháy Đức." },
  { code: "KLD-15", name: "Cửa nhôm điêu khắc cao cấp 6,0mm", dealer: 10500000, retail: 14950000, min: "none", spec: "Cấu tạo 5 lớp; khung Inox 1,5mm; sơn BASF Đức; phụ kiện Đức." },
  { code: "KLD-16", name: "Cửa nhôm điêu khắc cao cấp 4,0mm", dealer: 8500000, retail: 12950000, min: "none", spec: "Cấu tạo 5 lớp; khung Inox 1,5mm; foam chống cháy và lưới Inox 6mm." },
  { code: "KLD-17", name: "Cửa nhôm điêu khắc cao cấp 2,0mm", dealer: 6950000, retail: 9950000, min: "none", spec: "Cấu tạo 5 lớp; sơn BASF Đức; bản lề và khóa Đức." },
  { code: "KLD-18", name: "Cửa nhôm cầu cách nhiệt cao cấp", dealer: 14900000, retail: 25000000, min: "none", spec: "Nhôm trước/sau 4mm; sơn vân gỗ 5D; foam chống cháy; bản lề trục xoay." },
];

export const PHU_KIEN_NHAP_KHAU = [
  { code: "PK-19", name: "Bản lề trục xoay nội địa chịu lực 250kg", unit: "bộ", dealer: 8900000, retail: 15000000 },
  { code: "PK-20", name: "Bản lề trục xoay nhập khẩu chịu lực 250kg", unit: "bộ", dealer: 15000000, retail: 25000000 },
  { code: "PK-21", name: "Hèm chắn bụi tự động", unit: "bộ", dealer: 0, retail: 0, manual: true },
  { code: "PK-22", name: "Bản lề ẩn 180 độ", unit: "chiếc", dealer: 1500000, retail: 1500000 },
  { code: "PK-23", name: "Sơn vân gỗ 5D cho dòng cửa nhôm cao cấp", unit: "m²", dealer: 1500000, retail: 1500000 },
  { code: "PK-24", name: "Ô kính cánh phụ - kính cường lực 2 mặt", unit: "ô", dealer: 1500000, retail: 1500000 },
  { code: "PK-25", name: "Phào mặt trong bản 12cm", unit: "md", dealer: 250000, retail: 290000 },
  { code: "PK-26", name: "Khóa Inox 11 điểm, tay nắm 60cm", unit: "bộ", dealer: 2900000, retail: 5200000 },
  { code: "PK-27", name: "Khóa Inox 1 cánh, 9 chốt Inox", unit: "bộ", dealer: 1500000, retail: 2500000 },
  { code: "PK-28", name: "Khóa vân tay", unit: "bộ", dealer: 5900000, retail: 8900000 },
  { code: "PK-29", name: "Khóa vân tay mẫu tay nắm nhôm đúc", unit: "bộ", dealer: 8900000, retail: 13900000 },
  { code: "PK-30", name: "Tay nắm nhôm đúc - tùy mẫu", unit: "bộ", dealer: 5500000, retail: 5500000, from: true },
  { code: "PK-31", name: "Khung nhôm dày 4mm", unit: "md", dealer: 650000, retail: 650000 },
  { code: "PK-32", name: "Vách kính lớn - chưa bao gồm kính", unit: "m²", dealer: 3000000, retail: 5000000 },
];

const OPENING_TYPES = ["Cửa đơn", "Cửa 2 cánh", "Cửa 3 cánh", "Cửa 4 cánh", "Cửa sổ 1 cánh", "Cửa sổ 2 cánh", "Cửa sổ 3 cánh", "Cửa sổ 4 cánh"];
const money = (value) => Number(value || 0).toLocaleString("vi-VN");
const cleanMoney = (value) => String(value ?? "").replace(/\D/g, "");
const quantity = (value) => Number(value || 0).toFixed(2).replace(/\.00$/, "").replace(/(\.\d*[1-9])0$/, "$1");
const makeDoor = () => ({ id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, productCode: "", opening: "", frame: "", width: "", height: "", color: "", direction: "", unitPrice: "", note: "" });

function billedArea(door, product) {
  const area = (Number(door.width || 0) / 1000) * (Number(door.height || 0) / 1000);
  if (!product || product.min === "none") return area;
  if (product.min === "door") return Math.max(area, 2);
  const leaf = Number(door.opening.match(/(\d)/)?.[1] || 1);
  return Math.max(area, ({ 1: 1.8, 2: 2.5, 3: 3.5, 4: 4 })[leaf] || 1.8);
}

export default function ImportedDoorOrder({ onBack }) {
  const [tier, setTier] = useState("retail");
  const [employee, setEmployee] = useState("");
  const [customer, setCustomer] = useState("");
  const [address, setAddress] = useState("");
  const [deposit, setDeposit] = useState("");
  const [shipping, setShipping] = useState("");
  const [doors, setDoors] = useState([makeDoor()]);
  const [extras, setExtras] = useState([]);
  const [preview, setPreview] = useState(false);
  const [savedOrders, setSavedOrders] = useState([]);
  const [showSaved, setShowSaved] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [exporting, setExporting] = useState(false);
  const invoiceRef = useRef(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const all = JSON.parse(localStorage.getItem("order_archive_v1") || "[]");
        setSavedOrders(Array.isArray(all) ? all : []);
      } catch { setSavedOrders([]); }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const priceFor = (item, nextTier = tier) => item?.[nextTier] || 0;
  const updateDoor = (id, field, value) => setDoors((items) => items.map((item) => item.id === id ? { ...item, [field]: value } : item));
  const selectProduct = (id, code) => {
    const product = SAN_PHAM_NHAP_KHAU.find((item) => item.code === code);
    setDoors((items) => items.map((item) => item.id === id ? { ...item, productCode: code, unitPrice: String(priceFor(product)) } : item));
  };
  const changeTier = (nextTier) => {
    setTier(nextTier);
    setDoors((items) => items.map((door) => ({ ...door, unitPrice: door.productCode ? String(priceFor(SAN_PHAM_NHAP_KHAU.find((item) => item.code === door.productCode), nextTier)) : door.unitPrice })));
    setExtras((items) => items.map((extra) => {
      const source = PHU_KIEN_NHAP_KHAU.find((item) => item.code === extra.code);
      return { ...extra, unitPrice: source?.manual ? extra.unitPrice : String(priceFor(source, nextTier)) };
    }));
  };
  const addExtra = (code) => {
    if (!code || extras.some((item) => item.code === code)) return;
    const source = PHU_KIEN_NHAP_KHAU.find((item) => item.code === code);
    setExtras((items) => [...items, { code, qty: "1", unitPrice: String(priceFor(source)) }]);
  };
  const updateExtra = (code, field, value) => setExtras((items) => items.map((item) => item.code === code ? { ...item, [field]: value } : item));

  const doorTotal = (door) => {
    const product = SAN_PHAM_NHAP_KHAU.find((item) => item.code === door.productCode);
    return billedArea(door, product) * Number(door.unitPrice || 0);
  };
  const extrasTotal = extras.reduce((sum, item) => sum + Number(item.qty || 0) * Number(item.unitPrice || 0), 0);
  const subtotal = doors.reduce((sum, door) => sum + doorTotal(door), 0) + extrasTotal;
  const grandTotal = subtotal + Number(shipping || 0);
  const remaining = grandTotal - Number(deposit || 0);
  const visibleSaved = useMemo(() => savedOrders.filter((order) => order.type === "cua-nhap-khau" && (!employee || order.employee === employee)), [savedOrders, employee]);

  const saveOrder = () => {
    if (!employee) return alert("Vui lòng chọn nhân viên trước khi lưu đơn.");
    const previous = editingId ? savedOrders.find((order) => order.id === editingId) : null;
    const now = new Date();
    const order = {
      id: previous?.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      type: "cua-nhap-khau", employee, customer: customer || "Khách chưa đặt tên", address, deposit, shipping, tier, doors, extras,
      createdAt: previous?.createdAt || now.toISOString(), updatedAt: now.toISOString(), edited: Boolean(previous),
      orderCode: previous?.orderCode || createOrderCode(employee, now, savedOrders.map((item) => item.orderCode)),
    };
    const next = previous ? savedOrders.map((item) => item.id === previous.id ? order : item) : [order, ...savedOrders];
    localStorage.setItem("order_archive_v1", JSON.stringify(next));
    setSavedOrders(next); setEditingId("");
    alert(previous ? "Đã cập nhật đơn cửa nhập khẩu." : "Đã lưu đơn cửa nhập khẩu.");
  };
  const openSaved = (order) => {
    setEditingId(order.id); setEmployee(order.employee || ""); setCustomer(order.customer || ""); setAddress(order.address || "");
    setDeposit(order.deposit || ""); setShipping(order.shipping || ""); setTier(order.tier || "retail"); setDoors(order.doors?.length ? order.doors : [makeDoor()]); setExtras(order.extras || []);
  };
  const deleteSaved = (id) => {
    const next = savedOrders.filter((item) => item.id !== id);
    localStorage.setItem("order_archive_v1", JSON.stringify(next)); setSavedOrders(next);
  };
  const exportImage = async () => {
    if (!invoiceRef.current || exporting) return;
    setExporting(true);
    try {
      await document.fonts?.ready;
      const canvas = await html2canvas(invoiceRef.current, { backgroundColor: "#fff", scale: Math.min(window.devicePixelRatio * 2, 3), useCORS: true });
      const link = document.createElement("a"); link.href = canvas.toDataURL("image/png");
      link.download = `bao-gia-cua-nhap-khau-${new Date().toISOString().slice(0, 10)}.png`; link.click();
    } finally { setExporting(false); }
  };

  if (preview) return (
    <div className="imported-invoice-screen">
      <div className="imported-invoice-actions no-print">
        <button type="button" onClick={() => setPreview(false)}>← Chỉnh sửa</button>
        <button type="button" onClick={exportImage} disabled={exporting}>{exporting ? "Đang tạo ảnh..." : "Tải ảnh báo giá"}</button>
      </div>
      <article ref={invoiceRef} className="imported-invoice">
        <header className="imported-invoice-header">
          <img src="/logo.png" alt="An Phát" />
          <div><p>CÔNG TY TNHH AN PHÁT</p><h1>BÁO GIÁ CỬA NHẬP KHẨU</h1><span>Bảng giá KLD 2026 · {tier === "dealer" ? "Giá đại lý" : "Giá bán"}</span></div>
        </header>
        <section className="imported-customer-grid">
          <p><b>Nhân viên:</b> {employee || "-"}</p><p><b>Điện thoại:</b> {NHAN_VIEN[employee] || "-"}</p>
          <p><b>Khách hàng:</b> {customer || "-"}</p><p><b>Địa chỉ:</b> {address || "-"}</p>
        </section>
        <div className="imported-table-wrap"><table><thead><tr><th>STT</th><th>Sản phẩm</th><th>Kích thước</th><th>SL tính giá</th><th>Đơn giá</th><th>Thành tiền</th></tr></thead><tbody>
          {doors.map((door, index) => {
            const product = SAN_PHAM_NHAP_KHAU.find((item) => item.code === door.productCode);
            const actual = (Number(door.width || 0) / 1000) * (Number(door.height || 0) / 1000);
            const billed = billedArea(door, product);
            return <tr key={door.id}><td>{index + 1}</td><td><b>{product?.name || "Chưa chọn sản phẩm"}</b><small>{door.opening || "-"} · Khuôn {door.frame || "-"} · Màu {door.color || "-"} · Mở {door.direction || "-"}{door.note ? ` · ${door.note}` : ""}</small></td><td>{door.width || 0} × {door.height || 0} mm</td><td>{quantity(billed)} m²{billed > actual && <small>DT thực {quantity(actual)} m²</small>}</td><td>{money(door.unitPrice)} đ</td><td>{money(Math.round(doorTotal(door)))} đ</td></tr>;
          })}
          {extras.map((extra, index) => { const source = PHU_KIEN_NHAP_KHAU.find((item) => item.code === extra.code); return <tr key={extra.code}><td>{doors.length + index + 1}</td><td><b>{source?.name}</b></td><td>-</td><td>{quantity(extra.qty)} {source?.unit}</td><td>{money(extra.unitPrice)} đ</td><td>{money(Number(extra.qty || 0) * Number(extra.unitPrice || 0))} đ</td></tr>; })}
        </tbody></table></div>
        <section className="imported-summary"><p><span>Tạm tính</span><b>{money(Math.round(subtotal))} đ</b></p><p><span>Vận chuyển</span><b>{money(shipping)} đ</b></p><p><span>Khách đã cọc</span><b>- {money(deposit)} đ</b></p><p className="grand"><span>CÒN PHẢI THANH TOÁN</span><b>{money(Math.round(remaining))} đ</b></p></section>
        <footer><p>Báo giá được lập theo bảng giá KLD 2026. Các hạng mục chưa có giá trong bảng gốc được nhập thủ công khi lên đơn.</p><div><span>KHÁCH HÀNG</span><span>NHÂN VIÊN KINH DOANH</span></div></footer>
      </article>
    </div>
  );

  return (
    <div className="imported-order-shell"><main className="imported-order-panel">
      <button type="button" onClick={onBack} className="imported-back">← Quay lại</button>
      <header className="imported-order-heading"><img src="/logo.png" alt="An Phát" /><div><p>BẢNG GIÁ KLD · 2026</p><h1>Lên Đơn Cửa Nhập Khẩu</h1><span>Chọn dòng cửa, kích thước và phụ kiện để tự động tính báo giá.</span></div></header>
      <section className="imported-tier" aria-label="Loại bảng giá"><button type="button" className={tier === "retail" ? "active" : ""} onClick={() => changeTier("retail")}>Giá bán</button><button type="button" className={tier === "dealer" ? "active" : ""} onClick={() => changeTier("dealer")}>Giá đại lý</button></section>
      <select value={employee} onChange={(event) => setEmployee(event.target.value)}><option value="">Chọn nhân viên</option>{Object.keys(NHAN_VIEN).map((name) => <option key={name}>{name}</option>)}</select>
      <section className="imported-saved"><button type="button" onClick={() => setShowSaved((value) => !value)}>{showSaved ? "Ẩn đơn đã lưu" : "Xem đơn đã lưu"} ({visibleSaved.length})</button>{showSaved && <div>{visibleSaved.length === 0 && <p>Chưa có đơn cửa nhập khẩu phù hợp.</p>}{visibleSaved.map((order) => <article key={order.id}><span><b>{order.customer}</b><small>{getOrderCode(order)} · {new Date(order.createdAt).toLocaleString("vi-VN")}</small></span><span><button type="button" onClick={() => openSaved(order)}>Mở</button><button type="button" onClick={() => deleteSaved(order.id)}>Xóa</button></span></article>)}</div>}</section>
      <div className="imported-customer-inputs"><input value={customer} onChange={(event) => setCustomer(event.target.value)} placeholder="Tên khách hàng" /><input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Địa chỉ khách hàng" /><input inputMode="numeric" value={deposit ? money(deposit) : ""} onChange={(event) => setDeposit(cleanMoney(event.target.value))} placeholder="Khách đã cọc" /><input inputMode="numeric" value={shipping ? money(shipping) : ""} onChange={(event) => setShipping(cleanMoney(event.target.value))} placeholder="Cước vận chuyển" /></div>

      <section className="imported-door-list">{doors.map((door, index) => {
        const product = SAN_PHAM_NHAP_KHAU.find((item) => item.code === door.productCode);
        const actual = (Number(door.width || 0) / 1000) * (Number(door.height || 0) / 1000);
        const billed = billedArea(door, product);
        return <article key={door.id} className="imported-door-card"><header><h2>Bộ cửa {index + 1}</h2><span><button type="button" onClick={() => setDoors((items) => [...items, { ...door, id: makeDoor().id }])}>Sao chép</button><button type="button" disabled={doors.length === 1} onClick={() => setDoors((items) => items.filter((item) => item.id !== door.id))}>Xóa</button></span></header>
          <label>Dòng sản phẩm<select value={door.productCode} onChange={(event) => selectProduct(door.id, event.target.value)}><option value="">Chọn dòng cửa nhập khẩu</option>{SAN_PHAM_NHAP_KHAU.map((item) => <option key={item.code} value={item.code}>{item.code} · {item.name} · {money(priceFor(item))} đ/m²</option>)}</select></label>
          {product && <p className="imported-spec"><b>{product.name}</b><span>{product.spec}</span></p>}
          <div className="imported-door-grid"><select value={door.opening} onChange={(event) => updateDoor(door.id, "opening", event.target.value)}><option value="">Chọn kiểu mở / số cánh</option>{OPENING_TYPES.map((item) => <option key={item}>{item}</option>)}</select><input value={door.frame} onChange={(event) => updateDoor(door.id, "frame", event.target.value)} placeholder="Độ dày khuôn" /><input inputMode="numeric" value={door.width} onChange={(event) => updateDoor(door.id, "width", cleanMoney(event.target.value))} placeholder="Chiều rộng (mm)" /><input inputMode="numeric" value={door.height} onChange={(event) => updateDoor(door.id, "height", cleanMoney(event.target.value))} placeholder="Chiều cao (mm)" /><input value={door.color} onChange={(event) => updateDoor(door.id, "color", event.target.value)} placeholder="Mã màu" /><input value={door.direction} onChange={(event) => updateDoor(door.id, "direction", event.target.value)} placeholder="Hướng mở" /><input inputMode="numeric" value={door.unitPrice ? money(door.unitPrice) : ""} onChange={(event) => updateDoor(door.id, "unitPrice", cleanMoney(event.target.value))} placeholder="Đơn giá / m²" /><input value={door.note} onChange={(event) => updateDoor(door.id, "note", event.target.value)} placeholder="Ghi chú bộ cửa" /></div>
          <div className="imported-door-total"><span>Diện tích thực <b>{quantity(actual)} m²</b>{billed > actual && <small> Tính giá tối thiểu {quantity(billed)} m²</small>}</span><strong>{money(Math.round(doorTotal(door)))} đ</strong></div>
        </article>;
      })}</section>
      <button type="button" className="imported-add-door" onClick={() => setDoors((items) => [...items, makeDoor()])}>+ Thêm bộ cửa</button>

      <section className="imported-extras"><header><div><p>PHỤ KIỆN KLD 2026</p><h2>Phụ kiện & hạng mục thêm</h2></div><select defaultValue="" onChange={(event) => { addExtra(event.target.value); event.target.value = ""; }}><option value="">+ Thêm phụ kiện</option>{PHU_KIEN_NHAP_KHAU.filter((item) => !extras.some((extra) => extra.code === item.code)).map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}</select></header>
        {extras.length === 0 && <p className="imported-empty">Chưa chọn phụ kiện.</p>}
        {extras.map((extra) => { const source = PHU_KIEN_NHAP_KHAU.find((item) => item.code === extra.code); return <article key={extra.code}><div><b>{source?.name}</b><small>{source?.manual ? "Bảng gốc chưa ghi giá - nhập giá thực tế" : `${source?.from ? "Từ " : ""}${money(priceFor(source))} đ/${source?.unit}`}</small></div><input inputMode="decimal" value={extra.qty} onChange={(event) => updateExtra(extra.code, "qty", event.target.value.replace(/[^\d.]/g, ""))} aria-label={`Số lượng ${source?.name}`} /><span>{source?.unit}</span><input inputMode="numeric" value={extra.unitPrice ? money(extra.unitPrice) : ""} onChange={(event) => updateExtra(extra.code, "unitPrice", cleanMoney(event.target.value))} aria-label={`Đơn giá ${source?.name}`} /><b>{money(Number(extra.qty || 0) * Number(extra.unitPrice || 0))} đ</b><button type="button" onClick={() => setExtras((items) => items.filter((item) => item.code !== extra.code))}>×</button></article>; })}
      </section>
      <section className="imported-total-card"><p><span>Tiền cửa</span><b>{money(Math.round(subtotal - extrasTotal))} đ</b></p><p><span>Phụ kiện</span><b>{money(Math.round(extrasTotal))} đ</b></p><p><span>Vận chuyển</span><b>{money(shipping)} đ</b></p><p className="grand"><span>Tổng đơn</span><b>{money(Math.round(grandTotal))} đ</b></p></section>
      <div className="imported-actions"><button type="button" onClick={saveOrder}>Lưu đơn</button><button type="button" onClick={() => setPreview(true)}>Xem báo giá</button></div>
    </main></div>
  );
}
