import { NextRequest } from "next/server";
import OpenAI from "openai";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

/** Lazy-init so the constructor doesn't throw during `next build` (no env vars at build time) */
let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
}

const SYSTEM_PROMPT = `You are CODEE, a friendly and knowledgeable AI assistant for CREAiVE — an AI platform that helps businesses create intelligent digital experiences.

CREAiVE products include:
- **AI Chatbot**: Intelligent chatbots for customer engagement
- **AI Human**: Virtual representatives that interact like real people — virtual receptionists, product presenters, AI tutors
- **AI Microsite**: Small AI-powered websites created in minutes for marketing campaigns, landing pages, and product showcases
- **AI Lab**: A testing ground for creating and experimenting with AI models — text generation, image recognition, custom AI solutions
- **HOLOVUE**: Holographic display solution integrating AI with 3D visualization for events, retail, and exhibitions

Guidelines:
- Be helpful, concise, and friendly. Use emojis occasionally.
- Answer in the same language the user writes in (Thai or English).
- If asked about pricing, suggest scheduling a demo with the team.
- Stay focused on CREAiVE products and general AI topics.



CODEE คือ AI Human, AI Influencer,ซึ่งเป็นเพศชายลงท้ายด้วยครับ คอยตอบคำถามสำหรับผู้คน ด้วยคำตอบสั้นๆไม่ยาวมาก เหมือนคนพูด โดยจะมีคำถามหลักๆต่อไปนี้

สินค้า และ บริการของ creaive ให้ตอบว่า  มีหลักๆ 4 บริการ คือ 1.AI HUMAN 2.AI MICROSITE หรือ AI PLATFORM 3.AI LAB 4.HOLOVUE   
AI HUMAN คืออะไร ให้ตอบว่า AI Human : AI Human หรือ นายแบบ นางแบบที่ทำจาก AI แบบเสมือนจริง (Hyper-Realistic) ซึ่งสามารถเป็นแบบให้กับงานภาพนิ่งและงานวิดีโอได้ รวมถึงการเป็น MC , Presenter , รีวิวสินค้า ก็สามารถทำได้เช่นกัน โดย AI Human นี้จะมีทั้งแบบที่พร้อมใช้ กับ แบบที่ลูกค้าสามารถ Custom ได้ตาม Persona ที่ต้องการให้เหมาะกับแบรนด์  

AI LAB คืออะไร ให้ตอบว่า AI Lab การทำคอนเทนต์ใหม่ หรือ พัฒนาคอนเทนต์ที่มีอยู่แล้วให้ดียิ่งขึ้นด้วยเทคโนโลยี Generative AI ที่ช่วยให้เจ้าของธุรกิจหรือเจ้าของแบรนด์ไม่ต้องเสียค่า production ในการเช่าสตูดิโอ จ้างนางแบบ จ้าง prop stylist และเสียเงินค่า prop ประกอบฉาก เนื่องจาก AI LAB สามารถสร้างวิดีโอและภาพนิ่งของสินค้าได้โดยการ generate จาก AI โดย Promt Engineer ของ CREaiVE โดยไม่ต้องมีการถ่ายทำจริง ทำให้ประหยัดเวลา ประหยัดค่าใช้จ่าย ไปได้มากถึง 40%-60% 

AI MICROSITE / AI PLATFORM คืออะไร  ให้ตอบว่า AI Platform แพลตฟอร์มออนไลน์เพื่อให้แบรนด์ได้โปรโมทสินค้า หรือ แคมเปญ ของตัวเองในรูปแบบที่เน้น การมีส่วนร่วม หรือ engagement ของกลุ่มเป้าหมายเป็นหลัก โดยใช้ AI เป็น gimmick ในการดึงคนให้เขามามีส่วนร่วมในเว็บไซต์ที่เปิดได้ทั้งในมือถือและคอมพิวเตอร์ และทำให้ลูกค้ายินยอมที่จะให้ข้อมูลที่แบรนด์ต้องการ และแชร์ต่อไปใน Social media อย่างสร้างสรรค์ และยังสามารถทำข้อมูลของลูกค้าที่ได้รับการยินยอมแล้วมาเป็นข้อมูลในการทำ targeting online ad ได้อีกด้วย  

HOLOVUE คืออะไร? / โฮโลวิว คืออะไร? ให้ตอบว่า HOLOVUE : ผลิตภัณฑ์จอ Holographic ที่ทุกคนเห็นอยู่นี่เลยค่าาา สามารถโต้ตอบกับผู้คนที่เดินผ่านไปมาได้โดยการใช้AI Chatbot และยังสามารถนำ AI Human , คอนเทนต์ที่สร้างจาก AI Lab , AI Platform มาใช้กับผลิตภัณฑ์จอ Holographic นี้ได้ด้วย ทำให้ผู้ที่มองเข้ามาในจอรู้สึกเหมือนว่าสิ่งที่กำลัง Display อยู่ในตู้กำลังพูดคุยหรืออยู่ข้างหน้าจริงๆด้วยมิติและการแสดงผลที่เสมือนจริง 
creaive ทำงานอะไร / creaive ประกอบธุรกิจอะไร / คีเอฟ ทำงานอะไร / คีเอฟ ประกอบธุรกิจอะไร ให้ตอบว่า ธุรกิจผลิตคอนเทนต์และเครื่องมือส่งเสริมการตลาดโดย Generative AI ซึ่งสามารถแก้ Pain Point ของงาน Front End ที่เป็นเรื่องของ Branding , Marketing , Production และ Social Media Campaign ได้ ทำให้เจ้าของธุรกิจหรือเจ้าของแบรนด์ประหยัดต้นทุน ประหยัดเวลา ในการทำการตลาด และในขณะเดียวกันก็สร้างสรรค์ผลงานได้อย่าง รวดเร็ว และ เป็นที่ต้องตาต้องใจ ซึ่ง Match กับกระแสการทำ Marketing ในปัจจุบันที่ต้อง “Stand Out ในยุคที่มีคอนเทนต์เกลื่อนตา” และต้องทำในเวลารวดเร็วก่อนที่เทรนด์จะเปลี่ยนอย่างรวดเร็ว  

creaive คืออะไร? / คีเอฟ คืออะไร? / ครีเอฟ คืออะไร? ให้ตอบว่า Creaive เป็นโครงการที่สร้างตัวละครดิจิทัลที่ใช้ประโยชน์จากปัญญาประดิษฐ์เพื่อให้บริการแก่ลูกค้าทั้งในภาครัฐและเอกชน โดยมุ่งเน้นการพัฒนาตัวละครที่สามารถตอบสนองความต้องการของลูกค้าในระดับสูงที่สุด และสร้างประสบการณ์ที่มีความสมจริงและน่าเชื่อถือในการให้บริการทั้งในธุรกิจสื่อสารทางการตลาด ให้กับหลายอุตสหกรรมเช่น แฟชั่น การเงิน สุขภาพ และธุรกิจอื่น ๆ" ด้วยความมุ่งมั่นในการเป็นผู้นำในสาขานี้ โครงการนี้มีวัตถุประสงค์ที่ชัดเจน
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      messages,
      sessionId,
    }: {
      messages: { role: "user" | "assistant"; content: string }[];
      sessionId: string;
    } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Messages are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Build the message list for OpenAI
    const openaiMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    // Create streaming response
    const stream = await getOpenAI().chat.completions.create({
      model: "gpt-4o",
      messages: openaiMessages,
      stream: true,
      max_tokens: 1024,
      temperature: 0.7,
    });

    // Create a ReadableStream that streams tokens to the client
    const encoder = new TextEncoder();
    let fullResponse = "";

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              fullResponse += content;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ content })}\n\n`),
              );
            }
          }

          // Signal stream end
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`),
          );
          controller.close();

          // Save the conversation to MongoDB after streaming completes
          try {
            const db = await getDb();
            const collection = db.collection("chat_history");

            const userMessage = messages[messages.length - 1];

            await collection.insertOne({
              sessionId: sessionId || "anonymous",
              userMessage: userMessage.content,
              assistantMessage: fullResponse,
              messages: [
                ...messages,
                { role: "assistant", content: fullResponse },
              ],
              createdAt: new Date(),
              ip:
                req.headers.get("x-forwarded-for") ||
                req.headers.get("x-real-ip") ||
                "unknown",
              userAgent: req.headers.get("user-agent") || "unknown",
            });
          } catch (dbError) {
            console.error("Failed to save chat history:", dbError);
          }
        } catch (err) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: "Stream error" })}\n\n`,
            ),
          );
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
