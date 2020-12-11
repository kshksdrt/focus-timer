module.exports = {
	productionSourceMap: false,
	pwa: {
		name: "Focus Timer",
		themeColor: "#4959c5",
		msTileColor: "#000000",
		appleMobileWebAppCapable: "yes",
		appleMobileWebAppStatusBarStyle: "black",
	},
	configureWebpack: {
		optimization: {
			splitChunks: {
				minSize: 10000,
				maxSize: 250000,
			},
		},
	},
};
