
require.config({
	paths: {
		"jquery" : "../lib/jquery-3.1.1",
		"gdzoom": "../lib/jquery-gdszoom/jquery.gdszoom",
		"lazyload" : "../lib/jquery_lazyload/jquery.lazyload"
	},
	shim: {
		"lazyload" : ["jquery"],
		"gdzoom" : ["jquery"]
	}

})