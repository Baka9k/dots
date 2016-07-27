var dots = {};



dots.data = {
	dotsarray: [],
	linesarray: [],
};

dots.variables = {
	
	colors: {
		field: "#000000",
		line: "#00CED1",
		lineNumber: "#00CED1",
		dot: "#FF0000",
		buttonStroke: "#00CED1",
		buttonText: "#00CED1",
		buttonBackground: "#000000",
	},
	
	dotSize: 10,
	lineWidth: 0.1,
	font: '10px Arial',
	buttonFont: '30px Arial Black',
	canvas: "",
	context: "",
	width: 0,
	height: 0,
	
	tileWidth: 32,
	tileHeight: 32,
	
	tilesOnX: 0,
	tilesOnY: 0,
	
	dotsCounter: 0,
	linesCounter: 0,
	
	isMoving: false,
	dotIsMoving: false,
	connectionModeEnabled: false,
	connectingStarted: false,
	
};

dots.camera = {
	scale: 1,
	fromX: 0,
	fromY: 0,
	displacementX: 0,
	displacementY: 0
};

dots.renderingTemporaryVariables = {
	tileWidth: 0,
	tileHeight: 0,
	firstVisibleTileX: 0,
	lastVisibleTileX: 0,
	firstVisibleTileY: 0,
	lastVisibleTileY: 0,
};

dots.buttons = {
	connectionMode: {
		name: "connectionMode",
		offsetRight: 50,
		offsetBottom: 50,
		width: 40,
		height: 40,
		text: "C",
		textOffsetX: 8,
		textOffsetY: 30,
	},
};



dots.init = function() {
	
	dots.prepareCanvas();
	dots.activateEventListeners();
	dots.calculateVariables();
	
	dots.draw();
	
};


dots.calculateVariables = function() {
	
	var vars = dots.variables;
	
	vars.tilesOnX = Math.ceil(vars.width / vars.tileWidth);
	vars.tilesOnY = Math.ceil(vars.height / vars.tileHeight);
	
};


dots.prepareCanvas = function() {
	
	var canvas = document.getElementById('canvas0');
	var context = canvas.getContext("2d");
	var width = window.innerWidth;
	var height = window.innerHeight;
	
	canvas.width = width;
    canvas.height = height;
    canvas.style.position = "absolute";
    canvas.style.left = "0px";
    canvas.style.top = "0px";
    
    dots.variables.canvas = canvas;
    dots.variables.context = context;
    dots.variables.width = width;
    dots.variables.height = height;
    
};


dots.activateEventListeners = function() {
	
	var canvas = dots.variables.canvas;
	
	document.addEventListener('keydown', dots.handleKeyDown, false);
	//canvas.onmousedown = dots.fieldDragging.startMoving;
	//canvas.onmousemove = dots.fieldDragging.move;
	// canvas.onmouseup = dots.fieldDragging.stopMoving;
	// canvas.onmouseout = dots.fieldDragging.mouseout;
    
};


dots.handleKeyDown = function(event) {
	
	var keyCode = event.keyCode;
	
	switch(keyCode) {
		case 38:
			dots.camera.up();
			break;
		case 40:
			dots.camera.down();
			break;
		case 37:
			dots.camera.left();
			break;
		case 39:
			dots.camera.right();
			break;
		case 67:
			dots.variables.connectionModeEnabled = !dots.variables.connectionModeEnabled;
			break;
		default:
			return;
	}
	
	//←    37
	//↑    38
	//→    39
	//↓    40
	//c C  67
	
	dots.draw();
	
}


dots.checkIfPointerOnButton = function (x, y) {
	var buttons = dots.buttons;
	for (var btn in buttons) {
		var button = buttons[btn];
		var buttonStartX = dots.variables.width - button.offsetRight;
		var buttonEndX = buttonStartX + button.width;
		var buttonStartY = dots.variables.height - button.offsetBottom;
		var buttonEndY = buttonStartY + button.height;
		if ( (x > buttonStartX) && (y > buttonStartY) && (x < buttonEndX) && (y < buttonEndY) ) {
			return button.name;
		}
	}
	return false;
};


dots.updateRenderingTemporaryVariables = function() {
	
	var mainVars = dots.variables;
	var tempVars = dots.renderingTemporaryVariables;
	var camera = dots.camera;
	
	tempVars.tileWidth = mainVars.tileWidth * camera.scale;
	tempVars.tileHeight = mainVars.tileHeight * camera.scale;
	
};


dots.draw = function() {
	
	dots.updateRenderingTemporaryVariables();
	
	dots.drawField();
	dots.drawGrid();
	//dots.drawLines();
	//dots.drawDots();
	dots.drawTools();
	
}


dots.drawField = function() {
	
	var context = dots.variables.context;
	var fieldColor = dots.variables.colors.field;
	var width = dots.variables.width;
	var height = dots.variables.height;
	
	context.fillStyle = fieldColor;
	context.fillRect(0, 0, width, height);
	
}


dots.drawLine = function (orientation, where, from, to, text) {
	
	var vars = dots.variables;
	var lineWidth = vars.lineWidth;
	var lineColor = vars.colors.line;
	var textColor = vars.colors.lineNumber;
	var font = vars.font;
	var context = vars.context;
	
	context.strokeStyle = lineColor;
	context.fillStyle = textColor;
	context.font = font;
	context.lineWidth = lineWidth;
	
	if (orientation == "horizontal") {
		
		context.beginPath();
		context.moveTo(from, where);
		context.lineTo(to, where);
		context.stroke();
		
		context.fillText(text, from + 4, where + 12);
		
	} else if (orientation == "vertical") {
		
		context.beginPath();
		context.moveTo(where, from);
		context.lineTo(where, to);
		context.stroke();
		
		context.fillText(text, where + 4, from + 12);
		
	}
	
}


dots.drawGrid = function() {
	
	var vars = dots.variables;
	
	for (var i = 0; i < vars.tilesOnY; i++) {
		dots.drawLine("horizontal", i * vars.tileHeight, 0, vars.width, i);
	}
	for (var i = 0; i < vars.tilesOnX; i++) {
		dots.drawLine("vertical", i * vars.tileWidth, 0, vars.height, i);
	}
	
}


dots.drawTools = function() {
	
	var buttons = dots.buttons;
	var vars = dots.variables;
	
	for (var btn in buttons) {
		
		var button = buttons[btn];
		var x = vars.width - button.offsetRight;
		var y = vars.height - button.offsetBottom;
		var width = button.width;
		var height = button.height;
		var context = vars.context;
		var font = vars.buttonFont;
		var text = button.text;
		var textOffsetX = button.textOffsetX;
		var textOffsetY = button.textOffsetY;
		
		//button background and stroke
		context.fillStyle = vars.colors.buttonBackground;
		context.fillRect(x, y, width, height);
		context.strokeStyle = vars.colors.buttonStroke;
		context.lineWidth = 2;
		context.strokeRect(x, y, width, height);
		
		//button text shadow
		context.font = font;
		context.shadowColor = vars.colors.buttonText;
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		context.shadowBlur = 5;
		context.strokeStyle = vars.colors.buttonText;
		context.lineWidth = 2;
		context.strokeText(text, x + textOffsetX, y + textOffsetY);
		context.shadowBlur = 0;
		
		//button text
		if (vars.connectionModeEnabled) {
			context.fillStyle = vars.colors.buttonText;
		} else {
			context.fillStyle = vars.colors.buttonBackground;
		}
		context.fillText(text, x + textOffsetX, y + textOffsetY);
		
	}
	
}












window.onload = function() {
	dots.init();
};





