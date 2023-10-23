import axios from "axios";

export async function tiktokTts(text: string, model?: string) {
  try {
    const modelVoice = model ? model : "en_us_001"
    const { status, data } = await axios(`https://tiktok-tts.weilnet.workers.dev/api/generation`, {
      method: "post",
      data: { text: text, voice: modelVoice },
      headers: {
        "content-type": "application/json"
      }
    })
    return data
  } catch (err: any) {
    return err.response.data
  }
}