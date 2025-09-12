import { firefox, chromium } from "playwright";
import fs from "fs";
import { execSync } from "child_process";


const proxyServer = { server: "http://squid:3128" };
const contextOptions = {
  viewport: { width: 1280, height: 800 },
  ignoreHTTPSErrors: true, // <--- disables SSL check as we funnel requests through proxy
  timeout: 5000,
};

function logNote(message) {
  const timestamp = String(BigInt(Date.now()) * 1000000n).slice(0, 16);
  console.log(`${timestamp} ${message}`);
}

async function startFifoReader(fifoPath, callback) {
  function openStream() {
    const stream = fs.createReadStream(fifoPath, { encoding: "utf-8" });
    stream.on("data", (chunk) => callback(chunk.trim()));
    stream.on("end", () => {
      // Writer closed FIFO, reopen it
      openStream();
    });
    stream.on("error", (err) => {
      console.error(err);
      throw err
      // setTimeout(openStream, 100); // reopening is not really an option for us as we run inside container
    });
  }
  openStream();
}


// Test 1 - BRANCH: Launch Branch website with no cookies
async function run(browserName) {
  let browser = null;
  if (browserName === "firefox") {
    browser = await firefox.launch({ headless: true, proxy: proxyServer});
  } else {
    browser = await chromium.launch({
      headless: false,
      args: ["--headless=new"],
      proxy: proxyServer,
    });
  }
  const context = await browser.newContext(contextOptions);
  await context.clearCookies();
  const page = await context.newPage()

  execSync(`mkfifo /tmp/playwright-ipc-ready`); // signal that browser is launched
  execSync(`mkfifo /tmp/playwright-ipc-commands`); // create pipe to get commands

  await startFifoReader("/tmp/playwright-ipc-commands", async (data) => {
      if (data == 'end') {
          browser.close()
          context.close()
          page.close()
          process.exit(0)
      } else {
          console.log('Evaluating', data);
          await eval(`(async () => { ${data} })()`);
          fs.writeFileSync("/tmp/playwright-ipc-ready", "ready", "utf-8");   // signal that browser is ready for next command
      }
  });

};

// CLI args
const argv = process.argv;
const args = {};
for (let i = 2; i < argv.length; i++) {
  if (argv[i] === "--browser" && argv[i + 1]) {
    args.browser = argv[++i];
  }
}

await run((args.browser || "chromium").toLowerCase());

