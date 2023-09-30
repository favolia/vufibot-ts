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
exports.textToImage = void 0;
const axios_1 = __importDefault(require("axios"));
function enhanceImg(url, scale) {
    return __awaiter(this, void 0, void 0, function* () {
        const scaleNumber = scale ? scale : 2;
        try {
            const { data } = yield (0, axios_1.default)(`https://toolsapi.spyne.ai/api/forward`, {
                method: "post",
                data: {
                    image_url: url,
                    scale: scaleNumber,
                    save_params: {
                        extension: ".png",
                        quality: 95
                    }
                },
                headers: {
                    "content-type": "application/json",
                    accept: "*/*"
                }
            });
            return data;
        }
        catch (error) {
            throw new Error(error.message);
        }
    });
}
const textToImage = (text) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = yield axios_1.default.get("https://tti.photoleapapp.com/api/v1/generate?prompt=" + text);
        const enhanceImages = yield enhanceImg(data.result_url, 2);
        const result = {
            status: true,
            url: enhanceImages.url
        };
        return result;
    }
    catch (err) {
        const result = {
            status: false,
            message: String(err.message)
        };
        console.log(result);
        return result;
    }
});
exports.textToImage = textToImage;
