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

const evaluateExpression = (expression: string) => {
  const tokens = expression.match(/(\d+\.?\d*|\.\d+|[()+\-*/])/g);
  if (!tokens) throw new Error("Invalid expression");

  const precedence: Record<string, number> = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2,
  };

  const output: string[] = [];
  const operators: string[] = [];

  for (const token of tokens) {
    if (/^\d+(\.\d+)?$/.test(token) || /^\.\d+$/.test(token)) {
      output.push(token);
    } else if (token === "(") {
      operators.push(token);
    } else if (token === ")") {
      while (operators.length && operators[operators.length - 1] !== "(") {
        output.push(operators.pop()!);
      }
      if (operators.pop() !== "(") throw new Error("Mismatched parentheses");
    } else {
      while (
        operators.length &&
        operators[operators.length - 1] !== "(" &&
        precedence[operators[operators.length - 1]] >= precedence[token]
      ) {
        output.push(operators.pop()!);
      }
      operators.push(token);
    }
  }

  while (operators.length) {
    const op = operators.pop()!;
    if (op === "(" || op === ")") throw new Error("Mismatched parentheses");
    output.push(op);
  }

  const stack: number[] = [];

  for (const token of output) {
    if (/^\d+(\.\d+)?$/.test(token) || /^\.\d+$/.test(token)) {
      stack.push(parseFloat(token));
    } else {
      const b = stack.pop();
      const a = stack.pop();
      if (a === undefined || b === undefined) throw new Error("Invalid expression");
      switch (token) {
        case "+":
          stack.push(a + b);
          break;
        case "-":
          stack.push(a - b);
          break;
        case "*":
          stack.push(a * b);
          break;
        case "/":
          if (b === 0) throw new Error("Division by zero");
          stack.push(a / b);
          break;
        default:
          throw new Error("Invalid operator");
      }
    }
  }

  if (stack.length !== 1) throw new Error("Invalid expression");
  return stack[0];
};

export default function Calculator() {
  const [expr, setExpr] = useState("");

  const press = (key: string) => {
    if (key === "=") {
      try {
        const result = evaluateExpression(expr.replace(/[^0-9+\-*/.()]/g, ""));
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
      <div className="bg-desk-bg text-right text-xl text-desk-accent rounded px-3 py-4 min-h-12 break-all">
        {expr || "0"}
      </div>
      <button
        className="text-xs text-slate-400 self-end hover:text-slate-200"
        onClick={() => setExpr("")}
      >
        clear
      </button>
      <div className="grid grid-cols-4 gap-2 flex-1">
        {KEYS.map((key) => (
          <button
            key={key}
            onClick={() => press(key)}
            className="bg-desk-panel-light text-slate-100 rounded hover:bg-desk-border active:scale-95 transition"
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
}
