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
exports.serverUp = void 0;
const express_1 = __importDefault(require("express"));
// Initialize the express engine
const app = (0, express_1.default)();
// Take port 8000 for running the server.
const port = 8000;
// Handling '/' Request
app.get('/', (_req, _res) => {
    _res.send("Your TypeScript With Express");
});
// Server setup
const serverUp = () => __awaiter(void 0, void 0, void 0, function* () {
    yield app.listen(port, () => {
        console.log(`bot is running at http://localhost:${port}/`);
    });
});
exports.serverUp = serverUp;
