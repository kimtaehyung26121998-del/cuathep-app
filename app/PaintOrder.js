"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";

const employees = [
  {
    name: "Nguyễn Tuấn Vũ",
    phone: "0335 952 952",
  },

  {
    name: "Nguyễn Ngọc Vinh",
    phone: "0356 197 836",
  },

  {
    name: "Nguyễn Văn Hướng",
    phone: "0345 109 555",
  },

  {
    name: "Nguyễn Ngọc Tân",
    phone: "0962 807 555",
  },

  {
    name: "Lương Văn Nhạn",
    phone: "0983 783 005",
  },

  {
    name: "Trần Trọng Tiến",
    phone: "0971 333 758",
  },
];

const products = [

  // SƠN LÓT KHÁNG KIỀM

  {
    vn: "Sơn lót chống kiềm nội thất",
    en: "MYKOLOR PASSION ALKALI PRIMER FOR INTERIOR",
    size: "4.375L",
    basePrice: 1130000,
    canMixColor: false,
  },

  {
    vn: "Sơn lót chống kiềm nội thất",
    en: "MYKOLOR PASSION ALKALI PRIMER FOR INTERIOR",
    size: "15L",
    basePrice: 3215000,
    canMixColor: false,
  },

  {
    vn: "Sơn lót chống kiềm ngoại thất",
    en: "MYKOLOR PASSION ALKALI PRIMER FOR EXTERIOR",
    size: "4.375L",
    basePrice: 1498000,
    canMixColor: false,
  },

  {
    vn: "Sơn lót chống kiềm ngoại thất",
    en: "MYKOLOR PASSION ALKALI PRIMER FOR EXTERIOR",
    size: "18L",
    basePrice: 5260000,
    canMixColor: false,
  },

  {
    vn: "Sơn lót chống thấm ngược",
    en: "MYKOLOR PASSION DAMP SEALER FOR EXTERIOR & INTERIOR",
    size: "4.375L",
    basePrice: 1845000,
    canMixColor: false,
  },

  {
    vn: "Sơn lót siêu kháng kiềm ngoại thất",
    en: "MYKOLOR PASSION SUPREME PRIMER FOR EXTERIOR",
    size: "4.375L",
    basePrice: 1560000,
    canMixColor: false,
  },

  {
    vn: "Sơn lót siêu kháng kiềm ngoại thất",
    en: "MYKOLOR PASSION SUPREME PRIMER FOR EXTERIOR",
    size: "18L",
    basePrice: 5700000,
    canMixColor: false,
  },

  // NỘI THẤT

  {
    vn: "Sơn nước nội thất bóng mờ cao cấp",
    en: "MYKOLOR PASSION SILKY MATTE FOR INTERIOR - WHITE",
    size: "4.375L",
    basePrice: 1760000,
    canMixColor: true,
  },

  {
    vn: "Sơn nước nội thất bóng mờ cao cấp",
    en: "MYKOLOR PASSION SILKY MATTE FOR INTERIOR - WHITE",
    size: "15L",
    basePrice: 5525000,
    canMixColor: true,
  },

  {
    vn: "Sơn nước nội thất mờ",
    en: "MYKOLOR PASSION SOFT SILK - WHITE",
    size: "4.375L",
    basePrice: 886000,
    canMixColor: true,
  },

  {
    vn: "Sơn nước nội thất mờ",
    en: "MYKOLOR PASSION SOFT SILK - WHITE",
    size: "15L",
    basePrice: 2350000,
    canMixColor: true,
  },

  {
    vn: "Sơn nước nội thất cao cấp mùi tự nhiên",
    en: "MYKOLOR PASSION SATIN SILK - WHITE",
    size: "4.375L",
    basePrice: 2532000,
    canMixColor: true,
  },

  {
    vn: "Sơn trần trắng sáng cao cấp",
    en: "MYKOLOR PASSION CEILING PREMIUM",
    size: "4.375L",
    basePrice: 1145000,
    canMixColor: false,
  },

  {
    vn: "Sơn trần trắng sáng cao cấp",
    en: "MYKOLOR PASSION CEILING PREMIUM",
    size: "15L",
    basePrice: 3405000,
    canMixColor: false,
  },

  {
    vn: "Sơn nước nội thất bóng sang trọng",
    en: "MYKOLOR PASSION VIVID SHINE FOR INTERIOR - WHITE",
    size: "1L",
    basePrice: 446000,
    canMixColor: true,
  },
  {
    vn: "Sơn nước nội thất bóng sang trọng",
    en: "MYKOLOR PASSION VIVID SHINE FOR INTERIOR - WHITE",
    size: "4.375L",
    basePrice: 2115000,
    canMixColor: true,
  },

  {
    vn: "Sơn nước nội thất bóng sang trọng",
    en: "MYKOLOR PASSION VIVID SHINE FOR INTERIOR - WHITE",
    size: "15L",
    basePrice: 6450000,
    canMixColor: true,
  },

  // NGOẠI THẤT

  {
    vn: "Sơn nước ngoại thất bóng nhẹ",
    en: "MYKOLOR PASSION CHIFFON",
    size: "4.375L",
    basePrice: 1968000,
    canMixColor: true,
  },

  {
    vn: "Sơn nước ngoại thất bóng nhẹ",
    en: "MYKOLOR PASSION CHIFFON",
    size: "18L",
    basePrice: 6445000,
    canMixColor: true,
  },

  {
    vn: "Sơn nước ngoại thất bóng cao cấp",
    en: "MYKOLOR PASSION SILKY FOR EXTERIOR - WHITE",
    size: "0.875L",
    basePrice: 639000,
    canMixColor: true,
  },

  {
    vn: "Sơn nước ngoại thất bóng cao cấp",
    en: "MYKOLOR PASSION SILKY FOR EXTERIOR - WHITE",
    size: "4.375L",
    basePrice: 2735000,
    canMixColor: true,
  },

  {
    vn: "Sơn nước ngoại thất bóng cao cấp",
    en: "MYKOLOR PASSION SILKY FOR EXTERIOR - WHITE",
    size: "15L",
    basePrice: 7540000,
    canMixColor: true,
  },

  {
    vn: "Sơn ngoại thất cao cấp siêu bóng",
    en: "MYKOLOR PASSION ROYALSILK - WHITE",
    size: "0.875L",
    basePrice: 965000,
    canMixColor: true,
  },

  {
    vn: "Sơn ngoại thất cao cấp siêu bóng",
    en: "MYKOLOR PASSION ROYALSILK - WHITE",
    size: "4.375L",
    basePrice: 3695000,
    canMixColor: true,
  },

  {
    vn: "Sơn ngoại thất chống phai màu tối đa",
    en: "MYKOLOR PASSION UV SCREEN FOR EXTERIOR - WHITE",
    size: "0.875L",
    basePrice: 1045000,
    canMixColor: true,
  },

  {
    vn: "Sơn ngoại thất chống phai màu tối đa",
    en: "MYKOLOR PASSION UV SCREEN FOR EXTERIOR - WHITE",
    size: "4.375L",
    basePrice: 4025000,
    canMixColor: true,
  },

  // CHỐNG THẤM

  {
    vn: "Sơn chống thấm cao cấp Mykolor",
    en: "MYKOLOR PASSION WATER SEAL - WHITE",
    size: "3.5L",
    basePrice: 1365000,
    canMixColor: true,
  },

  {
    vn: "Sơn chống thấm cao cấp Mykolor",
    en: "MYKOLOR PASSION WATER SEAL - WHITE",
    size: "15L",
    basePrice: 5320000,
    canMixColor: true,
  },

  {
    vn: "Sơn chống thấm gốc xi măng",
    en: "MYKOLOR PASSION WATERPROOF CEMENT-BASED",
    size: "4.375L",
    basePrice: 1440000,
    canMixColor: false,
  },

  {
    vn: "Sơn chống thấm gốc xi măng",
    en: "MYKOLOR PASSION WATERPROOF CEMENT-BASED",
    size: "18L",
    basePrice: 5945000,
    canMixColor: false,
  },

  {
    vn: "Sơn chống thấm nhà liền kề màu ghi",
    en: "MYKOLOR PASSION TOWNHOUSE DYNAMIC FOR EXTERIOR",
    size: "3.5L",
    basePrice: 1160000,
    canMixColor: false,
  },

  {
    vn: "Sơn chống thấm nhà liền kề màu ghi",
    en: "MYKOLOR PASSION TOWNHOUSE DYNAMIC FOR EXTERIOR",
    size: "15L",
    basePrice: 4385000,
    canMixColor: false,
  },

  // BỘT BẢ

  {
    vn: "Bột trét tường nội thất cao cấp",
    en: "MYKOLOR HI-FILLER FOR INTERIOR",
    size: "20KG",
    basePrice: 608000,
    canMixColor: false,
  },

  {
    vn: "Bột trét tường ngoại thất cao cấp",
    en: "MYKOLOR HI-FILLER FOR EXTERIOR",
    size: "20KG",
    basePrice: 760000,
    canMixColor: false,
  },

  {
    vn: "Bột trét tường nội thất chất lượng cao",
    en: "MYKOLOR HI-Q FILLER FOR INTERIOR",
    size: "23KG",
    basePrice: 410000,
    canMixColor: false,
  },

  {
    vn: "Bột trét tường nội thất chất lượng cao",
    en: "MYKOLOR HI-Q FILLER FOR INTERIOR",
    size: "40KG",
    basePrice: 710000,
    canMixColor: false,
  },

  {
    vn: "Bột trét tường nội và ngoại thất",
    en: "MYKOLOR PREMIUM POWDER PUTTY FOR INTERIOR & EXTERIOR",
    size: "23KG",
    basePrice: 475000,
    canMixColor: false,
  },

  {
    vn: "Bột trét tường nội và ngoại thất",
    en: "MYKOLOR PREMIUM POWDER PUTTY FOR INTERIOR & EXTERIOR",
    size: "40KG",
    basePrice: 820000,
    canMixColor: false,
  },

  {
    vn: "Bột trét tường ngoại thất chất lượng cao",
    en: "MYKOLOR HI-Q FILLER FOR EXTERIOR",
    size: "40KG",
    basePrice: 910000,
    canMixColor: false,
  },

  // GOLD-X

  {
    vn: "Sơn lót chống kiềm nội thất GOLD-X",
    en: "GOLD-X ALKALI SEAL FOR INTERIOR",
    size: "15L",
    basePrice: 1382000,
    canMixColor: false,
  },

  {
    vn: "Sơn lót chống kiềm ngoại thất GOLD-X",
    en: "GOLD-X ALKALI SEAL FOR EXTERIOR",
    size: "15L",
    basePrice: 1890000,
    canMixColor: false,
  },

  {
    vn: "Sơn nước trong nhà GOLD-X",
    en: "GOLD-X FOR INTERIOR",
    size: "15L",
    basePrice: 705000,
    canMixColor: true,
  },
];
const forichProducts = [
  {
  vn: "R65 - SEALER PRO",
  en: "Sơn lót kháng kiềm nội thất cao cấp",
  size: "5L",
  basePrice: 750000,
  canMixColor: false,
  type: "interior-primer",
},

{
  vn: "R65 - SEALER PRO",
  en: "Sơn lót kháng kiềm nội thất cao cấp",
  size: "18L",
  basePrice: 2450000,
  canMixColor: false,
  type: "interior-primer",
},

{
  vn: "R85 - ULTRA PRIMER",
  en: "Sơn lót siêu kháng kiềm ngoại thất đặc biệt",
  size: "5L",
  basePrice: 1350000,
  canMixColor: false,
  type: "exterior-primer",
},

{
  vn: "R85 - ULTRA PRIMER",
  en: "Sơn lót siêu kháng kiềm ngoại thất đặc biệt",
  size: "18L",
  basePrice: 4200000,
  canMixColor: false,
  type: "exterior-primer",
},

{
  vn: "R85(R90) - ULTRA PRIMER",
  en: "Sơn lót siêu kháng kiềm ngoại thất đặc biệt",
  size: "5L",
  basePrice: 1850000,
  canMixColor: false,
  type: "exterior-primer",
},

{
  vn: "R68 - SAPPHIRE",
  en: "Sơn bóng ngọc trai nội thất cao cấp",
  size: "5L",
  basePrice: 1250000,
  canMixColor: true,
  type: "interior",
},

{
  vn: "R68 - SAPPHIRE",
  en: "Sơn bóng ngọc trai nội thất cao cấp",
  size: "15L",
  basePrice: 3380000,
  canMixColor: true,
  type: "interior",
},

{
  vn: "R69 - PLATINUM",
  en: "Sơn siêu bóng nội thất cao cấp 7 in 1",
  size: "1L",
  basePrice: 395000,
  canMixColor: true,
  type: "interior",
},

{
  vn: "R69 - PLATINUM",
  en: "Sơn siêu bóng nội thất cao cấp 7 in 1",
  size: "5L",
  basePrice: 1580000,
  canMixColor: true,
  type: "interior",
},

{
  vn: "R69 - PLATINUM",
  en: "Sơn siêu bóng nội thất cao cấp 7 in 1",
  size: "15L",
  basePrice: 4050000,
  canMixColor: true,
  type: "interior",
},

{
  vn: "R69(NC99) - PLATINUM",
  en: "Sơn siêu bóng nội thất cao cấp 7 in 1",
  size: "1L",
  basePrice: 455000,
  canMixColor: true,
  type: "interior",
},

{
  vn: "R69(NC99) - PLATINUM",
  en: "Sơn siêu bóng nội thất cao cấp 7 in 1",
  size: "5L",
  basePrice: 1750000,
  canMixColor: true,
  type: "interior",
},

{
  vn: "R69(NC99) - PLATINUM",
  en: "Sơn siêu bóng nội thất cao cấp 7 in 1",
  size: "15L",
  basePrice: 4880000,
  canMixColor: true,
  type: "interior",
},

{
  vn: "R66 - SUPER WHITE",
  en: "Sơn siêu trắng trần nội thất cao cấp",
  size: "5L",
  basePrice: 1300000,
  canMixColor: false,
  type: "interior",
},

{
  vn: "R66 - SUPER WHITE",
  en: "Sơn siêu trắng trần nội thất cao cấp",
  size: "15L",
  basePrice: 3550000,
  canMixColor: false,
  type: "interior",
},

{
  vn: "R86(R35) - TITANIUM",
  en: "Sơn bóng ngọc trai ngoại thất cao cấp",
  size: "5L",
  basePrice: 1550000,
  canMixColor: true,
  type: "exterior",
},

{
  vn: "R86(R35) - TITANIUM",
  en: "Sơn bóng ngọc trai ngoại thất cao cấp",
  size: "15L",
  basePrice: 4150000,
  canMixColor: true,
  type: "exterior",
},

{
  vn: "R86 - TITANIUM",
  en: "Sơn siêu bóng men sứ ngoại thất cao cấp 8 in 1",
  size: "1L",
  basePrice: 500000,
  canMixColor: true,
  type: "exterior",
},

{
  vn: "R86 - TITANIUM",
  en: "Sơn siêu bóng men sứ ngoại thất cao cấp 8 in 1",
  size: "5L",
  basePrice: 1980000,
  canMixColor: true,
  type: "exterior",
},

{
  vn: "R86 - TITANIUM",
  en: "Sơn siêu bóng men sứ ngoại thất cao cấp 8 in 1",
  size: "15L",
  basePrice: 4980000,
  canMixColor: true,
  type: "exterior",
},

{
  vn: "R88 - SUPERSHIELD",
  en: "Sơn siêu bóng ngoại thất kháng bám bẩn đặc biệt",
  size: "1L",
  basePrice: 750000,
  canMixColor: true,
  type: "exterior",
},

{
  vn: "R88 - SUPERSHIELD",
  en: "Sơn siêu bóng ngoại thất kháng bám bẩn đặc biệt",
  size: "5L",
  basePrice: 2880000,
  canMixColor: true,
  type: "exterior",
},

{
  vn: "FCP - CLEAR PAINT",
  en: "Sơn siêu bóng phủ trang trí Clear",
  size: "1L",
  basePrice: 480000,
  canMixColor: false,
  type: "exterior",
},

{
  vn: "FCP - CLEAR PAINT",
  en: "Sơn siêu bóng phủ trang trí Clear",
  size: "5L",
  basePrice: 1750000,
  canMixColor: false,
  type: "exterior",
},

{
  vn: "R11A - WATERPROOF",
  en: "Sơn chống thấm kết hợp xi măng cao cấp",
  size: "5L",
  basePrice: 1280000,
  canMixColor: false,
  type: "waterproof",
},

{
  vn: "R11A - WATERPROOF",
  en: "Sơn chống thấm kết hợp xi măng cao cấp",
  size: "18L",
  basePrice: 4250000,
  canMixColor: false,
  type: "waterproof",
},

{
  vn: "R11M - COLORSHIELD",
  en: "Sơn chống thấm pha màu cao cấp",
  size: "5L",
  basePrice: 1500000,
  canMixColor: true,
  type: "waterproof",
},

{
  vn: "R11M - COLORSHIELD",
  en: "Sơn chống thấm pha màu cao cấp",
  size: "18L",
  basePrice: 4750000,
  canMixColor: true,
  type: "waterproof",
},

{
  vn: "BCC",
  en: "Bột bả chống thấm đặc biệt nội & ngoại thất",
  size: "20KG",
  basePrice: 420000,
  canMixColor: false,
  type: "putty",
},

{
  vn: "VAB",
  en: "Bột bả ngoại thất cao cấp",
  size: "40KG",
  basePrice: 400000,
  canMixColor: false,
  type: "putty",
},

{
  vn: "F500 - PRIMER",
  en: "Sơn lót kháng kiềm nội thất",
  size: "5L",
  basePrice: 305000,
  canMixColor: false,
  type: "interior-primer",
},

{
  vn: "F500 - PRIMER",
  en: "Sơn lót kháng kiềm nội thất",
  size: "18L",
  basePrice: 950000,
  canMixColor: false,
  type: "interior-primer",
},

{
  vn: "F600 - SEALER",
  en: "Sơn lót kháng kiềm ngoại thất",
  size: "5L",
  basePrice: 550000,
  canMixColor: false,
  type: "exterior-primer",
},

{
  vn: "F600 - SEALER",
  en: "Sơn lót kháng kiềm ngoại thất",
  size: "15L",
  basePrice: 1650000,
  canMixColor: false,
  type: "exterior-primer",
},

{
  vn: "F100 - INTERIOR",
  en: "Sơn siêu mịn nội thất cao cấp",
  size: "5L",
  basePrice: 270000,
  canMixColor: true,
  type: "interior",
},

{
  vn: "F100 - INTERIOR",
  en: "Sơn siêu mịn nội thất cao cấp",
  size: "18L",
  basePrice: 830000,
  canMixColor: true,
  type: "interior",
},

{
  vn: "F800 - EXTERIOR",
  en: "Sơn siêu mịn ngoại thất cao cấp",
  size: "1L",
  basePrice: 590000,
  canMixColor: true,
  type: "exterior",
},

{
  vn: "F800 - EXTERIOR",
  en: "Sơn siêu mịn ngoại thất cao cấp",
  size: "15L",
  basePrice: 1830000,
  canMixColor: true,
  type: "exterior",
},
];
const sunproProducts = [

  {
    vn: "SUN65 - SEALER PRO",
    en: "Sơn lót kháng kiềm nội thất cao cấp",
    size: "5L",
    basePrice: 760000,
    canMixColor: false,
    type: "interior-primer",
  },

  {
    vn: "SUN65 - SEALER PRO",
    en: "Sơn lót kháng kiềm nội thất cao cấp",
    size: "18L",
    basePrice: 2460000,
    canMixColor: false,
    type: "interior-primer",
  },

  {
    vn: "SUN65 (A656) - SEALER PRO",
    en: "Sơn lót kháng kiềm nội thất cao cấp",
    size: "5L",
    basePrice: 1010000,
    canMixColor: false,
    type: "interior-primer",
  },

  {
    vn: "SUN65 (A656) - SEALER PRO",
    en: "Sơn lót kháng kiềm nội thất cao cấp",
    size: "18L",
    basePrice: 3310000,
    canMixColor: false,
    type: "interior-primer",
  },

  {
    vn: "SUN68 - SEMI GLOSS",
    en: "Sơn bóng SEMI nội thất cao cấp",
    size: "5L",
    basePrice: 1185000,
    canMixColor: true,
    type: "interior",
  },

  {
    vn: "SUN68 - SEMI GLOSS",
    en: "Sơn bóng SEMI nội thất cao cấp",
    size: "18L",
    basePrice: 3755000,
    canMixColor: true,
    type: "interior",
  },

  {
    vn: "SUN69 - SUPER GLOSS",
    en: "Sơn bóng nội thất cao cấp",
    size: "1L",
    basePrice: 425000,
    canMixColor: true,
    type: "interior",
  },

  {
    vn: "SUN69 - SUPER GLOSS",
    en: "Sơn bóng nội thất cao cấp",
    size: "5L",
    basePrice: 1505000,
    canMixColor: true,
    type: "interior",
  },

  {
    vn: "SUN69 - SUPER GLOSS",
    en: "Sơn bóng nội thất cao cấp",
    size: "18L",
    basePrice: 4935000,
    canMixColor: true,
    type: "interior",
  },

  {
    vn: "SUN99 - TITANIUM",
    en: "Sơn bóng cao cấp nội thất đặc biệt",
    size: "1L",
    basePrice: 525000,
    canMixColor: true,
    type: "interior",
  },

  {
    vn: "SUN99 - TITANIUM",
    en: "Sơn bóng cao cấp nội thất đặc biệt",
    size: "5L",
    basePrice: 1795000,
    canMixColor: true,
    type: "interior",
  },

  {
    vn: "SUN99 - TITANIUM",
    en: "Sơn bóng cao cấp nội thất đặc biệt",
    size: "15L",
    basePrice: 5285000,
    canMixColor: true,
    type: "interior",
  },

  {
    vn: "SUN66 - SUPER WHITE",
    en: "Sơn siêu trắng trần nội thất cao cấp",
    size: "5L",
    basePrice: 805000,
    canMixColor: false,
    type: "interior",
  },

  {
    vn: "SUN66 - SUPER WHITE",
    en: "Sơn siêu trắng trần nội thất cao cấp",
    size: "18L",
    basePrice: 2660000,
    canMixColor: false,
    type: "interior",
  },

  {
    vn: "SUN66 (A706) - SUPER WHITE",
    en: "Sơn siêu trắng trần nội thất cao cấp",
    size: "5L",
    basePrice: 1240000,
    canMixColor: false,
    type: "interior",
  },

  {
    vn: "SUN66 (A706) - SUPER WHITE",
    en: "Sơn siêu trắng trần nội thất cao cấp",
    size: "18L",
    basePrice: 4080000,
    canMixColor: false,
    type: "interior",
  },

  {
    vn: "SUN85 - ULTRA PRIMER",
    en: "Sơn lót kháng kiềm ngoại thất cao cấp",
    size: "5L",
    basePrice: 1145000,
    canMixColor: false,
    type: "exterior-primer",
  },

  {
    vn: "SUN85 - ULTRA PRIMER",
    en: "Sơn lót kháng kiềm ngoại thất cao cấp",
    size: "18L",
    basePrice: 3695000,
    canMixColor: false,
    type: "exterior-primer",
  },

  {
    vn: "SUN85 (A696) - ULTRA PRIMER",
    en: "Sơn lót kháng kiềm ngoại thất cao cấp",
    size: "5L",
    basePrice: 1405000,
    canMixColor: false,
    type: "exterior-primer",
  },

  {
    vn: "SUN85 (A696) - ULTRA PRIMER",
    en: "Sơn lót kháng kiềm ngoại thất cao cấp",
    size: "18L",
    basePrice: 4630000,
    canMixColor: false,
    type: "exterior-primer",
  },

  {
    vn: "SUN86 - WEATHER SUN",
    en: "Sơn siêu bóng ngoại thất cao cấp",
    size: "1L",
    basePrice: 515000,
    canMixColor: true,
    type: "exterior",
  },

  {
    vn: "SUN86 - WEATHER SUN",
    en: "Sơn siêu bóng ngoại thất cao cấp",
    size: "5L",
    basePrice: 1800000,
    canMixColor: true,
    type: "exterior",
  },

  {
    vn: "SUN86 - WEATHER SUN",
    en: "Sơn siêu bóng ngoại thất cao cấp",
    size: "18L",
    basePrice: 5755000,
    canMixColor: true,
    type: "exterior",
  },

  {
    vn: "SUN88 - PLATINUM (NEW)",
    en: "Sơn bóng cao cấp ngoại thất đặc biệt",
    size: "1L",
    basePrice: 705000,
    canMixColor: true,
    type: "exterior",
  },

  {
    vn: "SUN88 - PLATINUM (NEW)",
    en: "Sơn bóng cao cấp ngoại thất đặc biệt",
    size: "5L",
    basePrice: 2470000,
    canMixColor: true,
    type: "exterior",
  },

  {
    vn: "SUN88 - PLATINUM (NEW)",
    en: "Sơn bóng cao cấp ngoại thất đặc biệt",
    size: "15L",
    basePrice: 7320000,
    canMixColor: true,
    type: "exterior",
  },

  {
    vn: "SUN33 - CLEAR PAINT",
    en: "Sơn siêu bóng phủ trang trí Clear",
    size: "1L",
    basePrice: 460000,
    canMixColor: false,
    type: "exterior",
  },

  {
    vn: "SUN33 - CLEAR PAINT",
    en: "Sơn siêu bóng phủ trang trí Clear",
    size: "5L",
    basePrice: 1525000,
    canMixColor: false,
    type: "exterior",
  },

  {
    vn: "SUN11A - WATERPROOF",
    en: "Sơn chống thấm trộn xi măng cao cấp",
    size: "5L",
    basePrice: 1200000,
    canMixColor: false,
    type: "waterproof",
  },

  {
    vn: "SUN11A - WATERPROOF",
    en: "Sơn chống thấm trộn xi măng cao cấp",
    size: "18L",
    basePrice: 3895000,
    canMixColor: false,
    type: "waterproof",
  },

  {
    vn: "SUN12A - COLOR WATERPROOF",
    en: "Sơn chống thấm pha màu cao cấp",
    size: "5L",
    basePrice: 1450000,
    canMixColor: true,
    type: "waterproof",
  },

  {
    vn: "SUN12A - COLOR WATERPROOF",
    en: "Sơn chống thấm pha màu cao cấp",
    size: "18L",
    basePrice: 4695000,
    canMixColor: true,
    type: "waterproof",
  },

  {
    vn: "BCC",
    en: "Bột bả chống thấm đặc biệt nội & ngoại thất",
    size: "20KG",
    basePrice: 490000,
    canMixColor: false,
    type: "putty",
  },

  {
    vn: "BCC",
    en: "Bột bả chống thấm đặc biệt nội & ngoại thất",
    size: "40KG",
    basePrice: 980000,
    canMixColor: false,
    type: "putty",
  },

];

export default function PaintOrder({ initialBrand = "select", onBack }) {
  const invoiceRef = useRef(null);
  const [keyword, setKeyword] = useState("");

  const [customerName, setCustomerName] =
    useState("");

  const [customerAddress, setCustomerAddress] =
    useState("");
    const [discountPercent, setDiscountPercent] =
  useState(0);

const [customerDeposit, setCustomerDeposit] =
  useState(0);

  const [selectedEmployee, setSelectedEmployee] =
  useState(null);
  const [brand, setBrand] = useState(initialBrand);

  const [orderItems, setOrderItems] = useState([]);
  const [invoiceImage, setInvoiceImage] = useState("");
  const [invoiceFileName, setInvoiceFileName] = useState("");
  const [isCreatingImage, setIsCreatingImage] = useState(false);
  const [savedOrders, setSavedOrders] = useState([]);
  const [showSavedOrders, setShowSavedOrders] = useState(false);

  useEffect(() => {
    try {
      const savedOrders = JSON.parse(localStorage.getItem("order_archive_v1") || "[]");
      setSavedOrders(Array.isArray(savedOrders) ? savedOrders : []);
    } catch {
      setSavedOrders([]);
    }
  }, []);

  const paintSavedOrders = savedOrders.filter((order) =>
    order?.type === "son" && (!selectedEmployee?.name || order.employee === selectedEmployee.name)
  );

  const savePaintOrder = () => {
    if (!selectedEmployee?.name) {
      alert("Vui lòng chọn nhân viên trước khi lưu đơn.");
      return;
    }
    const saved = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      type: "son",
      brand,
      employee: selectedEmployee.name,
      customer: customerName || "Khách chưa đặt tên",
      createdAt: new Date().toISOString(),
      selectedEmployee,
      customerName,
      customerAddress,
      discountPercent,
      customerDeposit,
      orderItems,
    };
    const next = [saved, ...savedOrders];
    localStorage.setItem("order_archive_v1", JSON.stringify(next));
    setSavedOrders(next);
    alert("Đã lưu đơn sơn vào kho lưu trữ của nhân viên.");
  };

  const openSavedPaintOrder = (saved) => {
    setBrand(saved.brand || initialBrand);
    setSelectedEmployee(saved.selectedEmployee || employees.find((emp) => emp.name === saved.employee) || null);
    setCustomerName(saved.customerName || "");
    setCustomerAddress(saved.customerAddress || "");
    setDiscountPercent(saved.discountPercent || 0);
    setCustomerDeposit(saved.customerDeposit || 0);
    setOrderItems(Array.isArray(saved.orderItems) ? saved.orderItems : []);
  };

  const deleteSavedPaintOrder = (id) => {
    const next = savedOrders.filter((order) => order.id !== id);
    localStorage.setItem("order_archive_v1", JSON.stringify(next));
    setSavedOrders(next);
  };

 const currentProducts =
  brand === "forich"
    ? forichProducts
    : brand === "sunpro"
    ? sunproProducts
    : products;
  const filteredProducts = useMemo(() => {
    return currentProducts.filter((product) =>
      `${product.vn} ${product.en}`
        .toLowerCase()
        .includes(keyword.toLowerCase())
    );
  }, [keyword, brand]);

  const addProduct = (product) => {

  setOrderItems([
    
    {
      vn: product.vn,
      en: product.en,
      size: product.size,
      type: product.type,

      qty: 1,

      basePrice: product.basePrice,

      finalPrice: 0,

      colorPrice: 0,

      colorCode: "",

      canMixColor: product.canMixColor,
    },
    ...orderItems,
  ]);

  setKeyword("");
};

  const updateItem = (
    index,
    field,
    value
  ) => {

    const updated = [...orderItems];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    if (
  field === "qty" &&
  value < 0
) {
  updated[index].qty = 0;
}

    if (field === "finalPrice") {

      updated[index].colorPrice =
        Math.max(
          0,
          Number(value) -
          updated[index].basePrice
        );

    }
    if (
  (
    brand === "forich" ||
    brand === "sunpro"
  ) &&
  field === "colorCode"
) {

  const item =
    updated[index];

  const colorPrice =
  brand === "sunpro"
    ? getSunproColorPrice(
        value,
        item.size
      )
    : getForichColorPrice(
        value,
        item.size,
        item.type || ""
      );

  updated[index].colorPrice =
    colorPrice;

  updated[index].finalPrice =
    item.basePrice + colorPrice;

}

    setOrderItems(updated);
  };

  const groupedItems = Object.values(

  orderItems.reduce((acc, item) => {

    const key =
      `${item.en}-${item.size}-${item.colorCode}`;

    if (!acc[key]) {

      acc[key] = {
        ...item,
      };

    } else {

      acc[key].qty += item.qty;

    }

    return acc;

  }, {})

);
  const total = orderItems.reduce((sum, item) => {

  if (item.finalPrice === 0) {
    return sum + (item.basePrice * item.qty);
  }

  return (
    sum +
    item.finalPrice * item.qty
  );

}, 0);
const finalAfterDiscount =
  total *
  ((100 - discountPercent) / 100);

const remainingPayment =
  finalAfterDiscount -
  customerDeposit;
  const getForichColorPrice = (
  code,
  size,
  type
) => {

  const match =
    code.match(/AP(\d+)-(\d)/i);

  if (!match) return 0;

  const number =
    Number(match[1]);

  const last =
    Number(match[2]);

  const isInterior =
    type.includes("interior");

  if (
    number >= 1 &&
    number <= 14
  ) {

    if (size === "1L") return 3500;
    if (size === "5L") return 15000;
    if (size === "15L" || size === "18L") return 50000;

  }

  if (
    number >= 15 &&
    number <= 22
  ) {

    if (size === "1L") return 5000;
    if (size === "5L") return 22000;
    if (size === "15L" || size === "18L") return 70000;

  }

  if (
    number >= 23 &&
    number <= 152 &&
    [1,2,6].includes(last)
  ) {

    if (isInterior) {

      if (size === "1L") return 14000;
      if (size === "5L") return 60000;
      if (size === "15L" || size === "18L") return 190000;

    } else {

      if (size === "1L") return 6500;
      if (size === "5L") return 33500;
      if (size === "15L" || size === "18L") return 100000;

    }

  }

  if (
    number >= 23 &&
    number <= 152 &&
    [3,5].includes(last)
  ) {

    if (isInterior) {

      if (size === "1L") return 20000;
      if (size === "5L") return 85000;
      if (size === "15L" || size === "18L") return 270000;

    } else {

      if (size === "1L") return 22000;
      if (size === "5L") return 100000;
      if (size === "15L" || size === "18L") return 355000;

    }

  }

  if (
    number >= 23 &&
    number <= 152 &&
    last === 4
  ) {

    if (isInterior) {

      if (size === "1L") return 30000;
      if (size === "5L") return 135000;
      if (size === "15L" || size === "18L") return 395000;

    } else {

      if (size === "1L") return 26500;
      if (size === "5L") return 132500;
      if (size === "15L" || size === "18L") return 420000;

    }

  }

  if (
    number >= 153 &&
    number <= 171
  ) {

    if (size === "1L") return 36000;
    if (size === "5L") return 180000;
    if (size === "15L" || size === "18L") return 540000;

  }

  return 0;
};
const getSunproColorPrice = (
  code,
  size
) => {

  const match =
    code.match(/AP(\d+)-(\d)/i);

  if (!match) return 0;

  const number =
    Number(match[1]);

  const last =
    Number(match[2]);

  if (
    number >= 1 &&
    number <= 14
  ) {

    if (size === "1L") return 3000;
    if (size === "5L") return 14000;
    if (size === "15L" || size === "18L") return 50000;

  }

  if (
    number >= 15 &&
    number <= 22
  ) {

    if (size === "1L") return 4000;
    if (size === "5L") return 20000;
    if (size === "15L" || size === "18L") return 70000;

  }

  if (
    number >= 23 &&
    number <= 152 &&
    [1,2,6].includes(last)
  ) {

    if (size === "1L") return 6000;
    if (size === "5L") return 31000;
    if (size === "15L" || size === "18L") return 100000;

  }

  if (
    number >= 23 &&
    number <= 152 &&
    [3,5].includes(last)
  ) {

    if (size === "1L") return 20000;
    if (size === "5L") return 100000;
    if (size === "15L" || size === "18L") return 360000;

  }

  if (
    number >= 23 &&
    number <= 152 &&
    last === 4
  ) {

    if (size === "1L") return 25000;
    if (size === "5L") return 125000;
    if (size === "15L" || size === "18L") return 450000;

  }

  if (
    number >= 153 &&
    number <= 171
  ) {

    if (size === "1L") return 33500;
    if (size === "5L") return 167000;
    if (size === "15L" || size === "18L") return 600000;

  }

  return 0;
};
const saveInvoiceImage = async () => {

  if (!invoiceRef.current) return;

  const imageWindow = null;

  // Mở tab ngay trong thao tác click để trình duyệt không chặn sau khi
  // html2canvas hoàn tất bất đồng bộ.

  try {
    if (document.fonts?.ready) await document.fonts.ready;

    const dataUrl = await toPng(invoiceRef.current, {
      cacheBust: true,
      pixelRatio: Math.min(window.devicePixelRatio * 2, 3),
      backgroundColor: "#ffffff",
      skipFonts: false,
    });
const today = new Date();

const yyyy =
  today.getFullYear();

const mm =
  String(
    today.getMonth() + 1
  ).padStart(2, "0");

const dd =
  String(
    today.getDate()
  ).padStart(2, "0");

const dateKey =
  `${yyyy}${mm}${dd}`;

const savedCount =
  Number(
    localStorage.getItem(dateKey) || "0"
  ) + 1;

localStorage.setItem(
  dateKey,
  String(savedCount)
);

const fileName =
  `${dateKey}-${savedCount}.png`;

    setInvoiceImage(dataUrl);
    setInvoiceFileName(fileName);
    setIsCreatingImage(false);
    return;

    const file = new File([blob], fileName, { type: "image/png" });
    const canShareFile =
      typeof navigator.share === "function" &&
      (!navigator.canShare || navigator.canShare({ files: [file] }));

    // iPhone/Android: bảng Chia sẻ cho phép chọn Lưu hình ảnh hoặc gửi ảnh.
    if (canShareFile) {
      try {
        await navigator.share({
          files: [file],
          title: "Hóa đơn",
        });
        if (imageWindow && !imageWindow.closed) imageWindow.close();
        return;
      } catch (shareError) {
        if (shareError?.name === "AbortError") {
          if (imageWindow && !imageWindow.closed) imageWindow.close();
          return;
        }
      }
    }

    if (imageWindow && !imageWindow.closed) {
      imageWindow.document.title = `Hóa đơn ${fileName}`;
      imageWindow.location.href = blobUrl;
    } else if (/iPhone|iPad|Android/i.test(navigator.userAgent)) {
      // iOS thường chặn download="" và popup sau thao tác bất đồng bộ.
      // Mở ảnh ngay trên tab hiện tại để người dùng nhấn giữ và lưu ảnh.
      window.location.href = blobUrl;
    } else {
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      link.rel = "noopener";
      document.body.appendChild(link);
      link.click();
      link.remove();
    }

    // Không thu hồi ngay vì Chrome/Edge có thể chưa bắt đầu tải Blob.
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);

  } catch (error) {

    console.error("Save invoice image failed:", error);
    setIsCreatingImage(false);

    alert("Không thể lưu ảnh");

  }

};
const downloadInvoiceImage = () => {
  if (!invoiceImage) return;
  const link = document.createElement("a");
  link.href = invoiceImage;
  link.download = invoiceFileName || "hoa-don.png";
  document.body.appendChild(link);
  link.click();
  link.remove();
};

const shareInvoiceImage = async () => {
  if (!invoiceImage) return;
  try {
    const blob = await (await fetch(invoiceImage)).blob();
    const file = new File([blob], invoiceFileName || "hoa-don.png", { type: "image/png" });
    if (!navigator.share || (navigator.canShare && !navigator.canShare({ files: [file] }))) {
      alert("Thiết bị không hỗ trợ chia sẻ trực tiếp. Hãy nhấn giữ ảnh để lưu.");
      return;
    }
    await navigator.share({ files: [file], title: "Hóa đơn" });
  } catch (error) {
    if (error?.name !== "AbortError") console.error("Share invoice image failed:", error);
  }
};
if (brand === "select") {

  return (

    <main className="min-h-screen paint-order-screen paint-order-select flex items-center justify-center p-6">

      <div className="w-full max-w-md space-y-4">

        <button
          onClick={() =>
            setBrand("mykolor")
          }
          className="w-full bg-white text-black rounded-3xl p-6 text-2xl font-bold"
        >
          Lên đơn Mykolor
        </button>

        <button
          onClick={() =>
            setBrand("forich")
          }
          className="w-full bg-orange-500 text-white rounded-3xl p-6 text-2xl font-bold"
        >
          Lên đơn Forich
        </button>
        <button
  onClick={() =>
    setBrand("sunpro")
  }
  className="w-full bg-yellow-500 text-black rounded-3xl p-6 text-2xl font-bold"
>
  Lên đơn Sunpro
</button>

      </div>

    </main>

  );
}
  return (
    <main className="min-h-screen paint-order-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-3">

      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-4">

        {/* FORM */}

        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-[30px] shadow-2xl p-4 text-white paint-panel">
        <button
  onClick={() => onBack ? onBack() : setBrand("select")}
  className="mb-3 bg-white/10 px-4 py-2 rounded-2xl text-sm"
>
  ← Quay lại
</button>

          <h1 className="text-2xl font-bold mb-4">

  {
    brand === "forich"
  ? "Forich Order"
  : brand === "sunpro"
  ? "Sunpro Order"
  : "Mykolor Order"
  }

</h1>
          {/* nhân viên */}

          <div className="mb-3">

            <label className="text-sm mb-1 block">
              Nhân viên
            </label>

            <select
              value={selectedEmployee?.name || ""}
              onChange={(e) => {

                const found = employees.find(
                  (emp) =>
                    emp.name === e.target.value
                );

                if (found) {
                  setSelectedEmployee(found);
                }

              }}
              className="w-full bg-white/10 border border-white/20 rounded-2xl p-3 text-sm outline-none"
            >
<option
  value=""
  disabled
  className="text-black"
>
  Chọn nhân viên
</option>
              {employees.map((emp, index) => (

                <option
                  key={index}
                  value={emp.name}
                  className="text-black"
                >
                  {emp.name}
                </option>

              ))}

            </select>

            <div className="mt-3 rounded-2xl border border-amber-300/40 bg-amber-100/10 p-3">
              <button type="button" onClick={() => setShowSavedOrders(!showSavedOrders)} className="w-full text-left font-bold text-amber-200">
                {showSavedOrders ? "Ẩn đơn đã lưu" : "Xem đơn đã lưu"} ({paintSavedOrders.length})
              </button>
              {showSavedOrders && (
                <div className="mt-3 space-y-2">
                  {!selectedEmployee && <p className="text-sm text-amber-100">Chọn nhân viên để xem kho đơn riêng.</p>}
                  {selectedEmployee && paintSavedOrders.length === 0 && <p className="text-sm text-amber-100">Nhân viên này chưa có đơn sơn được lưu.</p>}
                  {paintSavedOrders.map((saved) => (
                    <div key={saved.id} className="flex items-center justify-between gap-2 rounded-xl bg-white p-2 text-sm text-slate-900">
                      <div><b>{saved.customer}</b><div className="text-xs text-slate-500">{new Date(saved.createdAt).toLocaleString("vi-VN")}</div></div>
                      <div className="flex gap-1"><button type="button" onClick={() => openSavedPaintOrder(saved)} className="rounded-lg bg-blue-600 px-2 py-1 text-white">Xem</button><button type="button" onClick={() => deleteSavedPaintOrder(saved.id)} className="rounded-lg bg-red-100 px-2 py-1 text-red-700">Xóa</button></div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* khách */}

          <div className="space-y-3">

            <input
              placeholder="Tên khách hàng"
              autoCapitalize="words"
              autoComplete="name"
              value={customerName}
              onChange={(e) =>
                setCustomerName(
                  e.target.value
                )
              }
              className="w-full bg-white/10 border border-white/20 rounded-2xl p-3 text-sm outline-none"
            />

            <input
              placeholder="Địa chỉ"
              autoCapitalize="words"
              autoComplete="street-address"
              value={customerAddress}
              onChange={(e) =>
                setCustomerAddress(
                  e.target.value
                )
              }
              className="w-full bg-white/10 border border-white/20 rounded-2xl p-3 text-sm outline-none"
            />

          </div>

<div className="grid grid-cols-2 gap-2 mt-3">

  <input
    placeholder="Mức chiết khấu (%)"
    inputMode="numeric"
    autoComplete="off"
    value={
      discountPercent === 0
        ? ""
        : discountPercent
    }
    onChange={(e) => {

      const raw =
        e.target.value.replace(/\D/g, "");

      setDiscountPercent(
        raw === ""
          ? 0
          : Number(raw)
      );

    }}
    className="w-full bg-white/10 border border-white/20 rounded-2xl p-3 text-sm outline-none"
  />

  <input
    placeholder="Khách đã cọc"
    inputMode="numeric"
    autoComplete="off"
    value={
      customerDeposit === 0
        ? ""
        : customerDeposit.toLocaleString("vi-VN")
    }
    onChange={(e) => {

      const raw =
        e.target.value.replaceAll(".", "");

      const numberValue =
        Math.max(0, Number(raw));

      setCustomerDeposit(numberValue);

    }}
    className="w-full bg-white/10 border border-white/20 rounded-2xl p-3 text-sm outline-none"
  />

</div>
          {/* tìm sản phẩm */}

          <div className="mt-4">

            <input
              placeholder="Tìm sản phẩm..."
              value={keyword}
              onChange={(e) =>
                setKeyword(
                  e.target.value
                )
              }
              className="w-full bg-white/10 border border-white/20 rounded-2xl p-3 text-sm outline-none"
            />

            {/* autocomplete */}

            {keyword && (

              <div className="mt-2 bg-white rounded-2xl overflow-hidden shadow-2xl">

                {filteredProducts.map(
                  (product, index) => (

                    <button
                      key={index}
                      onClick={() =>
                        addProduct(product)
                      }
                      className="w-full text-left p-3 border-b hover:bg-gray-100 text-black"
                    >

                      <p className="font-semibold text-sm">
                        {product.vn}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
  {product.en} - {product.size}
</p>

                    </button>

                  )
                )}

              </div>

            )}

          </div>

          {/* danh sách đơn */}

          <div className="mt-4 space-y-3">

            {orderItems.map((item, index) => (

              <div
                key={index}
                className="bg-white/10 border border-white/20 rounded-3xl p-3"
              >

                <div className="flex items-start justify-between gap-2">

                  <div>

                    <p className="font-semibold text-sm">
  {item.vn} - {item.size}
</p>

                    <p className="text-xs opacity-70 mt-1">
                      {item.en}
                    </p>

                  </div>

                  <button
                    onClick={() => {

                      const updated = [
                        ...orderItems,
                      ];

                      updated.splice(index, 1);

                      setOrderItems(updated);

                    }}
                    className="bg-red-500 text-white text-xs px-3 py-2 rounded-xl"
                  >
                    Xóa
                  </button>

                </div>

                <div className="grid grid-cols-2 gap-2 mt-3">

                  <input
  type="text"
  inputMode="numeric"
  autoComplete="off"
  value={
    item.qty === 0
      ? ""
      : item.qty
  }
  onChange={(e) => {

    const raw =
      e.target.value.replace(/\D/g, "");

    updateItem(
      
      index,
      "qty",
      raw === ""
        ? 0
        : Number(raw)
    );

  }}
  placeholder="SL"
  className="bg-white/10 border border-white/20 rounded-2xl p-3 text-sm outline-none"
/>

                  <input
                    value={item.basePrice.toLocaleString("vi-VN")}
                    disabled
                    className="bg-white/10 border border-white/20 rounded-2xl p-3 text-sm outline-none opacity-70"
                  />

                </div>

                {item.canMixColor && (

                  <div className="space-y-2 mt-2">

                    <input
                      placeholder="Mã màu"
                      autoCapitalize="characters"
                      autoComplete="off"
                      value={item.colorCode}
                      onChange={(e) => {

  const value =
    e.target.value.toUpperCase();

  // FORICH
 if (
  brand === "forich" ||
  brand === "sunpro"
) {

  const regex =
    /^(|A|AP|AP\d{0,3}|AP\d{0,3}-|AP\d{0,3}-\d?)$/

  if (!regex.test(value)) {
    return;
  }

}

updateItem(
  index,
  "colorCode",
  value
);

  

}}
                      
                      className="w-full bg-white/10 border border-white/20 rounded-2xl p-3 text-sm outline-none"
                    />

    {
  brand === "mykolor" ? (

    <input
      value={
        item.finalPrice === 0
          ? ""
          : item.finalPrice.toLocaleString("vi-VN")
      }
      onChange={(e) => {

        const rawValue =
          e.target.value.replaceAll(".", "");

        const numberValue =
          Math.max(0, Number(rawValue));

        updateItem(
          index,
          "finalPrice",
          numberValue
        );

      }}
      placeholder="Nhập giá gồm sơn + màu"
      inputMode="numeric"
      autoComplete="off"
      className="w-full bg-white/10 border border-white/20 rounded-2xl p-3 text-sm outline-none"
    />

  ) : (

    <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-sm">

      Tiền màu:
      {" "}

      <span className="font-bold text-orange-300">

        {item.colorPrice.toLocaleString("vi-VN")}đ

      </span>

    </div>

  )
}

                  </div>

                )}

              </div>

            ))}

          </div>

          <div className="mobile-total-bar paint-mobile-total" aria-live="polite">
            <div>
              <span className="mobile-total-label">Tổng đơn sơn</span>
              <span className="mobile-total-caption">Sau chiết khấu</span>
            </div>
            <strong className="mobile-total-value">{finalAfterDiscount.toLocaleString("vi-VN")} đ</strong>
          </div>

        </div>

        {/* HÓA ĐƠN */}
        
        {/* HÓA ĐƠN */}

<div>

  <div className="flex justify-end mb-3">

    <button
      onClick={saveInvoiceImage}
      disabled={isCreatingImage}
      className={`
  text-white px-4 py-2 rounded-2xl text-sm
  ${
    brand === "forich"
      ? "bg-orange-500"
      : "bg-slate-900"
  }
`}
    >
      Lưu ảnh
    </button>
    <button type="button" onClick={savePaintOrder} className="rounded-2xl bg-amber-500 px-4 py-2 text-sm text-white">
      Lưu đơn vào kho nhân viên
    </button>

  </div>

  {invoiceImage && (
    <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <p className="mb-2 text-sm font-semibold text-slate-700">Ảnh đã tạo - chọn cách lưu:</p>
      <img src={invoiceImage} alt="Xem trước hóa đơn" className="max-h-64 w-full rounded-xl bg-white object-contain" />
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={shareInvoiceImage} className="rounded-xl bg-blue-600 px-4 py-2 text-sm text-white">Chia sẻ / Lưu ảnh</button>
        <button type="button" onClick={() => setInvoiceImage("")} className="rounded-xl bg-slate-200 px-4 py-2 text-sm text-slate-700">Đóng xem trước</button>
      </div>
    </div>
  )}

 <div
  ref={invoiceRef}
  className="bg-white rounded-[30px] p-4 paint-invoice"
>

          

          <div className="flex items-start justify-between border-b pb-3 gap-3 paint-invoice-header">

            <div className="paint-invoice-company">

             <img
  src={brand === "mykolor" ? "/passion.png" : "/anphat.png"}
  alt=""
  crossOrigin="anonymous"
  loading="eager"
  decoding="sync"
  className="w-[90px] object-contain"
/>

              <h2 className="font-bold text-xs mt-2 paint-invoice-company-name">
                {
  brand !== "mykolor"
    ? "CÔNG TY TNHH CÔNG NGHỆ AN PHÁT BẮC NINH"
    : "CHI NHÁNH CÔNG TY 4 ORANGES CO,. LTD MIỀN BẮC"
}
              </h2>

              <p className="text-[10px] mt-1 paint-invoice-company-detail">
                {
  brand !== "mykolor"
    ? "Khu phố Lựa, Phường Quế Võ, Tỉnh Bắc Ninh"
    : "Lô D3, KCN Đại Đồng - Hoàn Sơn, Xã Đại Đồng, Tỉnh Bắc Ninh"
}
              </p>

              <p className="text-[10px] mt-1 paint-invoice-company-detail">
                SĐT: {selectedEmployee?.phone || ""}
              </p>

            </div>

            <h1 className="text-lg font-bold paint-invoice-title">
              HÓA ĐƠN BÁN HÀNG
            </h1>

          </div>

          {/* khách */}

          <div className="mt-3 text-xs space-y-1 paint-invoice-customer">

            <p className="paint-customer-row">
              <span className="font-bold">
                Khách:
              </span>{" "}
              {customerName}
            </p>

            <p className="paint-customer-row">
              <span className="font-bold">
                Địa chỉ:
              </span>{" "}
              {customerAddress}
            </p>

          </div>

          {/* table */}

          <div className="mt-4 paint-invoice-table-wrap">

            <table className="w-full border text-[5px] md:text-[8px] leading-tight table-auto paint-invoice-table">

              <thead className="bg-gray-100">

  <tr>

    <th className="border px-[1px] py-[1px] w-[12px]">
      STT
    </th>

    <th className="border px-[2px] py-[1px] w-[160px]">
  Sản phẩm
</th>

    <th className="border px-[1px] py-[1px] w-[18px]">
  Màu
</th>

    <th className="border px-[2px] py-1 w-[28px]">
      SL
    </th>

    <th className="border px-[2px] py-1 w-[34px]">
  ĐG Sơn
</th>

<th className="border px-[2px] py-1 w-[34px]">
   Tổng tiền sơn
</th>

<th className="border px-[2px] py-1 w-[34px]">
  ĐG Màu
</th>

<th className="border px-[2px] py-1 w-[34px]">
  Tổng tiền màu
</th>

<th className="border px-[1px] py-[1px] w-[38px] break-words">
  Tổng
</th>

  </tr>

</thead>

              <tbody>

  {groupedItems.map((item, index) => {

    const paintTotal =
      item.basePrice *
      item.qty;

    const colorTotal =
      item.colorPrice *
      item.qty;

    const rowTotal =
  (item.finalPrice === 0
    ? item.basePrice
    : item.finalPrice)
  * item.qty;


    return (

      <tr key={index} className="paint-invoice-product-row">

        <td className="border px-[2px] py-1 text-center align-top">
          {index + 1}
        </td>

        <td className="border px-[1px] py-[1px] align-top break-words w-[160px] leading-tight paint-invoice-product-name">

          <p className="leading-tight">
            {item.vn} - {item.size}
          </p>

          <p className="text-[7px] text-gray-500 leading-tight mt-1 paint-invoice-product-en">
            {item.en}
          </p>

        </td>

        <td className="border px-[1px] py-[1px] text-center align-top w-[18px] overflow-hidden">
  {item.colorCode?.slice(0, 6)}
</td>

        <td className="border px-[2px] py-1 text-center align-top">
          {item.qty}
        </td>

        <td className="border px-[2px] py-1 text-right align-top">
  {(item.basePrice).toLocaleString("vi-VN")}
</td>

<td className="border px-[2px] py-1 text-right align-top">
  {(paintTotal).toLocaleString("vi-VN")}
</td>

<td className="border px-[2px] py-1 text-right align-top">
  {(item.colorPrice).toLocaleString("vi-VN")}
</td>

<td className="border px-[2px] py-1 text-right align-top">
  {(colorTotal).toLocaleString("vi-VN")}
</td>

        <td className="border px-[2px] py-1 text-right font-bold align-top">
          {(rowTotal).toLocaleString("vi-VN")}
        </td>

      </tr>

    );
  })}

</tbody>

            </table>

          </div>

          {/* tổng */}

<div className="mt-4 text-right space-y-1 paint-invoice-summary">

  <p className="text-lg font-bold paint-summary-row paint-summary-total">
    Tổng: {total.toLocaleString("vi-VN")}đ
  </p>

  <p className="text-sm paint-summary-row paint-summary-after-discount">

    Tổng sau chiết khấu
    {" "}
    {discountPercent}%:
    {" "}

    {finalAfterDiscount.toLocaleString("vi-VN")}đ

  </p>

  <p className="text-sm paint-summary-row paint-summary-deposit">

    Khách đã cọc:
    {" "}

    {customerDeposit.toLocaleString("vi-VN")}đ

  </p>

  <p className="text-base font-bold text-red-600 paint-summary-row paint-summary-remaining">

    Còn phải thanh toán:
    {" "}

    {remainingPayment.toLocaleString("vi-VN")}đ

  </p>

</div>
<div className="paint-invoice-summary-new" aria-label="Tóm tắt thanh toán">
  <div className="paint-summary-row">
    <span>Tổng tiền hàng</span>
    <strong>{total.toLocaleString("vi-VN")} đ</strong>
  </div>
  {discountPercent > 0 && (
    <div className="paint-summary-row">
      <span>Chiết khấu</span>
      <strong>{discountPercent}%</strong>
    </div>
  )}
  <div className="paint-summary-row">
    <span>Sau chiết khấu</span>
    <strong>{finalAfterDiscount.toLocaleString("vi-VN")} đ</strong>
  </div>
  <div className="paint-summary-row">
    <span>Đã cọc</span>
    <strong>{customerDeposit.toLocaleString("vi-VN")} đ</strong>
  </div>
  <div className="paint-summary-row paint-summary-remaining">
    <span>CÒN PHẢI THANH TOÁN</span>
    <strong>{remainingPayment.toLocaleString("vi-VN")} đ</strong>
  </div>
</div>
         <div
  className="mt-10 paint-invoice-signature"
  style={{
    breakInside: "avoid",
    pageBreakInside: "avoid",
  }}
>

  <div className="text-right text-xs paint-invoice-date">

    Bắc Ninh, ngày {new Date().getDate()}
    {" "}tháng {new Date().getMonth() + 1}
    {" "}năm {new Date().getFullYear()}

  </div>

  <div className="grid grid-cols-2 mt-6 text-xs paint-invoice-signature-grid">

    <div className="text-center">

      <p className="font-bold">
        Người lên đơn
      </p>

      <p className="mt-10 paint-invoice-signer-name">
        {selectedEmployee?.name || ""}
      </p>

    </div>

    <div className="text-center">

      <p className="font-bold">
        Người nhận
      </p>

    </div>

  </div>

</div>

        </div>

      </div>
      </div>

    </main>
  );
}
