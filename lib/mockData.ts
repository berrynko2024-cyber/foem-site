export type Artist = {
  id: string;
  slug: string;
  name: string;
  bio: string;
  bio_ko: string;
  photo: string;
  instagram?: string;
  youtube?: string;
  artworkCount: number;
  worksGrid?: 2;
  worksLayout?: 'portrait3-mixed';
};

export type Artwork = {
  id: string;
  title: string;
  title_ko: string;
  description: string;
  description_ko: string;
  price: number;
  category: "painting" | "photo" | "craft";
  images: string[];
  artistId: string;
  artistName: string;
  stock: number;
  isSold: boolean;
  year: number;
  medium?: string;
  dimensions?: string;
  orientation?: 'portrait' | 'landscape' | 'square';
  priceDisplay?: string;
};

export const artists: Artist[] = [
  {
    id: "a1",
    slug: "betty-moon",
    name: "Betty Moon",
    bio: "Betty Moon is a multidisciplinary artist working at the intersection of emotion and form. Her work explores the quiet spaces between feeling and expression.",
    bio_ko: "Betty Moon은 감정과 형태의 교차점에서 작업하는 다학제적 예술가입니다. 그녀의 작업은 감정과 표현 사이의 조용한 공간을 탐구합니다.",
    photo: "/artists/betty-moon.jpg",
    instagram: "@bettymoon",
    youtube: "https://www.youtube.com/@bettymoonstudio",
    artworkCount: 6,
    worksGrid: 2,
  },
  {
    id: "a2",
    slug: "uiyeong-park",
    name: "Uiyeong Park",
    bio: "Uiyeong Park's photography captures fleeting moments of urban solitude. Based between Seoul and Berlin, his lens finds beauty in the overlooked.",
    bio_ko: "Uiyeong Park의 사진은 도시 속 고독의 순간을 포착합니다. 서울과 베를린을 오가며 활동하는 그는 간과된 것들에서 아름다움을 찾습니다.",
    photo: "/artists/uiyeong-park.jpg",
    instagram: "@ui_yeong_park",
    artworkCount: 6,
  },
  {
    id: "a4",
    slug: "harin-j",
    name: "Harin J",
    bio: "My work is a process of reconstructing on canvas the trajectory of 'Difference', a path endlessly deferred and unsettled between presence and absence. The texture of memory, the density of emotion, and the afterglow of light are not fixed entities but traces that continually slip away and transform. For me, abstraction is neither a rule nor a limitation aimed at formal completion, but a vessel that embraces the indefinable fragments of life and truth of vanishing moments. Ultimately, my practice moves beyond constrained form to create a new field where what is fading may finally dwell. Within this space of warm hospitality toward the disappearing, we are invited to encounter our own authentic landscapes.",
    bio_ko: "나의 작업은 현시(Presence)와 부재(Absence) 사이에 끊임없이 미뤄지고 흔들리는 '차연(Difference)'의 궤적을 화면위에 재구성하는 과정이다. 캔버스 위에 새겨진 기억의 결, 감정의 밀도, 빛의 잔향은 고정된 실체가 아니라 미끄러지고 변화하는 흔적들이다. 나에게 추상이란 형식의 완결을 지향하는 규칙이나 제한이 아니라, 규정할 수 없는 삶의 파편들과 사라져가는 순간의 진실을 수용하는 '그릇'이다. 결국 나의 작업은 얽매인 형식에서 벗어나 소멸하는 것들이 비로소 머물 수 있는 새로운 장(Field)을 마련하는 일이며, 사라져가는 것들을 향한 이 따뜻한 환대의 공간 안에서 우리는 비로소 각자의 진실한 정경과 마주하게 된다.",
    photo: "/artists/harin-j.jpg",
    artworkCount: 6,
    worksLayout: 'portrait3-mixed',
  },
  {
    id: "a5",
    slug: "seong-eun-park",
    name: "Sung Eun Park",
    bio: "Sung Eun Park works with Korean traditional pigments, 24k gold leaf, and Hanji paper to create luminous compositions that bridge ancient craft and contemporary sensibility.",
    bio_ko: "박성은은 한국 전통 안료, 24k 금박, 한지를 사용해 전통 공예와 현대적 감수성을 잇는 빛나는 작업을 만들어냅니다.",
    photo: "/artists/seong-eun-park.jpg",
    artworkCount: 6,
  },
  {
    id: "a6",
    slug: "byeong-gwan-seo",
    name: "Byeong Gwan Seo",
    bio: "Byeong Gwan Seo explores structure and absence through sculpture and spatial practice.",
    bio_ko: "서병관은 조각과 공간 실천을 통해 구조와 부재를 탐구합니다.",
    photo: "/artists/byeong-gwan-seo.jpg",
    artworkCount: 0,
  },
  {
    id: "a7",
    slug: "jae-eun-jeong",
    name: "Jae Eun Jeong",
    bio: "Jae Eun Jeong's paintings hold suspended time — moments caught between breath and stillness.",
    bio_ko: "정재은의 회화는 정지된 시간을 품습니다 — 숨과 고요 사이에 포착된 순간들.",
    photo: "/artists/jae-eun-jeong.jpg",
    artworkCount: 0,
  },
  {
    id: "a8",
    slug: "young-jae-lee",
    name: "Young Jae Lee",
    bio: "Young Jae Lee is a glass artist whose work transforms light and form into luminous spatial experiences.",
    bio_ko: "이영재는 유리 작가로, 빛과 형태를 빛나는 공간 경험으로 변환합니다.",
    photo: "/artists/young-jae-lee.jpg",
    artworkCount: 0,
  },
];

export const artworks: Artwork[] = [
  {
    id: "w37",
    title: "My October",
    title_ko: "My October",
    description: "Oil on Canvas.",
    description_ko: "",
    price: 0,
    category: "painting",
    images: ["/artworks/harin-j/my-october.jpg"],
    artistId: "a4",
    artistName: "Harin J",
    stock: 0,
    isSold: true,
    year: 2025,
    medium: "Oil on Canvas",
    dimensions: "45 × 53 cm",
  },
  {
    id: "w38",
    title: "Green-Stained Memories",
    title_ko: "Green-Stained Memories",
    description: "Oil on Canvas.",
    description_ko: "",
    price: 0,
    category: "painting",
    images: ["/artworks/harin-j/green-stained-memories.jpg"],
    artistId: "a4",
    artistName: "Harin J",
    stock: 1,
    isSold: false,
    year: 2025,
    medium: "Oil on Canvas",
    dimensions: "60.6 × 50 cm",
    priceDisplay: "$1,000",
    orientation: "landscape",
  },
  {
    id: "w39",
    title: "Inner land scape",
    title_ko: "Inner land scape",
    description: "Oil, charcoal on Canvas.",
    description_ko: "",
    price: 0,
    category: "painting",
    images: ["/artworks/harin-j/inner-landscape.jpg"],
    artistId: "a4",
    artistName: "Harin J",
    stock: 0,
    isSold: true,
    year: 2025,
    medium: "Oil, charcoal on Canvas",
    dimensions: "53 × 53 cm",
    priceDisplay: "$900",
    orientation: "square",
  },
  {
    id: "w40",
    title: "Memory",
    title_ko: "Memory",
    description: "Oil on Canvas.",
    description_ko: "",
    price: 0,
    category: "painting",
    images: ["/artworks/harin-j/memory.jpg"],
    artistId: "a4",
    artistName: "Harin J",
    stock: 1,
    isSold: false,
    year: 2025,
    medium: "Oil on Canvas",
    dimensions: "53 × 65.2 cm",
    priceDisplay: "문의",
  },
  {
    id: "w41",
    title: "Spring Field",
    title_ko: "Spring Field",
    description: "Acrylic on Canvas.",
    description_ko: "",
    price: 0,
    category: "painting",
    images: ["/artworks/harin-j/spring-field.jpg"],
    artistId: "a4",
    artistName: "Harin J",
    stock: 1,
    isSold: false,
    year: 2023,
    medium: "Acrylic on Canvas",
    dimensions: "60.6 × 72.7 cm",
    priceDisplay: "$1,700",
  },
  {
    id: "w34",
    title: "Invite into the New World",
    title_ko: "새로운 세계로의 초대",
    description: "An invitation rendered in Korean traditional pigments and 24k gold leaf on Hanji. A threshold between the familiar and the unknown.",
    description_ko: "한국 전통 안료와 24k 금박, 한지 위에 담긴 초대. 익숙함과 낯섦 사이의 경계.",
    price: 4000000,
    category: "painting",
    images: ["/artworks/seong-eun-park/invite-into-the-new-world.jpg"],
    artistId: "a5",
    artistName: "Sung Eun Park",
    stock: 1,
    isSold: false,
    year: 2025,
    medium: "Korean pigment, 24k gold leaf, Hanji",
    dimensions: "60.6 × 60.6 cm",
    orientation: "square",
  },
  {
    id: "w35",
    title: "Invite into a New World G",
    title_ko: "새로운 세계로의 초대 G",
    description: "A gold-inflected variation on the threshold motif. 24k gold leaf dominates the surface, drawing the viewer into an luminous beyond.",
    description_ko: "경계의 모티프를 금빛으로 변주한 작품. 24k 금박이 화면을 가득 채우며 찬란한 너머로 이끕니다.",
    price: 4000000,
    category: "painting",
    images: ["/artworks/seong-eun-park/invite-into-a-new-world-g.jpg"],
    artistId: "a5",
    artistName: "Sung Eun Park",
    stock: 1,
    isSold: false,
    year: 2025,
    medium: "Korean pigment, 24k gold leaf, Hanji",
    dimensions: "60.6 × 60.6 cm",
    orientation: "square",
  },
  {
    id: "w36",
    title: "The Moment We Met II",
    title_ko: "우리가 만난 순간 II",
    description: "A more intimate version of the encounter — smaller in scale, quieter in tone, yet no less charged with stillness.",
    description_ko: "만남의 더 작고 조용한 버전. 크기는 줄었지만 고요함의 밀도는 그대로입니다.",
    price: 2000000,
    category: "painting",
    images: ["/artworks/seong-eun-park/the-moment-we-met-ii.jpg"],
    artistId: "a5",
    artistName: "Sung Eun Park",
    stock: 1,
    isSold: false,
    year: 2026,
    medium: "Korean pigment, 24k gold leaf, Hanji",
    dimensions: "45 × 45 cm",
    orientation: "square",
  },
  {
    id: "w13",
    title: "Golden Cheonma",
    title_ko: "황금 천마",
    description: "A mythical horse rendered in Korean traditional pigments and 24k gold leaf on Hanji. The celestial steed moves through a field of pure gold.",
    description_ko: "한국 전통 안료와 24k 금박, 한지 위에 그려진 신화 속 천마. 황금빛 화면을 가로지르는 하늘의 말.",
    price: 4000000,
    category: "painting",
    images: ["/artworks/seong-eun-park/golden-cheonma.jpg"],
    artistId: "a5",
    artistName: "Sung Eun Park",
    stock: 1,
    isSold: false,
    year: 2025,
    medium: "Korean pigment, 24k gold leaf, Hanji",
    dimensions: "60.6 × 60.6 cm",
    orientation: "square",
  },
  {
    id: "w15",
    title: "The Moment We Met",
    title_ko: "우리가 만난 순간",
    description: "A square composition marking the stillness of a first encounter. Gold leaf catches the light like memory catching time.",
    description_ko: "처음 만남의 고요함을 담은 정방형 작품. 금박은 기억이 시간을 붙잡듯 빛을 포착합니다.",
    price: 6000000,
    category: "painting",
    images: ["/artworks/seong-eun-park/the-moment-we-met.jpg"],
    artistId: "a5",
    artistName: "Sung Eun Park",
    stock: 1,
    isSold: false,
    year: 2025,
    medium: "Korean pigment, 24k gold leaf, Hanji",
    dimensions: "72.7 × 72.7 cm",
    orientation: "square",
  },
  {
    id: "w14",
    title: "Golden Freedom",
    title_ko: "황금 자유",
    description: "A large-scale work exploring the tension between confinement and flight. Korean pigments and gold leaf create a luminous surface that shifts with the light.",
    description_ko: "구속과 비상 사이의 긴장을 탐구하는 대형 작품. 한국 안료와 금박이 빛에 따라 변하는 찬란한 표면을 만들어냅니다.",
    price: 16000000,
    category: "painting",
    images: ["/artworks/seong-eun-park/golden-freedom.jpg"],
    artistId: "a5",
    artistName: "Sung Eun Park",
    stock: 1,
    isSold: false,
    year: 2026,
    medium: "Korean pigment, 24k gold leaf, Hanji",
    dimensions: "145.5 × 97.0 cm",
    orientation: "landscape",
  },
  {
    id: "w25",
    title: "Light and Shadow",
    title_ko: "Light and Shadow",
    description: "Archival Pigment Print on Hahnemuhle Photo Rag Satin 310g Paper.",
    description_ko: "",
    price: 3000000,
    category: "photo",
    images: ["/artworks/betty-moon/light-and-shadow.jpg"],
    artistId: "a1",
    artistName: "Betty Moon",
    stock: 1,
    isSold: false,
    year: 2023,
    medium: "Archival Pigment Print on Hahnemuhle Photo Rag Satin 310g Paper",
    dimensions: "150 × 100 cm",
    orientation: "landscape",
  },
  {
    id: "w23",
    title: "Mother Nature",
    title_ko: "Mother Nature",
    description: "Archival Pigment Print on Hahnemuhle Photo Rag Satin 310g Paper.",
    description_ko: "",
    price: 3000000,
    category: "photo",
    images: ["/artworks/betty-moon/mother-nature.jpg"],
    artistId: "a1",
    artistName: "Betty Moon",
    stock: 1,
    isSold: false,
    year: 2023,
    medium: "Archival Pigment Print on Hahnemuhle Photo Rag Satin 310g Paper",
    dimensions: "150 × 100 cm",
    orientation: "landscape",
  },
  {
    id: "w24",
    title: "Arrival",
    title_ko: "Arrival",
    description: "Archival Pigment Print on Korean Traditional Paper (Hanji).",
    description_ko: "",
    price: 2000000,
    category: "photo",
    images: ["/artworks/betty-moon/arrival.jpg"],
    artistId: "a1",
    artistName: "Betty Moon",
    stock: 1,
    isSold: false,
    year: 2025,
    medium: "Archival Pigment Print on Korean Traditional Paper (Hanji)",
    dimensions: "60 × 90 cm",
    orientation: "landscape",
  },
  {
    id: "w27",
    title: "Table is Ready",
    title_ko: "Table is Ready",
    description: "Archival Pigment Print on Creamish Paper.",
    description_ko: "",
    price: 2000000,
    category: "photo",
    images: ["/artworks/betty-moon/table-is-ready.jpg"],
    artistId: "a1",
    artistName: "Betty Moon",
    stock: 1,
    isSold: false,
    year: 2020,
    medium: "Archival Pigment Print on Creamish Paper",
    dimensions: "90 × 52 cm",
    orientation: "landscape",
  },
  {
    id: "w26",
    title: "Returning to Myself II",
    title_ko: "Returning to Myself II",
    description: "Archival Pigment Print on Korean Traditional Paper (Hanji).",
    description_ko: "",
    price: 2000000,
    category: "photo",
    images: ["/artworks/betty-moon/returning-to-myself-ii.jpg"],
    artistId: "a1",
    artistName: "Betty Moon",
    stock: 1,
    isSold: false,
    year: 2025,
    medium: "Archival Pigment Print on Korean Traditional Paper (Hanji)",
    dimensions: "60 × 90 cm",
  },
  {
    id: "w22",
    title: "Returning to Myself I",
    title_ko: "나 자신으로 돌아오며 I",
    description: "Archival Pigment Print on Korean Traditional Paper (Hanji).",
    description_ko: "한지에 아카이벌 피그먼트 프린트.",
    price: 3000000,
    category: "photo",
    images: ["/artworks/betty-moon/returning-to-myself-i.jpg"],
    artistId: "a1",
    artistName: "Betty Moon",
    stock: 1,
    isSold: false,
    year: 2025,
    medium: "Archival Pigment Print on Korean Traditional Paper (Hanji)",
    dimensions: "120 × 80 cm",
    orientation: "landscape",
  },
  {
    id: "w31",
    title: "The Wall and the Wait 1_2",
    title_ko: "The Wall and the Wait 1_2",
    description: "Acrylic on Wooden Panel.",
    description_ko: "",
    price: 2000000,
    category: "painting",
    images: ["/artworks/uiyeong-park/the-wall-and-the-wait-1-2.jpg"],
    artistId: "a2",
    artistName: "Uiyeong Park",
    stock: 1,
    isSold: false,
    year: 2026,
    medium: "Acrylic on Wooden Panel",
    dimensions: "60.5 × 60.5 cm",
    orientation: "square",
  },
  {
    id: "w33",
    title: "The Wall and The Wait 2_6(O)",
    title_ko: "The Wall and The Wait 2_6(O)",
    description: "Mixed Media on Wooden Panel.",
    description_ko: "",
    price: 0,
    category: "painting",
    images: ["/artworks/uiyeong-park/the-wall-and-the-wait-2-6-o.jpg"],
    artistId: "a2",
    artistName: "Uiyeong Park",
    stock: 0,
    isSold: true,
    year: 2026,
    medium: "Mixed Media on Wooden Panel",
    dimensions: "45 × 45 cm",
    priceDisplay: "$700",
    orientation: "square",
  },
  {
    id: "w32",
    title: "The Wall and The Wait 2_6",
    title_ko: "The Wall and The Wait 2_6",
    description: "Mixed Media on Wooden Panel.",
    description_ko: "",
    price: 0,
    category: "painting",
    images: ["/artworks/uiyeong-park/the-wall-and-the-wait-2-6.jpg"],
    artistId: "a2",
    artistName: "Uiyeong Park",
    stock: 1,
    isSold: false,
    year: 2026,
    medium: "Mixed Media on Wooden Panel",
    dimensions: "45 × 45 cm",
    priceDisplay: "$700",
    orientation: "square",
  },
  {
    id: "w29",
    title: "dam da 4_11",
    title_ko: "dam da 4_11",
    description: "Mixed Media on Canvas.",
    description_ko: "",
    price: 3000000,
    category: "painting",
    images: ["/artworks/uiyeong-park/dam-da-4-11.jpg"],
    artistId: "a2",
    artistName: "Uiyeong Park",
    stock: 1,
    isSold: false,
    year: 2025,
    medium: "Mixed Media on Canvas",
    dimensions: "65 × 80 cm",
  },
  {
    id: "w30",
    title: "contenir 4_10",
    title_ko: "contenir 4_10",
    description: "Acrylic on Canvas.",
    description_ko: "",
    price: 0,
    category: "painting",
    images: ["/artworks/uiyeong-park/contenir-4-10.jpg"],
    artistId: "a2",
    artistName: "Uiyeong Park",
    stock: 1,
    isSold: false,
    year: 2025,
    medium: "Acrylic on Canvas",
    dimensions: "77 × 98 cm",
    priceDisplay: "$2,500",
  },
  {
    id: "w28",
    title: "contenir 3_5",
    title_ko: "contenir 3_5",
    description: "",
    description_ko: "",
    price: 0,
    category: "painting",
    images: ["/artworks/uiyeong-park/contenir-3-5.jpg"],
    artistId: "a2",
    artistName: "Uiyeong Park",
    stock: 0,
    isSold: true,
    year: 2025,
    medium: "Acrylic on Canvas",
    dimensions: "60.5 × 100 cm",
    priceDisplay: "$2,100",
  },
];

export type ArtistVideo = {
  id: string;
  artistId: string;
  artistSlug: string;
  artistName: string;
  title: string;
  duration?: string;
  url: string;         // YouTube watch URL
  thumbnail?: string;  // 비유튜브 영상용 수동 오버라이드
};

export const artistVideos: ArtistVideo[] = [
  {
    id: "v1",
    artistId: "a1",
    artistSlug: "betty-moon",
    artistName: "Betty Moon",
    title: "Mother Nature Exhibition",
    duration: "4:32",
    url: "https://www.youtube.com/watch?v=D83nSLLX00o",
  },
  {
    id: "v2",
    artistId: "a8",
    artistSlug: "young-jae-lee",
    artistName: "Young Jae Lee",
    title: "Glass Artist : Young Jae Lee Profile",
    duration: "7:15",
    url: "https://www.youtube.com/watch?v=4145YTRnG4E",
  },
  {
    id: "v3",
    artistId: "a5",
    artistSlug: "seong-eun-park",
    artistName: "Sung Eun Park",
    title: "Sung Eun Park",
    duration: "",
    url: "https://youtu.be/-Ldafm_vp88?si=ZVg74h3fDi3_YNbt",
  },
];

export type ArtFair = {
  id: string;
  name: string;
  venue: string;
  location: string;
  boothNumber?: string;
  artists: string[];
  previewDate?: string;
  startDate: string;
  endDate: string;
  status: "current" | "upcoming" | "past";
  coverImage: string;
  description?: string;
};

export const artFairs: ArtFair[] = [
  {
    id: "f5",
    name: "Affordable Art Fair Hong Kong 2026",
    venue: "Hong Kong Convention & Exhibition Centre",
    location: "Hong Kong",
    artists: ["Sung Eun Park"],
    previewDate: "2026-05-14",
    startDate: "2026-05-15",
    endDate: "2026-05-18",
    status: "current",
    coverImage: "/art-fairs/hong-kong-2026/affordable art fair.jpg",
    description: "Sung Eun Park presents works at the Affordable Art Fair Hong Kong 2026. VIP Preview May 14 (1pm–9:30pm) · May 15 (12pm–8:30pm) · May 16–17 (10am–8:30pm) · May 18 (10am–7pm).",
  },
  {
    id: "f7",
    name: "BANK Art Fair 2026 Spring",
    venue: "SETEC",
    location: "Seoul, Korea",
    artists: ["Sung Eun Park", "Young Jae Lee", "Insue Kim"],
    previewDate: "2026-04-30",
    startDate: "2026-04-30",
    endDate: "2026-05-03",
    status: "past",
    coverImage: "/art-fairs/bank-art-fair-2026-spring/bank art fair 2026.jpg",
  },
  {
    id: "f4",
    name: "ARTANKARA 2026",
    venue: "ATO Congresium",
    location: "Ankara, Turkey",
    artists: ["Betty Moon", "Uiyeong Park", "Harin J"],
    previewDate: "2026-03-24",
    startDate: "2026-03-25",
    endDate: "2026-03-29",
    status: "past",
    coverImage: "/art-fairs/artankara-2026/cover.jpg",
    description: "FOEM participated in ARTANKARA 2026, presenting works by Betty Moon, Uiyeong Park, and Harin J at Turkey's leading contemporary art fair.",
  },
  {
    id: "f8",
    name: "Seoul Art Show 2025",
    venue: "COEX",
    location: "Seoul, Korea",
    artists: ["Seong Eun Park"],
    previewDate: "2025-12-24",
    startDate: "2025-12-24",
    endDate: "2025-12-28",
    status: "past",
    coverImage: "/art-fairs/seoul-art-show-2025/seoul art show 2025.jpg",
  },
  {
    id: "f6",
    name: "AQUA Art Miami 2025",
    venue: "Aqua Hotel",
    location: "Miami Beach, FL",
    artists: ["Uiyeong Park"],
    startDate: "2025-12-03",
    endDate: "2025-12-07",
    status: "past",
    coverImage: "/art-fairs/aqua-art-miami-2025/aqua art miami 2025.jpg",
  },
];

export type Exhibition = {
  id: string;
  title: string;
  artists: string[];
  venue?: string;
  location: string;
  startDate: string;
  endDate: string;
  status: "current" | "upcoming" | "past";
  coverImage: string;
  description?: string;
  videoUrl?: string;
  orientation?: 'portrait' | 'landscape' | 'square';
};

export const exhibitions: Exhibition[] = [
  {
    id: "e10",
    title: 'bettymoon photographs "beyond the frame"',
    artists: ["Betty Moon"],
    location: "Seoul, Korea",
    startDate: "2026-06-08",
    endDate: "2026-06-18",
    status: "upcoming",
    coverImage: "/exhibitions/beyond the frame 2026/beyond the frame.jpg",
    orientation: "portrait",
  },
  {
    id: "e3",
    title: "Contained Forms",
    artists: ["Uiyeong Park"],
    venue: "Arko Art Center",
    location: "Seoul, Korea",
    startDate: "2026-09-01",
    endDate: "2026-10-15",
    status: "upcoming",
    coverImage: "/exhibitions/contained-forms-2026/cover.jpg",
    description: "A solo presentation of Uiyeong Park's ongoing series examining weight, boundary, and endurance.",
  },
  {
    id: "e2",
    title: "Surfaces & Memory",
    artists: ["Sung Eun Park"],
    venue: "Space K",
    location: "Seoul, Korea",
    startDate: "2026-07-10",
    endDate: "2026-08-30",
    status: "upcoming",
    coverImage: "/exhibitions/surfaces-memory-2026/cover.jpg",
    description: "Sung Eun Park presents new works exploring the spiritual resonance of Korean traditional materials.",
  },
  {
    id: "e1",
    title: "Field of Emotions — Group Exhibition",
    artists: ["Betty Moon", "Uiyeong Park", "Harin J"],
    venue: "FOEM Gallery",
    location: "Seoul, Korea",
    startDate: "2026-04-15",
    endDate: "2026-06-01",
    status: "current",
    coverImage: "/exhibitions/field-of-emotions-2026/cover.jpg",
    description: "A group exhibition exploring the intersection of emotion and material form across photography and painting.",
  },
  {
    id: "e7",
    title: "T.I.D.E — From 0 to 25: Erasing Boundaries, 25 Perspectives",
    artists: ["Betty Moon", "Uiyeong Park", "Seong Eun Park", "Harin J", "Byeong-gwan Seo", "Jae Eun Jeong", "Young Jae Lee", "Insue Kim"],
    venue: "수원시 만석전시관 제1전시실",
    location: "Suwon, Korea",
    startDate: "2026-03-02",
    endDate: "2026-03-09",
    status: "past",
    coverImage: "/exhibitions/tide-2026/from0to25.jpg",
    description: "25명의 작가가 사진, 조각, 회화 세 장르를 넘나드는 그룹전. 각자의 시선이 모여 새로운 흐름을 만듭니다.",
    videoUrl: "https://www.instagram.com/p/DVXjZGXCaNg/",
  },
  {
    id: "e8",
    title: "T.I.D.E X Abijou: Beauty in Our Mind",
    artists: ["Betty Moon", "Uiyeong Park", "Seong Eun Park", "Harin J", "Byeong-gwan Seo", "Jae Eun Jeong", "Young Jae Lee", "Insue Kim"],
    venue: "Noblesse Collection",
    location: "Seoul, Korea",
    startDate: "2025-12-03",
    endDate: "2025-12-09",
    status: "past",
    coverImage: "/exhibitions/tide-x-abijou-2025/T.I.D.E X Abijou- Beauty in Our Mind.jpg",
    description: "T.I.D.E와 Abijou의 협업 전시. '-다움(美, 自, 人)'을 키워드로 획일화된 미의 기준에 의문을 던지며, 다양한 언어와 문화적 배경을 가진 작가들이 각자의 서사로 정체성과 감정을 풀어냅니다.",
    videoUrl: "https://www.instagram.com/p/DR4LRVeCQus/",
  },
  {
    id: "e9",
    title: "Beyond the Mirror — 본질을 향하여",
    artists: ["Betty Moon", "Uiyeong Park", "Seong Eun Park", "Harin J", "Byeong-gwan Seo", "Jae Eun Jeong", "Young Jae Lee", "Insue Kim"],
    venue: "Gallery ArtewIth",
    location: "Seoul, Korea",
    startDate: "2025-11-05",
    endDate: "2025-11-12",
    status: "past",
    coverImage: "/exhibitions/beyond-the-mirror-2025/beyond the mirror.jpg",
    description: "T.I.D.E 기획 그룹전. 25개의 시선이 모여 경계를 넘어 새로운 흐름을 만드는 순간.",
    videoUrl: "https://www.instagram.com/p/DQrhF6lCb9r/",
  },
  {
    id: "e5",
    title: "Layered Light",
    artists: ["Harin J"],
    venue: "FOEM Gallery",
    location: "Seoul, Korea",
    startDate: "2025-11-01",
    endDate: "2026-01-15",
    status: "past",
    coverImage: "/exhibitions/layered-light-2025/cover.jpg",
    description: "Harin J's debut solo exhibition at FOEM Gallery, tracing the boundary between memory and perception through layered painting.",
  },
  {
    id: "e6",
    title: "Golden Ground",
    artists: ["Sung Eun Park", "Betty Moon"],
    venue: "Gallery Hyundai",
    location: "Seoul, Korea",
    startDate: "2025-06-10",
    endDate: "2025-08-20",
    status: "past",
    coverImage: "/exhibitions/golden-ground-2025/cover.jpg",
    description: "A dialogue between traditional Korean pigment work and contemporary photography.",
  },
  {
    id: "e4",
    title: "Mother Nature 2024",
    artists: ["Betty Moon"],
    venue: "Seoul, Korea",
    location: "Seoul, Korea",
    startDate: "2024-10-01",
    endDate: "2024-11-30",
    status: "past",
    coverImage: "/exhibitions/mother-nature-2024/mother nature 2024.jpg",
    description: "Betty Moon's solo exhibition presenting large-scale archival pigment prints that trace the boundary between the human body and the natural world.",
  },
];

export function getArtworksByArtist(artistId: string) {
  return artworks.filter((a) => a.artistId === artistId);
}

export function getArtworksByCategory(category: Artwork["category"]) {
  return artworks.filter((a) => a.category === category);
}

export function getArtistBySlug(slug: string) {
  return artists.find((a) => a.slug === slug);
}

export function getVideosByArtist(artistId: string) {
  return artistVideos.filter((v) => v.artistId === artistId);
}

export function getArtworkById(id: string) {
  return artworks.find((a) => a.id === id);
}

export function formatPrice(price: number, locale = "ko") {
  if (locale === "ko") {
    return price.toLocaleString("ko-KR") + "원";
  }
  return "₩" + price.toLocaleString("ko-KR");
}
