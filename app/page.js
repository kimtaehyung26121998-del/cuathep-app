"use client";

import { useState, useMemo, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
const formatTien = (value) => {

  const number =
    value.replace(/\D/g, "");

  return Number(number)
    .toLocaleString("en-US");

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
  });

  const [danhSachCua, setDanhSachCua] =
    useState([taoBoCuaMoi()]);

  const [xemHoaDon, setXemHoaDon] =
    useState(false);

  const [nhanVien, setNhanVien] =
    useState("");

  const [tenKhach, setTenKhach] =
    useState("");

  const [diaChiKhach, setDiaChiKhach] =
    useState("");

  const hoaDonRef = useRef(null);

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

    ? (
        Number(cua.cao || 0) *
          2 *
          Number(
            cua.donGiaPhaoDung || 0
          )
      ) +

      (
        (
          Number(cua.rong || 0) +
          Number(
            cua.rongPhaoDung || 0
          ) / 100
        ) *
        Number(
          cua.donGiaPhaoNgang || 0
        )
      ) +

      (
        (
          Number(cua.rong || 0) +
          Number(
            cua.rongPhaoDung || 0
          ) / 100 +
          0.3
        ) *
        Number(
          cua.donGiaPhaoDinh || 0
        )
      )

    : 0;

        const tienBom =
          cua.coBomForm
            ? 250000
            : 0;

        return (
          tong +
          tienCua +
          tienKhoa +
          tienPhao +
          tienBom
        );

      },
      0
    );

  }, [danhSachCua]);

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

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = 210;

const pdfHeight = 297;

const margin = 0;

const usableWidth = 210;

const usableHeight = 297;

const imgWidth =
  usableWidth;

const imgHeight =
  (canvas.height *
    imgWidth) /
  canvas.width;

let heightLeft =
  imgHeight;

let position =
  margin;

pdf.addImage(
  imgData,
  "PNG",
  margin,
  position,
  imgWidth,
  imgHeight
);

heightLeft -= usableHeight;

while (heightLeft > 0) {

  position =
    margin -
    (imgHeight -
      heightLeft);

  pdf.addPage();

  pdf.addImage(
    imgData,
    "PNG",
    margin,
    position,
    imgWidth,
    imgHeight
  );

  heightLeft -= usableHeight;

}

    while (heightLeft > 0) {

      position =
        heightLeft -
        imgHeight;

      pdf.addPage();

      pdf.addImage(
        imgData,
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight
      );

      heightLeft -=
        pageHeight;

    }

    buttons.forEach((el) => {
  el.style.display = "flex";
});
    pdf.save(
      "hoa-don.pdf"
    );

  } catch (error) {

  console.log(error);

  alert(error.message);

}

};

  if (xemHoaDon) {

    return (

      <div
  ref={hoaDonRef}
  style={{
    fontFamily:
      "Arial, sans-serif",
    backgroundColor: "#ffffff",
    width: "100%",
    maxWidth: "210mm",
    margin: "0 auto",
    overflowX: "hidden",
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
    padding:
      window.innerWidth < 768
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

                <h1 className="text-4xl font-bold uppercase">

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
    fontSize:
      window.innerWidth < 768
        ? "34px"
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
  <col style={{ width: "28%" }} />
  <col style={{ width: "9%" }} />
  <col style={{ width: "8%" }} />
  <col style={{ width: "6%" }} />
  <col style={{ width: "6%" }} />
  <col style={{ width: "12%" }} />
  <col style={{ width: "8%" }} />
  <col style={{ width: "14%" }} />
  <col style={{ width: "16 %" }} />
</colgroup>

            <thead>

              <tr>

                <th
  className="border"
  style={{
    padding: "12px 6px",
    fontSize: "15px",
    fontWeight: "700",
    textAlign: "center",
    lineHeight: "1.4",
  }}
>
                  Tên sản phẩm
                </th>

                <th className="border p-2 w-24">
  Khuôn
</th>

                <th
  className="border"
  style={{
    padding: "12px 6px",
    fontSize: "15px",
    fontWeight: "700",
    textAlign: "center",
    lineHeight: "1.4",
  }}
>
                  Rộng
                </th>

                <th
  className="border"
  style={{
    padding: "12px 6px",
    fontSize: "15px",
    fontWeight: "700",
    textAlign: "center",
    lineHeight: "1.4",
  }}
>
                  Cao
                </th>

                <th
  className="border"
  style={{
    padding: "12px 6px",
    fontSize: "15px",
    fontWeight: "700",
    textAlign: "center",
    lineHeight: "1.4",
  }}
>
                  Màu
                </th>

                <th
  className="border"
  style={{
    padding: "12px 6px",
    fontSize: "15px",
    fontWeight: "700",
    textAlign: "center",
    lineHeight: "1.4",
  }}
>
                  Hướng mở
                </th>

                <th
  className="border"
  style={{
    padding: "12px 6px",
    fontSize: "15px",
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
    fontSize: "15px",
    fontWeight: "700",
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
    fontSize: "15px",
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
  style={{
    padding: "8px",
    fontWeight: "700",
    fontSize: "16px",
    lineHeight: "1.5",
    wordBreak: "break-word",
  }}
>

          Bộ cửa {index + 1}
          :
          {" "}
          {cua.loaiCua}

        </td>

        <td className="border p-2 text-center">
  {cua.khuon || "-"}
</td>

        <td
  className="border"
  style={{
    padding: "8px",
    fontSize: "15px",
    verticalAlign: "middle",
  }}
>
          {cua.rong}
        </td>

        <td
  className="border"
  style={{
    padding: "8px",
    fontSize: "15px",
    verticalAlign: "middle",
  }}
>
          {cua.cao}
        </td>

        <td
  className="border"
  style={{
    padding: "8px",
    fontSize: "15px",
    verticalAlign: "middle",
  }}
>
          {cua.maMau}
        </td>

        <td
  className="border"
  style={{
    padding: "8px",
    fontSize: "15px",
    verticalAlign: "middle",
  }}
>
          {cua.huongMo}
        </td>

        <td
  className="border"
  style={{
    padding: "8px",
    fontSize: "15px",
    verticalAlign: "middle",
  }}
>

          {(
            Number(cua.rong || 0) *
            Number(cua.cao || 0)
          ).toFixed(2)}

        </td>

        <td
  className="border"
  style={{
    padding: "8px",
    fontSize: "15px",
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
    padding: "8px",
    fontWeight: "700",
    fontSize: "14px",
    textAlign: "right",
    whiteSpace: "nowrap",
  }}
>

          {(
            (
              Number(cua.rong || 0) *
              Number(cua.cao || 0)
            ) *
            Number(cua.donGia || 0)
          ).toLocaleString()}

        </td>

      </tr>

      {cua.coKhoa && (

        <tr>

          <td
  className="border"
  style={{
    padding: "8px",
    fontSize: "15px",
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
  style={{
    padding: "8px",
    fontSize: "15px",
    verticalAlign: "middle",
  }}
>
            {cua.soLuongKhoa}
          </td>

          <td
  className="border"
  style={{
    padding: "8px",
    fontSize: "15px",
    verticalAlign: "middle",
  }}
>

            {Number(
              cua.donGiaKhoa || 0
            ).toLocaleString()}

          </td>

          <td
  className="border"
  style={{
    padding: "8px",
    fontWeight: "700",
    fontSize: "14px",
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
  style={{
    padding: "8px",
    fontSize: "15px",
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
  style={{
    padding: "8px",
    fontSize: "15px",
    verticalAlign: "middle",
  }}
>

            {slPhaoPhu.toFixed(2)}
            {" "}
            md

          </td>

          <td
  className="border"
  style={{
    padding: "8px",
    fontSize: "15px",
    verticalAlign: "middle",
  }}
>

            {Number(
              cua.donGiaPhao || 0
            ).toLocaleString()}

          </td>

          <td
  className="border"
  style={{
    padding: "8px",
    fontWeight: "700",
    fontSize: "14px",
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
  style={{
    padding: "8px",
    fontSize: "15px",
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
  style={{
    padding: "8px",
    fontSize: "15px",
    verticalAlign: "middle",
  }}
>

            {slPhaoDinh.toFixed(2)}
            {" "}
            md

          </td>

          <td
  className="border"
  style={{
    padding: "8px",
    fontSize: "15px",
    verticalAlign: "middle",
  }}
>

  {tienPhaoDinh.toLocaleString()}

</td>

<td
  className="border"
  style={{
    padding: "8px",
    fontWeight: "700",
    fontSize: "14px",
    textAlign: "right",
    whiteSpace: "nowrap",
  }}
>

  {tienPhaoDinh.toLocaleString()}

</td>

        </tr>

      )}

      {cua.coBomForm && (

        <tr>

          <td
  className="border"
  style={{
    padding: "8px",
    fontSize: "15px",
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
  style={{
    padding: "8px",
    fontSize: "15px",
    verticalAlign: "middle",
  }}
>
            250,000
          </td>

          <td
  className="border"
  style={{
    padding: "8px",
    fontWeight: "700",
    fontSize: "14px",
    textAlign: "right",
    whiteSpace: "nowrap",
  }}
>
            250,000
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
  className="p-6"
  style={{
    textAlign: "right",
    pageBreakInside: "avoid",
    breakInside: "avoid",
  }}
>

            <p className="text-xl">
              Tổng cộng
            </p>

            <p
  style={{
    color: "#16a34a",
    fontSize:
      window.innerWidth < 768
        ? "34px"
        : "52px",
    fontWeight: "700",
    lineHeight: "1.1",
    wordBreak: "break-word",
  }}
>
style={{ color: "#16a34a" }}

              {tongCong.toLocaleString()} đ

            </p>

          </div>

          <div className="p-6">

            <div className="text-right italic">

              Ngày{" "}
              {new Date().getDate()}
              {" "}tháng{" "}
              {new Date().getMonth() + 1}
              {" "}năm{" "}
              {new Date().getFullYear()}

            </div>

            <div className="grid grid-cols-2 mt-20 text-center">

              <div>

                <p className="font-bold text-2xl uppercase">

                  Người lên đơn

                </p>

                <div className="h-32"></div>

                <p>{nhanVien}</p>

              </div>

              <div>

                <p className="font-bold text-2xl uppercase">

                  Người nhận hàng

                </p>

                <div className="h-32"></div>

                <p>
                  ______________
                </p>

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
                onClick={taiPDF}
                className="px-5 py-3 rounded-xl "
                style={{ color: "#ffffff" }}
                style={{ backgroundColor: "#ca8a04" }}
              >

                Tải PDF

              </button>

            </div>

          </div>

        </div>

      </div>

    );

  }
<style jsx global>{`
  @media print {
    .no-print {
      display: none !important;
    }
  }
`}</style>
  return (

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
                  {tinhSoLuongCua(
                    cua
                  ).toFixed(2)} m²

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
      {tinhPhaoPhu(
        cua
      ).toFixed(2)}
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

          {(
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
          ).toFixed(2)}

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
    "0 4px 10px rgba(37,99,235,0.3)"
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

  );

}