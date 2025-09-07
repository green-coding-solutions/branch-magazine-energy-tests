const { firefox } = require("playwright");

const browserOptions = {
  headless: true,
  proxy: { server: "http://squid:3128" }, // replace with your proxy
};

const contextOptions = {
  viewport: { width: 1280, height: 800 },
  ignoreHTTPSErrors: true, // <--- disables SSL check as we funnel requests through proxy
  timeout: 5000,
};

// Test 1 - BRANCH STAGING: Launch Branch website with no cookies
(async () => {
  let browser = await firefox.launch(browserOptions); // Or 'firefox' or 'webkit'.
  let context = await browser.newContext(contextOptions);
  await context.clearCookies();
  let page = await context.newPage();
  await page.goto("https://branch-staging.climateaction.tech");
  await page.waitForTimeout(5000);
  await context.close();
  await browser.close();

  console.log('test 1 ok')


// Test 2 - BRANCH STAGING: Launch Branch website with grid-aware cookies set

  browser = await firefox.launch(browserOptions); // Or 'firefox' or 'webkit'.
  context = await browser.newContext(contextOptions);
  await context.clearCookies();
  // Set the cookie so that grid-awareness is triggered
  await context.addCookies([
    {
      name: "gaw-user-opt-in",
      value: "true",
      domain: "branch-staging.climateaction.tech",
      path: "/",
    },
  ]);
  page = await context.newPage();
  await page.goto("https://branch-staging.climateaction.tech");
  await page.waitForTimeout(5000);
  await context.close();
  await browser.close();

  console.log('Test 2 ok')


// Test 3 - BRANCH STAGING: Launch Branch website with grid-aware cookies set and visit Issues page
  // browser = await firefox.launch(browserOptions); // Or 'firefox' or 'webkit'.
  // context = await browser.newContext(contextOptions);
  // await context.clearCookies();
  // // Set the cookie so that grid-awareness is triggered
  // await context.addCookies([
  //   {
  //     name: "gaw-user-opt-in",
  //     value: "true",
  //     domain: "branch-staging.climateaction.tech",
  //     path: "/",
  //   },
  // ]);
  // page = await context.newPage();
  // await page.goto("https://branch-staging.climateaction.tech");
  // await page.getByRole("link", { name: "Issues" }).click();
  // await page.waitForNavigation(
  //   "https://branch-staging.climateaction.tech/issues",
  // );
  // await page.waitForTimeout(5000);
  // await context.close();
  // await browser.close();
})();