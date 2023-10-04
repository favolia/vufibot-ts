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
Object.defineProperty(exports, "__esModule", { value: true });
exports.exec = void 0;
const util_1 = require("util");
const child_process_1 = require("child_process");
const execute = (0, util_1.promisify)(child_process_1.exec);
function exec(command) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { stdout, stderr } = yield execute(command);
            if (stderr) {
                return `exec error: ${stderr}`;
            }
            else {
                return `exec output:\n\n${stdout}`;
            }
        }
        catch (error) {
            return `Error: ${error}`;
        }
    });
}
exports.exec = exec;
