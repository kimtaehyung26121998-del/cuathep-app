"use client";

import {
  useState,
  useRef,
  useEffect,
} from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import PaintOrder from "./PaintOrder";
import ImportedDoorOrder from "./ImportedDoorOrder";
import { createOrderCode, getOrderCode } from "./orderCode";
const formatTien = (value) => {

  const number = String(value ?? "").replace(/\D/g, "");

  return Number(number)
    .toLocaleString("en-US");

};
const formatSoLuong = (value) => {
  return Number(value)
    .toFixed(2)
    .replace(/\.00$/, "")
    .replace(/(\.\d*[1-9])0$/, "$1");
};

const formatKichThuoc = (value) => {
  if (value === "" || value === null || value === undefined) return "-";
  return Number(value).toLocaleString("vi-VN");
};

const kichThuocMet = (value) => Number(value || 0) / 1000;

const tinhTienBomForm = (cua) =>
  Number(cua.khuon || 0) < 200 ? 150000 : 250000;

const DANH_SACH_KHOA = [
  { ma: "KDCC", ten: "Hệ thống khóa đồng cao cấp", giaLe: 2500000, giaDaiLy: 2100000 },
  { ma: "KDMV", ten: "Hệ thống khóa đồng mạ vang cao cấp", giaLe: 2800000, giaDaiLy: 2240000 },
  { ma: "VT4941", ten: "Khóa cửa chính 4941 cao cấp", giaLe: 1500000, giaDaiLy: 1200000 },
  { ma: "VT82", ten: "Khóa inox chuyên cửa thông phòng", giaLe: 800000, giaDaiLy: 640000 },
  { ma: "VT333", ten: "Khóa inox đa điểm VT333", giaLe: 1500000, giaDaiLy: 1040000 },
  { ma: "VT666", ten: "Hệ thống khóa chữ H Luxury mạ đồng cao cấp", giaLe: 3300000, giaDaiLy: 2040000 },
  { ma: "KB", ten: "Hệ thống khóa bi và tay năm rồng vàng", giaLe: 3300000, giaDaiLy: 2500000 },
  { ma: "AP10", ten: "Khóa inox mạ đồng cao cấp", giaLe: 1800000, giaDaiLy: 1300000 },
];

const taoBoCuaMoi = (id = null) => ({
  id: id ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,

  loaiCua: "",

  khuon: "",
  rong: "",
  cao: "",

  maMau: "",
  huongMo: "",
  donGia: "",

  coKhoa: false,
  maKhoa: "",
  tenKhoa: "",
  soLuongKhoa: 1,
  donGiaKhoa: "",
  coKhoaNgoai: false,
  donGiaKhoaNgoai: "300000",

  loaiPhao: "",

  donGiaPhao: "",

  coBomForm: false,
  coOThoang: false,

  loaiOThoang: "",
  kinhOThoang: "",
  oThoangDac: "",
  oThoangNanChop: "",
  caoVom: "",

  coKinhCanh: false,
  loaiKinhCanh: "nho",
  kinhCanh: "",
  showNote: false,
  note: "",
});

// Chấp nhận cả tên chuẩn hiện tại và dữ liệu cũ đã từng lưu sai chính tả.
const laPhaoDinh = (cua) =>
  cua?.loaiPhao === "Phào đình" || cua?.loaiPhao === "Phào đỉnh";

const thongTinPhaoDinh = (cua) => {
  if (cua?.kieuPhaoDinh === "tieuchuan") {
    return {
      phaoDung: "25 cm",
      phaoNgang: "25 cm",
      phaoDinh: "45 cm",
    };
  }

  const hienThiCm = (value) =>
    value === "" || value === null || value === undefined
      ? "-"
      : `${value} cm`;

  return {
    phaoDung: hienThiCm(cua?.rongPhaoDung),
    phaoNgang: hienThiCm(cua?.caoPhaoNgang),
    phaoDinh: hienThiCm(cua?.caoPhaoDinh),
  };
};

export default function Home() {
  const [danhSachCua, setDanhSachCua] =
    useState([taoBoCuaMoi("initial")]);

  const [xemHoaDon, setXemHoaDon] =
    useState(false);
  const [editingOrderId, setEditingOrderId] = useState("");
  const [dangXuatPDF, setDangXuatPDF] =
    useState(false);
  const huongGiay = "portrait";
  const [loaiDon, setLoaiDon] =
  useState("");
  const [hienLuaChonCuaThep, setHienLuaChonCuaThep] = useState(false);

  const [nhanVien, setNhanVien] =
    useState("");

  const [tenKhach, setTenKhach] =
    useState("");

  const [diaChiKhach, setDiaChiKhach] =
    useState("");
  const [donDaLuu, setDonDaLuu] = useState([]);
  const [hienDonDaLuu, setHienDonDaLuu] = useState(false);
  const [removingDoorId, setRemovingDoorId] = useState("");
  const [animatedTongCong, setAnimatedTongCong] = useState(0);
    const [tienCoc, setTienCoc] =
  useState("");
  const [
  cuocVanChuyen,
  setCuocVanChuyen,
] = useState("");

  const hoaDonRef = useRef(null);
  const daKhoiPhucBanNhap = useRef(false);
  const [isMobile, setIsMobile] =
  useState(false);

useEffect(() => {

  const checkMobile = () => {
    setIsMobile(
      window.innerWidth < 768
    );
  };

  checkMobile();

  window.addEventListener(
    "resize",
    checkMobile
  );

  return () =>
    window.removeEventListener(
      "resize",
      checkMobile
    );

}, []);
useEffect(() => {
  let pressedButton = null;

  const handlePointerDown = (event) => {
    pressedButton = event.target.closest?.("button");
    pressedButton?.classList.add("is-pressing");
  };

  const handlePointerUp = () => {
    if (!pressedButton) return;

    const button = pressedButton;
    button.classList.remove("is-pressing");
    button.classList.remove("is-releasing");
    void button.offsetWidth;
    button.classList.add("is-releasing");
    window.setTimeout(() => button.classList.remove("is-releasing"), 360);
    pressedButton = null;
  };

  document.addEventListener("pointerdown", handlePointerDown, { passive: true });
  document.addEventListener("pointerup", handlePointerUp, { passive: true });
  document.addEventListener("pointercancel", handlePointerUp, { passive: true });

  return () => {
    document.removeEventListener("pointerdown", handlePointerDown);
    document.removeEventListener("pointerup", handlePointerUp);
    document.removeEventListener("pointercancel", handlePointerUp);
  };
}, []);
useEffect(() => {
  try {
    const savedOrders = JSON.parse(localStorage.getItem("order_archive_v1") || "[]");
    setDonDaLuu(Array.isArray(savedOrders) ? savedOrders : []);
  } catch {
    setDonDaLuu([]);
  }
}, []);
useEffect(() => {

  const saved =
    sessionStorage.getItem(
      "draft_invoice"
    );

  if (saved) {
    let data;
    try {
      data = JSON.parse(saved);
    } catch {
      sessionStorage.removeItem("draft_invoice");
      return;
    }

    const restoreDraft = () => {
      setDanhSachCua(data.danhSachCua || []);

      setNhanVien(data.nhanVien || "");

      setTenKhach(data.tenKhach || "");

      setDiaChiKhach(data.diaChiKhach || "");

      setTienCoc(data.tienCoc || "");

      setCuocVanChuyen(data.cuocVanChuyen || "");

      setLoaiDon(data.loaiDon || "");
      daKhoiPhucBanNhap.current = true;
    };

    setTimeout(restoreDraft, 0);
  } else {
    daKhoiPhucBanNhap.current = true;
  }

}, []);
useEffect(() => {
  if (!daKhoiPhucBanNhap.current) return;
  if (!loaiDon) {
    sessionStorage.removeItem("draft_invoice");
    return;
  }
  try {
    sessionStorage.setItem("draft_invoice", JSON.stringify({
      danhSachCua,
      nhanVien,
      tenKhach,
      diaChiKhach,
      tienCoc,
      cuocVanChuyen,
      loaiDon,
    }));
  } catch (error) {
    console.warn("Không thể lưu bản nháp đơn hàng:", error);
  }
}, [danhSachCua, nhanVien, tenKhach, diaChiKhach, tienCoc, cuocVanChuyen, loaiDon]);
  const danhSachNhanVien = {
    "Nguyễn Tuấn Vũ": "0335 952 952",
    "Nguyễn Văn Hướng": "0345 109 555",
    "Nguyễn Ngọc Vinh": "0356 197 836",
    "Lương Văn Nhạn": "0983 783 005",
    "Nguyễn Ngọc Tân": "0962 807 555",
    "Trần Trọng Tiến": "0971 333 758",
  };

  const capNhatCua = (
    id,
    field,
    value
  ) => {

    setDanhSachCua((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );

  };

  const themCua = () => {

    setDanhSachCua([
      ...danhSachCua,
      taoBoCuaMoi(),
    ]);

  };

  const donCuaDaLuu = donDaLuu.filter((don) =>
    don?.type === "cua" && (!nhanVien || don.employee === nhanVien)
  );

  const luuDonCua = () => {
    if (!nhanVien) {
      alert("Vui lòng chọn nhân viên trước khi lưu đơn.");
      return;
    }
    const donCu = editingOrderId
      ? donDaLuu.find((don) => don.id === editingOrderId)
      : null;
    const donMoi = {
      id: donCu?.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      type: "cua",
      employee: nhanVien,
      customer: tenKhach || "Khách chưa đặt tên",
      createdAt: donCu?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      orderCode: donCu?.orderCode || createOrderCode(
        nhanVien,
        donCu?.createdAt || new Date(),
        donDaLuu.map((don) => don.orderCode)
      ),
      edited: Boolean(donCu) || Boolean(donCu?.edited),
      danhSachCua,
      nhanVien,
      tenKhach,
      diaChiKhach,
      tienCoc,
      cuocVanChuyen,
      loaiDon,
    };
    const danhSachMoi = donCu
      ? donDaLuu.map((don) => don.id === donCu.id ? donMoi : don)
      : [donMoi, ...donDaLuu];
    localStorage.setItem("order_archive_v1", JSON.stringify(danhSachMoi));
    setDonDaLuu(danhSachMoi);
    setEditingOrderId("");
    alert(donCu ? "Đã cập nhật đơn cửa cũ." : "Đã lưu đơn cửa vào kho lưu trữ của nhân viên.");
  };

  const moDonCuaDaLuu = (don) => {
    setEditingOrderId(don.id);
    setDanhSachCua(don.danhSachCua || [taoBoCuaMoi()]);
    setNhanVien(don.nhanVien || don.employee || "");
    setTenKhach(don.tenKhach || "");
    setDiaChiKhach(don.diaChiKhach || "");
    setTienCoc(don.tienCoc || "");
    setCuocVanChuyen(don.cuocVanChuyen || "");
    setLoaiDon(don.loaiDon || "khachle");
    setXemHoaDon(true);
  };

  const xoaDonDaLuu = (id) => {
    const danhSachMoi = donDaLuu.filter((don) => don.id !== id);
    localStorage.setItem("order_archive_v1", JSON.stringify(danhSachMoi));
    setDonDaLuu(danhSachMoi);
    if (editingOrderId === id) setEditingOrderId("");
  };

  const saoChepCua = (id) => {
    setDanhSachCua((prev) => {
      const cuaGoc = prev.find((item) => item.id === id);
      if (!cuaGoc) return prev;

      const banSao = {
        ...cuaGoc,
        id: undefined,
      };
      const cuaMoi = taoBoCuaMoi();
      const banSaoMoi = { ...cuaMoi, ...banSao, id: cuaMoi.id };

      return [...prev, banSaoMoi];
    });
  };

  const xoaCua = (id) => {

    if (danhSachCua.length === 1 || removingDoorId === id)
      return;

    setRemovingDoorId(id);
    window.setTimeout(() => {
      setDanhSachCua((prev) => prev.filter((item) => item.id !== id));
      setRemovingDoorId((current) => (current === id ? "" : current));
    }, 230);

  };

  const capNhatLoaiCua = (id, loaiCuaMoi) => {
    const laCuaSo = loaiCuaMoi.toLowerCase().includes("sổ");

    setDanhSachCua((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              loaiCua: loaiCuaMoi,
              ...(laCuaSo
                ? {
                    huongMo: "Ngoài",
                    coKhoa: false,
                  }
                : {}),
            }
          : item
      )
    );
  };

  const tinhSoLuongCua = (cua) => {
    return (
      kichThuocMet(cua.rong) *
      kichThuocMet(cua.cao)
    );

  };

  const tinhTienCua = (cua) => {

    return (
      tinhSoLuongCua(cua) *
      Number(cua.donGia || 0)
    );

  };

  const tinhPhaoPhu = (cua) => {

    const laCuaSo =
      cua.loaiCua
        .toLowerCase()
        .includes("sổ");

    if (laCuaSo) {

      return (
        kichThuocMet(cua.cao) *
          2 +
        kichThuocMet(cua.rong) *
          2
      );

    }

    return (
      kichThuocMet(cua.rong) +
      kichThuocMet(cua.cao) * 2
    );

  };

  const tinhTienPhao = (cua) => {

    return (
      tinhPhaoPhu(cua) *
      Number(cua.donGiaPhao || 0)
    );

  };

  const tinhTongBoCua = (cua) => {

        const tienCua =
          tinhTienCua(cua);

        const tienKhoa =
          cua.coKhoa
            ? Number(
                cua.soLuongKhoa
              ) *
              Number(
                cua.donGiaKhoa || 0
              )
            : 0;

        const tienKhoaNgoai = cua.coKhoaNgoai
          ? Number(cua.donGiaKhoaNgoai ?? 300000)
          : 0;

        const tienPhao =

  cua.loaiPhao ===
  "Phào phụ"

    ? tinhTienPhao(cua)

    : laPhaoDinh(cua)

    ? (() => {

        const rongPhaoDungM =
          Number(
            cua.rongPhaoDung || 0
          ) / 100;

        const coPhaoNgang =
          Number(
            cua.caoPhaoNgang || 0
          ) > 0;

        const slPhaoDinh =

          cua.kieuPhaoDinh ===
          "tieuchuan"

            ? (

                kichThuocMet(cua.cao) *
                  2 +

                (
                  kichThuocMet(cua.rong) +
                  0.5
                ) +

                (
                  kichThuocMet(cua.rong) +
                  0.8
                )

              )

            : (

                coPhaoNgang

                  ? (

                      kichThuocMet(cua.cao) *
                        2 +

                      (
                        kichThuocMet(cua.rong) +
                        rongPhaoDungM * 2
                      ) +

                      (
                        kichThuocMet(cua.rong) +
                        rongPhaoDungM * 2 +
                        0.3
                      )

                    )

                  : (

                      kichThuocMet(cua.cao) *
                        2 +

                      (
                        kichThuocMet(cua.rong) +
                        rongPhaoDungM * 2 +
                        0.3
                      )

                    )

              );

        return cua.kieuPhaoDinh ===
          "tieuchuan"

          ? (

              slPhaoDinh *

              Number(
                cua.donGiaPhao || 0
              )

            )

          : (

              coPhaoNgang

                ? (

                    (
                      kichThuocMet(cua.cao) *
                      2 *
                      Number(
                        cua.donGiaPhaoDung || 0
                      )
                    ) +

                    (
                      (
                        kichThuocMet(cua.rong) +
                        rongPhaoDungM * 2
                      ) *

                      Number(
                        cua.donGiaPhaoNgang || 0
                      )
                    ) +

                    (
                      (
                        kichThuocMet(cua.rong) +
                        rongPhaoDungM * 2 +
                        0.3
                      ) *

                      Number(
                        cua.donGiaPhaoDinh || 0
                      )
                    )

                  )

                : (

                    (
                      kichThuocMet(cua.cao) *
                      2 *
                      Number(
                        cua.donGiaPhaoDung || 0
                      )
                    ) +

                    (
                      (
                        kichThuocMet(cua.rong) +
                        rongPhaoDungM * 2 +
                        0.3
                      ) *

                      Number(
                        cua.donGiaPhaoDinh || 0
                      )
                    )

                  )

            );

      })()

    : 0;

        const tienBom =
          cua.coBomForm
            ? tinhTienBomForm(cua)
            : 0;
           let tienOThoang = 0;

if (cua.loaiOThoang === "kinh") {

  tienOThoang =
    Number(cua.kinhOThoang || 0)
    * 60000;

}

if (cua.loaiOThoang === "dac") {

  tienOThoang =
    Number(cua.oThoangDac || 0)
    * 350000;

}

if (cua.loaiOThoang === "nanchop") {

  tienOThoang =
    Number(cua.oThoangNanChop || 0)
    * 250000;

}

if (cua.loaiOThoang === "vom") {

  const dienTichVom =

kichThuocMet(cua.rong)
*
Number(cua.caoVom || 0);

  tienOThoang =

    dienTichVom *

    (
      Number(cua.donGia || 0)
      + 350000
    );

}

const donGiaKinhCanh =
  cua.loaiKinhCanh === "to"
    ? 350000
    : 250000;

const tienKinhCanh =
  cua.coKinhCanh
    ? Number(cua.kinhCanh || 0)
      * donGiaKinhCanh
    : 0;

        return (
  tienCua +
  tienKhoa +
  tienKhoaNgoai +
  tienPhao +
  tienBom +
  tienOThoang +
  tienKinhCanh
);
  };

  const tongCong = danhSachCua.reduce(
    (tong, cua) => tong + tinhTongBoCua(cua),
    0
  );

  const soTienDaCoc =
  Number(tienCoc || 0);

const tienVanChuyen =
  Number(cuocVanChuyen || 0);
  const tienVAT =
  loaiDon === "daily"
    ? tongCong * 0.05
    : 0;

const tongSauVanChuyen =
  tongCong +
  tienVAT +
  tienVanChuyen;

  

const conPhaiThanhToan =
  tongSauVanChuyen -
  soTienDaCoc;

  useEffect(() => {
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const from = animatedTongCong;
    const to = tongCong;

    if (reducedMotion || from === to) {
      setAnimatedTongCong(to);
      return undefined;
    }

    let frameId;
    const startedAt = performance.now();
    const duration = Math.min(760, Math.max(280, 280 + Math.abs(to - from) / 14000));

    const tick = (now) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedTongCong(Math.round(from + (to - from) * eased));
      if (progress < 1) frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [tongCong]);

  const taiPDF = async () => {
    if (!hoaDonRef.current || dangXuatPDF) return;

    setDangXuatPDF(true);
    const captureNode = hoaDonRef.current;
    const originalStyle = captureNode.getAttribute("style");

    try {
      if (document.fonts?.ready) await document.fonts.ready;

      const laGiayNgang = huongGiay === "landscape";
      const captureWidthCss = laGiayNgang ? 1123 : 794;
      captureNode.classList.add("invoice-exporting", `invoice-exporting--${huongGiay}`);
      captureNode.style.width = `${captureWidthCss}px`;
      captureNode.style.maxWidth = `${captureWidthCss}px`;
      captureNode.style.padding = laGiayNgang ? "24px 30px" : "30px 32px";

      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

      const captureWidth = Math.ceil(captureNode.getBoundingClientRect().width);
      const captureHeight = Math.ceil(captureNode.scrollHeight);

      const captureRect = captureNode.getBoundingClientRect();
      const layDiemNgat = (selector) => Array.from(captureNode.querySelectorAll(selector))
        .map((element) => element.getBoundingClientRect().top - captureRect.top)
        .filter((value) => value > 0 && value < captureHeight)
        .sort((a, b) => a - b);
      const diemBatDauBoCua = layDiemNgat(".invoice-door-row");
      const diemKetThucHoaDon = layDiemNgat(".invoice-summary")[0] || captureHeight;
      const invoiceTable = captureNode.querySelector(".invoice-door-table");
      const tableRect = invoiceTable?.getBoundingClientRect();
      const tableLeft = tableRect ? tableRect.left - captureRect.left : 0;
      const tableWidth = tableRect?.width || captureWidth;
      const tableHeaderCells = Array.from(
        invoiceTable?.querySelectorAll("thead th") || []
      );
      const tableHeaderWidths = tableHeaderCells.map(
        (cell) => cell.getBoundingClientRect().width
      );

      await Promise.all(
        Array.from(captureNode.querySelectorAll("img")).map((image) => {
          if (image.complete) {
            return image.decode?.().catch(() => undefined);
          }

          return new Promise((resolve) => {
            image.addEventListener("load", resolve, { once: true });
            image.addEventListener("error", resolve, { once: true });
          });
        })
      );

      const canvas = await html2canvas(captureNode, {
        allowTaint: false,
        backgroundColor: "#ffffff",
        useCORS: true,
        scale: Math.min(window.devicePixelRatio * 2, 3),
        width: captureWidth,
        height: captureHeight,
        windowWidth: Math.max(document.documentElement.clientWidth, captureWidth),
        windowHeight: Math.max(window.innerHeight, captureHeight),
        scrollX: 0,
        scrollY: 0,
        ignoreElements: (element) => element.classList?.contains("no-print"),
      });

      const pdf = new jsPDF({
        orientation: laGiayNgang ? "landscape" : "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const marginX = 5;
      const marginTop = 5;
      const footerHeight = 7;
      const contentWidth = pageWidth - marginX * 2;
      const contentHeight = pageHeight - marginTop - footerHeight;
      const maxSliceHeight = Math.floor(
        canvas.width * (contentHeight / contentWidth)
      );
      const renderScale = canvas.width / captureWidth;
      // html2canvas đặt phần tbody lệch một hàng so với tọa độ DOM của table-row-group.
      // Bù đúng chiều cao hàng để trang sau bắt đầu tại tên bộ cửa, không tại ghi chú bộ trước.
      const tableRowOffset = Math.round(28 * renderScale);
      const doorStarts = diemBatDauBoCua.map(
        (value) => Math.round(value * renderScale) + tableRowOffset
      );
      const doorGroups = doorStarts.map((start, index) => ({
        start,
        end: doorStarts[index + 1]
          ?? Math.round(diemKetThucHoaDon * renderScale) + tableRowOffset,
      }));
      const repeatedHeaderHeight = Math.round(28 * renderScale);
      const headerLabels = [
        "Tên sản phẩm", "Khuôn", "Rộng", "Cao", "Màu",
        "Hướng mở", "SL", "Đơn giá", "Thành tiền",
      ];
      const headerWidths = [31, 5, 7, 7, 4, 8, 7, 14, 17];
      const pageSlices = [];
      let sliceStart = 0;

      while (sliceStart < canvas.height) {
        const headerAllowance = pageSlices.length > 0 ? repeatedHeaderHeight : 0;
        const availableSliceHeight = Math.max(1, maxSliceHeight - headerAllowance);
        const hardEnd = Math.min(canvas.height, sliceStart + availableSliceHeight);
        let sliceEnd = hardEnd;

        if (hardEnd < canvas.height) {
          const unfinishedDoor = doorGroups.find(
            (group) => group.start < hardEnd && group.end > hardEnd
          );

          if (unfinishedDoor && unfinishedDoor.start > sliceStart) {
            // Bộ cửa đã bắt đầu nhưng không đủ chỗ đến hết phụ kiện/ghi chú: chuyển nguyên bộ.
            sliceEnd = unfinishedDoor.start;
          } else {
            const completedDoorGroups = doorGroups.filter(
              (group) => group.end <= hardEnd && group.end > sliceStart
            );
            if (completedDoorGroups.length) {
              sliceEnd = completedDoorGroups[completedDoorGroups.length - 1].end;
            }
          }
        }

        if (sliceEnd <= sliceStart) sliceEnd = hardEnd;
        pageSlices.push({ start: sliceStart, end: sliceEnd });
        sliceStart = sliceEnd;
      }

      pageSlices.forEach((slice, index) => {
        if (index > 0) pdf.addPage();

        const sliceHeight = slice.end - slice.start;
        const shouldRepeatHeader = index > 0 && repeatedHeaderHeight > 0;
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = sliceHeight + (shouldRepeatHeader ? repeatedHeaderHeight : 0);
        const context = pageCanvas.getContext("2d");
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        if (shouldRepeatHeader) {
          const headerLeft = Math.round(tableLeft * renderScale);
          const headerWidth = Math.round(tableWidth * renderScale);
          context.fillStyle = "#eef2f6";
          context.fillRect(headerLeft, 0, headerWidth, repeatedHeaderHeight);
          context.strokeStyle = "#cbd5e1";
          context.lineWidth = Math.max(1, renderScale);
          context.font = `700 ${Math.round(9 * renderScale)}px Arial, sans-serif`;
          context.textAlign = "center";
          context.textBaseline = "middle";
          context.fillStyle = "#25334a";
          let headerX = headerLeft;
          headerWidths.forEach((widthPercent, headerIndex) => {
            const measuredWidth = tableHeaderWidths[headerIndex];
            const cellWidth = measuredWidth
              ? measuredWidth * renderScale
              : headerWidth * widthPercent / 100;
            context.strokeRect(headerX, 0, cellWidth, repeatedHeaderHeight);
            context.fillText(
              headerLabels[headerIndex],
              headerX + cellWidth / 2,
              repeatedHeaderHeight / 2,
              Math.max(1, cellWidth - 4 * renderScale)
            );
            headerX += cellWidth;
          });
        }
        context.drawImage(
          canvas,
          0,
          slice.start,
          canvas.width,
          sliceHeight,
          0,
          shouldRepeatHeader ? repeatedHeaderHeight : 0,
          canvas.width,
          sliceHeight
        );

        const renderedHeight = pageCanvas.height * (contentWidth / canvas.width);
        pdf.addImage(
          pageCanvas.toDataURL("image/jpeg", 0.94),
          "JPEG",
          marginX,
          marginTop,
          contentWidth,
          renderedHeight,
          undefined,
          "FAST"
        );
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8);
        pdf.setTextColor(100, 116, 139);
        pdf.text(
          `Trang ${index + 1}/${pageSlices.length}`,
          pageWidth / 2,
          pageHeight - 3,
          { align: "center" }
        );
      });

      const homNay = new Date();
      const ngay = `${homNay.getFullYear()}${String(homNay.getMonth() + 1).padStart(2, "0")}${String(homNay.getDate()).padStart(2, "0")}`;
      const key = `save_count_${ngay}`;
      const soThuTu = Number(localStorage.getItem(key) || "0") + 1;
      localStorage.setItem(key, String(soThuTu));
      pdf.save(`hoa-don-${ngay}-${soThuTu}.pdf`);
    } catch (error) {
      console.error("Không thể tạo PDF hóa đơn:", error);
      alert("Không thể tạo PDF hóa đơn. Vui lòng thử lại.");
    } finally {
      captureNode.classList.remove(
        "invoice-exporting",
        "invoice-exporting--portrait",
        "invoice-exporting--landscape"
      );
      if (originalStyle === null) captureNode.removeAttribute("style");
      else captureNode.setAttribute("style", originalStyle);
      setDangXuatPDF(false);
    }
  };

 if (xemHoaDon) {

  return (

    <>

      <style jsx global>{`
        @page {
          size: A4 ${huongGiay};
          margin: 8mm;
        }

        @media print {
          .no-export,
          .no-print {
            display: none !important;
          }
        }

        @media (max-width: 767px) {
          .tong-tien {
            font-size: 34px !important;
          }
        }

        .invoice-screen {
          box-sizing: border-box;
          width: 100% !important;
          max-width: none !important;
          min-height: auto;
          padding: 16px 12px 28px;
          overflow: visible !important;
          background:
            #f5f7fa;
        }

        .invoice-paper {
          border: 1px solid rgba(255, 255, 255, 0.78) !important;
          border-radius: 12px;
          background: #ffffff !important;
          box-shadow: 0 8px 24px rgba(57, 73, 101, 0.08);
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
          min-height: auto !important;
        }

        .invoice-header {
          border-bottom-color: rgba(148, 163, 184, 0.28) !important;
          padding-bottom: 12px !important;
        }

        .invoice-header h1 {
          color: #172033;
          letter-spacing: -0.025em;
        }

        .invoice-company-name {
          max-width: none;
          margin: 0 !important;
          font-size: clamp(22px, 3vw, 30px) !important;
          line-height: 1.12 !important;
          text-wrap: balance;
        }

        .invoice-brand-row {
          width: 100%;
          align-items: flex-start;
        }

        .invoice-company-block {
          flex: 1 1 auto;
          min-width: 0;
        }

        .invoice-company-name + p,
        .invoice-company-name + p + p {
          margin: 3px 0 0 !important;
          font-size: 12px !important;
          line-height: 1.35 !important;
        }

        .invoice-title {
          margin: 16px 0 10px !important;
          font-size: clamp(22px, 4vw, 34px) !important;
          line-height: 1.1 !important;
        }

        .invoice-header p,
        .invoice-customer,
        .invoice-footer {
          color: #536176;
        }

        .invoice-customer {
          margin-top: 0 !important;
          padding: 9px 12px;
          border: 1px solid rgba(255, 255, 255, 0.78);
          border-radius: 10px;
          background: #f8fafc;
          box-shadow: none;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 3px 18px;
        }

        .invoice-customer p {
          margin: 0 !important;
          font-size: 13px;
          line-height: 1.35;
          min-width: 0;
          overflow-wrap: anywhere;
        }

        .invoice-customer p:last-child {
          grid-column: 1 / -1;
        }

        .invoice-table-wrap {
          margin-top: 14px;
          padding: 4px;
          overflow: visible;
          min-width: 0;
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 10px;
          background: #ffffff;
        }

        .invoice-table-wrap table {
          overflow: hidden;
          border-radius: 6px;
        }

        .invoice-table-wrap table { width: 100%; table-layout: fixed; }
        .invoice-door-table { font-variant-numeric: tabular-nums; }
        .invoice-door-table th,
        .invoice-door-table td { font-variant-numeric: tabular-nums; }
        .invoice-door-meta { display: none; }
        .invoice-mobile-card-row { display: none; }
        .invoice-mobile-door-card {
          font-weight: 400 !important;
        }
        .invoice-mobile-door-card .invoice-mobile-door-title {
          font-weight: 700 !important;
        }
        .invoice-mobile-door-card .invoice-detail-item strong,
        .invoice-mobile-door-card .invoice-mobile-accessories > strong {
          font-weight: 700 !important;
        }
        .invoice-mobile-door-card .invoice-detail-item span,
        .invoice-mobile-door-card .invoice-mobile-accessories li {
          font-weight: 400 !important;
        }
        .invoice-mobile-door-card .invoice-mobile-door-total strong {
          font-weight: 800 !important;
        }
        .invoice-door-table th:nth-child(n+2) {
          white-space: nowrap;
          word-break: normal;
          overflow-wrap: normal;
        }
        .invoice-table-wrap th,
        .invoice-table-wrap td {
          font-size: 11px !important;
          line-height: 1.35 !important;
          padding: 8px 5px !important;
          vertical-align: middle;
          overflow-wrap: anywhere;
        }
        .invoice-table-wrap th { padding: 8px 3px !important; }
        .invoice-table-wrap tbody tr:has(> td:nth-child(2)[colspan]) > td:first-child {
          padding-left: 12px !important;
          text-align: left !important;
          font-weight: 500 !important;
          font-size: 10px !important;
        }
        .invoice-table-wrap tbody tr:has(> td:nth-child(2)[colspan]) {
          background: #fbfcfd;
        }
        .invoice-table-wrap tbody tr:first-child > td:first-child,
        .invoice-table-wrap tbody tr > td:first-child[style*="fontWeight"] {
          font-weight: 700 !important;
        }
        .invoice-table-wrap .invoice-door-row {
          background: #f3f6f9;
        }
        .invoice-table-wrap .invoice-door-row > td:first-child {
          font-weight: 700 !important;
          font-size: 12px !important;
          padding-top: 10px !important;
          padding-bottom: 10px !important;
        }
        .invoice-table-wrap tbody tr:not(:has(> td:nth-child(2)[colspan])):not(:has(> td[colspan="9"])) {
          background: #f7f9fb;
        }
        .invoice-table-wrap tbody tr:has(> td[colspan="9"]) > td {
          padding: 9px 10px !important;
          color: #b42318 !important;
          background: #fff5f3;
          font-size: 11px !important;
          line-height: 1.4 !important;
        }

        .invoice-table-wrap th {
          background: rgba(226, 232, 240, 0.72);
          color: #25334a;
        }

        .invoice-table-wrap td,
        .invoice-table-wrap th {
          border-color: rgba(148, 163, 184, 0.3) !important;
        }

        .invoice-summary {
          margin-top: 16px !important;
        }

        .invoice-total-card {
          padding: 10px 14px !important;
          border: 1px solid #dbe2ea;
          border-radius: 10px;
          background: #f8fafc;
          box-shadow: none;
        }

        .invoice-total-card table {
          margin-top: 0 !important;
          color: #46546a;
          width: min(100%, 460px) !important;
          table-layout: fixed;
        }
        .invoice-total-card td {
          padding: 4px !important;
          font-size: 11px !important;
          line-height: 1.35;
        }
        .invoice-total-card td:last-child {
          text-align: right;
          white-space: nowrap;
          width: 46%;
        }

        .invoice-total-card tr:last-child {
          color: #18243a;
          font-size: 11px !important;
        }

        .invoice-total-card tr:last-child td {
          padding-top: 4px !important;
          padding-bottom: 4px !important;
          border-top: 1px solid #e6a7a0;
          background: #fff5f3;
          color: #b42318;
          font-size: 11px !important;
          font-weight: 600;
        }

        .invoice-footer {
          margin-top: 14px;
          padding: 14px 8px 4px !important;
          border-top: 1px solid rgba(148, 163, 184, 0.24);
        }
        .invoice-footer .grid {
          margin-top: 20px !important;
        }
        .invoice-footer .grid > div > div {
          height: 54px !important;
        }
        .invoice-footer .grid p {
          margin: 3px 0 !important;
          line-height: 1.3;
        }

        .invoice-actions {
          max-width: 210mm;
          margin: 24px auto 0 !important;
          padding: 10px 12px;
          border: 1px solid rgba(255, 255, 255, 0.78);
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.54);
          box-shadow: 0 12px 30px rgba(71, 85, 105, 0.08);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          align-items: center;
          justify-content: space-between;
        }

        .invoice-actions button {
          color: #ffffff !important;
          background: #2563eb !important;
          border: 1px solid rgba(255, 255, 255, 0.68);
          box-shadow: 0 5px 12px rgba(71, 85, 105, 0.1);
          transition: transform 160ms ease, box-shadow 160ms ease;
        }

        .invoice-actions button:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 16px rgba(71, 85, 105, 0.15);
        }
        .invoice-actions button:first-child { background: #64748b !important; }
        .invoice-actions button:nth-child(2),
        .invoice-actions button:nth-child(3),
        .invoice-actions button:nth-child(4) { background: #2563eb !important; }
        .invoice-actions .invoice-back-button {
          min-height: 44px;
          padding: 0 18px !important;
          border-radius: 12px !important;
          background: #475569 !important;
          font-weight: 700;
        }
        .invoice-actions > button:last-child {
          min-height: 44px;
          padding: 0 22px !important;
          border: 0 !important;
          border-radius: 12px !important;
          background: #0f766e !important;
          box-shadow: 0 5px 12px rgba(15, 118, 110, 0.2) !important;
          font-weight: 800;
        }
        @media (max-width: 640px) {
          .invoice-actions {
            display: grid !important;
            grid-template-columns: auto minmax(0, 1fr);
            gap: 8px !important;
            padding: 8px !important;
            margin-top: 14px !important;
          }
          .invoice-actions .invoice-back-button { justify-self: start; }
          .invoice-actions > button:last-child {
            justify-self: stretch;
            padding: 0 10px !important;
            font-size: 14px;
          }
        }

        .invoice-preview {
          border-color: rgba(255, 255, 255, 0.8) !important;
          background: rgba(255, 255, 255, 0.52) !important;
        }

        @media (max-width: 767px) {
          .invoice-screen {
            padding: 8px 4px 18px;
          }

          .invoice-paper {
            border-radius: 10px;
          }

          .invoice-table-wrap {
            margin-left: -2px;
            margin-right: -2px;
            padding: 3px;
            border-radius: 8px;
          }

          .invoice-paper { padding: 10px !important; }
          .invoice-company-name { font-size: 20px !important; max-width: none; }
          .invoice-company-name + p,
          .invoice-company-name + p + p { font-size: 10px !important; }
          .invoice-title { margin: 12px 0 8px !important; font-size: 22px !important; }
          .invoice-customer { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 3px 8px; }
          .invoice-customer p { font-size: 11px; }
          .invoice-table-wrap th,
          .invoice-table-wrap td { font-size: 9px !important; padding: 7px 3px !important; }
          .invoice-door-table { display: table !important; }
          .invoice-door-table thead { display: none !important; }
          .invoice-door-table tbody { display: table-row-group !important; }
          .invoice-door-table tbody > tr:not(.invoice-mobile-card-row) { display: none !important; }
          .invoice-door-table tbody > tr.invoice-mobile-card-row { display: table-row !important; visibility: visible !important; }
          .invoice-mobile-card-row > td {
            display: table-cell !important;
            width: 100% !important;
            padding: 0 !important;
            border: 0 !important;
            background: transparent !important;
            visibility: visible !important;
          }
          .invoice-mobile-door-card {
            display: block !important;
            visibility: visible !important;
            margin: 0 0 10px;
            padding: 13px;
            border: 1px solid #dbe2ea;
            border-radius: 11px;
            background: #ffffff;
            color: #172033;
            text-align: left;
          }
          .invoice-mobile-door-title {
            margin: 0 0 10px;
            font-size: 16px;
            font-weight: 700;
            line-height: 1.3;
            overflow-wrap: anywhere;
          }
          .invoice-mobile-door-details {
            display: grid;
            grid-template-columns: 94px minmax(0, 1fr);
            gap: 5px 8px;
            font-size: 13px;
            line-height: 1.4;
          }
          .invoice-mobile-door-details > div { display: contents; }
          .invoice-mobile-door-details strong { font-weight: 700; }
          .invoice-mobile-door-details span {
            min-width: 0;
            color: #374151;
            white-space: nowrap;
            overflow-wrap: normal;
          }
          .invoice-mobile-accessories {
            margin-top: 10px;
            padding-top: 8px;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            line-height: 1.45;
          }
          .invoice-mobile-accessories > strong { font-size: 13px; }
          .invoice-mobile-accessories ul { margin: 4px 0 0; padding-left: 17px; }
          .invoice-mobile-accessories li { padding: 1px 0; }
          .invoice-mobile-door-note {
            margin: 10px 0 0;
            padding: 7px 8px;
            border-radius: 6px;
            color: #b42318;
            background: #fff5f3;
            font-size: 12px;
            font-style: italic;
            line-height: 1.4;
            overflow-wrap: anywhere;
          }
          .invoice-mobile-door-total {
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            gap: 10px;
            margin-top: 11px;
            padding-top: 9px;
            border-top: 1px solid #dbe2ea;
            font-size: 14px;
            line-height: 1.3;
          }
          .invoice-mobile-door-total strong:last-child {
            color: #172033;
            font-size: 15px;
            white-space: nowrap;
            font-variant-numeric: tabular-nums;
          }
          .invoice-door-meta {
            display: none;
          }
          .invoice-table-wrap tbody tr:has(> td[colspan="9"]) > td { font-size: 10px !important; }
          .invoice-mobile-card-row > td {
            color: #172033 !important;
            background: transparent !important;
            font-size: inherit !important;
          }
          .invoice-total-card { padding: 8px 9px !important; }
          .invoice-total-card table,
          .invoice-total-card tbody,
          .invoice-total-card tr,
          .invoice-total-card td,
          .invoice-total-card tr:last-child td {
            font-size: 11px !important;
            line-height: 1.35 !important;
          }
          .invoice-total-card td,
          .invoice-total-card tr:last-child td {
            padding: 4px !important;
            font-weight: 500 !important;
          }
          .invoice-total-card tr:last-child td:first-child { font-weight: 600 !important; }
          .invoice-footer { padding-top: 10px !important; }
          .invoice-footer .grid { margin-top: 16px !important; }
          .invoice-footer .grid > div > div { height: 34px !important; }
        }

        @media (min-width: 360px) and (max-width: 767px) {
          .invoice-mobile-door-details {
            grid-template-columns: 64px minmax(0, 1fr) 64px minmax(0, 1fr);
            gap: 5px 8px;
          }
          .invoice-mobile-door-details .invoice-detail-money {
            display: grid;
            grid-template-columns: 64px minmax(0, 1fr);
            grid-column: 1 / -1;
            gap: 0 8px;
          }
        }

        @media (min-width: 768px) {
          .invoice-door-table thead { display: none; }
          .invoice-door-table tbody > tr:not(.invoice-mobile-card-row) { display: none !important; }
          .invoice-door-table tbody > tr.invoice-mobile-card-row { display: table-row !important; }
          .invoice-mobile-card-row > td {
            display: table-cell !important;
            width: 100% !important;
            padding: 0 !important;
            border: 0 !important;
            color: #172033 !important;
            background: transparent !important;
          }
          .invoice-mobile-door-card {
            display: block;
            margin: 0 0 12px;
            padding: 16px 18px;
            border: 1px solid #dbe2ea;
            border-radius: 12px;
            background: #ffffff;
            color: #172033;
            text-align: left;
          }
          .invoice-mobile-door-title {
            margin: 0 0 12px;
            font-size: 18px;
            font-weight: 700;
            line-height: 1.3;
          }
          .invoice-mobile-door-details {
            display: grid;
            grid-template-columns: 112px minmax(0, 1fr) 112px minmax(0, 1fr);
            gap: 6px 12px;
            font-size: 14px;
            line-height: 1.45;
          }
          .invoice-mobile-door-details > div { display: contents; }
          .invoice-mobile-door-details strong { font-weight: 700; }
          .invoice-mobile-door-details span {
            min-width: 0;
            color: #374151;
            white-space: nowrap;
          }
          .invoice-mobile-door-details .invoice-detail-money {
            display: grid;
            grid-template-columns: 112px minmax(0, 1fr);
            grid-column: 1 / -1;
            gap: 0 12px;
          }
          .invoice-mobile-accessories {
            margin-top: 12px;
            padding-top: 10px;
            border-top: 1px solid #e5e7eb;
            font-size: 13px;
            line-height: 1.5;
          }
          .invoice-mobile-accessories > strong { font-size: 14px; }
          .invoice-mobile-accessories ul {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 2px 24px;
            margin: 5px 0 0;
            padding-left: 20px;
          }
          .invoice-mobile-accessories li { padding: 2px 0; }
          .invoice-mobile-door-note {
            margin: 12px 0 0;
            padding: 8px 10px;
            border-radius: 7px;
            color: #b42318;
            background: #fff5f3;
            font-size: 13px;
            font-style: italic;
            line-height: 1.45;
          }
          .invoice-mobile-door-total {
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            gap: 16px;
            margin-top: 13px;
            padding-top: 10px;
            border-top: 1px solid #dbe2ea;
            font-size: 15px;
            line-height: 1.35;
          }
          .invoice-mobile-door-total strong:last-child {
            color: #172033;
            font-size: 17px;
            white-space: nowrap;
            font-variant-numeric: tabular-nums;
          }
        }

        /* Dùng thẻ chi tiết cho bản xem trên mọi kích thước; PDF/in vẫn dùng bảng. */
        @media screen {
          .invoice-door-table thead { display: none !important; }
          .invoice-door-table tbody > tr:not(.invoice-mobile-card-row) {
            display: none !important;
          }
          .invoice-door-table tbody > tr.invoice-mobile-card-row {
            display: table-row !important;
            visibility: visible !important;
          }
          .invoice-door-table .invoice-mobile-card-row > td {
            display: table-cell !important;
            visibility: visible !important;
          }
          .invoice-mobile-door-card {
            display: block !important;
            visibility: visible !important;
          }

          .invoice-paper:not(.invoice-exporting) .invoice-table-wrap {
            margin-top: 7px !important;
            padding: 2px !important;
          }
          .invoice-paper:not(.invoice-exporting) .invoice-mobile-door-card {
            margin-bottom: 6px !important;
            padding: 9px 11px !important;
            border-radius: 9px !important;
          }
          .invoice-paper:not(.invoice-exporting) .invoice-mobile-door-title {
            margin-bottom: 5px !important;
            font-size: 14px !important;
            line-height: 1.25 !important;
          }
          .invoice-paper:not(.invoice-exporting) .invoice-mobile-door-details {
            gap: 3px 7px !important;
            font-size: 12px !important;
            line-height: 1.3 !important;
          }
          .invoice-paper:not(.invoice-exporting) .invoice-mobile-accessories {
            margin-top: 6px !important;
            padding-top: 5px !important;
            font-size: 11px !important;
            line-height: 1.3 !important;
          }
          .invoice-paper:not(.invoice-exporting) .invoice-mobile-accessories > strong {
            font-size: 12px !important;
          }
          .invoice-paper:not(.invoice-exporting) .invoice-mobile-accessories ul {
            gap: 1px 12px !important;
            margin-top: 2px !important;
            padding-left: 15px !important;
          }
          .invoice-paper:not(.invoice-exporting) .invoice-mobile-accessories li {
            padding: 0 !important;
          }
          .invoice-paper:not(.invoice-exporting) .invoice-mobile-door-note {
            margin-top: 6px !important;
            padding: 4px 6px !important;
            font-size: 11px !important;
            line-height: 1.3 !important;
          }
          .invoice-paper:not(.invoice-exporting) .invoice-mobile-door-total {
            gap: 8px !important;
            margin-top: 6px !important;
            padding-top: 5px !important;
            font-size: 12px !important;
            line-height: 1.25 !important;
          }
          .invoice-paper:not(.invoice-exporting) .invoice-mobile-door-total strong:last-child {
            font-size: 13px !important;
          }
        }

        .invoice-exporting {
          min-height: 0 !important;
          border: 0 !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          background: #ffffff !important;
        }
        .invoice-exporting .invoice-header { padding-bottom: 12px !important; }
        .invoice-exporting .invoice-brand-row > img {
          width: 68px !important;
          height: 68px !important;
        }
        .invoice-exporting .invoice-company-name {
          font-size: 23px !important;
          line-height: 1.08 !important;
        }
        .invoice-exporting .invoice-company-name + p,
        .invoice-exporting .invoice-company-name + p + p {
          font-size: 11px !important;
          line-height: 1.2 !important;
        }
        .invoice-exporting .invoice-title {
          margin: 10px 0 8px !important;
          font-size: 30px !important;
        }
        .invoice-exporting .invoice-customer {
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) !important;
          padding: 7px 10px !important;
          gap: 2px 16px !important;
        }
        .invoice-exporting .invoice-customer p {
          font-size: 11px !important;
          line-height: 1.25 !important;
        }
        .invoice-exporting .invoice-table-wrap {
          margin-top: 10px !important;
          padding: 0 !important;
          overflow: visible !important;
          border-radius: 0 !important;
        }
        .invoice-exporting .invoice-door-table thead { display: table-header-group !important; }
        .invoice-exporting .invoice-door-table tbody > tr:not(.invoice-mobile-card-row) {
          display: table-row !important;
        }
        .invoice-exporting .invoice-door-table tbody > tr.invoice-mobile-card-row { display: none !important; }
        .invoice-exporting .invoice-table-wrap th,
        .invoice-exporting .invoice-table-wrap td {
          padding: 5px 3px !important;
          font-size: 9px !important;
          line-height: 1.18 !important;
        }
        .invoice-exporting .invoice-table-wrap .invoice-door-row > td:first-child {
          padding-top: 6px !important;
          padding-bottom: 6px !important;
          font-size: 10px !important;
        }
        .invoice-exporting .invoice-summary { margin-top: 10px !important; }
        .invoice-exporting .invoice-total-card { padding: 7px 10px !important; }
        .invoice-exporting .invoice-total-card td {
          padding: 4px !important;
          font-size: 10px !important;
        }
        .invoice-exporting .invoice-footer {
          margin-top: 9px !important;
          padding: 9px 6px 0 !important;
          font-size: 10px !important;
        }
        .invoice-exporting .invoice-footer .grid { margin-top: 12px !important; }
        .invoice-exporting .invoice-footer .grid > div > div { height: 36px !important; }
        .invoice-exporting .invoice-footer .grid p { font-size: 10px !important; }
        .invoice-exporting--landscape .invoice-header {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
          align-items: end;
          gap: 6px 28px;
        }
        .invoice-exporting--landscape .invoice-title {
          align-self: center;
          margin: 0 !important;
          font-size: 28px !important;
          text-align: right;
        }
        .invoice-exporting--landscape .invoice-customer { grid-column: 1 / -1; }

        @media print {
          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .invoice-screen {
            width: 100% !important;
            max-width: none !important;
            padding: 0;
            background: #ffffff;
          }

          .invoice-paper {
            width: 100% !important;
            max-width: none !important;
            min-height: 0 !important;
            padding: 0 !important;
            border: 0 !important;
            border-radius: 0;
            background: #ffffff !important;
            box-shadow: none;
            backdrop-filter: none;
          }

          .invoice-customer,
          .invoice-table-wrap,
          .invoice-total-card,
          .invoice-footer {
            background: #ffffff !important;
            box-shadow: none;
          }

          .invoice-door-meta { display: none !important; }
          .invoice-door-table thead { display: table-header-group !important; }
          .invoice-door-table tbody > tr { display: table-row !important; }
          .invoice-door-table tbody > tr.invoice-mobile-card-row { display: none !important; }
          .invoice-door-table col:nth-child(5),
          .invoice-door-table col:nth-child(6) { display: table-column !important; }
          .invoice-door-table th:nth-child(5),
          .invoice-door-table td:nth-child(5),
          .invoice-door-table th:nth-child(6),
          .invoice-door-table td:nth-child(6) { display: table-cell !important; }

          .invoice-header { padding-bottom: 3mm !important; break-inside: avoid; }
          .invoice-brand-row > img { width: 18mm !important; height: 18mm !important; }
          .invoice-company-name { font-size: 14pt !important; line-height: 1.08 !important; }
          .invoice-company-name + p,
          .invoice-company-name + p + p { font-size: 8pt !important; line-height: 1.2 !important; }
          .invoice-title { margin: 2.5mm 0 2mm !important; font-size: 20pt !important; }
          .invoice-customer { padding: 2mm 2.5mm; gap: 1mm 5mm; border-color: #cbd5e1; }
          .invoice-customer p { font-size: 8.5pt !important; line-height: 1.25 !important; }
          .invoice-table-wrap { margin-top: 3mm; padding: 0; border: 0; border-radius: 0; }
          .invoice-table-wrap th,
          .invoice-table-wrap td {
            padding: 1.25mm 0.8mm !important;
            font-size: 7.2pt !important;
            line-height: 1.18 !important;
          }
          .invoice-door-table tr,
          .invoice-summary,
          .invoice-total-card,
          .invoice-footer .grid { break-inside: avoid; page-break-inside: avoid; }
          .invoice-summary { margin-top: 3mm !important; }
          .invoice-total-card { padding: 2mm 3mm !important; }
          .invoice-total-card td { padding: 1.2mm 1mm !important; font-size: 8pt !important; }
          .invoice-footer {
            margin-top: 3mm;
            padding: 2.5mm 2mm 0 !important;
            font-size: 8pt;
          }
          .invoice-footer .grid { margin-top: 4mm !important; }
          .invoice-footer .grid > div > div { height: 12mm !important; }
          .invoice-footer .grid p { font-size: 8pt !important; }
          .invoice-paper--landscape .invoice-header {
            display: grid;
            grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.75fr);
            align-items: end;
            gap: 2mm 8mm;
          }
          .invoice-paper--landscape .invoice-title {
            align-self: center;
            margin: 0 !important;
            font-size: 18pt !important;
            text-align: right;
          }
          .invoice-paper--landscape .invoice-customer { grid-column: 1 / -1; }
        }
      `}</style>

      <div
        className="invoice-screen"
        style={{
          fontFamily:
            '"Be Vietnam Pro", Arial, sans-serif',
          backgroundColor:
            "#ffffff",
          width: "100%",
          maxWidth: "210mm",
          margin: "0 auto",
          overflowX: "visible",
          boxSizing: "border-box",
        }}
      >

        <div
  className={`border invoice-paper invoice-paper--${huongGiay}`}
  ref={hoaDonRef}
  style={{
    width: "100%",
    maxWidth: huongGiay === "landscape" ? "297mm" : "210mm",
    minHeight: "auto",
    margin: "0 auto",
    backgroundColor: "#ffffff",
   padding: window.innerWidth < 768
  ? "12px"
  : "10mm",
    boxSizing: "border-box",
  }}
>

        <div  className="border-b invoice-header"
style={{
  paddingBottom: "10mm"
}} >

            <div className="flex gap-4 invoice-brand-row">

             <img
  src="/logo-transparent.png?v=1"
  crossOrigin="anonymous"
  alt="logo"
 style={{
  width: "80px",
  height: "80px",
  objectFit: "contain"
}}
/>

              <div className="invoice-company-block">

                <h1 className="text-2xl font-bold uppercase invoice-company-name">

                  Công Ty TNHH
                  Công Nghệ
                  An Phát Bắc Ninh

                </h1>

                <p className="mt-2">
                  QL18, Khu phố Lựa,
                  Phường Quế Võ,
                  Tỉnh Bắc Ninh
                </p>

                <p>
                  Hotline:
                  {" "}
                  {
                    danhSachNhanVien[
                      nhanVien
                    ]
                  }
                </p>

              </div>

            </div>

            <h1
  className="text-center font-bold mt-10 invoice-title"
  style={{
    fontSize: isMobile
  ? "22px"
  : "64px",
    lineHeight: "1.1",
  }}
>

              HÓA ĐƠN BÁN HÀNG

            </h1>

            <div className="grid grid-cols-2 mt-10 gap-4 invoice-customer">

              <p>
                <strong>
                  Khách hàng:
                </strong>
                {" "}
                {tenKhach}
              </p>

              <p>
                <strong>
                  Nhân viên:
                </strong>
                {" "}
                {nhanVien}
              </p>

              <p className="col-span-2">
                <strong>
                  Địa chỉ:
                </strong>
                {" "}
                {diaChiKhach}
              </p>

            </div>

          </div>

        <div
  className="invoice-table-wrap"
  style={{
    overflowX: "auto",
  }}
>

<table className="w-full border-collapse table-fixed invoice-door-table">
        <colgroup>
  <col style={{ width: "31%" }} />
  <col style={{ width: "5%" }} />
  <col style={{ width: "7%" }} />
  <col style={{ width: "7%" }} />
  <col style={{ width: "4%" }} />
  <col style={{ width: "8%" }} />
  <col style={{ width: "7%" }} />
  <col style={{ width: "14%" }} />
  <col style={{ width: "17%" }} />
</colgroup>

            <thead>

              <tr>

                <th
  className="border"
  style={{
    padding: "6px 3px",
    fontSize: isMobile
 ? "5px"
  : "7px",
  overflowWrap: "break-word",
    fontWeight: "700",
    textAlign: "center",
    lineHeight: "1.4",
  }}
>
                  Tên sản phẩm
                </th>

                <th
  className="border"
  style={{
    padding: isMobile
      ? "3px 1px"
      : "12px 6px",

    fontSize: isMobile
      ? "5px"
      : "7px",

    fontWeight: "700",

    textAlign: "center",

    wordBreak: "break-word",

    lineHeight: "1.2",
  }}
>
  Khuôn
</th>

               <th
  className="border"
  style={{
    padding: isMobile
      ? "3px 2px"
      : "12px 6px",

    fontSize: isMobile
  ? "5px"
  : "7px",
  overflowWrap: "break-word",

    fontWeight: "700",

    textAlign: "center",

    verticalAlign: "middle",

    wordBreak: "break-word",

    whiteSpace: "nowrap",

    lineHeight: "1.3",
  }}
>
                  Rộng
                </th>

                <th
  className="border"
  style={{
    padding: isMobile
      ? "3px 2px"
      : "12px 6px",

    fontSize: isMobile
  ? "5px"
  : "7px",
  overflowWrap: "break-word",

    fontWeight: "700",

    textAlign: "center",

    verticalAlign: "middle",

    wordBreak: "break-word",

    whiteSpace: "nowrap",

    lineHeight: "1.3",
  }}
>
                  Cao
                </th>

                <th
  className="border"
  style={{
    padding: isMobile
      ? "3px 2px"
      : "12px 6px",

   fontSize: isMobile
  ? "5px"
  : "7px",
  overflowWrap: "break-word",

    fontWeight: "700",

    textAlign: "center",

    verticalAlign: "middle",

    wordBreak: "break-word",

    whiteSpace: "nowrap",

    lineHeight: "1.3",
  }}
>
                  Màu
                </th>

              <th
  className="border"
  style={{
    padding: isMobile
      ? "3px 2px"
      : "12px 6px",

    fontSize: isMobile
      ? "5px"
      : "7px",
overflowWrap: "break-word",
    fontWeight: "700",

    textAlign: "center",

    verticalAlign: "middle",

    wordBreak: "break-word",

    whiteSpace: "nowrap",

    lineHeight: "1.3",
  }}
>
                  Hướng mở
                </th>

                <th
  className="border"
  style={{
    padding: "6px 3px",
    fontSize: isMobile
 ? "5px"
  : "7px",
  whiteSpace: "nowrap",
  overflowWrap: "break-word",
    fontWeight: "700",
    textAlign: "center",
    lineHeight: "1.4",
  }}
>
                  SL
                </th>

                <th
  className="border"
  style={{
    padding: "6px 3px",
    fontSize: isMobile
 ? "5px"
  : "7px",


  overflowWrap: "break-word",
    fontWeight: "600",
    textAlign: "center",
    lineHeight: "1.4",
  }}
>
                  Đơn giá
                </th>

                <th
  className="border"
  style={{
    padding: "6px 3px",
    fontSize: isMobile
 ? "5px"
  : "7px",
  overflowWrap: "break-word",
    fontWeight: "700",
    textAlign: "center",
    lineHeight: "1.4",
  }}
>
                  Thành tiền
                </th>

              </tr>

            </thead>

            <tbody>

          {danhSachCua.map((cua, index) => {

  const slPhaoPhu =
    tinhPhaoPhu(cua);
const rongPhaoDungM =
  Number(
    cua.rongPhaoDung || 0
  ) / 100;

const caoPhaoNgangM =
  Number(
    cua.caoPhaoNgang || 0
  ) / 100;

const caoPhaoDinhM =
  Number(
    cua.caoPhaoDinh || 0
  ) / 100;


const coPhaoNgang =
  Number(
    cua.caoPhaoNgang || 0
  ) > 0;

const slPhaoDinh =

  cua.kieuPhaoDinh ===
  "tieuchuan"

    ? (

        kichThuocMet(cua.cao) *
          2 +

        (
          kichThuocMet(cua.rong) +
          0.5
        ) +

        (
          kichThuocMet(cua.rong) +
          0.8
        )

      )

    : (

        coPhaoNgang

          ? (

              kichThuocMet(cua.cao) *
                2 +

              (
                kichThuocMet(cua.rong) +
                rongPhaoDungM * 2
              ) +

              (
                kichThuocMet(cua.rong) +
                rongPhaoDungM * 2 +
                0.3
              )

            )

          : (

              kichThuocMet(cua.cao) *
                2 +

              (
                kichThuocMet(cua.rong) +
                rongPhaoDungM * 2 +
                0.3
              )

            )

      );

const tienPhaoDinh =

  cua.kieuPhaoDinh ===
  "tieuchuan"

    ? (

        slPhaoDinh *

        Number(
          cua.donGiaPhao || 0
        )

      )

    : (

        coPhaoNgang

          ? (

              (
                kichThuocMet(cua.cao) *
                2 *
                Number(
                  cua.donGiaPhaoDung || 0
                )
              ) +

              (
                (
                  kichThuocMet(cua.rong) +
                  rongPhaoDungM * 2
                ) *

                Number(
                  cua.donGiaPhaoNgang || 0
                )
              ) +

              (
                (
                  kichThuocMet(cua.rong) +
                  rongPhaoDungM * 2 +
                  0.3
                ) *

                Number(
                  cua.donGiaPhaoDinh || 0
                )
              )

            )

          : (

              (
                kichThuocMet(cua.cao) *
                2 *
                Number(
                  cua.donGiaPhaoDung || 0
                )
              ) +

              (
                (
                  kichThuocMet(cua.rong) +
                  rongPhaoDungM * 2 +
                  0.3
                ) *

                Number(
                  cua.donGiaPhaoDinh || 0
                )
              )

            )

      );

const chiTietPhaoDinh = thongTinPhaoDinh(cua);

  const laCuaSo = cua.loaiCua.toLowerCase().includes("sổ");


  return (

    <>

      <tr className="invoice-mobile-card-row">
        <td colSpan={9}>
          <article className="invoice-mobile-door-card">
            <h3 className="invoice-mobile-door-title">
              Bộ cửa {index + 1}: {cua.loaiCua || "Chưa chọn loại cửa"}
            </h3>

            <div className="invoice-mobile-door-details">
              <div className="invoice-detail-item"><strong>Khuôn</strong><span>{formatKichThuoc(cua.khuon)} mm</span></div>
              <div className="invoice-detail-item"><strong>Màu</strong><span>{cua.maMau || "-"}</span></div>
              <div className="invoice-detail-item"><strong>Rộng</strong><span>{formatKichThuoc(cua.rong)} mm</span></div>
              <div className="invoice-detail-item"><strong>Cao</strong><span>{formatKichThuoc(cua.cao)} mm</span></div>
              {!laCuaSo && <div className="invoice-detail-item"><strong>Hướng mở</strong><span>{cua.huongMo || "-"}</span></div>}
              <div className="invoice-detail-item"><strong>Diện tích</strong><span>{formatSoLuong(kichThuocMet(cua.rong) * kichThuocMet(cua.cao))} m²</span></div>
              <div className="invoice-detail-item invoice-detail-money"><strong>Đơn giá</strong><span>{Number(cua.donGia || 0).toLocaleString()} đ/m²</span></div>
              <div className="invoice-detail-item invoice-detail-money"><strong>Tiền cửa</strong><span>{Math.round(tinhTienCua(cua)).toLocaleString()} đ</span></div>
            </div>

            {(cua.coKhoa || cua.coKhoaNgoai || cua.loaiPhao === "Phào phụ" || laPhaoDinh(cua) || cua.coBomForm ||
              (cua.loaiOThoang === "kinh" && Number(cua.kinhOThoang) > 0) ||
              (cua.loaiOThoang === "dac" && Number(cua.oThoangDac) > 0) ||
              (cua.loaiOThoang === "nanchop" && Number(cua.oThoangNanChop) > 0) ||
              (cua.loaiOThoang === "vom" && Number(cua.caoVom) > 0) ||
              (cua.coKinhCanh && Number(cua.kinhCanh) > 0)) && (
              <div className="invoice-mobile-accessories">
                <strong>Phụ kiện</strong>
                <ul>
                  {cua.coKhoa && (
                    <li>{cua.tenKhoa || "Khóa"}: {(Number(cua.soLuongKhoa || 0) * Number(cua.donGiaKhoa || 0)).toLocaleString()} đ</li>
                  )}
                  {cua.coKhoaNgoai && (
                    <li>Phí gia công ổ khóa: {Number(cua.donGiaKhoaNgoai ?? 300000).toLocaleString()} đ</li>
                  )}
                  {cua.loaiPhao === "Phào phụ" && (
                    <li>Phào phụ: {Math.round(slPhaoPhu * Number(cua.donGiaPhao || 0)).toLocaleString()} đ</li>
                  )}
                  {laPhaoDinh(cua) && (
                    <li>
                      <strong>Phào đình</strong>
                      <span style={{ display: "block" }}>Bản rộng phào đứng: {chiTietPhaoDinh.phaoDung}</span>
                      <span style={{ display: "block" }}>Phào ngang: {chiTietPhaoDinh.phaoNgang}</span>
                      <span style={{ display: "block" }}>Phào đỉnh: {chiTietPhaoDinh.phaoDinh}</span>
                      <span style={{ display: "block" }}>Giá phào đình: {Math.round(tienPhaoDinh).toLocaleString()} đ</span>
                    </li>
                  )}
                  {cua.coBomForm && (
                    <li>Foam: {tinhTienBomForm(cua).toLocaleString()} đ</li>
                  )}
                  {cua.loaiOThoang === "kinh" && Number(cua.kinhOThoang) > 0 && (
                    <li>Ô thoáng kính: {(Number(cua.kinhOThoang) * 60000).toLocaleString()} đ</li>
                  )}
                  {cua.loaiOThoang === "dac" && Number(cua.oThoangDac) > 0 && (
                    <li>Ô thoáng đặc: {(Number(cua.oThoangDac) * 350000).toLocaleString()} đ</li>
                  )}
                  {cua.loaiOThoang === "nanchop" && Number(cua.oThoangNanChop) > 0 && (
                    <li>Ô thoáng nan chớp: {(Number(cua.oThoangNanChop) * 250000).toLocaleString()} đ</li>
                  )}
                  {cua.loaiOThoang === "vom" && Number(cua.caoVom) > 0 && (
                    <li>Ô thoáng vòm: {Math.round(((Math.PI * kichThuocMet(cua.rong) * Number(cua.caoVom || 0)) / 4) * (Number(cua.donGia || 0) + 350000)).toLocaleString()} đ</li>
                  )}
                  {cua.coKinhCanh && Number(cua.kinhCanh) > 0 && (
                    <li>Kính cánh: {(Number(cua.kinhCanh) * (cua.loaiKinhCanh === "to" ? 350000 : 250000)).toLocaleString()} đ</li>
                  )}
                </ul>
              </div>
            )}

            {cua.note && <p className="invoice-mobile-door-note">Ghi chú: {cua.note}</p>}

            <div className="invoice-mobile-door-total">
              <strong>THÀNH TIỀN BỘ CỬA</strong>
              <strong>{Math.round(tinhTongBoCua(cua)).toLocaleString()} đ</strong>
            </div>
          </article>
        </td>
      </tr>

      <tr className="invoice-door-row">

       <td
  className="border"
  style={{ overflowWrap: "break-word",
    overflowWrap: "break-word",
    padding: "6px",
    fontWeight: "700",
    fontSize: "10px",
    lineHeight: "1.5",
    wordBreak: "break-word",
  }}
>

          Bộ cửa {index + 1}
          :
          {" "}
          {cua.loaiCua}

          <span className="invoice-door-meta">
            Màu: {cua.maMau || "-"} · Hướng mở: {cua.huongMo || "-"}
          </span>

        </td>

        <td
  className="border text-center"
  style={{
    padding: isMobile
      ? "2px 1px"
      : "7px",

    fontSize: isMobile
      ? "5px"
      : "7px",

    lineHeight: "1",

    whiteSpace: "nowrap",

    overflow: "hidden",
  }}
>
  {cua.khuon || "-"}
</td>

        <td
  className="border"
  style={{ overflowWrap: "break-word",
    overflowWrap: "break-word",
    padding: "6px",
    fontSize: isMobile
 ? "5px"
  : "7px",
    verticalAlign: "middle",
  }}
>
          {cua.rong}
        </td>

        <td
  className="border"
  style={{ overflowWrap: "break-word",
    overflowWrap: "break-word",
    padding: "6px",
    fontSize: isMobile
 ? "5px"
  : "7px",
    verticalAlign: "middle",
  }}
>
          {cua.cao}
        </td>

        <td
  className="border"
  style={{ overflowWrap: "break-word",
    overflowWrap: "break-word",
    padding: "6px",
    fontSize: isMobile
 ? "5px"
  : "7px",
    verticalAlign: "middle",
  }}
>
          {cua.maMau}
        </td>

        <td
  className="border"
  style={{ overflowWrap: "break-word",
    overflowWrap: "break-word",
    padding: "6px",
    fontSize: isMobile
 ? "5px"
  : "7px",
    verticalAlign: "middle",
  }}
>
          {cua.huongMo}
        </td>

        <td
  className="border"
  style={{
    overflowWrap: "break-word",
    padding: "6px",

    fontSize: isMobile
      ? "5px"
      : "7px",

    textAlign: "right",

    whiteSpace: "nowrap",
    minWidth: isMobile ? "34px" : "48px",
    overflow: "visible",
    textOverflow: "clip",

    verticalAlign: "middle",
  }}
>

          {formatSoLuong(
            kichThuocMet(cua.rong) *
            kichThuocMet(cua.cao)
          )} m²

        </td>

       <td
  className="border"
  style={{ overflowWrap: "break-word",
    padding: "6px",
    fontSize: isMobile ? "5px" : "7px",
    textAlign: "right",
    whiteSpace: "nowrap",
    verticalAlign: "middle",
  }}
>

  {Number(
    cua.donGia || 0
  ).toLocaleString()}

</td>

       <td
  className="border"
  style={{
    overflowWrap: "break-word",
    padding: "6px",

    fontWeight: "700",

    fontSize: isMobile
      ? "5px"
      : "7px",

    textAlign: "right",

    whiteSpace: "nowrap",

    overflow: "hidden",

    textOverflow: "ellipsis",
  }}
>

          {
  Math.round(
    (
      kichThuocMet(cua.rong) *
      kichThuocMet(cua.cao)
    ) *
    Number(cua.donGia || 0)
  ).toLocaleString()
}

        </td>

      </tr>
      {cua.coKhoa && (

        <tr>

          <td
  className="border"
  style={{ overflowWrap: "break-word",
    padding: "6px",
    textAlign: "right",
    fontSize: isMobile
 ? "5px"
  : "7px",
    verticalAlign: "middle",
  }}
>

            {cua.tenKhoa || "Khóa"}

          </td>

          <td
            className="border p-2"
            colSpan={5}
          ></td>

          <td
  className="border"
  style={{ overflowWrap: "break-word",
    textAlign: "right",
    padding: "6px",
    fontSize: isMobile
 ? "5px"
  : "7px",
    verticalAlign: "middle",
  }}
>
            {cua.soLuongKhoa}
          </td>

          <td
  className="border"
  style={{ overflowWrap: "break-word",
    padding: "6px",
    textAlign: "right",
    fontSize: isMobile
 ? "5px"
  : "7px",
    verticalAlign: "middle",
  }}
>

            {Number(
              cua.donGiaKhoa || 0
            ).toLocaleString()}

          </td>

          <td
  className="border"
  style={{ overflowWrap: "break-word",
    padding: "6px",
    fontWeight: "700",
    fontSize: isMobile ? "5px" : "7px",
    textAlign: "right",
    whiteSpace: "nowrap",
  }}
>

            {(
              Number(
                cua.soLuongKhoa || 0
              ) *
              Number(
                cua.donGiaKhoa || 0
              )
            ).toLocaleString()}

          </td>

        </tr>

      )}
      {cua.coKhoaNgoai && (
        <tr>
          <td
            className="border"
            colSpan={8}
            style={{ padding: "6px", textAlign: "right", fontSize: isMobile ? "5px" : "7px" }}
          >
            Phí gia công ổ khóa
          </td>
          <td
            className="border"
            style={{ padding: "6px", textAlign: "right", fontSize: isMobile ? "5px" : "7px", fontWeight: "700", whiteSpace: "nowrap" }}
          >
            {Number(cua.donGiaKhoaNgoai ?? 300000).toLocaleString()}
          </td>
        </tr>
      )}

      {cua.loaiPhao ===
        "Phào phụ" && (

        <tr>

          <td
  className="border"
  style={{ overflowWrap: "break-word",
    padding: "6px",
    textAlign: "right",
    fontSize: isMobile
 ? "5px"
  : "7px",
    verticalAlign: "middle",
  }}
>
            Phào phụ
          </td>

          <td
            className="border p-2"
            colSpan={5}
          ></td>

          <td
  className="border"
  style={{ overflowWrap: "break-word",
    textAlign: "right",
    padding: "6px",
    fontSize: isMobile
 ? "5px"
  : "7px",
    verticalAlign: "middle",
  }}
>

            {formatSoLuong(slPhaoPhu)}
            {" "}
            md

          </td>

          <td
  className="border"
  style={{ overflowWrap: "break-word",
    textAlign: "right",
    padding: "6px",
    fontSize: isMobile
 ? "5px"
  : "7px",
    verticalAlign: "middle",
  }}
>

            {
  Math.round(
    slPhaoPhu *
    Number(
      cua.donGiaPhao || 0
    )
  ).toLocaleString()
}

          </td>

          <td
  className="border"
  style={{ overflowWrap: "break-word",
    padding: "6px",
    fontWeight: "700",
    fontSize: isMobile ? "5px" : "7px",
    textAlign: "right",
    whiteSpace: "nowrap",
  }}
>

            {(
              slPhaoPhu *
              Number(
                cua.donGiaPhao || 0
              )
            ).toLocaleString()}

          </td>

        </tr>

      )}

      {laPhaoDinh(cua) && (

        <tr>

          <td
  className="border"
  style={{ overflowWrap: "break-word",
    textAlign: "right",
    padding: "6px",
    fontSize: isMobile
 ? "5px"
  : "7px",
    verticalAlign: "middle",
  }}
>
            Phào đình
          </td>

          <td
            className="border p-2"
            colSpan={7}
            style={{
              padding: "6px",
              fontSize: isMobile ? "5px" : "7px",
              lineHeight: "1.5",
              overflowWrap: "break-word",
            }}
          >
            <span style={{ display: "block" }}>Bản rộng phào đứng: {chiTietPhaoDinh.phaoDung}</span>
            <span style={{ display: "block" }}>Phào ngang: {chiTietPhaoDinh.phaoNgang}</span>
            <span style={{ display: "block" }}>Phào đỉnh: {chiTietPhaoDinh.phaoDinh}</span>
          </td>

<td
  className="border"
  style={{ overflowWrap: "break-word",
    padding: "6px",
    fontWeight: "700",
    fontSize: isMobile ? "5px" : "7px",
    textAlign: "right",
    whiteSpace: "nowrap",
  }}
>
  <span style={{ display: "block", fontWeight: "500" }}>Giá phào đình</span>
  {Math.round(tienPhaoDinh).toLocaleString()}

</td>

        </tr>

      )}

      {cua.coBomForm && (

        <tr>

          <td
  className="border"
  style={{ overflowWrap: "break-word",
    textAlign: "right",
    padding: "6px",
    fontSize: isMobile
 ? "5px"
  : "7px",
    verticalAlign: "middle",
  }}
>
            Bơm Form
          </td>

          <td
            className="border p-2"
            colSpan={6}
          ></td>

          <td
  className="border"
  style={{ overflowWrap: "break-word",
    textAlign: "right",
    padding: "6px",
    fontSize: isMobile
 ? "5px"
  : "7px",
    verticalAlign: "middle",
  }}
>
            {tinhTienBomForm(cua).toLocaleString()}
          </td>

          <td
  className="border"
  style={{ overflowWrap: "break-word",
    padding: "6px",
    fontWeight: "700",
    fontSize: isMobile ? "5px" : "7px",
    textAlign: "right",
    whiteSpace: "nowrap",
  }}
>
            {tinhTienBomForm(cua).toLocaleString()}
          </td>

        </tr>

      )}
     {cua.loaiOThoang === "kinh" &&
 Number(cua.kinhOThoang) > 0 && (

<tr>

  <td
    className="border"
    style={{
      padding: "6px",
      fontSize: isMobile
        ? "5px"
        : "7px",
    }}
  >
    Ô thoáng kính
  </td>

  <td
    className="border"
    colSpan={5}
  ></td>

  <td
    className="border"
    style={{
      padding: "6px",
      textAlign: "right",
      fontSize: isMobile
        ? "5px"
        : "7px",
    }}
  >
    {cua.kinhOThoang}
  </td>

  <td
    className="border"
    style={{
      padding: "6px",
      textAlign: "right",
      fontSize: isMobile
        ? "5px"
        : "7px",
    }}
  >
    60.000
  </td>

  <td
    className="border"
    style={{
      padding: "6px",
      textAlign: "right",
      fontWeight: "700",
      fontSize: isMobile
        ? "5px"
        : "7px",
    }}
  >
    {(
      Number(cua.kinhOThoang)
      * 60000
    ).toLocaleString()}
  </td>

</tr>

)}

{cua.loaiOThoang === "dac" &&
 Number(cua.oThoangDac) > 0 && (

<tr>

  <td
    className="border"
    style={{
      padding: "6px",
      fontSize: isMobile
        ? "5px"
        : "7px",
    }}
  >
    Ô thoáng đặc
  </td>

  <td
    className="border"
    colSpan={5}
  ></td>

  <td
    className="border"
    style={{
      padding: "6px",
      textAlign: "right",
      fontSize: isMobile
        ? "5px"
        : "7px",
    }}
  >
    {cua.oThoangDac}
  </td>

  <td
    className="border"
    style={{
      padding: "6px",
      textAlign: "right",
      fontSize: isMobile
        ? "5px"
        : "7px",
    }}
  >
    350.000
  </td>

  <td
    className="border"
    style={{
      padding: "6px",
      textAlign: "right",
      fontWeight: "700",
      fontSize: isMobile
        ? "5px"
        : "7px",
    }}
  >
    {(
      Number(cua.oThoangDac)
      * 350000
    ).toLocaleString()}
  </td>

</tr>

)}

{cua.loaiOThoang === "nanchop" &&
 Number(cua.oThoangNanChop) > 0 && (

<tr>

  <td
    className="border"
    style={{
      padding: "6px",
      fontSize: isMobile
        ? "5px"
        : "7px",
    }}
  >
    Ô thoáng nan chớp
  </td>

  <td
    className="border"
    colSpan={5}
  ></td>

  <td
    className="border"
    style={{
      padding: "6px",
      textAlign: "right",
      fontSize: isMobile
        ? "5px"
        : "7px",
    }}
  >
    {cua.oThoangNanChop}
  </td>

  <td
    className="border"
    style={{
      padding: "6px",
      textAlign: "right",
      fontSize: isMobile
        ? "5px"
        : "7px",
    }}
  >
    250.000
  </td>

  <td
    className="border"
    style={{
      padding: "6px",
      textAlign: "right",
      fontWeight: "700",
      fontSize: isMobile
        ? "5px"
        : "7px",
    }}
  >
    {(
      Number(cua.oThoangNanChop)
      * 250000
    ).toLocaleString()}
  </td>

</tr>

)}

{cua.loaiOThoang === "vom" &&
 Number(cua.caoVom) > 0 && (

<tr>

  <td
    className="border"
    style={{
      padding: "6px",
      textAlign: "right",
      fontSize: isMobile
        ? "5px"
        : "7px",
    }}
  >
    Ô thoáng vòm
  </td>

  <td
    className="border"
    colSpan={5}
  ></td>

  <td
    className="border"
    style={{
      padding: "6px",
      textAlign: "right",
      fontSize: isMobile
        ? "5px"
        : "7px",
    }}
  >
    {(
      kichThuocMet(cua.rong)
*
Number(cua.caoVom || 0)
    ).toFixed(2)} m²
  </td>

  <td
    className="border"
    style={{
      padding: "6px",
      textAlign: "right",
      fontSize: isMobile
        ? "5px"
        : "7px",
    }}
  >
    {(
      Number(cua.donGia || 0)
      + 350000
    ).toLocaleString()}
  </td>

  <td
    className="border"
    style={{
      padding: "6px",
      textAlign: "right",
      fontWeight: "700",
      fontSize: isMobile
        ? "5px"
        : "7px",
    }}
  >
    {Math.round(

      (
        (
          Math.PI *
          kichThuocMet(cua.rong) *
          Number(cua.caoVom || 0)
        ) / 4
      )

      *

      (
        Number(cua.donGia || 0)
        + 350000
      )

    ).toLocaleString()}
  </td>

</tr>

)}

{cua.coKinhCanh &&
 Number(cua.kinhCanh) > 0 && (

<tr>

  <td
    className="border"
    style={{
      padding: "6px",
      textAlign: "right",
      fontSize: isMobile
        ? "5px"
        : "7px",
    }}
  >
    Kính cánh (
  {
    cua.loaiKinhCanh === "to"
      ? "Ô to"
      : "Ô nhỏ"
  }
)
  </td>

  <td
    className="border"
    colSpan={6}
  ></td>

  <td
    className="border"
    style={{
      padding: "6px",
      fontSize: isMobile
        ? "5px"
        : "7px",
      textAlign: "right",
    }}
  >
    {
  cua.loaiKinhCanh === "to"
    ? "350.000"
    : "250.000"
}
  </td>

  <td
    className="border"
    style={{
      padding: "6px",
      fontSize: isMobile
        ? "5px"
        : "7px",
      fontWeight: "700",
      textAlign: "right",
    }}
  >
    {(
  Number(cua.kinhCanh)
  *
  (
    cua.loaiKinhCanh === "to"
      ? 350000
      : 250000
  )
).toLocaleString()}
  </td>

</tr>

)}

      {cua.note && (
        <tr>
          <td className="border" colSpan={9} style={{ padding: "4px 6px", color: "#dc2626", fontStyle: "italic", fontSize: isMobile ? "6px" : "7px", textAlign: "left", whiteSpace: "normal", overflowWrap: "anywhere" }}>
            Ghi chú: {cua.note}
          </td>
        </tr>
      )}
    </>

  );

})}

            </tbody>

          </table>
</div>
          

          <div
  className="invoice-summary"
  style={{
    marginTop: "20px",
  }}
>

  {/* Tổng cộng */}

  <div
   className="p-3 md:p-4 invoice-total-card"
  style={{
    textAlign: "right",
  }}
>

  <table
    style={{
      marginLeft: "auto",
      width: isMobile
        ? "100%"
        : "420px",

      borderCollapse:
        "collapse",

      marginTop: "20px",
    }}
  >

    <tbody>

      <tr>

        <td
          style={{
            padding: "4px 6px",
            fontWeight: "600",
          }}
        >
          Tổng cửa
        </td>

        <td
          style={{
            padding: "4px 6px",
            textAlign: "right",
          }}
        >
          {
            Math.round(
              tongCong
            ).toLocaleString()
          } đ
        </td>

      </tr>


      {loaiDon === "daily" && (

        <tr>

          <td
            style={{
               padding: "4px 6px",
              fontWeight: "600",
            }}
          >
            VAT 5%
          </td>

          <td
            style={{
               padding: "4px 6px",
              textAlign: "right",
            }}
          >
            {
              Math.round(
                tienVAT
              ).toLocaleString()
            } đ
          </td>

        </tr>

      )}

      <tr>

        <td
          style={{
             padding: "4px 6px",
            fontWeight: "600",
          }}
        >
          Cước vận chuyển
        </td>

        <td
          style={{
             padding: "4px 6px",
            textAlign: "right",
          }}
        >
          {
            Math.round(
              tienVanChuyen
            ).toLocaleString()
          } đ
        </td>

      </tr>

      <tr>

        <td
          style={{
            padding: "4px 6px",
            fontWeight: "700",
             fontSize: isMobile
               ? "12px"
               : "14px",
          }}
        >
          Tổng thanh toán
        </td>

        <td
          style={{
            padding: "4px 6px",
            textAlign: "right",

             fontSize: isMobile
               ? "15px"
               : "18px",

            color: "#16a34a",

            fontWeight: "700",
          }}
        >
          {
            Math.round(
              tongSauVanChuyen
            ).toLocaleString()
          } đ
        </td>

      </tr>

      <tr>

        <td
          style={{
             padding: "4px 6px",
            fontWeight: "600",
          }}
        >
          Đã cọc
        </td>

        <td
          style={{
             padding: "4px 6px",
            textAlign: "right",
          }}
        >
          {
            soTienDaCoc.toLocaleString()
          } đ
        </td>

      </tr>

      <tr>

        <td
          style={{
             padding: "4px 6px",
            fontWeight: "700",
            color: "#dc2626",
          }}
        >
          Còn phải thanh toán
        </td>

        <td
          style={{
            padding: "8px",
            textAlign: "right",

            color: "#dc2626",

            fontWeight: "700",

             fontSize: isMobile
               ? "13px"
               : "16px",
          }}
        >
          {
            Math.round(
              conPhaiThanhToan
            ).toLocaleString()
          } đ
        </td>

      </tr>

    </tbody>

  </table>

</div>

  {/* Ngày tháng */}

  <div className="p-6 invoice-footer">

    <div className="text-right italic">

      Ngày{" "}
      {new Date().getDate()}
      {" "}tháng{" "}
      {new Date().getMonth() + 1}
      {" "}năm{" "}
      {new Date().getFullYear()}

    </div>

    {/* Chữ ký */}

    <div
  className="grid grid-cols-2 text-center"
  style={{
    marginTop: isMobile
      ? "30px"
      : "60px",

    pageBreakInside: "avoid",

    breakInside: "avoid",

    breakBefore: "auto",
  }}
>

      <div>

        <p
          className="font-bold uppercase"
          style={{
           fontSize: isMobile
  ? "10px"
  : "16px",
          }}
        >

          Người lên đơn

        </p>

        <div
          style={{
            height: isMobile
  ? "40px"
  : "80px",
          }}
        ></div>

        <p>{nhanVien}</p>

      </div>

      <div>

        <p
          className="font-bold uppercase"
          style={{
            fontSize: isMobile
  ? "10px"
  : "16px",
          }}
        >

          Người nhận hàng

        </p>

        <div
          style={{
            height: isMobile
  ? "40px"
  : "80px",
          }}
        ></div>

        <p>
          ______________
        </p>

      </div>

    </div>

  </div>

</div>

          <div
  className="no-print no-export invoice-actions"
  style={{
    display: "flex",
    gap: "10px",
    marginTop: "20px",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: huongGiay === "landscape" ? "297mm" : "210mm",
  }}
>

              <button
                type="button"
                onClick={() => {
                  sessionStorage.setItem(
                    "draft_invoice",
                    JSON.stringify({
                      danhSachCua,
                      nhanVien,
                      tenKhach,
                      diaChiKhach,
                      tienCoc,
                      cuocVanChuyen,
                      loaiDon,
                    })
                  );
                  setXemHoaDon(false);
                }}
                className="px-5 py-3 rounded-xl invoice-back-button"
                style={{ backgroundColor: "#e5e7eb" }}
              >
                Quay lại
              </button>

              {editingOrderId && (
                <button
                  type="button"
                  onClick={() => setXemHoaDon(false)}
                  className="px-5 py-3 rounded-xl"
                  style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
                >
                  Sửa hóa đơn
                </button>
              )}

              <button
  onClick={() => {

    setDanhSachCua([
      taoBoCuaMoi(),
    ]);

    setTenKhach("");
    setDiaChiKhach("");
    setNhanVien("");
    setTienCoc("");
    setCuocVanChuyen("");
setLoaiDon("");
    setEditingOrderId("");
    setXemHoaDon(false);

  }}
  className="px-5 py-3 rounded-xl "
  style={{
  color: "#ffffff",
  backgroundColor: "#ef4444"
}}
>

  Hóa đơn mới

</button>

            <button
  onClick={luuDonCua}
  className="px-5 py-3 rounded-xl"
  style={{
    color: "#ffffff",
    backgroundColor: "#b7791f",
  }}
>
              Lưu đơn vào kho nhân viên
            </button>

            <button
  onClick={taiPDF}
  disabled={dangXuatPDF}
  className="px-5 py-3 rounded-xl"
  style={{
    color: "#ffffff",
    backgroundColor: dangXuatPDF ? "#a16207" : "#ca8a04",
  }}
>

              {dangXuatPDF ? "Đang tạo PDF..." : "Lưu PDF nhiều trang"}

              </button>

                        </div>

          </div>

        </div>

      

    </>

    );

  }

  return (

<>
  {!loaiDon ? (

    <div
      data-screen="order-type"
      className="
        min-h-screen
        flex
        flex-col
        items-center
        justify-center
        gap-6
        p-6
      "
      style={{
        backgroundColor: "#f3f4f6",
      }}
    >

      <div className="liquid-decoration" aria-hidden="true">
        <span className="ambient-glow ambient-glow--one" />
        <span className="ambient-glow ambient-glow--two" />
        <span className="ambient-glow ambient-glow--three" />
        <span className="orbit-ring orbit-ring--one" />
        <span className="orbit-ring orbit-ring--two" />
        <span className="orbit-ring orbit-ring--three" />
      </div>

      <div className="landing-mark" aria-hidden="true"><img src="/logo-transparent.png?v=1" alt="An Phát" /></div>

      <p className="eyebrow">AN PHÁT BẮC NINH · QUOTATION STUDIO</p>

      <h1
        className="landing-title
          text-3xl
          font-bold
        "
      >
        Chọn loại đơn
      </h1>

      <button
        type="button"
        onClick={() =>
          hienLuaChonCuaThep
            ? setLoaiDon("khachle")
            : setHienLuaChonCuaThep(true)
        }
        className="choice-button choice-button--retail
          w-full
          max-w-md
          py-4
          rounded-2xl
          text-xl
          font-bold
          relative
          z-10
          cursor-pointer
          select-none
        "
        style={{
          backgroundColor: "#2563eb",
          color: "#ffffff",
          touchAction: "manipulation",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        {hienLuaChonCuaThep ? "Lên đơn khách lẻ" : "Lên đơn cửa thép"}
      </button>

      {!hienLuaChonCuaThep && (
        <button
          type="button"
          onClick={() => setLoaiDon("nhapkhau")}
          className="choice-button choice-button--imported w-full max-w-md py-4 rounded-2xl text-xl font-bold relative z-10 cursor-pointer select-none"
        >
          Lên đơn cửa nhập khẩu
        </button>
      )}

      {hienLuaChonCuaThep && (
      <button
        type="button"
        onClick={() =>
          setLoaiDon("daily")
        }
        className="choice-button choice-button--dealer
          w-full
          max-w-md
          py-4
          rounded-2xl
          text-xl
          font-bold
          relative
          z-10
          cursor-pointer
          select-none
        "
        style={{
          backgroundColor: "#16a34a",
          color: "#ffffff",
          touchAction: "manipulation",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        Lên đơn đại lý
      </button>
      )}
      {hienLuaChonCuaThep && (
        <button
          type="button"
          onClick={() => setHienLuaChonCuaThep(false)}
          className="choice-button w-full max-w-md rounded-2xl py-3 text-lg font-semibold relative z-10 cursor-pointer select-none"
          style={{
            backgroundColor: "#e5e7eb",
            color: "#17202b",
            touchAction: "manipulation",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          ← Quay lại chọn đơn sơn
        </button>
      )}
      {!hienLuaChonCuaThep && (<>
      <button type="button" onClick={() => setLoaiDon("son-mykolor")} className="choice-button choice-button--paint choice-button--mykolor w-full max-w-md py-4 rounded-2xl text-xl font-bold relative z-10 cursor-pointer select-none" style={{ backgroundColor: "#f8fafc", color: "#17202b", touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}>
        L&#xEA;n &#x111;&#x1A1;n s&#x1A1;n Mykolor
      </button>
      <button type="button" onClick={() => setLoaiDon("son-forich")} className="choice-button choice-button--paint choice-button--forich w-full max-w-md py-4 rounded-2xl text-xl font-bold relative z-10 cursor-pointer select-none" style={{ backgroundColor: "#f97316", color: "#ffffff", touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}>
        L&#xEA;n &#x111;&#x1A1;n s&#x1A1;n Forich
      </button>
      <button type="button" onClick={() => setLoaiDon("son-sunpro")} className="choice-button choice-button--paint choice-button--sunpro w-full max-w-md py-4 rounded-2xl text-xl font-bold relative z-10 cursor-pointer select-none" style={{ backgroundColor: "#facc15", color: "#17202b", touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}>
        L&#xEA;n &#x111;&#x1A1;n s&#x1A1;n Sunpro
      </button>
      </>)}

    </div>

  ) : loaiDon === "nhapkhau" ? (
    <ImportedDoorOrder onBack={() => setLoaiDon("")} />
  ) : loaiDon.startsWith("son-") ? (
    <PaintOrder initialBrand={loaiDon.replace("son-", "")} onBack={() => setLoaiDon("")} />
  ) : (

    <div className="min-h-screen p-4 app-shell"
style={{ backgroundColor: "#f3f4f6" }}>

      <div className="max-w-xl mx-auto rounded-3xl p-5 space-y-6 form-card"
style={{
  backgroundColor: "#ffffff",
  boxShadow:
    "0 2px 10px rgba(0,0,0,0.1)"
}}>

        <button
          type="button"
          onClick={() => setLoaiDon("")}
          className="mb-3 px-4 py-2 rounded-2xl"
          style={{ backgroundColor: "#e5e7eb" }}
        >
          ← Quay lại
        </button>

        <div className="form-heading">
          <div className="brand-chip"><img src="/logo-transparent.png?v=1" alt="An Phát" /></div>
          <div>
            <p className="eyebrow">BÁO GIÁ · 2026</p>
            <h1 className="text-3xl font-bold">

          Lên Đơn Cửa Thép

            </h1>
          </div>
        </div>

        <p className="form-intro">Tạo báo giá cửa thép chỉn chu trong vài phút.</p>

        <select
          value={nhanVien}
          onChange={(e) =>
            setNhanVien(
              e.target.value
            )
          }
          className="w-full border p-3 rounded-2xl"
        >

          <option value="">
            Chọn nhân viên
          </option>

          {Object.keys(
            danhSachNhanVien
          ).map((nv) => (

            <option key={nv}>
              {nv}
            </option>

          ))}

        </select>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3">
          <button type="button" onClick={() => setHienDonDaLuu(!hienDonDaLuu)} className="w-full text-left font-bold text-amber-900">
            {hienDonDaLuu ? "Ẩn đơn đã lưu" : "Xem đơn đã lưu"} ({donCuaDaLuu.length})
          </button>
          {hienDonDaLuu && (
            <div className="mt-3 space-y-2">
              {!nhanVien && <p className="text-sm text-amber-800">Chọn nhân viên để xem kho đơn riêng.</p>}
              {nhanVien && donCuaDaLuu.length === 0 && <p className="text-sm text-amber-800">Nhân viên này chưa có đơn cửa được lưu.</p>}
              {donCuaDaLuu.map((don) => (
                <div key={don.id} className="flex items-center justify-between gap-2 rounded-xl bg-white p-2 text-sm">
                  <div><b>{don.customer}</b><div className="text-xs font-semibold text-slate-700">{getOrderCode(don)}{don.edited ? " (sửa)" : ""}</div><div className="text-xs text-gray-500">{new Date(don.createdAt).toLocaleString("vi-VN")}</div></div>
                  <div className="flex gap-1"><button type="button" onClick={() => moDonCuaDaLuu(don)} className="rounded-lg bg-blue-600 px-2 py-1 text-white">Xem</button><button type="button" onClick={() => xoaDonDaLuu(don.id)} className="rounded-lg bg-red-100 px-2 py-1 text-red-700">Xóa</button></div>
                </div>
              ))}
            </div>
          )}
        </div>

        <input
          placeholder="Tên khách hàng"
          autoCapitalize="words"
          autoComplete="name"
          value={tenKhach}
          onChange={(e) =>
            setTenKhach(
              e.target.value
            )
          }
          className="w-full border p-3 rounded-2xl"
        />

        <input
          placeholder="Địa chỉ khách hàng"
          autoCapitalize="words"
          autoComplete="street-address"
          value={diaChiKhach}
          onChange={(e) =>
            setDiaChiKhach(
              e.target.value
            )
          }
          className="w-full border p-3 rounded-2xl"
        />
<input
  placeholder="Khách đã cọc"
  inputMode="numeric"
  autoComplete="off"
  value={
    tienCoc
      ? formatTien(tienCoc)
      : ""
  }
  onChange={(e) =>
    setTienCoc(
      e.target.value.replace(
        /\D/g,
        ""
      )
    )
  }
  className="w-full border p-3 rounded-2xl"
/>
<input
  placeholder="Cước vận chuyển"
  inputMode="numeric"
  autoComplete="off"
  value={
    cuocVanChuyen
      ? formatTien(
          cuocVanChuyen
        )
      : ""
  }
  onChange={(e) =>
    setCuocVanChuyen(
      e.target.value.replace(
        /\D/g,
        ""
      )
    )
  }
  className="w-full border p-3 rounded-2xl"
/>

        {danhSachCua.map(
          (cua, index) => {
            const laChanSong = cua.loaiCua === "Chấn song";
            const laCuaSo = cua.loaiCua.toLowerCase().includes("sổ");

            return (

            <div
              key={cua.id}
              className={`border rounded-3xl p-4 space-y-4 door-card ${removingDoorId === cua.id ? "door-card--removing" : ""}`}
              style={{ "--door-index": index }}
            >

              <div className="flex justify-between items-center gap-3">

                <h2 className="text-xl font-bold">

                  Bộ cửa
                  {" "}
                  {index + 1}

                </h2>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => saoChepCua(cua.id)}
                    className="text-blue-600 font-semibold"
                  >
                    Sao chép
                  </button>

                  <button
                    type="button"
                    onClick={() => xoaCua(cua.id)}
                    style={{ color: "#ef4444" }}
                  >
                    Xóa
                  </button>
                </div>

              </div>

              <select
                value={cua.loaiCua}
                onChange={(e) => capNhatLoaiCua(cua.id, e.target.value)}
                className="w-full border p-3 rounded-2xl"
              >

                <option value="">
                  Chọn loại cửa
                </option>

                <option>
                  Cửa đơn
                </option>

                <option>
                  Cửa 2 cánh
                </option>

                <option>
                  Cửa 3 cánh
                </option>

                <option>
                  Cửa 4 cánh
                </option>

                <option>
                  Cửa sổ 1 cánh
                </option>

                <option>
                  Cửa sổ 2 cánh
                </option>

                <option>
                  Cửa sổ 3 cánh
                </option>

                <option>
                  Cửa sổ 4 cánh
                </option>

                <option value="Chấn song">
                  Chấn song
                </option>

              </select>

              <div className="grid grid-cols-2 gap-4">

                {!laChanSong && <input
                  placeholder="Độ dày khuôn"
                  inputMode="numeric"
                  autoComplete="off"
                  value={cua.khuon}
                  onChange={(e) =>
                    capNhatCua(
                      cua.id,
                      "khuon",
                      e.target.value
                    )
                  }
                  className="border p-3 rounded-2xl"
                />}

                {!laChanSong && <input
                  placeholder="Mã màu"
                  autoCapitalize="characters"
                  autoComplete="off"
                  value={cua.maMau}
                  onChange={(e) =>
                    capNhatCua(
                      cua.id,
                      "maMau",
                      e.target.value
                    )
                  }
                  className="border p-3 rounded-2xl"
                />}

                <input
                  placeholder="Chiều rộng"
                  inputMode="numeric"
                  autoComplete="off"
                  value={cua.rong}
                  onChange={(e) =>
                    capNhatCua(
                      cua.id,
                      "rong",
                      e.target.value
                    )
                  }
                  className="border p-3 rounded-2xl"
                />

                <input
                  placeholder="Chiều cao"
                  inputMode="numeric"
                  autoComplete="off"
                  value={cua.cao}
                  onChange={(e) =>
                    capNhatCua(
                      cua.id,
                      "cao",
                      e.target.value
                    )
                  }
                  className="border p-3 rounded-2xl"
                />

                {!laChanSong && !laCuaSo && <input
                  placeholder="Hướng mở"
                  autoCapitalize="words"
                  autoComplete="off"
                  value={cua.huongMo}
                  onChange={(e) =>
                    capNhatCua(
                      cua.id,
                      "huongMo",
                      e.target.value
                    )
                  }
                  className="border p-3 rounded-2xl"
                />}

<input
  placeholder="Đơn giá"
  inputMode="numeric"
  autoComplete="off"
  value={
    cua.donGia
      ? formatTien(
          cua.donGia
        )
      : ""
  }
  onChange={(e) =>
    capNhatCua(
      cua.id,
      "donGia",
      e.target.value.replace(
        /\D/g,
        ""
      )
    )
  }
  className="border p-3 rounded-2xl"
/>

              </div>

              <div>

                <label className="flex items-center gap-2">

                  <input
                    type="checkbox"
                    checked={cua.showNote}
                    onChange={(e) =>
                      capNhatCua(
                        cua.id,
                        "showNote",
                        e.target.checked
                      )
                    }
                  />

                  Ghi chú

                </label>

                {cua.showNote && (
                  <textarea
                    value={cua.note || ""}
                    autoCapitalize="sentences"
                    onChange={(e) =>
                      capNhatCua(
                        cua.id,
                        "note",
                        e.target.value
                      )
                    }
                    placeholder="Nhập ghi chú..."
                    className="w-full border p-3 rounded-2xl mt-2"
                    rows={3}
                  />
                )}

              </div>

              {laChanSong ? (
                <div className="rounded-2xl p-4 space-y-3" style={{ backgroundColor: "#f3f4f6" }}>
                  <p>
                    Số lượng: {formatSoLuong(tinhSoLuongCua(cua))} m²
                  </p>

                  <p>
                    Tổng chấn song: {tinhTienCua(cua).toLocaleString()} đ
                  </p>
                </div>
              ) : (
                <>
              <div className="rounded-2xl p-4"
style={{
  backgroundColor: "#f3f4f6"
}}>

                <p>

                  Số lượng:
                  {" "}
                  {formatSoLuong(tinhSoLuongCua(
                    cua
                  ))} m²

                </p>

                <p>

                  Tổng cửa:
                  {" "}
                  {tinhTienCua(
                    cua
                  ).toLocaleString()} đ

                </p>

              </div>

              {!laCuaSo && <label className="flex items-center gap-2">

                <input
                  type="checkbox"
                  checked={cua.coKhoa}
                  onChange={(e) =>
                    capNhatCua(
                      cua.id,
                      "coKhoa",
                      e.target.checked
                    )
                  }
                />

                Có khóa

              </label>}

              {!laCuaSo && cua.coKhoa && (

                <>

                  <select
                    value={cua.maKhoa || ""}
                    onChange={(e) => {
                      const khoa = DANH_SACH_KHOA.find((item) => item.ma === e.target.value);
                      capNhatCua(cua.id, "maKhoa", khoa?.ma || "");
                      capNhatCua(cua.id, "tenKhoa", khoa?.ten || "");
                      capNhatCua(cua.id, "donGiaKhoa", khoa ? (loaiDon === "daily" ? khoa.giaDaiLy : khoa.giaLe) : "");
                    }}
                    className="w-full border p-3 rounded-2xl"
                  >
                    <option value="">Chọn loại khóa</option>
                    {DANH_SACH_KHOA.map((khoa) => (
                      <option key={khoa.ma} value={khoa.ma}>
                        {khoa.ma} · {khoa.ten} · {formatTien(String(loaiDon === "daily" ? khoa.giaDaiLy : khoa.giaLe))} đ
                      </option>
                    ))}
                  </select>

                  <div className="grid grid-cols-2 gap-4">

                    <input
                      placeholder="Số lượng"
                      value={cua.soLuongKhoa}
                      onChange={(e) =>
                        capNhatCua(
                          cua.id,
                          "soLuongKhoa",
                          e.target.value
                        )
                      }
                      className="border p-3 rounded-2xl"
                    />

                    <input
  placeholder="Đơn giá"
  value={
    cua.donGiaKhoa
      ? formatTien(
          cua.donGiaKhoa
        )
      : ""
  }
  onChange={(e) =>
    capNhatCua(
      cua.id,
      "donGiaKhoa",
      e.target.value.replace(
        /\D/g,
        ""
      )
    )
  }
  className="border p-3 rounded-2xl"
/>

                  </div>

                </>

              )}

              {!laCuaSo && (
                <>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={cua.coKhoaNgoai}
                      onChange={(e) => capNhatCua(cua.id, "coKhoaNgoai", e.target.checked)}
                    />
                    Phí đục lỗ khóa ngoài
                  </label>
                  {cua.coKhoaNgoai && (
                    <input
                      placeholder="Phí gia công ổ khóa"
                      inputMode="numeric"
                      autoComplete="off"
                      value={cua.donGiaKhoaNgoai ? formatTien(String(cua.donGiaKhoaNgoai)) : ""}
                      onChange={(e) => capNhatCua(cua.id, "donGiaKhoaNgoai", e.target.value.replace(/\D/g, ""))}
                      className="w-full border p-3 rounded-2xl"
                    />
                  )}
                </>
              )}

              <div>

                <p className="font-bold mb-3">

                  Loại phào

                </p>

                <div className="space-y-2">

                  <label className="flex items-center gap-2">

  <input
    type="radio"
    name={`phao-${cua.id}`}
    checked={
      cua.loaiPhao ===
      "Phào phụ"
    }
    onChange={() => {
      capNhatCua(cua.id, "loaiPhao", "Phào phụ");
      if (!cua.donGiaPhao) {
        capNhatCua(cua.id, "donGiaPhao", loaiDon === "daily" ? "70000" : "100000");
      }
    }}
  />

  Phào phụ

</label>

<label className="flex items-center gap-2">

  <input
    type="radio"
    name={`phao-${cua.id}`}
    checked={laPhaoDinh(cua)}
    onChange={() =>
      capNhatCua(
        cua.id,
        "loaiPhao",
        "Phào đình"
      )
    }
  />

  Phào đình

</label>

                </div>

              </div>
{cua.loaiPhao ===
  "Phào phụ" && (

  <div className="space-y-3 border rounded-2xl p-4">

    <p>

      Số lượng:
      {" "}
      {formatSoLuong(tinhPhaoPhu(
        cua
      ))}
      {" "}
      md

    </p>

    <input
      placeholder="Đơn giá phào"
      value={
  cua.donGiaPhao
    ? formatTien(
        cua.donGiaPhao
      )
    : ""
}
      onChange={(e) =>
        capNhatCua(
          cua.id,
          "donGiaPhao",
          e.target.value.replace(
            /\D/g,
            ""
          )
        )
      }
      className="w-full border p-3 rounded-2xl"
    />

  </div>

)}

{laPhaoDinh(cua) && (

  <div className="space-y-4 border rounded-2xl p-4">

    <label className="flex items-center gap-2">

      <input
        type="radio"
        name={`kieu-${cua.id}`}
        checked={
          cua.kieuPhaoDinh ===
          "tieuchuan"
        }
        onChange={() =>
          capNhatCua(
            cua.id,
            "kieuPhaoDinh",
            "tieuchuan"
          )
        }
      />

      Phào đình tiêu chuẩn

    </label>

    <label className="flex items-center gap-2">

      <input
        type="radio"
        name={`kieu-${cua.id}`}
        checked={
          cua.kieuPhaoDinh ===
          "tuychon"
        }
        onChange={() =>
          capNhatCua(
            cua.id,
            "kieuPhaoDinh",
            "tuychon"
          )
        }
      />

      Phào đình tùy chọn

    </label>

    {cua.kieuPhaoDinh ===
      "tieuchuan" && (

      <div className="border rounded-2xl p-4 space-y-2">

        <p>
          Phào đứng bản 25cm
        </p>

        <p>
          Phào đỉnh 45cm
        </p>

        <p>

          Kích thước:
          {" "}

          {formatSoLuong((
            kichThuocMet(cua.cao) *
              2 +
            (
              kichThuocMet(cua.rong) +
              0.5
            ) +
            (
              kichThuocMet(cua.rong) +
              0.8
            )
          ))}

          {" "}
          md

        </p>
        <input
  placeholder="Đơn giá phào đình"
  value={
  cua.donGiaPhao
    ? formatTien(
        cua.donGiaPhao
      )
    : ""
}
  onChange={(e) =>
    capNhatCua(
      cua.id,
      "donGiaPhao",
      e.target.value.replace(
        /\D/g,
        ""
      )
    )
  }
  className="w-full border p-3 rounded-2xl"
/>

      </div>

    )}

    {cua.kieuPhaoDinh ===
      "tuychon" && (

      <div className="grid grid-cols-2 gap-4">

        <input
          placeholder="Rộng phào đứng (cm)"
          value={cua.rongPhaoDung || ""}
          onChange={(e) =>
            capNhatCua(
              cua.id,
              "rongPhaoDung",
              e.target.value
            )
          }
          className="border p-3 rounded-2xl"
        />
<input
  placeholder="Đơn giá phào đứng"
  value={
  cua.donGiaPhaoDung
    ? formatTien(
        cua.donGiaPhaoDung
      )
    : ""
}
  onChange={(e) =>
    capNhatCua(
      cua.id,
      "donGiaPhaoDung",
      e.target.value.replace(
        /\D/g,
        ""
      )
    )
  }
  className="border p-3 rounded-2xl"
/>
        <input
          placeholder="Cao phào ngang (cm)"
          value={cua.caoPhaoNgang || ""}
          onChange={(e) =>
            capNhatCua(
              cua.id,
              "caoPhaoNgang",
              e.target.value
            )
          }
          className="border p-3 rounded-2xl"
        />
<input
  placeholder="Đơn giá phào ngang"
  value={
  cua.donGiaPhaoNgang
    ? formatTien(
        cua.donGiaPhaoNgang
      )
    : ""
}
  onChange={(e) =>
    capNhatCua(
      cua.id,
      "donGiaPhaoNgang",
      e.target.value.replace(
        /\D/g,
        ""
      )
    )
  }
  className="border p-3 rounded-2xl"
/>
        <input
          placeholder="Cao phào đỉnh (cm)"
          value={cua.caoPhaoDinh || ""}
          onChange={(e) =>
            capNhatCua(
              cua.id,
              "caoPhaoDinh",
              e.target.value
            )
          }
          className="border p-3 rounded-2xl"
        />
        <input
  placeholder="Đơn giá phào đỉnh"
  value={
  cua.donGiaPhaoDinh
    ? formatTien(
        cua.donGiaPhaoDinh
      )
    : ""
}
  onChange={(e) =>
    capNhatCua(
      cua.id,
      "donGiaPhaoDinh",
      e.target.value.replace(
        /\D/g,
        ""
      )
    )
  }
  className="border p-3 rounded-2xl"
/>

      </div>
      

    )}

  </div>

)}

            
{["khachle", "daily"].includes(loaiDon) && (
              <label className="flex items-center gap-2">

                <input
                  type="checkbox"
                  checked={
                    cua.coBomForm
                  }
                  onChange={(e) =>
                    capNhatCua(
                      cua.id,
                      "coBomForm",
                      e.target.checked
                    )
                  }
                />

                Có bơm Form
                (+{tinhTienBomForm(cua).toLocaleString()}đ)

              </label>
              )}
              {loaiDon === "daily" && (

  <div className="space-y-3 mt-3">

    <div>

  <label className="flex items-center gap-2">

    <input
      type="checkbox"
      checked={cua.coOThoang}
      onChange={(e) =>
        capNhatCua(
          cua.id,
          "coOThoang",
          e.target.checked
        )
      }
    />

    Chọn kiểu ô thoáng

  </label>

  {cua.coOThoang && (

    <div className="space-y-3 mt-3">

      {/* Ô thoáng kính */}

      <label className="flex items-center gap-2">

        <input
          type="radio"
          name={`othoang-${cua.id}`}
          checked={
            cua.loaiOThoang ===
            "kinh"
          }
          onChange={() =>
            capNhatCua(
              cua.id,
              "loaiOThoang",
              "kinh"
            )
          }
        />

        Ô thoáng kính

      </label>

      {/* Ô thoáng đặc */}

      <label className="flex items-center gap-2">

        <input
          type="radio"
          name={`othoang-${cua.id}`}
          checked={
            cua.loaiOThoang ===
            "dac"
          }
          onChange={() =>
            capNhatCua(
              cua.id,
              "loaiOThoang",
              "dac"
            )
          }
        />

        Ô thoáng đặc

      </label>

      {/* Ô thoáng nan chớp */}

      <label className="flex items-center gap-2">

        <input
          type="radio"
          name={`othoang-${cua.id}`}
          checked={
            cua.loaiOThoang ===
            "nanchop"
          }
          onChange={() =>
            capNhatCua(
              cua.id,
              "loaiOThoang",
              "nanchop"
            )
          }
        />

        Ô thoáng nan chớp

      </label>

      {/* Ô thoáng vòm */}

      <label className="flex items-center gap-2">

        <input
          type="radio"
          name={`othoang-${cua.id}`}
          checked={
            cua.loaiOThoang ===
            "vom"
          }
          onChange={() =>
            capNhatCua(
              cua.id,
              "loaiOThoang",
              "vom"
            )
          }
        />

        Ô thoáng vòm

      </label>

      {/* INPUTS */}

      {cua.loaiOThoang ===
        "kinh" && (

        <input
          type="number"
          placeholder="Số lượng ô kính"
          value={cua.kinhOThoang || ""}
          onChange={(e) =>
            capNhatCua(
              cua.id,
              "kinhOThoang",
              e.target.value
            )
          }
          className="
            w-full
            border
            p-3
            rounded-2xl
          "
        />

      )}

      {cua.loaiOThoang ===
        "dac" && (

        <input
          type="number"
          placeholder="Số lượng ô thoáng đặc"
          value={cua.oThoangDac || ""}
          onChange={(e) =>
            capNhatCua(
              cua.id,
              "oThoangDac",
              e.target.value
            )
          }
          className="
            w-full
            border
            p-3
            rounded-2xl
          "
        />

      )}

      {cua.loaiOThoang ===
        "nanchop" && (

        <input
          type="number"
          placeholder="Số lượng ô nan chớp"
          value={cua.oThoangNanChop || ""}
          onChange={(e) =>
            capNhatCua(
              cua.id,
              "oThoangNanChop",
              e.target.value
            )
          }
          className="
            w-full
            border
            p-3
            rounded-2xl
          "
        />

      )}

      {cua.loaiOThoang ===
        "vom" && (

        <div className="space-y-2">

          <input
            type="number"
            placeholder="Chiều cao vòm"
            value={cua.caoVom || ""}
            onChange={(e) =>
              capNhatCua(
                cua.id,
                "caoVom",
                e.target.value
              )
            }
            className="
              w-full
              border
              p-3
              rounded-2xl
            "
          />

          <div
            className="
              border
              rounded-2xl
              p-3
            "
          >

            Diện tích ô vòm:
            {" "}

            {(
              (
                (
  Math.PI *
  kichThuocMet(cua.rong) *
  Number(cua.caoVom || 0)
) / 4
              )
            ).toFixed(2)} m²

          </div>

        </div>

      )}

    </div>

  )}

</div>

    <div>

  <label className="flex items-center gap-2">

    <input
      type="checkbox"
      checked={cua.coKinhCanh}
      onChange={(e) =>
        capNhatCua(
          cua.id,
          "coKinhCanh",
          e.target.checked
        )
      }
    />

    Kính cánh

  </label>

  {cua.coKinhCanh && (

    <>

      <select
        value={cua.loaiKinhCanh}
        onChange={(e) =>
          capNhatCua(
            cua.id,
            "loaiKinhCanh",
            e.target.value
          )
        }
        className="
          w-full
          border
          p-3
          rounded-2xl
          mt-2
        "
      >

        <option value="to">
          Ô kính to
          (350.000đ)
        </option>

        <option value="nho">
          Ô kính nhỏ
          (250.000đ)
        </option>

      </select>

      <input
        type="number"
        placeholder="Số lượng"
        value={cua.kinhCanh || ""}
        onChange={(e) =>
          capNhatCua(
            cua.id,
            "kinhCanh",
            e.target.value
          )
        }
        className="
          w-full
          border
          p-3
          rounded-2xl
          mt-2
        "
      />

    </>

  )}

</div>


  </div>

)}
                </>
              )}

            </div>

            );
          }
        )}
        

        <button
          onClick={themCua}
          className="w-full p-4 rounded-2xl font-bold form-action form-action--secondary"
          style={{
  backgroundColor: "#2563eb",
  color: "#ffffff",
  boxShadow:
    "0 6px 10px rgba(37,99,235,0.3)"
}}
        >

          Thêm cửa

        </button>

        <button
          onClick={() =>
            setXemHoaDon(true)
          }
          className="w-full p-4 rounded-2xl font-bold form-action form-action--primary"
style={{
  backgroundColor: "#2563eb",
  color: "#ffffff"
}}
        >

          Xem hóa đơn

        </button>

        <div className="mobile-total-bar" aria-live="polite">
          <div>
            <span className="mobile-total-label">Tổng tạm tính</span>
            <span className="mobile-total-caption">Chưa gồm cước vận chuyển &amp; VAT</span>
          </div>
          <strong className="mobile-total-value">{animatedTongCong.toLocaleString("vi-VN")} đ</strong>
        </div>

      </div>

    </div>

      
       )

  }

</>
);
}
