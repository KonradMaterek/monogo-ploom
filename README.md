# Automated Tests for Ploom Websites

This repository contains automated tests using **Playwright (TypeScript)** designed to verify functionality across multiple Ploom market websites.

## Test Cases Covered

### 1. Add product to cart
- Visit the website
- Select a product by SKU
- Add a product to the cart
- Verify the cart contents

### 2. Remove product from cart
- **Precondition:** Product already in the cart
- Remove the product from the cart
- Validate the cart is empty and basket count is updated correctly

### 3. Check broken links and images
- Ensure all links on the product page are accessible
- Confirm all images load correctly

## Setup

### Prerequisites

- [Node.js (LTS)](https://nodejs.org/)
- Playwright (`npm install @playwright/test`)

### Installation

Clone the repository and install dependencies:

```
npm install
npx playwright install
```

### Running Tests

Run all tests with:

```
npx playwright test
```

### Adding New Shops

Extend the existing tests to new shops by adding entries to the shops array in the test file:

```
const shops = [
  { url: 'https://new-shop-url.com', country: 'new country', testProduct: 'name of the product', testSku: '[data-sku="new-sku"]' },
];
```