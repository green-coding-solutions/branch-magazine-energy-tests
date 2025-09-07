# Branch Magazine Browser Rendering Energy Tests



This repo contains file to use the [Green Metrics Tool](https://github.com/green-coding-solutions/green-metrics-tool/)
to measure the rendering energy of the [Branch Magazine](https://branch.climateaction.tech/) as well as the cost
for transforming the page to a carbon aware page.

## Website Rendering tests

I uses a Firefox browser and a tightly controlled measurement setup from the [Green Metrics Tool Cluster](https://metrics.green-coding.io/cluster-status.html)
to measure the energy used during the rendering of the website.

The flow is as follows:
- Create a headless Firefox Browser instrumented with Playwright
    + Viewport Size 1280 x 800
    + Default Timeout 5 seconds
- Create a *squid* reverse proxy with HTTP/HTTPS caching of all resources
- Load *Branch Magazine* page once to warmup and populate the cache
- Load page again 
    + This is the measuremt data which will be used for evaluation

### Variants

The repository contains two variants:

- normal - https://branch.climateaction.tech/
- staging - https://branch-staging.climateaction.tech


## Cloudflare Worker tests

Transforming Branch to a carbon-aware page is done by a Cloudflare worker.

This one can be tested locally via:

```bash
cd cloudflare-worker
npm install
echo 'EMAPS_API_KEY="your_api_key_here"' > .dev.vars # set Electricity Maps API Key
wrangler dev --local local-worker.js # will show a URL. Click it to test
``
