import { RouterContext } from 'next/dist/shared/lib/router-context';

export function createMockRouter(overrides) {
    return {
        route: '/',
        pathname: '/',
        query: {},
        asPath: '/',
        push: jest.fn(),
        replace: jest.fn(),
        reload: jest.fn(),
        back: jest.fn(),
        prefetch: jest.fn().mockResolvedValue(undefined),
        beforePopState: jest.fn(),
        events: {
            on: jest.fn(),
            off: jest.fn(),
            emit: jest.fn(),
        },
        ...overrides,
    };
}

// ダミーテストを追加
test('dummy test', () => {
    expect(true).toBe(true);
});