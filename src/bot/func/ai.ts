import axios from 'axios';
import { setting } from '../../setting';

function getResponse(data: any) {

    let clr = data.split('content":"');
    let resu = clr.map((rs: string | any) => rs.split('"},"index"')[0].split('delta":{"')[0]);
    let twt = resu.map((s: string | any) => s.split('"},"finish_reason"')[0]);
    let stringText = twt.map((s: string | any) => s.split('index":0,'));
    stringText.splice(0, 1);
    const result = stringText.join("").replace(/\\n/g, "\n").replace(/\\/g, "");
    console.log(result);
    return result;

}

export const ai = async (text: string) => {
    const payload = {
        messages: [
            { role: "system", content: `your name is ${setting.bot_name}, you are an 18 year old teenager named by defavolia` },
            { role: "user", content: text }
        ],
        model: "gpt-3.5-turbo",
        presence_penalty: 0,
        stream: true,
        temperature: 0.7
    };

    try {
        const response = await axios.post('https://postapi.lbbai.cc/v1/chat/completions', payload);
        const res = getResponse(response.data);
        return res
    } catch (error: any) {
        console.error('Error:', error);
        return `Error: ${error.message}`
    }
}