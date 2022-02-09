document.querySelector(".header__burger").addEventListener("click", () => {
	document.querySelector(".header__burger span").classList.toggle("active"),
		document.querySelector(".header__list").classList.toggle("animate");
});
