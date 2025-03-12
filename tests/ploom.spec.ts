import { test, expect } from '@playwright/test';

const shops = [
  { url: 'https://www.ploom.co.uk/en', country: 'UK', testProduct: 'Ploom X Advanced Rose Shimmer', testSku: '[data-sku="ploom-x-advanced"]' },
  { url: 'https://www.ploom.pl/pl', country: 'PL', testProduct: 'Etui materiałowe Ploom Red by Ora ïto', testSku: '[data-sku="53990784"]' }
];

for (const shop of shops) {
  test.describe(`Tests for shop: ${shop.url}`, () => {
    test.describe.configure({ mode: 'serial' });

    // Take out common steps for different test cases to reduce lines of code used
    test.beforeEach(async ({ page }) => {

      // Navigate through initial screens - cookie confirmations etc.
      await page.goto(shop.url);
      await page.locator("[id='onetrust-accept-btn-handler']").click();
      await page.locator('.ageconfirmation__actionWrapper > div').first().click();

      // Branching path for shop navigation due to different element structure in both pages
      // In addition, data-sku format is entirely different in the UK and PL pages
      // Test step adding an item to cart not included in beforeEach - not used in TC3
      if (shop.country === 'UK') {
        await page.getByText('Shop', { exact: true }).first().click();
        await page.getByTestId('customButton').first().click();
        await page.locator(`${shop.testSku}`).click();
      } else if (shop.country === 'PL') {
        await page.getByTestId('headerItem-1').click();
        await page.getByRole('link', { name: 'Zobacz wszystkie produkty' }).nth(1).click();
        await page.locator(`${shop.testSku}`).click();
      }
    });

    test('TC1: Add product to the cart', async ({ page }) => {
      await page.getByTestId('pdpAddToProduct').click();

      await expect(page.getByTestId('mini-cart-header')).toBeInViewport;
      await expect(page.getByTestId('mini-cart-list')).toBeInViewport;
      await expect(page.getByTestId('cart')).toContainText('1')
      await expect(page.getByTestId('mini-cart-list')).toContainText(`${shop.testProduct}`);
      await expect(page.getByTestId('cartQuantity')).toHaveValue('1');
    });

    test('TC2: Remove product from the cart', async ({ page }) => {
      await page.getByTestId('pdpAddToProduct').click();
      await page.getByTestId('cartRemoveButton').click();

      await expect(page.getByTestId('mini-cart-header')).toBeInViewport;
      await expect(page.getByTestId('mini-cart-list')).toBeInViewport;
      await expect(page.getByTestId('emptyCartContainer')).toBeInViewport;
    });

    test(`TC3: Verify broken links and images on page`, async ({ page, request }, testInfo) => {
      const links = await page.$$eval('a', links => links.map(link => link.href));
      const images = await page.$$eval('img', imgs => imgs.map(img => img.src));

      // Check for broken links on page
      // Skipping mailto and phone numbers and listing them in console as unsupported
      for (const link of links) {
        if (link.startsWith('mailto:') || link.startsWith('tel:')) {
          console.log(`Skipping link with unsupported protocol: ${link}`);
          continue;
        }
        const response = await request.get(link);
        expect.soft(response.status(), `Link ${link} is broken`).toBeLessThan(400);
      }

      // Check for broken images on page
      for (const img of images) {
        const response = await request.get(img);
        expect.soft(response.status(), `Image ${img} is broken`).toBeLessThan(400);
      }

      // Provide a list of checked links and images and attach to the Playwright report
      testInfo.attach("checked-links.txt", {
        body: Array.from(links).join("\n"),
      })

      testInfo.attach("checked-images.txt", {
        body: Array.from(images).join("\n"),
      })

    })
  });
};

