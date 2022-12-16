import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(),
	kit: {
		adapter: adapter({
			precompress: true,
			fallback: 'index.html'
		}),
		alias: {
			'$server-interface': '../server/'
		},
		prerender: { entries: [] }
	}
};

export default config;
