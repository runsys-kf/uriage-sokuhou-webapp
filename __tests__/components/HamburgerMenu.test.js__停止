import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/router';
import Sidebar from '../../components/SidebarButton';

// Next.jsのルーターをモック化
jest.mock('next/router', () => ({
    useRouter: jest.fn()
}));

describe('Sidebarコンポーネント', () => {
    // pushをモック化
    const mockRouter = {
        push: jest.fn()
    };

    // テスト前にrouterがpushを返すように設定
    beforeEach(() => {
        useRouter.mockReturnValue(mockRouter);
    });

    // テスト終了後モックをクリア
    afterEach(() => {
        jest.clearAllMocks();
    });

    // モバイル表示のテスト群
    describe('モバイル表示', () => {
        test('ハンバーガーメニューが表示される', () => {
            render(<Sidebar isMobile={true} />);
            expect(screen.getByLabelText('menu')).toBeInTheDocument();
        });

        test('ハンバーガーアイコンクリックでメニューが開く', () => {
            render(<Sidebar isMobile={true} />);
            fireEvent.click(screen.getByLabelText('menu'));
            expect(screen.getByText('ダッシュボード')).toBeInTheDocument();
        });

        test('メニュー外クリックで閉じる', () => {
            render(<Sidebar isMobile={true} />);
            fireEvent.click(screen.getByLabelText('menu')); // メニューを開く
            fireEvent.click(document.body); // メニュー外をクリック
            expect(screen.queryByText('ダッシュボード')).not.toBeInTheDocument();
        });

        test('ドロワー内にダッシュボードボタンが表示される', () => {
            render(<Sidebar isMobile={true} />);
            fireEvent.click(screen.getByLabelText('menu')); // メニューを開く
            expect(screen.getByText('ダッシュボード')).toBeInTheDocument();
        });

        test('ダッシュボードボタンクリックでドロワーが閉じて画面遷移する', () => {
            render(<Sidebar isMobile={true} />);
            fireEvent.click(screen.getByLabelText('menu')); // メニューを開く
            fireEvent.click(screen.getByText('ダッシュボード'));
            expect(mockRouter.push).toHaveBeenCalledWith('/admin');
            fireEvent.click(document.body); // メニュー外をクリックして閉じる
            expect(screen.queryByText('ダッシュボード')).not.toBeInTheDocument();
        });
    });

    // PC表示のテスト群
    describe('PC表示', () => {
        test('サイドバーが表示される', () => {
            render(<Sidebar isMobile={false} />);
            expect(screen.getByText('管理システム')).toBeInTheDocument();
        });

        test('ハンバーガーメニューが非表示', () => {
            render(<Sidebar isMobile={false} />);
            expect(screen.queryByLabelText('menu')).not.toBeInTheDocument();
        });

        test('サイドバー内にダッシュボードボタンが表示される', () => {
            render(<Sidebar isMobile={false} />);
            expect(screen.getByText('ダッシュボード')).toBeInTheDocument();
        });

        test('ダッシュボードクリックで管理画面に遷移する', () => {
            render(<Sidebar isMobile={false} />);
            fireEvent.click(screen.getByText('ダッシュボード'));
            expect(mockRouter.push).toHaveBeenCalledWith('/admin');
        });
    });
});