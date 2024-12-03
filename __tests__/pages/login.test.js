import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LoginPage from '../../pages/login';
import axios from 'axios';
import { useRouter } from 'next/router';
import { mockLoginResponse } from '../loginMockData'; // これを追加

jest.mock('axios');
jest.mock('next/router', () => ({ useRouter: jest.fn(), }));

describe('LoginPage', () => {
    it('ログイン認証成功後に店舗が選択されるかをテスト', async () => {
        const push = jest.fn();
        useRouter.mockImplementation(() => ({ push }));

        // モックレスポンスを設定
        axios.post.mockResolvedValue(mockLoginResponse);

        render(<LoginPage />);

        // ユーザー名とパスワードを入力
        fireEvent.change(screen.getByLabelText('スタッフ番号'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText('パスワード'), { target: { value: 'password' } });

        // ログインボタンをクリック
        fireEvent.click(screen.getByText('ログイン'));

        // axios.postが呼ばれたことを確認
        expect(axios.post).toHaveBeenCalledWith('http://127.0.0.1:5000/login', { username: 'testuser', password: 'password' }, { withCredentials: true });

        // ログイン成功後にindex.tsxに遷移することを確認
        await waitFor(() => expect(push).toHaveBeenCalledWith('/'));

        // localStorageにAuthorityが保存されていることを確認
        expect(localStorage.getItem('Authority')).toEqual(JSON.stringify(mockLoginResponse.data.Authority));
    });
});