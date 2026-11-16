/**
 * Pure calculator logic — no DOM, so it can be unit tested directly.
 */
class Calculator {
  constructor() {
    this.clear();
  }

  clear() {
    this.current = '0';
    this.previous = null;
    this.operator = null;
    this.overwrite = false;
  }

  inputDigit(d) {
    if (this.current === 'Error' || this.overwrite) {
      this.current = d;
      this.overwrite = false;
    } else {
      this.current = this.current === '0' ? d : this.current + d;
    }
  }

  inputDecimal() {
    if (this.current === 'Error' || this.overwrite) {
      this.current = '0.';
      this.overwrite = false;
    } else if (!this.current.includes('.')) {
      this.current += '.';
    }
  }

  delete() {
    if (this.overwrite || this.current === 'Error') return;
    this.current = this.current.length > 1 ? this.current.slice(0, -1) : '0';
    if (this.current === '-') this.current = '0';
  }

  toggleSign() {
    if (this.current === '0' || this.current === 'Error') return;
    this.current = this.current.startsWith('-') ? this.current.slice(1) : '-' + this.current;
  }

  percent() {
    if (this.current === 'Error') return;
    this.current = Calculator.format(Number(this.current) / 100);
  }

  setOperator(op) {
    if (this.current === 'Error') return;
    if (this.operator && !this.overwrite) this.evaluate();
    this.previous = this.current;
    this.operator = op;
    this.overwrite = true;
  }

  evaluate() {
    if (this.operator === null || this.previous === null) return;
    const a = Number(this.previous);
    const b = Number(this.current);
    let result;
    switch (this.operator) {
      case '+': result = a + b; break;
      case '-': result = a - b; break;
      case '*': result = a * b; break;
      case '/': result = b === 0 ? NaN : a / b; break;
    }
    this.current = Number.isFinite(result) ? Calculator.format(result) : 'Error';
    this.previous = null;
    this.operator = null;
    this.overwrite = true;
  }

  /** Round away floating point noise (0.1 + 0.2 => 0.3). */
  static format(n) {
    return String(parseFloat(n.toPrecision(12)));
  }

  expression() {
    const symbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };
    return this.operator ? `${this.previous} ${symbols[this.operator]}` : '';
  }
}

if (typeof module !== 'undefined') module.exports = { Calculator };
