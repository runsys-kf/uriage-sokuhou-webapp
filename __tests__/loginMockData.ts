// loginMockData.ts
export const mockLoginResponses = {
    test1: {
        data: {
            Authority: ['9999'],
            status: 200,
        },
        status: 200,
    },
    test2: {
        data: {
            Authority: ['9999', '1234', '2345'],
            status: 200,
        },
        status: 200,
    },
    test3: {
        data: {
            Authority: ['1234', '2345'],
            status: 200,
        },
        status: 200,
    },
    test4: {
        data: {
            Authority: ['2345'],
            status: 200,
        },
        status: 200,
    },
    not200: {
        data: {
            Authority: [],
            status: 401,
        },
        status: 401,
        statusText: "error",
    }
};