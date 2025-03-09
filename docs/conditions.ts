// # Резюме структуры для выражений

// Мы договорились на AST с массивом operands (было children), где:
// - Каждый узел — это либо переменная, либо оператор.
// - Операторы содержат массив operands, в котором лежат их операнды (переменные или другие операторы).
// - Структура учитывает приоритеты (&& выше ||) и скобки через вложенность.
// - Универсальна: подходит для любых бинарных (и не только) операторов, легко расширяется.

// # Схематичное описание (гибкость и расширяемость)
// {
// type: "operator" | "variable",        // Тип узла: оператор или переменная
// operator?: "&&" | "" | "!" | "nor" | "nand" | ... , // Оператор, если type="operator", расширяемо
// name?: string,                        // Имя переменной, если type="variable"
// operands: [                           // Массив операндов, гибкий по количеству
// { type: "variable", name: "x" },    // Простой операнд
// { type: "operator", operator: "...", operands: [...] } // Вложенный оператор
// ]
// }

// text

// Свернуть

// Перенос

// Копировать

// - **Гибкость**: `operands` принимает любое количество элементов (от 1 для унарных, до N для многоаргументных).
// - **Расширяемость**: Добавляй новые `operator` (например, `nor`, `nand`, `xor`) — структура не ломается.
// - **Скобки и приоритеты**: Вложенность в `operands` решает всё.

// # Примеры

// ## 1. Простой: `a  b`

// ```javascript
// const ast = {
//   type: "operator",
//   operator: "",
//   operands: [
//     { type: "variable", name: "a" },
//     { type: "variable", name: "b" }
//   ]
// };
// 2. Средний: a && b  c
// javascript

// Свернуть

// Перенос

// Копировать
// const ast = {
//   type: "operator",
//   operator: "",
//   operands: [
//     {
//       type: "operator",
//       operator: "&&",
//       operands: [
//         { type: "variable", name: "a" },
//         { type: "variable", name: "b" }
//       ]
//     },
//     { type: "variable", name: "c" }
//   ]
// };
// 3. Сложный: (a && b  !c) && (v  n)
// javascript

// Свернуть

// Перенос

// Копировать
// const ast = {
//   type: "operator",
//   operator: "&&",
//   operands: [
//     {
//       type: "operator",
//       operator: "",
//       operands: [
//         {
//           type: "operator",
//           operator: "&&",
//           operands: [
//             { type: "variable", name: "a" },
//             { type: "variable", name: "b" }
//           ]
//         },
//         {
//           type: "operator",
//           operator: "!",
//           operands: [
//             { type: "variable", name: "c" }
//           ]
//         }
//       ]
//     },
//     {
//       type: "operator",
//       operator: "||",
//       operands: [
//         { type: "variable", name: "v" },
//         { type: "variable", name: "n" }
//       ]
//     }
//   ]
// };
