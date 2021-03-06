/*

Copyright (C) 2017 Nathan Nichols

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE X CONSORTIUM BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Except as contained in this notice, the name of the X Consortium shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization from the X Consortium.



*/

function wildcard_match(str, rule) {
  return new RegExp("^" + rule.split("*").join(".*") + "$").test(str);
}

var page = window.location.href;
/*
if( wildcard_match(document.getElementsByTagName("pre")[0].innerHTML,'{"follow_up_url":"*"}') ){
	console.log(JSON.parse(document.getElementsByTagName("pre")[0].innerHTML)["follow_up_url"]);
}
*/

var style = "div {	top: 5%; margin-left: 10%; margin-right: 10%; background-color: white;}"
var sheet = document.createElement('style');
sheet.innerHTML = style;
document.body.appendChild(sheet);
if( wildcard_match(page,"*://*actions.sumofus.org/api/pages/*/actions") ){
	//console.log("Redirecting...");
	var link = document.body.innerText;
	link = JSON.parse(link);
	//console.log(link);	
	document.body.innerHTML = "<h1>You have submitted this petition.</h1>";
}

if( wildcard_match(page,"*://*actions.sumofus.org/a/*") ){
	console.log("hello");
	// because I noticed there were two of these for some reason	
	document.getElementsByTagName("button")[1].remove();
	document.getElementsByTagName("span")[0].innerHTML = "";
	var divs = 	document.getElementsByTagName("div");

	document.getElementsByClassName("noscript-notice")[0].remove();

	// If they change the HTML of the page this might break...
	document.getElementsByClassName("petition-bar__content")[0].children[1].children[1].innerHTML = "";

	for ( i=0; i<document.styleSheets.length; i++) {
		void(document.styleSheets.item(i).disabled=true);
	}
	// apply some basic CSS to make it a bit prettier
	var style = "div {margin: 50px; text-align: left; color: black; font-size: 12pt;}";
	var sheet = document.createElement('style');
	sheet.innerHTML = style;
	document.body.appendChild(sheet);
} else{
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if(this["readyState"] == 4 && this["status"] == 200){
			var campaigns = JSON.parse(this.responseText);
			//console.log(campaigns);
			var s = "";
			var number = "";
			//html_template += '<button onclick="">Show Pictures</button><br>';
			for(var i = 0; i < campaigns.length; i += 1){
				number = (i+1)+"/"+campaigns.length+":";
				s = campaigns[i]["title"]+"<br>";
				html_template += number.link(campaigns[i]["url"])+s;
				html_template += "<img src="+'"'+campaigns[i]["image"]+'"'+"><br>";
			}
			document.body.innerHTML = html_template;	
		}
	};

	var html_template = "<h1>[Simple SumOfUs.org]</h1>";
	// URL to get campaigns
	var url = "http://actions.sumofus.org/api/pages/featured.json?language=en";

	document.head.replaceWith("");
	document.body.innerHTML = "";
	xhr.open("GET", url);
	xhr.send();
}
