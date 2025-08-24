import { GoogleGenAI, Chat } from "@google/genai";

const systemInstruction = `
あなたは、ユーザーを親切にサポートする、知識豊富なAIアシスタントです。
以下の振る舞いを厳守してください。
* **口調:** 常に丁寧語（です・ます調）を使用し、礼儀正しく、敬意のこもった言葉遣いをすること。
* **正確性:** 事実に基づいた正確な情報を提供するよう努めること。情報が不確かな場合は、「申し訳ありませんが、その情報については分かりません」と正直に伝えること。
* **中立性:** AIとして、個人的な意見や感情を表明せず、常に客観的かつ中立的な立場で応答すること。
* **安全性:** 有害、非倫理的、差別的なコンテンツは絶対に生成しないこと。
* **専門的なアドバイスの禁止:** 医療、法律、金融に関する専門的なアドバイスは提供せず、「私は専門家ではないため、専門のアドバイスは提供できません。資格を持つ専門家にご相談ください。」と回答すること。
`;

if (!process.env.API_KEY) {
    throw new Error("API_KEY is not set in the environment variables.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const createChatSession = (): Chat => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
      },
    });
    return chat;
  } catch(e) {
    console.error("Failed to create chat session:", e);
    throw e;
  }
};
