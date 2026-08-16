"use client";

import {
  useState,
  useRef,
  useEffect,
} from "react";
import html2canvas from "html2canvas";
import PaintOrder from "./PaintOrder";
const formatTien = (value) => {

  const number =
    value.replace(/\D/g, "");

  return Number(number)
    .toLocaleString("en-US");

};
const formatSoLuong = (value) => {
  return Number(value)
    .toFixed(2)
    .replace(/\.00$/, "")
    .replace(/(\.\d*[1-9])0$/, "$1");
};

const kichThuocMet = (value) => Number(value || 0) / 1000;

const tinhTienBomForm = (cua) =>
  Number(cua.khuon || 0) < 200 ? 150000 : 250000;

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
  tenKhoa: "",
  soLuongKhoa: 1,
  donGiaKhoa: "",

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

export default function Home() {
  const [danhSachCua, setDanhSachCua] =
    useState([taoBoCuaMoi("initial")]);

  const [xemHoaDon, setXemHoaDon] =
    useState(false);
  const [dangLuuAnh, setDangLuuAnh] =
    useState(false);
  const [anhHoaDon, setAnhHoaDon] = useState("");
  const [tenFileAnh, setTenFileAnh] = useState("");
    const [loaiDon, setLoaiDon] =
  useState("");

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
    };

    setTimeout(restoreDraft, 0);
  }

}, []);
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
    const donMoi = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      type: "cua",
      employee: nhanVien,
      customer: tenKhach || "Khách chưa đặt tên",
      createdAt: new Date().toISOString(),
      danhSachCua,
      nhanVien,
      tenKhach,
      diaChiKhach,
      tienCoc,
      cuocVanChuyen,
      loaiDon,
    };
    const danhSachMoi = [donMoi, ...donDaLuu];
    localStorage.setItem("order_archive_v1", JSON.stringify(danhSachMoi));
    setDonDaLuu(danhSachMoi);
    alert("Đã lưu đơn cửa vào kho lưu trữ của nhân viên.");
  };

  const moDonCuaDaLuu = (don) => {
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

  const tongCong = danhSachCua.reduce(
      (tong, cua) => {

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

        const tienPhao =

  cua.loaiPhao ===
  "Phào phụ"

    ? tinhTienPhao(cua)

    : cua.loaiPhao ===
      "Phào đình"

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
  tong +
  tienCua +
  tienKhoa +
  tienPhao +
  tienBom +
  tienOThoang +
  tienKinhCanh
);

      },
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
    if (!hoaDonRef.current || dangLuuAnh) return;

    setDangLuuAnh(true);

    try {
      if (document.fonts?.ready) await document.fonts.ready;

      const captureNode = hoaDonRef.current;
      const captureWidth = Math.ceil(captureNode.getBoundingClientRect().width);
      const captureHeight = Math.ceil(captureNode.scrollHeight);

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
      const dataUrl = canvas.toDataURL("image/png");

      const homNay = new Date();
      const ngay = `${homNay.getFullYear()}${String(homNay.getMonth() + 1).padStart(2, "0")}${String(homNay.getDate()).padStart(2, "0")}`;
      const key = `save_count_${ngay}`;
      const soThuTu = Number(localStorage.getItem(key) || "0") + 1;
      localStorage.setItem(key, String(soThuTu));

      setAnhHoaDon(dataUrl);
      setTenFileAnh(`${ngay}-${soThuTu}.png`);
    } catch (error) {
      console.error("Không thể tạo ảnh hóa đơn:", error);
      alert("Không thể tạo ảnh hóa đơn. Vui lòng thử lại.");
    } finally {
      setDangLuuAnh(false);
    }
  };

  const taiAnhHoaDon = () => {
    if (!anhHoaDon) return;
    const link = document.createElement("a");
    link.href = anhHoaDon;
    link.download = tenFileAnh || "hoa-don.png";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const chiaSeAnhHoaDon = async () => {
    if (!anhHoaDon) return;

    try {
      const blob = await (await fetch(anhHoaDon)).blob();
      const file = new File([blob], tenFileAnh || "hoa-don.png", { type: "image/png" });

      if (!navigator.share || (navigator.canShare && !navigator.canShare({ files: [file] }))) {
        taiAnhHoaDon();
        return;
      }

      await navigator.share({ files: [file], title: "Hóa đơn cửa thép" });
    } catch (error) {
      if (error?.name !== "AbortError") console.error("Chia sẻ ảnh thất bại:", error);
    }
  };

 if (xemHoaDon) {

  return (

    <>

      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
        }

        @media (max-width: 768px) {
          .tong-tien {
            font-size: 34px !important;
          }
        }

        .invoice-screen {
          box-sizing: border-box;
          width: 100% !important;
          max-width: none !important;
          min-height: 100vh;
          padding: 28px 16px 48px;
          overflow: visible !important;
          background:
            radial-gradient(circle at 8% 8%, rgba(125, 211, 252, 0.42), transparent 32%),
            radial-gradient(circle at 92% 18%, rgba(196, 181, 253, 0.38), transparent 30%),
            linear-gradient(135deg, #e8f1f8 0%, #f6f8fc 48%, #e9e7f5 100%);
        }

        .invoice-paper {
          border: 1px solid rgba(255, 255, 255, 0.78) !important;
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.66) !important;
          box-shadow: 0 24px 70px rgba(57, 73, 101, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }

        .invoice-header {
          border-bottom-color: rgba(148, 163, 184, 0.28) !important;
          padding-bottom: 26px !important;
        }

        .invoice-header h1 {
          color: #172033;
          letter-spacing: -0.025em;
        }

        .invoice-header p,
        .invoice-customer,
        .invoice-footer {
          color: #536176;
        }

        .invoice-customer {
          margin-top: 26px !important;
          padding: 16px 18px;
          border: 1px solid rgba(255, 255, 255, 0.78);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.42);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72);
        }

        .invoice-table-wrap {
          margin-top: 24px;
          padding: 10px;
          overflow: visible;
          min-width: 0;
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.42);
        }

        .invoice-table-wrap table {
          overflow: hidden;
          border-radius: 14px;
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
          margin-top: 26px !important;
        }

        .invoice-total-card {
          padding: 18px 20px !important;
          border: 1px solid rgba(255, 255, 255, 0.82);
          border-radius: 22px;
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.72), rgba(226, 232, 240, 0.4));
          box-shadow: 0 12px 28px rgba(71, 85, 105, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.85);
        }

        .invoice-total-card table {
          margin-top: 0 !important;
          color: #46546a;
        }

        .invoice-total-card tr:last-child {
          color: #18243a;
          font-size: 1.08em;
        }

        .invoice-total-card tr:last-child td {
          padding-top: 14px !important;
          border-top: 1px solid rgba(100, 116, 139, 0.25);
        }

        .invoice-footer {
          margin-top: 24px;
          padding: 20px 8px 8px !important;
          border-top: 1px solid rgba(148, 163, 184, 0.24);
        }

        .invoice-actions {
          max-width: 210mm;
          margin: 24px auto 0 !important;
          padding: 14px;
          border: 1px solid rgba(255, 255, 255, 0.78);
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.54);
          box-shadow: 0 12px 30px rgba(71, 85, 105, 0.08);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }

        .invoice-actions button {
          border: 1px solid rgba(255, 255, 255, 0.68);
          box-shadow: 0 5px 12px rgba(71, 85, 105, 0.1);
          transition: transform 160ms ease, box-shadow 160ms ease;
        }

        .invoice-actions button:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 16px rgba(71, 85, 105, 0.15);
        }

        .invoice-preview {
          border-color: rgba(255, 255, 255, 0.8) !important;
          background: rgba(255, 255, 255, 0.52) !important;
        }

        @media (max-width: 768px) {
          .invoice-screen {
            padding: 12px 8px 28px;
          }

          .invoice-paper {
            border-radius: 22px;
          }

          .invoice-table-wrap {
            margin-left: -2px;
            margin-right: -2px;
            padding: 6px;
            border-radius: 16px;
          }
        }

        @media print {
          .invoice-screen {
            padding: 0;
            background: #ffffff;
          }

          .invoice-paper {
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
  className="border invoice-paper"
  ref={hoaDonRef}
  style={{
    width: "100%",
    maxWidth: "210mm",
    minHeight: "297mm",
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

            <div className="flex gap-4">

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

              <div>

                <h1 className="text-2xl font-bold uppercase">

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
  className="text-center font-bold mt-10"
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

<table className="w-full border-collapse table-fixed">
        <colgroup>
  <col style={{ width: "28%" }} />
  <col style={{ width: "5%" }} />
  <col style={{ width: "8%" }} />
  <col style={{ width: "8%" }} />
  <col style={{ width: "5%" }} />
  <col style={{ width: "10%" }} />
  <col style={{ width: "6%" }} />
  <col style={{ width: "14%" }} />
  <col style={{ width: "16%" }} />
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



  return (

    <>

      <tr>

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

    overflow: "hidden",

    textOverflow: "ellipsis",

    verticalAlign: "middle",
  }}
>

          {formatSoLuong(
            kichThuocMet(cua.rong) *
            kichThuocMet(cua.cao)
          )}

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

            Khóa:
            {" "}
            {cua.tenKhoa}

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

      {cua.loaiPhao ===
        "Phào đình" && (

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
    whiteSpace: "nowrap",
  }}
>

            {formatSoLuong(slPhaoDinh)}
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
    tienPhaoDinh
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

  {
  Math.round(
    tienPhaoDinh
  ).toLocaleString()
}

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
  className="no-print invoice-actions"
  style={{
    display: "flex",
    gap: "12px",
    marginTop: "40px",
    flexWrap: "wrap",
  }}
>

              <button
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
                className="px-5 py-3 rounded-xl"
style={{
  backgroundColor: "#e5e7eb"
}}
              >

                Quay lại

              </button>
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
  disabled={dangLuuAnh}
  className="px-5 py-3 rounded-xl"
  style={{
    color: "#ffffff",
    backgroundColor: dangLuuAnh ? "#a16207" : "#ca8a04",
  }}
>

              {dangLuuAnh ? "Đang tạo ảnh..." : "Lưu ảnh"}

              </button>

              {anhHoaDon && (
                <div
                   className="no-print invoice-preview"
                  style={{
                    flexBasis: "100%",
                    marginTop: "8px",
                    padding: "12px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "16px",
                    backgroundColor: "#f8fafc",
                  }}
                >
                  <p style={{ margin: "0 0 8px", fontWeight: 600 }}>
                    Ảnh đã tạo - chọn cách lưu:
                  </p>
                  <img
                    src={anhHoaDon}
                    alt="Xem trước hóa đơn cửa thép"
                    style={{
                      display: "block",
                      width: "100%",
                      maxHeight: "420px",
                      objectFit: "contain",
                      borderRadius: "12px",
                      backgroundColor: "#ffffff",
                    }}
                  />
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px" }}>
                    <button type="button" onClick={chiaSeAnhHoaDon} className="px-4 py-2 rounded-xl text-white" style={{ backgroundColor: "#2563eb" }}>
                      Chia sẻ / Tải ảnh
                    </button>
                    <button type="button" onClick={() => setAnhHoaDon("")} className="px-4 py-2 rounded-xl" style={{ backgroundColor: "#e5e7eb" }}>
                      Đóng xem trước
                    </button>
                  </div>
                </div>
              )}

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
          setLoaiDon("khachle")
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
        Lên đơn khách lẻ
      </button>

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
      <button type="button" onClick={() => setLoaiDon("son-mykolor")} className="choice-button choice-button--paint choice-button--mykolor w-full max-w-md py-4 rounded-2xl text-xl font-bold relative z-10 cursor-pointer select-none" style={{ backgroundColor: "#f8fafc", color: "#17202b", touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}>
        L&#xEA;n &#x111;&#x1A1;n s&#x1A1;n Mykolor
      </button>
      <button type="button" onClick={() => setLoaiDon("son-forich")} className="choice-button choice-button--paint choice-button--forich w-full max-w-md py-4 rounded-2xl text-xl font-bold relative z-10 cursor-pointer select-none" style={{ backgroundColor: "#f97316", color: "#ffffff", touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}>
        L&#xEA;n &#x111;&#x1A1;n s&#x1A1;n Forich
      </button>
      <button type="button" onClick={() => setLoaiDon("son-sunpro")} className="choice-button choice-button--paint choice-button--sunpro w-full max-w-md py-4 rounded-2xl text-xl font-bold relative z-10 cursor-pointer select-none" style={{ backgroundColor: "#facc15", color: "#17202b", touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}>
        L&#xEA;n &#x111;&#x1A1;n s&#x1A1;n Sunpro
      </button>

    </div>

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
                  <div><b>{don.customer}</b><div className="text-xs text-gray-500">{new Date(don.createdAt).toLocaleString("vi-VN")}</div></div>
                  <div className="flex gap-1"><button type="button" onClick={() => moDonCuaDaLuu(don)} className="rounded-lg bg-blue-600 px-2 py-1 text-white">Xem</button><button type="button" onClick={() => xoaDonDaLuu(don.id)} className="rounded-lg bg-red-100 px-2 py-1 text-red-700">Xóa</button></div>
                </div>
              ))}
            </div>
          )}
        </div>

        <input
          placeholder="Tên khách hàng"
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
                onChange={(e) =>
                  capNhatCua(
                    cua.id,
                    "loaiCua",
                    e.target.value
                  )
                }
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

                {!laChanSong && <input
                  placeholder="Hướng mở"
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

              <label className="flex items-center gap-2">

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

              </label>

              {cua.coKhoa && (

                <>

                  <input
                    placeholder="Tên khóa"
                    value={cua.tenKhoa}
                    onChange={(e) =>
                      capNhatCua(
                        cua.id,
                        "tenKhoa",
                        e.target.value
                      )
                    }
                    className="w-full border p-3 rounded-2xl"
                  />

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
    onChange={() =>
      capNhatCua(
        cua.id,
        "loaiPhao",
        "Phào phụ"
      )
    }
  />

  Phào phụ

</label>

<label className="flex items-center gap-2">

  <input
    type="radio"
    name={`phao-${cua.id}`}
    checked={
      cua.loaiPhao ===
      "Phào đình"
    }
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

{cua.loaiPhao ===
  "Phào đình" && (

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

            
{loaiDon === "daily" && (
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
