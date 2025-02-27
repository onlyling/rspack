const isJsFile = /\.[cm]?js(?:\?.*)?$/i;
const isCssFile = /\.css(?:\?.*)?$/i;

const esbuild = require("esbuild");
const { minify } = require("terser");
const { RawSource, SourceMapSource } = require("webpack-sources");
module.exports = class RspackMinifyPlugin {
	/**
	 *
	 * @param {{minifier: 'esbuild' | 'terser'}} options
	 */
	constructor(options) {
		this.options = {
			minifier: "esbuild",
			target: "es6",
			css: false,
			...options
		};
	}
	async transform(code, { sourcemap, sourcefile, css }) {
		if (this.options.minifier === "esbuild" || css) {
			return await esbuild.transform(code, {
				loader: css ? "css" : "js",
				target: this.options.target,
				sourcefile,
				sourcemap,
				format: "iife",
				minify: true,
				minifyIdentifiers: true,
				minifySyntax: true,
				minifyWhitespace: true
			});
		} else if (this.options.minifier === "terser") {
			delete this.options.minifier;
			delete this.options.target;
			delete this.options.css;
			const result = await minify(
				{
					[sourcefile]: code
				},
				{
					sourceMap: sourcemap,
					...this.options
				}
			);
			return result;
		}
	}
	apply(compiler) {
		compiler.hooks.thisCompilation.tap("RspackMinifyPlugin", compilation => {
			compilation.hooks.processAssets.tapPromise(
				{
					name: "RspackMinifyPlugin"
				},
				async _ => {
					const {
						options: { devtool }
					} = compilation.compiler;
					const sourcemap = !!devtool;
					const assets = compilation.getAssets().filter(asset => {
						return (
							isJsFile.test(asset.name) ||
							(this.options.css && isCssFile.test(asset.name))
						);
					});

					await Promise.all(
						assets.map(async asset => {
							const { source, map } = asset.source.sourceAndMap();
							const sourceAsString = source.toString();
							const result = await this.transform(sourceAsString, {
								sourcemap,
								css: isCssFile.test(asset.name),
								sourcefile: asset.name
							});
							compilation.updateAsset(
								asset.name,
								sourcemap
									? new SourceMapSource(
											result.code,
											asset.name,
											result.map,
											sourceAsString,
											map,
											true
									  )
									: new RawSource(result.code),
								{
									...asset.info,
									minimized: true
								}
							);
						})
					);
				}
			);
		});
	}
};
