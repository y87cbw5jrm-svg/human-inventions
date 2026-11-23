/*
 * Human Inventions dataset: how many people used each technology, over 3.3 million years.
 *
 * Every curve is the estimated share (0–100) of all people alive at the time who
 * used the technology, or lived in a community that did. Where a line measures
 * something narrower (households owning a device, women using contraception,
 * people taking a flight in a year) its description says so.
 *
 * Fields
 *   id     stable slug, also used in the page URL (#iron)
 *   name   display name
 *   cat    category id (see CATS)
 *   first  year of the earliest accepted evidence (negative = BCE)
 *   where  site or region of that evidence
 *   q      confidence: 1 measured (surveys and statistics for recent decades),
 *          2 estimated (historians' and agencies' estimates),
 *          3 reconstructed (inferred from archaeology; the shape is indicative)
 *   key    1 = shown in the "Milestones" view
 *   kind   'event' for discoveries and firsts with no usage line (written with ev(...))
 *   shift  (added below) how it changed the way people think or live: a "mental shift"
 *   by     (added below) which human species made the earliest evidence
 *   pts    [year, percent] anchor points, years strictly increasing. The first
 *          point is the estimated origin (0%). Curves are drawn with monotone
 *          cubic interpolation between anchors.
 *   desc   one or two sentences
 *
 * A(n) converts "n years ago" to a calendar year, so deep-time entries can be
 * written the way archaeologists report them.
 */
(function () {
  var NOW = 2026.9; // data runs to late 2026
  function A(n) { return NOW - n; }

  var CATS = [
    { id: 'tools', name: 'Tools & materials' },
    { id: 'energy', name: 'Fire & energy' },
    { id: 'shelter', name: 'Shelter & water' },
    { id: 'food', name: 'Food & farming' },
    { id: 'body', name: 'Body, mind & health' },
    { id: 'move', name: 'Transport' },
    { id: 'ideas', name: 'Culture & society' },
    { id: 'electric', name: 'Electric & digital' }
  ];

  var T = [];
  function t(id, name, cat, first, where, q, key, pts, desc) {
    T.push({ id: id, name: name, cat: cat, first: first, where: where, q: q, key: !!key, pts: pts, desc: desc });
  }
  // a discovery or first with a date but no usage line
  function ev(id, name, cat, first, where, key, desc) {
    T.push({ id: id, name: name, cat: cat, first: first, where: where, q: 1, key: !!key, kind: 'event', pts: null, desc: desc });
  }

  /* ---------------- Tools & materials ---------------- */

  t('stone-tools', 'Stone tools', 'tools', A(3300000), 'Lomekwi 3, Kenya', 3, 1,
    [[A(3300000), 0], [A(3000000), 2], [A(2600000), 15], [A(2000000), 70], [A(1700000), 95], [A(1000000), 100],
     [-3500, 100], [-3000, 96], [-2000, 88], [-1000, 72], [-500, 48], [1, 22], [500, 15], [1000, 12], [1500, 10],
     [1600, 4], [1700, 2.5], [1800, 1.5], [1900, 0.3], [1950, 0.05], [2025, 0.01]],
    'Sharp flakes struck from stone cores. The oldest known, at Lomekwi in Kenya, are 3.3 million years old, older than our genus. The line falls as metal took over everyday cutting; the last stone-tool economies ended in New Guinea in the 20th century.');

  t('hand-axes', 'Hand axes', 'tools', A(1760000), 'Kokiselei, Kenya', 3, 1,
    [[A(1760000), 0], [A(1600000), 15], [A(1400000), 40], [A(1000000), 65], [A(700000), 70], [A(500000), 70],
     [A(300000), 50], [A(200000), 25], [A(130000), 6], [A(60000), 1], [A(30000), 0]],
    'Teardrop-shaped Acheulean bifaces, flaked on both faces. Made for about 1.5 million years across Africa, Europe and South Asia, the longest-lived tool design in history.');

  t('spears', 'Hunting spears', 'tools', A(500000), 'Kathu Pan, South Africa', 3, 0,
    [[A(500000), 0], [A(400000), 10], [A(300000), 30], [A(200000), 60], [A(100000), 90], [A(50000), 98],
     [1, 95], [1000, 90], [1500, 85], [1700, 60], [1800, 40], [1900, 15], [1950, 5], [2025, 2]],
    'Stone points bound onto wooden shafts at Kathu Pan about 500,000 years ago are the oldest hafted weapons; complete wooden throwing spears survive from Schöningen, Germany. Line: spears as a main weapon for hunting or war.');

  t('levallois', 'Prepared-core tools', 'tools', A(400000), 'East Africa and the Caucasus', 3, 0,
    [[A(450000), 0], [A(350000), 10], [A(250000), 45], [A(150000), 80], [A(80000), 85], [A(50000), 70],
     [A(35000), 40], [A(20000), 10], [A(12000), 2], [-3000, 0]],
    'The Levallois method: shaping a core so that one blow releases a flake of planned size and shape. The signature technique of Neanderthals and of early Homo sapiens in Africa.');

  t('blades', 'Blades & microliths', 'tools', A(71000), 'Pinnacle Point, South Africa', 3, 0,
    [[A(75000), 0], [A(60000), 5], [A(45000), 30], [A(35000), 60], [A(20000), 85], [A(10000), 92],
     [-5000, 80], [-2000, 60], [-500, 30], [1, 15], [1000, 8], [1500, 6], [1800, 1], [1900, 0.2], [2025, 0]],
    'Long thin blades and tiny geometric flakes, set in rows into handles to make knives, sickles and arrow tips. Microliths appear at Pinnacle Point 71,000 years ago and became the standard kit of the last Ice Age.');

  t('bone-tools', 'Bone & antler tools', 'tools', A(1500000), 'Olduvai Gorge, Tanzania', 3, 0,
    [[A(1500000), 0], [A(1000000), 3], [A(500000), 8], [A(200000), 15], [A(90000), 30], [A(50000), 60],
     [A(30000), 85], [A(10000), 90], [1, 70], [1000, 55], [1500, 45], [1800, 30], [1900, 15], [1950, 5], [2025, 2]],
    'Bone flaked like stone at Olduvai Gorge is 1.5 million years old. Barbed bone harpoons from Katanda, Congo, about 90,000 years old, mark routine use; awls, needles and fishhooks followed.');

  t('rope', 'Rope & string', 'tools', A(50000), 'Abri du Maras, France', 3, 0,
    [[A(150000), 0], [A(100000), 10], [A(60000), 35], [A(40000), 65], [A(25000), 90], [A(15000), 98], [2025, 100]],
    'A three-ply cord twisted by Neanderthals at Abri du Maras, France, is about 50,000 years old. Shell beads pierced for stringing more than 100,000 years earlier imply that string is far older.');

  t('ground-stone', 'Polished stone axes', 'tools', A(49000), "Carpenter's Gap, Australia", 3, 0,
    [[A(49000), 0], [A(35000), 2], [A(20000), 4], [-10000, 12], [-7000, 35], [-5000, 60], [-3000, 75], [-2000, 70],
     [-1000, 55], [-500, 40], [1, 22], [500, 15], [1000, 12], [1500, 10], [1700, 3], [1900, 0.5], [1960, 0.05], [2025, 0]],
    'Axes and adzes shaped by grinding rather than flaking, tough enough to fell forests. The oldest edge-ground axes, from northern Australia, are 44,000 to 49,000 years old; they became the farmer’s tool for clearing land.');

  t('bow', 'Bow & arrow', 'tools', A(64000), 'Sibudu Cave, South Africa', 3, 1,
    [[A(64000), 0], [A(50000), 2], [A(40000), 6], [A(25000), 20], [A(12000), 50], [-5000, 75], [1, 85],
     [1000, 85], [1500, 80], [1650, 60], [1750, 40], [1850, 20], [1900, 8], [1950, 3], [2025, 1]],
    'Tiny stone points from Sibudu Cave, about 64,000 years old, carry the impact damage and glue residue of arrow tips. Bows let hunters kill from a distance and reached every inhabited continent except mainland Australia.');

  t('atlatl', 'Spear-thrower', 'tools', A(17500), 'Combe-Saunière, France', 3, 0,
    [[A(30000), 0], [A(20000), 10], [A(15000), 20], [-8000, 25], [-5000, 20], [-1000, 10], [1, 6], [500, 4],
     [1500, 2], [1800, 0.5], [1900, 0.1], [2025, 0]],
    'A hooked stick that adds leverage to a thrown dart. An antler hook from Combe-Saunière is about 17,500 years old; it was used later as the atlatl of the Americas and the woomera of Australia.');

  t('fired-clay', 'Fired clay', 'tools', A(30000), 'Dolní Věstonice, Czechia', 3, 0,
    [[A(31000), 0], [A(25000), 0.5], [A(20000), 2], [A(15000), 6], [-10000, 10], [-8000, 20], [-6000, 38],
     [-4000, 58], [-2000, 75], [1, 85], [1000, 90], [1500, 92], [1900, 97], [2025, 99]],
    'Clay figurines such as the Venus of Dolní Věstonice were fired about 30,000 years ago, ten thousand years before anyone made a pot. Fired clay later gave pots, bricks, tiles and writing tablets.');

  t('pottery', 'Pottery', 'tools', A(20000), 'Xianrendong Cave, China', 3, 1,
    [[A(20000), 0], [A(16000), 2], [-10000, 6], [-8000, 15], [-6500, 30], [-5000, 50], [-3000, 70], [-1000, 85],
     [1, 90], [1000, 92], [1500, 93], [1900, 97], [2025, 99]],
    'Cooking pots from Xianrendong Cave, China, are about 20,000 years old. Pottery was invented separately in East Asia, North Africa and the Americas, often by hunter-gatherers before farming.');

  t('potters-wheel', 'Potter’s wheel', 'tools', -4500, 'Mesopotamia', 3, 0,
    [[-4500, 0], [-3500, 3], [-2500, 15], [-1500, 30], [-500, 45], [1, 55], [1000, 60], [1500, 62], [1800, 68],
     [1900, 75], [1950, 80], [2025, 85]],
    'A slow turntable appears in Mesopotamia around 4500 BCE and a fast wheel by 3500 BCE, possibly the ancestor of the vehicle wheel. It was unknown in the Americas before 1500. Line: people using wheel-thrown or factory-made pots.');

  t('copper', 'Copper', 'tools', -8700, 'Near East (Shanidar, Çayönü)', 3, 0,
    [[-8700, 0], [-6000, 0.5], [-5000, 1.5], [-4000, 6], [-3000, 15], [-2000, 35], [-1000, 55], [1, 70],
     [1000, 80], [1500, 85], [1800, 92], [1900, 96], [2025, 99]],
    'Native copper was hammered into beads and pendants in the Near East by about 8700 BCE; smelting from ore began around 5000 BCE at Belovode, Serbia, and in Iran. Today copper carries almost all electricity.');

  t('bronze', 'Bronze', 'tools', -3300, 'Mesopotamia and Anatolia', 3, 1,
    [[-4000, 0], [-3300, 1], [-3000, 4], [-2500, 12], [-2000, 25], [-1500, 40], [-1200, 48], [-1000, 45],
     [-800, 38], [-500, 25], [-200, 12], [1, 6], [500, 4], [1000, 4], [1450, 3], [1550, 0.5], [1700, 0]],
    'Copper alloyed with tin: harder than copper and easy to cast. Tin bronze spread from the Near East after 3300 BCE and gave the Bronze Age its name, until cheaper iron replaced it. Line: bronze as the main metal for tools and weapons.');

  t('iron', 'Iron', 'tools', -1800, 'Anatolia', 3, 1,
    [[-1800, 0], [-1200, 3], [-1000, 12], [-800, 25], [-600, 40], [-400, 55], [-200, 65], [1, 72], [300, 78],
     [500, 82], [1000, 86], [1500, 89], [1600, 93], [1800, 97], [1900, 99.5], [2025, 100]],
    'Smelted iron is harder to make than bronze, but its ore is found almost everywhere. It spread from Anatolia after about 1200 BCE and may have been invented separately in West Africa. The Americas had no iron-working before 1492, apart from a short-lived Norse outpost and some use of meteorite iron.');

  t('steel', 'Mass-produced steel', 'tools', 1856, 'England', 3, 0,
    [[1856, 0], [1870, 3], [1880, 8], [1900, 20], [1920, 35], [1950, 55], [1970, 75], [1990, 88], [2000, 93], [2025, 99]],
    'Bessemer’s converter (1856) made steel cheap enough for rails, ships, skyscrapers and machines. Line: people in economies built on industrial steel.');

  t('glass', 'Glass', 'tools', -2500, 'Mesopotamia', 3, 0,
    [[-2500, 0], [-1500, 2], [-500, 4], [1, 10], [500, 12], [1000, 15], [1500, 20], [1700, 28], [1800, 35],
     [1900, 55], [1950, 75], [2000, 92], [2025, 97]],
    'Glass beads appear in Mesopotamia around 2500 BCE. Glassblowing, invented in the Levant around 50 BCE, made vessels cheap; window glass followed. Line: people using glass vessels or windows.');

  t('firearms', 'Gunpowder weapons', 'tools', 900, 'China', 3, 0,
    [[850, 0], [1000, 5], [1200, 20], [1300, 30], [1400, 45], [1500, 60], [1600, 75], [1700, 85], [1800, 92],
     [1900, 99], [2025, 100]],
    'Chinese alchemists found gunpowder in the 800s. Fire lances, then metal guns (the oldest dated one was cast in 1288) spread across Eurasia within a few centuries. Line: people living in states that use them.');

  t('plastics', 'Plastics', 'tools', 1907, 'Yonkers, New York', 3, 0,
    [[1907, 0], [1930, 2], [1950, 10], [1960, 25], [1970, 45], [1980, 62], [1990, 78], [2000, 90], [2010, 96], [2025, 99]],
    'Bakelite, the first fully synthetic plastic, was made in 1907. After 1950 plastics spread into packaging, clothing and almost every household object.');

  t('pulleys', 'Pulleys & cranes', 'tools', -1900, 'Egypt and Mesopotamia', 3, 0,
    [[-2000, 0], [-1500, 2], [-1000, 4], [-500, 8], [1, 25], [1000, 35], [1500, 45], [1800, 60], [1900, 80], [1950, 90], [2025, 98]],
    'The earliest signs of pulleys come from Egypt and Mesopotamia in the early 2nd millennium BCE, and Greek builders lifted stone with pulley cranes by about 515 BCE. Line: people in societies that build and lift with them.');

  t('nuclear-weapons', 'Atomic bomb', 'tools', 1945, 'New Mexico, USA', 2, 1,
    [[1945, 0], [1945.6, 6], [1949, 13], [1952, 14.5], [1960, 15.5], [1964, 37], [1974, 52], [1990, 50], [1998, 50], [2006, 49], [2025, 46]],
    'The first atomic bomb was tested in New Mexico in July 1945 and two were dropped on Japan weeks later. Line: people living in a country that has tested nuclear weapons: the USA, USSR, UK, France, China, India, Pakistan and North Korea.');

  ev('telescope', 'Telescope', 'tools', 1608, 'Middelburg, Netherlands', 0,
    'Hans Lipperhey sought a patent for a spyglass in 1608. Within two years Galileo turned one on the sky and saw moons circling Jupiter and the phases of Venus, evidence that Earth is not the center of everything.');

  ev('microscope', 'Microscope', 'tools', 1620, 'Netherlands', 0,
    'Compound microscopes appeared around 1620. Robert Hooke named the cell in 1665 and Antonie van Leeuwenhoek saw bacteria in 1676: a hidden living world that later explained infection.');

  /* ---------------- Fire & energy ---------------- */

  t('fire', 'Controlled fire', 'energy', A(1000000), 'Wonderwerk Cave, South Africa', 3, 1,
    [[A(1000000), 0], [A(800000), 3], [A(600000), 7], [A(400000), 22], [A(300000), 40], [A(200000), 62],
     [A(100000), 85], [A(50000), 97], [A(20000), 100], [2025, 100]],
    'Burned bone and plant ash deep inside Wonderwerk Cave show fire use about a million years ago. Hearths are routine in Europe and the Levant by 400,000 years ago and universal by the last Ice Age.');

  t('fire-making', 'Making fire', 'energy', A(400000), 'Barnham, England', 3, 0,
    [[A(400000), 0], [A(300000), 3], [A(200000), 10], [A(100000), 35], [A(50000), 70], [A(30000), 90], [-8000, 99], [2025, 100]],
    'Starting fire at will instead of carrying embers. Heated clay and pyrite at Barnham suggest people struck sparks from flint and pyrite about 400,000 years ago, though some researchers doubt it proves fire-making. Friction matches arrived in 1826.');

  t('lamps', 'Lamps & candles', 'energy', A(17000), 'Lascaux, France', 3, 0,
    [[A(30000), 0], [-10000, 3], [-5000, 10], [-3000, 25], [-1000, 40], [1, 50], [1000, 58], [1500, 65], [1800, 72],
     [1900, 80], [1950, 72], [1970, 52], [1990, 28], [2000, 21], [2010, 16], [2020, 9], [2025, 7]],
    'Stone lamps burning animal fat lit the painted caves of Lascaux 17,000 years ago. Oil lamps, candles and, from the 1850s, kerosene were the main light after dark until electricity. Line: flame as the main source of light at night.');

  t('water-wheel', 'Water wheel', 'energy', -250, 'Eastern Mediterranean', 3, 0,
    [[-250, 0], [1, 2], [300, 6], [600, 10], [900, 16], [1100, 24], [1300, 30], [1500, 33], [1700, 36], [1800, 38],
     [1850, 36], [1900, 28], [1950, 12], [1980, 5], [2025, 2]],
    'Water wheels appear in the Greek world in the 200s BCE; by 1086 England alone had more than 5,000 water mills. They ground grain and drove saws, bellows and the first textile mills; turbines still make hydroelectricity. Line: people whose grain was milled by water power.');

  t('windmill', 'Windmill', 'energy', 900, 'Sistan, Persia', 3, 0,
    [[800, 0], [900, 0.5], [1100, 1.5], [1200, 4], [1400, 8], [1600, 11], [1800, 13], [1850, 12], [1900, 8], [1950, 2], [2025, 0.5]],
    'Vertical-axis windmills ground grain in eastern Persia by the 900s; post mills appear in Europe in the 1180s, and the Dutch used them to drain land. Line: people whose grain was milled by wind. Modern wind turbines are their descendants.');

  t('steam', 'Steam engine', 'energy', 1712, 'Dudley, England', 3, 1,
    [[1712, 0], [1750, 0.2], [1780, 0.5], [1800, 1.5], [1830, 4], [1850, 10], [1870, 20], [1900, 38], [1920, 50],
     [1950, 48], [1970, 25], [1990, 8], [2010, 3], [2025, 1.5]],
    'Newcomen’s 1712 engine pumped water from mines; Watt’s separate condenser (1776) made steam practical for factories, railways and ships. Line: people in economies running on steam power, until diesel and electric motors replaced it.');

  t('combustion-engine', 'Combustion engine', 'energy', 1860, 'Paris', 3, 0,
    [[1860, 0], [1880, 0.5], [1900, 4], [1920, 18], [1950, 45], [1970, 72], [1990, 88], [2010, 96], [2025, 98]],
    'Lenoir’s gas engine (1860), Otto’s four-stroke (1876) and Diesel’s engine (1893) put compact power into cars, ships, tractors, pumps and generators. Line: people in economies that run on them.');

  t('coal', 'Coal', 'energy', 1000, 'Song China (large-scale use)', 2, 0,
    [[1000, 0], [1700, 0.5], [1800, 1.7], [1850, 7], [1870, 15], [1900, 47], [1915, 50], [1950, 44], [1970, 29], [1990, 25], [2000, 23], [2011, 29], [2024, 26]],
    'Coal was burned in China in ancient times; by about 1000 CE it fed the iron works of Song China, and from the 1700s Britain’s industrial revolution. It supplied about half the world’s energy around 1900 and about a quarter today. Line: share of world energy, not of people.');

  t('oil', 'Oil', 'energy', 1859, 'Pennsylvania, USA', 2, 0,
    [[1859, 0], [1880, 0.3], [1900, 2.5], [1920, 6], [1940, 13], [1950, 18], [1960, 27], [1973, 46], [1985, 37], [2000, 37], [2010, 33], [2024, 30]],
    'Drake’s well in Pennsylvania (1859) started the oil age, first for kerosene lamps, then for gasoline, diesel and plastics. Oil supplied almost half the world’s energy at its 1973 peak and about 30% today; natural gas adds about a quarter. Line: share of world energy, not of people.');

  t('electricity', 'Electricity', 'energy', 1882, 'London and New York', 1, 1,
    [[1882, 0], [1900, 1], [1910, 2], [1920, 4], [1930, 7], [1940, 11], [1950, 20], [1960, 30], [1970, 45], [1980, 58],
     [1990, 71], [2000, 78], [2010, 83], [2015, 87], [2020, 90.5], [2023, 91.4], [2025, 92]],
    'The first public power stations opened in London and New York in 1882. About 92% of people now have electricity at home; most of the roughly 730 million without it live in Sub-Saharan Africa.');

  t('nuclear', 'Nuclear power', 'energy', 1954, 'Obninsk, USSR', 2, 0,
    [[1954, 0], [1958, 0.5], [1962, 1.5], [1966, 3], [1969, 4], [1970, 25], [1975, 33], [1980, 35], [1990, 37],
     [1994, 58], [2000, 58], [2010, 58], [2025, 57]],
    'Line: people living in a country where nuclear plants make at least 1% of electricity. The first grid reactor ran at Obninsk in 1954; the jumps are India (1970) and China (1994).');

  t('wind', 'Wind power', 'energy', 1980, 'Denmark and California', 2, 0,
    [[1980, 0], [1990, 0.1], [1995, 0.2], [2000, 2], [2005, 4], [2006, 21], [2008, 26], [2010, 48], [2015, 60],
     [2020, 68], [2025, 72]],
    'Line: people living in a country where wind turbines make at least 1% of electricity. Modern wind farms began around 1980 in Denmark and California; the jumps are India (2006) and China (2010).');

  t('solar', 'Solar power', 'energy', 1954, 'Bell Labs, USA', 2, 0,
    [[1954, 0], [2000, 0.01], [2008, 0.5], [2010, 1.2], [2012, 3], [2014, 6], [2016, 42], [2018, 55], [2020, 70],
     [2022, 80], [2025, 86]],
    'Line: people living in a country where solar panels make at least 1% of electricity. Bell Labs made the first practical silicon cell in 1954; panel prices fell about 90% in the 2010s.');

  /* ---------------- Shelter & water ---------------- */

  t('shelters', 'Built shelters', 'shelter', A(476000), 'Kalambo Falls, Zambia', 3, 0,
    [[A(476000), 0], [A(400000), 2], [A(300000), 8], [A(200000), 20], [A(100000), 40], [A(50000), 65],
     [A(20000), 85], [-8000, 95], [1, 98], [2025, 99]],
    'Two logs joined by a cut notch at Kalambo Falls, about 476,000 years old, are the oldest known woodwork, perhaps part of a platform or dwelling. Huts of branches, hides and mammoth bone followed.');

  t('villages', 'Year-round villages', 'shelter', -12500, 'Natufian Levant', 3, 0,
    [[-14000, 0], [-12500, 1], [-10000, 3], [-8000, 8], [-6000, 20], [-4000, 40], [-2000, 60], [1, 80], [1000, 85],
     [1500, 88], [1900, 95], [1950, 97], [2025, 99]],
    'Stone houses lived in all year round appear in the Levant around 12,500 BCE, before farming. Line: people living in permanent settlements rather than moving camp.');

  t('mud-brick', 'Mud brick', 'shelter', -9000, 'Jericho', 3, 0,
    [[-9000, 0], [-7000, 3], [-5000, 10], [-3000, 22], [-1000, 30], [1, 35], [1000, 38], [1500, 40], [1900, 38],
     [1950, 35], [2000, 25], [2025, 20]],
    'Hand-shaped, sun-dried mud bricks appear at Jericho around 9000 BCE. Earth walls are still among the commonest building materials. Line: people living in earthen homes.');

  t('fired-brick', 'Fired brick', 'shelter', -3500, 'Mesopotamia and the Indus Valley', 3, 0,
    [[-3500, 0], [-2500, 2], [-1000, 4], [1, 8], [1000, 12], [1500, 15], [1800, 18], [1900, 25], [1950, 30],
     [2000, 36], [2025, 38]],
    'Kiln-fired bricks, waterproof and strong, built the walls and drains of Mesopotamian and Indus cities. Line: people living in brick homes.');

  t('cities', 'Cities', 'shelter', -3800, 'Uruk, Mesopotamia', 1, 1,
    [[-4000, 0], [-3000, 0.5], [-2000, 1], [-1000, 2], [1, 5], [1000, 5], [1500, 5], [1800, 7], [1850, 8], [1900, 16],
     [1950, 29.6], [1960, 33.8], [1970, 36.6], [1980, 39.3], [1990, 43], [2000, 46.7], [2010, 51.7], [2020, 56.2], [2025, 58]],
    'Line: people living in towns and cities. Uruk held tens of thousands of people by 3000 BCE, yet for 5,000 years only about one person in twenty lived in a city. Humanity became majority-urban around 2007.');

  t('concrete', 'Concrete', 'shelter', -200, 'Rome', 3, 0,
    [[-200, 0], [1, 0.5], [150, 1.5], [400, 1], [600, 0.3], [1000, 0.1], [1824, 0.1], [1870, 0.5], [1900, 2],
     [1950, 12], [1970, 25], [1990, 38], [2000, 45], [2010, 55], [2025, 62]],
    'Romans built with volcanic-ash concrete from about 200 BCE; the recipe faded with the empire. Portland cement (1824) brought it back, and concrete is now the most used material after water. Line: people living in concrete buildings.');

  t('wells', 'Wells', 'shelter', -8400, 'Cyprus', 3, 1,
    [[-8400, 0], [-7000, 2], [-5000, 8], [-3000, 18], [-1000, 30], [1, 40], [1000, 45], [1500, 50], [1800, 55],
     [1900, 55], [1950, 50], [1970, 45], [1990, 38], [2010, 32], [2025, 28]],
    'Wells cut through rock in Cyprus about 10,400 years ago let farmers live away from rivers and springs. Line: people drawing household water from wells and boreholes, now falling as piped water spreads.');

  t('aqueducts', 'Aqueducts & qanats', 'shelter', -700, 'Assyria and Persia', 3, 0,
    [[-1000, 0], [-700, 0.5], [-300, 2], [1, 5], [200, 6], [500, 3], [1000, 4], [1500, 5], [1800, 6], [1870, 5],
     [1950, 2], [2025, 1]],
    'Long-distance water channels: qanats tapped groundwater under the Iranian plateau, and Assyrian, then Roman, aqueducts carried water to cities. Line: people supplied by them.');

  t('piped-water', 'Piped water at home', 'shelter', 1613, 'London', 2, 1,
    [[1613, 0], [1700, 0.1], [1800, 0.3], [1850, 1], [1900, 5], [1930, 10], [1950, 15], [1970, 25], [1990, 40],
     [2000, 48], [2010, 56], [2020, 64], [2025, 67]],
    'London’s New River (1613) carried water to houses through wooden mains. About two-thirds of people now have water piped to their home or yard.');

  t('sewers', 'Sewers', 'shelter', -2500, 'Indus Valley', 3, 0,
    [[-2600, 0], [-2500, 0.3], [-1900, 0.3], [-1700, 0.05], [-600, 0.05], [100, 1], [500, 0.2], [1500, 0.2], [1850, 1],
     [1880, 3], [1900, 5], [1950, 12], [1970, 18], [1990, 28], [2010, 36], [2025, 42]],
    'Mohenjo-daro had covered brick drains by 2500 BCE and Rome its Cloaca Maxima by about 600 BCE. London’s sewers, built in the 1860s after the “Great Stink”, set the modern pattern. Line: people whose homes connect to a sewer.');

  t('toilets', 'Flush toilets', 'shelter', 1596, 'England', 2, 0,
    [[1590, 0], [1775, 0.05], [1850, 0.5], [1900, 3], [1950, 12], [1970, 22], [1990, 38], [2000, 45], [2010, 52], [2020, 58], [2025, 61]],
    'John Harington built a flushing toilet for Elizabeth I in 1596; Alexander Cumming’s S-bend trap (1775) kept smells out and made it practical. Line: people using a flush or pour-flush toilet.');

  t('sanitation', 'Basic sanitation', 'shelter', 1842, 'England', 1, 0,
    [[1842, 0], [1880, 2], [1900, 5], [1930, 12], [1950, 20], [1970, 32], [1990, 45], [2000, 56], [2010, 66], [2015, 72], [2020, 78], [2024, 82]],
    'Edwin Chadwick’s 1842 report tied disease to filth and launched the sanitary movement. Line: people with at least a basic toilet that keeps waste away from human contact; about 1.5 billion still lack one.');

  t('clean-water', 'Treated drinking water', 'shelter', 1804, 'Paisley, Scotland', 1, 0,
    [[1804, 0], [1850, 0.3], [1900, 2], [1920, 5], [1950, 12], [1970, 25], [1990, 50], [2000, 61], [2015, 68], [2024, 74]],
    'Sand filters (Paisley, 1804) and chlorination (Jersey City, 1908) made tap water safe and ended urban cholera and typhoid. About 74% of people had safely managed drinking water in 2024; 2.1 billion still did not.');

  /* ---------------- Food & farming ---------------- */

  t('cooking', 'Cooking with fire', 'food', A(780000), 'Gesher Benot Ya’aqov, Israel', 3, 1,
    [[A(800000), 0], [A(600000), 3], [A(400000), 20], [A(300000), 40], [A(200000), 60], [A(100000), 85],
     [A(50000), 97], [A(20000), 100], [2025, 100]],
    'Fish cooked at Gesher Benot Ya’aqov about 780,000 years ago is the oldest evidence. Cooking makes food easier to chew and digest, and may have fuelled the growth of the human brain.');

  t('earth-ovens', 'Earth ovens & hot stones', 'food', A(30000), 'Pavlov, Czechia', 3, 0,
    [[A(35000), 0], [A(25000), 8], [A(15000), 25], [-8000, 40], [-5000, 45], [-3000, 35], [-1000, 20], [1, 15],
     [1000, 12], [1500, 10], [1900, 5], [2025, 2]],
    'Pits of heated stones to roast or steam food, and stone boiling in skin or bark containers, about 30,000 years ago. Earth ovens are still used for feasts across the Pacific (umu, hāngī). Line: as a main way of cooking.');

  t('querns', 'Grinding stones', 'food', A(32600), 'Grotta Paglicci, Italy', 3, 0,
    [[A(35000), 0], [A(25000), 3], [-12000, 10], [-8000, 25], [-5000, 50], [-2000, 75], [1, 85], [1000, 75],
     [1500, 65], [1800, 55], [1900, 40], [1950, 25], [2000, 10], [2025, 6]],
    'Oat starch on a grinding stone at Grotta Paglicci is 32,600 years old. Hand querns made flour in most farming homes until mills and factory flour took over.');

  t('pot-boiling', 'Boiling in pots', 'food', A(20000), 'Xianrendong Cave, China', 3, 0,
    [[A(20000), 0], [A(16000), 2], [-10000, 5], [-8000, 12], [-6500, 25], [-5000, 45], [-3000, 65], [-1000, 80],
     [1, 88], [1000, 92], [1500, 93], [1900, 97], [2025, 99]],
    'The first pots were cooking pots: soot and food residues coat sherds 20,000 years old. Boiling makes grains, roots and tough meat edible and gave us soups, porridge and stews.');

  t('bread', 'Bread & baking', 'food', -12400, 'Shubayqa 1, Jordan', 3, 0,
    [[-12400, 0], [-9000, 2], [-7000, 8], [-5000, 20], [-3000, 35], [-1000, 45], [1, 50], [1000, 55], [1500, 58],
     [1900, 62], [1950, 65], [2000, 72], [2025, 75]],
    'Charred flatbread crumbs at Shubayqa 1 were baked by foragers about 14,400 years ago, 4,000 years before farming. Clay and brick ovens followed. Line: people for whom baked bread is a staple.');

  t('fermentation', 'Fermentation & alcohol', 'food', -11000, 'Raqefet Cave, Israel', 3, 0,
    [[-11000, 0], [-7000, 5], [-5000, 20], [-3000, 45], [-1000, 65], [1, 75], [1000, 80], [1500, 85], [1900, 90], [2025, 95]],
    'Our ape ancestors evolved an enzyme that breaks down alcohol about 10 million years ago, probably from eating fallen, fermenting fruit. Residues in stone mortars at Raqefet Cave suggest beer brewing 13,000 years ago; wine (Georgia, 6000 BCE), cheese, yogurt, soy sauce and pickles followed.');

  t('salt', 'Salt making', 'food', -6050, 'Poiana Slatinei, Romania', 3, 0,
    [[-6050, 0], [-5000, 3], [-3000, 15], [-1000, 35], [1, 55], [1000, 65], [1500, 72], [1900, 90], [2025, 98]],
    'Brine was boiled to make salt at Poiana Slatinei around 6050 BCE. Salt let people cure meat and fish and store food through winters and journeys.');

  t('canning', 'Canned food', 'food', 1810, 'France and England', 3, 0,
    [[1810, 0], [1850, 0.5], [1880, 2], [1900, 5], [1920, 10], [1950, 20], [1970, 35], [2000, 55], [2025, 65]],
    'Nicolas Appert sealed food in glass jars for Napoleon’s armies, and Peter Durand patented the tin can in 1810. Food could now be stored for years and shipped worldwide.');

  t('clean-cooking', 'Gas & electric stoves', 'food', 1826, 'England', 1, 0,
    [[1826, 0], [1850, 0.1], [1880, 0.5], [1900, 1.5], [1920, 3], [1940, 6], [1950, 9], [1960, 13], [1970, 18],
     [1980, 26], [1990, 35], [2000, 50], [2010, 59], [2015, 65], [2020, 71], [2025, 75]],
    'James Sharp patented a gas stove in 1826. About three-quarters of people now cook with gas, electricity or other clean fuels; some 2 billion still cook over wood, charcoal or dung.');

  t('farming', 'Farming', 'food', -9500, 'Fertile Crescent', 3, 1,
    [[-10000, 0], [-9000, 1], [-8000, 4], [-7000, 10], [-6000, 20], [-5000, 35], [-4000, 50], [-3000, 65],
     [-2000, 78], [-1000, 88], [1, 95], [1000, 97], [1500, 98.5], [1800, 99.3], [1900, 99.7], [2025, 99.99]],
    'Cultivation of wild cereals began in the Fertile Crescent about 11,500 years ago; farming was invented independently in at least seven regions. Line: people living in farming societies rather than foraging ones.');

  t('dogs', 'Dogs', 'food', A(14200), 'Bonn-Oberkassel, Germany', 3, 0,
    [[A(25000), 0], [A(18000), 5], [A(14000), 20], [A(10000), 45], [-6000, 65], [-2000, 80], [1, 88], [1500, 92], [2025, 95]],
    'A dog buried with two people at Bonn-Oberkassel 14,200 years ago is the earliest clear case; DNA suggests wolves were tamed in Siberia around 23,000 years ago. Dogs helped hunt, herd and guard.');

  t('herding', 'Herding livestock', 'food', -8500, 'Zagros and Anatolia', 3, 1,
    [[-8500, 0], [-7000, 4], [-6000, 12], [-5000, 25], [-4000, 40], [-3000, 55], [-2000, 65], [-1000, 72], [1, 78],
     [1000, 80], [1500, 80], [1900, 85], [2025, 90]],
    'Sheep and goats were domesticated in the Near East around 8500 BCE, cattle and pigs soon after. Animals gave meat on demand, milk, wool, leather and pulling power.');

  t('cattle', 'Cattle', 'food', -8500, 'Upper Euphrates', 3, 0,
    [[-8500, 0], [-7000, 3], [-6000, 10], [-5000, 20], [-3000, 40], [-1000, 55], [1, 62], [1000, 65], [1500, 65], [1900, 72], [2025, 80]],
    'Wild aurochs were tamed in the upper Euphrates valley about 10,500 years ago, and humped zebu separately in the Indus valley. Cattle pulled plows and carts and gave milk, meat and leather. Line: people in cattle-keeping societies.');

  t('cats', 'Cats', 'food', A(9500), 'Shillourokambos, Cyprus', 3, 0,
    [[A(9500), 0], [-5000, 1], [-2000, 4], [-500, 8], [1, 15], [500, 25], [800, 35], [1000, 40], [1500, 55], [1800, 70], [1900, 80], [2025, 90]],
    'A cat buried beside a person in Cyprus 9,500 years ago is the oldest sign of tame cats, drawn to the mice in early farmers’ grain. Ancient DNA suggests house cats reached Europe only about 2,000 years ago and China by about 730 CE. Line: people in communities that keep cats.');

  t('dairy', 'Milk & dairy', 'food', -6500, 'Northwest Anatolia', 3, 0,
    [[-7000, 0], [-6000, 4], [-5000, 10], [-4000, 18], [-3000, 25], [-2000, 32], [-1000, 38], [1, 42], [1000, 45],
     [1500, 45], [1900, 50], [1950, 55], [1980, 65], [2000, 72], [2025, 80]],
    'Milk fats in cooking pots show dairying in Anatolia by about 6500 BCE, long before most adults could digest lactose; cheese and yogurt cut the lactose. Dairy is now eaten by most of humanity.');

  t('irrigation', 'Irrigation', 'food', -6000, 'Choga Mami, Iraq', 3, 0,
    [[-6000, 0], [-5000, 1], [-4000, 4], [-3000, 12], [-2000, 20], [-1000, 30], [1, 40], [1000, 45], [1500, 48],
     [1800, 50], [1900, 55], [1950, 60], [2000, 75], [2025, 80]],
    'Canals at Choga Mami watered fields around 6000 BCE. Irrigated land is a fifth of farmland but grows about 40% of the world’s food. Line: people in societies that rely partly on irrigated crops.');

  t('plow', 'Plow', 'food', -4000, 'Mesopotamia', 3, 0,
    [[-4500, 0], [-3500, 3], [-3000, 10], [-2000, 25], [-1000, 40], [1, 55], [1000, 60], [1500, 62], [1800, 68],
     [1900, 75], [1950, 80], [2025, 85]],
    'The ard, a pointed beam dragged by oxen, appears in Mesopotamia around 4000 BCE. One farmer could now till far more land. It never reached the pre-Columbian Americas.');

  t('chickens', 'Chickens', 'food', -1500, 'Central Thailand', 3, 0,
    [[-1600, 0], [-1000, 8], [-500, 25], [1, 40], [500, 50], [1000, 55], [1500, 65], [1800, 80], [1900, 88], [1950, 90], [2025, 95]],
    'Chickens were domesticated from red junglefowl in Southeast Asia around 1500 BCE, first for company and cockfighting; eating them and their eggs became common later.');

  t('fishing', 'Fishhooks & nets', 'food', A(23000), 'Sakitari Cave, Okinawa', 3, 0,
    [[A(25000), 0], [A(20000), 5], [A(15000), 12], [-8000, 30], [-5000, 50], [1, 65], [1000, 70], [1500, 72], [1900, 75], [2025, 80]],
    'Shell fishhooks from Sakitari Cave are about 23,000 years old, and tuna bones in East Timor show deep-sea fishing 42,000 years ago.');

  t('coffee', 'Coffee', 'food', 1450, 'Yemen', 3, 0,
    [[1450, 0], [1500, 0.5], [1600, 3], [1700, 6], [1800, 10], [1900, 15], [1950, 22], [2000, 32], [2025, 40]],
    'Sufi monks in Yemen drank coffee to stay awake for night prayers by the mid-1400s. Coffeehouses spread to Mecca, Istanbul (1550s), then London and Paris in the 1650s to 1670s. Line: rough share of people who drink coffee regularly.');

  t('fertilizer', 'Synthetic fertilizer', 'food', 1913, 'Oppau, Germany', 2, 1,
    [[1913, 0], [1920, 0.5], [1930, 1.5], [1940, 2.5], [1950, 4], [1960, 10], [1970, 20], [1980, 30], [1990, 37],
     [2000, 42], [2008, 48], [2015, 49], [2025, 50]],
    'The Haber–Bosch process, in production from 1913, turns nitrogen from the air into fertilizer. Line: people whose food depends on it, roughly half of humanity.');

  t('tractors', 'Tractors', 'food', 1892, 'Iowa, USA', 3, 0,
    [[1892, 0], [1910, 0.2], [1920, 1], [1930, 2.5], [1940, 4], [1950, 8], [1960, 14], [1970, 22], [1980, 30],
     [1990, 38], [2000, 48], [2010, 58], [2020, 66], [2025, 70]],
    'John Froelich built a working gasoline tractor in 1892; Ford’s cheap Fordson (1917) spread them. Line: people fed mostly by machine-worked farms.');

  t('hyv', 'High-yield seeds', 'food', 1962, 'Mexico and the Philippines', 3, 0,
    [[1960, 0], [1965, 2], [1970, 12], [1975, 20], [1980, 28], [1990, 40], [2000, 50], [2010, 58], [2025, 65]],
    'Semi-dwarf wheat bred in Mexico and IR8 rice from the Philippines (1966) roughly doubled yields across Asia and Latin America in the Green Revolution. Line: people fed mainly by modern varieties.');

  t('gm-crops', 'GM crops', 'food', 1994, 'USA', 2, 0,
    [[1994, 0], [1996, 6], [1997, 28], [2002, 46], [2010, 52], [2015, 57], [2025, 61]],
    'The Flavr Savr tomato (1994) was the first genetically engineered food sold; pest-resistant and herbicide-tolerant soy, maize and cotton followed in 1996. Line: people living in a country that grows GM crops; the jumps are China (1997) and India (2002), both for cotton.');

  /* ---------------- Body, mind & health ---------------- */

  t('clothing', 'Clothing', 'body', A(120000), 'Contrebandiers Cave, Morocco', 3, 1,
    [[A(170000), 0], [A(120000), 10], [A(80000), 30], [A(50000), 60], [A(30000), 85], [A(15000), 95], [1, 99], [2025, 100]],
    'Bone tools for scraping hides and furs at Contrebandiers Cave are about 120,000 years old. The genetics of clothing lice point to clothes between 83,000 and 170,000 years ago.');

  t('needles', 'Eyed needles', 'body', A(50000), 'Denisova Cave, Siberia', 3, 0,
    [[A(50000), 0], [A(40000), 5], [A(30000), 20], [A(20000), 40], [A(10000), 55], [-5000, 65], [1, 75], [1000, 80],
     [1500, 82], [1900, 92], [2025, 99]],
    'Bone needles with eyes, about 40,000 to 50,000 years old, allowed fitted, layered clothing, crucial for surviving the coldest parts of the Ice Age. Line: people wearing sewn, tailored clothes.');

  t('shoes', 'Shoes', 'body', A(40000), 'Tianyuan Cave, China', 3, 0,
    [[A(40000), 0], [A(30000), 5], [A(15000), 15], [-8000, 25], [-3000, 35], [1, 45], [1000, 50], [1500, 55], [1900, 62],
     [1950, 70], [2000, 82], [2025, 88]],
    'Toe bones from Tianyuan Cave show the slimmer toes of habitual shoe-wearers 40,000 years ago. The oldest surviving shoes are 10,000-year-old bark sandals from Fort Rock, Oregon.');

  t('weaving', 'Woven cloth', 'body', -7000, 'Nahal Hemar, Israel', 3, 0,
    [[-8000, 0], [-7000, 1], [-5000, 10], [-3000, 30], [-1000, 55], [1, 70], [1000, 78], [1500, 82], [1800, 88], [1900, 95], [2025, 99]],
    'Dyed flax fibers from Dzudzuana Cave, Georgia, 30,000 years old, show early string-making; woven linen from Nahal Hemar dates to about 7000 BCE. Looms then spread with farming.');

  t('spinning-wheel', 'Spinning wheel', 'body', 1000, 'China and the Islamic world', 3, 0,
    [[700, 0], [1000, 10], [1200, 25], [1300, 40], [1500, 50], [1700, 55], [1800, 58], [1850, 50], [1900, 35],
     [1950, 20], [2000, 6], [2025, 3]],
    'Far faster than a hand spindle, it appears in China and the Islamic world around 1000 CE and in Europe in the 1200s. Line: households spinning their own yarn on a wheel, until factory thread replaced them.');

  t('machine-cloth', 'Machine-made cloth', 'body', 1769, 'Lancashire, England', 3, 0,
    [[1769, 0], [1800, 1], [1820, 3], [1850, 8], [1880, 18], [1900, 30], [1930, 45], [1950, 60], [1970, 75], [2000, 92], [2025, 98]],
    'Arkwright’s water frame (1769) and the power loom started the Industrial Revolution in cotton. Line: people wearing mostly factory-made cloth.');

  t('sewing-machine', 'Sewing machine', 'body', 1846, 'USA', 3, 0,
    [[1846, 0], [1860, 0.3], [1880, 2], [1900, 5], [1920, 9], [1950, 15], [1970, 20], [1990, 20], [2010, 15], [2025, 12]],
    'Patented by Elias Howe in 1846 and sold widely by Singer from 1851, often on instalments. Line: households with a sewing machine.');

  t('synthetic-fibers', 'Synthetic fibers', 'body', 1935, 'Delaware, USA', 3, 0,
    [[1935, 0], [1940, 0.5], [1950, 3], [1960, 10], [1970, 28], [1980, 42], [1990, 55], [2000, 72], [2010, 85], [2025, 95]],
    'Nylon, made at DuPont in 1935, was followed by polyester (1941). Synthetics are now about two-thirds of all fiber produced. Line: people wearing them.');

  t('medicinal-plants', 'Medicinal plants', 'body', A(49000), 'El Sidrón, Spain', 3, 0,
    [[A(100000), 0], [A(49000), 30], [A(20000), 70], [-5000, 95], [1, 99], [2025, 99]],
    'Tartar on a Neanderthal’s teeth at El Sidrón holds poplar (a natural source of aspirin) and a penicillin-producing mold, 49,000 years old. Plant medicine is almost certainly much older.');

  t('surgery', 'Surgery', 'body', A(31000), 'Liang Tebo, Borneo', 3, 0,
    [[A(31000), 0], [-10000, 1], [-5000, 3], [-1000, 6], [1, 10], [1000, 12], [1500, 14], [1800, 16], [1850, 17],
     [1900, 20], [1950, 25], [2000, 30], [2015, 32], [2025, 35]],
    'A child whose lower leg was cleanly amputated in Borneo 31,000 years ago survived for years. Anesthesia (1840s) and antiseptics (1867) made modern surgery possible. Line: people who could get surgery when needed.');

  t('soap', 'Soap', 'body', -2800, 'Babylon', 3, 0,
    [[-2800, 0], [-1000, 3], [1, 8], [1000, 10], [1500, 12], [1800, 18], [1900, 35], [1950, 50], [2000, 65], [2020, 72], [2025, 75]],
    'Babylonians boiled fat with ash to make soap by 2800 BCE. Line: people with soap and water for washing hands at home, still one of the cheapest defences against infection.');

  t('eyeglasses', 'Eyeglasses', 'body', 1286, 'Pisa, Italy', 3, 0,
    [[1286, 0], [1400, 0.2], [1600, 1], [1800, 3], [1900, 7], [1950, 12], [2000, 20], [2025, 25]],
    'Spectacles were invented in Pisa around 1286. Line: people wearing glasses or contact lenses. Hundreds of millions who need them still go without.');

  t('vaccination', 'Vaccination', 'body', 1796, 'Berkeley, England', 3, 1,
    [[1796, 0], [1800, 0.3], [1820, 2], [1850, 5], [1900, 12], [1930, 20], [1950, 30], [1970, 50], [1980, 65],
     [1990, 80], [2000, 85], [2025, 90]],
    'Edward Jenner’s smallpox vaccine (1796) built on older inoculation practiced in China, India and Africa. Smallpox was eradicated in 1980. Line: people vaccinated at least once.');

  t('antibiotics', 'Antibiotics', 'body', 1935, 'Germany and England', 3, 1,
    [[1935, 0], [1940, 1], [1945, 4], [1950, 12], [1960, 25], [1970, 38], [1980, 52], [1990, 62], [2000, 72], [2010, 80], [2025, 85]],
    'Sulfa drugs (1935) and mass-produced penicillin (from 1942) turned once-fatal infections into routine cures. Line: people with access to them.');

  t('contraception', 'The pill & contraception', 'body', 1960, 'USA', 2, 0,
    [[1960, 0], [1965, 8], [1970, 20], [1980, 38], [1990, 48], [2000, 53], [2010, 55], [2020, 57], [2025, 58]],
    'The pill (1960), IUDs and modern condoms. Line: married or partnered women aged 15–49 using a modern method, a narrower base than the other lines.');

  t('mrna', 'mRNA vaccines', 'body', 2020.9, 'Germany and the USA', 2, 0,
    [[2020.9, 0], [2021.5, 10], [2022, 17], [2023, 21], [2025, 23]],
    'First approved in December 2020 against COVID-19; billions of doses were given within two years. Line: rough share of people who received at least one mRNA dose.');

  t('mirror', 'Mirror', 'body', -6000, 'Çatalhöyük, Anatolia', 3, 0,
    [[-6200, 0], [-4000, 0.5], [-2000, 2], [-1000, 4], [1, 8], [1000, 10], [1500, 12], [1700, 15], [1850, 25], [1900, 40], [1950, 65], [2000, 85], [2025, 95]],
    'Polished obsidian mirrors from Çatalhöyük are about 8,000 years old. Bronze mirrors followed, and Justus von Liebig’s silvering process (1835) made clear glass mirrors cheap. Line: people with a mirror at home.');

  t('anesthesia', 'Anesthesia', 'body', 1842, 'Georgia, USA', 3, 0,
    [[1804, 0], [1842, 0.05], [1850, 0.5], [1870, 3], [1900, 10], [1950, 18], [1990, 25], [2015, 30], [2025, 33]],
    'Hanaoka Seishū operated under herbal general anesthesia in Japan in 1804. Crawford Long used ether in 1842, and a public demonstration in Boston (1846) spread it worldwide within months. Line: people who could have surgery under anesthesia.');

  t('imaging', 'Medical imaging', 'body', 1895, 'Würzburg, Germany', 3, 0,
    [[1895, 0], [1900, 0.5], [1920, 3], [1950, 10], [1970, 18], [1990, 25], [2010, 33], [2025, 40]],
    'Röntgen discovered X-rays in 1895 and hospitals used them within months. Ultrasound (1950s), CT (1971) and MRI (1970s) let doctors see inside the living body. Line: people with access to basic diagnostic imaging, which most of the world still lacks.');

  t('blood-banks', 'Blood storage', 'body', 1937, 'Chicago, USA', 3, 0,
    [[1915, 0], [1937, 0.5], [1945, 3], [1960, 12], [1980, 25], [2000, 40], [2025, 50]],
    'Karl Landsteiner found blood groups in 1901, anticoagulants (1914) let blood be kept, and the first hospital blood bank opened in Chicago in 1937. Line: people who could get a safe transfusion when needed.');

  ev('germ-theory', 'Germ theory', 'body', 1857, 'Lille, France', 1,
    'Pasteur showed that microbes cause fermentation (1857) and then disease; Koch tied specific bacteria to anthrax (1876), tuberculosis (1882) and cholera (1884). Semmelweis’s handwashing (1847) and Snow’s cholera map (1854) had pointed the same way. Sanitation, antiseptics, vaccines and antibiotics all follow from it.');

  ev('brain', 'Brain structures', 'body', 1861, 'Paris', 0,
    'Paul Broca tied a patch of the left frontal lobe to speech in 1861, showing that brain regions have jobs. Santiago Ramón y Cajal showed the brain is made of separate neurons (1888), and functional MRI (1991) let us watch it work.');

  ev('dna', 'DNA', 'body', 1953, 'Cambridge, England', 1,
    'Rosalind Franklin’s X-ray images and Watson and Crick’s model revealed the double helix in 1953, explaining how life copies itself (DNA itself was found in 1869). The first human genome took 13 years and about $3 billion to read (2003); one now costs a few hundred dollars.');

  ev('cognitive-biases', 'Cognitive biases', 'body', 1974, 'Hebrew University of Jerusalem', 0,
    'Amos Tversky and Daniel Kahneman showed in 1974 that people judge chances with predictable shortcuts and errors, such as anchoring and availability. The work founded behavioral economics and won Kahneman a Nobel prize in 2002.');

  ev('ivf', 'IVF', 'body', 1978, 'Oldham, England', 0,
    'Louise Brown, the first baby conceived in a laboratory dish, was born in 1978. More than 12 million IVF babies have been born since.');

  ev('circadian', 'Circadian clock', 'body', 1729, 'Paris', 0,
    'Jean-Jacques d’Ortous de Mairan saw in 1729 that mimosa leaves keep opening and closing on a daily rhythm even in darkness. The genes of this internal clock were identified from 1984 (Nobel prize 2017), changing advice on shift work, light at night and sleep.');

  ev('prenatal-nutrition', 'Prenatal nutrition', 'body', 1991, 'United Kingdom', 0,
    'A 1991 trial showed that folic acid before conception prevents most spina bifida, and dozens of countries now add it to flour. Studies of children conceived in the Dutch Hunger Winter (1944–45) showed a mother’s diet shapes her child’s health for life.');

  ev('cloning', 'Cloning & gene editing', 'body', 1996, 'Roslin Institute, Scotland', 0,
    'Gene cloning (1973) had bacteria making human insulin by 1982. Dolly the sheep (1996) was cloned from an adult cell, and CRISPR (2012) made editing genes cheap; the first CRISPR treatment, for sickle-cell disease, was approved in 2023.');

  ev('childhood-trauma', 'Childhood trauma & the brain', 'body', 1998, 'San Diego, USA', 0,
    'The Adverse Childhood Experiences study (1998) found that abuse, neglect and household chaos in childhood predict illness decades later. Research since shows early stress and care shape how the developing brain wires itself; Bowlby’s attachment theory (1950s) came first.');

  /* ---------------- Transport ---------------- */

  t('boats', 'Boats', 'move', A(65000), 'Sea crossings to Australia', 3, 1,
    [[A(70000), 0], [A(60000), 2], [A(50000), 8], [A(30000), 20], [-8000, 40], [-3000, 55], [1, 70], [1500, 75], [1900, 78], [2025, 80]],
    'Reaching Australia 50,000 to 65,000 years ago meant crossing open sea. The oldest surviving boat, a dugout canoe from Pesse in the Netherlands, is about 10,000 years old. Line: people in communities using boats.');

  t('sail', 'Sail', 'move', -3200, 'Nile, Egypt', 3, 0,
    [[-3500, 0], [-3000, 4], [-2000, 12], [-1000, 22], [1, 35], [1000, 45], [1500, 55], [1800, 62], [1850, 62],
     [1900, 45], [1950, 15], [2000, 4], [2025, 2]],
    'Sails are painted on Egyptian pots and boats by about 3200 BCE. Austronesian outrigger sailors later settled half the Pacific. Line: people in societies that trade or fish under sail.');

  t('wheel', 'Wheel', 'move', -3500, 'Mesopotamia and Central Europe', 3, 1,
    [[-3700, 0], [-3000, 4], [-2500, 10], [-2000, 20], [-1500, 30], [-1000, 38], [1, 50], [1000, 55], [1500, 60],
     [1800, 68], [1900, 82], [1950, 92], [2025, 99]],
    'Wheeled carts appear almost at once around 3500 BCE from Mesopotamia to Poland; the oldest surviving wheel, from the Ljubljana Marshes, is about 5,150 years old. Never used for transport in the Americas before 1500.');

  t('horses', 'Horses', 'move', -2200, 'Volga–Don steppe', 3, 0,
    [[-3500, 0], [-3000, 0.5], [-2200, 3], [-1800, 12], [-1500, 22], [-1000, 35], [-500, 48], [1, 55], [1000, 62],
     [1500, 68], [1700, 75], [1850, 80], [1900, 80], [1930, 70], [1950, 55], [1970, 35], [2000, 20], [2025, 12]],
    'Modern domestic horses descend from a line bred on the lower Volga–Don steppe around 2200 BCE; chariots and riding spread across Eurasia within centuries. Line: people in societies using horses for riding, carts or ploughs.');

  t('compass', 'Magnetic compass', 'move', 1040, 'Song China', 3, 0,
    [[1000, 0], [1100, 15], [1200, 25], [1300, 45], [1400, 55], [1500, 65], [1700, 80], [1850, 90], [1900, 95], [2025, 99]],
    'A magnetised needle for navigation is described in Song China in the 1040s to 1080s, and in Europe by about 1190. Line: people in societies whose sailors navigate with it.');

  t('roads', 'Paved roads', 'move', -2600, 'Faiyum, Egypt', 3, 0,
    [[-3000, 0], [-2600, 0.5], [-1000, 5], [-500, 12], [1, 30], [500, 25], [1000, 28], [1500, 30], [1800, 40], [1900, 50], [1950, 60], [2000, 75], [2025, 85]],
    'A quarry road paved with stone slabs in Egypt’s Faiyum dates to about 2600 BCE. Persia, Rome and Han China built road networks for armies and messengers; macadam (1815) and asphalt followed. Line: people living within reach of an all-season road.');

  t('star-navigation', 'Navigating by stars', 'move', -1100, 'Pacific and Mediterranean', 3, 0,
    [[-2000, 0], [-1100, 2], [-500, 10], [1, 20], [1000, 35], [1500, 55], [1800, 80], [1950, 85], [1980, 85], [2000, 40], [2025, 15]],
    'Austronesian voyagers crossed open Pacific water from about 1100 BCE, steering by rising and setting stars; Homer’s Odysseus steers by the Bear. The sextant and the marine chronometer (1760s) made it precise until satellite navigation took over. Line: people in societies whose sailors navigate by the stars.');

  t('railways', 'Railways', 'move', 1825, 'Stockton and Darlington, England', 3, 1,
    [[1825, 0], [1830, 0.3], [1840, 2], [1850, 6], [1860, 12], [1870, 18], [1880, 26], [1900, 40], [1920, 52],
     [1950, 60], [1980, 65], [2000, 70], [2025, 75]],
    'The first public steam railway opened in northeast England in 1825. Railways cut journey times tenfold and gave us standard time zones. Line: people living in regions served by rail.');

  t('bicycle', 'Bicycle', 'move', 1817, 'Mannheim, Germany', 2, 0,
    [[1817, 0], [1870, 0.1], [1890, 0.5], [1900, 2], [1920, 5], [1950, 15], [1970, 30], [1990, 45], [2000, 47],
     [2010, 43], [2020, 42], [2025, 42]],
    'Drais’s running machine (1817) became the chain-driven safety bicycle in 1885. Line: people in households owning one, about 42% worldwide.');

  t('car', 'Car', 'move', 1886, 'Mannheim, Germany', 2, 1,
    [[1886, 0], [1900, 0.02], [1910, 0.1], [1920, 0.8], [1930, 1.5], [1950, 3], [1960, 6], [1970, 10], [1980, 13],
     [1990, 16], [2000, 19], [2010, 25], [2015, 31], [2020, 33], [2025, 35]],
    'Carl Benz’s Motorwagen (1886) and Ford’s Model T (1908) made cars practical, then cheap. Line: people in households owning a car, about a third of humanity.');

  t('motorbike', 'Motorbike', 'move', 1885, 'Stuttgart, Germany', 2, 0,
    [[1885, 0], [1920, 0.2], [1950, 1], [1970, 4], [1990, 12], [2000, 18], [2010, 27], [2020, 33], [2025, 35]],
    'Daimler’s 1885 Reitwagen was the first. Cheap motorbikes and scooters now serve about a third of households, mostly in Asia.');

  t('air', 'Air travel', 'move', 1914, 'Florida, USA', 2, 1,
    [[1914, 0], [1930, 0.01], [1950, 0.3], [1960, 1], [1970, 2.5], [1980, 4], [1990, 5.5], [2000, 7], [2010, 8.5],
     [2019, 11], [2020, 4.5], [2021, 6], [2022, 9], [2023, 11], [2025, 12]],
    'The first scheduled airline flew across Tampa Bay in 1914. Line: people who take at least one flight in a year, about one in ten. The pandemic halved it in 2020.');

  ev('moon-landing', 'Moon landing', 'move', 1969.55, 'Apollo 11', 1,
    'Sputnik (1957) and Yuri Gagarin (1961) opened the space age; Apollo 11 landed on the Moon in July 1969, watched live by about 600 million people. Photos like Earthrise (1968) showed the planet small and alone.');

  ev('container', 'Shipping container', 'move', 1956, 'Newark, USA', 0,
    'Malcom McLean’s Ideal X carried 58 containers from Newark to Houston in 1956. Standard steel boxes cut the cost of shipping so far that they made today’s global supply chains possible.');

  t('gps', 'Satellite navigation', 'move', 1978, 'USA', 2, 0,
    [[1978, 0], [1990, 0.01], [2000, 0.2], [2005, 1], [2008, 3], [2010, 8], [2012, 15], [2014, 25], [2016, 35],
     [2018, 42], [2020, 48], [2025, 58]],
    'The first GPS satellite launched in 1978 and civilians got full accuracy in 2000; Russia, Europe and China built their own systems. Line: people carrying a device with satellite positioning.');

  t('ev', 'Electric car', 'move', 2008, 'California and China', 2, 0,
    [[2008, 0], [2012, 0.02], [2015, 0.1], [2018, 0.4], [2020, 0.8], [2022, 1.6], [2024, 2.6], [2025, 3.2]],
    'Electric cars were popular around 1900, then lost to gasoline. Modern ones arrived with the Tesla Roadster (2008) and Nissan Leaf (2010); about one new car in five sold in 2024 was electric. Line: people in households owning one.');

  /* ---------------- Culture & society ---------------- */

  t('pigments', 'Pigments', 'ideas', A(300000), 'Olorgesailie, Kenya', 3, 0,
    [[A(320000), 0], [A(250000), 5], [A(150000), 20], [A(100000), 40], [A(70000), 65], [A(40000), 85], [A(20000), 95], [1, 98], [2025, 99]],
    'Red and black pigments were carried to Olorgesailie about 300,000 years ago. Ochre was ground for paint, glue and perhaps body decoration.');

  t('barter', 'Trade & barter', 'ideas', A(300000), 'Olorgesailie, Kenya', 3, 0,
    [[A(320000), 0], [A(250000), 5], [A(150000), 20], [A(100000), 35], [A(50000), 70], [A(30000), 90], [-8000, 98], [2025, 100]],
    'Obsidian at Olorgesailie came from 25 to 95 km away about 300,000 years ago, a sign of exchange between groups. Anthropologists find that gifts and credit were more common than haggled barter. Line: people in communities that trade with outsiders.');

  t('beads', 'Beads & ornaments', 'ideas', A(142000), 'Bizmoune Cave, Morocco', 3, 0,
    [[A(142000), 0], [A(100000), 8], [A(75000), 20], [A(50000), 50], [A(30000), 80], [A(15000), 95], [1, 99], [2025, 99]],
    'Pierced sea-snail shells from Bizmoune Cave, about 142,000 years old, are the oldest known beads, worn to signal identity and belonging.');

  t('art', 'Painting & carving', 'ideas', A(67800), 'Muna Island, Indonesia', 3, 1,
    [[A(67800), 0], [A(50000), 8], [A(40000), 25], [A(30000), 45], [A(15000), 65], [-5000, 75], [1, 90], [2025, 100]],
    'A hand stencil on Muna Island is at least 67,800 years old, and nearby Sulawesi has a painted hunting scene of 51,200 years. Carved figurines and the painted caves of Europe followed.');

  ev('storytelling', 'Storytelling', 'ideas', A(51200), 'Leang Karampuang, Sulawesi', 1,
    'A painted scene of people and a pig, at least 51,200 years old, is the oldest known picture that tells a story. Every known culture tells stories, so spoken storytelling is surely much older, but it leaves no trace.');

  t('music', 'Musical instruments', 'ideas', A(42000), 'Geissenklösterle, Germany', 3, 0,
    [[A(43000), 0], [A(35000), 15], [A(25000), 40], [A(10000), 75], [-3000, 90], [1, 95], [2025, 100]],
    'Flutes of bird bone and mammoth ivory from Geissenklösterle Cave are about 42,000 years old.');

  t('moon', 'Lunar calendar', 'ideas', A(10000), 'Warren Field, Scotland', 3, 0,
    [[-9000, 0], [-8000, 3], [-5000, 15], [-3000, 40], [-1000, 60], [1, 75], [1000, 80], [1500, 85], [1900, 90], [2025, 95]],
    'Twelve pits at Warren Field, dug about 10,000 years ago, seem to track the moon’s phases through the months and reset at midwinter. Islamic, Jewish, Chinese and Hindu calendars still follow the moon. Line: people in societies counting months by the moon.');

  t('seasons', 'Solar calendar', 'ideas', -3200, 'Newgrange, Ireland', 3, 0,
    [[-4000, 0], [-3200, 1], [-2500, 10], [-1000, 30], [1, 60], [1000, 75], [1500, 85], [1900, 97], [2025, 100]],
    'The passage tomb at Newgrange (about 3200 BCE) is lit by the midwinter sunrise, and Egypt fixed a 365-day year soon after. Foragers tracked the seasons long before through plants, animals and stars. Line: people in societies with a calendar of the solar year.');

  t('states', 'Kingdoms & states', 'ideas', -3100, 'Egypt and Mesopotamia', 3, 0,
    [[-3500, 0], [-3000, 4], [-2000, 15], [-1000, 35], [1, 65], [1000, 75], [1500, 80], [1800, 88], [1900, 96], [1950, 99], [2025, 100]],
    'City-states arose in Mesopotamia, and Egypt was united under one king around 3100 BCE. For thousands of years many people still lived beyond any state’s reach. Line: people living under a state with rulers, taxes and armies.');

  ev('alphabet', 'Alphabet', 'ideas', -1850, 'Sinai and Egypt', 0,
    'Semitic-speaking workers in Egypt turned a few dozen hieroglyphs into signs for single sounds around 1850 BCE. Greek, Latin, Cyrillic, Arabic and Hebrew letters all descend from it, and a script of two dozen signs is far easier to learn than one of hundreds.');

  t('writing', 'Writing', 'ideas', -3300, 'Uruk, Mesopotamia', 1, 1,
    [[-3300, 0], [-2000, 0.3], [-1000, 0.5], [-500, 1], [1, 2], [500, 2.5], [1000, 3], [1400, 5], [1500, 6],
     [1600, 7], [1700, 9], [1800, 11], [1820, 12], [1870, 19], [1900, 21], [1930, 33], [1950, 55], [1970, 63],
     [1980, 70], [1990, 76], [2000, 82], [2010, 85], [2025, 87]],
    'Writing was invented in Mesopotamia around 3300 BCE, and separately in China and Mesoamerica. For almost all of history few people could read. Line: people who can read and write.');

  t('contracts', 'Written contracts', 'ideas', -2600, 'Shuruppak, Mesopotamia', 3, 0,
    [[-2700, 0], [-2000, 2], [-1000, 6], [-500, 15], [1, 40], [1000, 50], [1500, 60], [1800, 70], [1900, 85], [1950, 92], [2025, 98]],
    'Clay tablets recording house and land sales, witnessed and sealed, survive from Shuruppak from about 2600 BCE. Line: people in societies where written agreements can be enforced.');

  t('star-time', 'Star calendars', 'ideas', -2100, 'Egypt', 3, 0,
    [[-3000, 0], [-2100, 2], [-1000, 12], [1, 30], [1000, 45], [1500, 55], [1800, 60], [1900, 50], [1950, 30], [2025, 15]],
    'Egyptians timed the year by the dawn rising of Sirius, which heralded the Nile flood, and painted star clocks on coffin lids by about 2100 BCE. Farmers from Greece to the Andes and New Zealand planted by the Pleiades. Line: people in societies that keep time by the stars.');

  t('laws', 'Written laws', 'ideas', -2100, 'Ur, Mesopotamia', 3, 1,
    [[-2100, 0], [-1750, 3], [-1000, 8], [-500, 20], [1, 50], [1000, 60], [1500, 65], [1800, 75], [1900, 90], [2025, 99]],
    'The code of Ur-Nammu (about 2100 BCE) is the oldest that survives; Hammurabi’s (about 1754 BCE) was carved in stone for all to see. Line: people living under written law codes.');

  t('sundials', 'Sundials & hours', 'ideas', -1500, 'Egypt', 3, 0,
    [[-1500, 0], [-1000, 5], [-500, 15], [1, 35], [1000, 50], [1500, 60], [1800, 75], [1900, 90], [2025, 99]],
    'Egyptian shadow clocks (about 1500 BCE) and water clocks split day and night into hours. Line: people in societies that divide the day into hours.');

  t('money', 'Coins & money', 'ideas', -630, 'Lydia, Anatolia', 3, 0,
    [[-2500, 0], [-1000, 3], [-600, 6], [-400, 15], [-200, 30], [1, 42], [500, 45], [1000, 50], [1500, 60],
     [1800, 75], [1900, 88], [1950, 95], [2025, 99]],
    'Weighed silver served as money in Mesopotamia by 2500 BCE; stamped coins were struck in Lydia around 630 BCE and in China soon after, and Song China issued the first government paper money in the 1020s. Line: people living in economies that use money.');

  t('democracy', 'Democracy', 'ideas', -508, 'Athens', 2, 0,
    [[-510, 0], [-500, 0.1], [-400, 0.15], [-320, 0.05], [-200, 0.02], [1600, 0.02], [1800, 0.5], [1850, 2], [1900, 12], [1920, 18],
     [1938, 12], [1945, 15], [1950, 30], [1975, 30], [1990, 40], [2000, 52], [2010, 53], [2016, 54], [2019, 32], [2022, 29], [2024, 28], [2025, 26]],
    'Cleisthenes’ reforms in 508 BCE gave the male citizens of Athens a direct say in making laws. Line: people living in electoral or liberal democracies, by V-Dem’s Regimes of the World. The drop after 2016 is mostly India’s reclassification as an electoral autocracy; by the end of 2025 about three people in four lived in autocracies.');

  t('schools', 'Schools', 'ideas', -2500, 'Sumer', 2, 0,
    [[-2600, 0], [-2000, 0.1], [-1000, 0.3], [1, 1], [1000, 2], [1500, 4], [1700, 8], [1820, 17], [1870, 24], [1900, 33], [1930, 41],
     [1950, 49], [1970, 61], [1990, 74], [2010, 83], [2020, 86], [2025, 87]],
    'Sumerian “tablet houses” trained scribes by about 2500 BCE, but schooling stayed rare until mass education spread in the 1800s. Line: people aged 15 and over with at least some formal schooling (Our World in Data).');

  ev('zero', 'Zero & decimal numbers', 'ideas', 628, 'India (Brahmagupta)', 1,
    'Brahmagupta wrote rules for calculating with zero in 628 CE. With place-value digits it made arithmetic easy enough for anyone; Arab scholars carried it west and Fibonacci promoted it in Europe in 1202. Babylonians and the Maya had place-value systems too.');

  t('paper', 'Paper', 'ideas', -150, 'Han China', 3, 0,
    [[-180, 0], [200, 3], [500, 10], [800, 18], [1000, 22], [1300, 30], [1500, 35], [1700, 40], [1850, 50], [1900, 65],
     [1950, 85], [2000, 95], [2025, 97]],
    'The oldest paper, from Fangmatan in China, dates to about 150 BCE; Cai Lun improved it in 105 CE. Papermaking reached Baghdad around 800 and Spain in the 1100s.');

  t('printing', 'Printing', 'ideas', 700, 'China and Korea', 3, 1,
    [[650, 0], [800, 8], [1000, 18], [1200, 25], [1450, 28], [1500, 35], [1600, 45], [1700, 52], [1800, 60],
     [1850, 70], [1900, 85], [1950, 95], [2025, 99]],
    'Woodblock printing spread in China and Korea by the 700s, movable type followed in China in the 1040s, and Gutenberg’s press (about 1450) spread across Europe within 50 years. Line: people living where printed text circulates.');

  ev('science', 'Experimental science', 'ideas', 1015, 'Cairo (Ibn al-Haytham)', 1,
    'Ibn al-Haytham tested ideas about light with controlled experiments in Cairo around 1015. Francis Bacon (1620) argued that knowledge should be built from experiment, and the Royal Society (1660) made it a shared, published practice.');

  ev('heliocentrism', 'Sun-centered universe', 'ideas', 1543, 'Frombork, Poland (Copernicus)', 0,
    'Copernicus put the Sun at the center in 1543 (Aristarchus had suggested it around 270 BCE); Galileo’s telescope and Kepler’s orbits confirmed it. Earth was no longer the center of everything.');

  t('post', 'Postal mail', 'ideas', 1490, 'Habsburg Europe (Taxis post)', 3, 0,
    [[1490, 0], [1600, 1], [1700, 3], [1800, 7], [1840, 10], [1875, 20], [1900, 40], [1950, 65], [2000, 85], [2025, 85]],
    'Persian kings ran relay couriers by about 550 BCE, but only for the state. Public mail grew from the Taxis family’s post (1490); the Penny Black stamp (1840) made letters cheap and the Universal Postal Union (1874) linked the world. Line: people who can send and receive letters by public post.');

  t('newspapers', 'Newspapers', 'ideas', 1605, 'Strasbourg', 3, 0,
    [[1605, 0], [1700, 0.3], [1800, 1.5], [1850, 4], [1880, 8], [1900, 12], [1930, 20], [1950, 25], [1970, 32],
     [1990, 38], [2000, 40], [2010, 36], [2020, 25], [2025, 20]],
    'The first weekly newspaper was printed in Strasbourg in 1605. Print readership peaked around 2000 and has fallen since. Line: people who read a printed newspaper regularly.');

  t('clocks', 'Clocks & watches', 'ideas', 1283, 'England and Italy', 3, 0,
    [[1270, 0], [1400, 1], [1500, 2], [1600, 3], [1700, 5], [1800, 10], [1850, 18], [1900, 30], [1950, 55],
     [1980, 75], [2000, 85], [2025, 95]],
    'Mechanical clocks appear in English and Italian churches in the 1280s, though sundials and water clocks are thousands of years older. Line: people with a clock or watch of their own (now mostly a phone).');

  t('photography', 'Film cameras', 'ideas', 1839, 'Paris', 3, 0,
    [[1839, 0], [1860, 0.2], [1888, 0.5], [1900, 1], [1930, 3], [1950, 6], [1970, 12], [1990, 20], [2000, 24],
     [2005, 20], [2010, 8], [2015, 2], [2025, 0.5]],
    'Daguerre announced photography in Paris in 1839; Kodak’s cheap box camera (1888) brought it home. Line: households owning a film camera, wiped out by digital cameras and phones after 2000.');

  ev('evolution', 'Evolution', 'ideas', 1859, 'London (Darwin)', 1,
    'Darwin’s On the Origin of Species (1859), with Alfred Russel Wallace’s parallel work, showed that living things, humans included, evolve by natural selection.');

  t('weather-forecast', 'Weather forecasts', 'ideas', 1861, 'London', 3, 0,
    [[1861, 0], [1880, 1], [1900, 4], [1930, 10], [1950, 20], [1970, 40], [1990, 60], [2010, 75], [2025, 85]],
    'Robert FitzRoy printed the first public forecasts in The Times in 1861, built from telegraphed reports. Computer models (1950) and weather satellites (1960) made them reliable: a five-day forecast today is about as good as a one-day forecast was in 1980. Line: people who can get a daily forecast.');

  /* ---------------- Electric & digital ---------------- */

  t('telegraph', 'Telegraph', 'electric', 1837, 'England and the USA', 3, 0,
    [[1837, 0], [1845, 0.5], [1860, 6], [1880, 18], [1900, 32], [1930, 45], [1950, 50], [1970, 40], [1990, 15],
     [2005, 3], [2025, 0.3]],
    'Cooke and Wheatstone’s telegraph (1837) and Morse’s (1844) sent messages at the speed of electricity; a lasting cable crossed the Atlantic in 1866. Line: people within reach of a telegraph office.');

  t('recorded-sound', 'Recorded sound', 'electric', 1877, 'New Jersey, USA', 3, 0,
    [[1877, 0], [1900, 0.5], [1920, 2], [1930, 6], [1950, 18], [1970, 45], [1990, 65], [2010, 80], [2025, 88]],
    'Edison’s phonograph (1877) played back a voice for the first time. Records, radio, tapes, CDs and streaming followed. Line: people who regularly hear recorded music.');

  t('lightbulb', 'Electric light', 'electric', 1879, 'Menlo Park, USA and Newcastle, England', 2, 0,
    [[1879, 0], [1890, 0.2], [1900, 1], [1920, 4], [1940, 11], [1950, 19], [1960, 29], [1970, 44], [1980, 57], [1990, 70], [2000, 77], [2010, 83], [2020, 91], [2025, 94]],
    'Swan and Edison made practical light bulbs in 1879–80; LEDs, using a tenth of the power, replaced them in the 2010s, and solar lanterns now light homes beyond the grid. Line: people with electric light at home.');

  t('cinema', 'Motion pictures', 'electric', 1895, 'Paris', 3, 0,
    [[1895, 0], [1910, 3], [1930, 12], [1950, 25], [1970, 40], [1990, 60], [2010, 75], [2025, 85]],
    'The Lumière brothers showed films to a paying audience in Paris in 1895; sound arrived in 1927. Line: people who watch films, in cinemas, on television or on phones.');

  t('telephone', 'Landline telephone', 'electric', 1876, 'Boston, USA', 2, 1,
    [[1876, 0], [1900, 0.3], [1920, 1.2], [1950, 3], [1970, 6], [1980, 9], [1990, 14], [2000, 24], [2006, 28],
     [2010, 26], [2015, 22], [2020, 17], [2025, 14]],
    'Bell patented the telephone in 1876. Landlines peaked around 2006 and are fading as mobiles replace them. Line: people in households with a fixed line.');

  t('radio', 'Radio', 'electric', 1920, 'Pittsburgh, USA', 2, 1,
    [[1920, 0], [1925, 0.5], [1930, 3], [1940, 8], [1950, 15], [1960, 28], [1970, 42], [1980, 55], [1990, 65],
     [2000, 72], [2010, 72], [2020, 68], [2025, 65]],
    'Broadcast radio began with KDKA Pittsburgh in 1920, 25 years after Marconi’s first wireless signals. Cheap transistor sets from the mid-1950s carried it to villages worldwide. Line: people in households with a radio.');

  t('tv', 'Television', 'electric', 1936, 'London', 2, 1,
    [[1936, 0], [1950, 1], [1960, 6], [1970, 15], [1980, 25], [1990, 40], [2000, 58], [2010, 72], [2020, 77], [2025, 76]],
    'The BBC began regular broadcasts in 1936. Television reached most homes in rich countries by the 1960s and most of the world by 2000; viewing is now moving to phones and streaming. Line: people in households with a TV.');

  t('fridge', 'Refrigerator', 'electric', 1913, 'Chicago, USA', 2, 1,
    [[1913, 0], [1920, 0.05], [1930, 0.8], [1940, 2], [1950, 4], [1960, 8], [1970, 14], [1980, 22], [1990, 32],
     [2000, 42], [2010, 55], [2020, 64], [2025, 67]],
    'Electric home refrigerators went on sale in Chicago in 1913. They changed diets and shopping; about two households in three worldwide now have one.');

  t('washing-machine', 'Washing machine', 'electric', 1908, 'Chicago, USA', 2, 0,
    [[1908, 0], [1920, 0.1], [1950, 2], [1960, 4], [1970, 8], [1980, 13], [1990, 20], [2000, 27], [2010, 37], [2020, 46], [2025, 49]],
    'Electric washing machines such as the Thor (1908) freed millions of hours, mostly women’s, from hand laundry. About half of households worldwide have one.');

  t('ac', 'Air conditioning', 'electric', 1902, 'Brooklyn, New York', 2, 0,
    [[1902, 0], [1930, 0.02], [1950, 0.3], [1960, 0.8], [1970, 2], [1980, 4], [1990, 7], [2000, 11], [2010, 18], [2020, 28], [2025, 32]],
    'Willis Carrier designed the first modern air conditioner in 1902 for a Brooklyn printing plant. Home cooling is spreading fast in China, India and Southeast Asia as heat waves grow.');

  t('microwave', 'Microwave oven', 'electric', 1947, 'USA', 2, 0,
    [[1947, 0], [1967, 0.05], [1975, 0.3], [1980, 0.8], [1990, 5], [2000, 13], [2010, 22], [2020, 32], [2025, 35]],
    'Raytheon sold the first microwave oven in 1947; the countertop Amana Radarange (1967) brought it into homes.');

  ev('transistor', 'Transistor & microchip', 'electric', 1947, 'Bell Labs, USA', 0,
    'The transistor (1947), the integrated circuit (1958) and the microprocessor (1971) made electronics small and cheap. A single phone chip now holds more than 10 billion transistors.');

  t('camera', 'Cameras', 'electric', 1839, 'Paris', 3, 0,
    [[1839, 0], [1860, 0.2], [1888, 0.5], [1900, 1], [1930, 3], [1950, 6], [1970, 12], [1990, 20], [2000, 26], [2005, 35], [2010, 50], [2015, 62], [2020, 68], [2025, 72]],
    'From the daguerreotype (1839) and Kodak (1888) to digital cameras and, from 2000, phones with a camera built in. Line: people owning any camera, now mostly in a phone.');

  t('computer', 'Personal computer', 'electric', 1977, 'USA', 2, 1,
    [[1975, 0], [1980, 0.1], [1985, 0.8], [1990, 2.5], [1995, 6], [2000, 13], [2005, 20], [2010, 30], [2015, 38], [2020, 43], [2025, 45]],
    'Programmable electronic computers date from the 1940s; the Apple II, Commodore PET and TRS-80 (all 1977) began home computing. About half of households worldwide have a computer, though many people now compute on phones instead.');

  t('internet', 'Internet', 'electric', 1983, 'USA', 1, 1,
    [[1983, 0], [1990, 0.05], [1995, 0.8], [2000, 6.7], [2005, 15.8], [2010, 28.7], [2015, 40], [2019, 53.5],
     [2020, 59], [2022, 66], [2024, 71], [2025, 74]],
    'TCP/IP joined networks into one internet in 1983, and the World Wide Web (1991) made it usable by anyone. About three-quarters of people were online in 2025.');

  t('mobile', 'Mobile phone', 'electric', 1979, 'Tokyo, Japan', 1, 1,
    [[1979, 0], [1985, 0.01], [1990, 0.2], [1995, 1.5], [2000, 10], [2005, 25], [2010, 45], [2015, 60], [2020, 67], [2025, 72]],
    'The first cellular network opened in Tokyo in 1979 and the first handheld phone went on sale in 1983. Mobiles reached poor and rural places far faster than landlines ever did. Line: unique mobile subscribers.');

  t('smartphone', 'Smartphone', 'electric', 2007, 'USA', 2, 1,
    [[2007, 0], [2008, 0.5], [2010, 5], [2013, 18], [2016, 35], [2020, 48], [2022, 53], [2025, 56]],
    'The iPhone (2007) and Android (2008) put the internet in a pocket. Smartphones reached half of humanity in about 15 years, faster than any earlier device; about 4.6 billion people used one at the end of 2025.');

  t('social-media', 'Social media', 'electric', 2002, 'USA', 2, 0,
    [[2002, 0], [2006, 0.5], [2008, 3], [2010, 10], [2012, 20], [2015, 30], [2018, 42], [2020, 50], [2022, 58], [2025, 64]],
    'Friendster (2002), MySpace (2003) and Facebook (2004) began the social web. Line: active social media users; counts are of accounts, so this is an upper bound.');

  t('payments', 'Cards & digital payments', 'electric', 1950, 'New York, USA', 1, 0,
    [[1950, 0], [1960, 0.3], [1970, 1], [1980, 4], [1990, 8], [2000, 15], [2007, 25], [2011, 33], [2014, 42],
     [2017, 52], [2021, 64], [2025, 68]],
    'The Diners Club card (1950) began cashless shopping; M-Pesa (2007) brought mobile money to Kenya and beyond. Line: adults who made or received a digital payment in the past year.');

  t('video-games', 'Video games', 'electric', 1972, 'USA', 2, 0,
    [[1972, 0], [1980, 1], [1990, 3], [2000, 7], [2010, 20], [2015, 30], [2020, 40], [2025, 42]],
    'Pong and the Magnavox Odyssey (1972) began home gaming. About 3.4 billion people now play, mostly on phones.');

  t('blockchain', 'Blockchain & crypto', 'electric', 2009, 'Online (Bitcoin)', 2, 0,
    [[2009, 0], [2013, 0.05], [2017, 0.5], [2018, 1.5], [2020, 2.5], [2021, 4], [2022, 5], [2024, 8], [2025, 9]],
    'Bitcoin (2009) ran money on a shared ledger that no bank controls. Line: people owning cryptocurrency, about 1 in 11 by the end of 2025 by Crypto.com’s on-chain estimate.');

  t('iot', 'Internet of Things', 'electric', 1999, 'MIT, USA', 3, 0,
    [[1999, 0], [2010, 0.3], [2014, 1], [2016, 3], [2018, 7], [2020, 11], [2022, 14], [2025, 18]],
    'Kevin Ashton coined the phrase in 1999. Speakers, doorbells, thermostats, cars and factory sensors now talk to the internet, and connected devices outnumber people. Line: people in homes with at least one smart-home device.');

  t('ai', 'Generative AI', 'electric', 2022.9, 'San Francisco, USA', 2, 1,
    [[2022.9, 0], [2023.3, 3], [2024, 7], [2024.5, 9], [2025, 13], [2025.45, 15.1], [2025.95, 16.3], [2026.2, 17.8], [2026.45, 18.8]],
    'ChatGPT, released in November 2022, reached 100 million users in two months. By mid-2026 nearly one working-age person in five used AI tools, a faster start than either the internet or the smartphone. Line: share of the working-age population, from Microsoft’s AI diffusion reports.');

  /* Mental shifts: how a technology changed the way people think or live. */
  var SHIFT = {
    'fermentation': 'Perhaps the first deliberately mind-altering substance: alcohol shaped feasts, rituals and hospitality, and may even have encouraged people to grow grain.',
    'clothing': 'Clothes let people live in climates their bodies could not survive, and became a way to show who you are: rank, group and modesty.',
    'fire': 'Fire turned night into social time around the hearth, made food easier to digest and kept predators away: a species bending a force of nature to its use.',
    'music': 'Making music together synchronizes bodies and moods, a way to bond groups larger than a family.',
    'storytelling': 'Stories let people share experiences they never had, pass knowledge across generations and imagine things that do not exist, from ancestors to gods.',
    'barter': 'Exchange with strangers, not just kin, needs trust, a sense of value and a way to keep score: the seed of markets and money.',
    'spears': 'Hunting big animals from a distance, in planned groups, rewarded cooperation and foresight.',
    'herding': 'Animals became property that could be owned, inherited and counted; wealth could grow on the hoof.',
    'farming': 'People planted for a harvest months away and stayed put to guard it: the shift to planning, storage, land ownership and, in time, inequality.',
    'seasons': 'The year became a cycle that could be predicted and planned for: when to plant, when to expect floods, when to celebrate.',
    'moon': 'Counting moons turned the sky into a clock and gave the month, the first unit of time longer than a day.',
    'star-time': 'Linking star risings to seasons and floods tied the sky to life on Earth and set off astronomy.',
    'pottery': 'Pots that could go on the fire and keep food dry encouraged storing surplus and staying in one place.',
    'salt': 'Salt let people keep food for months and plan beyond the next meal; it was taxed, traded and fought over.',
    'money': 'Value became abstract and countable: one object could stand for any good, debts could be measured exactly, and strangers could trade.',
    'laws': 'Rules written down applied in the same words to everyone, instead of depending on the memory or mood of a ruler.',
    'contracts': 'A promise became a record that outlived memory and could be enforced by others, making trade and credit between strangers safe.',
    'clean-cooking': 'Cooking moved from smoky open fires to controlled flames, saving hours of fuel gathering, mostly by women, and clearing the air indoors.',
    'piped-water': 'Water at the turn of a tap ended the daily trip to the well and made frequent washing normal.',
    'sewers': 'Waste vanishing out of sight changed what cities smelled like and what people expected of them, and stopped cholera.',
    'boats': 'Water stopped being a barrier: people could reach new lands and, in time, every continent.',
    'star-navigation': 'Sailors could leave the sight of land on purpose, turning the open ocean from a wall into a road.',
    'coffee': 'A drink that sharpened rather than dulled the mind; coffeehouses became places for news, debate and business.',
    'railways': 'Distance began to be measured in hours rather than days; railways forced standard time zones and made commuting possible.',
    'lightbulb': 'Night stopped being dark: work, study and social life stretched into the evening, and bedtimes moved later.',
    'mirror': 'Seeing your own face clearly, and often, changed self-image, grooming and perhaps self-awareness.',
    'printing': 'Identical copies spread ideas fast and wide, so they could be checked, argued over and built on; it fed the Reformation and the Scientific Revolution.',
    'clocks': 'Time became a fixed public measure rather than the flow of daylight and tasks; work, prayer and later trains ran by the clock.',
    'fridge': 'Fresh food kept for days, so shopping became weekly and diets more varied.',
    'antibiotics': 'Infections that had killed people throughout history became curable in days, changing how people thought about risk, surgery and death.',
    'radio': 'Millions heard the same voice at the same moment: news, music and politics became a shared, live experience.',
    'washing-machine': 'Hours of hard labor a week, mostly women’s, disappeared; some economists credit it with helping women into paid work.',
    'car': 'People could go where and when they wanted; cities spread into suburbs and the car became a symbol of freedom.',
    'air': 'Any city on Earth came within a day’s travel, and the planet started to feel small.',
    'cinema': 'Moving pictures let audiences see places and lives far from their own, and made stories shared on a mass scale.',
    'tv': 'World events came into the living room as moving pictures, shaping shared culture and politics for decades.',
    'nuclear-weapons': 'For the first time humans could destroy civilization in an afternoon; fear of nuclear war shaped politics and culture.',
    'contraception': 'Separating sex from pregnancy gave women control over when to have children, changing education, careers and families.',
    'moon-landing': 'Seeing Earth whole from space, small and alone, gave many people a sense of one shared planet and fed the environmental movement.',
    'mobile': 'Calls went to a person rather than a place; being reachable anywhere, all the time, became normal.',
    'blockchain': 'Money and records that no bank or government controls: trust placed in software rather than institutions.'
  };

  /* Who made the earliest known evidence, for deep-time entries. */
  var BY = {
    'stone-tools': 'An unknown hominin, before our genus Homo', 'hand-axes': 'Homo erectus', 'bone-tools': 'Homo erectus or Paranthropus boisei',
    'fire': 'Homo erectus', 'cooking': 'Homo erectus', 'fire-making': 'Probably early Neanderthals', 'spears': 'Homo heidelbergensis',
    'levallois': 'Archaic humans, ancestors of Neanderthals and of us', 'shelters': 'An archaic human, perhaps Homo heidelbergensis',
    'pigments': 'Archaic humans or the earliest Homo sapiens', 'barter': 'Archaic humans or the earliest Homo sapiens',
    'rope': 'Neanderthals', 'medicinal-plants': 'Neanderthals', 'beads': 'Homo sapiens',
    'clothing': 'Homo sapiens (Neanderthals wore clothes too)', 'blades': 'Homo sapiens', 'bow': 'Homo sapiens',
    'art': 'Probably Homo sapiens', 'music': 'Homo sapiens', 'storytelling': 'Homo sapiens', 'needles': 'Homo sapiens or Denisovans',
    'shoes': 'Homo sapiens', 'boats': 'Homo sapiens', 'ground-stone': 'Homo sapiens', 'fermentation': 'Homo sapiens (the Natufians)'
  };
  /* Lines measured differently from the rest: 'country' lines count whole countries (a country either has it or not),
     so they jump when a big country joins; 'energy' lines are a share of world energy, not of people.
     Neither is comparable for speed of spread, so the speed chart leaves them out. */
  var MEASURE = {
    'nuclear': 'country', 'wind': 'country', 'solar': 'country', 'nuclear-weapons': 'country', 'gm-crops': 'country', 'democracy': 'country',
    'coal': 'energy', 'oil': 'energy'
  };

  /* Cumulative culture: what each invention was built on (its direct prerequisites). Following Joseph Henrich,
     inventions are recombinations of earlier know-how held by a whole population, not the work of lone geniuses. */
  var ON = {
    'hand-axes': ['stone-tools'], 'bone-tools': ['stone-tools'], 'fire-making': ['fire', 'stone-tools'], 'cooking': ['fire'],
    'spears': ['stone-tools'], 'levallois': ['hand-axes'], 'shelters': ['stone-tools'], 'pigments': ['stone-tools'],
    'barter': ['stone-tools'], 'beads': ['stone-tools'], 'clothing': ['stone-tools'], 'blades': ['levallois'],
    'needles': ['bone-tools', 'clothing'], 'bow': ['spears', 'rope'], 'boats': ['rope'], 'art': ['pigments'],
    'storytelling': ['art'], 'music': ['bone-tools'], 'shoes': ['clothing'], 'ground-stone': ['stone-tools'],
    'querns': ['ground-stone'], 'earth-ovens': ['cooking'], 'fired-clay': ['fire'], 'fishing': ['bone-tools', 'rope'],
    'atlatl': ['spears'], 'pottery': ['fired-clay'], 'pot-boiling': ['pottery', 'cooking'], 'lamps': ['fire'],
    'villages': ['shelters', 'querns'], 'bread': ['querns', 'fire'], 'fermentation': ['querns'], 'farming': ['querns', 'villages'],
    'wells': ['villages'], 'mud-brick': ['villages'], 'herding': ['farming', 'dogs'], 'cattle': ['herding'], 'cats': ['farming'],
    'weaving': ['rope', 'farming'], 'copper': ['fire', 'pottery'], 'salt': ['pottery', 'fire'], 'dairy': ['herding', 'pottery'],
    'irrigation': ['farming'], 'mirror': ['ground-stone'], 'plow': ['farming', 'cattle'], 'cities': ['farming', 'irrigation', 'mud-brick'],
    'potters-wheel': ['pottery'], 'wheel': ['potters-wheel', 'cattle'], 'fired-brick': ['mud-brick', 'fired-clay'],
    'sewers': ['cities', 'fired-brick'], 'writing': ['cities', 'fired-clay'], 'states': ['cities'], 'seasons': ['moon', 'farming'],
    'sail': ['boats', 'weaving'], 'glass': ['pottery'], 'bronze': ['copper', 'barter'], 'soap': ['pottery'], 'contracts': ['writing'],
    'roads': ['states', 'wheel'], 'pulleys': ['wheel', 'rope'], 'laws': ['writing', 'states'], 'star-time': ['seasons'],
    'schools': ['writing'], 'alphabet': ['writing'], 'horses': ['herding', 'wheel'], 'sundials': ['seasons'], 'iron': ['bronze'],
    'chickens': ['farming'], 'star-navigation': ['sail', 'star-time'], 'aqueducts': ['states', 'wells'],
    'money': ['barter', 'states', 'bronze'], 'democracy': ['states', 'laws'], 'paper': ['writing', 'weaving'],
    'concrete': ['fired-brick'], 'water-wheel': ['wheel', 'querns'], 'printing': ['paper', 'writing'], 'zero': ['writing'],
    'firearms': ['iron', 'fire'], 'windmill': ['water-wheel', 'sail'], 'spinning-wheel': ['weaving', 'wheel'],
    'coal': ['fire', 'iron'], 'science': ['writing', 'glass'], 'compass': ['iron', 'sail'], 'clocks': ['sundials', 'water-wheel'],
    'eyeglasses': ['glass'], 'coffee': ['barter'], 'post': ['roads', 'writing', 'horses'], 'heliocentrism': ['science', 'star-time'],
    'toilets': ['sewers'], 'newspapers': ['printing', 'post'], 'telescope': ['eyeglasses'], 'piped-water': ['aqueducts'],
    'microscope': ['eyeglasses', 'telescope'], 'steam': ['iron', 'coal', 'science'], 'circadian': ['science'],
    'machine-cloth': ['spinning-wheel', 'water-wheel'], 'vaccination': ['science'], 'clean-water': ['piped-water', 'science'],
    'canning': ['glass', 'iron'], 'bicycle': ['wheel', 'iron'], 'railways': ['steam', 'iron'], 'clean-cooking': ['coal'],
    'telegraph': ['science', 'copper'], 'photography': ['glass', 'science'], 'anesthesia': ['surgery', 'science'],
    'sanitation': ['sewers', 'science'], 'sewing-machine': ['needles', 'iron'], 'steel': ['iron', 'coal'],
    'germ-theory': ['microscope', 'science'], 'oil': ['lamps', 'iron'], 'combustion-engine': ['steam', 'oil'], 'evolution': ['science'],
    'brain': ['science', 'microscope'], 'weather-forecast': ['telegraph', 'science'], 'telephone': ['telegraph'],
    'recorded-sound': ['telephone'], 'lightbulb': ['glass', 'telegraph'], 'electricity': ['steam', 'copper', 'lightbulb'],
    'car': ['combustion-engine', 'bicycle', 'steel'], 'motorbike': ['combustion-engine', 'bicycle'], 'tractors': ['combustion-engine', 'plow'],
    'imaging': ['electricity', 'photography'], 'cinema': ['photography', 'lightbulb'], 'ac': ['electricity'], 'plastics': ['coal', 'science'],
    'washing-machine': ['electricity'], 'fertilizer': ['science', 'steel'], 'fridge': ['electricity'], 'air': ['combustion-engine'],
    'radio': ['telegraph', 'electricity'], 'synthetic-fibers': ['plastics'], 'antibiotics': ['germ-theory'], 'tv': ['radio', 'cinema'],
    'blood-banks': ['germ-theory', 'fridge'], 'nuclear-weapons': ['science', 'electricity'], 'microwave': ['radio'],
    'transistor': ['radio', 'science'], 'payments': ['money', 'telegraph'], 'dna': ['evolution', 'imaging'],
    'nuclear': ['nuclear-weapons', 'electricity'], 'solar': ['transistor', 'electricity'], 'container': ['steel', 'railways'],
    'contraception': ['science'], 'hyv': ['fertilizer', 'irrigation'], 'moon-landing': ['transistor', 'air'],
    'video-games': ['tv', 'transistor'], 'cognitive-biases': ['science'], 'computer': ['transistor', 'tv'],
    'gps': ['moon-landing', 'transistor'], 'ivf': ['science', 'microscope'], 'mobile': ['radio', 'telephone', 'transistor'],
    'wind': ['windmill', 'electricity'], 'internet': ['computer', 'telephone'], 'cloning': ['dna'], 'childhood-trauma': ['brain'],
    'prenatal-nutrition': ['science'], 'gm-crops': ['dna', 'hyv'], 'iot': ['internet', 'mobile'], 'social-media': ['internet'],
    'smartphone': ['mobile', 'internet', 'computer', 'camera', 'gps'], 'camera': ['photography'], 'ev': ['car', 'electricity'],
    'blockchain': ['internet', 'payments'], 'mrna': ['dna', 'vaccination'], 'ai': ['internet', 'computer', 'smartphone'],
    'surgery': ['stone-tools'], 'medicinal-plants': ['cooking']
  };

  /* Progress can be lost. Episodes where a population lost know-how it once had, often because it shrank,
     was cut off, or lost the people and trade that kept a skill alive. */
  var LOSSES = [
    { id: 'tasmania', name: 'Tasmania’s lost tools', year: A(3500), where: 'Tasmania', regained: null, techs: ['bone-tools', 'fishing', 'needles'],
      desc: 'Rising seas cut Tasmania off from mainland Australia about 10,000 years ago, leaving a few thousand people. By about 3,500 years ago they had stopped making bone tools and eating fish, and when Europeans arrived they had no fishhooks, nets, spear-throwers or sewn clothing, which mainland Australians used. Henrich argues a small, isolated population could not keep complex skills alive; some archaeologists dispute how much was truly lost.',
      cause: 'Small, isolated population' },
    { id: 'bronze-age-collapse', name: 'Bronze Age collapse', year: -1177, where: 'Eastern Mediterranean', regained: -800, techs: ['writing', 'bronze', 'cities'],
      desc: 'Around 1200–1150 BCE palace states from Greece to Anatolia and the Levant fell. Mycenaean Greece lost Linear B writing, monumental building and long-distance trade, and Greeks wrote nothing for some 400 years, until they adopted the Phoenician alphabet.',
      cause: 'Collapse of states and trade networks' },
    { id: 'antikythera', name: 'Antikythera mechanism', year: -150, where: 'Greek world', regained: 1300, techs: ['clocks'],
      desc: 'A Greek bronze calculator from the 2nd century BCE predicted eclipses with some 30 interlocking gears. Nothing as intricate is known again for well over 1,000 years, until the astronomical clocks of medieval China and Europe.',
      cause: 'Skill held by a few specialists' },
    { id: 'polynesian-pottery', name: 'Pottery in Polynesia', year: 200, where: 'Samoa and Tonga', regained: null, techs: ['pottery', 'pot-boiling'],
      desc: 'The Lapita people who settled Tonga and Samoa made pottery, but their descendants stopped roughly 1,500 to 2,000 years ago; the Polynesians who later settled Hawaii, New Zealand and Easter Island had none and cooked in earth ovens. Why is debated: poor clay, small islands, or simply less need.',
      cause: 'Debated: poor clay, small populations' },
    { id: 'hieroglyphs', name: 'Reading hieroglyphs', year: 394, where: 'Egypt', regained: 1822, techs: ['writing'],
      desc: 'The last dated hieroglyphic inscription was carved at Philae in 394 CE. Within a few generations no one could read the script, and Egypt’s written record stayed silent until Champollion deciphered it in 1822.',
      cause: 'Last trained readers died out' },
    { id: 'post-roman-britain', name: 'Post-Roman Britain', year: 410, where: 'Britain', regained: 700, techs: ['potters-wheel', 'money', 'concrete', 'roads'],
      desc: 'After Rome left in 410, Britain stopped minting and using coins, making wheel-thrown pottery and building in mortared stone within a generation or two; the historian Bryan Ward-Perkins argues living standards fell below pre-Roman levels. Coins and wheel-made pottery returned only in the 600s and 700s.',
      cause: 'Collapse of state, markets and specialists' },
    { id: 'roman-concrete', name: 'Roman concrete', year: 500, where: 'Western Roman Empire', regained: 1824, techs: ['concrete'],
      desc: 'Roman volcanic-ash concrete, which even hardens in seawater, fell out of use with the empire. Portland cement (1824) is a different material, and only in 2023 did researchers explain how Roman concrete heals its own cracks.',
      cause: 'End of the imperial building trade' },
    { id: 'ming-fleets', name: 'Ming treasure fleets', year: 1433, where: 'China', regained: null, techs: ['sail', 'compass'],
      desc: 'Zheng He’s fleets of some of the largest wooden ships ever built sailed as far as East Africa. After 1433 the Ming court ended the voyages and restricted sea trade, and the ships and the skills to build them were left to decay.',
      cause: 'A political decision' },
    { id: 'damascus-steel', name: 'Damascus steel', year: 1750, where: 'Middle East and India', regained: null, techs: ['steel', 'iron'],
      desc: 'Blades forged from Indian wootz steel, with their watery patterns, could no longer be made by the 1700s, probably as the particular ores and trade behind them ran out. Modern metallurgists have only partly recreated them.',
      cause: 'Loss of raw materials and trade' },
    { id: 'polar-inuit', name: 'Polar Inuit', year: 1825, where: 'Northwest Greenland', regained: 1862, techs: ['boats', 'bow', 'fishing', 'shelters'],
      desc: 'An epidemic in the 1820s killed many of the older, most skilled Polar Inuit. The survivors lost how to make kayaks, bows and arrows, fish spears and the long heat-trapping entrances of snow houses, and could not reinvent them for decades, though they badly needed them. Migrants from Baffin Island brought them back in the 1860s.',
      cause: 'Death of the people who held the skills' },
    { id: 'last-moon-landing', name: 'People on the Moon', year: 1972.95, where: 'USA', regained: null, techs: ['moon-landing'],
      desc: 'Twelve people walked on the Moon between 1969 and December 1972, then the program ended. Much of the Saturn V know-how dispersed as its builders retired, and no one has walked on the Moon since.',
      cause: 'Funding and political will ended' },
    { id: 'concorde', name: 'Supersonic passenger flight', year: 2003, where: 'Britain and France', regained: null, techs: ['air'],
      desc: 'Concorde flew passengers faster than sound from 1976 until it retired in 2003. No airline has offered supersonic travel since.',
      cause: 'Cost and too few passengers' }
  ];

  /* World population, the size of the collective brain (HYDE and UN estimates via Our World in Data). */
  var POP = [[-10000, 4.4], [-3000, 45], [1, 232], [1000, 295], [1500, 461], [1800, 990], [1900, 1650], [1950, 2500], [2000, 6150], [2025, 8200]];

  /* Ages of technology, after K. Funk, "A Brief Outline of the History of Technology" (Oregon State University, 2013),
     itself based on Bunch and Hellemans, The Timetables of Technology (1993). */
  var AGES = [
    { name: 'Stone ages', short: 'Stone', from: A(3300000), to: -4000 },
    { name: 'Metal ages', short: 'Metal', from: -4000, to: 1000 },
    { name: 'Age of water and wind', short: 'Water & wind', from: 1000, to: 1733 },
    { name: 'Industrial revolution', short: 'Industrial', from: 1733, to: 1879 },
    { name: 'Electric age', short: 'Electric', from: 1879, to: 1947 },
    { name: 'Electronic age', short: 'Electronic', from: 1947, to: 1973 },
    { name: 'Information age', short: 'Information', from: 1973, to: NOW }
  ];

  /* Human origins, marked on the timeline. */
  var HUMAN = [
    { year: A(2800000), name: 'Genus Homo', where: 'Ledi-Geraru, Ethiopia' },
    { year: A(300000), name: 'Homo sapiens', where: 'Jebel Irhoud, Morocco' }
  ];

  T.forEach(function (x) {
    if (SHIFT[x.id]) x.shift = SHIFT[x.id];
    if (BY[x.id]) x.by = BY[x.id];
    if (MEASURE[x.id]) x.measure = MEASURE[x.id];
    x.on = ON[x.id] || [];
  });
  var unknown = Object.keys(SHIFT).concat(Object.keys(BY), Object.keys(MEASURE), Object.keys(ON),
    [].concat.apply([], Object.keys(ON).map(function (k) { return ON[k]; })),
    [].concat.apply([], LOSSES.map(function (l) { return l.techs; }))).filter(function (k) { return !T.some(function (x) { return x.id === k; }); });

  window.INVENTIONS = { now: NOW, cats: CATS, techs: T, ages: AGES, human: HUMAN, losses: LOSSES, pop: POP, unknownIds: unknown };
})();
