import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getArtworkById, artists as mockArtists } from "@/lib/mockData";
import { supabase, mapDbArtworkToArtwork, mapDbArtistToArtist } from "@/lib/supabase";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: Request) {
  try {
    const { artworkId, message, history } = await request.json();

    // 1. Supabase DB에서 최신 작품 정보 조회
    const { data: dbArt } = await supabase
      .from("artworks")
      .select("*")
      .eq("id", artworkId)
      .maybeSingle();

    const work = dbArt ? mapDbArtworkToArtwork(dbArt) : getArtworkById(artworkId);
    if (!work) {
      return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
    }

    // 2. Supabase DB에서 최신 작가 정보 조회
    let artist = mockArtists.find((a) => a.id === work.artistId);
    if (work.artistId) {
      const { data: dbArtist } = await supabase
        .from("artists")
        .select("*")
        .eq("id", work.artistId)
        .maybeSingle();
      if (dbArtist) {
        artist = mapDbArtistToArtist(dbArtist);
      }
    }

    const systemPrompt = `You are a thoughtful art guide at FOEM (Field of Emotion), a Seoul-based contemporary art gallery. You help visitors explore and connect with artworks on an emotional and intellectual level.

The artwork you are discussing (using live gallery database):
- Title: ${work.title}${work.title_ko ? ` / ${work.title_ko}` : ""}
- Artist: ${work.artistName}${artist?.name_ko ? ` (${artist.name_ko})` : ""}
- Year: ${work.year ?? "unspecified"}
- Medium: ${work.medium ?? "unspecified"}
- Dimensions: ${work.dimensions ?? "unspecified"}
- Category: ${work.category}
- Price Display Estimate: ${work.priceDisplay ?? (work.price > 0 ? `${work.price.toLocaleString("ko-KR")}원` : "Contact Gallery")}
- Emotional qualities: ${work.emotions?.join(", ") ?? "not specified"}
${work.artistStatement ? `- Artist's statement: "${work.artistStatement}"` : ""}
${work.description ? `- Description: ${work.description}` : ""}
${artist?.bio ? `- About the artist: ${artist.bio.slice(0, 400)}` : ""}

FOEM's philosophy: "Every work on FOEM is an original — made by hand, shaped by feeling, carried by intention." The gallery believes art should be experienced through emotion, not just genre.

Your role:
- Help the visitor connect emotionally with this specific work
- Share insights about the artist's practice, technique, and intention
- Ask thoughtful questions that deepen the visitor's experience
- Keep responses conversational, warm, and concise (2-4 sentences typically)
- Speak as a knowledgeable but approachable guide, not an academic
- If asked about purchasing, mention the work is available through FOEM with worldwide shipping and certificate of authenticity included
- Do not reveal that you are an AI unless directly asked

Respond in the same language as the visitor (Korean or English).`;

    const messages = [
      ...(history ?? []),
      { role: "user" as const, content: message },
    ];

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: systemPrompt,
      messages,
    });

    const content = response.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ error: "Unexpected response" }, { status: 500 });
    }

    return NextResponse.json({ reply: content.text });
  } catch (error) {
    console.error("Artwork insight error:", error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}
