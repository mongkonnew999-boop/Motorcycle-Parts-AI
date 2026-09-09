"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bike,
  CalendarDays,
  Check,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  FileText,
  Menu,
  Package,
  RefreshCw,
  Save,
  Settings,
  ShoppingBag,
  Sparkles,
  X,
  Plus,
  Image as ImageIcon,
  Copy,
  Wand2,
  Video,
} from "lucide-react";

type Status = "ยังไม่ได้ทำ" | "กำลังทำ" | "เสร็จแล้ว";
type Vehicle = {
  brand: string;
  family: string;
  model: string;
  generation: string;
  yearRange: string;
  engineType: string;
  stroke: "2 จังหวะ" | "4 จังหวะ";
  relatedModels: string[];
};
type Slot = {
  id: string;
  channel: string;
  vehicles: Vehicle[];
  parts: string[];
  status: Status;
  note: string;
};
type SavedWork = Slot & { date: string; savedAt: string };
type ProductWork = {
  id: string;
  createdAt: string;
  photos: string[];
  name: string;
  brand: string;
  vehicleModel: string;
  year: string;
  partCode: string;
  description: string;
  channel: "TikTok" | "Shopee";
  analysis: string[];
  character: string;
  scene: string;
  lens: "Hero" | "Macro";
  imagePrompt: string;
  videoScenes: { prompt: string; speech: string }[];
  caption: string;
  hashtags: string[];
};

const parts = [
  "ชุดชามหน้า",
  "เม็ดชาม",
  "สายพาน",
  "คลัตช์",
  "กระโหลกคลัตช์",
  "ไดสตาร์ท",
  "เฟืองสตาร์ท",
  "ปั๊มติ๊ก",
  "หัวฉีด",
  "กรองอากาศ",
  "เสื้อสูบ",
  "ลูกสูบ",
  "ฝาสูบ",
  "วาล์ว",
  "แคม",
  "โซ่ราวลิ้น",
  "ตัวตั้งโซ่",
  "ข้อเหวี่ยง",
  "มัดไฟ",
  "คอยล์",
  "ECU",
  "คาร์บูเรเตอร์",
  "ผ้าเบรก",
  "จานเบรก",
  "ปั๊มเบรก",
  "โช้คหน้า",
  "โช้คหลัง",
  "ลูกปืน",
  "โซ่สเตอร์",
  "เรือนไมล์",
  "ไฟหน้า",
  "ไฟท้าย",
  "ชุดสี",
  "เบาะ",
  "ขาตั้ง",
  "ล้อ",
  "ยาง",
];
const raw: [
  string,
  string,
  string,
  string,
  string,
  string,
  "2 จังหวะ" | "4 จังหวะ",
  string[],
][] = [
  [
    "HONDA",
    "Wave/Dream",
    "Dream 100",
    "รุ่นเก่า",
    "1997-2005",
    "ครอบครัว",
    "4 จังหวะ",
    ["Dream 110i", "Wave 100", "Wave 100S"],
  ],
  [
    "HONDA",
    "Wave/Dream",
    "Dream 110i",
    "รุ่นใหม่",
    "2009-ปัจจุบัน",
    "ครอบครัว",
    "4 จังหวะ",
    ["Wave 110", "Wave 110i 2009-2011", "Wave 110i 2012-2018"],
  ],
  [
    "HONDA",
    "Wave/Dream",
    "Wave 100",
    "รุ่นเก่า",
    "1999-2008",
    "ครอบครัว",
    "4 จังหวะ",
    ["Wave 100S", "Dream 100", "Wave 110"],
  ],
  [
    "HONDA",
    "Wave/Dream",
    "Wave 100S",
    "รุ่นเก่า",
    "2003-2008",
    "ครอบครัว",
    "4 จังหวะ",
    ["Wave 100", "Dream 100", "Wave 110"],
  ],
  [
    "HONDA",
    "Wave/Dream",
    "Wave 110",
    "รุ่นเก่า",
    "2009-2011",
    "ครอบครัว",
    "4 จังหวะ",
    ["Wave 110i 2009-2011", "Dream 110i", "Wave 100S"],
  ],
  [
    "HONDA",
    "Wave/Dream",
    "Wave 110i 2009-2011",
    "รุ่นเก่า",
    "2009-2011",
    "ครอบครัว",
    "4 จังหวะ",
    ["Wave 110", "Wave 110i 2012-2018", "Dream 110i"],
  ],
  [
    "HONDA",
    "Wave/Dream",
    "Wave 110i 2012-2018",
    "รุ่นเก่า",
    "2012-2018",
    "ครอบครัว",
    "4 จังหวะ",
    ["Wave 110i 2009-2011", "Wave 110i 2019-2024", "Wave 125"],
  ],
  [
    "HONDA",
    "Wave/Dream",
    "Wave 110i 2019-2024",
    "รุ่นใหม่",
    "2019-2024",
    "ครอบครัว",
    "4 จังหวะ",
    ["Wave 110i 2012-2018", "Wave 125i 2019-2022", "Super Cub"],
  ],
  [
    "HONDA",
    "Wave/Dream",
    "Wave 125",
    "รุ่นเก่า",
    "2003-2005",
    "ครอบครัว",
    "4 จังหวะ",
    ["Wave 125R", "Wave 125S", "Wave 125X"],
  ],
  [
    "HONDA",
    "Wave/Dream",
    "Wave 125R",
    "รุ่นเก่า",
    "2004-2007",
    "ครอบครัว",
    "4 จังหวะ",
    ["Wave 125S", "Wave 125X", "Wave 125i 2012-2018"],
  ],
  [
    "HONDA",
    "Wave/Dream",
    "Wave 125S",
    "รุ่นเก่า",
    "2005-2010",
    "ครอบครัว",
    "4 จังหวะ",
    ["Wave 125R", "Wave 125X", "Wave 125i 2012-2018"],
  ],
  [
    "HONDA",
    "Wave/Dream",
    "Wave 125X",
    "รุ่นเก่า",
    "2010-2012",
    "ครอบครัว",
    "4 จังหวะ",
    ["Wave 125S", "Wave 125R", "Wave 125i 2012-2018"],
  ],
  [
    "HONDA",
    "Wave/Dream",
    "Wave 125i 2012-2018",
    "รุ่นเก่า",
    "2012-2018",
    "ครอบครัว",
    "4 จังหวะ",
    ["Wave 125S", "Wave 125i 2019-2022", "Wave 125i 2023+"],
  ],
  [
    "HONDA",
    "Wave/Dream",
    "Wave 125i 2019-2022",
    "รุ่นใหม่",
    "2019-2022",
    "ครอบครัว",
    "4 จังหวะ",
    ["Wave 125i 2012-2018", "Wave 125i 2023+", "Wave 110i 2019-2024"],
  ],
  [
    "HONDA",
    "Wave/Dream",
    "Wave 125i 2023+",
    "รุ่นใหม่",
    "2023-ปัจจุบัน",
    "ครอบครัว",
    "4 จังหวะ",
    ["Wave 125i 2019-2022", "Wave 110i 2019-2024", "Super Cub"],
  ],
  [
    "HONDA",
    "Wave/Dream",
    "Super Cub",
    "รุ่นใหม่",
    "2018-ปัจจุบัน",
    "ครอบครัว",
    "4 จังหวะ",
    ["Wave 110i 2019-2024", "Wave 125i 2023+", "Wave 110i 2012-2018"],
  ],
  [
    "HONDA",
    "ออโต้ Honda",
    "Click 110i",
    "รุ่นเก่า",
    "2009-2014",
    "ออโต้",
    "4 จังหวะ",
    ["Click 125i", "Click 150i", "Scoopy-i"],
  ],
  [
    "HONDA",
    "ออโต้ Honda",
    "Click 125i",
    "รุ่นเก่า",
    "2012-2018",
    "ออโต้",
    "4 จังหวะ",
    ["Click 150i", "Click 160", "Click 110i"],
  ],
  [
    "HONDA",
    "ออโต้ Honda",
    "Click 150i",
    "รุ่นเก่า",
    "2018-2021",
    "ออโต้",
    "4 จังหวะ",
    ["Click 125i", "Click 160", "ADV 150"],
  ],
  [
    "HONDA",
    "ออโต้ Honda",
    "Click 160",
    "รุ่นใหม่",
    "2022-ปัจจุบัน",
    "ออโต้",
    "4 จังหวะ",
    ["Click 150i", "Click 125i", "ADV 160"],
  ],
  [
    "HONDA",
    "ออโต้ Honda",
    "Scoopy-i",
    "รุ่นเก่า",
    "2010-2020",
    "ออโต้",
    "4 จังหวะ",
    ["Scoopy", "Spacy-i", "Click 110i"],
  ],
  [
    "HONDA",
    "ออโต้ Honda",
    "Scoopy",
    "รุ่นใหม่",
    "2021-ปัจจุบัน",
    "ออโต้",
    "4 จังหวะ",
    ["Scoopy-i", "Giorno+", "Lead 125"],
  ],
  [
    "HONDA",
    "ออโต้ Honda",
    "Spacy-i",
    "รุ่นเก่า",
    "2012-2017",
    "ออโต้",
    "4 จังหวะ",
    ["Scoopy-i", "Zoomer-X", "Click 110i"],
  ],
  [
    "HONDA",
    "ออโต้ Honda",
    "Zoomer-X",
    "รุ่นเก่า",
    "2012-2020",
    "ออโต้",
    "4 จังหวะ",
    ["Spacy-i", "Scoopy-i", "Click 125i"],
  ],
  [
    "HONDA",
    "บิ๊กสกู๊ตเตอร์",
    "PCX 150",
    "รุ่นเก่า",
    "2014-2020",
    "ออโต้",
    "4 จังหวะ",
    ["PCX 160", "ADV 150", "ADV 160"],
  ],
  [
    "HONDA",
    "บิ๊กสกู๊ตเตอร์",
    "PCX 160",
    "รุ่นใหม่",
    "2021-ปัจจุบัน",
    "ออโต้",
    "4 จังหวะ",
    ["ADV 160", "PCX 150", "ADV 150"],
  ],
  [
    "HONDA",
    "บิ๊กสกู๊ตเตอร์",
    "ADV 150",
    "รุ่นเก่า",
    "2019-2022",
    "ออโต้",
    "4 จังหวะ",
    ["ADV 160", "PCX 150", "PCX 160"],
  ],
  [
    "HONDA",
    "บิ๊กสกู๊ตเตอร์",
    "ADV 160",
    "รุ่นใหม่",
    "2023-ปัจจุบัน",
    "ออโต้",
    "4 จังหวะ",
    ["PCX 160", "ADV 150", "Forza 350"],
  ],
  [
    "HONDA",
    "บิ๊กสกู๊ตเตอร์",
    "Forza 300",
    "รุ่นเก่า",
    "2013-2018",
    "ออโต้",
    "4 จังหวะ",
    ["Forza 350", "ADV 350", "XMAX 300"],
  ],
  [
    "HONDA",
    "บิ๊กสกู๊ตเตอร์",
    "Forza 350",
    "รุ่นใหม่",
    "2020-ปัจจุบัน",
    "ออโต้",
    "4 จังหวะ",
    ["ADV 350", "Forza 300", "XMAX 300"],
  ],
  [
    "HONDA",
    "บิ๊กสกู๊ตเตอร์",
    "ADV 350",
    "รุ่นใหม่",
    "2022-ปัจจุบัน",
    "ออโต้",
    "4 จังหวะ",
    ["Forza 350", "XMAX 300", "Forza 300"],
  ],
  [
    "HONDA",
    "ออโต้ Honda",
    "Giorno+",
    "รุ่นใหม่",
    "2023-ปัจจุบัน",
    "ออโต้",
    "4 จังหวะ",
    ["Scoopy", "Lead 125", "Click 160"],
  ],
  [
    "HONDA",
    "ออโต้ Honda",
    "Lead 125",
    "รุ่นใหม่",
    "2023-ปัจจุบัน",
    "ออโต้",
    "4 จังหวะ",
    ["Giorno+", "Scoopy", "Click 160"],
  ],
  [
    "HONDA",
    "สปอร์ต Honda",
    "Sonic 125",
    "รุ่นเก่า",
    "2000-2005",
    "สปอร์ต",
    "4 จังหวะ",
    ["MSX 125", "CBR150R", "Wave 125"],
  ],
  [
    "HONDA",
    "สปอร์ต Honda",
    "MSX 125",
    "รุ่นใหม่",
    "2013-ปัจจุบัน",
    "สปอร์ต",
    "4 จังหวะ",
    ["CBR150R", "Sonic 125", "M-Slaz"],
  ],
  [
    "HONDA",
    "สปอร์ต Honda",
    "CBR150R",
    "รุ่นใหม่",
    "2011-ปัจจุบัน",
    "สปอร์ต",
    "4 จังหวะ",
    ["MSX 125", "R15", "GSX-R150"],
  ],
  [
    "HONDA",
    "Honda 2 จังหวะ",
    "Nova S",
    "รุ่นเก่า",
    "1993-1998",
    "ครอบครัว",
    "2 จังหวะ",
    ["Nova RS", "Nova Dash", "LS125"],
  ],
  [
    "HONDA",
    "Honda 2 จังหวะ",
    "Nova RS",
    "รุ่นเก่า",
    "1995-2000",
    "ครอบครัว",
    "2 จังหวะ",
    ["Nova S", "Nova Dash", "LS125"],
  ],
  [
    "HONDA",
    "Honda 2 จังหวะ",
    "Nova Dash",
    "รุ่นเก่า",
    "1996-2002",
    "ครอบครัว",
    "2 จังหวะ",
    ["Nova RS", "Nova S", "LS125"],
  ],
  [
    "HONDA",
    "Honda 2 จังหวะ",
    "LS125",
    "รุ่นเก่า",
    "1997-2003",
    "สปอร์ต",
    "2 จังหวะ",
    ["NSR150", "NSR150RR", "Nova Dash"],
  ],
  [
    "HONDA",
    "Honda 2 จังหวะ",
    "NSR150",
    "รุ่นเก่า",
    "1990-1996",
    "สปอร์ต",
    "2 จังหวะ",
    ["NSR150RR", "NSR150SP", "LS125"],
  ],
  [
    "HONDA",
    "Honda 2 จังหวะ",
    "NSR150RR",
    "รุ่นเก่า",
    "1997-2000",
    "สปอร์ต",
    "2 จังหวะ",
    ["NSR150", "NSR150SP", "LS125"],
  ],
  [
    "HONDA",
    "Honda 2 จังหวะ",
    "NSR150SP",
    "รุ่นเก่า",
    "1998-2002",
    "สปอร์ต",
    "2 จังหวะ",
    ["NSR150RR", "NSR150", "LS125"],
  ],
  [
    "YAMAHA",
    "Mio/Fino/Nouvo",
    "Mio",
    "รุ่นเก่า",
    "2004-2008",
    "ออโต้",
    "4 จังหวะ",
    ["Mio MX", "Mio Z", "Fino"],
  ],
  [
    "YAMAHA",
    "Mio/Fino/Nouvo",
    "Mio MX",
    "รุ่นเก่า",
    "2008-2012",
    "ออโต้",
    "4 จังหวะ",
    ["Mio", "Mio Z", "Nouvo MX"],
  ],
  [
    "YAMAHA",
    "Mio/Fino/Nouvo",
    "Mio Z",
    "รุ่นเก่า",
    "2010-2015",
    "ออโต้",
    "4 จังหวะ",
    ["Mio MX", "Mio ZR", "Mio 115i"],
  ],
  [
    "YAMAHA",
    "Mio/Fino/Nouvo",
    "Mio ZR",
    "รุ่นเก่า",
    "2012-2016",
    "ออโต้",
    "4 จังหวะ",
    ["Mio Z", "Mio 115i", "Mio 125"],
  ],
  [
    "YAMAHA",
    "Mio/Fino/Nouvo",
    "Mio 115i",
    "รุ่นเก่า",
    "2015-2018",
    "ออโต้",
    "4 จังหวะ",
    ["Mio ZR", "Mio 125", "Fino 115i"],
  ],
  [
    "YAMAHA",
    "Mio/Fino/Nouvo",
    "Mio 125",
    "รุ่นใหม่",
    "2018-ปัจจุบัน",
    "ออโต้",
    "4 จังหวะ",
    ["Mio 115i", "Fino FI", "GT125"],
  ],
  [
    "YAMAHA",
    "Mio/Fino/Nouvo",
    "Fino",
    "รุ่นเก่า",
    "2006-2012",
    "ออโต้",
    "4 จังหวะ",
    ["Mio", "Fino 115i", "Nouvo"],
  ],
  [
    "YAMAHA",
    "Mio/Fino/Nouvo",
    "Fino 115i",
    "รุ่นเก่า",
    "2013-2016",
    "ออโต้",
    "4 จังหวะ",
    ["Fino", "Fino FI", "Mio 115i"],
  ],
  [
    "YAMAHA",
    "Mio/Fino/Nouvo",
    "Fino FI",
    "รุ่นใหม่",
    "2017-ปัจจุบัน",
    "ออโต้",
    "4 จังหวะ",
    ["Fino 115i", "Mio 125", "Grand Filano"],
  ],
  [
    "YAMAHA",
    "Mio/Fino/Nouvo",
    "Nouvo",
    "รุ่นเก่า",
    "2002-2007",
    "ออโต้",
    "4 จังหวะ",
    ["Nouvo MX", "Nouvo Elegance", "Mio"],
  ],
  [
    "YAMAHA",
    "Mio/Fino/Nouvo",
    "Nouvo MX",
    "รุ่นเก่า",
    "2008-2012",
    "ออโต้",
    "4 จังหวะ",
    ["Nouvo", "Nouvo Elegance", "Mio MX"],
  ],
  [
    "YAMAHA",
    "Mio/Fino/Nouvo",
    "Nouvo Elegance",
    "รุ่นเก่า",
    "2011-2015",
    "ออโต้",
    "4 จังหวะ",
    ["Nouvo MX", "Nouvo SX", "Nouvo"],
  ],
  [
    "YAMAHA",
    "Mio/Fino/Nouvo",
    "Nouvo SX",
    "รุ่นเก่า",
    "2013-2017",
    "ออโต้",
    "4 จังหวะ",
    ["Nouvo Elegance", "Nouvo MX", "TTX"],
  ],
  [
    "YAMAHA",
    "Mio/Fino/Nouvo",
    "TTX",
    "รุ่นเก่า",
    "2016-2019",
    "ออโต้",
    "4 จังหวะ",
    ["Nouvo SX", "Mio 125", "GT125"],
  ],
  [
    "YAMAHA",
    "Yamaha ออโต้",
    "Grand Filano",
    "รุ่นเก่า",
    "2014-2018",
    "ออโต้",
    "4 จังหวะ",
    ["Grand Filano Hybrid", "QBIX", "Fino FI"],
  ],
  [
    "YAMAHA",
    "Yamaha ออโต้",
    "Grand Filano Hybrid",
    "รุ่นใหม่",
    "2018-ปัจจุบัน",
    "ออโต้",
    "4 จังหวะ",
    ["Grand Filano", "QBIX", "Fino FI"],
  ],
  [
    "YAMAHA",
    "Yamaha ออโต้",
    "NMAX 155 2016-2019",
    "รุ่นเก่า",
    "2016-2019",
    "ออโต้",
    "4 จังหวะ",
    ["NMAX 155 2020+", "AEROX 155 2017-2020", "LEXI"],
  ],
  [
    "YAMAHA",
    "Yamaha ออโต้",
    "NMAX 155 2020+",
    "รุ่นใหม่",
    "2020-ปัจจุบัน",
    "ออโต้",
    "4 จังหวะ",
    ["NMAX 155 2016-2019", "AEROX 155 2021+", "LEXI"],
  ],
  [
    "YAMAHA",
    "Yamaha ออโต้",
    "AEROX 155 2017-2020",
    "รุ่นเก่า",
    "2017-2020",
    "ออโต้",
    "4 จังหวะ",
    ["AEROX 155 2021+", "NMAX 155 2016-2019", "LEXI"],
  ],
  [
    "YAMAHA",
    "Yamaha ออโต้",
    "AEROX 155 2021+",
    "รุ่นใหม่",
    "2021-ปัจจุบัน",
    "ออโต้",
    "4 จังหวะ",
    ["AEROX 155 2017-2020", "NMAX 155 2020+", "LEXI"],
  ],
  [
    "YAMAHA",
    "Yamaha ออโต้",
    "LEXI",
    "รุ่นใหม่",
    "2018-ปัจจุบัน",
    "ออโต้",
    "4 จังหวะ",
    ["NMAX 155 2020+", "AEROX 155 2021+", "GT125"],
  ],
  [
    "YAMAHA",
    "Yamaha ออโต้",
    "XMAX 300",
    "รุ่นใหม่",
    "2017-ปัจจุบัน",
    "ออโต้",
    "4 จังหวะ",
    ["Forza 350", "NMAX 155 2020+", "ADV 350"],
  ],
  [
    "YAMAHA",
    "Yamaha ออโต้",
    "QBIX",
    "รุ่นใหม่",
    "2017-ปัจจุบัน",
    "ออโต้",
    "4 จังหวะ",
    ["Grand Filano Hybrid", "Grand Filano", "GT125"],
  ],
  [
    "YAMAHA",
    "Yamaha ออโต้",
    "GT125",
    "รุ่นใหม่",
    "2014-ปัจจุบัน",
    "ออโต้",
    "4 จังหวะ",
    ["Mio 125", "LEXI", "TTX"],
  ],
  [
    "YAMAHA",
    "ครอบครัว/สปอร์ต Yamaha",
    "Spark",
    "รุ่นเก่า",
    "2004-2010",
    "ครอบครัว",
    "4 จังหวะ",
    ["Spark Nano", "Spark 115i", "Finn 115i"],
  ],
  [
    "YAMAHA",
    "ครอบครัว/สปอร์ต Yamaha",
    "Spark Nano",
    "รุ่นเก่า",
    "2007-2012",
    "ครอบครัว",
    "4 จังหวะ",
    ["Spark", "Spark 115i", "Finn 115i"],
  ],
  [
    "YAMAHA",
    "ครอบครัว/สปอร์ต Yamaha",
    "Spark 115i",
    "รุ่นเก่า",
    "2011-2017",
    "ครอบครัว",
    "4 จังหวะ",
    ["Spark Nano", "Finn 115i", "Spark"],
  ],
  [
    "YAMAHA",
    "ครอบครัว/สปอร์ต Yamaha",
    "Finn 115i",
    "รุ่นใหม่",
    "2017-ปัจจุบัน",
    "ครอบครัว",
    "4 จังหวะ",
    ["Spark 115i", "Spark Nano", "Spark"],
  ],
  [
    "YAMAHA",
    "ครอบครัว/สปอร์ต Yamaha",
    "Exciter 150",
    "รุ่นเก่า",
    "2015-2020",
    "สปอร์ต",
    "4 จังหวะ",
    ["Exciter 155", "M-Slaz", "R15"],
  ],
  [
    "YAMAHA",
    "ครอบครัว/สปอร์ต Yamaha",
    "Exciter 155",
    "รุ่นใหม่",
    "2021-ปัจจุบัน",
    "สปอร์ต",
    "4 จังหวะ",
    ["Exciter 150", "M-Slaz", "R15"],
  ],
  [
    "YAMAHA",
    "ครอบครัว/สปอร์ต Yamaha",
    "M-Slaz",
    "รุ่นเก่า",
    "2015-2020",
    "สปอร์ต",
    "4 จังหวะ",
    ["R15", "Exciter 155", "CBR150R"],
  ],
  [
    "YAMAHA",
    "ครอบครัว/สปอร์ต Yamaha",
    "R15",
    "รุ่นใหม่",
    "2014-ปัจจุบัน",
    "สปอร์ต",
    "4 จังหวะ",
    ["M-Slaz", "CBR150R", "GSX-R150"],
  ],
  [
    "YAMAHA",
    "Yamaha 2 จังหวะ",
    "RX-S",
    "รุ่นเก่า",
    "1980-1990",
    "ครอบครัว",
    "2 จังหวะ",
    ["RX-K", "RX-Z", "TZR150"],
  ],
  [
    "YAMAHA",
    "Yamaha 2 จังหวะ",
    "RX-K",
    "รุ่นเก่า",
    "1985-1995",
    "ครอบครัว",
    "2 จังหวะ",
    ["RX-S", "RX-Z", "TZR150"],
  ],
  [
    "YAMAHA",
    "Yamaha 2 จังหวะ",
    "RX-Z",
    "รุ่นเก่า",
    "1987-2005",
    "สปอร์ต",
    "2 จังหวะ",
    ["RX-K", "TZR150", "TZRR"],
  ],
  [
    "YAMAHA",
    "Yamaha 2 จังหวะ",
    "TZR150",
    "รุ่นเก่า",
    "1990-1998",
    "สปอร์ต",
    "2 จังหวะ",
    ["TZRR", "TZM150", "RX-Z"],
  ],
  [
    "YAMAHA",
    "Yamaha 2 จังหวะ",
    "TZRR",
    "รุ่นเก่า",
    "1994-2000",
    "สปอร์ต",
    "2 จังหวะ",
    ["TZR150", "TZM150", "VR150"],
  ],
  [
    "YAMAHA",
    "Yamaha 2 จังหวะ",
    "VR150",
    "รุ่นเก่า",
    "1997-2002",
    "สปอร์ต",
    "2 จังหวะ",
    ["VRR", "TZRR", "TZM150"],
  ],
  [
    "YAMAHA",
    "Yamaha 2 จังหวะ",
    "VRR",
    "รุ่นเก่า",
    "2000-2005",
    "สปอร์ต",
    "2 จังหวะ",
    ["VR150", "TZRR", "TZM150"],
  ],
  [
    "YAMAHA",
    "Yamaha 2 จังหวะ",
    "TZM150",
    "รุ่นเก่า",
    "1995-2002",
    "สปอร์ต",
    "2 จังหวะ",
    ["TZR150", "TZRR", "VR150"],
  ],
  [
    "KAWASAKI",
    "Kawasaki ครอบครัว",
    "Kaze",
    "รุ่นเก่า",
    "1995-2005",
    "ครอบครัว",
    "4 จังหวะ",
    ["Kaze R", "ZX130", "Athlete"],
  ],
  [
    "KAWASAKI",
    "Kawasaki ครอบครัว",
    "Kaze R",
    "รุ่นเก่า",
    "2005-2010",
    "ครอบครัว",
    "4 จังหวะ",
    ["Kaze", "ZX130", "Athlete"],
  ],
  [
    "KAWASAKI",
    "Kawasaki ครอบครัว",
    "ZX130",
    "รุ่นเก่า",
    "2005-2012",
    "ครอบครัว",
    "4 จังหวะ",
    ["Athlete", "Kaze R", "Kaze"],
  ],
  [
    "KAWASAKI",
    "Kawasaki ครอบครัว",
    "Athlete",
    "รุ่นเก่า",
    "2008-2015",
    "ครอบครัว",
    "4 จังหวะ",
    ["ZX130", "Kaze R", "Kaze"],
  ],
  [
    "KAWASAKI",
    "Kawasaki ออฟโรด",
    "KLX150",
    "รุ่นใหม่",
    "2010-ปัจจุบัน",
    "ออฟโรด",
    "4 จังหวะ",
    ["D-Tracker150", "Ninja 250", "Z250"],
  ],
  [
    "KAWASAKI",
    "Kawasaki ออฟโรด",
    "D-Tracker150",
    "รุ่นใหม่",
    "2010-ปัจจุบัน",
    "ออฟโรด",
    "4 จังหวะ",
    ["KLX150", "Z250", "Ninja 250"],
  ],
  [
    "KAWASAKI",
    "Kawasaki สปอร์ต",
    "Ninja 250",
    "รุ่นเก่า",
    "2008-2017",
    "สปอร์ต",
    "4 จังหวะ",
    ["Ninja 300", "Ninja 400", "Z250"],
  ],
  [
    "KAWASAKI",
    "Kawasaki สปอร์ต",
    "Ninja 300",
    "รุ่นเก่า",
    "2013-2017",
    "สปอร์ต",
    "4 จังหวะ",
    ["Ninja 250", "Ninja 400", "Z300"],
  ],
  [
    "KAWASAKI",
    "Kawasaki สปอร์ต",
    "Ninja 400",
    "รุ่นใหม่",
    "2018-ปัจจุบัน",
    "สปอร์ต",
    "4 จังหวะ",
    ["Ninja 300", "Z400", "Z300"],
  ],
  [
    "KAWASAKI",
    "Kawasaki สปอร์ต",
    "Z250",
    "รุ่นเก่า",
    "2013-2018",
    "เนกเก็ต",
    "4 จังหวะ",
    ["Z300", "Z400", "Ninja 250"],
  ],
  [
    "KAWASAKI",
    "Kawasaki สปอร์ต",
    "Z300",
    "รุ่นเก่า",
    "2015-2018",
    "เนกเก็ต",
    "4 จังหวะ",
    ["Z250", "Z400", "Ninja 300"],
  ],
  [
    "KAWASAKI",
    "Kawasaki สปอร์ต",
    "Z400",
    "รุ่นใหม่",
    "2019-ปัจจุบัน",
    "เนกเก็ต",
    "4 จังหวะ",
    ["Z300", "Ninja 400", "Ninja 300"],
  ],
  [
    "KAWASAKI",
    "Kawasaki 2 จังหวะ",
    "KR150",
    "รุ่นเก่า",
    "1990-1995",
    "สปอร์ต",
    "2 จังหวะ",
    ["KR150SE", "KR150SSR", "KRR150"],
  ],
  [
    "KAWASAKI",
    "Kawasaki 2 จังหวะ",
    "KR150SE",
    "รุ่นเก่า",
    "1994-1997",
    "สปอร์ต",
    "2 จังหวะ",
    ["KR150", "KR150SSR", "KRR150"],
  ],
  [
    "KAWASAKI",
    "Kawasaki 2 จังหวะ",
    "KR150SSR",
    "รุ่นเก่า",
    "1996-2000",
    "สปอร์ต",
    "2 จังหวะ",
    ["KR150SE", "KRR150", "KR150"],
  ],
  [
    "KAWASAKI",
    "Kawasaki 2 จังหวะ",
    "KRR150",
    "รุ่นเก่า",
    "2000-2006",
    "สปอร์ต",
    "2 จังหวะ",
    ["KR150SSR", "KR150SE", "Serpico150"],
  ],
  [
    "KAWASAKI",
    "Kawasaki 2 จังหวะ",
    "Serpico150",
    "รุ่นเก่า",
    "1992-2000",
    "สปอร์ต",
    "2 จังหวะ",
    ["Victor150", "GTO", "KRR150"],
  ],
  [
    "KAWASAKI",
    "Kawasaki 2 จังหวะ",
    "Victor150",
    "รุ่นเก่า",
    "1995-2000",
    "สปอร์ต",
    "2 จังหวะ",
    ["Serpico150", "GTO", "KRR150"],
  ],
  [
    "KAWASAKI",
    "Kawasaki 2 จังหวะ",
    "GTO",
    "รุ่นเก่า",
    "1985-1995",
    "ครอบครัว",
    "2 จังหวะ",
    ["Victor150", "Serpico150", "KR150"],
  ],
  [
    "SUZUKI",
    "Suzuki ครอบครัว",
    "Smash 110",
    "รุ่นเก่า",
    "2003-2008",
    "ครอบครัว",
    "4 จังหวะ",
    ["Smash Revo", "Smash 115", "Smash 115 FI"],
  ],
  [
    "SUZUKI",
    "Suzuki ครอบครัว",
    "Smash Revo",
    "รุ่นเก่า",
    "2008-2012",
    "ครอบครัว",
    "4 จังหวะ",
    ["Smash 110", "Smash 115", "Smash 115 FI"],
  ],
  [
    "SUZUKI",
    "Suzuki ครอบครัว",
    "Smash 115",
    "รุ่นเก่า",
    "2012-2016",
    "ครอบครัว",
    "4 จังหวะ",
    ["Smash Revo", "Smash 115 FI", "Shogun"],
  ],
  [
    "SUZUKI",
    "Suzuki ครอบครัว",
    "Smash 115 FI",
    "รุ่นใหม่",
    "2016-ปัจจุบัน",
    "ครอบครัว",
    "4 จังหวะ",
    ["Smash 115", "Shooter", "Shogun"],
  ],
  [
    "SUZUKI",
    "Suzuki ครอบครัว",
    "Shogun",
    "รุ่นเก่า",
    "2001-2010",
    "ครอบครัว",
    "4 จังหวะ",
    ["Smash 110", "Smash Revo", "Shooter"],
  ],
  [
    "SUZUKI",
    "Suzuki ครอบครัว",
    "Shooter",
    "รุ่นใหม่",
    "2012-ปัจจุบัน",
    "ครอบครัว",
    "4 จังหวะ",
    ["Smash 115 FI", "Smash 115", "Shogun"],
  ],
  [
    "SUZUKI",
    "Suzuki ออโต้",
    "Address",
    "รุ่นใหม่",
    "2015-ปัจจุบัน",
    "ออโต้",
    "4 จังหวะ",
    ["Step 125", "Burgman", "Shooter"],
  ],
  [
    "SUZUKI",
    "Suzuki ออโต้",
    "Step 125",
    "รุ่นเก่า",
    "2005-2010",
    "ออโต้",
    "4 จังหวะ",
    ["Address", "Burgman", "Shogun"],
  ],
  [
    "SUZUKI",
    "Suzuki สปอร์ต",
    "Raider 150",
    "รุ่นใหม่",
    "2014-ปัจจุบัน",
    "สปอร์ต",
    "4 จังหวะ",
    ["GSX-R150", "GSX-S150", "Exciter 155"],
  ],
  [
    "SUZUKI",
    "Suzuki สปอร์ต",
    "GSX-R150",
    "รุ่นใหม่",
    "2017-ปัจจุบัน",
    "สปอร์ต",
    "4 จังหวะ",
    ["GSX-S150", "Raider 150", "CBR150R"],
  ],
  [
    "SUZUKI",
    "Suzuki สปอร์ต",
    "GSX-S150",
    "รุ่นใหม่",
    "2017-ปัจจุบัน",
    "เนกเก็ต",
    "4 จังหวะ",
    ["GSX-R150", "Raider 150", "M-Slaz"],
  ],
  [
    "SUZUKI",
    "Suzuki ออโต้",
    "Burgman",
    "รุ่นใหม่",
    "2018-ปัจจุบัน",
    "ออโต้",
    "4 จังหวะ",
    ["Address", "Step 125", "NMAX 155 2020+"],
  ],
  [
    "SUZUKI",
    "Suzuki 2 จังหวะ",
    "RC80",
    "รุ่นเก่า",
    "1980-1990",
    "ครอบครัว",
    "2 จังหวะ",
    ["RC100", "RC110", "Crystal"],
  ],
  [
    "SUZUKI",
    "Suzuki 2 จังหวะ",
    "RC100",
    "รุ่นเก่า",
    "1985-1995",
    "ครอบครัว",
    "2 จังหวะ",
    ["RC80", "RC110", "Crystal"],
  ],
  [
    "SUZUKI",
    "Suzuki 2 จังหวะ",
    "RC110",
    "รุ่นเก่า",
    "1990-2000",
    "ครอบครัว",
    "2 จังหวะ",
    ["RC100", "Crystal", "Sprinter"],
  ],
  [
    "SUZUKI",
    "Suzuki 2 จังหวะ",
    "Crystal",
    "รุ่นเก่า",
    "1992-2000",
    "ครอบครัว",
    "2 จังหวะ",
    ["RC110", "Sprinter", "Akira"],
  ],
  [
    "SUZUKI",
    "Suzuki 2 จังหวะ",
    "Sprinter",
    "รุ่นเก่า",
    "1995-2002",
    "สปอร์ต",
    "2 จังหวะ",
    ["Akira", "RGV", "Crystal"],
  ],
  [
    "SUZUKI",
    "Suzuki 2 จังหวะ",
    "Akira",
    "รุ่นเก่า",
    "1997-2003",
    "สปอร์ต",
    "2 จังหวะ",
    ["Sprinter", "RGV", "Crystal"],
  ],
  [
    "SUZUKI",
    "Suzuki 2 จังหวะ",
    "RGV",
    "รุ่นเก่า",
    "1990-1998",
    "สปอร์ต",
    "2 จังหวะ",
    ["Sprinter", "Akira", "GSX-R150"],
  ],
  // ===== ฐานรุ่นรถเพิ่มเติม (ขยายสำหรับงานขายอะไหล่) =====
  ["HONDA", "Wave/Dream", "Dream Super Cub", "รุ่นเก่า", "1986-1996", "ครอบครัว", "4 จังหวะ", ["Dream 100", "Wave 100", "Super Cub"]],
  ["HONDA", "Wave/Dream", "Dream 125", "รุ่นเก่า", "2002-2006", "ครอบครัว", "4 จังหวะ", ["Wave 125", "Wave 125R", "Dream 100"]],
  ["HONDA", "Wave/Dream", "Wave 110i 2025+", "รุ่นใหม่", "2025-ปัจจุบัน", "ครอบครัว", "4 จังหวะ", ["Wave 110i 2019-2024", "Wave 125i 2023+", "Super Cub"]],
  ["HONDA", "ออโต้ Honda", "Click 125i 2018-2022", "รุ่นใหม่", "2018-2022", "ออโต้", "4 จังหวะ", ["Click 125i", "Click 150i", "Click 160"]],
  ["HONDA", "ออโต้ Honda", "Vario 125", "รุ่นใหม่", "2018-ปัจจุบัน", "ออโต้", "4 จังหวะ", ["Click 125i", "Vario 150", "Vario 160"]],
  ["HONDA", "ออโต้ Honda", "Vario 150", "รุ่นเก่า", "2015-2021", "ออโต้", "4 จังหวะ", ["Click 150i", "Vario 125", "Vario 160"]],
  ["HONDA", "ออโต้ Honda", "Vario 160", "รุ่นใหม่", "2022-ปัจจุบัน", "ออโต้", "4 จังหวะ", ["Click 160", "Vario 150", "ADV 160"]],
  ["HONDA", "ออโต้ Honda", "Moove 110i", "รุ่นเก่า", "2014-2017", "ออโต้", "4 จังหวะ", ["Spacy-i", "Scoopy-i", "Click 110i"]],
  ["HONDA", "ออโต้ Honda", "Icon 110i", "รุ่นเก่า", "2009-2012", "ออโต้", "4 จังหวะ", ["Click 110i", "Scoopy-i", "Spacy-i"]],
  ["HONDA", "ออโต้ Honda", "Air Blade 125", "รุ่นเก่า", "2013-2018", "ออโต้", "4 จังหวะ", ["Click 125i", "PCX 150", "Vario 125"]],
  ["HONDA", "บิ๊กสกู๊ตเตอร์", "PCX 125", "รุ่นเก่า", "2010-2013", "ออโต้", "4 จังหวะ", ["PCX 150", "Click 125i", "ADV 150"]],
  ["HONDA", "บิ๊กสกู๊ตเตอร์", "PCX 150 2012-2013", "รุ่นเก่า", "2012-2013", "ออโต้", "4 จังหวะ", ["PCX 125", "PCX 150", "ADV 150"]],
  ["HONDA", "บิ๊กสกู๊ตเตอร์", "Forza 250", "รุ่นเก่า", "2008-2012", "ออโต้", "4 จังหวะ", ["Forza 300", "Forza 350", "XMAX 300"]],
  ["HONDA", "สปอร์ต Honda", "MSX 125 SF", "รุ่นใหม่", "2016-2020", "สปอร์ต", "4 จังหวะ", ["MSX 125", "CBR150R", "Grom 125"]],
  ["HONDA", "สปอร์ต Honda", "Grom 125", "รุ่นใหม่", "2021-ปัจจุบัน", "สปอร์ต", "4 จังหวะ", ["MSX 125", "MSX 125 SF", "CBR150R"]],
  ["HONDA", "สปอร์ต Honda", "CB150R", "รุ่นใหม่", "2017-ปัจจุบัน", "เนกเก็ต", "4 จังหวะ", ["CBR150R", "R15", "GSX-S150"]],
  ["HONDA", "สปอร์ต Honda", "CBR250R", "รุ่นเก่า", "2011-2016", "สปอร์ต", "4 จังหวะ", ["CBR250RR", "Ninja 250", "CBR150R"]],
  ["HONDA", "สปอร์ต Honda", "CBR250RR", "รุ่นใหม่", "2017-ปัจจุบัน", "สปอร์ต", "4 จังหวะ", ["CBR250R", "Ninja 250", "Ninja 400"]],
  ["HONDA", "สปอร์ต Honda", "CRF250L", "รุ่นใหม่", "2012-ปัจจุบัน", "ออฟโรด", "4 จังหวะ", ["CRF300L", "KLX150", "D-Tracker150"]],
  ["HONDA", "สปอร์ต Honda", "CRF300L", "รุ่นใหม่", "2021-ปัจจุบัน", "ออฟโรด", "4 จังหวะ", ["CRF250L", "KLX150", "D-Tracker150"]],

  ["YAMAHA", "Mio/Fino/Nouvo", "Mio 125i", "รุ่นใหม่", "2015-2018", "ออโต้", "4 จังหวะ", ["Mio 115i", "Mio 125", "Fino 115i"]],
  ["YAMAHA", "Mio/Fino/Nouvo", "Mio 125 M3", "รุ่นใหม่", "2015-ปัจจุบัน", "ออโต้", "4 จังหวะ", ["Mio 125", "Fino FI", "GT125"]],
  ["YAMAHA", "Mio/Fino/Nouvo", "Fino 125 Blue Core", "รุ่นใหม่", "2016-ปัจจุบัน", "ออโต้", "4 จังหวะ", ["Fino FI", "Grand Filano", "Mio 125"]],
  ["YAMAHA", "Yamaha ออโต้", "Filano 125", "รุ่นเก่า", "2012-2014", "ออโต้", "4 จังหวะ", ["Grand Filano", "Fino FI", "QBIX"]],
  ["YAMAHA", "Yamaha ออโต้", "Grand Filano Hybrid 2023+", "รุ่นใหม่", "2023-ปัจจุบัน", "ออโต้", "4 จังหวะ", ["Grand Filano Hybrid", "Fazzio 125", "Fino FI"]],
  ["YAMAHA", "Yamaha ออโต้", "Fazzio 125", "รุ่นใหม่", "2022-ปัจจุบัน", "ออโต้", "4 จังหวะ", ["Grand Filano Hybrid", "Fino FI", "QBIX"]],
  ["YAMAHA", "Yamaha ออโต้", "FreeGo 125", "รุ่นใหม่", "2019-ปัจจุบัน", "ออโต้", "4 จังหวะ", ["Fazzio 125", "Grand Filano Hybrid", "LEXI"]],
  ["YAMAHA", "Yamaha ออโต้", "NMAX 155 2024+", "รุ่นใหม่", "2024-ปัจจุบัน", "ออโต้", "4 จังหวะ", ["NMAX 155 2020+", "AEROX 155 2021+", "LEXI"]],
  ["YAMAHA", "Yamaha ออโต้", "AEROX 155 2025+", "รุ่นใหม่", "2025-ปัจจุบัน", "ออโต้", "4 จังหวะ", ["AEROX 155 2021+", "NMAX 155 2024+", "LEXI"]],
  ["YAMAHA", "Yamaha ออโต้", "LEXI VVA", "รุ่นใหม่", "2020-ปัจจุบัน", "ออโต้", "4 จังหวะ", ["LEXI", "NMAX 155 2020+", "AEROX 155 2021+"]],
  ["YAMAHA", "Yamaha ออโต้", "XMAX 300 2023+", "รุ่นใหม่", "2023-ปัจจุบัน", "ออโต้", "4 จังหวะ", ["XMAX 300", "Forza 350", "ADV 350"]],
  ["YAMAHA", "ครอบครัว/สปอร์ต Yamaha", "Finn 115", "รุ่นใหม่", "2017-ปัจจุบัน", "ครอบครัว", "4 จังหวะ", ["Finn 115i", "Spark 115i", "Spark Nano"]],
  ["YAMAHA", "ครอบครัว/สปอร์ต Yamaha", "Jupiter RC", "รุ่นเก่า", "2010-2015", "ครอบครัว", "4 จังหวะ", ["Spark 115i", "Exciter 150", "Finn 115i"]],
  ["YAMAHA", "ครอบครัว/สปอร์ต Yamaha", "Jupiter MX", "รุ่นเก่า", "2006-2014", "สปอร์ต", "4 จังหวะ", ["Exciter 150", "Spark 115i", "M-Slaz"]],
  ["YAMAHA", "ครอบครัว/สปอร์ต Yamaha", "XSR155", "รุ่นใหม่", "2019-ปัจจุบัน", "เนกเก็ต", "4 จังหวะ", ["MT-15", "R15", "M-Slaz"]],
  ["YAMAHA", "ครอบครัว/สปอร์ต Yamaha", "MT-15", "รุ่นใหม่", "2018-ปัจจุบัน", "เนกเก็ต", "4 จังหวะ", ["XSR155", "R15", "M-Slaz"]],
  ["YAMAHA", "ครอบครัว/สปอร์ต Yamaha", "R15M", "รุ่นใหม่", "2022-ปัจจุบัน", "สปอร์ต", "4 จังหวะ", ["R15", "MT-15", "XSR155"]],
  ["YAMAHA", "ครอบครัว/สปอร์ต Yamaha", "R3", "รุ่นใหม่", "2015-ปัจจุบัน", "สปอร์ต", "4 จังหวะ", ["MT-03", "Ninja 400", "CBR250RR"]],
  ["YAMAHA", "ครอบครัว/สปอร์ต Yamaha", "MT-03", "รุ่นใหม่", "2016-ปัจจุบัน", "เนกเก็ต", "4 จังหวะ", ["R3", "Z400", "CBR250RR"]],

  ["KAWASAKI", "Kawasaki ครอบครัว", "Cheer 112", "รุ่นเก่า", "1998-2005", "ครอบครัว", "4 จังหวะ", ["Kaze", "Kaze R", "ZX130"]],
  ["KAWASAKI", "Kawasaki ครอบครัว", "Edge 125", "รุ่นเก่า", "2006-2010", "ครอบครัว", "4 จังหวะ", ["ZX130", "Athlete", "Kaze R"]],
  ["KAWASAKI", "Kawasaki ออฟโรด", "KLX140", "รุ่นใหม่", "2008-ปัจจุบัน", "ออฟโรด", "4 จังหวะ", ["KLX150", "D-Tracker150", "CRF250L"]],
  ["KAWASAKI", "Kawasaki ออฟโรด", "KLX230", "รุ่นใหม่", "2019-ปัจจุบัน", "ออฟโรด", "4 จังหวะ", ["KLX150", "CRF300L", "D-Tracker150"]],
  ["KAWASAKI", "Kawasaki สปอร์ต", "Ninja 250SL", "รุ่นเก่า", "2015-2018", "สปอร์ต", "4 จังหวะ", ["Ninja 250", "Z250SL", "CBR250R"]],
  ["KAWASAKI", "Kawasaki สปอร์ต", "Z250SL", "รุ่นเก่า", "2015-2018", "เนกเก็ต", "4 จังหวะ", ["Ninja 250SL", "Z250", "CBR250R"]],
  ["KAWASAKI", "Kawasaki สปอร์ต", "Ninja 500", "รุ่นใหม่", "2024-ปัจจุบัน", "สปอร์ต", "4 จังหวะ", ["Ninja 400", "Z500", "Ninja 300"]],
  ["KAWASAKI", "Kawasaki สปอร์ต", "Z500", "รุ่นใหม่", "2024-ปัจจุบัน", "เนกเก็ต", "4 จังหวะ", ["Ninja 500", "Z400", "Ninja 400"]],
  ["KAWASAKI", "Kawasaki สปอร์ต", "Ninja ZX-25R", "รุ่นใหม่", "2020-ปัจจุบัน", "สปอร์ต", "4 จังหวะ", ["Ninja 250", "Ninja 400", "CBR250RR"]],
  ["KAWASAKI", "Kawasaki สปอร์ต", "Versys-X 300", "รุ่นใหม่", "2017-ปัจจุบัน", "ทัวริ่ง", "4 จังหวะ", ["Ninja 300", "Z300", "KLX230"]],
  ["KAWASAKI", "Kawasaki สปอร์ต", "W175", "รุ่นใหม่", "2017-ปัจจุบัน", "คลาสสิก", "4 จังหวะ", ["Z250", "XSR155", "CB150R"]],

  ["SUZUKI", "Suzuki ครอบครัว", "Best 110", "รุ่นเก่า", "1998-2005", "ครอบครัว", "4 จังหวะ", ["Smash 110", "Shogun", "Smash Revo"]],
  ["SUZUKI", "Suzuki ครอบครัว", "Best 125", "รุ่นเก่า", "2004-2009", "ครอบครัว", "4 จังหวะ", ["Shogun", "Smash Revo", "Step 125"]],
  ["SUZUKI", "Suzuki ครอบครัว", "Raider R150", "รุ่นเก่า", "2005-2013", "สปอร์ต", "4 จังหวะ", ["Raider 150", "Satria F150", "GSX-R150"]],
  ["SUZUKI", "Suzuki สปอร์ต", "Satria F150", "รุ่นใหม่", "2016-ปัจจุบัน", "สปอร์ต", "4 จังหวะ", ["Raider 150", "Raider R150", "GSX-R150"]],
  ["SUZUKI", "Suzuki ออโต้", "Nex 115", "รุ่นเก่า", "2012-2016", "ออโต้", "4 จังหวะ", ["Nex II", "Address", "Step 125"]],
  ["SUZUKI", "Suzuki ออโต้", "Nex II", "รุ่นใหม่", "2018-ปัจจุบัน", "ออโต้", "4 จังหวะ", ["Nex 115", "Address", "Burgman"]],
  ["SUZUKI", "Suzuki ออโต้", "Skydrive 125", "รุ่นเก่า", "2009-2014", "ออโต้", "4 จังหวะ", ["Step 125", "Address", "Nex 115"]],
  ["SUZUKI", "Suzuki ออโต้", "Hayate 125", "รุ่นเก่า", "2007-2012", "ออโต้", "4 จังหวะ", ["Skydrive 125", "Step 125", "Address"]],
  ["SUZUKI", "Suzuki ออโต้", "Burgman Street 125EX", "รุ่นใหม่", "2023-ปัจจุบัน", "ออโต้", "4 จังหวะ", ["Burgman", "Address", "Nex II"]],
  ["SUZUKI", "Suzuki สปอร์ต", "Gixxer 150", "รุ่นใหม่", "2014-ปัจจุบัน", "เนกเก็ต", "4 จังหวะ", ["GSX-S150", "GSX-R150", "Raider 150"]],
  ["SUZUKI", "Suzuki สปอร์ต", "V-Strom 250", "รุ่นใหม่", "2017-ปัจจุบัน", "ทัวริ่ง", "4 จังหวะ", ["GSX-R150", "Versys-X 300", "Gixxer 150"]],
];
const vehicles: Vehicle[] = raw.map(
  ([
    brand,
    family,
    model,
    generation,
    yearRange,
    engineType,
    stroke,
    relatedModels,
  ]) => ({
    brand,
    family,
    model,
    generation,
    yearRange,
    engineType,
    stroke,
    relatedModels,
  }),
);
const channels = ["oon0521", "zeen_z27", "มินเล่ยน", "shopee"];
const defaults = [
  ["Wave 125R", "Wave 125S", "Wave 125i 2012-2018"],
  ["NMAX 155 2020+", "AEROX 155 2021+", "LEXI"],
  ["Click 125i", "Click 150i", "Click 160"],
  ["Mio", "Fino", "Nouvo MX"],
];
const makeSlots = (): Slot[] =>
  channels.map((channel, i) => ({
    id: `slot-${i}`,
    channel,
    vehicles: defaults[i].map((m) => vehicles.find((v) => v.model === m)!),
    parts:
      i === 0
        ? ["ชุดชามหน้า", "โซ่สเตอร์"]
        : i === 1
          ? ["สายพาน", "เม็ดชาม"]
          : ["ผ้าเบรก"],
    status: "ยังไม่ได้ทำ",
    note: "",
  }));
const statusColor: Record<Status, string> = {
  ยังไม่ได้ทำ: "#73819a",
  กำลังทำ: "#f6b84a",
  เสร็จแล้ว: "#38d899",
};
const thaiDate = (iso: string) =>
  new Intl.DateTimeFormat("th-TH", { dateStyle: "full" }).format(
    new Date(`${iso}T12:00:00`),
  );

export default function App() {
  const [page, setPage] = useState("หน้าหลัก");
const [selectedChannel, setSelectedChannel] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [slots, setSlots] = useState<Slot[]>(makeSlots);
  const [saved, setSaved] = useState<SavedWork[]>([]);
  const [productWorks, setProductWorks] = useState<ProductWork[]>([]);
  const [aiProvider, setAiProvider] = useState<"openai" | "gemini">("openai");
  const [aiStatus, setAiStatus] = useState({ openai: false, gemini: false });
  const [selected, setSelected] = useState<Slot | null>(null);
  const [menu, setMenu] = useState(false);
  const [brand, setBrand] = useState("HONDA");
  const [model, setModel] = useState("Wave 125R");
  useEffect(() => {
    const x = localStorage.getItem(`mpai-plan-${date}`),
      y = localStorage.getItem("mpai-saved"),
      z = localStorage.getItem("mpai-product-works");
    if (x) setSlots(JSON.parse(x));
    else setSlots(makeSlots());
    if (y) setSaved(JSON.parse(y));
    if (z) setProductWorks(JSON.parse(z));
    const provider = localStorage.getItem("ai_provider");
    if (provider === "openai" || provider === "gemini") setAiProvider(provider);
    fetch("/api/ai/status").then((r) => r.json()).then(setAiStatus).catch(() => undefined);
  }, [date]);
  const chooseAI = (provider: "openai" | "gemini") => { setAiProvider(provider); localStorage.setItem("ai_provider", provider); };
  const persist = (next: Slot[]) => {
    setSlots(next);
    localStorage.setItem(`mpai-plan-${date}`, JSON.stringify(next));
  };
  const changeSlot = (id: string, patch: Partial<Slot>) =>
    persist(slots.map((s) => (s.id === id ? { ...s, ...patch } : s)));
 const reshuffle = (s: Slot) => {
  const family = s.vehicles[0]?.family;

  if (!family) return;

  const pool = vehicles.filter((v) => v.family === family);

  if (pool.length === 0) return;

  const seedText = `${date}-${s.channel}-${family}`;
  let seed = 0;

  for (let i = 0; i < seedText.length; i++) {
    seed = (seed * 31 + seedText.charCodeAt(i)) >>> 0;
  }

  const shuffled = [...pool].sort(() => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296 - 0.5;
  });

  const pick = shuffled.slice(0, Math.min(3, shuffled.length));

  changeSlot(s.id, {
    vehicles: pick,
    parts: [],
    status: "ยังไม่ได้ทำ",
  });
};
  const saveWork = (s: Slot) => {
    const item = { ...s, date, savedAt: new Date().toLocaleString("th-TH") };
    const next = [
      item,
      ...saved.filter((x) => !(x.date === date && x.id === s.id)),
    ];
    setSaved(next);
    localStorage.setItem("mpai-saved", JSON.stringify(next));
  };
  const todayDone = slots.filter((s) => s.status === "เสร็จแล้ว").length;
  const productCount = slots.reduce((n, s) => n + s.parts.length, 0);
  const menuItems = [
    ["หน้าหลัก", Sparkles],
    ["ตารางขายประจำวัน", CalendarDays],
    ["ช่อง TikTok", Bike],
    ["รุ่นรถทั้งหมด", ClipboardList],
    ["ตระกูลอะไหล่ร่วม", Package],
    ["รายการอะไหล่", ShoppingBag],
    ["ผลงานที่บันทึก", FileText],
    ["ตั้งค่า", Settings],
  ] as const;
  const chosen = vehicles.find((v) => v.model === model)!;
  const related = vehicles.filter((v) =>
    chosen.relatedModels.includes(v.model),
  );
  const saveProductWork = (work: ProductWork) => {
    const next = [work, ...productWorks];
    setProductWorks(next);
    localStorage.setItem("mpai-product-works", JSON.stringify(next));
    setPage("ผลงานที่บันทึก");
  };
  const pageTitle =
    page === "หน้าหลัก" ? "ผู้ช่วยวางแผนขายอะไหล่มอเตอร์ไซค์" : page;
  return (
    <main className="min-h-screen bg-[#080d16] text-slate-100">
      <aside
        className={`fixed z-30 h-screen w-72 border-r border-slate-800 bg-[#0d1421] p-5 transition-transform md:translate-x-0 ${menu ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="mb-9 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-orange-500">
            <Bike />
          </div>
          <div>
            <b className="text-lg">Motorcycle Parts AI</b>
            <p className="text-xs text-slate-400">ผู้ช่วยร้านอะไหล่</p>
          </div>
        </div>
        <nav className="space-y-1">
          {menuItems.map(([name, Icon]) => (
            <button
              key={name}
              onClick={() => {
                setPage(name);
                setMenu(false);
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left text-base transition ${page === name ? "bg-orange-500 text-white shadow-lg shadow-orange-950/40" : "text-slate-300 hover:bg-slate-800"}`}
            >
              <Icon size={20} />
              {name}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-slate-700 bg-slate-800/60 p-3 text-xs text-slate-400">
          <CircleHelp size={16} className="mb-1 text-orange-400" />
          ข้อมูลบันทึกอยู่ในเบราว์เซอร์เครื่องนี้
        </div>
      </aside>
      <div className="md:ml-72">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-800 bg-[#080d16]/90 px-5 py-4 backdrop-blur md:px-9">
          <div className="flex items-center gap-3">
            <button
              className="rounded-lg bg-slate-800 p-2 md:hidden"
              onClick={() => setMenu(!menu)}
            >
              <Menu />
            </button>
            <div>
              <p className="text-sm text-slate-400">{thaiDate(date)}</p>
              <h1 className="text-xl font-bold md:text-2xl">{pageTitle}</h1>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            พร้อมใช้งาน
          </div>
        </header>
        <section className="p-5 md:p-9">
          {page === "หน้าหลัก" && (
            <>
              <button
                onClick={() => setPage("สร้างงานขายสินค้า")}
                className="mb-7 flex w-full items-center justify-center gap-3 rounded-2xl bg-orange-500 px-6 py-5 text-xl font-bold shadow-lg shadow-orange-950/40 transition hover:bg-orange-400"
              >
                <Plus size={28} />+ สร้างงานขายสินค้า
              </button>
              <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Stat
                  label="ช่องที่ต้องทำวันนี้"
                  value="4"
                  icon={<ClipboardList />}
                  color="bg-blue-500"
                />
                <Stat
                  label="ทำเสร็จแล้ว"
                  value={`${todayDone}`}
                  icon={<Check />}
                  color="bg-emerald-500"
                />
                <Stat
                  label="เหลืออยู่"
                  value={`${4 - todayDone}`}
                  icon={<RefreshCw />}
                  color="bg-orange-500"
                />
                <Stat
                  label="สินค้าเลือกวันนี้"
                  value={`${productCount}`}
                  icon={<Package />}
                  color="bg-violet-500"
                />
              </div>
              <PlanGrid
                slots={slots}
                onEdit={setSelected}
                onShuffle={reshuffle}
                onDone={(s) => changeSlot(s.id, { status: "เสร็จแล้ว" })}
              />
            </>
          )}
          {page === "สร้างงานขายสินค้า" && (
            <AIProductCreator provider={aiProvider} onProviderChange={chooseAI} onSave={saveProductWork} />
          )}
          {page === "ตารางขายประจำวัน" && (
            <>
              <div className="mb-6 flex flex-wrap items-end gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <div>
                  <label className="mb-1 block text-sm text-slate-400">
                    เลือกวัน
                  </label>
                  <input
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    type="date"
                    className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
                  />
                </div>
                <button
                  onClick={() => setDate(new Date().toISOString().slice(0, 10))}
                  className="rounded-lg bg-slate-800 px-4 py-2.5"
                >
                  วันนี้
                </button>
                <button
                  onClick={() => {
                    const d = new Date();
                    d.setDate(d.getDate() + 1);
                    setDate(d.toISOString().slice(0, 10));
                  }}
                  className="rounded-lg bg-slate-800 px-4 py-2.5"
                >
                  พรุ่งนี้
                </button>
                <p className="ml-auto text-sm text-slate-400">
                  จัดกลุ่มตามตระกูลเดียวกันเพื่อช่วยหาอะไหล่ร่วม
                </p>
              </div>
              <PlanGrid
                slots={selectedChannel ? slots.filter((s) => s.channel === selectedChannel) : slots}
                onEdit={setSelected}
                onShuffle={reshuffle}
                onDone={(s) => changeSlot(s.id, { status: "เสร็จแล้ว" })}
              />
            </>
          )}
          {page === "ตระกูลอะไหล่ร่วม" && (
            <div className="max-w-4xl">
              <p className="mb-6 text-slate-400">
                ค้นหารุ่นใกล้เคียงเพื่อวางแผนสินค้าอย่างรอบคอบ
              </p>
              <div className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:grid-cols-2">
                <Select
                  label="ยี่ห้อ"
                  value={brand}
                  onChange={(v) => {
                    setBrand(v);
                    setModel(vehicles.find((x) => x.brand === v)!.model);
                  }}
                  options={[...new Set(vehicles.map((x) => x.brand))]}
                />
                <Select
                  label="รุ่นรถ"
                  value={model}
                  onChange={setModel}
                  options={vehicles
                    .filter((x) => x.brand === brand)
                    .map((x) => x.model)}
                />
              </div>
              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                <InfoCard
                  title="รถรุ่นที่ใกล้เคียง"
                  items={related.map((x) => `${x.model} · ${x.yearRange}`)}
                />
                <InfoCard
                  title="หมวดอะไหล่ที่อาจใช้ร่วม"
                  items={
                    chosen.engineType === "ออโต้"
                      ? [
                          "ชุดชามหน้า / เม็ดชาม",
                          "สายพาน / คลัตช์",
                          "ผ้าเบรก / ยาง",
                        ]
                      : [
                          "โซ่สเตอร์ / ลูกปืน",
                          "ผ้าเบรก / จานเบรก",
                          "ไดสตาร์ท / เฟืองสตาร์ท",
                        ]
                  }
                />
              </div>
              <div className="mt-5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-200">
                ⚠️ รุ่นที่แนะนำเป็นเพียงแนวทาง ต้องตรวจปีรถ รหัสเครื่อง และ Part
                Number ก่อนขายทุกครั้ง
                ไม่ได้หมายความว่าอะไหล่ทุกชิ้นใช้ร่วมกันได้
              </div>
            </div>
          )}
          {page === "รุ่นรถทั้งหมด" && <VehicleTable rows={vehicles} />}{" "}
          {page === "รายการอะไหล่" && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {parts.map((p, i) => (
                <div
                  key={p}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-4"
                >
                  <span className="mb-2 grid h-9 w-9 place-items-center rounded-lg bg-orange-500/15 text-orange-400">
                    <Package size={19} />
                  </span>
                  <b>{p}</b>
                  <p className="mt-1 text-sm text-slate-400">
                    พร้อมเลือกใช้งาน
                  </p>
                </div>
              ))}
            </div>
          )}
          {page === "ผลงานที่บันทึก" && (
            <>
              <ProductWorks rows={productWorks} />
              <div className="mt-8">
                <h2 className="mb-3 text-lg font-bold">แผนตารางขายที่บันทึก</h2>
                <SavedList rows={saved} />
              </div>
            </>
          )}{" "}
          {page === "ตั้งค่า" && <AISettings provider={aiProvider} status={aiStatus} onProviderChange={chooseAI} />}
          {["ช่อง TikTok"].includes(page) && (
            <>
  <div className="grid gap-4 md:grid-cols-2">
    {["oon0521", "zeen_z27", "มินเล่ยน", "shopee"].map((channel) => (
      <button
  key={channel}
  type="button"
 onClick={() => {
  setSelectedChannel(channel);
  setPage("ตารางขายประจำวัน");
}}
  className="w-full rounded-2xl border border-slate-800 bg-slate-900 p-5 text-left transition hover:border-orange-500 hover:bg-slate-800"
>
  <h2 className="text-xl font-bold">{channel}</h2>
  <p className="mt-2 text-sm text-slate-400">
    ดูรุ่นรถ อะไหล่ และแผนขายของช่องนี้
  </p>
  <p className="mt-4 text-sm font-bold text-orange-400">
    เปิดแผนขาย →
  </p>
</button>
    ))}
  </div>
</>
          )}
        </section>
      </div>
      {selected && (
        <Editor
          slot={selected}
          onClose={() => setSelected(null)}
          onSave={(s) => {
            changeSlot(s.id, s);
            saveWork(s);
            setSelected(null);
          }}
        />
      )}
    </main>
  );
}

function Stat({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div
        className={`mb-4 grid h-10 w-10 place-items-center rounded-xl ${color}`}
      >
        {icon}
      </div>
      <p className="text-sm text-slate-400">{label}</p>
      <b className="mt-1 block text-3xl">{value}</b>
    </div>
  );
}
function PlanGrid({
  slots,
  onEdit,
  onShuffle,
  onDone,
}: {
  slots: Slot[];
  onEdit: (s: Slot) => void;
  onShuffle: (s: Slot) => void;
  onDone: (s: Slot) => void;
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      {slots.map((s) => (
        <article
          key={s.id}
          className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl shadow-black/10"
        >
          <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-orange-500/15 text-orange-400">
                <Bike size={21} />
              </div>
              <b className="text-lg">{s.channel}</b>
            </div>
            <span
              className="rounded-full px-3 py-1 text-sm"
              style={{
                backgroundColor: `${statusColor[s.status]}22`,
                color: statusColor[s.status],
              }}
            >
              {s.status}
            </span>
          </div>
          <div className="p-5">
            <div className="space-y-2">
              {s.vehicles.map((v, i) => (
                <div
                  className="flex items-center gap-3 rounded-xl bg-slate-800/70 px-3 py-2.5"
                  key={v.model}
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-slate-700 text-sm text-slate-300">
                    {i + 1}
                  </span>
                  <div>
                    <b>{v.model}</b>
                    <span className="ml-2 text-xs text-slate-400">
                      {v.brand} · {v.family}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {s.parts.map((p) => (
                <span
                  key={p}
                  className="rounded-full bg-orange-500/10 px-3 py-1 text-sm text-orange-300"
                >
                  {p}
                </span>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                onClick={() => onEdit(s)}
                className="rounded-lg bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700"
              >
                เปลี่ยนรุ่นรถ
              </button>
              <button
                onClick={() => onShuffle(s)}
                className="flex items-center gap-1 rounded-lg bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700"
              >
                <RefreshCw size={15} />
                สุ่มใหม่
              </button>
              <button
                onClick={() => onEdit(s)}
                className="rounded-lg bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700"
              >
                เลือกอะไหล่
              </button>
              <button
                onClick={() => onEdit(s)}
                className="rounded-lg bg-blue-600 px-3 py-2 text-sm hover:bg-blue-500"
              >
                <Save size={15} className="mr-1 inline" />
                บันทึก
              </button>
              <button
                onClick={() => onDone(s)}
                className="ml-auto rounded-lg bg-emerald-600 px-3 py-2 text-sm hover:bg-emerald-500"
              >
                <Check size={15} className="mr-1 inline" />
                ทำเสร็จแล้ว
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
function Editor({
  slot,
  onClose,
  onSave,
}: {
  slot: Slot;
  onClose: () => void;
  onSave: (s: Slot) => void;
}) {
  const [draft, setDraft] = useState(slot);
  const allVehicleOptions = [...vehicles].sort((a, b) =>
    `${a.brand}-${a.model}`.localeCompare(`${b.brand}-${b.model}`),
  );
  const updateVehicle = (i: number, m: string) => {
    const next = [...draft.vehicles];
    next[i] = vehicles.find((v) => v.model === m)!;
    setDraft({ ...draft, vehicles: next });
  };
  const toggle = (p: string) =>
    setDraft({
      ...draft,
      parts: draft.parts.includes(p)
        ? draft.parts.filter((x) => x !== p)
        : [...draft.parts, p],
    });
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-black/70 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-700 bg-[#111a29] p-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">แก้ไขแผน: {slot.channel}</h2>
            <p className="text-sm text-slate-400">
              เลือกรุ่นรถได้จากฐานข้อมูลทั้งหมดทุกยี่ห้อ
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg bg-slate-800 p-2">
            <X />
          </button>
        </div>
        <div className="space-y-3">
          {draft.vehicles.map((v, i) => (
            <Select
              key={i}
              label={`รถรุ่นที่ ${i + 1}`}
              value={v.model}
              onChange={(x) => updateVehicle(i, x)}
              options={allVehicleOptions.map((x) => x.model)}
            />
          ))}
        </div>
        <h3 className="mt-6 font-bold">เลือกอะไหล่</h3>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {parts.map((p) => (
            <button
              key={p}
              onClick={() => toggle(p)}
              className={`rounded-lg border px-3 py-2 text-left text-sm ${draft.parts.includes(p) ? "border-orange-500 bg-orange-500/15 text-orange-200" : "border-slate-700 bg-slate-800 text-slate-300"}`}
            >
              {draft.parts.includes(p) && "✓ "}
              {p}
            </button>
          ))}
        </div>
        <label className="mt-5 block text-sm text-slate-300">
          หมายเหตุ
          <textarea
            value={draft.note}
            onChange={(e) => setDraft({ ...draft, note: e.target.value })}
            placeholder="เช่น เน้นทำคลิปชุดชามหน้า"
            className="mt-1 min-h-20 w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"
          />
        </label>
        <div className="mt-5 flex gap-3">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-5 py-3"
          >
            ยกเลิก
          </button>
          <button
            onClick={() => onSave(draft)}
            className="flex-1 rounded-lg bg-orange-500 px-5 py-3 font-bold hover:bg-orange-400"
          >
            <Save size={17} className="mr-2 inline" />
            บันทึกผลงาน
          </button>
        </div>
      </div>
    </div>
  );
}
function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="block text-sm text-slate-300">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
function InfoCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <h3 className="mb-4 font-bold">{title}</h3>
      <div className="space-y-2">
        {items.map((i) => (
          <div
            key={i}
            className="flex items-center gap-2 rounded-lg bg-slate-800/70 p-3 text-slate-200"
          >
            <ChevronRight size={16} className="text-orange-400" />
            {i}
          </div>
        ))}
      </div>
    </div>
  );
}
function VehicleTable({ rows }: { rows: Vehicle[] }) {
  const [q, setQ] = useState("");
  const data = rows.filter((x) =>
    `${x.brand}${x.family}${x.model}`.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="ค้นหารุ่นรถ หรือยี่ห้อ..."
        className="mb-5 w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-3 text-white"
      />
      <div className="overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-slate-900 text-slate-400">
            <tr>
              <th className="p-4">ยี่ห้อ</th>
              <th>ตระกูล</th>
              <th>รุ่น</th>
              <th>ปี</th>
              <th>เครื่องยนต์</th>
              <th>จังหวะ</th>
            </tr>
          </thead>
          <tbody>
            {data.map((v) => (
              <tr key={v.model} className="border-t border-slate-800">
                <td className="p-4 text-orange-300">{v.brand}</td>
                <td>{v.family}</td>
                <td className="font-semibold">{v.model}</td>
                <td>{v.yearRange}</td>
                <td>{v.engineType}</td>
                <td>{v.stroke}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-slate-400">ทั้งหมด {data.length} รุ่น</p>
    </>
  );
}
function SavedList({ rows }: { rows: SavedWork[] }) {
  return rows.length ? (
    <div className="space-y-3">
      {rows.map((r, i) => (
        <div
          key={`${r.savedAt}${i}`}
          className="rounded-xl border border-slate-800 bg-slate-900 p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <b>{r.channel}</b>
              <p className="text-sm text-slate-400">
                {thaiDate(r.date)} · บันทึกเมื่อ {r.savedAt}
              </p>
            </div>
            <span style={{ color: statusColor[r.status] }}>{r.status}</span>
          </div>
          <p className="mt-3">{r.vehicles.map((v) => v.model).join(" · ")}</p>
          <div className="mt-3 flex gap-2">
            {r.parts.map((p) => (
              <span
                className="rounded-full bg-orange-500/10 px-2 py-1 text-xs text-orange-300"
                key={p}
              >
                {p}
              </span>
            ))}
          </div>
          {r.note && (
            <p className="mt-3 text-sm text-slate-400">หมายเหตุ: {r.note}</p>
          )}
        </div>
      ))}
    </div>
  ) : (
    <Empty
      title="ยังไม่มีผลงานที่บันทึก"
      text="กดปุ่ม “บันทึก” ในตารางขายประจำวันเพื่อเก็บประวัติไว้ที่นี่"
    />
  );
}
function Empty({ title, text }: { title: string; text: string }) {
  return (
    <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-8 text-center">
      <div>
        <Package className="mx-auto mb-3 text-orange-400" size={34} />
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="mt-2 max-w-md text-slate-400">{text}</p>
      </div>
    </div>
  );
}

type UIAIResult = { analysis: { productName:string; productType:string; shape:string; color:string; material:string; estimatedSize:string; compatibleModels:string[]; sellingPoints:string[]; recommendedCharacter:string; recommendedScene:string }; imagePrompt:string; videoScenes:{scene:number;videoPrompt:string;thaiSpeech:string}[]; caption:string; hashtags:string[] };
function AISettings({provider,status,onProviderChange}:{provider:"openai"|"gemini";status:{openai:boolean;gemini:boolean};onProviderChange:(p:"openai"|"gemini")=>void}) { const [message,setMessage]=useState(""); const test=async(p:"openai"|"gemini")=>{setMessage("กำลังทดสอบ AI...");try{const r=await fetch("/api/ai/test",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:p})});const d=await r.json();setMessage(d.message||d.error)}catch{setMessage("AI ไม่สามารถประมวลผลได้ กรุณาลองใหม่อีกครั้ง")}}; return <div className="mx-auto max-w-3xl"><h2 className="mb-2 text-xl font-bold">ผู้ให้บริการ AI</h2><p className="mb-5 text-slate-400">เลือกผู้ให้บริการสำหรับวิเคราะห์สินค้าและสร้างคอนเทนต์ (API Key อยู่เฉพาะฝั่งเซิร์ฟเวอร์)</p><div className="grid gap-4 md:grid-cols-2">{(["openai","gemini"] as const).map(p=><div key={p} className={`rounded-2xl border p-5 ${provider===p?'border-orange-500 bg-orange-500/10':'border-slate-700 bg-slate-900'}`}><button onClick={()=>onProviderChange(p)} className="w-full text-left"><b className="text-xl">{p==="openai"?"OpenAI":"Google Gemini"}</b><p className={`mt-2 ${status[p]?'text-emerald-400':'text-amber-300'}`}>{status[p]?"● พร้อมใช้งาน":"● ยังไม่ได้ใส่ API Key"}</p><p className="mt-2 text-sm text-slate-400">{provider===p?"กำลังเลือกใช้งาน":"กดเพื่อเลือกใช้"}</p></button><button onClick={()=>test(p)} className="mt-4 w-full rounded-lg bg-slate-800 px-4 py-3 hover:bg-slate-700">ทดสอบ {p==="openai"?"OpenAI":"Gemini"}</button></div>)}</div>{message&&<div className="mt-5 rounded-xl border border-slate-700 bg-slate-900 p-4">{message}</div>}<p className="mt-6 text-sm text-slate-400">ตั้งค่า Key ที่ไฟล์ <code className="text-orange-300">.env.local</code> โดยใช้ OPENAI_API_KEY หรือ GEMINI_API_KEY และรีสตาร์ตเซิร์ฟเวอร์</p></div>}
function AIProductCreator({provider,onProviderChange,onSave}:{provider:"openai"|"gemini";onProviderChange:(p:"openai"|"gemini")=>void;onSave:(work:ProductWork)=>void}) { const [photos,setPhotos]=useState<string[]>([]);const [name,setName]=useState("");const [brand,setBrand]=useState("");const [vehicleModel,setVehicleModel]=useState("");const [year,setYear]=useState("");const [partCode,setPartCode]=useState("");const [description,setDescription]=useState("");const [channel,setChannel]=useState<"TikTok"|"Shopee">("TikTok");const [character,setCharacter]=useState("");const [scene,setScene]=useState("");const [lens,setLens]=useState<"Hero"|"Macro">("Hero");const [sceneCount,setSceneCount]=useState(2);const [result,setResult]=useState<UIAIResult|null>(null);const [loading,setLoading]=useState(false);const [error,setError]=useState("");const compress=(file:File)=>new Promise<string>((resolve,reject)=>{const r=new FileReader();r.onload=()=>{const img=new Image();img.onload=()=>{const scale=Math.min(1,1280/Math.max(img.width,img.height));const c=document.createElement("canvas");c.width=Math.round(img.width*scale);c.height=Math.round(img.height*scale);c.getContext("2d")?.drawImage(img,0,0,c.width,c.height);resolve(c.toDataURL("image/jpeg",.84))};img.onerror=()=>reject();img.src=String(r.result)};r.onerror=()=>reject();r.readAsDataURL(file)});const upload=async(list:FileList|null)=>{if(!list)return;const next=await Promise.all(Array.from(list).slice(0,5-photos.length).map(compress));setPhotos(p=>[...p,...next])};const generate=async()=>{setError("");setLoading(true);try{const r=await fetch("/api/ai/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider,task:"generate",images:photos,productData:{name,brand,vehicleModel,year,partCode,description,channel,sceneCount,lens,character,scene}})});const data=await r.json();if(!r.ok)throw new Error(data.error);setResult(data);setCharacter(data.analysis.recommendedCharacter||character);setScene(data.analysis.recommendedScene||scene)}catch(e){setError(e instanceof Error?e.message:"AI ไม่สามารถประมวลผลได้ กรุณาลองใหม่อีกครั้ง")}finally{setLoading(false)}};const copy=(text:string)=>navigator.clipboard.writeText(text).then(()=>alert("คัดลอกเรียบร้อยแล้ว"));const save=()=>{if(!result)return;const a=result.analysis;onSave({id:crypto.randomUUID(),createdAt:new Date().toLocaleString("th-TH"),photos,name:a.productName||name,brand,vehicleModel,year,partCode,description,channel,analysis:[`สินค้าคือ: ${a.productType}`,`รูปร่าง: ${a.shape}`,`สี: ${a.color}`,`วัสดุ: ${a.material}`,`ขนาด: ${a.estimatedSize}`,...a.sellingPoints],character:character||a.recommendedCharacter,scene:scene||a.recommendedScene,lens,imagePrompt:result.imagePrompt,videoScenes:result.videoScenes.map(s=>({prompt:s.videoPrompt,speech:s.thaiSpeech})),caption:result.caption,hashtags:result.hashtags})};return <div className="mx-auto max-w-5xl space-y-6"><div className="rounded-2xl border border-orange-500/40 bg-slate-900 p-5"><div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-2xl font-bold">สร้างงานขายสินค้า</h2><p className="mt-1 text-slate-400">AI ที่กำลังใช้: <b className="text-orange-300">{provider==="openai"?"OpenAI":"Gemini"}</b></p></div><div className="flex gap-2"><select value={provider} onChange={e=>onProviderChange(e.target.value as "openai"|"gemini")} className="rounded-lg bg-slate-800 px-3 py-2"><option value="openai">OpenAI</option><option value="gemini">Gemini</option></select><button disabled={loading} onClick={generate} className="rounded-xl bg-orange-500 px-5 py-3 font-bold disabled:opacity-50"><Wand2 className="mr-2 inline"/>{loading?"AI กำลังวิเคราะห์สินค้า กรุณารอสักครู่...":"AI สร้างทั้งหมด"}</button></div></div></div><section className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><h3 className="mb-4 text-lg font-bold">ข้อมูลสินค้า</h3><label className="mb-4 block rounded-xl border-2 border-dashed border-slate-700 p-5 text-center"><ImageIcon className="mx-auto mb-2 text-orange-400"/><b>อัปโหลดรูปสินค้า 1–5 รูป</b><input className="hidden" type="file" accept="image/*" multiple onChange={e=>upload(e.target.files)}/></label><div className="mb-4 flex gap-2 overflow-x-auto">{photos.map((p,i)=><div className="relative shrink-0" key={p}><img className="h-20 w-20 rounded-lg object-cover" src={p} alt="รูปสินค้า"/><button onClick={()=>setPhotos(photos.filter((_,x)=>x!==i))} className="absolute -right-1 -top-1 rounded-full bg-red-500 p-1"><X size={12}/></button></div>)}</div><div className="grid gap-3 md:grid-cols-2"><Input label="ชื่อสินค้า" value={name} set={setName}/><Input label="ยี่ห้อ" value={brand} set={setBrand}/><Input label="รุ่นรถ" value={vehicleModel} set={setVehicleModel}/><Input label="ปีรถ" value={year} set={setYear}/><Input label="รหัสอะไหล่" value={partCode} set={setPartCode}/><label className="text-sm">ช่องที่จะขาย<select value={channel} onChange={e=>setChannel(e.target.value as "TikTok"|"Shopee")} className="mt-1 w-full rounded-lg bg-slate-800 p-3"><option>TikTok</option><option>Shopee</option></select></label></div><label className="mt-3 block text-sm">รายละเอียดสินค้า<textarea value={description} onChange={e=>setDescription(e.target.value)} className="mt-1 min-h-20 w-full rounded-lg bg-slate-800 p-3"/></label><div className="mt-4 flex flex-wrap gap-2"><button onClick={generate} disabled={loading} className="rounded-lg bg-blue-600 px-5 py-3 font-bold disabled:opacity-50">AI วิเคราะห์สินค้า</button><button onClick={()=>{setCharacter("");setScene("");generate()}} disabled={loading} className="rounded-lg bg-slate-800 px-5 py-3">AI คิดให้</button><button onClick={()=>setCharacter(character?"":"ช่างหญิงไทย ชุดช่างสีดำ")} className="rounded-lg bg-slate-800 px-5 py-3">เปลี่ยนชุดตัวละคร</button><button onClick={()=>setScene(scene?"":"Workshop มอเตอร์ไซค์สมัยใหม่")} className="rounded-lg bg-slate-800 px-5 py-3">เปลี่ยนฉาก</button></div></section>{error&&<div className="rounded-xl border border-red-500/50 bg-red-500/10 p-4 text-red-200">{error}</div>}{result&&<><section className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><h3 className="mb-3 text-lg font-bold">ผลวิเคราะห์สินค้า</h3><div className="grid gap-3 md:grid-cols-2">{Object.entries(result.analysis).filter(([k])=>!['compatibleModels','sellingPoints'].includes(k)).map(([k,v])=><div key={k} className="rounded-lg bg-slate-800 p-3"><b>{({productName:'สินค้า',productType:'ประเภท',shape:'รูปร่าง',color:'สี',material:'วัสดุ',estimatedSize:'ขนาดโดยประมาณ',recommendedCharacter:'ชุดตัวละคร',recommendedScene:'ฉากหลัง'} as Record<string,string>)[k]}: </b>{String(v)}</div>)}</div><p className="mt-3 text-sm text-slate-300">รถรุ่นที่ใช้ได้: {result.analysis.compatibleModels.join(', ')}</p><p className="mt-2 text-sm text-slate-300">จุดเด่น: {result.analysis.sellingPoints.join(' · ')}</p></section><section className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><h3 className="mb-3 text-lg font-bold">สร้างภาพโฆษณา</h3><div className="mb-3 flex gap-2">{(['Hero','Macro'] as const).map(x=><button key={x} onClick={()=>setLens(x)} className={`rounded-lg px-4 py-2 ${lens===x?'bg-orange-500':'bg-slate-800'}`}>เลนส์ {x}</button>)}</div><PromptBox label="Image Prompt ภาษาอังกฤษ · 9:16" text={result.imagePrompt} onCopy={()=>copy(result.imagePrompt)}/></section><section className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><h3 className="mb-3 text-lg font-bold">วิดีโอ</h3><div className="mb-3 flex gap-2">{[1,2,3].map(n=><button key={n} onClick={()=>setSceneCount(n)} className={`rounded-lg px-4 py-2 ${sceneCount===n?'bg-orange-500':'bg-slate-800'}`}>{n} ฉาก</button>)}</div>{result.videoScenes.map(s=><div key={s.scene} className="mb-3 rounded-lg border border-slate-700 p-4"><b>ฉาก {s.scene}</b><PromptBox label="Video Prompt ภาษาอังกฤษ" text={s.videoPrompt} onCopy={()=>copy(`${s.videoPrompt}\nบทพูด: ${s.thaiSpeech}`)}/><p className="mt-3 rounded-lg bg-orange-500/10 p-3">บทพูดประมาณ 8 วินาที: {s.thaiSpeech}</p></div>)}<button onClick={()=>copy(result.videoScenes.map(s=>`${s.videoPrompt}\nบทพูด: ${s.thaiSpeech}`).join('\n\n'))} className="w-full rounded-lg bg-slate-800 py-3">คัดลอก Video Prompt + บทพูด</button></section><section className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><h3 className="mb-2 text-lg font-bold">Caption + Hashtags</h3><p className="rounded-lg bg-slate-800 p-4">{result.caption}<br/><span className="text-orange-300">{result.hashtags.join(' ')}</span></p><button onClick={()=>copy(`${result.caption}\n${result.hashtags.join(' ')}`)} className="mt-3 w-full rounded-lg bg-slate-800 py-3">คัดลอก Caption + Hashtags</button></section><button onClick={save} className="w-full rounded-2xl bg-emerald-600 py-5 text-xl font-bold">บันทึกผลงาน</button></>}</div>}
function ProductCreator({ onSave }: { onSave: (work: ProductWork) => void }) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [year, setYear] = useState("");
  const [partCode, setPartCode] = useState("");
  const [description, setDescription] = useState("");
  const [channel, setChannel] = useState<"TikTok" | "Shopee">("TikTok");
  const [character, setCharacter] = useState("ช่างหญิงไทยวัยทำงาน แต่งชุดช่างสีดำสะอาด");
  const [scene, setScene] = useState("ร้านขายอะไหล่มอเตอร์ไซค์สมัยใหม่");
  const [lens, setLens] = useState<"Hero" | "Macro">("Hero");
  const [sceneCount, setSceneCount] = useState(2);
  const [analysed, setAnalysed] = useState(false);
  const product = name || "อะไหล่มอเตอร์ไซค์";
  const compatible = vehicleModel || "รถรุ่นที่ระบุ";
  const analysis = [
    `สินค้าคือ: ${product}${partCode ? ` (รหัส ${partCode})` : ""}`,
    "รูปร่างและลักษณะ: อะไหล่ทรงวิศวกรรม รายละเอียดอ้างอิงจากภาพสินค้าอัปโหลด",
    "สี: ยึดตามสีจริงจากภาพต้นแบบ ห้ามเปลี่ยนโทนหรือพื้นผิว",
    "วัสดุ: โลหะและ/หรือพลาสติกวิศวกรรมตามชิ้นส่วนจริง",
    "ขนาดโดยประมาณ: แสดงสัดส่วนสมจริงสำหรับอะไหล่มอเตอร์ไซค์ ห้ามขยายเกินจริง",
    `รถรุ่นที่ใช้ได้: ${compatible}${year ? ` ปี ${year}` : ""} (ตรวจสอบ Part Number ก่อนขาย)`,
    "จุดเด่นสำหรับใช้ขาย: ชูความพอดีรุ่น ความคุ้มค่า และรายละเอียดงานที่มองเห็นได้",
    `ชุดตัวละครที่เหมาะกับสินค้า: ${character}`,
    `ฉากหลังที่เหมาะสม: ${scene}`,
  ];
  const imagePrompt = `Create a single vertical 9:16 photorealistic cinematic advertising image using the uploaded product photo as the exact reference. Show exactly one ${product}, preserving its original shape, construction, color, material and realistic motorcycle-part scale. Do not redesign, duplicate, replace, or distort the product. Place it prominently on a clean workshop counter in ${scene}. A consistent Thai motorcycle mechanic character wearing ${character} stands beside it and points toward the product, never holding it. ${lens === "Hero" ? "Hero product composition, 50mm lens, confident eye-level angle." : "Macro product-detail composition, 100mm macro lens, realistic scale and sharp surface detail."} Natural workshop lighting, sharp focus, premium commercial photography, realistic shadows. No collage, no inset, no split screen, no black borders, no generated text, no logos, no duplicate product or character.`;
  const cta = channel === "TikTok" ? "จิ้มที่ตะกร้าสั่งซื้อได้เลย" : "สนใจสั่งซื้อได้เลย";
  const videoScenes = Array.from({ length: sceneCount }, (_, i) => {
    const last = i === sceneCount - 1;
    const focus = i === 0 ? "introduces the product on the counter and points to its key visible feature" : last ? "points to the product with a confident purchase invitation" : "shows close product details while pointing to the feature";
    return { prompt: `Vertical 9:16, photorealistic cinematic video scene ${i + 1}/${sceneCount}. Use the exact same single ${product} from the uploaded reference, preserving its shape, color, material and realistic size. Same Thai mechanic character, same face, hairstyle and ${character}; same continuous ${scene}. The character ${focus}, never holds the product. Camera uses ${lens === "Hero" ? "a smooth 50mm hero dolly" : "a controlled 100mm macro detail move"}, natural lighting, sharp focus. No duplicate product, no duplicate character, no generated text, no collage, no split screen, no black border.`, speech: last ? `${product} ตรงรุ่น${compatible} ใช้งานคุ้มค่า ตรวจสอบรหัสก่อนสั่งนะครับ ${cta}` : `${product} ชิ้นนี้สำหรับ${compatible} งานดูดี รายละเอียดชัดเจน เลือกให้ตรงรุ่นก่อนใช้งานนะครับ` };
  });
  const caption = `${product}${partCode ? ` รหัส ${partCode}` : ""} สำหรับ${compatible}${year ? ` ปี ${year}` : ""} ตรวจรุ่นให้ตรงก่อนสั่ง ซื้อใช้งานง่าย คุ้มค่า พร้อมส่งครับ`;
  const hashtags = ["#อะไหล่มอเตอร์ไซค์", `#${(brand || "มอเตอร์ไซค์").replace(/\s/g, "")}`, "#อะไหล่แท้", "#ร้านอะไหล่", channel === "TikTok" ? "#TikTokShop" : "#Shopee"];
  const copy = async (text: string) => { await navigator.clipboard.writeText(text); alert("คัดลอกเรียบร้อยแล้ว"); };
  const files = (list: FileList | null) => { if (!list) return; Array.from(list).slice(0, 5 - photos.length).forEach(f => { const r = new FileReader(); r.onload = () => setPhotos(p => [...p, String(r.result)]); r.readAsDataURL(f); }); };
  const makeAll = () => setAnalysed(true);
  const save = () => onSave({ id: crypto.randomUUID(), createdAt: new Date().toLocaleString("th-TH"), photos, name: product, brand, vehicleModel: compatible, year, partCode, description, channel, analysis, character, scene, lens, imagePrompt, videoScenes, caption, hashtags });
  return <div className="mx-auto max-w-5xl space-y-6"><div className="rounded-2xl border border-orange-500/40 bg-gradient-to-r from-orange-500/15 to-slate-900 p-5"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h2 className="text-2xl font-bold">สร้างงานขายสินค้า</h2><p className="mt-1 text-slate-300">กรอกข้อมูลสินค้า แล้วให้ AI ช่วยจัดชุดคอนเทนต์ขายให้ครบ</p></div><button onClick={makeAll} className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-4 text-lg font-bold hover:bg-orange-400"><Wand2/>AI สร้างทั้งหมด</button></div></div><section className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><h3 className="mb-4 text-lg font-bold">1. ข้อมูลสินค้า</h3><label className="mb-4 block rounded-xl border-2 border-dashed border-slate-700 bg-slate-800/50 p-6 text-center hover:border-orange-500"><ImageIcon className="mx-auto mb-2 text-orange-400"/><b>อัปโหลดรูปสินค้า 1–5 รูป</b><p className="mt-1 text-sm text-slate-400">ใช้รูปเหล่านี้เป็นต้นแบบสินค้าใน Prompt</p><input className="hidden" type="file" accept="image/*" multiple onChange={e=>files(e.target.files)}/></label>{photos.length>0&&<div className="mb-5 flex gap-3 overflow-x-auto">{photos.map((p,i)=><div key={p} className="relative shrink-0"><img src={p} alt={`สินค้า ${i+1}`} className="h-24 w-24 rounded-lg object-cover"/><button onClick={()=>setPhotos(photos.filter((_,n)=>n!==i))} className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1"><X size={13}/></button></div>)}</div>}<div className="grid gap-4 md:grid-cols-2"><Input label="ชื่อสินค้า" value={name} set={setName} placeholder="เช่น ชุดชามหน้า Wave 125"/><Input label="ยี่ห้อ" value={brand} set={setBrand} placeholder="เช่น Honda"/><Input label="รุ่นรถ" value={vehicleModel} set={setVehicleModel} placeholder="เช่น Wave 125i"/><Input label="ปีรถ" value={year} set={setYear} placeholder="เช่น 2019-2022"/><Input label="รหัสอะไหล่" value={partCode} set={setPartCode} placeholder="เช่น 22110-KYZ"/><label className="block text-sm text-slate-300">ช่องที่จะขาย<select value={channel} onChange={e=>setChannel(e.target.value as "TikTok"|"Shopee")} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"><option>TikTok</option><option>Shopee</option></select></label></div><label className="mt-4 block text-sm text-slate-300">รายละเอียดสินค้า<textarea value={description} onChange={e=>setDescription(e.target.value)} className="mt-1 min-h-24 w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white" placeholder="บอกรายละเอียด จุดเด่น หรือสภาพสินค้าเพิ่มเติม"/></label><button onClick={()=>setAnalysed(true)} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 text-lg font-bold hover:bg-blue-500"><Wand2/>AI วิเคราะห์สินค้า</button></section>{analysed&&<><section className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><h3 className="mb-4 text-lg font-bold">2. ผลวิเคราะห์สินค้า</h3><div className="grid gap-3 md:grid-cols-2">{analysis.map(x=><div key={x} className="rounded-lg bg-slate-800 p-3 text-slate-200">{x}</div>)}</div></section><section className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><h3 className="mb-4 text-lg font-bold">3. สร้างภาพโฆษณา</h3><div className="grid gap-4 md:grid-cols-2"><Input label="ชุดตัวละคร" value={character} set={setCharacter}/><Input label="ฉาก" value={scene} set={setScene}/><label className="text-sm text-slate-300">เลนส์<div className="mt-1 flex gap-2">{(["Hero","Macro"] as const).map(x=><button key={x} onClick={()=>setLens(x)} className={`rounded-lg px-5 py-3 ${lens===x?'bg-orange-500':'bg-slate-800'}`}>{x}</button>)}</div></label><div className="flex flex-wrap items-end gap-2"><button onClick={()=>{setCharacter("ช่างหญิงไทยวัยทำงาน ชุดช่างสีดำสะอาด");setScene("Workshop มอเตอร์ไซค์สมัยใหม่")}} className="rounded-lg bg-slate-800 px-4 py-3">AI คิดให้</button><button onClick={()=>setCharacter("พนักงานร้านอะไหล่ชายไทย ชุดโปโลเข้ม") } className="rounded-lg bg-slate-800 px-4 py-3">เปลี่ยนชุดตัวละคร</button><button onClick={()=>setScene("ร้านขายอะไหล่มอเตอร์ไซค์ที่เป็นระเบียบ") } className="rounded-lg bg-slate-800 px-4 py-3">เปลี่ยนฉาก</button></div></div><PromptBox text={imagePrompt} onCopy={()=>copy(imagePrompt)} label="Image Prompt ภาษาอังกฤษ · 9:16"/></section><section className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><h3 className="mb-4 flex items-center gap-2 text-lg font-bold"><Video/>4. วิดีโอ</h3><div className="mb-4 flex items-center gap-2"><span className="text-sm text-slate-400">จำนวนฉาก</span>{[1,2,3].map(n=><button key={n} onClick={()=>setSceneCount(n)} className={`rounded-lg px-4 py-2 ${sceneCount===n?'bg-orange-500':'bg-slate-800'}`}>{n} ฉาก</button>)}</div>{videoScenes.map((s,i)=><div className="mb-4 rounded-xl border border-slate-700 p-4" key={i}><b>ฉากที่ {i+1}</b><PromptBox text={s.prompt} onCopy={()=>copy(`${s.prompt}\n\nบทพูด: ${s.speech}`)} label="Video Prompt ภาษาอังกฤษ"/><div className="mt-3 rounded-lg bg-orange-500/10 p-3 text-orange-100"><b>บทพูดประมาณ 8 วินาที:</b> {s.speech}</div></div>)}<button onClick={()=>copy(videoScenes.map((s,i)=>`ฉาก ${i+1}\n${s.prompt}\nบทพูด: ${s.speech}`).join("\n\n"))} className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-800 py-3"><Copy size={17}/>คัดลอก Video Prompt + บทพูด</button></section><section className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><h3 className="mb-3 text-lg font-bold">5. Caption + Hashtags</h3><p className="rounded-lg bg-slate-800 p-4">{caption}<br/><span className="text-orange-300">{hashtags.join(" ")}</span></p><button onClick={()=>copy(`${caption}\n${hashtags.join(" ")}`)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-800 py-3"><Copy size={17}/>คัดลอก Caption + Hashtags</button></section><button onClick={save} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-5 text-xl font-bold hover:bg-emerald-500"><Save/>บันทึกผลงาน</button></>}</div>;
}
function Input({label,value,set,placeholder}:{label:string;value:string;set:(v:string)=>void;placeholder?:string}){return <label className="block text-sm text-slate-300">{label}<input value={value} onChange={e=>set(e.target.value)} placeholder={placeholder} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"/></label>}
function PromptBox({label,text,onCopy}:{label:string;text:string;onCopy:()=>void}){return <div className="mt-4"><div className="mb-2 flex items-center justify-between"><b className="text-sm">{label}</b><button onClick={onCopy} className="flex items-center gap-1 rounded-lg bg-orange-500 px-3 py-2 text-sm"><Copy size={15}/>คัดลอก Prompt รูปภาพ</button></div><textarea readOnly value={text} className="min-h-40 w-full rounded-lg border border-slate-700 bg-[#080d16] p-3 text-sm leading-6 text-slate-300"/></div>}
function ProductWorks({rows}:{rows:ProductWork[]}){return <div>{rows.length>0&&<h2 className="mb-3 text-lg font-bold">ผลงานขายสินค้าที่บันทึก</h2>}{rows.length?<div className="space-y-3">{rows.map(w=><div key={w.id} className="rounded-xl border border-slate-800 bg-slate-900 p-5"><div className="flex flex-wrap justify-between gap-3"><div><b className="text-lg">{w.name}</b><p className="text-sm text-slate-400">{w.channel} · {w.createdAt}</p></div>{w.photos[0]&&<img src={w.photos[0]} alt={w.name} className="h-16 w-16 rounded-lg object-cover"/>}</div><p className="mt-3">{w.vehicleModel} {w.year && `· ${w.year}`} {w.partCode && `· ${w.partCode}`}</p><p className="mt-2 text-sm text-slate-400">{w.caption}</p></div>)}</div>:<Empty title="ยังไม่มีผลงานขายสินค้าที่บันทึก" text="สร้างงานขายสินค้า แล้วกดบันทึกผลงานเพื่อเก็บไว้ที่นี่"/>}</div>}
