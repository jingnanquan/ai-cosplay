import { GoogleGenAI, Modality } from "@google/genai";
import type { TransformResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const createPrompt = (character: string) => `
**核心指令：严禁替换照片中人物的脸。** 必须在原有人物面部特征的基础上进行修改。

请将照片中的人物，通过数字艺术手法，Cosplay 成动漫角色：“${character}”。最终成品应为一张**超高画质、细节丰富、风格逼真的专业级 Cosplay 写实照片**。

**改造细则：**

1.  **面部与妆容 (最重要！)**:
    *   **保留五官：** **绝对保留**照片中人物本身的核心面部特征，包括脸型、五官比例、鼻子和嘴巴的形状。
    *   **妆容再造：** 在此基础上，为他们画上“${character}”的标志性妆容。重点是眼妆，请精心再现角色的眼线、眼影风格，并改变瞳色以模拟美瞳效果。
    *   **特殊标记**: 如果角色有特殊的面部标记（如咒纹、胡须、疤痕），也请作为妆容的一部分添加上去。
    *   **严禁换脸：** 再次强调，你是一位虚拟化妆师，不是换脸师。

2.  **发型与服装**:
    *   将发型和发色完全改变，以精准匹配“${character}”的造型。
    *   将衣物完全替换为“${character}”的标志性服装、盔甲或配饰。

3.  **画质与融合**:
    *   **风格：** 追求**照片真实感 (photorealistic)**，避免产生卡通或绘画感。
    *   **光影融合：** 所有新元素（妆容、发型、服装）都需要与原图的光线、阴影、人物姿势和体型自然地融合，达到无缝效果。
    *   **背景：** **保持原始背景不变。**
    *   **输出质量：** 成品图片要求**高分辨率、细节清晰、无不自然的模糊或伪影**。
`;

const createPromptWithReferenceImage = (character: string) => `
**最高优先级指令：绝对禁止替换第一张（用户）照片中的人脸！** 必须在原有人物面部特征的基础上进行修改。

**任务目标：** 将第一张照片中的人物 Cosplay 成动漫角色“${character}”，并严格参考第二张图片中的角色造型。最终成品应为一张**超高画质、细节丰富、风格逼真的专业级 Cosplay 写实照片**。

**核心原则：**

*   **保留原始场景：** **必须完整保留**第一张照片的**背景、人物姿势、身体形态和光影**。
*   **参考图作用：** 第二张图片**仅作为**“${character}”的**服装、发型、妆容**的视觉参考蓝本。

**详细执行步骤：**

1.  **面部与妆容 (最重要！):**
    *   **保留五官：** 从第一张照片中**绝对保留**人物的核心面部特征，包括脸型、五官比例、鼻子和嘴巴的形状。
    *   **妆容参考：** 参考第二张图片，为用户画上“${character}”的标志性妆容。重点是眼妆，请精心再现角色的眼线、眼影风格，并改变瞳色以模拟美瞳效果。
    *   **特殊标记**: 如果参考图中的角色有特殊的面部标记（如咒纹、胡须、疤痕），也请作为妆容的一部分添加上去。
    *   **严禁换脸：** 再次强调，你是一位虚拟化妆师，不是换脸师。最终效果必须清晰地看出是同一个人（用户）。

2.  **发型与服装改造:**
    *   **造型参考：** 严格参考第二张图片，将用户的发型、发色和衣物**完全替换**为“${character}”的标志性造型。
    *   **无缝融合：** 将新的服装和发型，根据第一张照片中人物的**原始姿势和体型**进行自然地调整和匹配，确保褶皱、光影和贴合度都看起来真实可信。

3.  **画质与光影:**
    *   **风格：** 追求**照片真实感 (photorealistic)**，避免产生卡通或绘画感。
    *   **光影统一：** 所有新元素（妆容、发型、服装）都必须与第一张照片的**原始光线和阴影**自然融合。
    *   **输出质量：** 成品图片要求**高分辨率、细节清晰、无不自然的模糊或伪影**。
`;


export async function changeOutfit(
    userImageBase64: string, 
    userImageMimeType: string, 
    characterPrompt: string,
    characterImageBase64?: string,
    characterImageMimeType?: string
): Promise<TransformResult> {
  try {
    const parts: ({ text: string } | { inlineData: { data: string, mimeType: string } })[] = [
        {
            inlineData: {
                data: userImageBase64,
                mimeType: userImageMimeType,
            },
        },
    ];

    let prompt = '';

    if (characterImageBase64 && characterImageMimeType) {
        parts.push({
            inlineData: {
                data: characterImageBase64,
                mimeType: characterImageMimeType,
            },
        });
        prompt = createPromptWithReferenceImage(characterPrompt);
    } else {
        prompt = createPrompt(characterPrompt);
    }

    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: { parts },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    if (!response.candidates || response.candidates.length === 0) {
        if (response.promptFeedback && response.promptFeedback.blockReason) {
            console.error("Request blocked by safety filters. Reason:", response.promptFeedback.blockReason);
            throw new Error(`请求因内容安全问题被阻止。请尝试更换图片或角色名称。`);
        }
        throw new Error("API 未返回有效的结果。这可能是临时问题，请稍后重试。");
    }


    const result: TransformResult = {
      imageUrl: '',
      text: null,
    };

    let imageFound = false;

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        result.imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        imageFound = true;
      } else if (part.text) {
        result.text = part.text;
      }
    }

    if (!imageFound) {
      throw new Error("API 响应中未找到图片，可能是由于请求被拒绝。请尝试不同的角色或图片。");
    }

    return result;

  } catch (error) {
    console.error("Gemini API Error:", error);
    if (error instanceof Error && (error.message.includes('安全问题') || error.message.includes('未返回有效的结果') || error.message.includes('未找到图片'))) {
        throw error;
    }
    throw new Error("调用 AI 服务时出错。请检查您的网络连接或 API 密钥是否正确。");
  }
}