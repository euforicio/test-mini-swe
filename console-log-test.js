/* Simple console.log test script */
function main() {
  const msg = 'Hello from console.log test';
  console.log(msg);
  // also test logging an object
  console.log({ ok: true, msgLength: msg.length });
}
if (require.main === module) {
  main();
}
module.exports = { main };
