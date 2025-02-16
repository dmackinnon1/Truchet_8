"use strict";

class TikZBuilder {

	constructor(){
		this.components = [];
		this.scale = 1;
	}

	reset(){
		this.components = [];
	}

	scale(value){
		this.scale = value;
	}

	build(){
		let s = this.buildOpen();

		for(let c in this.components) {
			s += " " + this.components[c].build();
		}

		s += this.buildClose();
		return s;
	}

	buildOpen(){
		let s = "";
		//s +=  "\\begin{figure}[!h] \n";
		//s += "\\centering \n";
		s+= "\\begin{tikzpicture}[scale="+this.scale +"]\n";
		return s;
	}

	buildClose(){
		let s = "";
		s += "\\end{tikzpicture} \n";
		//s +=  "\\end{figure} \n";		
		return s;
	}

	addLine(x1, y1, x2, y2){
		let start = new TikZPoint(x1, y1);
		let end = new TikZPoint(x2,y2);
		this.components.push(new TikZLine(start,end));
	}

	drawGrid(x1, y1, x2, y2, scale=1){
		let start = new TikZPoint(x1, y1);
		let end = new TikZPoint(x2,y2);
		this.components.push(new TikZGrid(start,end, scale));
	}
	drawTriangle(x1, y1, r=0,scale=1){
		let topLeft = new TikZPoint(x1, y1,r);
	   //this.components.push(new TikZRightTriangle(topLeft,r,scale));
		this.components.push(new TiKZWhiteSemiCircle(topLeft,r,scale));
	}

	drawDiagonal(x1, y1, r=0,scale=1){
		let topLeft = new TikZPoint(x1, y1,r);
		this.components.push(new TikZRightDiagonal(topLeft,r,scale));
	}
}

//\draw[opacity=0.5,fill=gray] (0,0)--(0,1)--(1,1)--(0,0);
class TikZRightTriangle{

constructor(topLeft, rotation=0, size=1,color="black"){
		this.color = color;
		this.size= size;
		this.topLeft = topLeft;
		this.rotation = rotation;
		}
	
	build(){
		let dash = "--";
		let topLeft = this.topLeft;
		let topRight = new TikZPoint(topLeft.x + this.size, topLeft.y);
		let bottomLeft = new TikZPoint(topLeft.x, topLeft.y - this.size);
		let bottomRight = new TikZPoint(topLeft.x + this.size, topLeft.y - this.size);
		let s = "";
		if (this.rotation==0){
			s = "\\draw[opacity=1,fill=black]" +  topLeft.build() + dash + topRight.build() + dash + bottomRight.build()+"; \n";
		}
		if (this.rotation==1){
			s = "\\draw[opacity=1,fill=black]" +  topRight.build() + dash + bottomRight.build() + dash + bottomLeft.build()+"; \n";
		}
		if (this.rotation==2){
			s = "\\draw[opacity=1,fill=black]" +  bottomRight.build() + dash + bottomLeft.build()+ dash + topLeft.build() +"; \n";
		}
		if (this.rotation==3){
			s = "\\draw[opacity=1,fill=black]" +  bottomLeft.build()+ dash + topLeft.build() + dash + topRight.build() +"; \n";
		}
		return s;

	}

}


class TiKZBlackSemiCircle{

constructor(topLeft, rotation=0, size=1,color="black"){
		this.color = color;
		this.size= size;
		this.topLeft = topLeft;
		this.rotation = rotation;
		}
	
	build(){
		let dash = "--";
		let topLeft = this.topLeft;
		
		topLeft.setLabel("A");
		let topRight = new TikZPoint(topLeft.x + this.size, topLeft.y);
		topRight.setLabel("B");
		
		let bottomRight = new TikZPoint(topLeft.x + this.size, topLeft.y - this.size);
		bottomRight.setLabel("C");
		
		let bottomLeft = new TikZPoint(topLeft.x, topLeft.y - this.size);
		bottomLeft.setLabel("D");
		
		let s = "";
		s += topLeft.coordinateDef() + "\n";
		//s += topRight.coordinateDef() + "\n";
		s += bottomRight.coordinateDef() + "\n";
		//s += bottomLeft.coordinateDef() + "\n";

		let radius = this.size;

		//s+= "\\draw (A)--(B)--(C)--(D)--cycle;\n";

		//\draw[fill=black] (A) rectangle (C);

		if (this.rotation==0){
			//s = "\\draw[opacity=1,fill=black]" +  topLeft.build() + dash + topRight.build() + dash + bottomRight.build()+"; \n";
			//s += "\\draw[opacity=1,fill=black]" +  topRight.coordinate()+" arc[start angle=0, end angle=90, radius=" + radius +"]; \n";
			s += "\\draw[path picture={\\draw[fill=black] (path picture bounding box.north east) circle ("+radius+");}] (A) rectangle (C);\n";
		}
		if (this.rotation==1){
			//s = "\\draw[opacity=1,fill=black]" +  topRight.build() + dash + bottomRight.build() + dash + bottomLeft.build()+"; \n";
			//s += "\\draw[opacity=1,fill=black]" +  bottomRight.coordinate()+" arc[start angle=0, end angle=90, radius=" + radius +"]; \n";
			s += "\\draw[path picture={\\draw[fill=black] (path picture bounding box.south east) circle ("+radius+");}] (A) rectangle (C);\n";
		}
		if (this.rotation==2){
			//s = "\\draw[opacity=1,fill=black]" +  bottomRight.build() + dash + bottomLeft.build()+ dash + topLeft.build() +"; \n";
			//s += "\\draw[opacity=1,fill=black]" +  bottomLeft.coordinate()+" arc[start angle=0, end angle=90, radius=" + radius +"]; \n";
			s += "\\draw[path picture={\\draw[fill=black] (path picture bounding box.south west) circle ("+radius+");}] (A) rectangle (C);\n";
		}
		if (this.rotation==3){
			//s = "\\draw[opacity=1,fill=black]" +  bottomLeft.build()+ dash + topLeft.build() + dash + topRight.build() +"; \n";
			//s += "\\draw[opacity=1,fill=black]" +  topLeft.coordinate()+" arc[start angle=0, end angle=90, radius=" + radius +"]; \n";
			s += "\\draw[path picture={\\draw[fill=black] (path picture bounding box.north west) circle ("+radius+");}] (A) rectangle (C);\n";
		}
		return s;

	}

}


class TiKZWhiteSemiCircle{

constructor(topLeft, rotation=0, size=1,color="black"){
		this.color = color;
		this.size= size;
		this.topLeft = topLeft;
		this.rotation = rotation;
		}
	
	build(){
		let dash = "--";
		let topLeft = this.topLeft;
		
		topLeft.setLabel("A");
		let topRight = new TikZPoint(topLeft.x + this.size, topLeft.y);
		topRight.setLabel("B");
		
		let bottomRight = new TikZPoint(topLeft.x + this.size, topLeft.y - this.size);
		bottomRight.setLabel("C");
		
		let bottomLeft = new TikZPoint(topLeft.x, topLeft.y - this.size);
		bottomLeft.setLabel("D");
		
		let s = "";
		s += topLeft.coordinateDef() + "\n";
		//s += topRight.coordinateDef() + "\n";
		s += bottomRight.coordinateDef() + "\n";
		//s += bottomLeft.coordinateDef() + "\n";

		let radius = this.size;

		//s+= "\\draw (A)--(B)--(C)--(D)--cycle;\n";

		s+= "\\draw[fill=black] (A) rectangle (C);";

		if (this.rotation==0){
			//s = "\\draw[opacity=1,fill=black]" +  topLeft.build() + dash + topRight.build() + dash + bottomRight.build()+"; \n";
			//s += "\\draw[opacity=1,fill=black]" +  topRight.coordinate()+" arc[start angle=0, end angle=90, radius=" + radius +"]; \n";
			s += "\\draw[path picture={\\draw[fill=white] (path picture bounding box.north east) circle ("+radius+");}] (A) rectangle (C);\n";
		}
		if (this.rotation==1){
			//s = "\\draw[opacity=1,fill=black]" +  topRight.build() + dash + bottomRight.build() + dash + bottomLeft.build()+"; \n";
			//s += "\\draw[opacity=1,fill=black]" +  bottomRight.coordinate()+" arc[start angle=0, end angle=90, radius=" + radius +"]; \n";
			s += "\\draw[path picture={\\draw[fill=white] (path picture bounding box.south east) circle ("+radius+");}] (A) rectangle (C);\n";
		}
		if (this.rotation==2){
			//s = "\\draw[opacity=1,fill=black]" +  bottomRight.build() + dash + bottomLeft.build()+ dash + topLeft.build() +"; \n";
			//s += "\\draw[opacity=1,fill=black]" +  bottomLeft.coordinate()+" arc[start angle=0, end angle=90, radius=" + radius +"]; \n";
			s += "\\draw[path picture={\\draw[fill=white] (path picture bounding box.south west) circle ("+radius+");}] (A) rectangle (C);\n";
		}
		if (this.rotation==3){
			//s = "\\draw[opacity=1,fill=black]" +  bottomLeft.build()+ dash + topLeft.build() + dash + topRight.build() +"; \n";
			//s += "\\draw[opacity=1,fill=black]" +  topLeft.coordinate()+" arc[start angle=0, end angle=90, radius=" + radius +"]; \n";
			s += "\\draw[path picture={\\draw[fill=white] (path picture bounding box.north west) circle ("+radius+");}] (A) rectangle (C);\n";
		}
		return s;

	}

}


class TikZRightDiagonal{

constructor(topLeft, rotation=0, size=1,color="black"){
		this.color = color;
		this.size= size;
		this.topLeft = topLeft;
		this.rotation = rotation;
		}
	
	build(){
		let dash = "--";
		let topLeft = this.topLeft;
		let topRight = new TikZPoint(topLeft.x + this.size, topLeft.y);
		let bottomLeft = new TikZPoint(topLeft.x, topLeft.y - this.size);
		let bottomRight = new TikZPoint(topLeft.x + this.size, topLeft.y - this.size);
		let s = "";
		if (this.rotation==0){
			s = "\\draw [ultra thick] " +  topLeft.build() + dash + bottomRight.build()+"; \n";
		}
		if (this.rotation==1){
			s = "\\draw [ultra thick] " +  topRight.build() + dash + bottomLeft.build()+"; \n";
		}
		if (this.rotation==2){
			s = "\\draw [ultra thick] " +  bottomRight.build() + dash + topLeft.build() +"; \n";
		}
		if (this.rotation==3){
			s = "\\draw [ultra thick] " +  bottomLeft.build() + dash + topRight.build() +"; \n";
		}
		return s;

	}

}

class TikZGrid {

	constructor(start, end, step="1", color="gray", thickness = "very thin"){
		this.color = color;
		this.thikness = thickness;
		this.start = start;;
		this.end = end;
		this.step = "" + step + "cm";
		}

		build(){
			let s = "\\draw [step=" + this.step + "," + this.color + ","  + this.thikness + "]" + this.start.build() + " grid " + this.end.build() + "; \n";
			return s;
		}
}

class TikZComponent {

	constructor(){
		this.body = "";
	}

	build(){
		return this.body;
	}
}

class TikZLine extends TikZComponent {

	constructor(s, e){
		super();
		this.start = s;
		this.end = e;
	}

	build(){
		let s = "\\draw [ultra thick] " + this.start.build() + " -- " + this.end.build() + "; \n"
		return s;
	}
}

class TikZPoint {
	constructor(x,y){
		this.x = x;
		this.y = y;
		this.label = null;
	}

	setLabel(l){
		this.label = l;
	}

	coordinateDef(){
		return "\\coordinate ("+this.label +") at " + this.build() +";";
	}

	coordinate(){
		return "(" + this.label + ")";
	}

	build(){
		return "(" + this.x + "," + this.y + ")";

	}

}

//for node export
try{
   module.exports = new TikZBuilder();
} catch(err){
    console.log("non-node execution context");
}