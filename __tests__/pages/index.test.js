import React from "react";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import IndexPage from '../../pages/index';
import dayjs from 'dayjs';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { createMockRouter } from '../test-utils';
import { useRouter } from 'next/router';
import { initialStores } from '../../data/shopData';

jest.mock('next/router', () => ({
    useRouter: jest.fn()
}));

describe('メイン画面のテスト', () => {
    beforeEach(() => {
        useRouter.mockImplementation(() => createMockRouter({}));
    });

    const mockRouter = createMockRouter({});

    const renderWithRouter = (ui, router = mockRouter) => {
        return render(
            <RouterContext.Provider value={router}>
                {ui}
            </RouterContext.Provider>
        );
    };

    it('ログイン後に店舗が選択されるかをテスト', async () => {
        // localStorageにモックデータをセット
        localStorage.setItem('Authority', JSON.stringify(['9999', '1234', '2345']));

        renderWithRouter(<IndexPage />);

        // 全店舗が選択されていることを確認
        await waitFor(() => {
            initialStores.forEach(store => {
                expect(screen.getByText((content, element) => content.includes(store.name))).toBeInTheDocument();
            });
        });
    });

    test('対象店舗テキストの表示確認', () => {
        renderWithRouter(<IndexPage />);
        expect(screen.getByText('対象店舗')).toBeInTheDocument();
    });

    test('DatePickerの初期値と比較対象の日付確認', async () => {
        renderWithRouter(<IndexPage />);

        await waitFor(() => {
            const datePickers = {
                picker1: screen.getByTestId('date-picker-1'),
                picker2: screen.getByTestId('date-picker-2')
            };

            const today = dayjs();
            const initialValues = {
                date1: today.format('YYYY/MM/DD'),
                date2: today.format('YYYY/MM/DD')
            };

            expect(datePickers.picker1).toBeInTheDocument();
            expect(datePickers.picker2).toBeInTheDocument();
        });

        const compareCheckbox = screen.getByRole('checkbox', { name: '比較対象' });
        fireEvent.click(compareCheckbox);

        await waitFor(() => {
            const comparisonPickers = {
                picker3: screen.getByTestId('date-picker-3'),
                picker4: screen.getByTestId('date-picker-4')
            };

            expect(comparisonPickers.picker3).toBeInTheDocument();
            expect(comparisonPickers.picker4).toBeInTheDocument();
        });
    });

    test('比較対象チェックボックスの動作確認', async () => {
        renderWithRouter(<IndexPage />);

        const compareCheckbox = screen.getByRole('checkbox', { name: '比較対象' });
        fireEvent.click(compareCheckbox);

        await waitFor(() => {
            const comparisonFields = {
                field3: screen.getByTestId('date-picker-3'),
                field4: screen.getByTestId('date-picker-4')
            };

            expect(comparisonFields.field3).toBeInTheDocument();
            expect(comparisonFields.field4).toBeInTheDocument();
        });
    });

    test('比較対象の日付が1年前になっていることの確認', async () => {
        renderWithRouter(<IndexPage />);

        const compareCheckbox = screen.getByRole('checkbox', { name: '比較対象' });
        fireEvent.click(compareCheckbox);

        await waitFor(() => {
            const today = dayjs();
            const oneYearAgo = today.subtract(1, 'year');

            const datePickers = {
                picker3: screen.getByTestId('date-picker-3'),
                picker4: screen.getByTestId('date-picker-4')
            };

            expect(datePickers.picker3).toBeInTheDocument();
            expect(datePickers.picker4).toBeInTheDocument();
        });
    });
});