"use client";

import {
  useState,
  useMemo,
  useRef,
  useEffect,
} from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
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

export default function Home() {

  const taoBoCuaMoi = () => ({
    id: Date.now() + Math.random(),

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
    kinhOThoang: "",

coKinhCanh: false,

loaiKinhCanh: "nho",

kinhCanh: "",
  });

  const [danhSachCua, setDanhSachCua] =
    useState([taoBoCuaMoi()]);

  const [xemHoaDon, setXemHoaDon] =
    useState(false);
    const [loaiDon, setLoaiDon] =
  useState("");

  const [nhanVien, setNhanVien] =
    useState("");

  const [tenKhach, setTenKhach] =
    useState("");

  const [diaChiKhach, setDiaChiKhach] =
    useState("");
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

  const xoaCua = (id) => {

    if (danhSachCua.length === 1)
      return;

    setDanhSachCua(
      danhSachCua.filter(
        (item) =>
          item.id !== id
      )
    );

  };

  const tinhSoLuongCua = (cua) => {

    return (
      Number(cua.rong || 0) *
      Number(cua.cao || 0)
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
        Number(cua.cao || 0) *
          2 +
        Number(cua.rong || 0) *
          2
      );

    }

    return (
      Number(cua.rong || 0) +
      Number(cua.cao || 0) * 2
    );

  };

  const tinhTienPhao = (cua) => {

    return (
      tinhPhaoPhu(cua) *
      Number(cua.donGiaPhao || 0)
    );

  };

  const tongCong = useMemo(() => {

    return danhSachCua.reduce(
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

                Number(cua.cao || 0) *
                  2 +

                (
                  Number(cua.rong || 0) +
                  0.5
                ) +

                (
                  Number(cua.rong || 0) +
                  0.8
                )

              )

            : (

                coPhaoNgang

                  ? (

                      Number(cua.cao || 0) *
                        2 +

                      (
                        Number(cua.rong || 0) +
                        rongPhaoDungM * 2
                      ) +

                      (
                        Number(cua.rong || 0) +
                        rongPhaoDungM * 2 +
                        0.3
                      )

                    )

                  : (

                      Number(cua.cao || 0) *
                        2 +

                      (
                        Number(cua.rong || 0) +
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
                      Number(cua.cao || 0) *
                      2 *
                      Number(
                        cua.donGiaPhaoDung || 0
                      )
                    ) +

                    (
                      (
                        Number(cua.rong || 0) +
                        rongPhaoDungM * 2
                      ) *

                      Number(
                        cua.donGiaPhaoNgang || 0
                      )
                    ) +

                    (
                      (
                        Number(cua.rong || 0) +
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
                      Number(cua.cao || 0) *
                      2 *
                      Number(
                        cua.donGiaPhaoDung || 0
                      )
                    ) +

                    (
                      (
                        Number(cua.rong || 0) +
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
            ? 250000
            : 0;
            const tienKinhOThoang =
  Number(cua.kinhOThoang || 0)
  * 60000;

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
  tienKinhOThoang +
  tienKinhCanh
);

      },
      0
    );

  }, [danhSachCua]);
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

  const taiPDF = async () => {

  try {

    const input =
      hoaDonRef.current;
      const buttons =
  input.querySelectorAll(
    ".no-print"
  );

buttons.forEach((el) => {
  el.style.display = "none";
});
      await new Promise(
  (resolve) =>
    setTimeout(
      resolve,
      300
    )
);

    if (!input) return;

    const canvas =
  await html2canvas(
    input,
    {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor:
        "#ffffff",

      logging: true,

      onclone: (doc) => {

        const all =
          doc.querySelectorAll("*");

        all.forEach((el) => {

          const style =
  window.getComputedStyle(el);

el.style.color =
  style.color;

el.style.backgroundColor =
  style.backgroundColor;

el.style.borderColor =
  style.borderColor;

        });

      },
    }
  );

    const imgData =
      canvas.toDataURL(
        "image/png"
      );

    const link =
  document.createElement("a");

link.download =
  "hoa-don.png";

link.href =
  canvas.toDataURL(
    "image/png",
    1.0
  );

link.click();


  } catch (error) {

  console.log(error);

  alert(error.message);

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
      `}</style>

      <div
        ref={hoaDonRef}
        style={{
          fontFamily:
            "Arial, sans-serif",
          backgroundColor:
            "#ffffff",
          width: "100%",
          maxWidth: "210mm",
          margin: "0 auto",
          overflowX: "auto",
        }}
      >

        <div
  className="border"
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

        <div  className="border-b"
style={{
  paddingBottom: "10mm"
}} >

            <div className="flex gap-4">

             <img
  src="/logo.jpg?v=1"
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

            <div className="grid grid-cols-2 mt-10 gap-4">

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
  style={{
    overflowX: "auto",
  }}
>

<table className="w-full border-collapse table-fixed">
        <colgroup>
  <col style={{ width: "32%" }} />
  <col style={{ width: "6%" }} />
  <col style={{ width: "6%" }} />
  <col style={{ width: "6%" }} />
  <col style={{ width: "6%" }} />
  <col style={{ width: "12%" }} />
  <col style={{ width: "8%" }} />
  <col style={{ width: "14%" }} />
  <col style={{ width: "16%" }} />
</colgroup>

            <thead>

              <tr>

                <th
  className="border"
  style={{
    padding: "12px 6px",
    fontSize: isMobile
 ? "6px"
  : "8px",
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
      ? "6px"
      : "8px",

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
  ? "6px"
  : "8px",
  overflowWrap: "break-word",

    fontWeight: "700",

    textAlign: "center",

    verticalAlign: "middle",

    wordBreak: "break-word",

    whiteSpace: "normal",

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
  ? "6px"
  : "8px",
  overflowWrap: "break-word",

    fontWeight: "700",

    textAlign: "center",

    verticalAlign: "middle",

    wordBreak: "break-word",

    whiteSpace: "normal",

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
  ? "6px"
  : "8px",
  overflowWrap: "break-word",

    fontWeight: "700",

    textAlign: "center",

    verticalAlign: "middle",

    wordBreak: "break-word",

    whiteSpace: "normal",

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
      ? "6px"
      : "8px",
overflowWrap: "break-word",
    fontWeight: "700",

    textAlign: "center",

    verticalAlign: "middle",

    wordBreak: "break-word",

    whiteSpace: "normal",

    lineHeight: "1.3",
  }}
>
                  Hướng mở
                </th>

                <th
  className="border"
  style={{
    padding: "12px 6px",
    fontSize: isMobile
 ? "6px"
  : "8px",
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
    padding: "12px 6px",
    fontSize: isMobile
 ? "6px"
  : "14px",


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
    padding: "12px 6px",
    fontSize: isMobile
 ? "6px"
  : "8px",
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

        Number(cua.cao || 0) *
          2 +

        (
          Number(cua.rong || 0) +
          0.5
        ) +

        (
          Number(cua.rong || 0) +
          0.8
        )

      )

    : (

        coPhaoNgang

          ? (

              Number(cua.cao || 0) *
                2 +

              (
                Number(cua.rong || 0) +
                rongPhaoDungM * 2
              ) +

              (
                Number(cua.rong || 0) +
                rongPhaoDungM * 2 +
                0.3
              )

            )

          : (

              Number(cua.cao || 0) *
                2 +

              (
                Number(cua.rong || 0) +
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
                Number(cua.cao || 0) *
                2 *
                Number(
                  cua.donGiaPhaoDung || 0
                )
              ) +

              (
                (
                  Number(cua.rong || 0) +
                  rongPhaoDungM * 2
                ) *

                Number(
                  cua.donGiaPhaoNgang || 0
                )
              ) +

              (
                (
                  Number(cua.rong || 0) +
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
                Number(cua.cao || 0) *
                2 *
                Number(
                  cua.donGiaPhaoDung || 0
                )
              ) +

              (
                (
                  Number(cua.rong || 0) +
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
      : "8px",

    fontSize: isMobile
      ? "6px"
      : "14px",

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
 ? "6px"
  : "8px",
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
 ? "6px"
  : "8px",
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
 ? "6px"
  : "8px",
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
 ? "6px"
  : "8px",
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
      ? "6px"
      : "14px",

    textAlign: "right",

    whiteSpace: "nowrap",

    overflow: "hidden",

    textOverflow: "ellipsis",

    verticalAlign: "middle",
  }}
>

          {formatSoLuong(
            Number(cua.rong || 0) *
            Number(cua.cao || 0)
          )}

        </td>

       <td
  className="border"
  style={{ overflowWrap: "break-word",
    padding: "6px",
    fontSize: isMobile ? "6px" : "14px",
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
      ? "6px"
      : "14px",

    textAlign: "right",

    whiteSpace: "nowrap",

    overflow: "hidden",

    textOverflow: "ellipsis",
  }}
>

          {
  Math.round(
    (
      Number(cua.rong || 0) *
      Number(cua.cao || 0)
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
 ? "6px"
  : "8px",
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
 ? "6px"
  : "8px",
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
 ? "6px"
  : "8px",
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
    fontSize: isMobile ? "6px" : "14px",
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
 ? "6px"
  : "8px",
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
 ? "6px"
  : "8px",
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
 ? "6px"
  : "8px",
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
    fontSize: isMobile ? "6px" : "14px",
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
 ? "6px"
  : "8px",
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
 ? "6px"
  : "8px",
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
 ? "6px"
  : "8px",
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
    fontSize: isMobile ? "6px" : "14px",
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
 ? "6px"
  : "8px",
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
 ? "6px"
  : "8px",
    verticalAlign: "middle",
  }}
>
            250,000
          </td>

          <td
  className="border"
  style={{ overflowWrap: "break-word",
    padding: "6px",
    fontWeight: "700",
    fontSize: isMobile ? "6px" : "14px",
    textAlign: "right",
    whiteSpace: "nowrap",
  }}
>
            250,000
          </td>

        </tr>

      )}
      {Number(cua.kinhOThoang) > 0 && (

<tr>

  <td
    className="border"
    style={{
      padding: "6px",
      fontSize: isMobile
        ? "6px"
        : "8px",
    }}
  >
    Kính ô thoáng
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
        ? "6px"
        : "8px",
      textAlign: "right",
    }}
  >
    60.000
  </td>

  <td
    className="border"
    style={{
      padding: "6px",
      fontSize: isMobile
        ? "6px"
        : "14px",
      fontWeight: "700",
      textAlign: "right",
    }}
  >
    {(
      Number(cua.kinhOThoang)
      * 60000
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
      fontSize: isMobile
        ? "6px"
        : "8px",
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
        ? "6px"
        : "8px",
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
        ? "6px"
        : "14px",
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

    </>

  );

})}

            </tbody>

          </table>
</div>
          

          <div
  style={{
    marginTop: "20px",
  }}
>

  {/* Tổng cộng */}

  <div
    className="p-6"
    style={{
      textAlign: "right",
    }}
  >

    <p className="text-xl">
      Tổng cộng
    </p>

    <p
      className="tong-tien"
      style={{
       fontSize: isMobile
  ? "16px"
  : "34px",

        color: "#16a34a",

        fontWeight: "700",

        lineHeight: "1.1",

        wordBreak: "break-word",
      }}
    >

      {
  Math.round(
    tongSauVanChuyen
  ).toLocaleString()
} đ
      <div
  style={{
    marginTop: "10px",
  }}
>

  <p
    style={{
      fontSize: isMobile
        ? "10px"
        : "16px",
    }}
  >
    
    {loaiDon === "daily" && (

  <p
    style={{
      fontSize: isMobile
        ? "10px"
        : "16px",
    }}
  >
    VAT 5%:
    {" "}
    {
  Math.round(
    tienVAT
  ).toLocaleString()
} đ
  </p>

)}
    <p
  style={{
    fontSize: isMobile
      ? "10px"
      : "16px",
  }}
>
  Cước vận chuyển:
  {" "}
  {tienVanChuyen.toLocaleString()} đ
</p>
    Đã cọc:
    {" "}
    {soTienDaCoc.toLocaleString()} đ
  </p>

  <p
    style={{
      fontSize: isMobile
        ? "12px"
        : "20px",

      color: "#dc2626",

      fontWeight: "700",
    }}
  >
    Còn phải thanh toán:
    {" "}
    {
  Math.round(
    conPhaiThanhToan
  ).toLocaleString()
} đ
  </p>

</div>

    </p>

  </div>

  {/* Ngày tháng */}

  <div className="p-6">

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
  className="no-print"
  style={{
    display: "flex",
    gap: "12px",
    marginTop: "40px",
    flexWrap: "wrap",
  }}
>

              <button
                onClick={() =>
                  setXemHoaDon(false)
                }
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
  onClick={taiPDF}
  className="px-5 py-3 rounded-xl"
  style={{
    color: "#ffffff",
    backgroundColor: "#ca8a04",
  }}
>

                Lưu ảnh / Quay lại

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

      <h1
        className="
          text-3xl
          font-bold
        "
      >
        Chọn loại đơn
      </h1>

      <button
        onClick={() =>
          setLoaiDon("khachle")
        }
        className="
          w-full
          max-w-md
          py-4
          rounded-2xl
          text-xl
          font-bold
        "
        style={{
          backgroundColor: "#2563eb",
          color: "#ffffff",
        }}
      >
        Lên đơn khách lẻ
      </button>

      <button
        onClick={() =>
          setLoaiDon("daily")
        }
        className="
          w-full
          max-w-md
          py-4
          rounded-2xl
          text-xl
          font-bold
        "
        style={{
          backgroundColor: "#16a34a",
          color: "#ffffff",
        }}
      >
        Lên đơn đại lý
      </button>

    </div>

  ) : ( 

    <div className="min-h-screen p-4"
style={{ backgroundColor: "#f3f4f6" }}>

      <div className="max-w-xl mx-auto rounded-3xl p-5 space-y-6"
style={{
  backgroundColor: "#ffffff",
  boxShadow:
    "0 2px 10px rgba(0,0,0,0.1)"
}}>

        <h1 className="text-3xl font-bold">

          Lên Đơn Cửa Thép

        </h1>

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
          (cua, index) => (

            <div
              key={cua.id}
              className="border rounded-3xl p-4 space-y-4"
            >

              <div className="flex justify-between">

                <h2 className="text-xl font-bold">

                  Bộ cửa
                  {" "}
                  {index + 1}

                </h2>

                <button
                  onClick={() =>
                    xoaCua(cua.id)
                  }
                  style={{ color: "#ef4444" }}
                >

                  Xóa

                </button>

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

              </select>

              <div className="grid grid-cols-2 gap-4">

                <input
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
                />

                <input
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
                />

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

                <input
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
                />

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
            Number(cua.cao || 0) *
              2 +
            (
              Number(cua.rong || 0) +
              0.5
            ) +
            (
              Number(cua.rong || 0) +
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
                (+250.000đ)

              </label>
              {loaiDon === "daily" && (

  <div className="space-y-3 mt-3">

    <div>

      <label>
        Kính ô thoáng
        (+60.000đ)
      </label>

      <input
        type="number"
        placeholder="Số lượng"
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

            </div>

          )
        )}

        <button
          onClick={themCua}
          className="w-full p-4 rounded-2xl font-bold"
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
          className="w-full p-4 rounded-2xl font-bold"
style={{
  backgroundColor: "#2563eb",
  color: "#ffffff"
}}
        >

          Xem hóa đơn

        </button>

      </div>

    </div>

      
       )

  }

</>
);
}