//nextjestインポート
const nextJest = require('next/jest');

//ルートディレクトリをテスト対象に設定
const createJestConfig = nextJest({
    dir: './',
});

//カスタムjest設定
const customJestConfig = {
    //テスト環境のセットアップファイルを作成
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    //ブラウザ環境をシミュレート
    testEnvironment: 'jest-environment-jsdom',
    moduleNameMapper: {
        // テスト対象ファイルインポート簡略化
        '^@/components/(.*)$': '<rootDir>/components/$1',
        '^@/pages/(.*)$': '<rootDir>/pages/$1',
        // cssファイルモック化 テスト時にスタイルを実行せずにテストできる
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
};

// jestに設定をエクスポートし、各テストでjestインポートで使用可能にする
module.exports = createJestConfig(customJestConfig);
