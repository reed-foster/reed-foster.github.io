function map(x, x0, y0, x1, y1)
{
	//f(x) = (y1 - y0)/(x1 - x0) * (x - x0) + y0
	return (y1 - y0) / (x1 - x0) * (x - x0) + y0;
}

function mandelbrot(canvas, xmin, xmax, ymin, ymax, iterations)
{
	var palette = []
	for (var i = 0; i <= iterations; i++)
	{
		palette.push([i / iterations * 255, 0, map(i, 0, 0.5, iterations, 0)])
	}
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
			
			var pix_pos = 4 * (width * y0 + x0);
			
			while ( x*x + y*y < (1 << 8)  &&  iteration < iterations)
			{
				xtemp = x*x - y*y + x0;
				y = 2*x*y + y0;
				x = xtemp;
				iteration++;
			}		
			// Used to avoid floating point issues with points inside the set.
			if (iteration < iterations) {
				// sqrt of inner term removed using log simplification rules.
				var log_zn = Math.log( x*x + y*y ) / 2;
				var nu = Math.log(log_zn / Math.log(2)) / Math.log(2);
				// Rearranging the potential function.
				// Dividing log_zn by log(2) instead of log(N = 1<<8)
				// because we want the entire palette to range from the
				// center to radius 2, NOT our bailout radius.
				iteration = iteration + 1 - nu;
			}
			//color1 = palette[floor(iteration)]
			//color2 = palette[floor(iteration) + 1]
			//color = linear_interpolate(color1, color2, iteration % 1)
			//plot(Px, Py, color)
			color = palette[floor(iteration)];
			pix[pix_pos] = color[0];
			pix[pix_pos + 1] = color[1];
			pix[pix_pos + 2] = color[2];
			
		}
	}
	/*
      var x = xmin + (xmax - xmin) * ix / (width - 1);
      var y = ymin + (ymax - ymin) * iy / (height - 1);
      var i = mandelIter(x, y, iterations);
      var ppos = 4 * (width * iy + ix);
 
      if (i > iterations) {
        pix[ppos] = 0;
        pix[ppos + 1] = 0;
        pix[ppos + 2] = 0;
      } else {
        var c = 3 * Math.log(i) / Math.log(iterations - 1.0);
 
        if (c < 1) {
          pix[ppos] = 255 * c;
          pix[ppos + 1] = 0;
          pix[ppos + 2] = 0;
        }
        else if ( c < 2 ) {
          pix[ppos] = 255;
          pix[ppos + 1] = 255 * (c - 1);
          pix[ppos + 2] = 0;
        } else {
          pix[ppos] = 255;
          pix[ppos + 1] = 255;
          pix[ppos + 2] = 255 * (c - 2);
        }
      }
      pix[ppos + 3] = 255;
    }*/
 
  ctx.putImageData(img, 0, 0);
}
 
var canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 500;
 
document.body.insertBefore(canvas, document.body.childNodes[0]);
 
mandelbrot(canvas, -2, 1, -1, 1, 1000);
