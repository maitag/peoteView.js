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

function onLimeEmbed()
{	
	var peoteView = PeoteView.init({
			maxDisplaylists: 2,
			maxPrograms:     2,
			maxImages:       2
		});
	
	var w = 560;
	var h = 360;
	var s = 4;
	var last_y = h-1;
	var switchBGanim = 1;
	var speed = 1;
	
	
	peoteView.setTexture({ texture:0, w:1024, h:512, iw:512, ih:512 });

	// set images
	peoteView.setImage({ image:0, texture:0, filename:"assets/peote_font_green.png" });
	peoteView.setImage({ image:1, texture:0, filename:"assets/peote_tiles.png" });

	// set shaders
	peoteView.setProgram( {
		program: 0,
		fshader: 'assets/lyapunov_01.frag'
	});
		
	peoteView.setProgram({
		program: 1,
		texture: 0,
	});

	// set Time
	var t = PeoteView.getTime();
		
	// new Displaylist
	peoteView.setDisplaylist({
		displaylist:0,
		type:DisplaylistType.ANIM,
		
		enable:true,
		maxElements:1,
		w:1920, h:1280,
		z:0
	});
	peoteView.setDisplaylist({
		displaylist:1,
		type:DisplaylistType.ANIM,
		
		enable:true,
		maxElements:w*h,
		w:1920, h:1280,
		z:1
	});
		
	// fractal BG
	peoteView.setElement({
		displaylist:0,
		element:0,
		time:t,
		x:0, y:0, w:3000, h:3000,
		z: -2,
		program:0, tw:1000, th:1000,
		end: {
			x: -1500, y: -1500, w:11000, h:11000,
			time:t+h/speed
		}
	});

	
	var i;
	// tiles
	for (var x=0; x<w; x++) {
		for (var y=0; y<h; y++) {
			i=randomInt(2);
			
			peoteView.setElement({
				displaylist:1,
				element: y*w+x,
				start: {
					x: x*s, y: y*s-s,
					w:s, h:s,
					time:t
				},
				end: {
					x: x*s, y: y*s-s+h*s,
					w:s, h:s,
					time:t + h/speed
				},
				z: -1,
				program:1,
				image:i,
				tile: ((i==0) ? randomInt(256) : randomInt(64))
			});
		}
	}
	
	// Timer every second
	window.setInterval(function() {
		t = PeoteView.getTime();
		for (var x=0; x<w; x++)	{
		
			peoteView.setElement({
				displaylist:1,
				element: last_y*w+x,
				start: {
					y: -s,
					time:t
				},
				end: {
					y: -s+h*s,
					time: t+h/speed
				}
			});
		}
		
		if (last_y == 0)
		{
			last_y = h-1;
			// anim BG
			if (switchBGanim == 1) {
			
				peoteView.setElement({
					displaylist:0,
					element:0,
					end: {
						x:0, y:0, w:3000, h:3000,
						time:t+h/speed
					},
					tw:1000, th:1000
				});
			}
			else {
				peoteView.setElement({
					displaylist:0,
					element:0,
					end: {
						x: -1500, y: -1500, w:11000, h:11000,
						time:t+h/speed
					},
					tw:1000, th:1000
				});
			}
			switchBGanim = -switchBGanim;
		}
		else last_y--;
	}, 1000);
	
}

function randomInt(a) {
	return Math.floor(Math.random()*a);
}