import { test, expect } from '@playwright/test';

const HAR_PATH = 'tests/hars/app.har';
const API_URL = process.env.BURGER_API_URL!;

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR(HAR_PATH, {
      url: `${API_URL}/**`,
      notFound: 'abort'
    });
  });

  test('главная страница открывается', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', {
        name: 'Соберите бургер'
      })
    ).toBeVisible();
  });

  test('можно добавить булку и начинку в конструктор', async ({
    page
  }) => {
    await page.goto('/');

    const constructor = page.getByTestId('burger-constructor');

    const bunCard = page.getByTestId(
      'ingredient-643d69a5c3f7b9001cfa093c'
    );

    await bunCard.getByRole('button').click();

    const sauceCard = page.getByTestId(
      'ingredient-643d69a5c3f7b9001cfa0944'
    );

    await sauceCard.getByRole('button').click();

    await expect(
      constructor.getByText('Краторная булка N-200i (верх)')
    ).toBeVisible();

    await expect(
      constructor.getByText('Краторная булка N-200i (низ)')
    ).toBeVisible();

    await expect(
      constructor.getByText('Соус традиционный галактический')
    ).toBeVisible();
  });

  test('открывается и закрывается модальное окно ингредиента по крестику', async ({
    page
  }) => {
    await page.goto('/');

    const bunCard = page.getByTestId(
      'ingredient-643d69a5c3f7b9001cfa093c'
    );

    await bunCard.getByRole('link').click();

    const modal = page.locator('#modals');

    await expect(
      modal.getByRole('heading', {
        name: 'Детали ингредиента'
      })
    ).toBeVisible();

    await expect(
      modal.getByRole('heading', {
        name: 'Краторная булка N-200i'
      })
    ).toBeVisible();

    await page.locator('#modals button').click();

    await expect(
      modal.getByRole('heading', {
        name: 'Детали ингредиента'
      })
    ).toHaveCount(0);
  });

  test('можно оформить заказ', async ({ page }) => {
    await page.context().addCookies([
      {
        name: 'accessToken',
        value:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNGQ2ZTJhNmExNzJkMDAxYjk4ZjQ2NiIsImlhdCI6MTc4NTQ1MDQyMywiZXhwIjoxNzg1NDUxNjIzfQ.c7cXW1sub5SFH3EPKgIFLo_WoVE5IE9yOIjH_-kTweo',
        url: 'http://localhost:4000'
      }
    ]);

    await page.addInitScript(() => {
      localStorage.setItem(
        'refreshToken',
        'fe493a34327570481ff2db0c37e6bddc09d90a3e1eadeb4a87d8bfa2115d5f14a6fc170c438cebcd'
      );
    });

    await page.goto('/');

    const constructor = page.getByTestId('burger-constructor');

    const bunCard = page.getByTestId(
      'ingredient-643d69a5c3f7b9001cfa093c'
    );

    await bunCard.getByRole('button').click();

    const sauceCard = page.getByTestId(
      'ingredient-643d69a5c3f7b9001cfa0944'
    );

    await sauceCard.getByRole('button').click();

    const orderButton = page.getByRole('button', {
      name: 'Оформить заказ'
    });

    await expect(orderButton).toBeEnabled();

    await orderButton.click();

    const modal = page.locator('#modals');

    await expect(
      modal.getByText('идентификатор заказа')
    ).toBeVisible({
      timeout: 30000
    });

    await expect(
      modal.getByRole('heading', {
        name: '108695'
      })
    ).toBeVisible();

    await page.locator('#modals button').click();

    await expect(
      modal.getByText('идентификатор заказа')
    ).toHaveCount(0);

    await expect(
      constructor.getByText('Выберите булки')
    ).toHaveCount(2);

    await expect(
      constructor.getByText('Выберите начинку')
    ).toBeVisible();
  });
});
