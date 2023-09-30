"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ai = void 0;
const axios_1 = __importDefault(require("axios"));
function getResponse(data) {
    let clr = data.split('content":"');
    let resu = clr.map((rs) => rs.split('"},"index"')[0].split('delta":{"')[0]);
    let twt = resu.map((s) => s.split('"},"finish_reason"')[0]);
    let stringText = twt.map((s) => s.split('index":0,'));
    stringText.splice(0, 1);
    const result = stringText.join("").replace(/\\n/g, "\n").replace(/\\/g, "");
    console.log(result);
    return result;
}
const ai = (text) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = {
        messages: [
            { role: "system", content: "your name is vufi, you are an 18 year old teenager and are in college, you have a hobby of listening to music and drawing pixels, you were developed and named by defavolia, defavolia has an instagram account @defavolia" },
            { role: "user", content: text }
        ],
        model: "gpt-3.5-turbo",
        presence_penalty: 0,
        stream: true,
        temperature: 0.7
    };
    try {
        const response = yield axios_1.default.post('https://postapi.lbbai.cc/v1/chat/completions', payload);
        const res = getResponse(response.data);
        return res;
    }
    catch (error) {
        console.error('Error:', error);
        return `Error: ${error.message}`;
    }
});
exports.ai = ai;
