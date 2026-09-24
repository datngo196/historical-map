import 'dotenv/config'; // Tự động nạp file .env vào process.env
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { historicalData } from './src/data.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Lấy API key từ biến môi trường
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("❌ Lỗi: Chưa tìm thấy GEMINI_API_KEY trong file .env!");
  process.exit(1);
}

const OUTPUT_DIR = path.join(__dirname, 'public', 'audio');
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function callGeminiTTS(text, filename) {
  // Endpoint sử dụng model gemini-3.8-flash-tts
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash-tts:generateContent?key=${GEMINI_API_KEY}`;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: text, // Model TTS sẽ đọc nguyên văn văn bản này
            speech_metadata: {
              // Hướng dẫn sắc thái đọc riêng biệt, không bị lẫn vào tiếng đọc
              style: "narrator, historical documentary, clear and formal tone"
            }
          }
        ]
      }
    ],
    generationConfig: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: {
          // Các giọng: "Aoede" (nữ nhẹ nhàng), "Kore" (nữ trang trọng), "Charon" (nam thông thái), "Puck" (nam)
          voice: "Aoede" 
        }
      }
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`API Error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const parts = data.candidates?.[0]?.content?.parts || [];

  // Trích xuất dữ liệu audio dạng inlineData
  const audioPart = parts.find((p) => p.inlineData && p.inlineData.data);

  if (!audioPart) {
    console.dir(data, { depth: null });
    throw new Error("Không tìm thấy dữ liệu audio trong response.");
  }

  const audioBuffer = Buffer.from(audioPart.inlineData.data, 'base64');
  const filePath = path.join(OUTPUT_DIR, filename);

  await fs.writeFile(filePath, audioBuffer);
  console.log(`✓ Đã tạo thành công: public/audio/${filename}`);
}

async function start() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  console.log("=== BẮT ĐẦU XUẤT AUDIO VỚI GEMINI 3.8 FLASH TTS ===");

  // 1. Tạo audio cho các phần overview (lấy content)
  if (historicalData.overviews) {
    for (const [key, item] of Object.entries(historicalData.overviews)) {
      const fileName = `overview_${key}.wav`;
      console.log(`\n-> Đang tạo overview: ${key}...`);
      try {
        await callGeminiTTS(item.content, fileName);
      } catch (err) {
        console.error(`✗ Lỗi overview ${key}:`, err.message);
      }
      await sleep(2000);
    }
  }

  // 2. Tạo audio cho các sự kiện (lấy description)
  const allEvents = [
    ...(historicalData.vietnamEvents || []),
    ...(historicalData.worldEvents || [])
  ];

  for (const event of allEvents) {
    const fileName = `${event.id}.wav`;
    console.log(`\n-> Đang tạo sự kiện: ${event.title} (${event.id})...`);
    try {
      await callGeminiTTS(event.description, fileName);
    } catch (err) {
      console.error(`✗ Lỗi sự kiện ${event.id}:`, err.message);
    }
    await sleep(2000);
  }

  console.log("\n🎉 HOÀN TẤT TOÀN BỘ FILE AUDIO!");
}

start();