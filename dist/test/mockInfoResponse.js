"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockInfoResponse = void 0;
function mockInfoResponse(...assets) {
    const base = {
        id: 0,
        name: "",
        symbol: "",
        category: "",
        slug: "",
        logo: "",
        description: "",
        dateAdded: "",
        dateLaunched: "",
        notice: "",
        tags: [],
        selfReportedCirculatingSupply: 0,
        selfReportedMarketCap: 0,
        selfReportedTags: [],
        platform: {
            id: 0,
            name: "",
            symbol: "",
            slug: "",
            tokenAddress: "",
        },
        urls: {
            website: [],
            technicalDoc: [],
            explorer: [],
            sourceCode: [],
            messageBoard: [],
            chat: [],
            announcement: [],
            reddit: [],
            twitter: [],
        },
    };
    const res = {
        status: {
            timestamp: "",
            errorCode: 0,
            errorMessage: "",
            elapsed: 0,
            creditCount: 0,
        },
        data: Object.fromEntries(assets.map((a) => [a, Object.assign(Object.assign({}, base), { logo: `https://test/${a}.png` })])),
    };
    return res;
}
exports.mockInfoResponse = mockInfoResponse;
