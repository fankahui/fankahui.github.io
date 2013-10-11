var githubGuide = new Guideline.Guide("welcome");

var tour = githubGuide.addPage("tour");

tour.addStep({
	type: "overlay",
	showAt: "#intro",
    content:
		"<div class='gl-overlay'>"+
			"<h1>Welcome to Syndicate!</h1>"+
			"<p>This is tour that you can use or not.</p>"+
			"<button class='btn btn-syndicate squared start-tour'>Start tour</button>"+
			" "+
			"<button class='btn btn-eco squared gl-skip'>Skip tour</button>"+
		"</div>",
	continueWhen: "click .start-tour",
});

tour.addStep({
	type: "bubble",
	title: "Intro section",
	content: "Full screen slider, animated menu, make your own background and slider element animations or use default.",
	showAt: "#intro",
	align: "center middle",
	showContinue: true
});

tour.addStep({
	type: "bubble",
	title: "Services section",
	content: "Show any number of services and give them one of 361 icons.",
	showAt: "#services",
	align: "center middle",
	showContinue: true
});

tour.addStep({
	type: "bubble",
	title: "Client logos",
	content: "We think that you got idea of this tour by now so we will end it.",
	showAt: "#customers",
	align: "center middle",
	showContinue: true
});

githubGuide.register();