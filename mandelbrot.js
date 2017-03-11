function map(x, in_min, in_max, out_min, out_max)
{
	return (out_max - out_min) / (in_max - in_min) * (x - in_min) + out_min;
}

function mandelbrot(canvas, xmin, xmax, ymin, ymax, iterations)
{
	var palette = []
	for (var i = 0; i <= iterations; i++)
	{
		palette.push([map(i, 0, iterations, 0, 10), map(i, 0, iterations, 75, 255), map(i, 0, iterations, 0, 70)])
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
			
			while (x*x + y*y < 4  &&  iteration <= iterations)
			{
				xtemp = x*x - y*y + x0;
				y = 2*x*y + y0;
				x = xtemp;
				iteration++;
			}
			if (iteration == iterations)
			{
				pix[pix_pos] = 0;
				pix[pix_pos + 1] = 0;
				pix[pix_pos + 2] = 0;
			}
			else
			{
				color = palette[Math.floor(iteration)];
				pix[pix_pos] = color[0];
				pix[pix_pos + 1] = color[1];
				pix[pix_pos + 2] = color[2];
			}
			pix[pix_pos + 3] = 255;
		}
		
	}
	ctx.putImageData(img, 0, 0);
}
 
var canvas = document.getElementById('MandelbrotCanvas');
document.body.insertBefore(canvas, document.body.childNodes[0]);

var zoomlevel = 1;
var centerx = 0;
var centery = 0;

canvas.addEventListener('dblclick', function(event) {zoomlevel = 1; mandelbrot(canvas, -2, 1, -1, 1, 50);}, false);
canvas.addEventListener('wheel', function(event)
{
	zoomlevel /= (100 - (event.deltaY) / 25) / 100;
	centerx += map(event.pageX, 0, canvas.width, -1.6 * zoomlevel / 10, 1.6 * zoomlevel / 10);
	centery += map(event.pageY, 0, canvas.height, -zoomlevel / 10, zoomlevel/ 10);
	mandelbrot(canvas, -2 * zoomlevel + centerx, zoomlevel + centerx, -zoomlevel + centery, zoomlevel + centery, 50 / zoomlevel);
}, false);
 
mandelbrot(canvas, -2, 1, -1, 1, 50);