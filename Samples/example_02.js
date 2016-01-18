/*
 *        o-o    o-o  o-o-o  o-o    
 *       o   o  o    _   o      o   
 *      o-o-o  o-o  (o)   o    o-o  
 *     o      o     (_\~   o      o 
 *    o      o-o     |\     o    o-o
 * 
 * PEOTE VIEW - haxe 2D OpenGL Render Library
 * Copyright (c) 2014 Sylvio Sell, http://maitag.de
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var t;
var nr = 0;
var peoteView;

function onLimeEmbed()
{	
	peoteView = PeoteView.init(1, 2); // max_displaylists, max_programs
	
	// set shaders
	peoteView.setProgram(0, "assets/lyapunov_02.frag");
	peoteView.setProgram(1); // default image program
	
	// set images
	//peoteView.setImage(0, "assets/peote_font_green.png", 512, 512);
	peoteView.setImage(1, "assets/peote_font_white.png", 512, 512);
	peoteView.setImage(2, "assets/peote_tiles.png", 512, 512);
	
	// new Displaylist
	peoteView.setDisplaylist( { displaylist:0, type:DType.ANIM|DType.RGBA,
		enable:true,
		elements:100000, max_programs:2, segments:1000,
		w:1920, h:1280,
		z:0
	});
	
	
	loadImageData('assets/peote_font_green.png', onLoadAsciiFont);	
}

function onLoadAsciiFont(img)
{
	var peoteTimer1 = new PeoteTimer();
	var bg_nr = nr++;
	peoteView.setElement({ element:bg_nr,
			time:t,
			x:0, y:0, w:4000, h:4000,
			z: -2,
			program:0, tw:1000, th:1000,
	});
	
	peoteTimer1
	.add(function(d){ peoteView.setElement( { element:bg_nr, end:{ x:-1000, w:8000, h:8000, time:PeoteView.getTime()+d }, tw:1000, th:1000});
					},	50.0 , 0.0 )
	.add(function(d){ peoteView.setElement( { element:bg_nr, end:{ x:0, w:4000, h:4000, time:PeoteView.getTime()+d }, tw:1000, th:1000});
					},	50.0 , 0.0 )
	.add(function(d){ if (nr>10000) nr = bg_nr+1 },	50.0 , 0.0 )
	.repeat();

	var peoteTimer2 = new PeoteTimer();
	peoteTimer2
	.add(function(d){ animElements(drawLetter(3, img, 1,2,  650, -50, 12, 12, 1), d); },	2.0 , 7.0 )
	.repeat();

	var peoteTimer = new PeoteTimer();
	peoteTimer
	.add(function(d){ animElements(drawLetter("H", img, 1,1,  5,0 ,8,8, 2), d); },	4.0 , 1.0 )
	.add(function(d){ animElements(drawLetter("e", img, 1,1, 140,0 ,8,8, 2), d); },	3.0, -3.0 )
	.add(
		 function(d){ animElements(drawLetter("l", img, 1,1, 260,0 ,8,8, 2), d); }, 	3.0, -2.5
		,function(d){ animElements(drawLetter("l", img, 1,1, 350,0 ,8,8, 2), d); }, 	3.0, -2.0
	)
	.add(function(d){ animElements(drawLetter("o", img, 1,1, 490,20 ,8,8, 2), d); }, 	4.0, -2.5 )
	.add(function(d){
						var peoteTimer1 = new PeoteTimer();
						peoteTimer1
						.add(function(d){ animElements(drawLetter("W", img, 1,1, 50, 220 ,8,8, 2), d); }, 	1.0, 1 )
						.add(function(d){ animElements(drawLetter("o", img, 1,1, 200, 220 ,8,8, 2), d); }, 	1.0, 0.1 )
						.add(function(d){ animElements(drawLetter("r", img, 1,1, 330, 220 ,8,8, 2), d); }, 	1.0, 0.2 )
						.add(function(d){ animElements(drawLetter("d", img, 1,1, 460, 220 ,8,8, 2), d); }, 	1.0, 0.3 )
						.repeat(2);
					}, 	7.0, -5 )
	.add(function(d){ animElements(drawLetter("!", img, 1,1, 610,200 ,8,8, 2), d); }, 	3.0, -2 )
	.repeat();

}


function animElements(elems, duration)
{
	var peoteTimer = new PeoteTimer();
	peoteTimer.add(function(d){
		for (var n=0; n < elems.length; n++)
		{	
			peoteView.setElement( { element:elems[n],
				time:PeoteView.getTime(),
				end:{
					x:Math.random()*2000, y:Math.random()*1600,
					w:10, h:10,
					rgba:randomInt(256) << 24 | randomInt(256) << 16 | randomInt(256) << 8,
					time:PeoteView.getTime() + duration*5
				}
			});
		}
	}, 0.0, 2.1 );
	peoteTimer.add(function(d){ deleteElements(elems); }, 0.0, duration*5 ).start();
	return elems;
}

function deleteElements(elems)
{
	for (var n=0; n < elems.length; n++) peoteView.delElement({element:elems[n]});
}


function drawLetter(_letter, img, shader_nr, image_nr, x, y, w, h, type)
{
	//console.log("drawLetter",letter_string, img);
	shader_nr = shader_nr || 0;
	image_nr = image_nr || 0;
	x = x||0; y=y||0; w=w||4; h=h||4;
	type = type || 0;
	
	var letter = combineAsciiLetter(_letter, img);
	
	var elems = new Array();
	
	for (i = 0; i < letter.length; i++) {
		//console.log(letter[i]);
		var _x = letter[i][0];
		var _y = letter[i][1];
		var rgba = letter[i][2];
		//var tile_nr = 255 - Math.round( (rgba[0] + rgba[1] + rgba[2])/3 );
		var tile_nr = Math.floor( Math.random()*32 );

		elems.push(nr);
		if (type == 1)
			peoteView.setElement( { element:nr++,
				x:x+_x*w, y:y+_y*h, z:0,
				w:w, h:h,
				program:shader_nr, image:image_nr, tile:tile_nr,
				//time:PeoteView.getTime()
			});
		else if (type == 2)
			peoteView.setElement( { element:nr++,
				x:x+_x*w, y:y+_y*h, z:0,
				w:w, h:h,
				rgba:230+randomInt(20) << 24 | 220+randomInt(36) << 16 | randomInt(35) << 8 | 255,
				program:shader_nr, image:image_nr, tile:(typeof(_letter) == "string") ? _letter.charCodeAt(0) : _letter,
				//time:PeoteView.getTime()
			});
		else 
			peoteView.setElement( { element:nr++,
				x:x+_x*w, y:y+_y*h, z:0,
				w:w, h:h,
				program:shader_nr, image:image_nr,
				//time:PeoteView.getTime()
			});
		
	}
	return elems;
}

function combineAsciiLetter(_letter, img)
{
	var letter_nr = (typeof(_letter) == "string") ? _letter.charCodeAt(0) : _letter;
	var letter_x = letter_nr % 16;
	var letter_y = Math.floor(letter_nr / 16);
	
	var letter = new Array();

	for (var y=0; y < img.height/16; y++)
	{
		for (var x=0; x < img.width/16; x++)
		{
			var rgba = getPixel(img, x+letter_x*img.width/16, y+letter_y*img.height/16);
			var alpha = rgba[3];
			//if (alpha > 0) letter.push(new Array(x,y,rgba));
			if (alpha > 30) letter.push(new Array(x,y,rgba));
		}
	}
	return letter;
}

function getPixel(img, x, y)
{
	var px = y*4*img.width + 4*x
	var r = img.data[px  ];
	var g = img.data[px+1];
	var b = img.data[px+2];
	var a = img.data[px+3];
	return [r,g,b,a];
}

function loadImageData(url, onload_callback)
{
	var image = new Image;
	image.onload = function() {
	
		var tmp_canvas = document.createElement('canvas');
		var w = image.width;
		var h = image.height;
		
		tmp_canvas.width = w; 
		tmp_canvas.height = h;
		var ctx = tmp_canvas.getContext('2d');

		ctx.drawImage( image, 0, 0 , image.width, image.height);
		var imgdata = ctx.getImageData(0,0,w,h);
		onload_callback({data:imgdata.data, width:w, height:h});
	};
	image.src = url;
}
			
function randomInt(a) {
	return Math.floor(Math.random()*a);
}			
			