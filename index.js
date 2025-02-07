#!/usr/bin/env node


const fs = require('fs');
let truchetModule = require('./js/tikZTruchet.js');
let doc = require('./js/latex-builders.js');
let tikz = require('./js/tikZBldr.js');

/**
 * 
 *  Utility functions
 * 
 * 
 */


function getTimestamp () {
  const pad = (n,s=2) => (`${new Array(s).fill(0)}${n}`).slice(-s);
  const d = new Date();
  
  return `${pad(d.getFullYear(),4)}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function allSequences(max){
	let list = [];
	for (let d1=0;d1<max; d1++){
		for (let d2=0;d2<max; d2++){
			for (let d3=0;d3<max; d3++){
				for (let d4=0;d4<max; d4++){
					let pattern = "" + d1+d2+d3+d4;
					list.push(pattern);
				}
			}
		}
	}
	return list;
}


function completeSelfDualSequence(original){
	let newsequence = original.slice();
	let sequence = Array.from(original);
	for (let i=0; i<sequence.length;i++){
		newsequence += "" + (Number(sequence[sequence.length-1-i])+2)%4;
	} 
	return newsequence;

}


function truchetFromFour(sequence, theTruchet){
	let sarray = Array.from(sequence)
	theTruchet.tiles.tiles[0][0] = parseInt(sarray[0]);
	theTruchet.tiles.applyRules(0,0);
	theTruchet.tiles.tiles[0][1] = parseInt(sarray[1]);
	theTruchet.tiles.applyRules(0,1);
	theTruchet.tiles.tiles[1][0] = parseInt(sarray[2]);
	theTruchet.tiles.applyRules(1,0);
	theTruchet.tiles.tiles[1][1] = parseInt(sarray[3]);
	theTruchet.tiles.applyRules(1,1);
}

function truchetFromSixteen(sequence, theTruchet){
	let sarray = Array.from(sequence)
	theTruchet.tiles.tiles[0][0] = parseInt(sarray[0]);
	theTruchet.tiles.applyRules(0,0);
	theTruchet.tiles.tiles[0][1] = parseInt(sarray[1]);
	theTruchet.tiles.applyRules(0,1);
	theTruchet.tiles.tiles[0][2] = parseInt(sarray[2]);
	theTruchet.tiles.applyRules(0,2);
	theTruchet.tiles.tiles[0][3] = parseInt(sarray[3]);
	theTruchet.tiles.applyRules(0,3);

	theTruchet.tiles.tiles[1][0] = parseInt(sarray[4]);
	theTruchet.tiles.applyRules(1,0);
	theTruchet.tiles.tiles[1][1] = parseInt(sarray[5]);
	theTruchet.tiles.applyRules(1,1);
	theTruchet.tiles.tiles[1][2] = parseInt(sarray[6]);
	theTruchet.tiles.applyRules(1,2);
	theTruchet.tiles.tiles[1][3] = parseInt(sarray[7]);
	theTruchet.tiles.applyRules(1,3);

	theTruchet.tiles.tiles[2][0] = parseInt(sarray[8]);
	theTruchet.tiles.applyRules(2,0);
	theTruchet.tiles.tiles[2][1] = parseInt(sarray[9]);
	theTruchet.tiles.applyRules(2,1);
	theTruchet.tiles.tiles[2][2] = parseInt(sarray[10]);
	theTruchet.tiles.applyRules(2,2);
	theTruchet.tiles.tiles[2][3] = parseInt(sarray[11]);
	theTruchet.tiles.applyRules(2,3);

	theTruchet.tiles.tiles[3][0] = parseInt(sarray[12]);
	theTruchet.tiles.applyRules(3,0);
	theTruchet.tiles.tiles[3][1] = parseInt(sarray[13]);
	theTruchet.tiles.applyRules(3,1);
	theTruchet.tiles.tiles[3][2] = parseInt(sarray[14]);
	theTruchet.tiles.applyRules(3,2);
	theTruchet.tiles.tiles[3][3] = parseInt(sarray[15]);
	theTruchet.tiles.applyRules(3,3);
}




function parentFromSequence(sequence){
	let parent = "";
	let length = sequence.length;
	sequence = Array.from(sequence);
	for (let i=0; i<length;i++){
		parent = "" + ((Number(sequence.pop()))%2 + parent);
	} 
	return parent;
}


function rotaDualFromSequence(sequence){
	let dual = [];
	let length = sequence.length;
	sequence = Array.from(sequence);
	for (let i=0; i<length;i++){
		dual += "" + (Number(sequence[i])+1)%4;
	} 
	return dual;
}

function parentRotaDual(sequence){
	let pd = parentFromSequence(sequence);
	let dual = [];
	let length = pd.length;
	//sequence = Array.from(pd);
	for (let i=0; i<length;i++){
		dual += "" + (Number(pd[i])+1)%2;
	} 
	return dual;
}

function friezeDualFromSequence(sequence){
	let dual = [];
	let length = sequence.length;
	sequence = Array.from(sequence);
	for (let i=0; i<length;i++){
		dual += "" + (Number(sequence[length-i-1])+2)%4;
	} 
	return dual;
}

function shuffle(sequence){
	let seqArray =  Array.from(sequence);
	let shuffled = [0,0,0,0];
	shuffled[0] = seqArray[2];
	shuffled[1] = seqArray[0];
	shuffled[2] = seqArray[3];
	shuffled[3] = seqArray[1];
	let result = "";
	for (let i=0; i< seqArray.length;i++){
		result += "" + shuffled[i];
	} 
	return result;
}

function increment(sequence){

	let seqArray =  Array.from(sequence);
	let next = [0,0,0,0];
	let result = "";
	
	for (let i=0; i<sequence.length;i++){
		next[i] = (Number(seqArray[i]) + 1)%4;
	} 
	for (let i=0; i<sequence.length;i++){
		result += "" + next[i]; 
	} 

	return result;
}

//object for main family pages
class FamTup {

	constructor(){
		this.family = "";
		this.tileGrid = "";
		this.labelGrid ="";

		this.rDFamily = "";
		this.rDTileGrid = "";
		this.rDLabelGrid = ""
		
	}

}
//object for related families
class FamRel{

	constructor(){
		this.family = "";
		this.familyDiagram = ""
		this.opp = "";
		this.oppDiagram = "";
		this.skewPositive = "";
		this.skewPositiveDiagram = "";
		this.dual = "";
		this.dualDiagram= "";
		this.skewNegative = "";
		this.skewNegativeDiagram = "";

	}

	table(){

		let contents = [
			"dual",
			"skew (-)",
			"skew (+)",
			"companion",	
			" ",
			this.dual,
			this.skewPositive, 
			this.skewNegative, 
			this.opp, 
			this.family,
			this.dualDiagram,
			this.skewNegativeDiagram, 
			this.skewPositiveDiagram, 
			this.oppDiagram, 
			this.familyDiagram,
			];
		let tab = new doc.LaTeXTabular(3,5,contents);
		return tab.build();
	}

	init(psequence) {
		this.family = psequence;
		this.opp = parentFromSequence((increment(psequence.slice()))); //one increment
		this.skewPositive = parentFromSequence(increment(shuffle(psequence.slice()))); //one inc and one shuffle
		this.dual = parentFromSequence(increment(increment(shuffle(shuffle(psequence.slice()))))); //2 incs 2 shuffles
		this.skewNegative = parentFromSequence(increment(increment(increment(shuffle(shuffle(shuffle(psequence.slice()))))))); //3 of each
	
		truchetModule.truchet.start(0.4,4);
		tikz.reset();
		truchetFrom(this.family,truchetModule.truchet);
		this.familyDiagram  = truchetModule.truchet.tiles.latexGrid(true).build();	

		truchetModule.truchet.start(0.25,4);
		tikz.reset();
		truchetFrom(this.opp,truchetModule.truchet);
		this.oppDiagram  = truchetModule.truchet.tiles.latexGrid(true).build();

		tikz.reset();
		truchetFrom(this.skewPositive,truchetModule.truchet);
		this.skewPositiveDiagram  = truchetModule.truchet.tiles.latexGrid(true).build();

		tikz.reset();
		truchetFrom(this.dual,truchetModule.truchet);
		this.dualDiagram  = truchetModule.truchet.tiles.latexGrid(true).build();	

		tikz.reset();
		truchetFrom(this.skewNegative,truchetModule.truchet);
		this.skewNegativeDiagram  = truchetModule.truchet.tiles.latexGrid(true).build();	
	}
}



/**
 * 
 *  INTRODUCTION 
 * 
 */

console.log("---------------------------");
console.log("Introduction: Truchet tiles");
console.log("---------------------------");


//set up folder for files
let folderName = 'generated_files';
console.log("building at " + getTimestamp ());
console.log("creating folder if needed");
try {
  		if (!fs.existsSync(folderName)) {
    	fs.mkdirSync(folderName);
  	}
	}	catch (err) {
  		console.error(err);
	}


let mainDoc = new doc.LaTeXDoc();
let mainFile = 'ch1_examples.tex';

truchetModule.truchet.start(0.5,8);


let sequences = ["01230012","12221121",
	"02021021","12221000",
	"02020101","13231331",
	"01230123","11111111",
	"00000000","22222222",
	"12121212","01010101",
	"31313131","02020202",
	"32313231","22022212",
	"00011122","11002233",
	"00023100","12020231",
	"11123100","32020331",
	"00023100","12323230",
	"00023100","11220230",
	"22231111","10011312",

];
for (let i=0; i<sequences.length; i++){

	let completed = completeSelfDualSequence(sequences[i]);
	tikz.reset();
	truchetFromSixteen(completed,truchetModule.truchet);
	let raw = truchetModule.truchet.tiles.latexGrid().build();

	let quad = [];
	quad.push(raw.slice());
	quad.push(raw.slice());
	quad.push(raw.slice());
	quad.push(raw.slice());

	let twoByTwo = new doc.LaTeXTabular(2,2,quad);

	let file = folderName+"/" + completed + ".gtex";

	fs.writeFile(file, raw, function(err) {
    	if(err) {
        	return console.log("There was an error" + err);
        	console.log("exiting");
			process.exit(1);
    	}
	});

	mainDoc.addContent(new doc.RawText("% file generated at " + getTimestamp() + "\n"))
		.section(completed)
		.addContent(new doc.RawText("\\marginnote[3\\baselineskip]{\\centering\\input{" + file + "}}\n"));


	file = folderName+"/" + completed + "-quad.gtex";

	fs.writeFile(file, twoByTwo.build(), function(err) {
    	if(err) {
        	return console.log("There was an error" + err);
        	console.log("exiting");
			process.exit(1);
    	}
	});

	mainDoc.input(file)
		.command(",")
		.command("newline")
		.command("vspace","1.2cm",true);
}
	
fs.writeFile(mainFile, mainDoc.build(), function(err) {
    	if(err) {
        	return console.log("There was an error" + err);
        	console.log("exiting");
			process.exit(1);
    	}
	});
