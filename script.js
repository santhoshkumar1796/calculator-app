const calc = new Calculator();
const display = document.querySelector('[data-testid="display"]');
const expression = document.querySelector('[data-testid="expression"]');
const opButtons = document.querySelectorAll('[data-op]');

function render() {
  display.textContent = calc.current;
  expression.textContent = calc.expression();
  opButtons.forEach((b) => b.classList.toggle('active', b.dataset.op === calc.operator && calc.overwrite));
}

const actions = {
  clear: () => calc.clear(),
  delete: () => calc.delete(),
  percent: () => calc.percent(),
  sign: () => calc.toggleSign(),
  decimal: () => calc.inputDecimal(),
  equals: () => calc.evaluate(),
};

document.querySelector('.keys').addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  if (btn.dataset.num) calc.inputDigit(btn.dataset.num);
  else if (btn.dataset.op) calc.setOperator(btn.dataset.op);
  else actions[btn.dataset.action]?.();
  render();
});

document.addEventListener('keydown', (e) => {
  if (/^\d$/.test(e.key)) calc.inputDigit(e.key);
  else if (['+', '-', '*', '/'].includes(e.key)) calc.setOperator(e.key);
  else if (e.key === '.') calc.inputDecimal();
  else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); calc.evaluate(); }
  else if (e.key === 'Backspace') calc.delete();
  else if (e.key === 'Escape') calc.clear();
  else if (e.key === '%') calc.percent();
  else return;
  render();
});

render();
