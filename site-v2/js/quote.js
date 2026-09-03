(function () {
  'use strict';

  var ROAD_FACTOR = 1.25;
  var SOTON = /^SO1[4-9]$/;
  var RADIUS_MILES = 25;
  var MAX_BAGS = 40;
  var INCOMPLETE = 'Fill in the details for a price';
  var UNKNOWN = 'I don\'t recognise that postcode — WhatsApp me and I\'ll price it';
  var FAR = 'That\'s outside my usual area — WhatsApp me and I\'ll price it';
  var TOO_MANY = 'For more than ' + MAX_BAGS + ' bags, WhatsApp me and I\'ll price it';

  // Apps Script hook: paste the deployed "Kerb2Kerb enquiries" web-app URL here. While it is empty the
  // form opens WhatsApp with everything pre-typed instead, so no enquiry is lost before the Sheet exists.
  var APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxYSRPLPkIR5eIDx7Xq-L1MHai-6mp4XqhpwvGmDRzhrzeVCBzGfCRssCNB2zaO1CSH/exec';

  var DESTS = {
    cruise: [
      { id: 'ocean', label: 'Ocean Cruise Terminal', lat: 50.8964, lon: -1.4003 },
      { id: 'city', label: 'City Cruise Terminal', lat: 50.8995, lon: -1.4163 },
      { id: 'mayflower', label: 'Mayflower Cruise Terminal', lat: 50.9031, lon: -1.4257 },
      { id: 'qeii', label: 'QEII Cruise Terminal', lat: 50.8932, lon: -1.4013 },
      { id: 'horizon', label: 'Horizon Cruise Terminal', lat: 50.9045, lon: -1.4296 }
    ],
    airport: [
      { id: 'sou', label: 'Southampton Airport', lat: 50.9503, lon: -1.3567 },
      { id: 'lhr', label: 'London Heathrow', lat: 51.47, lon: -0.4543, fixed: 245 },
      { id: 'lgw', label: 'London Gatwick', lat: 51.1537, lon: -0.1821, fixed: 265 },
      { id: 'boh', label: 'Bournemouth Airport', lat: 50.78, lon: -1.8425 }
    ]
  };

  var JOBS = {
    cruise: { label: 'Cruise luggage', dest: 'cruise', bags: 'Bags', callout: 20, perMile: 1.2, min: 25 },
    airport: { label: 'Airport luggage', dest: 'airport', bags: 'Bags', callout: 25, perMile: 1.9, min: 35 },
    student: { label: 'Student move-in', drop: 'Halls postcode', load: 'One van-load — I help carry' },
    luggage: { label: 'Luggage / parcel', drop: 'Drop-off postcode', bags: 'Bags or boxes', callout: 20, perMile: 1.2, min: 25 },
    removals: { label: 'Removals', drop: 'Drop-off postcode', load: 'One van-load' },
    courier: { label: 'Business courier', drop: 'Drop-off postcode', bags: 'Items' }
  };
  var JOB_ORDER = ['cruise', 'airport', 'student', 'luggage', 'removals', 'courier'];
  var WINDOWS = ['Morning (7–11am)', 'Midday (11am–2pm)', 'Afternoon (2–6pm)', 'Evening (6–9pm)', 'Flexible'];

  function outward(raw) {
    var pc = (raw || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (/^[A-Z]{1,2}[0-9][0-9A-Z]?[0-9][A-Z]{2}$/.test(pc)) return pc.slice(0, -3);
    if (/^[A-Z]{1,2}[0-9][0-9A-Z]?$/.test(pc)) return pc;
    return null;
  }

  function coords(raw) {
    var o = outward(raw);
    var c = o && window.K2K_OUTCODES && window.K2K_OUTCODES[o];
    return c ? { outward: o, lat: c[0], lon: c[1] } : null;
  }

  function centre() {
    var c = window.K2K_OUTCODES && window.K2K_OUTCODES.SO14;
    return c ? { lat: c[0], lon: c[1] } : { lat: 50.9058, lon: -1.4041 };
  }

  function toRad(d) { return d * Math.PI / 180; }

  function crow(a, b) {
    var dLat = toRad(b.lat - a.lat), dLon = toRad(b.lon - a.lon);
    var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 3958.8 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  }

  function miles(a, b) { return crow(a, b) * ROAD_FACTOR; }

  function parseBags(raw) {
    var m = /^\s*(\d+)(?:\.\d*)?\s*$/.exec(raw || '');
    return m ? Math.max(1, parseInt(m[1], 10)) : null;
  }

  function tidyBags(input) {
    var n = parseBags(input.value);
    if (n !== null && String(n) !== input.value) input.value = n;
  }

  function findDest(kind, id) {
    var list = DESTS[kind] || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function pounds(n) { return '£' + Math.round(n); }
  function mi(n) { return '≈ ' + Math.round(n) + ' miles'; }

  function fmtDate(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    if (!m) return '';
    var d = new Date(+m[1], +m[2] - 1, +m[3]);
    return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  }

  function quote(q, active) {
    var job = JOBS[q.job];
    if (!job) return { state: 'incomplete' };
    if (q.job === 'removals') {
      return {
        state: 'text',
        text: '£35/hour, 2-hour minimum — send a photo of the load for a fixed price',
        lines: ['Home, office and Marketplace collections', '+£1.20 a mile beyond 10 miles', 'No VAT']
      };
    }
    var from = coords(q.pickup);
    if (!from) return { state: outward(q.pickup) && active !== 'pickup' ? 'unknown' : 'incomplete' };
    var dest = null, to;
    if (job.dest) {
      dest = findDest(job.dest, q.dest);
      if (!dest) return { state: 'incomplete' };
      to = dest;
    } else {
      to = coords(q.dropoff);
      if (!to) return { state: outward(q.dropoff) && active !== 'dropoff' ? 'unknown' : 'incomplete' };
    }
    var ctr = centre();
    if (crow(from, ctr) > RADIUS_MILES || (!dest && crow(to, ctr) > RADIUS_MILES)) return { state: 'far' };
    var bags = 0;
    if (job.bags) {
      bags = parseBags(q.bags);
      if (bags === null) return { state: 'incomplete' };
      if (bags > MAX_BAGS) return { state: 'toomany' };
    }

    var dist = miles(from, to), price, lines = [];
    if (dest && dest.fixed) {
      price = dest.fixed + Math.max(0, bags - 6) * 5;
      lines.push('Fixed price, door to terminal', bags + (bags === 1 ? ' bag' : ' bags') + (bags > 6 ? ' (+£5 a bag over 6)' : ' — up to 6 included'), 'First 15 min waiting free, then £10 per 15 min', 'No VAT');
    } else if (q.job === 'student') {
      var fromIn = SOTON.test(from.outward), toIn = SOTON.test(to.outward);
      if (fromIn && toIn) {
        price = 35;
        lines.push('£35 flat anywhere in Southampton', 'One van-load, door to their room', 'I help carry', 'No VAT');
      } else {
        var leg = fromIn ? miles(to, ctr) : toIn ? miles(from, ctr) : dist;
        var legLabel = fromIn ? 'to ' + to.outward : toIn ? 'from ' + from.outward : from.outward + ' to ' + to.outward;
        price = 35 + 1.2 * leg;
        lines.push('£35 + £1.20 a mile ' + legLabel + ' (' + mi(leg) + ')', 'One van-load, door to their room', 'I help carry', 'No VAT');
      }
    } else if (q.job === 'courier') {
      price = Math.max(35, 35 + 1.5 * dist);
      lines.push('£35 minimum + £1.50 a mile (' + mi(dist) + ')', 'One driver the whole way, direct', bags + (bags === 1 ? ' item' : ' items'), 'No VAT');
    } else if (dist < 15) {
      price = Math.max(30, 12 * bags);
      lines.push('£12 a bag, £30 minimum', bags + (bags === 1 ? ' bag' : ' bags') + ', door to ' + (dest ? 'terminal' : 'door'));
      if (dest) lines.push('First 15 min waiting free, then £10 per 15 min');
      lines.push('No VAT');
    } else {
      price = Math.max(job.min, job.callout + job.perMile * dist);
      lines.push(pounds(job.callout) + ' callout + £' + job.perMile.toFixed(2) + ' a mile (' + mi(dist) + ')', bags + (bags === 1 ? ' bag' : ' bags') + ', door to ' + (dest ? 'terminal' : 'door'));
      if (dest) lines.push('First 15 min waiting free, then £10 per 15 min');
      lines.push('No VAT');
    }
    return { state: 'ok', price: Math.round(price), lines: lines, dest: dest, dist: dist };
  }

  function src() { return (window.K2K && window.K2K.src) || ''; }

  function dropLabel(q) {
    var job = JOBS[q.job];
    if (job && job.dest) { var d = findDest(job.dest, q.dest); return d ? d.label : ''; }
    return (q.dropoff || '').toUpperCase();
  }

  function loadLabel(q) {
    var job = JOBS[q.job];
    if (!job) return '';
    var n = job.bags ? parseBags(q.bags) : null;
    return job.load ? job.load : (n !== null ? n + ' ' + job.bags.toLowerCase() : '');
  }

  function priceLabel(r) {
    if (r.state === 'ok') return pounds(r.price) + ' (door to door, no VAT)';
    if (r.state === 'text') return r.text;
    if (r.state === 'unknown') return 'not priced yet — postcode not recognised, please price it';
    if (r.state === 'far') return 'not priced yet — outside the usual area, please price it';
    if (r.state === 'toomany') return 'not priced yet — more than ' + MAX_BAGS + ' bags, please price it';
    return 'not priced yet';
  }

  function whenLabel(q) {
    var d = fmtDate(q.date);
    return [d, q.window].filter(Boolean).join(', ') || 'not set yet';
  }

  function quoteMessage(q, r) {
    var job = JOBS[q.job];
    var lines = [
      'Hi James, price request from kerb2kerb.co.uk',
      'Job: ' + (job ? job.label : ''),
      'Pickup: ' + ((q.pickup || '').toUpperCase() || 'not set yet'),
      'Drop-off: ' + (dropLabel(q) || 'not set yet'),
      'Load: ' + (loadLabel(q) || 'not set yet'),
      'When: ' + whenLabel(q),
      'Quoted: ' + priceLabel(r)
    ];
    if (src()) lines.push('Source: ' + src());
    return lines.join('\n');
  }

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function field(id, name, label, control, extra) {
    return '<div class="field field-' + name + (extra || '') + '"><label for="' + id + '-' + name + '">' + label + '</label>' +
      control.replace('<input ', '<input id="' + id + '-' + name + '" ').replace('<select ', '<select id="' + id + '-' + name + '" ') + '</div>';
  }

  function options(list, selected) {
    return list.map(function (o) {
      return '<option value="' + o.id + '"' + (o.id === selected ? ' selected' : '') + '>' + o.label + '</option>';
    }).join('');
  }

  function build(root) {
    var id = root.id || 'quote';
    var preset = JOBS[root.getAttribute('data-job')] ? root.getAttribute('data-job') : 'cruise';
    root.classList.add('quote');
    root.innerHTML =
      '<form class="quote-form" novalidate><div class="quote-grid">' +
      field(id, 'job', 'Job type', '<select name="job">' + options(JOB_ORDER.map(function (k) { return { id: k, label: JOBS[k].label }; }), preset) + '</select>') +
      field(id, 'pickup', 'Pickup postcode', '<input name="pickup" type="text" placeholder="e.g. SO14 3JN" autocapitalize="characters" autocomplete="postal-code" spellcheck="false">') +
      field(id, 'dest', 'Drop-off', '<select name="dest"></select>') +
      field(id, 'dropoff', 'Drop-off postcode', '<input name="dropoff" type="text" placeholder="e.g. SO17 1BJ" autocapitalize="characters" spellcheck="false">') +
      field(id, 'bags', 'Bags', '<input name="bags" type="number" min="1" max="40" step="1" value="2" inputmode="numeric"><span class="hint">A large box or awkward item counts as a bag</span>') +
      field(id, 'load', 'Load', '<div class="static"></div>') +
      field(id, 'date', 'Preferred date', '<input name="date" type="date">') +
      field(id, 'window', 'Time window', '<select name="window">' + options(WINDOWS.map(function (w) { return { id: w, label: w }; }), 'Flexible') + '</select>') +
      '</div></form>' +
      '<div class="quote-result" aria-live="polite"><div class="label">Your price</div>' +
      '<div class="quote-price muted">' + INCOMPLETE + '</div><ul class="quote-includes"></ul>' +
      '<div class="quote-actions">' +
      '<button type="button" class="btn btn-primary" data-action="request">Request this</button>' +
      '<a class="btn btn-whatsapp" data-action="whatsapp" href="#" target="_blank" rel="noopener">WhatsApp James</a>' +
      '</div>' +
      '<p class="quote-note">Nothing is booked until I confirm by WhatsApp. No VAT, no card fees — bank payment or cash on completion.</p>' +
      '</div>';
    var today = new Date();
    root.querySelector('[name=date]').min = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
  }

  function read(root) {
    var f = root.querySelector('form');
    return {
      job: f.job.value, pickup: f.pickup.value.trim(), dest: f.dest.value, dropoff: f.dropoff.value.trim(),
      bags: f.bags.value, date: f.date.value, window: f.window.value
    };
  }

  function show(root, name, on) { root.querySelector('.field-' + name).classList.toggle('hidden', !on); }

  function syncFields(root) {
    var f = root.querySelector('form');
    var job = JOBS[f.job.value];
    var destSel = f.dest;
    if (job.dest) {
      if (destSel.getAttribute('data-kind') !== job.dest) {
        destSel.innerHTML = options(DESTS[job.dest], (findDest(job.dest, destSel.value) || {}).id);
        destSel.setAttribute('data-kind', job.dest);
      }
    }
    show(root, 'dest', !!job.dest);
    show(root, 'dropoff', !job.dest);
    if (job.drop) root.querySelector('.field-dropoff label').textContent = job.drop;
    show(root, 'bags', !!job.bags);
    if (job.bags) root.querySelector('.field-bags label').textContent = job.bags;
    show(root, 'load', !!job.load);
    if (job.load) root.querySelector('.field-load .static').textContent = job.load;
  }

  function render(root) {
    syncFields(root);
    var q = read(root);
    var active = document.activeElement && root.contains(document.activeElement) ? document.activeElement.name : '';
    var r = quote(q, active);
    var priceEl = root.querySelector('.quote-price');
    var inc = root.querySelector('.quote-includes');
    priceEl.className = 'quote-price';
    if (r.state === 'ok') priceEl.textContent = pounds(r.price);
    else if (r.state === 'text') { priceEl.textContent = r.text; priceEl.classList.add('text'); }
    else {
      priceEl.textContent = r.state === 'unknown' ? UNKNOWN : r.state === 'far' ? FAR : r.state === 'toomany' ? TOO_MANY : INCOMPLETE;
      priceEl.classList.add('muted');
    }
    inc.innerHTML = (r.lines || []).map(function (l) { return '<li>' + l + '</li>'; }).join('');
    root.querySelector('[data-action=whatsapp]').href = window.K2K.whatsappUrl(quoteMessage(q, r));
    root._state = { q: q, r: r };
  }

  function applyParams(root, p) {
    var f = root.querySelector('form');
    if (JOBS[p.get('job')]) f.job.value = p.get('job');
    syncFields(root);
    ['pickup', 'dropoff', 'bags', 'date', 'window'].forEach(function (k) { if (p.get(k)) f[k].value = p.get(k); });
    if (p.get('dest')) f.dest.value = p.get('dest');
  }

  function requestUrl(q) {
    var p = new URLSearchParams();
    Object.keys(q).forEach(function (k) { if (q[k]) p.set(k, q[k]); });
    if (src()) p.set('src', src());
    return '/quote/?' + p.toString() + '#request';
  }

  function prefillForm(form, q, r) {
    var job = JOBS[q.job];
    if (job) form.job.value = q.job;
    form.pickup.value = (q.pickup || '').toUpperCase();
    form.dropoff.value = dropLabel(q);
    form.bags.value = loadLabel(q);
    form.date.value = q.date || '';
    form.window.value = q.window || 'Flexible';
    form.price.value = priceLabel(r);
    form.src.value = src();
  }

  function enquiryMessage(form) {
    var job = JOBS[form.job.value];
    var lines = [
      'Hi James, enquiry from kerb2kerb.co.uk',
      'Name: ' + form.name.value.trim(),
      'WhatsApp: ' + form.phone.value.trim(),
      'Job: ' + (job ? job.label : form.job.value),
      'Pickup: ' + form.pickup.value.trim(),
      'Drop-off: ' + form.dropoff.value.trim(),
      'Load: ' + form.bags.value.trim(),
      'When: ' + ([fmtDate(form.date.value), form.window.value].filter(Boolean).join(', ') || 'not set yet'),
      'Quoted: ' + (form.price.value || 'not priced yet')
    ];
    if (form.notes.value.trim()) lines.push('Notes: ' + form.notes.value.trim());
    if (form.src.value) lines.push('Source: ' + form.src.value);
    return lines.join('\n');
  }

  function openWhatsApp(text) {
    var url = window.K2K.whatsappUrl(text);
    var w = window.open(url, '_blank', 'noopener');
    if (!w) window.location.href = url;
  }

  function initForm(form) {
    form.src.value = src();
    var status = form.querySelector('.form-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var missing = ['name', 'phone', 'pickup'].filter(function (k) { return !form[k].value.trim(); });
      form.querySelectorAll('.field').forEach(function (f) { f.classList.remove('invalid'); });
      if (missing.length) {
        missing.forEach(function (k) { form[k].closest('.field').classList.add('invalid'); });
        status.textContent = 'I need your name, WhatsApp number and pickup postcode to come back to you.';
        form[missing[0]].focus();
        return;
      }
      status.textContent = '';
      var text = enquiryMessage(form);
      window.K2K.lead({ content_name: 'enquiry_form', job: form.job.value, src: form.src.value });
      if (!APPS_SCRIPT_URL) { openWhatsApp(text); return; }
      var jobDef = JOBS[form.job.value];
      // Keys must match the Apps Script's COLUMNS exactly - anything else lands as a blank cell.
      var payload = {
        name: form.name.value.trim(),
        whatsapp: form.phone.value.trim(),
        job_type: jobDef ? jobDef.label : form.job.value,
        pickup: form.pickup.value.trim(),
        dropoff: form.dropoff.value.trim(),
        bags_or_load: form.bags.value.trim(),
        preferred_date: form.date.value,
        preferred_time: form.window.value,
        quoted_price: form.price.value,
        notes: form.notes.value.trim(),
        source: form.src.value,
        page: window.location.pathname
      };
      // text/plain keeps the request "simple" so Apps Script gets it without a CORS preflight it can't answer.
      fetch(APPS_SCRIPT_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(payload) })
        .then(function () {
          status.textContent = 'Sent — I\'ll confirm by WhatsApp. Want it faster? Message me the same details:';
          var a = el('a', 'btn btn-whatsapp btn-sm', 'WhatsApp James');
          a.href = window.K2K.whatsappUrl(text); a.target = '_blank'; a.rel = 'noopener';
          status.appendChild(document.createTextNode(' ')); status.appendChild(a);
        })
        .catch(function () { openWhatsApp(text); });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var params = new URLSearchParams(window.location.search);
    var form = document.getElementById('enquiry-form');
    if (form) initForm(form);

    document.querySelectorAll('[data-quote-tool]').forEach(function (root) {
      build(root);
      if (params.get('job') || params.get('pickup')) applyParams(root, params);
      render(root);
      root.addEventListener('input', function () { render(root); });
      root.addEventListener('change', function (e) {
        if (e.target && e.target.name === 'bags') tidyBags(e.target);
        render(root);
      });
      root.addEventListener('focusout', function () { setTimeout(function () { render(root); }, 0); });
      root.querySelector('[data-action=request]').addEventListener('click', function () {
        var s = root._state;
        if (form) {
          prefillForm(form, s.q, s.r);
          form.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setTimeout(function () { form.name.focus({ preventScroll: true }); }, 400);
        } else {
          window.location.href = requestUrl(s.q);
        }
      });
      if (form && (params.get('job') || params.get('pickup'))) {
        prefillForm(form, root._state.q, root._state.r);
        if (window.location.hash === '#request') form.scrollIntoView();
      }
    });
  });
})();
