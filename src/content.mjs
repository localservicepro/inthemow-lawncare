// All site copy, data and page specs. SEO fields follow the Step 1 research report verbatim.
export const site = {
  name: 'In The Mow Lawncare',
  legalName: 'In The Mow Lawncare',
  tagline: 'Your Lawncare Solution',
  owner: 'Joshua Patriarca',
  phone: '0424 058 261',
  phoneTel: '+61424058261',
  email: 'enquiries@inthemowlawncare.com.au',
  url: 'https://inthemowlawncare.com.au',
  gbp: 'https://maps.app.goo.gl/UH7WvxZPVw6LzZTU6',
  facebook: 'https://www.facebook.com/profile.php?id=61553258399355',
  locality: 'Byford', region: 'WA', postcode: '6122', country: 'AU',
  geo: { lat: -32.2055692, lng: 115.9594586 },
  hoursText: 'Mon–Fri 9:00am–5:00pm',
  openingHours: 'Mo-Fr 09:00-17:00',
  trackingId: 'tk_9c8c4108f54d4ef2bf2af5dfac9d0c15',
  gbpEmbed: '<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d114132.82700240743!2d115.9135828!3d-32.1626134!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e33d9b3d8d0a54f%3A0xff3e40563a8aefad!2sIn%20The%20Mow%20Lawncare!5e1!3m2!1sen!2sph!4v1793107124209!5m2!1sen!2sph" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>'
};

export const formServices = ['Lawn Mowing', 'Reticulation Repairs & Installation', 'Acreage Mowing & Slashing', 'Garden Maintenance & Hedging', 'Turf & Lawn Installation', 'Lawn Health & Renovation', 'Other'];

export const regions = [
  { name: 'South-East Perth', suburbs: [
    ['Canning Vale', 115.918, -32.078, 1], ['Thornlie', 115.955, -32.058], ['Southern River', 115.955, -32.108], ['Huntingdale', 115.968, -32.082], ['Gosnells', 116.005, -32.078], ['Maddington', 115.990, -32.050], ['Kelmscott', 116.025, -32.120], ['Seville Grove', 116.000, -32.138], ['Armadale', 116.015, -32.152, 1], ['Mount Richon', 116.028, -32.172] ] },
  { name: 'Byford growth corridor', suburbs: [
    ['Byford', 115.995, -32.220, 1], ['Hilbert', 115.985, -32.175], ['Haynes', 116.003, -32.178], ['Cardup', 115.995, -32.260], ['Mundijong', 115.985, -32.292], ['Whitby', 115.975, -32.315], ['Oakford', 115.935, -32.200], ['Wandi', 115.875, -32.190], ['Anketell', 115.855, -32.205], ['Casuarina', 115.850, -32.235] ] },
  { name: 'Serpentine / Hills', suburbs: [
    ['Serpentine', 115.985, -32.360, 1], ['Jarrahdale', 116.060, -32.335, 1], ['Bedfordale', 116.045, -32.180], ['Roleystone', 116.075, -32.115], ['Karragullen', 116.095, -32.090] ] },
  { name: 'Cockburn / Kwinana', suburbs: [
    ['Jandakot', 115.872, -32.100, 1], ['Treeby', 115.890, -32.110], ['Cockburn Central', 115.848, -32.125], ['Success', 115.858, -32.140], ['Atwell', 115.868, -32.150], ['Aubin Grove', 115.858, -32.168], ['Hammond Park', 115.848, -32.175], ['Wattleup', 115.818, -32.180], ['Hope Valley', 115.825, -32.205], ['Bertram', 115.845, -32.240], ['Parmelia', 115.825, -32.255], ['Orelia', 115.815, -32.240], ['Medina', 115.805, -32.228], ['Leda', 115.805, -32.265], ['Wellard', 115.830, -32.270] ] },
  { name: 'Rockingham / Coastal', suburbs: [
    ['Baldivis', 115.825, -32.330, 1], ['Waikiki', 115.760, -32.315], ['Warnbro', 115.760, -32.345], ['Port Kennedy', 115.750, -32.375], ['Secret Harbour', 115.755, -32.405, 1], ['Golden Bay', 115.760, -32.430] ] },
  { name: 'Mandurah region', suburbs: [
    ['Lakelands', 115.765, -32.470], ['Madora Bay', 115.745, -32.470], ['Meadow Springs', 115.750, -32.495], ['Greenfields', 115.765, -32.520], ['Dudley Park', 115.735, -32.545], ['Halls Head', 115.700, -32.540], ['Erskine', 115.700, -32.565], ['Falcon', 115.665, -32.580], ['Wannanup', 115.650, -32.605], ['Coodanup', 115.765, -32.555], ['Mandurah', 115.722, -32.528, 1] ] }
];
export const allSuburbs = regions.flatMap(r => r.suburbs.map(s => s[0]));

// Mower route through the six regions (suburb names or raw [lon,lat] points), returning to Byford.
export const route = ['Byford', 'Cardup', 'Mundijong', 'Serpentine', 'Jarrahdale', 'Bedfordale', 'Armadale', 'Kelmscott', 'Gosnells', 'Huntingdale', 'Thornlie', 'Canning Vale', 'Jandakot', 'Cockburn Central', 'Hammond Park', 'Orelia', 'Wellard', 'Baldivis', [115.728, -32.280], 'Warnbro', 'Secret Harbour', 'Lakelands', 'Meadow Springs', 'Mandurah', 'Halls Head', 'Falcon', [115.72, -32.60], 'Coodanup', [115.90, -32.44], 'Whitby', 'Byford'];

export const reviews = [
  { name: 'Phil Wainwright', date: '2026-02-02', dateText: 'Feb 2026', text: "Couldn't be happier with the full revamp of our retic system Josh did on our big property in Oakford. The grass hasn't looked greener and the new wifi control box makes it do easy. Cheers mate!" },
  { name: 'Mal B', date: '2026-02-07', dateText: 'Feb 2026', text: 'Need retic repar pretty quick. Called Josh on recommendation. Fixed up and running within 24hrs of my call. Top service. Top bloke. Thanks Josh. Mal Byford' },
  { name: 'Jodie Cant', date: '2026-01-15', dateText: 'Jan 2026', text: 'We really appreciate the work Josh has done for us. From the beginning he worked with us to design the garden we wanted and helped rework the quote until it came at a price within our budget. The service he provided in the after-care of the job has been amazing as well. As first time owners of lawn we have had countless questions that he has been happy to discuss in person or via message.' },
  { name: 'Brad Fletcher', date: '2025-11-19', dateText: 'Nov 2025', text: 'Josh did a wonderful job on my front lawn renovation, highly recommend' },
  { name: 'Sylvia Dadson', date: '2026-07-22', dateText: 'Jul 2026', text: 'Josh is very professional and does a wonderful job every time. Highly recommend him to everyone' }
];

export const homeFaqs = [
  { q: 'How much does lawn mowing cost in Byford?', a: 'It depends on the size of the lawn, access, how overgrown it is and whether you want a one-off cut or a regular program. Regular fortnightly mowing works out cheaper per visit than a once-off tidy-up, and we quote before any work starts. Call 0424 058 261 or send the form below for a free, no-obligation lawn mowing Byford quote.' },
  { q: 'Do you mow acreage and slash blocks near Serpentine and Jarrahdale?', a: 'Yes. We run commercial-grade ride-on and zero-turn mowers and slash overgrown paddocks, lifestyle blocks and fire-breaks across Byford, Oakford, Cardup, Mundijong, Serpentine, Jarrahdale and Bedfordale. Fire-season slashing books out quickly, so get in early before the restricted burning period.' },
  { q: 'Can you repair reticulation in Mandurah and Rockingham, not just Byford?', a: "Yes. Reticulation repairs, fault finding, solenoid and valve replacement, controller programming and full new installs are available across the whole corridor, including Mandurah, Halls Head, Lakelands, Rockingham, Baldivis and Secret Harbour. One crew handles the retic and the lawn, so your watering and mowing are set up to work together." },
  { q: "How often should I get my lawn mowed in Perth's South-East?", a: 'Most couch, kikuyu and buffalo lawns in the South-East need mowing every two weeks through spring and summer and every three to four weeks over winter. Acreage and rural blocks are usually cut seasonally, with an extra slash before fire season. We set a schedule that suits your grass type and adjust it as growth changes.' },
  { q: 'Do you offer commercial and strata lawn maintenance in Canning Vale?', a: 'Yes. We maintain strata complexes, offices, rental properties and shared outdoor areas on a scheduled program in Canning Vale, Thornlie, Southern River, Jandakot and across the Cockburn and Armadale areas. Every visit includes mowing, edging, whipper snipping and a full blow-down so the site always presents well.' },
  { q: 'Do you install new turf in Baldivis and the Byford growth corridor?', a: 'Yes. We handle the full job: removing the old lawn or artificial turf, excavation and levelling with our mini loader, soil preparation, turf supply and laying, and reticulation so the new lawn establishes properly. New builds and renovations in Baldivis, Byford, Hilbert, Haynes, Wandi and Treeby are a big part of what we do.' }
];

export const beforeAfter = [
  { before: 'before-1', after: 'after-1', altB: 'Overgrown grass verge beside a Colorbond fence before mowing in Byford WA', altA: 'The same verge in Byford WA freshly mowed and edged by In The Mow Lawncare', cap: 'Verge mowing and edging, Byford' },
  { before: 'before-1b', after: 'after-1b', altB: 'Dead front lawn and bare sand before a garden makeover in the Byford growth corridor', altA: 'Finished front garden with mulched beds, stepping stones and new plants in the Byford growth corridor', cap: 'Front garden makeover with new beds, mulch and reticulation' },
  { before: 'before-2', after: 'after-2', altB: 'Scarified lawn with reticulation running during a lawn renovation in Perth\'s South-East', altA: 'Thick green lawn after renovation, fertilising and reticulation repairs in Perth\'s South-East', cap: 'Lawn renovation: vertimowing, fertilising and retic' }
];

export const home = {
  title: 'Lawn Mowing Byford & Perth South-East | In The Mow',
  description: "Lawn mowing Byford & Perth's South-East. Reliable mowing, acreage slashing, retic repairs & garden care from Canning Vale to Mandurah. Get a free quote today.",
  h1: "Lawn Mowing Byford & Perth's South-East — Reliable Mowing, Retic & Garden Care",
  lead: "In The Mow Lawncare is a locally owned crew based in Byford WA, delivering the lawn mowing Byford homes and businesses rely on, plus acreage slashing, reticulation, turf installation, lawn health and garden maintenance across Perth's South-East corridor and the Peel region, from Canning Vale to Mandurah.",
  servicesLead: 'From the regular lawn mowing Byford families book fortnightly to full reticulation installs in Mandurah, one crew handles the whole property. Pick a service to see what is included, where we work and what it costs.',
  hero: { img: 'regular-lawn-mowing', alt: 'Freshly mowed and striped front lawn after a regular lawn mowing visit in Byford WA' },
  trust: ['Locally owned and operated by Joshua Patriarca', 'One crew for the whole property', 'Commercial-grade ride-on and zero-turn equipment'],
  about: {
    img: 'acreage-large-scale', alt: 'Joshua Patriarca from In The Mow Lawncare with the zero-turn mower and trailer on a rural block near Byford WA',
    paras: [
      "In The Mow Lawncare is owned and run by Joshua Patriarca, not a franchise. Josh is based in Byford and works the whole South-East corridor and Peel region, so the person who quotes your job is the same person who turns up to do it.",
      "Most mowing contractors do one or two things. We look after the whole property: lawn mowing Byford homes and businesses rely on, acreage slashing, reticulation installs and repairs, new turf, lawn health programs, hedging and garden maintenance, with a mini loader and bobcat for tight-access earthworks and site prep."
    ],
    points: [
      ['One crew, every service', 'Mowing, retic, turf, lawn health and gardens from the same people, so nothing gets missed between contractors.'],
      ['Built for acreage and fire season', 'Commercial-grade ride-on and zero-turn mowers for rural blocks and fire-break slashing in Byford, Serpentine and Jarrahdale.'],
      ['Reliable, finished properly', 'Scheduled visits you can count on, and a clean, edged, blown-down finish every time. The before-and-after photos on this site are our real jobs.']
    ]
  },
  areasIntro: "Based in Byford WA 6122, we cover Perth's South-East corridor and the Peel region. Watch the mower do the rounds, or find your suburb in the list below. If you are close to one of these areas and not listed, call us and we will let you know.",
  areasPara: "Lawn mowing Byford is where we started, and Byford, Mundijong, Serpentine and Jarrahdale are still home turf. From there the crew runs north through Armadale, Gosnells and Canning Vale, west through Cockburn and Kwinana, and south along the coast through Baldivis, Rockingham and Secret Harbour to Mandurah.",
  contactIntro: 'Tell us about the property and what you need. Josh will come back to you with a clear price, or call now if the job is urgent, like a retic fault or a block that needs slashing before fire season.'
};

const callCta = 'Call 0424 058 261';

export const services = [
  {
    slug: 'lawn-mowing', nav: 'Lawn Mowing', icon: 'mower',
    short: 'Residential, commercial and strata mowing with edging, whipper snipping and a full blow-down, on a schedule you can rely on.',
    title: 'Lawn Mowing Rockingham & Baldivis | In The Mow',
    h1: 'Lawn Mowing Rockingham, Baldivis & Coastal Suburbs — Residential & Commercial',
    description: 'Reliable lawn mowing Rockingham, Baldivis & Secret Harbour homes and strata trust. Edging, whipper snipping, blow-down & regular programs. Free quote.',
    keyword: 'Lawn Mowing Rockingham', schemaType: 'Lawn mowing service',
    hero: { img: 'residential-lawn-mowing', alt: 'Neatly mowed residential lawn on a sloping block after a lawn mowing visit in the Rockingham area WA' },
    lead: 'Clean cuts, straight edges and a tidy finish every visit, for homes, rentals, strata and small commercial sites from Rockingham and Baldivis down the coast and across the South-East corridor.',
    intro: [
      'Lawn mowing Rockingham locals book with In The Mow Lawncare is simple: we turn up when we say we will, cut the lawn properly, edge the paths and beds, whipper snip the fence lines and blow everything down before we leave. No clippings on the driveway and no half-finished corners.',
      'We service Rockingham, Baldivis, Waikiki, Warnbro, Port Kennedy, Secret Harbour and Golden Bay, as well as the Kwinana, Cockburn, Armadale and Byford areas. Sandy coastal soils and salt wind are hard on lawns, so we cut couch, kikuyu and buffalo at the right height for the season rather than scalping everything the same way.'
    ],
    sections: [
      { h2: 'Residential Lawn Mowing', img: 'residential-mowing-2', alt: 'Push mower cutting a front lawn and verge on a residential street in Baldivis WA', paras: ['Regular mowing keeps your lawn thick, stops weeds taking over and means you never have to deal with an overgrown yard again. Most homes in Rockingham and Baldivis run fortnightly through spring and summer and stretch out to three or four weeks in winter.'], bullets: ['Weekly, fortnightly or monthly programs, or a one-off cut', 'Edging along paths, kerbs, driveways and garden beds', 'Whipper snipping around fences, posts and retic', 'Full blow-down of paths, patios and driveways', 'Clippings removed or mulched as you prefer'] },
      { h2: 'Commercial & Strata Lawn Maintenance', img: 'commercial-strata-mowing', alt: 'Commercial lawn and garden beds maintained outside an office building in Perth\'s South-East', paras: ['Strata managers, property managers and business owners need grounds that present well without chasing a contractor. We run scheduled maintenance for strata complexes, office surrounds, rental properties, childcare centres and shared green space, and we send a quick note when each visit is done.'], bullets: ['Scheduled programs with consistent crews', 'Mowing, edging, hedging and garden tidy-ups in one visit', 'End-of-lease and pre-sale clean-ups for rentals', 'ABN invoicing for strata and commercial accounts'] },
      { h2: 'Why Book In The Mow for Lawn Mowing in Rockingham', paras: ['We are locally owned and operated, not a franchise, and we use commercial-grade mowers that leave an even cut on any size block. Because we also handle reticulation, fertilising and lawn renovation, we notice problems like dry patches, grubs or a broken sprinkler while we are mowing and can fix them before they cost you a lawn.'], bullets: [] }
    ],
    gallery: [
      { img: 'img-1', alt: 'Freshly cut and edged front lawn with a brick path in Secret Harbour WA' },
      { img: 'near-me', alt: 'Tidy garden beds and lawn outside a commercial premises serviced by In The Mow Lawncare in Perth\'s South-East' },
      { img: 'img-6', alt: 'Residential front lawn and verge after mowing and edging in Port Kennedy WA' }
    ],
    faqs: [
      { q: 'How much does lawn mowing cost in Rockingham?', a: 'Price depends on lawn size, access, how long the grass is and whether you want a regular program. A standard residential lawn on a fortnightly schedule is the most economical option. Send through the quote form or call 0424 058 261 for a fixed price.' },
      { q: 'Do I need to be home for the mow?', a: 'No. As long as we can get to the lawn, we complete the job and message you when it is done. Side gates and dog arrangements are sorted at the quote stage.' },
      { q: 'What is included in a standard lawn mowing visit?', a: 'Mowing, edging along all hard edges and beds, whipper snipping fence lines and obstacles, and a full blow-down of paths and driveways. Clippings are mulched or removed.' },
      { q: 'Do you mow strata and commercial sites in Baldivis and Rockingham?', a: 'Yes. We run scheduled grounds maintenance for strata complexes, offices and rental properties across Rockingham, Baldivis, Kwinana and the South-East corridor, with invoicing to suit strata and commercial accounts.' }
    ],
    related: ['garden-maintenance', 'lawn-renovation', 'acreage-mowing'],
    suburbs: ['Rockingham', 'Baldivis', 'Waikiki', 'Warnbro', 'Port Kennedy', 'Secret Harbour', 'Golden Bay', 'Wellard', 'Bertram', 'Byford']
  },
  {
    slug: 'reticulation', nav: 'Reticulation Repairs & Installation', icon: 'sprinkler',
    short: 'Fault finding, leak detection, solenoids and valves, controllers, sprinkler upgrades and full system installs, bore or mains.',
    title: 'Reticulation Mandurah – Repairs & Installs | In The Mow',
    h1: 'Reticulation Mandurah, Rockingham & Byford — Retic Repairs, Installs & Controllers',
    description: 'Reticulation Mandurah, Rockingham & Byford: retic repairs, fault finding, solenoid & valve replacement, Wi-Fi controllers and new installs. Fast local service.',
    keyword: 'Reticulation Mandurah', schemaType: 'Reticulation repair and installation service',
    hero: { img: 'gen-1', gen: true, alt: 'Pop-up sprinklers running across a green front lawn in Mandurah WA' },
    lead: 'Retic that stops working in a Perth summer costs you a lawn in a fortnight. We find the fault, fix it properly and set the controller up for your watering days, from Mandurah and Rockingham up to Byford.',
    intro: [
      'Reticulation Mandurah homeowners rely on gets a hard workout: sandy soil, long dry summers, bore water that clogs nozzles and the odd mower blade through a pop-up. In The Mow Lawncare repairs and installs reticulation across Mandurah, Halls Head, Lakelands, Meadow Springs, Rockingham, Baldivis, Secret Harbour, Kwinana, Byford and the Serpentine-Jarrahdale area.',
      'Because we also mow, fertilise and lay turf, we set your retic up for the lawn you actually have, not just to get water out of the ground. Run times, head spacing and nozzle choice are matched to your grass type and soil so the lawn is watered evenly and you stay inside the Water Corporation watering roster.'
    ],
    sections: [
      { h2: 'Reticulation Repairs & Fault Finding', img: 'gen-2', gen: true, alt: 'Technician replacing a solenoid in an irrigation valve box set in sandy soil in Rockingham WA', paras: ['A station that will not come on, a wet patch that never dries, low pressure on one side of the yard or a controller that has lost its program: we trace the problem to the valve, wiring, pipe or head and fix it on the spot where we can.'], bullets: ['Fault finding and leak detection', 'Solenoid, valve and diaphragm replacement', 'Broken pipe and fitting repairs', 'Blocked, broken or sunken sprinkler heads and pop-ups', 'Nozzle upgrades for even coverage and lower water use', 'Master valve, pump and bore tank irrigation faults'] },
      { h2: 'Controllers, Installs & System Upgrades', img: 'gen-3', gen: true, alt: 'Wi-Fi reticulation controller mounted on a garage wall being programmed for Perth watering days', paras: ['We install and program standard and Wi-Fi controllers so you can run the system from your phone, skip stations after rain and keep to your two watering days without thinking about it. For new builds, renovations and tired old systems we design and install complete reticulation, including trenching with our mini loader where access is tight.'], bullets: ['Full reticulation installs for new lawns and gardens', 'System extensions for new beds, verges and turf', 'Controller install, replacement and programming', 'Drip line conversions for garden beds and hedges', 'Pump and tank irrigation for acreage and rural blocks', 'Water-efficiency tune-ups before summer'] },
      { h2: 'Retic for Rockingham, Baldivis & the Byford Corridor', paras: ['Reticulation repairs in Rockingham, Baldivis and Byford peak from October to January when systems are switched back on and faults show up all at once. Book early, or combine a retic check with your regular mowing so small problems are caught before the heat arrives.'], bullets: [] }
    ],
    gallery: [
      { img: 'fb-615554927', alt: 'New reticulation misting a freshly planted front garden with stepping stones in Byford WA' },
      { img: 'before-2', alt: 'Reticulation running on a lawn during a renovation in Perth\'s South-East' },
      { img: 'after-2', alt: 'Thick green lawn in Perth\'s South-East after retic repairs and a lawn renovation' }
    ],
    faqs: [
      { q: 'How much does it cost to fix reticulation in Mandurah?', a: 'Simple repairs such as a solenoid, a cracked fitting or a few pop-ups are usually a single short visit. Larger faults, re-wiring or new controllers are quoted after we have looked at the system. We tell you the price before we start.' },
      { q: 'Can you fix my retic today?', a: 'Often yes for urgent faults in Mandurah, Rockingham, Baldivis and Byford, depending on where the crew is that day. Call 0424 058 261 and we will give you an honest time.' },
      { q: 'Do you install Wi-Fi reticulation controllers?', a: 'Yes. We supply, install and program Wi-Fi controllers and set up the app on your phone, including your allocated watering days and seasonal run times.' },
      { q: 'Do you install new reticulation with new turf?', a: 'Yes. Turf and reticulation are usually done as one job so the pipework, head spacing and run times suit the new lawn from day one. See our Turf & Lawn Installation page.' },
      { q: 'Do you work on bore and pump systems?', a: 'Yes. We repair and install bore, pump and tank-fed irrigation on residential and acreage properties, including filters and pressure problems that clog nozzles on bore water.' }
    ],
    related: ['turf-installation', 'lawn-renovation', 'lawn-mowing'],
    suburbs: ['Mandurah', 'Halls Head', 'Lakelands', 'Meadow Springs', 'Rockingham', 'Baldivis', 'Secret Harbour', 'Byford', 'Oakford', 'Canning Vale']
  },
  {
    slug: 'acreage-mowing', nav: 'Acreage Mowing & Slashing', icon: 'rideon',
    short: 'Ride-on and zero-turn mowing, block slashing and fire-break prep for rural and lifestyle blocks in the hills and corridor.',
    title: 'Acreage Mowing Byford & Serpentine | In The Mow',
    h1: 'Acreage Mowing & Block Slashing — Byford, Serpentine, Jarrahdale & Oakford',
    description: 'Acreage mowing Byford, Serpentine, Jarrahdale & Oakford. Ride-on and zero-turn mowing, block slashing and fire-break prep for rural blocks. Free quote.',
    keyword: 'Acreage Mowing Byford', schemaType: 'Acreage mowing and slashing service',
    hero: { img: 'acreage-mowing', alt: 'View from the ride-on mower across a large rural block being mowed in Serpentine WA' },
    lead: 'Big blocks need the right gear. Our commercial-grade ride-on and zero-turn mowers cover paddocks, lifestyle blocks, verges and fire-breaks fast, from Byford and Oakford up through Serpentine, Jarrahdale and the hills.',
    intro: [
      'Acreage mowing Byford, Serpentine and Jarrahdale property owners book with us because a domestic mower does not cut it on a one-acre lifestyle block, let alone five. In The Mow Lawncare runs commercial zero-turn and ride-on mowers plus slashing equipment for long grass, so a job that would take you a weekend is done in an afternoon.',
      'We are based in Byford and work the whole Serpentine-Jarrahdale area: Byford, Cardup, Mundijong, Whitby, Oakford, Serpentine, Jarrahdale, Bedfordale, Karragullen and Roleystone, plus rural land around Wandi, Anketell and Casuarina.'
    ],
    sections: [
      { h2: 'Ride-On & Zero-Turn Acreage Mowing', img: 'pro-mowing-residential-acreage', alt: 'Zero-turn mower cutting a large lawn beside a shed on a lifestyle block in Oakford WA', paras: ['For lifestyle blocks, hobby farms and large residential lots we mow with zero-turn mowers that leave an even, clean finish around trees, sheds, dams and fence lines, then whipper snip the edges and blow down the hard surfaces around the house.'], bullets: ['Lifestyle blocks, hobby farms and large residential lots', 'Fence line, tree and shed surrounds trimmed', 'House yard mowed and edged to a residential standard', 'Seasonal or regular programs through the growing months'] },
      { h2: 'Block Slashing & Fire-Break Preparation', img: 'block-slashing-fire-prep', alt: 'Zero-turn mower slashing long dry grass on an overgrown block in Byford WA', paras: ['Overgrown paddocks, vacant blocks and dry summer grass are a fire risk and a compliance headache. We slash long grass, cut fire-breaks to boundaries and get rural blocks across the Shire of Serpentine Jarrahdale and City of Armadale ready before fire season. Book early, as the weeks before the restricted burning period fill quickly.'], bullets: ['Slashing of overgrown and neglected blocks', 'Fire-break mowing along boundaries and access tracks', 'Vacant land, developer lots and commercial land', 'One-off tidy-ups before sale or settlement'] },
      { h2: 'Rural Property Care from One Crew', img: 'rural-commercial-land', alt: 'Zero-turn mower slashing an overgrown rural block near sheds in Jarrahdale WA', paras: ['Acreage owners often need more than a mow. We also handle pump and tank reticulation, fertilising and weed control for house lawns, hedging, mulching and mini loader earthworks, so one call covers the lot.'], bullets: [] }
    ],
    gallery: [
      { img: 'large-property-mowing', alt: 'Large mowed lawn on a tree-lined rural property in the Serpentine Jarrahdale hills WA' },
      { img: 'why-choose-us', alt: 'Zero-turn mower working across a large lawn on a lifestyle block in Mundijong WA' },
      { img: 'acreage-problems', alt: 'Overgrown dry grass being slashed on a rural block in Cardup WA before fire season' }
    ],
    faqs: [
      { q: 'How much does acreage mowing cost in Byford?', a: 'It depends on the area, how long the grass is, obstacles and access. A regular program on a maintained block costs less per visit than a once-a-year slash of long grass. We quote after seeing the block or from an address and a few photos.' },
      { q: 'Can you slash my block before fire season?', a: 'Yes. Fire-break and block slashing is a big part of our spring and early summer work in Serpentine, Jarrahdale, Byford and Oakford. Book early as this period fills quickly.' },
      { q: 'What size blocks do you mow?', a: 'Anything from a large residential lot to multi-acre lifestyle properties and vacant land. Our zero-turn and ride-on mowers and slashing gear handle long grass, slopes and tight spots around trees and sheds.' },
      { q: 'Do you do the house yard as well as the paddock?', a: 'Yes. Most clients have us do the paddocks with the ride-on and the house lawn, edges and blow-down in the same visit so the whole property is finished at once.' }
    ],
    related: ['lawn-mowing', 'reticulation', 'garden-maintenance'],
    suburbs: ['Byford', 'Serpentine', 'Jarrahdale', 'Oakford', 'Mundijong', 'Cardup', 'Whitby', 'Bedfordale', 'Karragullen', 'Wandi']
  },
  {
    slug: 'garden-maintenance', nav: 'Garden Maintenance & Hedging', icon: 'shears',
    short: 'Hedge trimming, pruning, weeding, mulching, garden bed clean-ups, green waste removal and end-of-lease tidy-ups.',
    title: 'Garden Maintenance Perth South-East | In The Mow',
    h1: 'Garden Maintenance Perth South-East — Hedging, Pruning, Mulching & Clean-Ups',
    description: "Garden maintenance Perth South-East: hedge trimming, pruning, weeding, mulching, garden beds & clean-ups from Canning Vale to Byford and Rockingham. Free quote.",
    keyword: 'Garden Maintenance Perth', schemaType: 'Garden maintenance and hedging service',
    hero: { img: 'garden-maintenance', alt: 'Neatly shaped hedges and trimmed lawn at a residential property during garden maintenance in Thornlie WA' },
    lead: 'Hedges shaped, beds weeded and mulched, shrubs and small trees pruned and the green waste gone. One visit, or a program that keeps the garden looking after itself.',
    intro: [
      "Garden maintenance Perth South-East homeowners ask for is usually about catching up: hedges that have got away, beds full of weeds, mulch that disappeared two summers ago. In The Mow Lawncare brings the garden back under control and then keeps it there with a regular program across Canning Vale, Thornlie, Gosnells, Kelmscott, Armadale, Byford, Cockburn, Rockingham and down to Mandurah.",
      "We work on residential gardens, strata common areas, rental properties and small commercial sites. Because we also mow and look after reticulation, your lawn, beds and watering are handled by the same crew on the same day."
    ],
    sections: [
      { h2: 'Hedge Trimming & Pruning', img: 'landscaping-installation-wa', alt: 'Clipped box hedges and tidy garden beds beside a timber deck at a home in Canning Vale WA', paras: ['Lilly pillies, viburnum, murraya, box and conifer hedges all respond to regular shaping. We trim to a clean line, prune shrubs and small trees for shape and health, and tidy palms so fronds and seed pods are not dropping on the lawn.'], bullets: ['Privacy and boundary hedge trimming', 'Formal shaping of box and topiary', 'Shrub, rose and small tree pruning', 'Palm trimming and frond removal', 'All trimmings removed from site'] },
      { h2: 'Weeding, Mulching & Garden Beds', img: 'fb-677078641', alt: 'Freshly mulched garden bed along a Colorbond fence in Armadale WA', paras: ['A thick layer of mulch keeps the soil cool, cuts watering and stops most weeds before they start. We weed beds properly, apply mulch, supply and plant new stock to suit WA conditions and build or rework garden beds and edging.'], bullets: ['Weed removal and selective weed control', 'Mulch supply and spreading', 'Plant supply and planting', 'New garden beds and edging', 'Drip line reticulation for beds'] },
      { h2: 'Clean-Ups, End of Lease & Strata', img: 'fb-469364409', alt: 'Neat front garden with shaped shrubs and lawn after a maintenance visit in Gosnells WA', paras: ['Overgrown yards, end-of-lease tidy-ups, pre-sale presentation and strata common areas are handled as one-off clean-ups with green waste removal, or as a scheduled program for property managers who need the grounds to look right every week.'], bullets: ['Full yard clean-ups and green waste removal', 'End-of-lease and pre-sale garden tidy-ups', 'Strata and commercial garden programs', 'Lawn mowing and edging in the same visit'] }
    ],
    gallery: [
      { img: 'after-1b', alt: 'Finished low-maintenance front garden with mulched beds and stepping stones in Byford WA' },
      { img: 'about', alt: 'Tidy front lawn and garden beds after a regular maintenance visit in Hilbert WA' },
      { img: 'img-3', alt: 'Clean verge and front garden after mowing and tidying in Southern River WA' }
    ],
    faqs: [
      { q: 'What does garden maintenance in Perth cost?', a: 'It depends on the size of the garden, how overgrown it is and how often you want us back. A regular monthly or six-weekly program is cheaper per visit than a one-off catch-up. We quote after seeing the garden or from photos.' },
      { q: 'Do you take the green waste away?', a: 'Yes. All hedge trimmings, prunings and weeds are removed from site unless you would rather keep them for your own composting.' },
      { q: 'How often should hedges be trimmed in Perth?', a: 'Most fast-growing hedges such as lilly pilly and viburnum need trimming three to four times a year, with the main cuts in spring and late summer. Slower hedges like box can be done twice a year.' },
      { q: 'Can you combine garden maintenance with lawn mowing?', a: 'Yes, and most clients do. Mowing, edging, hedging and bed work are done in the same visit so the whole property is finished together.' },
      { q: 'Do you do end-of-lease garden clean-ups?', a: 'Yes. We bring overgrown rental gardens back to a handover standard, including mowing, edging, weeding, hedging and rubbish removal, across the South-East corridor.' }
    ],
    related: ['lawn-mowing', 'turf-installation', 'reticulation'],
    suburbs: ['Canning Vale', 'Thornlie', 'Southern River', 'Huntingdale', 'Gosnells', 'Kelmscott', 'Armadale', 'Seville Grove', 'Byford', 'Baldivis']
  },
  {
    slug: 'turf-installation', nav: 'Turf & Lawn Installation', icon: 'turf',
    short: 'New lawns from site prep and levelling to turf supply and laying, including artificial turf removal and mini loader earthworks.',
    title: 'Lawn Installation Perth – New Turf | In The Mow',
    h1: 'New Lawn Installation Perth — Turf Supply, Site Prep & Levelling',
    description: 'New lawn installation Perth: turf supply & laying, site prep, levelling, artificial turf removal and retic for new builds and renovations, Byford to Baldivis.',
    keyword: 'Lawn Installation Perth', schemaType: 'Turf and lawn installation service',
    hero: { img: 'landscape-installation', alt: 'Freshly laid turf rolls on a prepared base in a new-build front yard in Baldivis WA' },
    lead: 'A new lawn only looks good for years if the ground underneath is right. We remove the old surface, level and prepare the soil, lay quality WA turf and connect the retic so it establishes properly.',
    intro: [
      "Lawn installation Perth builders, renovators and new homeowners book with In The Mow Lawncare covers the whole job, not just the rolls of turf. We strip old lawn or artificial turf, excavate and level with our mini loader, bring in soil and amendments, lay the turf and set up the reticulation, then come back to mow it once it has knitted in.",
      "We install new lawns across the Byford growth corridor (Byford, Hilbert, Haynes, Cardup, Wandi), Baldivis, Secret Harbour and the Rockingham coast, Treeby, Hammond Park and Wellard, and across Perth's South-East to Canning Vale."
    ],
    sections: [
      { h2: 'Site Preparation, Excavation & Levelling', img: 'landscape-design', alt: 'Front yard excavated and prepared for new turf installation at a new build in Hilbert WA', paras: ['Most failed lawns fail at the base: uneven sand, builder rubble, hydrophobic soil and no retic. We cut out the old surface, remove rubble, bring the levels right for drainage, add soil conditioner and wetting agent, and compact and screed the base before a single roll goes down.'], bullets: ['Old lawn and artificial turf removal', 'Excavation, levelling and grading with mini loader and bobcat', 'Soil supply, conditioning and top dressing', 'Trenching for reticulation and drainage', 'Garden bed and soft landscaping prep'] },
      { h2: 'Turf Supply & Laying', img: 'residential-garden-maintenance', alt: 'New kikuyu lawn established in a backyard with freshly mulched garden beds in Byford WA', paras: ['We supply and lay turf suited to WA conditions, usually Sir Walter buffalo, Eureka kikuyu or Wintergreen couch depending on sun, traffic and how much maintenance you want. Rolls are laid tight, rolled and watered in, and we set the controller for establishment watering.'], bullets: ['Buffalo, kikuyu and couch turf supply and laying', 'Re-turfing of dead or patchy lawns', 'Lawns for new builds, renovations and verges', 'Reticulation installed or extended with the new lawn', 'Establishment care and first mows available'] },
      { h2: 'Artificial Turf Removal & Replacement', img: 'img-5', alt: 'Backyard artificial turf in Perth\'s South-East ready for removal and replacement with natural lawn', paras: ['Tired artificial turf that holds heat and smell can be lifted and replaced with real lawn. We remove the synthetic surface and base, rebuild the soil profile, install retic and lay new turf, or install a fresh synthetic surface if that suits the space better.'], bullets: [] }
    ],
    gallery: [
      { img: 'gen-5', gen: true, alt: 'Mini loader levelling sand for a new lawn in a backyard in Perth\'s South-East' },
      { img: 'img-4', alt: 'Newly established front lawn and young trees at a home in Wandi WA' },
      { img: 'after-1b', alt: 'Completed front yard landscaping with mulched beds and stepping stones in Byford WA' }
    ],
    faqs: [
      { q: 'How much does lawn installation cost in Perth?', a: 'The main variables are the area, how much removal and levelling is needed, the turf variety and whether reticulation is included. We measure the site, explain the options and give a fixed quote for the complete job.' },
      { q: 'Which turf is best for Perth?', a: 'Sir Walter buffalo handles shade and looks lush; kikuyu is tough and quick to repair for kids and dogs; couch gives a fine, low lawn in full sun. We recommend based on your site and how much maintenance you want.' },
      { q: 'When is the best time to lay turf in Perth?', a: 'Autumn and spring are ideal because the turf roots in before extreme heat or cold. Turf can be laid year-round if the reticulation is set up for establishment watering.' },
      { q: 'Do you remove old or artificial turf first?', a: 'Yes. We strip the old lawn or synthetic turf, dispose of it and rebuild the base so the new lawn has a proper soil profile to root into.' },
      { q: 'Can you install the reticulation with the new lawn?', a: 'Yes. Turf and retic are usually done as one job so pipework, head spacing and controller run times suit the new lawn from day one.' }
    ],
    related: ['reticulation', 'lawn-renovation', 'garden-maintenance'],
    suburbs: ['Byford', 'Hilbert', 'Haynes', 'Wandi', 'Baldivis', 'Secret Harbour', 'Treeby', 'Hammond Park', 'Wellard', 'Canning Vale']
  },
  {
    slug: 'lawn-renovation', nav: 'Lawn Health & Renovation', icon: 'aerator',
    short: 'Vertimowing, coring and aeration, fertilising, weed and grub control, wetting agents and full renovation programs.',
    title: 'Vertimowing & Lawn Renovation Perth | In The Mow',
    h1: 'Vertimowing, Coring & Lawn Renovation Perth — Fertilising & Weed Control',
    description: 'Vertimowing Perth, coring & aeration, fertilising, weed and grub control and full lawn renovation programs from Canning Vale to Mandurah. Free quote.',
    keyword: 'Vertimowing Perth', schemaType: 'Lawn health and renovation service',
    hero: { img: 'lawn-aeration-vertimowing', alt: 'Lawn freshly cored with soil plugs on the surface after aeration in Southern River WA' },
    lead: 'Thatchy, patchy, spongy or full of weeds? A proper renovation resets the lawn: vertimow the thatch out, core the compaction, feed it and fix the watering, then watch it come back thick and green.',
    intro: [
      "Vertimowing Perth lawns is the single biggest fix for a couch or kikuyu lawn that has gone spongy and brown underneath. The vertimower cuts the dead thatch layer out so water, air and fertiliser reach the soil again. In The Mow Lawncare runs vertimowing, coring and full renovation programs across Canning Vale, Armadale, Byford, Cockburn, Rockingham, Baldivis, Secret Harbour and Mandurah.",
      "We also offer the ongoing lawn health work that keeps a renovated lawn in shape: seasonal fertilising, soil conditioning and wetting agents for Perth's water-repellent sand, selective weed control, and treatment for lawn grubs and other pests."
    ],
    sections: [
      { h2: 'Vertimowing & Thatch Removal', img: 'gen-6', gen: true, alt: 'Vertimower lifting dead thatch from a couch lawn in Perth\'s South-East in spring', paras: ['Vertimowing (scarifying) slices vertically through the lawn and lifts out the thatch. It looks drastic for a week or two, then the lawn thickens up far better than before. Best done in spring or early autumn on couch, kikuyu and some buffalo lawns, followed by a feed and consistent watering.'], bullets: ['Thatch removal on couch, kikuyu and buffalo lawns', 'All thatch raked, collected and removed from site', 'Follow-up fertilising and wetting agent', 'Top dressing to level low spots where needed'] },
      { h2: 'Coring, Aeration & Soil Health', img: 'before-2', alt: 'Scarified lawn with reticulation running during a lawn renovation in Perth\'s South-East', paras: ['Compacted, hard or waterlogged lawns need air. Core aeration pulls plugs of soil out so roots can breathe and water gets in, and it is the right fix for lawns that take a hammering from kids, dogs and summer. Pair it with soil conditioner and a wetting agent on Perth sand and the difference shows within weeks.'], bullets: ['Core aeration and plug removal', 'Wetting agents for water-repellent sandy soil', 'Soil conditioning and organic amendments', 'Reticulation check so the renovated lawn is watered evenly'] },
      { h2: 'Fertilising, Weed & Pest Control', img: 'gen-8', gen: true, alt: 'Granular fertiliser being spread across a large lawn on a rural block near Byford WA', paras: ['A lawn that is fed on a seasonal program crowds out weeds on its own. We fertilise to suit your grass type and the season, apply selective herbicides for broadleaf weeds and winter grass, use non-selective control where a bed or verge needs a clean start, and treat African black beetle, lawn armyworm and other grubs before they strip the lawn.'], bullets: ['Seasonal fertilising programs', 'Selective and non-selective weed control', 'Lawn grub, beetle and pest treatment', 'Full renovation packages combining all of the above'] }
    ],
    gallery: [
      { img: 'after-2', alt: 'Thick green lawn after renovation, fertilising and reticulation repairs in Perth\'s South-East' },
      { img: 'lawn-mowing-byford', alt: 'Backyard lawn being renovated and levelled behind a Colorbond fence in Byford WA' },
      { img: 'regular-lawn-mowing', alt: 'Healthy striped lawn maintained on a seasonal fertilising program in Byford WA' }
    ],
    faqs: [
      { q: 'How much does vertimowing cost in Perth?', a: 'It depends on lawn size, how thick the thatch is and whether you add coring, fertilising or top dressing as a package. We quote per lawn after seeing it or from photos and a rough size.' },
      { q: 'When should I vertimow my lawn in Perth?', a: 'Spring (September to November) is ideal, with early autumn a good second option. Avoid the middle of summer and winter, when the lawn recovers too slowly.' },
      { q: 'Will my lawn look dead after vertimowing?', a: 'It will look thin and brown for one to three weeks, then regrow thicker than before. Fertiliser, wetting agent and regular watering speed that up, and we set your retic accordingly.' },
      { q: 'What is the difference between coring and vertimowing?', a: 'Vertimowing removes thatch above the soil; coring pulls plugs out of the soil to relieve compaction. Many lawns benefit from both in the same renovation.' },
      { q: 'Can you fix lawn grubs and weeds as part of a renovation?', a: 'Yes. Pest treatment and selective weed control are built into our renovation programs so the lawn does not come back with the same problems.' }
    ],
    related: ['lawn-mowing', 'reticulation', 'turf-installation'],
    suburbs: ['Canning Vale', 'Southern River', 'Armadale', 'Byford', 'Jandakot', 'Baldivis', 'Secret Harbour', 'Mandurah', 'Halls Head', 'Lakelands']
  }
];
