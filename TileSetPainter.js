/*
*   CopyRight 2018 (t)ad. All Rights Reserved.
*	
*	TileSetPainter HTML5 version.
*	Draw out your scenes, and get 2D Arrays of your scenes.
*	Can also draw from a 2D Array. 
*	Right click on your scene to save it as a .png image.
*	Hover over your tilesheet to see the cords and index location of each tile. (very useful during programming)
*   Use the animation corner tp create and get animationSpecs Objects.
*   The Objects are set up and ready to be used with Classes like tabageos.CanvasAnimation and AnimatedBlittedTileMover.
* 
*	You are free to use this application, but not to rehost it on your website.
*	A ready offline version is included in the full tabageos game code library download; here.
*
*/
(function() {

	var tileSet = null;
	var tileWidth = 16;
	var tileHeight = 16;
	var columns = 80;
	var rows = 17;
	var gridCanvas = null;
	var drawCanvas = null;
	var backgroundImage = null;
	var cursorCanvas = null;
	var resultArray = [];
	var helperArray = [];
	var tips = [];
	var currentBlitYX = [0,0];
	var cC = 80;
	var cR = 17;
	var tW = 16;
	var tH = 16;
	var twField;
	var thField;
	var cField;
	var rField;
	var _aid;
	var pr;
	var _thrott = 0;

	function TileSetPainter() {
		
	};
	TileSetPainter.prototype = new tabageos.EventDispatcher();
	TileSetPainter._ref;
	TileSetPainter.prototype._rect;
	TileSetPainter.prototype._point;
	TileSetPainter.prototype.readyABTM;
	TileSetPainter.prototype.readyRT;
	TileSetPainter.prototype.readyAnimationSpecs = {};
	TileSetPainter.prototype._animations = {};
	TileSetPainter.prototype._aFrames = 8;
	TileSetPainter.prototype._animationNames = [];
	
	TileSetPainter.prototype.init = function(e) {
		window.removeEventListener('DOMContentLoaded', TileSetPainter._ref.init, false);
		document.getElementById("fileToLoad").addEventListener("change", TileSetPainter._ref.loadTileSheet, false);
		document.getElementById("backgroundImg").addEventListener("change", TileSetPainter._ref.loadBackground, false);
		
		twField = document.getElementById("tileWidth");
		thField = document.getElementById("tileHeight");
		cField = document.getElementById("Columns");
		rField = document.getElementById("Rows");
		TileSetPainter._ref._point = new tabageos.MoverPoint();
		TileSetPainter._ref._rect  = new tabageos.Rectangle();
		twField.addEventListener("change", TileSetPainter._ref.drawGridLinesOnCanvas, false);
		thField.addEventListener("change", TileSetPainter._ref.drawGridLinesOnCanvas, false);
		cField.addEventListener("change", TileSetPainter._ref.drawGridLinesOnCanvas, false);
		rField.addEventListener("change", TileSetPainter._ref.drawGridLinesOnCanvas, false);
		
		document.getElementById("changeAni").addEventListener("click", TileSetPainter._ref.changeAnimation);
		
		document.getElementById("removeFrame").addEventListener("click", TileSetPainter._ref.removeAnimationFrame);
		document.getElementById("addFrame").addEventListener("click", TileSetPainter._ref.addAnimationFrame);
		document.getElementById("getAni").addEventListener("click", TileSetPainter._ref.showAniObject);
		document.getElementById("clearAni").addEventListener("click", TileSetPainter._ref.clearAnimation);
		document.getElementById("options").addEventListener("change", TileSetPainter._ref.handleOptions, false);
		
		cursorCanvas = new tabageos.CanvasObject(null,16,16);
		document.body.appendChild(cursorCanvas.canvas);
		TileSetPainter._ref.drawGridLinesOnCanvas(null);
		
		document.getElementById("tileSheet").addEventListener("mousemove", TileSetPainter._ref.showTip, false);
		
	};
	TileSetPainter.prototype.displayAnimation = function(ts) {
		if(_thrott == 0) _thrott = ts;pr = ts - _thrott;
		if(pr >= 15) {
			var ani = document.getElementById("animationName").value;
			var ca = TileSetPainter._ref._animations[ani];
			if(ca) {
				ca._canvas.context.clearRect(ca.x,ca.y,ca.width,ca.height);
				ca.animate(.5);
				ca.blitt();
			}
			_thrott = ts;
		}
		_aid = window.requestAnimationFrame(TileSetPainter._ref.displayAnimation);
	};
	TileSetPainter.prototype.changeAnimation = function(e) {
		if(tileSet) { if(_aid) window.cancelAnimationFrame(_aid);
		
			var ani = document.getElementById("animationName").value;
			if(TileSetPainter._ref._animationNames.indexOf(ani) < 0) {
				TileSetPainter._ref._animationNames.push(ani);
			}
			var co;var ca;
			if(TileSetPainter._ref._animations[ani]) {
				ca = TileSetPainter._ref._animations[ani];
				document.getElementById("animationDisplay").innerHTML = "";
				document.getElementById("animationDisplay").appendChild(ca._canvas.canvas);
				_aid = window.requestAnimationFrame(TileSetPainter._ref.displayAnimation);
			} else { //create animation
				
				co = new tabageos.CanvasObject(null, tW*24, tH*8);
				ca = new tabageos.CanvasAnimation(tileSet.canvas, co, new tabageos.Rectangle(0,0,tW,tH),0,0,tW,tH);
				
				TileSetPainter._ref._animations[ani] = ca;
				document.getElementById("animationDisplay").innerHTML = "";
				
				var i = 0; 
				for (i; i < tW*8; i+=tW) { 
					co.context.strokeStyle = "#c8c8c8";
					co.context.strokeRect(i, 0, tileWidth, tileHeight);	
				}
				document.getElementById("animationDisplay").appendChild(ca._canvas.canvas);
			}
			ca._canvas.canvas.removeEventListener("mouseup", TileSetPainter._ref.placeAnimationPiece, false);
			ca._canvas.canvas.addEventListener("mouseup", TileSetPainter._ref.placeAnimationPiece, false);
		}
	};
	TileSetPainter.prototype.clearAnimation = function(e) {
		
		var ani = document.getElementById("animationName").value;
		if(TileSetPainter._ref._animationNames.indexOf(ani) ) {
			TileSetPainter._ref._animationNames.splice(TileSetPainter._ref._animationNames.indexOf(ani), 1);
		}
		try {
			document.getElementById("animationDisplay").removeChild(TileSetPainter._ref._animations[ani]._canvas.canvas)
		} catch(e) { }
		TileSetPainter._ref._animations[ani] = null;
		delete TileSetPainter._ref.readyAnimationSpecs[ani];
	};
	TileSetPainter.prototype.placeAnimationPiece = function(e) {
		var indexX = Math.floor(e.offsetX / tW);
		var indexY = Math.floor(e.offsetY / tH);
		var etx = indexX * tW;
		var ety = indexY * tH;
		var ani = document.getElementById("animationName").value;
		var aca = TileSetPainter._ref._animations[ani]._canvas;
		
		if(tileSet && aca && ety == 0 && etx < TileSetPainter._ref._aFrames*tW) {
			aca.context.clearRect(etx,ety,tW,tH);
			TileSetPainter._ref.updateRectPoint(currentBlitYX[1]*tW,currentBlitYX[0]*tH,tW,tH,etx,ety);
			aca.copyPixels(tileSet.canvas, TileSetPainter._ref._rect, TileSetPainter._ref._point, tW, tH);
		} else { return; }
		
		if(!TileSetPainter._ref.readyAnimationSpecs[ani]) {
			TileSetPainter._ref.readyAnimationSpecs[ani] = [ currentBlitYX[0], [currentBlitYX[1],currentBlitYX[1],currentBlitYX[1],currentBlitYX[1]] ];
		} else {
			indexX = indexX*4;
			TileSetPainter._ref.readyAnimationSpecs[ani][1][indexX] = currentBlitYX[1];
			TileSetPainter._ref.readyAnimationSpecs[ani][1][indexX+1] = currentBlitYX[1];
			TileSetPainter._ref.readyAnimationSpecs[ani][1][indexX+2] = currentBlitYX[1];
			TileSetPainter._ref.readyAnimationSpecs[ani][1][indexX+3] = currentBlitYX[1];
		}
		
		TileSetPainter._ref._animations[ani].animationSpecs = TileSetPainter._ref.readyAnimationSpecs;
		TileSetPainter._ref._animations[ani].currentAnimation = ani;
		TileSetPainter._ref._animations[ani].y = tH*2;
		TileSetPainter._ref._animations[ani].x = tW*2;
		
		if(_aid) window.cancelAnimationFrame(_aid);
		_aid = window.requestAnimationFrame(TileSetPainter._ref.displayAnimation);
	};
	TileSetPainter.prototype.removeAnimationFrame = function(e) {
		
		var ani = document.getElementById("animationName").value;
		if(TileSetPainter._ref._animations[ani]) {
			if(TileSetPainter._ref.readyAnimationSpecs[ani] && TileSetPainter._ref.readyAnimationSpecs[ani][1].length) {
				
				var alen = (TileSetPainter._ref.readyAnimationSpecs[ani][1].length / 4) - 1;
				
				if(alen == TileSetPainter._ref._aFrames-1) {
					TileSetPainter._ref._aFrames -= 1;
				}
				TileSetPainter._ref._animations[ani]._canvas.context.clearRect(alen*tW,0,tW+1,tH+1);
				TileSetPainter._ref._animations[ani]._canvas.context.strokeStyle = "#c8c8c8";
				TileSetPainter._ref._animations[ani]._canvas.context.strokeRect(alen*tileWidth, 0, tileWidth, tileHeight);
				
				TileSetPainter._ref.readyAnimationSpecs[ani][1].pop();
				TileSetPainter._ref.readyAnimationSpecs[ani][1].pop();
				TileSetPainter._ref.readyAnimationSpecs[ani][1].pop();
				TileSetPainter._ref.readyAnimationSpecs[ani][1].pop();
				
			} else {
				
				TileSetPainter._ref._animations[ani]._canvas.context.clearRect((TileSetPainter._ref._aFrames-1)*tW,0,tW+1,tH+1);
				TileSetPainter._ref._aFrames -= 1;
			}
		}
		
	};
	TileSetPainter.prototype.addAnimationFrame = function(e) {
		
		var ani = document.getElementById("animationName").value;
		if(TileSetPainter._ref._animations[ani]) { TileSetPainter._ref._aFrames += 1;
			TileSetPainter._ref._animations[ani]._canvas.context.strokeStyle = "#c8c8c8";
			TileSetPainter._ref._animations[ani]._canvas.context.strokeRect((TileSetPainter._ref._aFrames-1)*tileWidth, 0, tileWidth, tileHeight);
		}
		
	};
	TileSetPainter.prototype.showAniObject = function(e) {
		var ani = document.getElementById("animationName").value;
		var rs = "{ ";var i = 0;
		for(i; i < TileSetPainter._ref._animationNames.length;i++) {
			var n = TileSetPainter._ref._animationNames[i];
			var a = TileSetPainter._ref.readyAnimationSpecs[n];
			if(a) {
				rs +=  "\"" +n + "\":["+a[0]+", ["+a[1].toString()+"] ]" +
				((i < TileSetPainter._ref._animationNames.length - 1) ? ",\n" : " }");
			}
		}
		document.getElementById("resultsField").value = rs;
	};
	TileSetPainter.prototype.handleOptions = function(e) {
	
		if(document.getElementById("options").selectedIndex == 2) {
			TileSetPainter._ref.clear();
		}
		if(document.getElementById("options").selectedIndex == 0) {
			TileSetPainter._ref.giveResult();
		}
		if(document.getElementById("options").selectedIndex == 1) {
			TileSetPainter._ref.giveXYResult();
		}
		if(document.getElementById("options").selectedIndex == 3) {
			TileSetPainter._ref.drawFromArray();
		}
	
	};
	TileSetPainter.prototype.updateTips = function() {
		if(tileSet) {
			var i = 0;
			var j = 0;
			var l = tileSet.height/tileHeight;
			var jl = tileSet.width/tileWidth;
			var txf;
			for (i = 0; i < l; i++) {
				tips[i] = [];
				for (j = 0; j < jl; j++) {
					txf = "x,y: [ " + j + " , " + i + " ]  " +
						  "pos: "+(j*tileWidth)+", "+(i*tileHeight)+"  "+
						  "y,x: [ " + i + " , " + j + " ] ";
					tips[i][j] = txf;
				}
			}
		}
	};
	TileSetPainter.prototype.showTip = function(e) {
		if(tileSet) {
			var x = Math.floor(e.offsetX/tW);
			var y = Math.floor(e.offsetY/tH);
			tileSet.canvas.setAttribute("title", tips[y] ? (tips[y][x] || ""): "");
		}
	};
	TileSetPainter.prototype.drawGridLinesOnCanvas = function(e) {
		
		if(gridCanvas) {
			document.getElementById("grid").removeChild(gridCanvas.canvas);
			gridCanvas.context.clearRect(0,0,columns*tileWidth,rows*tileHeight);
		}
		
		tileWidth = Number(twField.value); tileHeight = Number(thField.value);
		columns = Number(cField.value); rows = Number(rField.value);
		cC = Number(cField.value); cR = Number(rField.value);
		tW = Number(twField.value); tH = Number(thField.value);
		TileSetPainter._ref.clear(1);
		TileSetPainter._ref.updateTips();
		
		gridCanvas = new tabageos.CanvasObject(null,columns*tileWidth,rows*tileHeight);
		drawCanvas = new tabageos.CanvasObject(null,columns*tileWidth,rows*tileHeight);
		document.getElementById("grid").appendChild(drawCanvas.canvas);
		document.getElementById("grid").appendChild(gridCanvas.canvas);
		
		gridCanvas.canvas.setAttribute("style","position:absolute;top:0px;left:0px;z-index:-1;");
		drawCanvas.canvas.setAttribute("style","position:absolute;top:0px;left:0px;z-index:1;");
		
		if(cursorCanvas) {
			document.body.removeChild(cursorCanvas.canvas);
		}
		
		cursorCanvas = new tabageos.CanvasObject(null,tW,tH);
		document.body.appendChild(cursorCanvas.canvas);
		var i = 0; var j = 0;
		for (i; i < rows; i++) { j = 0;
			for (j; j < columns; j++) {
				gridCanvas.context.strokeStyle =  "#c8c8c8";
				gridCanvas.context.strokeRect(j * tileWidth, i * tileHeight, tileWidth, tileHeight);
			}
		}
	};
	TileSetPainter.prototype.loadTileSheet = function(e) {

		var filesSelected = document.getElementById("fileToLoad").files;
		if (filesSelected.length > 0) {
		  var fileToLoad = filesSelected[0];
		  var fileReader = new FileReader();

		  fileReader.onload = function(e) {
			var srcData = e.target.result;
			var newImage = document.createElement('img');
			
			newImage.onload = function(e) {
				if(tileSet) { tileSet.context.clearRect(0,0,tileSet.width,tileSet.height); 
					document.getElementById("tileSheet").removeChild(tileSet.canvas);
				}
				tileSet = new tabageos.CanvasObject(null,newImage.width,newImage.height);
				tileSet.copyPixels(newImage, new tabageos.Rectangle(0,0,newImage.width,newImage.height),new tabageos.MoverPoint(),newImage.width,newImage.height);
				document.getElementById("tileSheet").appendChild(tileSet.canvas);
				TileSetPainter._ref.updateTips();
				tileSet.canvas.removeEventListener("click",TileSetPainter._ref.selectTile, false);
				tileSet.canvas.addEventListener("click",TileSetPainter._ref.selectTile, false);
			}; newImage.src = srcData;
		  };
		  fileReader.readAsDataURL(fileToLoad);
		}
	};
	TileSetPainter.prototype.loadBackground = function(e) {
		
		var filesSelected = document.getElementById("backgroundImg").files;
		if (filesSelected.length > 0) {
			var fileToLoad = filesSelected[0];
			var fileReader = new FileReader();

		  fileReader.onload = function(e) {
			var srcData = e.target.result;
			if(backgroundImage) { document.getElementById("grid").removeChild(backgroundImage); }
			backgroundImage = document.createElement('img');
			
			backgroundImage.onload = function(e) {
				backgroundImage.setAttribute("style","position:absolute;top:0px;left:0px;z-index:-2");
				document.getElementById("grid").appendChild(backgroundImage);
				
			}; backgroundImage.src = srcData;
		  };
		  fileReader.readAsDataURL(fileToLoad);
		}
	};
	TileSetPainter.prototype.removeBackground = function() {
		if(backgroundImage) {
			document.getElementById("grid").removeChild(backgroundImage);
		}
	};
	TileSetPainter.prototype.updateRectPoint = function(x,y,w,h,px,py) {
		TileSetPainter._ref._rect.x = x;
		TileSetPainter._ref._rect.y = y;
		TileSetPainter._ref._rect.width = w;
		TileSetPainter._ref._rect.height = h;
		TileSetPainter._ref._point.x = px; TileSetPainter._ref._point.y = py;
	};
	TileSetPainter.prototype.selectTile = function(e) {
	
		cursorCanvas.canvas.setAttribute("style", "width:"+tileWidth+"px;height:"+tileHeight+"px");
		cursorCanvas.context.clearRect(0,0,tileWidth,tileHeight);
		currentBlitYX[0] = Math.floor(e.offsetY/tH);
		currentBlitYX[1] = Math.floor(e.offsetX/tW);
		TileSetPainter._ref.updateRectPoint(currentBlitYX[1]*tW,currentBlitYX[0]*tH,tW,tH,0,0);
		cursorCanvas.copyPixels(tileSet.canvas,TileSetPainter._ref._rect, TileSetPainter._ref._point,tileWidth,tileHeight);
		document.body.removeEventListener("mousemove",TileSetPainter._ref.moveCursor,false);
		document.body.addEventListener("mousemove",TileSetPainter._ref.moveCursor,false);
		
		drawCanvas.canvas.removeEventListener("mousedown", TileSetPainter._ref.beginPlacePiece,false);
		drawCanvas.canvas.addEventListener("mousedown", TileSetPainter._ref.beginPlacePiece,false);
		
	};
	TileSetPainter.prototype.moveCursor = function(e) {
		cursorCanvas.canvas.setAttribute("style", "position:absolute;width:"+tileWidth+"px;height:"+tileHeight+"px;left:"+(e.pageX+7)+"px;top:"+(e.pageY+7)+"px");
	};
	TileSetPainter.prototype.beginPlacePiece = function(e) {
		TileSetPainter._ref.placePiece(e);
		drawCanvas.canvas.removeEventListener("mousemove", TileSetPainter._ref.placePiece,false);
		drawCanvas.canvas.addEventListener("mousemove", TileSetPainter._ref.placePiece,false);
		drawCanvas.canvas.removeEventListener("mouseup", TileSetPainter._ref.stopPlacePiece,false);
		drawCanvas.canvas.addEventListener("mouseup", TileSetPainter._ref.stopPlacePiece,false);
	};
	TileSetPainter.prototype.stopPlacePiece = function(e) {
		drawCanvas.canvas.removeEventListener("mousemove", TileSetPainter._ref.placePiece,false);
		drawCanvas.canvas.removeEventListener("mouseup", TileSetPainter._ref.stopPlacePiece,false);
	};
	TileSetPainter.prototype.placePiece = function(e) {
		var indexX = Math.floor(e.offsetX / tW);
		var indexY = Math.floor(e.offsetY / tH);
		var etx = indexX * tW;
		var ety = indexY * tH;
		if(tileSet && drawCanvas) {
			drawCanvas.context.clearRect(etx,ety,tW,tH);
			TileSetPainter._ref.updateRectPoint(currentBlitYX[1]*tW,currentBlitYX[0]*tH,tW,tH,etx,ety);
			drawCanvas.copyPixels(tileSet.canvas, TileSetPainter._ref._rect, TileSetPainter._ref._point, tW, tH);
			helperArray[indexY][indexX] = [ currentBlitYX[0]+1-1, currentBlitYX[1]+1-1 ];
		}
	};
	TileSetPainter.prototype.clear = function(rdrawc) {
		if (drawCanvas) {
			drawCanvas.context.clearRect(0,0,columns*tW,rows*tH);
			if(rdrawc) {
				document.getElementById("grid").removeChild(drawCanvas.canvas);
			}
		}
		var ar = [];var i = 0; var r;var ri = 0;
		for (i; i < cR; i++) {
			ar.push([]);
		} i = 0;
		for (i;i<ar.length;i++) {
			r = ar[i]; ri = 0;
			for(ri;ri < cC;ri++) {
				r.push([0,0]);
			}
		}  helperArray = ar;
	};
	TileSetPainter.prototype.giveResult = function() { 
		var s = "";//the trick with these is helperArray
		var sp = "";//which is made manually as the drawing happens.
		var ins = 0;
		var ai = 0;
		var inai = 0;
		var a;
		var innerA;
		for (ai; ai < helperArray.length;ai++) {
			ins = 0; a = helperArray[ai]; inai = 0;
			if(a) {
				s += "[ ";
				for (inai; inai < a.length; inai++) {
					ins += 1; innerA = a[inai];
					if(innerA) {
						sp = "[" + innerA[0] + "," + innerA[1] + "]";
						s += sp + (ins < a.length ? ", " : "");
					}
				} 
				s += " ]" + (helperArray.indexOf(a) < helperArray.length - 1 ? ",":"") +"\n"; 
			}
		} 
		var result = "[  \n" + s + "  ];"; 
		document.getElementById("resultsField").value = result;
	};
	TileSetPainter.prototype.giveXYResult = function() {
		var s = "";
		var sp = "";
		var ins = 0;
		var ai = 0;
		var inai = 0;
		var a;
		var innerA;
		for (ai; ai < helperArray.length;ai++) {
			ins = 0; a = helperArray[ai]; inai = 0;
			if(a) {
				s += "[ ";
				for (inai; inai < a.length; inai++) {
					ins += 1; innerA = a[inai];
					if(innerA) {
						sp = "[" + innerA[1] + "," + innerA[0] + "]";
						s += sp + (ins < a.length ? ", " : "");
					}
				} 
				s += " ]" + (helperArray.indexOf(a) < helperArray.length - 1 ? ",":"") +"\n"; 
			}
		} 
			
		var result = "[  \n" + s + "  ];"; 
		document.getElementById("resultsField").value = result;
	};
	TileSetPainter.prototype.drawFromArray = function() { 
		var ar = [];
		var origS = document.getElementById("resultsField").value.replace(/[\n]/g,"");
		var i = 0;
		for (i; i < cR; i++) { ar.push([]); }
		//String to 2D Array Object, the trick is to line up the string first. ^
		var rowReg = /[\[]{1}[ ]{1}[\[]{1}[0-9]{1,}[\,]{1}[ 0-9\[\]\,]{1,}[\]]{1}[ ]{1}[\]]{1}[\,]{1}/;
		var lastRow = /[\[]{1}[ ]{1}[\[]{1}[0-9]{1,}[\,]{1}[ 0-9\[\]\,]{1,}[\]]{1}[ ]{1}[\]]{1}[ ]{1,}[\]]{1}/;
		var reg = /[\[]{1}[0-9]{1,}[\,]{1}[0-9]{1,}[\]]{1}/g;
		var syms = /[\[]{1,}/g;
		var syms2 = /[\]]{1,}/g;
		var stringRows,whole,ri,rj,r,mtch,matches,aString,noSymString,splitString,newA,a,row,ex,ey;
		
		try {
			stringRows = [];
			whole = origS.match(rowReg)[0];
			stringRows = whole.split(" ],"); stringRows.pop();
			origS = origS.replace(whole, "");
			stringRows.push(origS.match(lastRow)[0]);
		} catch (e) {
			document.getElementById("resultsField").value =
			"The Array should be formated as follows:\n" +
						"[  [ [y,x],[y,x],[y,x] ],\n" +
						"	[ [y,x],[y,x],[y,x] ]  ];"+"\n"+e.message;
			return;
		}
		ri = 0; rj = 0;
		for (ri; ri < stringRows.length; ri++) {
			 r = ar[ri];
			 mtch = String(stringRows[ri]);
			 matches = mtch.match(reg); rj = 0;
			for(rj;rj<cC;rj++) {
				if (matches && matches.length) {
					 aString = matches.shift();
					 noSymString = aString.replace(syms, "").replace(syms2,"");
					 splitString = noSymString.split(",");
					 newA = [splitString[0], splitString[1]];
					r.push(newA);
				} else {
					r.push([0, 0]);
				}
			}
		}//Array created, now draw using it
		helperArray = ar; ri = 0; rj = 0;
		if (tileSet) {
			ex = -tW;
			ey = -tH;
			for (ri; ri < helperArray.length;ri++) {
				a = helperArray[ri]; rj = 0;
				ey = ey + tH; ex = -tW;
				for(rj;rj<a.length;rj++) {
					row = a[rj];
					ex = ex + tW;
					TileSetPainter._ref.updateRectPoint(row[1] * tW,row[0]*tH,tW,tH,ex,ey);
					drawCanvas.copyPixels(tileSet.canvas, TileSetPainter._ref._rect, TileSetPainter._ref._point, tW, tH);
				}
			}
		} else {
			document.getElementById("resultsField").value += "You need to load the tile set before an Array can be drawn from.";
			return;
		}
	};
	TileSetPainter._ref = new TileSetPainter();
	window.addEventListener('DOMContentLoaded', TileSetPainter._ref.init, false);
})();