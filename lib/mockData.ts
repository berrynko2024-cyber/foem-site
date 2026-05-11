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
  dimensions?: string;
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
    artworkCount: 12,
  },
  {
    id: "a2",
    slug: "uiyeong-park",
    name: "Uiyeong Park",
    bio: "Uiyeong Park's photography captures fleeting moments of urban solitude. Based between Seoul and Berlin, his lens finds beauty in the overlooked.",
    bio_ko: "Uiyeong Park의 사진은 도시 속 고독의 순간을 포착합니다. 서울과 베를린을 오가며 활동하는 그는 간과된 것들에서 아름다움을 찾습니다.",
    photo: "/artists/uiyeong-park.jpg",
    instagram: "@uiyeongpark",
    artworkCount: 8,
  },
  {
    id: "a4",
    slug: "harin-j",
    name: "Harin J",
    bio: "Harin J works with light and layered surface to trace the boundary between memory and perception.",
    bio_ko: "Harin J는 빛과 겹쳐진 표면을 통해 기억과 인식 사이의 경계를 탐구합니다.",
    photo: "/artists/harin-j.jpg",
    artworkCount: 6,
  },
  {
    id: "a5",
    slug: "seong-eun-park",
    name: "Seong Eun Park",
    bio: "Seong Eun Park's practice moves between drawing and installation, examining how small gestures accumulate into presence.",
    bio_ko: "Seong Eun Park의 작업은 드로잉과 설치 사이를 오가며, 작은 몸짓이 존재로 쌓이는 과정을 탐구합니다.",
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
    artworkCount: 6,
  },
  {
    id: "a7",
    slug: "jae-eun-jeong",
    name: "Jae Eun Jeong",
    bio: "Jae Eun Jeong's paintings hold suspended time — moments caught between breath and stillness.",
    bio_ko: "정재은의 회화는 정지된 시간을 품습니다 — 숨과 고요 사이에 포착된 순간들.",
    photo: "/artists/jae-eun-jeong.jpg",
    artworkCount: 6,
  },
];

export const artworks: Artwork[] = [
  {
    id: "w1",
    title: "Drifting I",
    title_ko: "부유 I",
    description: "Acrylic on linen. A study in weightlessness and the feeling of being carried by something unseen.",
    description_ko: "리넨에 아크릴. 무중력과 보이지 않는 무언가에 실려가는 느낌에 대한 탐구.",
    price: 480000,
    category: "painting",
    images: ["https://placehold.co/800x1000/D4CFC8/4A4A4A?text=Drifting+I"],
    artistId: "a1",
    artistName: "Betty Moon",
    stock: 1,
    isSold: false,
    year: 2024,
    dimensions: "60 × 80 cm",
  },
  {
    id: "w2",
    title: "Drifting II",
    title_ko: "부유 II",
    description: "Acrylic on linen. Companion piece to Drifting I, exploring tension between stillness and motion.",
    description_ko: "리넨에 아크릴. 부유 I의 자매 작품으로, 정지와 움직임 사이의 긴장을 탐구합니다.",
    price: 520000,
    category: "painting",
    images: ["https://placehold.co/800x1000/C8C4BC/4A4A4A?text=Drifting+II"],
    artistId: "a1",
    artistName: "Betty Moon",
    stock: 1,
    isSold: false,
    year: 2024,
    dimensions: "60 × 80 cm",
  },
  {
    id: "w3",
    title: "Between Hours",
    title_ko: "시간 사이",
    description: "Oil on canvas. The liminal space of late afternoon — neither day nor evening.",
    description_ko: "캔버스에 유화. 낮도 저녁도 아닌, 늦은 오후의 경계 공간.",
    price: 720000,
    category: "painting",
    images: ["https://placehold.co/800x1000/E0DBD2/4A4A4A?text=Between+Hours"],
    artistId: "a1",
    artistName: "Betty Moon",
    stock: 1,
    isSold: false,
    year: 2023,
    dimensions: "90 × 120 cm",
  },
  {
    id: "w4",
    title: "Seoul, 3AM",
    title_ko: "서울, 새벽 3시",
    description: "Archival pigment print. Empty streets hold the memory of movement.",
    description_ko: "아카이벌 피그먼트 프린트. 빈 거리는 움직임의 기억을 품고 있습니다.",
    price: 320000,
    category: "photo",
    images: ["https://placehold.co/800x600/2A2A2A/E8E6E2?text=Seoul+3AM"],
    artistId: "a2",
    artistName: "Uiyeong Park",
    stock: 5,
    isSold: false,
    year: 2024,
    dimensions: "50 × 70 cm (Edition of 10)",
  },
  {
    id: "w5",
    title: "Commuters",
    title_ko: "통근자들",
    description: "Archival pigment print. Faces blurred by velocity, present yet unreachable.",
    description_ko: "아카이벌 피그먼트 프린트. 속도로 흐려진 얼굴들, 존재하지만 닿을 수 없는.",
    price: 280000,
    category: "photo",
    images: ["https://placehold.co/800x600/1A1A1A/E8E6E2?text=Commuters"],
    artistId: "a2",
    artistName: "Uiyeong Park",
    stock: 5,
    isSold: false,
    year: 2023,
    dimensions: "40 × 60 cm (Edition of 10)",
  },
  {
    id: "w6",
    title: "Window, Berlin",
    title_ko: "창문, 베를린",
    description: "Archival pigment print. Light through glass — the city filtered, softened.",
    description_ko: "아카이벌 피그먼트 프린트. 유리를 통과하는 빛 — 걸러지고 부드러워진 도시.",
    price: 340000,
    category: "photo",
    images: ["https://placehold.co/800x600/3A3530/E8E6E2?text=Window+Berlin"],
    artistId: "a2",
    artistName: "Uiyeong Park",
    stock: 3,
    isSold: false,
    year: 2024,
    dimensions: "50 × 70 cm (Edition of 5)",
  },
  {
    id: "w10",
    title: "Layered Light I",
    title_ko: "겹쳐진 빛 I",
    description: "Mixed media on paper. Light accumulates in folds, revealing what was always there.",
    description_ko: "종이에 혼합 매체. 빛이 겹침 속에 쌓이며, 언제나 거기 있었던 것을 드러냅니다.",
    price: 390000,
    category: "painting",
    images: ["https://placehold.co/800x1000/E8E2D8/4A4A4A?text=Layered+Light+I"],
    artistId: "a4",
    artistName: "Harin J",
    stock: 1,
    isSold: false,
    year: 2024,
    dimensions: "50 × 70 cm",
  },
  {
    id: "w11",
    title: "Layered Light II",
    title_ko: "겹쳐진 빛 II",
    description: "Mixed media on paper. A continuation of the light series — deeper, more still.",
    description_ko: "종이에 혼합 매체. 빛 연작의 연속 — 더 깊고, 더 고요한.",
    price: 420000,
    category: "painting",
    images: ["https://placehold.co/800x1000/DDD8CE/4A4A4A?text=Layered+Light+II"],
    artistId: "a4",
    artistName: "Harin J",
    stock: 1,
    isSold: false,
    year: 2024,
    dimensions: "50 × 70 cm",
  },
  {
    id: "w12",
    title: "Surface Memory",
    title_ko: "표면의 기억",
    description: "Ink and wax on canvas. The surface holds what passed over it.",
    description_ko: "캔버스에 잉크와 왁스. 표면은 그 위를 지나간 것들을 품습니다.",
    price: 560000,
    category: "painting",
    images: ["https://placehold.co/800x1000/D8D2C6/4A4A4A?text=Surface+Memory"],
    artistId: "a4",
    artistName: "Harin J",
    stock: 1,
    isSold: false,
    year: 2023,
    dimensions: "80 × 100 cm",
  },
  {
    id: "w13",
    title: "Small Gesture No. 1",
    title_ko: "작은 몸짓 1번",
    description: "Pencil and gouache on paper. A mark made once, never repeated.",
    description_ko: "종이에 연필과 구아슈. 한 번 그어진 선, 다시는 반복되지 않는.",
    price: 220000,
    category: "painting",
    images: ["https://placehold.co/800x1000/EAE6DE/4A4A4A?text=Small+Gesture+1"],
    artistId: "a5",
    artistName: "Seong Eun Park",
    stock: 1,
    isSold: false,
    year: 2024,
    dimensions: "30 × 40 cm",
  },
  {
    id: "w14",
    title: "Small Gesture No. 3",
    title_ko: "작은 몸짓 3번",
    description: "Pencil and gouache on paper. Three lines that hold a conversation.",
    description_ko: "종이에 연필과 구아슈. 대화를 품은 세 개의 선.",
    price: 240000,
    category: "painting",
    images: ["https://placehold.co/800x1000/E4E0D6/4A4A4A?text=Small+Gesture+3"],
    artistId: "a5",
    artistName: "Seong Eun Park",
    stock: 1,
    isSold: false,
    year: 2024,
    dimensions: "30 × 40 cm",
  },
  {
    id: "w15",
    title: "Accumulation Study",
    title_ko: "집적 연구",
    description: "Installation documentation print. What remains when nothing is removed.",
    description_ko: "설치 기록 프린트. 아무것도 제거되지 않았을 때 남는 것.",
    price: 310000,
    category: "photo",
    images: ["https://placehold.co/800x600/DCD8D0/4A4A4A?text=Accumulation"],
    artistId: "a5",
    artistName: "Seong Eun Park",
    stock: 3,
    isSold: false,
    year: 2023,
    dimensions: "60 × 80 cm (Edition of 5)",
  },
  {
    id: "w16",
    title: "Form Study I",
    title_ko: "형태 연구 I",
    description: "Cast concrete and steel wire. Tension held in minimal form.",
    description_ko: "캐스트 콘크리트와 철사. 최소한의 형태 안에 담긴 긴장.",
    price: 680000,
    category: "craft",
    images: ["https://placehold.co/800x800/D0CCC6/4A4A4A?text=Form+Study+I"],
    artistId: "a6",
    artistName: "Byeong Gwan Seo",
    stock: 1,
    isSold: false,
    year: 2024,
    dimensions: "H 35 × W 20 × D 15 cm",
  },
  {
    id: "w17",
    title: "Void Structure",
    title_ko: "빈 구조",
    description: "Welded steel. The space inside defines the work as much as the material.",
    description_ko: "용접 철. 내부 공간이 재료만큼이나 작품을 규정합니다.",
    price: 850000,
    category: "craft",
    images: ["https://placehold.co/800x800/C4C0BC/4A4A4A?text=Void+Structure"],
    artistId: "a6",
    artistName: "Byeong Gwan Seo",
    stock: 1,
    isSold: false,
    year: 2024,
    dimensions: "H 50 × W 30 × D 25 cm",
  },
  {
    id: "w18",
    title: "Weight and Rest",
    title_ko: "무게와 쉼",
    description: "Stone and found wood. Two materials negotiating gravity.",
    description_ko: "돌과 발견된 나무. 두 재료가 중력을 협상합니다.",
    price: 520000,
    category: "craft",
    images: ["https://placehold.co/800x800/CAC6BE/4A4A4A?text=Weight+Rest"],
    artistId: "a6",
    artistName: "Byeong Gwan Seo",
    stock: 1,
    isSold: false,
    year: 2023,
    dimensions: "H 28 × W 18 × D 18 cm",
  },
  {
    id: "w19",
    title: "Breath, Before",
    title_ko: "숨, 그 이전",
    description: "Oil on linen. A moment before exhale — held, suspended.",
    description_ko: "리넨에 유화. 숨을 내쉬기 전의 순간 — 품어진, 정지된.",
    price: 490000,
    category: "painting",
    images: ["https://placehold.co/800x1000/E6E2DA/4A4A4A?text=Breath+Before"],
    artistId: "a7",
    artistName: "Jae Eun Jeong",
    stock: 1,
    isSold: false,
    year: 2024,
    dimensions: "60 × 80 cm",
  },
  {
    id: "w20",
    title: "Still Hour",
    title_ko: "고요한 한 시간",
    description: "Oil on canvas. Time perceived rather than measured.",
    description_ko: "캔버스에 유화. 측정이 아닌 감지로 느껴지는 시간.",
    price: 580000,
    category: "painting",
    images: ["https://placehold.co/800x1000/DDD9D1/4A4A4A?text=Still+Hour"],
    artistId: "a7",
    artistName: "Jae Eun Jeong",
    stock: 1,
    isSold: false,
    year: 2024,
    dimensions: "70 × 90 cm",
  },
  {
    id: "w21",
    title: "After the Interval",
    title_ko: "간격 이후",
    description: "Oil on canvas. What the pause leaves behind.",
    description_ko: "캔버스에 유화. 멈춤이 남기고 간 것.",
    price: 720000,
    category: "painting",
    images: ["https://placehold.co/800x1000/D8D4CC/4A4A4A?text=After+Interval"],
    artistId: "a7",
    artistName: "Jae Eun Jeong",
    stock: 1,
    isSold: false,
    year: 2023,
    dimensions: "80 × 100 cm",
  },
];

export type ArtistVideo = {
  id: string;
  artistId: string;
  artistSlug: string;
  artistName: string;
  title: string;
  duration: string;
  url: string;         // YouTube watch URL
  thumbnail?: string;  // 비유튜브 영상용 수동 오버라이드
};

export const artistVideos: ArtistVideo[] = [
  {
    id: "v1",
    artistId: "a1",
    artistSlug: "betty-moon",
    artistName: "Betty Moon",
    title: "Studio Visit — Drifting Series",
    duration: "4:32",
    url: "https://www.youtube.com/watch?v=D83nSLLX00o",
  },
  {
    id: "v2",
    artistId: "a1",
    artistSlug: "betty-moon",
    artistName: "Betty Moon",
    title: "On Painting Emotion",
    duration: "7:15",
    url: "https://www.youtube.com/watch?v=4145YTRnG4E",
  },
  {
    id: "v3",
    artistId: "a2",
    artistSlug: "uiyeong-park",
    artistName: "Uiyeong Park",
    title: "Seoul at Night — Behind the Lens",
    duration: "5:48",
    url: "https://www.youtube.com/watch?v=D83nSLLX00o",
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
