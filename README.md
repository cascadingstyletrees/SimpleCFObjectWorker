# Cloudflare Worker - JSON/HTML response based on URL path

This Cloudflare Worker serves either a JSON or HTML response depending on the path of the URL requested. The worker inspects the request path and, if it matches `/json`, it returns a JSON response that includes the Cloudflare Object (`req.cf`) and the request headers. Otherwise, it returns an HTML response that displays a simple "Hello World" message along with the Cloudflare Object and the request headers.

## How to use

To use this worker, you first need to create a Cloudflare Workers script using the code in this repository. You can then deploy the script to your Cloudflare account by following these steps:

1. Install the [Wrangler CLI](https://developers.cloudflare.com/workers/cli-wrangler) on your local machine.

2. Clone this repository and navigate to the project directory:

```shell-script
git clone https://github.com/cascadingstyletrees/SimpleCFObjectWorker.git
cd SimpleCFObjectWorker
```

3. Configure the `wrangler.toml` file with your Cloudflare account details, such as your account ID and API key.
4. Deploy the worker to your Cloudflare account using the Wrangler CLI:

```shell-script
wrangler publish
```

This command will compile your worker code and publish it to a new or existing Cloudflare Workers script.

5. Test the worker by sending requests to the URL where it's deployed, such as `https://example.com/json` or `https://example.com/`. The worker should return either a JSON or HTML response depending on the path of the URL requested.

## Customization

You can customize this worker to suit your needs by modifying the code in the `fetch` method of the `index.js` file. For example, you can change the path used to trigger the JSON response by modifying the `path` variable in the code. You can also customize the content of the HTML response by editing the `html` variable. Be sure to test your changes before deploying the worker to your Cloudflare account.

## Contributing

If you find a bug or want to suggest a new feature for this worker, please open an issue or submit a pull request on GitHub. We welcome contributions from the community!

## License
This project is licensed under the MIT License - see the [LICENSE](/LICENSE) file for details.