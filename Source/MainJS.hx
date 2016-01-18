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

package;

import js.Browser;
import haxe.Timer;
import lime.app.Application;
import lime.app.Config;
import lime.graphics.RenderContext;
import lime.ui.Touch;
import lime.ui.Window;
import lime.graphics.Renderer;

import de.peote.view.PeoteView;

@:keep
@:expose("DType") class DType {
	public static inline var SIMPLE:Int = 0;
	public static inline var ANIM:Int = 1;
	//public static inline var TREE:Int = 2;
	
	public static inline var ZINDEX:Int = 4;
	public static inline var RGBA:Int = 8;
	public static inline var ROTATION:Int = 16;
	public static inline var SCALE:Int = 32;
	public static inline var TILE:Int = 64;
	
	public static inline var PICKING:Int = 128;
}

@:keep
@:expose("PeoteView") class MainJS extends Application {
	
	private static var startTime:Float;
    private var width: Int;
    private var height: Int;
    private var mouse_x: Int = 0;
    private var mouse_y: Int = 0;
    private var xOffset: Int = 0;
    private var yOffset: Int = 0;
    private var zoom: Int = 1;

	public static var peoteView:PeoteView;
	public static var max_displaylists:Int;
	public static var max_programs:Int;
	
	// js callbacks
	public static function getTime():Float { return(Math.floor((Timer.stamp() - startTime)*100)/100); }
	public static function init(max_displaylists:Int = 10, max_programs:Int = 100):PeoteView { 
		peoteView = new PeoteView(max_displaylists, max_programs);
		return(peoteView);
	}
	
	// -------------------------------------------------------
	public function new () {
		super ();
	}
	
	public override function onWindowCreate (window:Window):Void
	{
		switch (window.renderer.context) {
			case OPENGL (gl):
				
				width = window.width;
				height = window.height;
				
				//peoteView = new PeoteView(max_displaylists, max_programs);
				startTime = Timer.stamp();
				
				//untyped __js__("init(Peote.peoteView);");
				untyped __js__("onLimeEmbed();");
				
			default:
				trace("only opengl supported");
		}
	}
	
	// ----------- Render Loop ------------------------------------
	public override function render(renderer:Renderer):Void
	{
		peoteView.render(Math.floor((Timer.stamp() - startTime) * 100) / 100, width, height, mouse_x, mouse_y, zoom, xOffset, yOffset);
	}
	
	// ------------------------------------------------------------
	// ----------- EVENT HANDLER ----------------------------------
	public override function onWindowResize (window:Window, width:Int, height:Int):Void
	{
		trace("onWindowResize:"+ window.width+','+ window.height);
		this.width = window.width;
		this.height = window.height;
	}
	public override function onMouseMove (window:Window, x:Float, y:Float):Void
	{
		//trace("onMouseMove: " + x + "," + y );
		mouse_x = Std.int(x);
		mouse_y = Std.int(y);
		setOffsets();
	}
	public override function onTouchMove (touch:Touch):Void
	{
		trace("onTouchMove: " + touch.x + "," + touch.y );
		mouse_x = Std.int(touch.x); //* window.width;
		mouse_y = Std.int(touch.y);
		setOffsets();
	}
	public override function onMouseDown (window:Window, x:Float, y:Float, button:Int):Void
	{	
		trace("onMouseDown: x=" + x + " y="+ y);
		if ( button == 0) zoom++;
		else if (button == 1 && zoom > 1) zoom--;
		setOffsets();
	}
	public override function onMouseUp (window:Window, x:Float, y:Float, button:Int):Void
	{	
		trace("onmouseup: "+button+" x=" + x + " y="+ y);
	}
	public override function onMouseWheel (window:Window, deltaX:Float, deltaY:Float):Void
	{	
		trace("onmousewheel: " + deltaX + ',' + deltaY );
		if ( deltaY>0 ) zoom++;
		else if (zoom > 1) zoom--;
		setOffsets();
	}

	// end Event Handler ------------------------------
	// ------------------------------------------------------------
	
	public inline function setOffsets():Void {
		xOffset = Std.int( - width*(zoom-1)/zoom * mouse_x/width);
		yOffset = Std.int( - height*(zoom-1)/zoom * mouse_y/height);

	}
	
	
}