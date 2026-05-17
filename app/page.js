"use client";

import { useMemo, useState } from "react";

export default function Home() {

  const [xemHoaDon, setXemHoaDon] = useState(false);

  const [loaiCua, setLoaiCua] = useState("");

  const [rong, setRong] = useState("");
  const [cao, setCao] = useState("");

  const [khuon, setKhuon] = useState("");
  const [maMau, setMaMau] = useState("");
  const [huongMo, setHuongMo] = useState("");

  const [donGiaCua, setDonGiaCua] = useState("");

  const [coKhoa, setCoKhoa] = useState(true);

  const [tenKhoa, setTenKhoa] = useState("");
  

  const [slKhoa, setSlKhoa] = useState(1);
  const [giaKhoa, setGiaKhoa] = useState("");

 const [loaiPhao, setLoaiPhao] = useState("");

const [giaPhao, setGiaPhao] = useState("");

const [loaiPhaoDinh, setLoaiPhaoDinh] =
  useState("");

const [rongPhaoDung, setRongPhaoDung] =
  useState("");

const [giaPhaoDung, setGiaPhaoDung] =
  useState("");

const [caoPhaoNgang, setCaoPhaoNgang] =
  useState("");

const [giaPhaoNgang, setGiaPhaoNgang] =
  useState("");

const [caoPhaoDinh, setCaoPhaoDinh] =
  useState("");

const [giaPhaoDinh, setGiaPhaoDinh] =
  useState("");

  const [coBom, setCoBom] = useState(false);
  const taoHoaDonMoi = () => {

  setXemHoaDon(false);

  setLoaiCua("");

  setRong("");
  setCao("");

  setKhuon("");
  setMaMau("");
  setHuongMo("");

  setDonGiaCua("");

  setCoKhoa(true);

  setTenKhoa("");

  setSlKhoa(1);
  setGiaKhoa("");

  setLoaiPhao("");

setGiaPhao("");

setLoaiPhaoDinh("");

setRongPhaoDung("");
setGiaPhaoDung("");

setCaoPhaoNgang("");
setGiaPhaoNgang("");

setCaoPhaoDinh("");
setGiaPhaoDinh("");
  setGiaPhao("");

  setCoBom(false);

};

  const formatSo = (so) => {
    return parseFloat(so.toFixed(2)).toString();
  };

  const slCua = useMemo(() => {
    return Number(rong || 0) * Number(cao || 0);
  }, [rong, cao]);

  const tongCua =
    slCua * Number(donGiaCua || 0);

  const slPhaoPhu = useMemo(() => {

  const r = Number(rong || 0);
  const c = Number(cao || 0);

  const laCuaSo =
    loaiCua.toLowerCase().includes("sổ");

  if (laCuaSo) {
    return (r * 2) + (c * 2);
  }

  return r + (c * 2);

}, [rong, cao, loaiCua]);

const tongPhaoPhu =
  loaiPhao === "phao-phu"
    ? slPhaoPhu * Number(giaPhao || 0)
    : 0;

const slPhaoDinhTieuChuan =
  (Number(cao || 0) * 2) +
  (Number(rong || 0) + 0.5) +
  (Number(rong || 0) + 0.8);

const tongPhaoDinhTieuChuan =
  slPhaoDinhTieuChuan *
  Number(giaPhao || 0);

const coPhaoNgang =
  Number(caoPhaoNgang || 0) > 0;

const rongPhaoDungM =
  Number(rongPhaoDung || 0) / 100;

const caoPhaoNgangM =
  Number(caoPhaoNgang || 0) / 100;

const caoPhaoDinhM =
  Number(caoPhaoDinh || 0) / 100;

const coPhaoNgang =
  caoPhaoNgangM > 0;

const slPhaoDinhTuyChon =
  coPhaoNgang
    ? (
        (Number(cao || 0) * 2) +
        (
          Number(rong || 0) +
          rongPhaoDungM
        ) +
        (
          Number(rong || 0) +
          rongPhaoDungM +
          0.3
        )
      )
    : (
        (Number(cao || 0) * 2) +
        (
          Number(rong || 0) +
          rongPhaoDungM +
          0.3
        )
      );

const tongPhaoDinhTuyChon =
  (
    Number(cao || 0) *
    2 *
    Number(giaPhaoDung || 0)
  ) +
  (
    coPhaoNgang
      ? (
          Number(rong || 0) +
          rongPhaoDungM
        ) *
        Number(giaPhaoNgang || 0)
      : 0
  ) +
  (
    (
      Number(rong || 0) +
      rongPhaoDungM +
      0.3
    ) *
    Number(giaPhaoDinh || 0)
  );

const tongPhao =
  loaiPhao === "phao-phu"
    ? tongPhaoPhu
    : loaiPhaoDinh === "tieu-chuan"
    ? tongPhaoDinhTieuChuan
    : loaiPhaoDinh === "tuy-chon"
    ? tongPhaoDinhTuyChon
    : 0;

  const tongKhoa =
    coKhoa
      ? Number(slKhoa || 0) *
        Number(giaKhoa || 0)
      : 0;

  const tongBom = coBom ? 250000 : 0;

  const tongCong =
    tongCua +
    tongKhoa +
    tongPhao +
    tongBom;

  if (xemHoaDon) {
    return (
      <div className="p-4 bg-white min-h-screen">

        <div className="max-w-6xl mx-auto border">

          <div className="p-5 border-b">

            <h1 className="text-3xl font-bold">
              HÓA ĐƠN CỬA THÉP
            </h1>

          </div>

          <table className="w-full border-collapse">

            <thead>

              <tr className="bg-gray-100">

                <th className="border p-2">
                  Tên sản phẩm
                </th>

                <th className="border p-2">
                  Khuôn
                </th>

                <th className="border p-2">
                  Rộng
                </th>

                <th className="border p-2">
                  Cao
                </th>

                <th className="border p-2">
                  Màu
                </th>

                <th className="border p-2">
                  Hướng mở
                </th>

                <th className="border p-2">
                  Số lượng
                </th>

                <th className="border p-2">
                  Đơn giá
                </th>

                <th className="border p-2">
                  Thành tiền
                </th>

              </tr>

            </thead>

            <tbody>

              <tr>

                <td className="border p-2">
                  {loaiCua}
                </td>

                <td className="border p-2">
                  {khuon}
                </td>

                <td className="border p-2">
                  {rong}
                </td>

                <td className="border p-2">
                  {cao}
                </td>

                <td className="border p-2">
                  {maMau}
                </td>

                <td className="border p-2">
                  {huongMo}
                </td>

                <td className="border p-2">
                  {formatSo(slCua)}
                </td>

                <td className="border p-2">
                  {Number(
                    donGiaCua
                  ).toLocaleString()}
                </td>

                <td className="border p-2 font-bold">
                  {tongCua.toLocaleString()}
                </td>

              </tr>

              {coKhoa && (
                <tr>

                  <td className="border p-2">
                    {tenKhoa}
                  </td>

                  

                  <td
                    className="border p-2"
                    colSpan={5}
                  ></td>

                  <td className="border p-2">
                    {slKhoa}
                  </td>

                  <td className="border p-2">
                    {Number(
                      giaKhoa
                    ).toLocaleString()}
                  </td>

                  <td className="border p-2 font-bold">
                    {tongKhoa.toLocaleString()}
                  </td>

                </tr>
              )}

              {loaiPhao === "phao-phu" && (
  <tr>

    <td className="border p-2">
      Phào phụ
    </td>

    <td
      className="border p-2"
      colSpan={5}
    ></td>

    <td className="border p-2">
      {formatSo(slPhaoPhu)}
    </td>

    <td className="border p-2">
      {Number(
        giaPhao
      ).toLocaleString()}
    </td>

    <td className="border p-2 font-bold">
      {tongPhao.toLocaleString()}
    </td>

  </tr>
)}

{loaiPhao === "phao-dinh" &&
  loaiPhaoDinh === "tieu-chuan" && (
  <tr>

    <td className="border p-2">
      Phào đình tiêu chuẩn
    </td>

    <td
      className="border p-2"
      colSpan={5}
    ></td>

    <td className="border p-2">
      {formatSo(
        slPhaoDinhTieuChuan
      )}
    </td>

    <td className="border p-2">
      {Number(
        giaPhao
      ).toLocaleString()}
    </td>

    <td className="border p-2 font-bold">
      {tongPhao.toLocaleString()}
    </td>

  </tr>
)}

{loaiPhao === "phao-dinh" &&
  loaiPhaoDinh === "tuy-chon" && (
  <tr>

    <td className="border p-2">
      Phào đình tùy chọn
    </td>

    <td
      className="border p-2"
      colSpan={5}
    ></td>

    <td className="border p-2">
      {formatSo(
        slPhaoDinhTuyChon
      )}
    </td>

    <td className="border p-2">
      ---
    </td>

    <td className="border p-2 font-bold">
      {tongPhao.toLocaleString()}
    </td>

  </tr>
)}

              {coBom && (
                <tr>

                  <td className="border p-2">
                    Bơm Form
                  </td>

                  <td
                    className="border p-2"
                    colSpan={5}
                  ></td>

                  <td className="border p-2">
                    1
                  </td>

                  <td className="border p-2">
                    250,000
                  </td>

                  <td className="border p-2 font-bold">
                    250,000
                  </td>

                </tr>
              )}

            </tbody>

          </table>

          <div className="p-5 text-right">

            <h2 className="text-3xl font-bold text-green-600">

              Tổng cộng:
              {" "}
              {tongCong.toLocaleString()} đ

            </h2>

          </div>

          <div className="p-5 flex gap-3">

  <button
    onClick={() =>
      setXemHoaDon(false)
    }
    className="bg-black text-white px-5 py-3 rounded-2xl"
  >
    Quay lại
  </button>

  <button
    onClick={taoHoaDonMoi}
    className="bg-blue-600 text-white px-5 py-3 rounded-2xl"
  >
    Tạo hóa đơn mới
  </button>

</div>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">

      <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl p-5 space-y-5">

        <h1 className="text-2xl font-bold">
          Lên Đơn Cửa Thép
        </h1>

        <select
  value={loaiCua}
  className="w-full p-3 border rounded-xl"
  onChange={(e) =>
    setLoaiCua(e.target.value)
  }
>

          <option>Chọn loại cửa</option>

          <option>Cửa đơn</option>
          <option>Cửa 2 cánh</option>
          <option>Cửa 3 cánh</option>
          <option>Cửa 4 cánh</option>

          <option>Cửa sổ 1 cánh</option>
          <option>Cửa sổ 2 cánh</option>
          <option>Cửa sổ 3 cánh</option>
          <option>Cửa sổ 4 cánh</option>

        </select>

        <div className="grid grid-cols-2 gap-3">

          <input
            placeholder="Độ dày khuôn"
            value={khuon}
            className="p-3 border rounded-xl"
            onChange={(e) =>
              setKhuon(e.target.value)
            }
          />

          <input
            placeholder="Mã màu"
            value={maMau}
            className="p-3 border rounded-xl"
            onChange={(e) =>
              setMaMau(e.target.value)
            }
          />

          <input
            placeholder="Chiều rộng"
            value={rong}
            type="number"
            className="p-3 border rounded-xl"
            onChange={(e) =>
              setRong(e.target.value)
            }
          />

          <input
            placeholder="Chiều cao"
            value={cao}
            type="number"
            className="p-3 border rounded-xl"
            onChange={(e) =>
              setCao(e.target.value)
            }
          />

          <input
            placeholder="Hướng mở"
            value={huongMo}
            className="p-3 border rounded-xl"
            onChange={(e) =>
              setHuongMo(e.target.value)
            }
          />

          <input
            placeholder="Đơn giá cửa"
            value={donGiaCua}
            type="number"
            className="p-3 border rounded-xl"
            onChange={(e) =>
              setDonGiaCua(e.target.value)
            }
          />

        </div>

        <div className="bg-gray-100 p-4 rounded-2xl">

          <p>
            Số lượng:
            {" "}
            {formatSo(slCua)} m²
          </p>

          <p>
            Tổng cửa:
            {" "}
            {tongCua.toLocaleString()} đ
          </p>

        </div>

        <div className="space-y-3">

          <label className="flex gap-2">

            <input
              type="checkbox"
              checked={coKhoa}
              onChange={() =>
                setCoKhoa(!coKhoa)
              }
            />

            Có khóa

          </label>

          {coKhoa && (
            <>

              <input
                placeholder="Tên khóa"
                value={tenKhoa}
                className="w-full p-3 border rounded-xl"
                onChange={(e) =>
                  setTenKhoa(e.target.value)
                }
              />

              

              <div className="grid grid-cols-2 gap-3">

                <input
                  type="number"
                  placeholder="Số lượng"
                  className="p-3 border rounded-xl"
                  value={slKhoa}
                  onChange={(e) =>
                    setSlKhoa(e.target.value)
                  }
                />

                <input
                  type="number"
                  placeholder="Đơn giá"
                  value={giaKhoa}
                  className="p-3 border rounded-xl"
                  onChange={(e) =>
                    setGiaKhoa(e.target.value)
                  }
                />

              </div>

            </>
          )}

        </div>

        <div className="space-y-4">

  <h2 className="font-bold text-lg">
    Loại phào
  </h2>

  <div className="flex flex-col gap-3">

    <label className="flex gap-2">

      <input
        type="radio"
        checked={loaiPhao === "phao-phu"}
        onChange={() =>
          setLoaiPhao("phao-phu")
        }
      />

      Phào phụ

    </label>

    <label className="flex gap-2">

      <input
        type="radio"
        checked={loaiPhao === "phao-dinh"}
        onChange={() =>
          setLoaiPhao("phao-dinh")
        }
      />

      Phào đình

    </label>

  </div>

  {loaiPhao === "phao-phu" && (
    <div className="space-y-2">

      <p>
        Số lượng:
        {" "}
        {formatSo(slPhaoPhu)} md
      </p>

      <input
        type="number"
        placeholder="Đơn giá phào"
        value={giaPhao}
        className="w-full p-3 border rounded-xl"
        onChange={(e) =>
          setGiaPhao(e.target.value)
        }
      />

    </div>
  )}

  {loaiPhao === "phao-dinh" && (
    <div className="space-y-4">

      <label className="flex gap-2">

        <input
          type="radio"
          checked={
            loaiPhaoDinh === "tieu-chuan"
          }
          onChange={() =>
            setLoaiPhaoDinh(
              "tieu-chuan"
            )
          }
        />

        Phào đình tiêu chuẩn

      </label>

      <label className="flex gap-2">

        <input
          type="radio"
          checked={
            loaiPhaoDinh === "tuy-chon"
          }
          onChange={() =>
            setLoaiPhaoDinh(
              "tuy-chon"
            )
          }
        />

        Phào đình tùy chọn

      </label>

      {loaiPhaoDinh ===
        "tieu-chuan" && (
        <div className="space-y-2">

          <p>
            Phào đứng bản 25cm,
            Phào đỉnh 45cm
          </p>

          <p>
            Kích thước:
            {" "}
            {formatSo(
              slPhaoDinhTieuChuan
            )} md
          </p>

          <input
            type="number"
            placeholder="Đơn giá phào"
            value={giaPhao}
            className="w-full p-3 border rounded-xl"
            onChange={(e) =>
              setGiaPhao(e.target.value)
            }
          />

        </div>
      )}

      {loaiPhaoDinh ===
        "tuy-chon" && (
        <div className="space-y-3">

          <input
            type="number"
            placeholder="Chiều rộng phào đứng (cm)"
            value={rongPhaoDung}
            className="w-full p-3 border rounded-xl"
            onChange={(e) =>
              setRongPhaoDung(
                e.target.value
              )
            }
          />

          <input
            type="number"
            placeholder="Đơn giá phào đứng"
            value={giaPhaoDung}
            className="w-full p-3 border rounded-xl"
            onChange={(e) =>
              setGiaPhaoDung(
                e.target.value
              )
            }
          />

          <input
            type="number"
            placeholder="Chiều cao phào ngang (cm)"
            value={caoPhaoNgang}
            className="w-full p-3 border rounded-xl"
            onChange={(e) =>
              setCaoPhaoNgang(
                e.target.value
              )
            }
          />

          <input
            type="number"
            placeholder="Đơn giá phào ngang"
            value={giaPhaoNgang}
            className="w-full p-3 border rounded-xl"
            onChange={(e) =>
              setGiaPhaoNgang(
                e.target.value
              )
            }
          />

          <input
            type="number"
            placeholder="Chiều cao phào đỉnh (cm)"
            value={caoPhaoDinh}
            className="w-full p-3 border rounded-xl"
            onChange={(e) =>
              setCaoPhaoDinh(
                e.target.value
              )
            }
          />

          <input
            type="number"
            placeholder="Đơn giá phào đỉnh"
            value={giaPhaoDinh}
            className="w-full p-3 border rounded-xl"
            onChange={(e) =>
              setGiaPhaoDinh(
                e.target.value
              )
            }
          />

          <p>
            Kích thước:
            {" "}
            {formatSo(
              slPhaoDinhTuyChon
            )} md
          </p>

        </div>
      )}

    </div>
  )}

</div>

        <label className="flex gap-2">

          <input
            type="checkbox"
            checked={coBom}
            onChange={() =>
              setCoBom(!coBom)
            }
          />

          Có bơm Form (+250.000đ)

        </label>

        <div className="bg-black text-white p-5 rounded-3xl">

          <h2 className="text-xl font-bold">
            Tổng cộng
          </h2>

          <p className="text-3xl font-bold mt-2">
            {tongCong.toLocaleString()} đ
          </p>

        </div>

        <button
          onClick={() =>
            setXemHoaDon(true)
          }
          className="w-full bg-blue-600 text-white p-4 rounded-2xl text-lg font-bold"
        >
          Xem Hóa Đơn
        </button>

      </div>

    </div>
  );
}