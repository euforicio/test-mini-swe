function add(a, b) {
  return Number(a) + Number(b);
}
function multiply(a, b) {
  return Number(a) * Number(b);
}
module.exports = { add, multiply };

if (require.main === module) {
  const [op, x, y] = process.argv.slice(2);
  const a = Number(x), b = Number(y);
  if (op === 'add') console.log(add(a, b));
  else if (op === 'multiply') console.log(multiply(a, b));
  else console.log('Usage: node calculator.js <add|multiply> <a> <b>');
}
