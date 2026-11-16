# Calculator App

A clean, responsive calculator built with **HTML, CSS and vanilla JavaScript**, with an end-to-end test suite in **Playwright + TypeScript**.

## Features

- Add, subtract, multiply, divide with chained operations
- Decimal, percent, ± sign toggle, backspace and AC
- Keyboard support (digits, `+ - * /`, `Enter`, `Backspace`, `Esc`)
- Floating-point rounding (`0.1 + 0.2 = 0.3`) and divide-by-zero handling
- Calculator logic kept in `calculator.js`, separate from the DOM code in `script.js`

## Run the app

```bash
npm install
npm start          # opens http://localhost:5173
```

## Run the tests

```bash
npx playwright install chromium
npm test           # desktop + mobile viewports
npm run report
```

The suite covers data-driven arithmetic cases, edge cases (divide by zero, multiple decimals), UI state (pending expression) and keyboard input.

## Project structure

```
calculator-app/
├── index.html
├── style.css
├── calculator.js      # pure logic (Calculator class)
├── script.js          # DOM + keyboard wiring
├── playwright.config.ts
└── tests/calculator.spec.ts
```
