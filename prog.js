const test1 = '{}f(g4[]g)'
const test2 = '{}{f(g4[]g)'

const brackets = new Set(["(", ")", "[", "]", "{", "}"]);
const openBrackets = new Set(["(", "[", "{"]);
const CloseBrackets = new Set([")", "]", "}"]);

const parenthesisOpen = "(";
const parenthesisClose = ")";
const bracketOpen = "[";
const bracketClose = "]";
const curlyOpen = "{";
const curlyClose = "}";


function areBrackets(char) {
  return brackets.has(char);
}

function isOpenBracket(char) {
  return openBrackets.has(char);
}

function isCloseBracket(char) {
  return CloseBrackets.has(char);
}

const stack = [];

for (let i = 0; i < test1.length; i++) {
    const char = test1[i];
    console.log(stack, '====', char);
    if (!areBrackets(char)) {
        continue;
    }

    if (isOpenBracket(char)) {
        stack.push(char);
    }

    if (isCloseBracket(char)) {
        const previousBracket = stack[stack.length - 1]

        const ShouldPop = previousBracket === parenthesisOpen && char === parenthesisClose || previousBracket === bracketOpen && char === bracketClose || previousBracket === curlyOpen && char === curlyClose

        if (ShouldPop) {
            stack.pop();
        } else {
            stack.push(char);
        }
    }
}

console.log(stack);



function areBracketsBalanced(str) {
  const stack = [];
  const bracketPairs = {
    ")": "(",
    "]": "[",
    "}": "{"
  };

  for (let char of str) {
    // If it's an opening bracket, push to stack
    if (["(", "[", "{"].includes(char)) {
      stack.push(char);
    }
    // If it's a closing bracket, check stack
    else if ([")", "]", "}"].includes(char)) {
      if (stack.length === 0) return false; // nothing to match
      const last = stack.pop();
      if (last !== bracketPairs[char]) return false; // mismatch
    }
  }

  // If stack is empty, all brackets matched
  return stack.length === 0;
}

// Examples
console.log(areBracketsBalanced("{}f(g4[]g)"));   // true
console.log(areBracketsBalanced("{}{f(g4[]g)"));  // false
console.log(areBracketsBalanced("([{}])"));       // true
console.log(areBracketsBalanced("([{})]"));       // false
