"use client";

import { useState } from "react";

const KEYS = [
  "7",
  "8",
  "9",
  "/",
  "4",
  "5",
  "6",
  "*",
  "1",
  "2",
  "3",
  "-",
  "0",
  ".",
  "=",
  "+",
];

function evaluateExpression(expression: string) {
  const sanitized = expression.replace(/[^0-9+\-*/.()]/g, "");
  const tokens = sanitized.match(/(\d+(?:\.\d+)?)|[+\-*/()]/g);
  if (!tokens) {
    throw new Error("Invalid expression");
  }

  const precedence: Record<string, number> = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2,
    "u-": 3,
  };

  const output: string[] = [];
  const operators: string[] = [];

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];

    if (/^\d/.test(token)) {
      output.push(token);
      continue;
    }

    if (token === "(") {
      operators.push(token);
      continue;
    }

    if (token === ")") {
      while (operators.length && operators.at(-1) !== "(") {
        output.push(operators.pop()!);
      }
      if (!operators.length || operators.pop() !== "(") {
        throw new Error("Mismatched parentheses");
      }
      continue;
    }

    if (token === "-" && (i === 0 || ["+", "-", "*", "/", "("].includes(tokens[i - 1]))) {
      operators.push("u-");
      continue;
    }

    while (
      operators.length &&
      operators.at(-1) !== "(" &&
      precedence[operators.at(-1)!] >= precedence[token]
    ) {
      output.push(operators.pop()!);
    }

    operators.push(token);
  }

  while (operators.length) {
    const operator = operators.pop()!;
    if (operator === "(" || operator === ")") {
      throw new Error("Mismatched parentheses");
    }
    output.push(operator);
  }

  const valueStack: number[] = [];
  for (const token of output) {
    if (/^\d/.test(token)) {
      valueStack.push(parseFloat(token));
      continue;
    }

    if (token === "u-") {
      const operand = valueStack.pop();
      if (operand === undefined) {
        throw new Error("Invalid expression");
      }
      valueStack.push(-operand);
      continue;
    }

    const b = valueStack.pop();
    const a = valueStack.pop();
    if (a === undefined || b === undefined) {
      throw new Error("Invalid expression");
    }

    switch (token) {
      case "+":
        valueStack.push(a + b);
        break;
      case "-":
        valueStack.push(a - b);
        break;
      case "*":
        valueStack.push(a * b);
        break;
      case "/":
        if (b === 0) {
          throw new Error("Division by zero");
        }
        valueStack.push(a / b);
        break;
      default:
        throw new Error("Invalid operator");
    }
  }

  if (valueStack.length !== 1) {
    throw new Error("Invalid expression");
  }

  return valueStack[0];
}

export default function Calculator() {
  const [expr, setExpr] = useState("");

  const press = (key: string) => {
    if (key === "=") {
      try {
        const result = evaluateExpression(expr);
        setExpr(String(result));
      } catch {
        setExpr("Error");
      }
    } else {
      setExpr((prev) => (prev === "Error" ? key : prev + key));
    }
  };

  return (
    <div className="h-full flex flex-col bg-desk-panel p-3 gap-2 font-display">
      <div className="bg-desk-bg-2 text-right text-xl text-desk-accent rounded px-3 py-4 min-h-12 break-all border border-desk-border">
        {expr || "0"}
      </div>
      <button
        className="text-xs text-desk-text-dim self-end hover:text-desk-accent transition-colors"
        onClick={() => setExpr("")}
      >
        clear
      </button>
      <div className="grid grid-cols-4 gap-2 flex-1">
        {KEYS.map((key) => (
          <button
            key={key}
            onClick={() => press(key)}
            className="bg-desk-panel-light text-desk-text rounded hover:bg-desk-border hover:text-desk-accent active:scale-95 transition-all border border-desk-border"
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
}
