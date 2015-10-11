var getHeightElement = function(element) {
	//var img = document.getElementById('' + element); 
	//var height = img.clientHeight;

	var height = $("#" + element).outerHeight();
	console.log("Element: " + height);
	return height;
}

var resizeMenu = function(height) {
	console.log(height);
	var menu = $('#menu');
	if (window.matchMedia("(min-width:716px)").matches) {
		menu.height(height);
	}
	else {
		console.log("lala");
		menu.height("");
	}
}

var $container	= $('.content-container');
var $childs = $container.children('div');
var $image = $('#frontend-backend-image')

var timeout;

var addBlurEffect = function() {
	clearTimeout(timeout);
	timeout = setTimeout( function() {
		$image.addClass('blur-effect');
	}, 75 );
}

var removeBlurEffect = function() {
	clearTimeout(timeout);
	$image.removeClass('blur-effect');
}

$childs.on('mouseenter', addBlurEffect);
$childs.on( 'mouseleave', removeBlurEffect);



var $btnShowMenu = document.getElementById("open-menu");
var $btnHideMenu = document.getElementById("close-menu");
var $menu = document.getElementById("menu");

var $body = document.querySelector("body");

function changeButton(btn, btn2, opt) {
	btn.classList.remove(opt);
	btn2.classList.add(opt);
}

var showMenu = function() {
	$menu.classList.add("is-active");
	changeButton($btnShowMenu, $btnHideMenu, "is-active");
};

var hideMenu = function() {
	$menu.classList.remove("is-active");
	changeButton($btnHideMenu, $btnShowMenu, "is-active");
};

$btnShowMenu.addEventListener("click", showMenu);
$btnHideMenu.addEventListener("click", hideMenu);