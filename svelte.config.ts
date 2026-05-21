import adapter from "@sveltejs/adapter-static";
import type { Config } from "@sveltejs/kit";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

const config: Config = {
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
