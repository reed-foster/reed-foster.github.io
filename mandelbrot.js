/*list of cool points:

-0.7349550997530568 + 0.19704996476661696i
-1.2483144568121969 + 0.056351259616207i
0.23674750381213505 + 0.5185951970728484i
*/

var VERSION_NUM = "1.1";

var mandelbrot_canvas = document.getElementById('MandelbrotCanvas');
var mandelbrot_center = {re : 0, im : 0};
var mandelbrot_zoom = 1;
var mandelbrot_itr = 80;
var mandelbrot_state = {locked : false, zooming : false};
var mandelbrottimer;

var julia_canvas = document.getElementById('JuliaCanvas');
var julia_center = {re : 0, im : 0};
var julia_zoom = 1;
var julia_itr = 80;
var julia_state = {locked : false, zooming : false};
var juliatimer;

document.getElementById('mandcenter_re').value = mandelbrot_center.re;
document.getElementById('mandcenter_im').value = mandelbrot_center.im;
document.getElementById('mandzoom').value = mandelbrot_zoom;
document.getElementById('julcenter_re').value = julia_center.re;
document.getElementById('julcenter_im').value = julia_center.im;
document.getElementById('julzoom').value = julia_zoom;
document.getElementById('ver').innerHTML = "Version " + VERSION_NUM;
gohome();

function mandelbrot(canvas, min, max, iterations, resolution)
{
   var palette = gencolors(iterations);
   var width = canvas.width;
   var height = canvas.height;
   var ctx = canvas.getContext('2d');
   var img = ctx.getImageData(0, 0, width, height);
   var pix = img.data;

   for (var ire = 0; ire < width / resolution; ire++)
   {
      for (var iim = 0; iim < height / resolution; iim++)
      {
         var z0 = {re : map(ire, 0, width / resolution, min.re, max.re), im : map(iim, 0, height / resolution, min.im, max.im)};
         var z = {re : 0.0, im : 0.0};
         var iteration = 0;

         var pix_pos = 4 * (resolution * width * iim + resolution * ire);

         while (z.re * z.re + z.im * z.im < 16 && iteration <= iterations)
         {
            z = iteratedfunc(z, z0);
            iteration++;
         }
         if (iteration >= iterations)
         {
            pix = drawpix(pix, pix_pos, resolution, width, 0, 0, 0);
         }
         else
         {
            for (var i = 0; i < 3; i++)
            {
               z = iteratedfunc(z, z0);
               iteration++;
            }
            var mu = iteration + 1 - Math.log(Math.log(Math.sqrt(z.re * z.re + z.im * z.im))) / Math.log(2);
            var color1 = Math.floor(mu) % palette.length;
            var color2 = (color1 + 1) % palette.length;
            var frac = mu % 1;
            pix = drawpix(pix, pix_pos, resolution, width, map(frac, 0, 1, palette[color1][0], palette[color2][0]), map(frac, 0, 1, palette[color1][1], palette[color2][1]), map(frac, 0, 1, palette[color1][2], palette[color2][2]));
         }
      }
   }
   ctx.putImageData(img, 0, 0);
}

function julia(canvas, min, max, c, iterations, resolution)
{
   var palette = gencolors(iterations);
   var width = canvas.width;
   var height = canvas.height;

   var ctx = canvas.getContext('2d');
   var img = ctx.getImageData(0, 0, width, height);
   var pix = img.data;

   for (var ire = 0; ire < width / resolution; ire++)
   {
      for (var iim = 0; iim < height / resolution; iim++)
      {
         var z = {re : map(ire, 0, width / resolution, min.re, max.re), im : map(iim, 0, height / resolution, min.im, max.im)};
         var iteration = 0;

         var pix_pos = 4 * (resolution * width * iim + resolution * ire);

         while (z.re * z.re + z.im * z.im < 2 && iteration <= iterations)
         {
            z = iteratedfunc(z, c);
            iteration++;
         }
         if (iteration >= iterations)
         {
            pix = drawpix(pix, pix_pos, resolution, width, 0, 0, 0);
         }
         else
         {
            for (var i = 0; i < 3; i++)
            {
               z = iteratedfunc(z, c);
               iteration++;
            }
            var mu = iteration + 1 - Math.log(Math.log(Math.sqrt(z.re * z.re + z.im * z.im))) / Math.log(2);
            var color1 = Math.floor(mu) % palette.length;
            var color2 = (color1 + 1) % palette.length;
            var frac = mu % 1;
            pix = drawpix(pix, pix_pos, resolution, width, map(frac, 0, 1, palette[color1][0], palette[color2][0]), map(frac, 0, 1, palette[color1][1], palette[color2][1]), map(frac, 0, 1, palette[color1][2], palette[color2][2]));
         }
      }
   }
   ctx.putImageData(img, 0, 0);
}

function iteratedfunc(z, c)
{
   return {re : z.re * z.re - z.im * z.im + c.re, im : 2 * z.re * z.im + c.im};
}

function drawpix(pixdat, pos, resolution, width, R, G, B)
{
   for (var i = 0; i < resolution; i++)
   {
      for (var j = 0; j < resolution; j++)
      {
         pixdat[pos + (i * width + j) * 4] = R;
         pixdat[pos + 1 + (i * width + j) * 4] = G;
         pixdat[pos + 2 + (i * width + j) * 4] = B;
         pixdat[pos + 3 + (i * width + j) * 4] = 255;
      }
   }
   return pixdat;
}

function gencolors(iterations)
{
   var iterations_4 = iterations / 4;
   var palette = [];
   var yellow = [250, 225, 50];
   var white = [255, 255, 255];
   var tan = [220, 160, 60];
   var blue = [10, 10, 120];
   for (var i = 0; i <= iterations; i++)
   {
      if (i < iterations_4) //from i = 0 to i = iterations / 8 - 1
      {
         //blue to tan
         palette.push(
         [map(i, 0, iterations_4, blue[0], tan[0]),
         map(i, 0, iterations_4, blue[1], tan[1]),
         map(i, 0, iterations_4, blue[2], tan[2])]);
      }
      else if (i < iterations_4 * 2.5) //from i = iterations / 4 to i = 5 * iterations / 8 - 1
      {
         //tan to yellow
         palette.push(
         [map(i, iterations_4, iterations_4 * 2.5, tan[0], yellow[0]),
         map(i, iterations_4, iterations_4 * 2.5, tan[1], yellow[1]),
         map(i, iterations_4, iterations_4 * 2.5, tan[2], yellow[2])]);
      }
      else //from i = iterations / 2 to i = iterations
      {
         //yellow to white
         palette.push(
         [map(i, iterations_4 * 2.5, iterations, yellow[0], white[0]),
         map(i, iterations_4 * 2.5, iterations, yellow[1], white[1]),
         map(i, iterations_4 * 2.5, iterations, yellow[2], white[2])]);
      }
   }
   return palette;
}

function map(x, in_min, in_max, out_min, out_max)
{
   return (out_max - out_min) / (in_max - in_min) * (x - in_min) + out_min;
}

function drawmand(canvas, center, zoom, reitr)
{
   var res = Math.floor(Math.pow((100 - parseInt(document.getElementById('mand_res').value)) / 40, 2) + 1);
   mandelbrot_itr = reitr ? 80 / (Math.pow(zoom, 0.2)) : mandelbrot_itr;
   mandelbrot(canvas, {re : -3 * zoom + mandelbrot_center.re, im : -2 * zoom - mandelbrot_center.im}, {re : 3 * zoom + mandelbrot_center.re, im : 2 * zoom - mandelbrot_center.im}, mandelbrot_itr, res);
}

function drawjulia(canvas, c, center, zoom, reitr)
{
	var res = Math.floor(Math.pow((100 - parseInt(document.getElementById('jul_res').value)) / 40, 2) + 1);
   julia_itr = reitr ? 80 / (Math.pow(zoom, 0.2)) : julia_itr;
   julia(canvas, {re : -3 * zoom + julia_center.re, im : -2 * zoom - julia_center.im}, {re : 3 * zoom + julia_center.re, im : 2 * zoom - julia_center.im}, mandelbrot_center, julia_itr, res);
}

function gohome()
{
   mandelbrot_zoom = 1;
   mandelbrot_itr = 80;
   mandelbrot_center = {re : 0, im : 0};
   drawmand(mandelbrot_canvas, mandelbrot_center, mandelbrot_zoom, true);
   julia_zoom - 1;
   julia_itr = 80;
   julia_center = {re : 0, im : 0};
   drawjulia(julia_canvas, mandelbrot_center, julia_center, julia_zoom, true);
}

function mandelbrotzoom_auto(level)
{
	mandelbrot_zoom = mandelbrot_zoom * 0.9;
   drawmand(mandelbrot_canvas, mandelbrot_center, mandelbrot_zoom, true);
}

function juliazoom_auto()
{
	julia_zoom = julia_zoom * 0.9;
   drawjulia(julia_canvas, mandelbrot_center, julia_center, julia_zoom, true);
}

function mand_redraw()
{
   mandelbrot_center.re = parseFloat(document.getElementById('mandcenter_re').value);
   mandelbrot_center.im = parseFloat(document.getElementById('mandcenter_im').value);
   mandelbrot_zoom = parseFloat(document.getElementById('mandzoom').value);
   drawmand(mandelbrot_canvas, mandelbrot_center, mandelbrot_zoom, true);
}

function jul_redraw()
{
   julia_center.re = parseFloat(document.getElementById('julcenter_re').value);
   julia_center.im = parseFloat(document.getElementById('julcenter_im').value);
   julia_zoom = parseFloat(document.getElementById('julzoom').value);
   drawjulia(julia_canvas, mandelbrot_center, julia_center, julia_zoom, true);
}

mandelbrot_canvas.addEventListener('dblclick', function(event) {gohome();}, false);
julia_canvas.addEventListener('dblclick', function(event) {gohome();}, false);

mandelbrot_canvas.addEventListener('wheel', function(event) {
	var win = mandelbrot_canvas.getBoundingClientRect();
	var zfactor = 1 / (1 - (event.deltaY / 2500));
   mandelbrot_zoom *= zfactor;
   
   var pix = {x : event.pageX - mandelbrot_canvas.width / 2 - win.left, y : mandelbrot_canvas.height / 2 - event.pageY + win.top};
   var mincplx = {re : mandelbrot_center.re - 3 * mandelbrot_zoom, im : mandelbrot_center.im - 2 * mandelbrot_zoom};
   var maxcplx = {re : mandelbrot_center.re + 3 * mandelbrot_zoom, im : mandelbrot_center.im + 2 * mandelbrot_zoom};
   var zoomcplx = {re : map(pix.x, -mandelbrot_canvas.width / 2, mandelbrot_canvas.width / 2, mincplx.re, maxcplx.re), im : map(pix.y, -mandelbrot_canvas.height / 2, mandelbrot_canvas.height / 2, mincplx.im, maxcplx.im)};
   var zoomcent = mandelbrot_state.locked ? mandelbrot_center : zoomcplx;
   var newmin = {re : zoomcent.re * (1 - zfactor) + zfactor * mincplx.re, im : zoomcent.im * (1 - zfactor) + zfactor * mincplx.im};
   var newmax = {re : zoomcent.re * (1 - zfactor) + zfactor * maxcplx.re, im : zoomcent.im * (1 - zfactor) + zfactor * maxcplx.im};
   mandelbrot_center = {re : (newmin.re + newmax.re) / 2, im : (newmin.im + newmax.im) / 2};
   drawmand(mandelbrot_canvas, mandelbrot_center, mandelbrot_zoom, false);
   document.getElementById('mandcenter_re').value = mandelbrot_center.re.toString();
	document.getElementById('mandcenter_im').value = mandelbrot_center.im.toString();
	document.getElementById('mandzoom').value = mandelbrot_zoom.toString();
}, false);

julia_canvas.addEventListener('wheel', function(event) {
	var win = julia_canvas.getBoundingClientRect();
	var zfactor = 1 / (1 - (event.deltaY / 2500));
   julia_zoom *= zfactor;
   
   var pix = {x : event.pageX - julia_canvas.width / 2 - win.left, y : julia_canvas.height / 2 - event.pageY + win.top};
   var mincplx = {re : julia_center.re - 3 * julia_zoom, im : julia_center.im - 2 * julia_zoom};
   var maxcplx = {re : julia_center.re + 3 * julia_zoom, im : julia_center.im + 2 * julia_zoom};
   var zoomcplx = {re : map(pix.x, -julia_canvas.width / 2, julia_canvas.width / 2, mincplx.re, maxcplx.re), im : map(pix.y, -julia_canvas.height / 2, julia_canvas.height / 2, mincplx.im, maxcplx.im)};
   var zoomcent = julia_state.locked ? julia_center : zoomcplx;
   var newmin = {re : zoomcent.re * (1 - zfactor) + zfactor * mincplx.re, im : zoomcent.im * (1 - zfactor) + zfactor * mincplx.im};
   var newmax = {re : zoomcent.re * (1 - zfactor) + zfactor * maxcplx.re, im : zoomcent.im * (1 - zfactor) + zfactor * maxcplx.im};
   julia_center = {re : (newmin.re + newmax.re) / 2, im : (newmin.im + newmax.im) / 2};
   drawjulia(julia_canvas, mandelbrot_center, julia_center, julia_zoom, false);
   document.getElementById('julcenter_re').value = julia_center.re.toString();
	document.getElementById('julcenter_im').value = julia_center.im.toString();
	document.getElementById('julzoom').value = julia_zoom.toString();
}, false);

document.addEventListener('keydown', function(event) {
   if (event.key == 'r')
   {
      mand_redraw();
      jul_redraw();
   }
   if (event.key == 'm')
   {
      mandelbrot_state.locked = !mandelbrot_state.locked;
   }
   if (event.key == "j")
   {
		julia_state.locked = !julia_state.locked;
   }
   if (event.key == 'z')
   {
      if (mandelbrot_state.zooming)
      {
         window.clearInterval(mandelbrottimer);
         mandelbrot_state.zooming = false;
      }
      else
      {
         mandelbrottimer = window.setInterval(mandelbrotzoom_auto, 100);
         mandelbrot_state.zooming = true;
      }
   }
   if (event.key == 'x')
   {
   	if (julia_state.zooming)
   	{
   		window.clearInterval(juliatimer);
   		julia_state.zooming = false;
   	}
   	else
   	{
   		juliatimer = window.setInterval(juliazoom_auto, 100);
   		julia_state.zooming = true;
   	}
   }
}, false);