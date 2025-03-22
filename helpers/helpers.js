export async function sleep(ms)
{
  return new Promise((r) => {
    setTimeout(r,ms);
  });
}

 // Promisify-ish
export async function P(o, m, ...args)
{
  return new Promise((r) => {
    args.push(r);
    // o[m].call(o, r);
    o[m].apply(o, args);
  });
}
