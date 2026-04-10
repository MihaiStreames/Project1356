import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess()],

	kit: {
		adapter: adapter(),
		// github pages serves from /Project1356/ subpath
		paths: {
			base: process.env.NODE_ENV === "production" ? "/Project1356" : "",
		},
	},
};

export default config;
