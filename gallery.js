/* Creates a carousel for artifacts
   Shows 3 artifacts at a time on the page.
   Users can scroll through artifacts if 3+ are
   displayed.
   Wraps around at either end. */

document.querySelectorAll('.carousel').forEach(function (carousel) {
	var track = carousel.querySelector('.cards');
	var prev = carousel.querySelector('.arrow-prev');
	var next = carousel.querySelector('.arrow-next');

	// Accessible arrow buttons
	prev.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
	next.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';

	// Calculate how far to scroll based on card width and spacing
	function step() {
		var card = track.children[0];
		return card.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 24);
	}

	// Calculate the max horizontal scroll distance
	function maxScroll() {
		return track.scrollWidth - track.clientWidth;
	}

	// Show navigational arrows when cards overflow (+3 on PC)
	function update() {
		var show = maxScroll() > 1;
		prev.hidden = next.hidden = !show;
		prev.disabled = next.disabled = false;
	}

	// Scroll backwards.
	// If at the start, jump to the end to create continuous navigation.
	prev.addEventListener('click', function () {
		if (track.scrollLeft <= 1) {
			track.scrollTo({ left: maxScroll() });
		}
		else {
			track.scrollBy({ left: -step() });
		}
	});

	// Scroll forwards.
	// If at the end, jump to the start to create continuous navigation.
	next.addEventListener('click', function () {
		if (track.scrollLeft >= maxScroll() - 1) {
			track.scrollTo({ left: 0 });
		}
		else {
			track.scrollBy({ left: step() });
		}
	});

	// Recheck arrow visibility when layout changes.
	window.addEventListener('resize', update);
	update();
});


/* PHOTO GALLERY FEATURE
   Users can click a photo to zoom in on it,
   and they'll be able to arrow through all
   relevant photos with appropriate captions.
   Wraps around.
*/

(function () {
	// Create the hidden full-screen overlay for enlarged images.
	var box = document.createElement('div');
	box.style.cssText =
		'position:fixed;top:0;right:0;bottom:0;left:0;z-index:1000;display:none;' +
		'align-items:center;justify-content:center;padding:32px 80px;' +
		'background:rgba(17,22,26,0.96);overflow-y:auto;cursor:zoom-out;';

	var panel = document.createElement('div');
	panel.style.cssText =
		'display:flex;flex-wrap:wrap;gap:32px;align-items:center;justify-content:center;' +
		'max-width:1400px;width:100%;margin:auto;';

	var big = document.createElement('img');
	big.style.cssText =
		'flex:0 1 auto;width:auto;height:auto;max-width:100%;max-height:88vh;display:block;';

	var info = document.createElement('div');
	info.style.cssText = 'flex:0 1 360px;min-width:0;cursor:auto;';

	// Create reusable arrow buttons for gallery navigation.
	function circleButton(label, glyph, side) {
		var b = document.createElement('button');
		b.type = 'button';
		b.setAttribute('aria-label', label);
		b.textContent = glyph;
		b.style.cssText =
			'position:fixed;width:44px;height:44px;border:1px solid #D1A25E;border-radius:50%;' +
			'background:#11161A;color:#D1A25E;font-size:24px;line-height:1;cursor:pointer;' + side;
		return b;
	}

	// Create close, previous, and next navigation buttons.
	var closeBtn = circleButton('Close', '\u00D7', 'top:16px;right:20px;');
	var prevBtn = circleButton('Previous image', '\u2039', 'top:50%;left:20px;transform:translateY(-50%);');
	var nextBtn = circleButton('Next image', '\u203A', 'top:50%;right:20px;transform:translateY(-50%);');

	panel.appendChild(big);
	panel.appendChild(info);
	box.appendChild(panel);
	box.appendChild(closeBtn);
	box.appendChild(prevBtn);
	box.appendChild(nextBtn);
	document.body.appendChild(box);

	// Collect artifact images available for gallery navigation.
	var images = Array.prototype.slice.call(document.querySelectorAll('.card img'));
	var current = null;

	// Style copied captions and links to match the enlarged gallery.
	function styleClone(el) {
		el.querySelectorAll('[id]').forEach(function (n) { n.removeAttribute('id'); });
		var title = el.querySelector('h3');
		if (title) title.style.cssText =
			'margin:0 0 12px;font:600 0.85rem Inter,sans-serif;letter-spacing:0.09em;' +
			'text-transform:uppercase;color:#D1A25E;';
		var text = el.querySelector('p');
		if (text) text.style.cssText = 'margin:0 0 18px;font-size:17px;line-height:1.7;color:#ECE7DA;';
		var credit = el.querySelector('.credit');
		if (credit) credit.style.cssText = 'margin:0;font-size:13px;line-height:1.6;color:#A7B0AA;';
		el.querySelectorAll('a').forEach(function (a) {
			a.style.color = '#7CC4B3';
			if ((a.getAttribute('href') || '').indexOf('#') !== 0) {
				a.target = '_blank';
				a.rel = 'noopener';
			}
		});
	}

	// Display selected image and copy its associated information.
	function show(img) {
		current = img;
		var source = img.closest('.card') || img.closest('.hero-media');
		big.src = img.currentSrc || img.src;
		big.alt = img.alt;

		info.innerHTML = '';
		source.querySelectorAll('h3, p, .credit').forEach(function (n) {
			info.appendChild(n.cloneNode(true));
		});
		styleClone(info);

		// Show navigation arrows only when multiple gallery images exist.
		var canBrowse = images.indexOf(img) > -1 && images.length > 1;
		prevBtn.style.display = nextBtn.style.display = canBrowse ? 'block' : 'none';
		box.style.display = 'flex';
	}

	// Navigate between images, wrapping around at either end.
	function step(dir) {
		var i = images.indexOf(current);
		if (i < 0) return;
		show(images[(i + dir + images.length) % images.length]);
	}

	// Hide the gallery overlay.
	function close() { box.style.display = 'none'; }

	// Make artifact and hero images clickable to open the gallery.
	document.querySelectorAll('.card img, .hero-media img').forEach(function (img) {
		img.style.cursor = 'zoom-in';
		img.addEventListener('click', function () { show(img); });
	});

	// Handle gallery navigation and prevent button clicks from closing the overlay.
	prevBtn.addEventListener('click', function (e) { e.stopPropagation(); step(-1); });
	nextBtn.addEventListener('click', function (e) { e.stopPropagation(); step(1); });
	closeBtn.addEventListener('click', close);

	// Close the gallery when clicking outside its content.
	box.addEventListener('click', function (e) {
		var link = e.target.closest('a');
		if (link) {
			if ((link.getAttribute('href') || '').indexOf('#') === 0) close();
			return;
		}
		close();
	});

	// Support keyboard navigation: Escape closes and arrow keys browse images.
	document.addEventListener('keydown', function (e) {
		if (box.style.display === 'none') return;
		if (e.key === 'Escape') close();
		if (e.key === 'ArrowLeft') step(-1);
		if (e.key === 'ArrowRight') step(1);
	});
})();