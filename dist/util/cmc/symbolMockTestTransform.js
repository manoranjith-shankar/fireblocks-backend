"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.symbolMockTestTransform = void 0;
// try to mock real asset value for test assets
const symbolMockTestTransform = (s) => s.replace(/_(TEST)?.*/, "");
exports.symbolMockTestTransform = symbolMockTestTransform;
