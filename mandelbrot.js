function mandelbrot(canvas, xmin, xmax, ymin, ymax, iterations)
{
	var palette = []
	for (var i = 0; i <= iterations; i++)
	{
		palette.push([map(i, 0, iterations, 10, 255), map(i, 0, iterations, 10, 255), map(i, 0, iterations, 100, 255)])
	}
	palette.push([0, 0, 0]);
	
	var width = canvas.width;
	var height = canvas.height;
	
	var ctx = canvas.getContext('2d');
	var img = ctx.getImageData(0, 0, width, height);
	var pix = img.data;
 
	for (var ix = 0; ix < width; ++ix) {
		for (var iy = 0; iy < height; ++iy) {
			var x0 = xmin + (xmax - xmin) * ix / (width - 1);
			var y0 = ymin + (ymax - ymin) * iy / (height - 1);
			var x = 0.0;
			var y = 0.0;
			var iteration = 0;
			var max_iteration = 1000;
			
			var pix_pos = 4 * (width * iy + ix);
			
			while (x*x + y*y < 16  &&  iteration <= iterations)
			{
				xtemp = x*x - y*y + x0;
				y = 2*x*y + y0;
				x = xtemp;
				iteration++;
			}
			if (iteration >= iterations)
			{
				pix[pix_pos] = 0;
				pix[pix_pos + 1] = 0;
				pix[pix_pos + 2] = 0;
			}
			else
			{
				for (var i = 0; i < 3; i++)
				{
					xtemp = x*x - y*y + x0;
					y = 2*x*y + y0;
					x = xtemp;
					iteration++;
				}
				var mu = iteration + 1 - Math.log(Math.log(Math.sqrt(x * x + y * y))) / Math.log(2);
				var color1 = Math.floor(mu) % palette.length;
				var color2 = (color1 + 1) % palette.length;
				var frac = mu % 1;
				if (color1 < 0 || color1 > palette.length) {console.log(mu);}
				if (color2 < 0 || color2 > palette.length) {console.log(mu);}
				var red1 = palette[color1][0];
				var red2 = palette[color2][0];
				var grn1 = palette[color1][1];
				var grn2 = palette[color2][1];
				var blu1 = palette[color1][2];
				var blu2 = palette[color2][2];
				var red = map(frac, 0, 1, red1, red2);
				var green = map(frac, 0, 1, grn1, grn2);
				var blue = map(frac, 0, 1, blu1, blu2);
				pix[pix_pos] = red;
				pix[pix_pos + 1] = green;
				pix[pix_pos + 2] = blue;
			}
			pix[pix_pos + 3] = 255;
		}
		
	}
	ctx.putImageData(img, 0, 0);
	document.getElementById("statusBar").innerHTML = "Center(" + centerx + ", " + -centery + ")";
}

function map(x, in_min, in_max, out_min, out_max)
{
	return (out_max - out_min) / (in_max - in_min) * (x - in_min) + out_min;
}

function gohome()
{
	zoomlevel = 1;
	itr = 20;
	centerx = -1;
	centery = 0;
	mandelbrot(canvas, -3 * zoomlevel + centerx, 3 * zoomlevel + centerx, -2 * zoomlevel + centery, 2 * zoomlevel + centery, itr);
}

function zoom()
{
	zoomlevel *= 0.99;
	itr = 20 / (Math.pow(zoomlevel, 0.2));
	mandelbrot(canvas, -3 * zoomlevel + centerx, 3 * zoomlevel + centerx, -2 * zoomlevel + centery, 2 * zoomlevel + centery, itr);
}
 
var canvas = document.getElementById('MandelbrotCanvas');
document.body.insertBefore(canvas, document.body.childNodes[0]);
var zoomlevel = 1;
var itr = 20;
var centerx = -1;
var centery = 0;
var centerchangeable = true;
var zooming = false;
var timer;
gohome();

canvas.addEventListener('dblclick', function(event) {gohome();}, false);

canvas.addEventListener('wheel', function(event)
{
	zoomlevel /= (100 - (event.deltaY) / 25) / 100;
	var x = event.pageX - canvas.width / 2;
	var y = event.pageY - canvas.height / 2;
	x *= x * x * zoomlevel / 10;
	y *= y * y * zoomlevel / 10;
	if (centerchangeable)
	{
		var dx = map(x, ((-canvas.width / 2) ** 3) * 0.05, ((canvas.width / 2) ** 3) * 0.05, -0.075, 0.075);
		var dy = map(y, ((-canvas.height / 2) ** 3) * 0.05, ((canvas.height / 2) ** 3) * 0.05, -0.05, 0.05);
		centerx += event.deltaY < 0 ? dx : -dx;
		centery += event.deltaY < 0 ? dy : -dy;
	}
	mandelbrot(canvas, -3 * zoomlevel + centerx, 3 * zoomlevel + centerx, -2 * zoomlevel + centery, 2 * zoomlevel + centery, itr);
}, false);

document.addEventListener('keydown', function(event) {
	if (event.key == 'r')
	{
		itr = 20 / (Math.pow(zoomlevel, 0.2));
		mandelbrot(canvas, -3 * zoomlevel + centerx, 3 * zoomlevel + centerx, -2 * zoomlevel + centery, 2 * zoomlevel + centery, itr);
	}
	if (event.key == 'l')
	{
		centerchangeable = !centerchangeable;
	}
	if (event.key == 'z')
	{
		if (zooming)
		{
			window.clearInterval(timer);
			zooming = false;
		}
		else
		{
			timer = window.setInterval(zoom, 10);
			zooming = true;
		}
	}
}, false);