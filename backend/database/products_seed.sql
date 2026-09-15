-- Seeds the products table from the existing frontend/src/data/products.ts catalog.
-- Safe to re-run: clears existing rows first (fine since the table is currently empty
-- and this is pre-demo setup, not production data).

TRUNCATE TABLE products RESTART IDENTITY CASCADE;

INSERT INTO products (name, description, short_description, price, category, stock, image_url, specs)
VALUES
(
  '1337 Wing Zippo',
  'Brushed steel windproof lighter with a laser-engraved 1337 Wing mark. Limited production run of 100 units, each individually numbered.',
  'Brushed steel Zippo with a laser-engraved 1337 Wing mark. Limited run, individually numbered.',
  50, 'accessory', 25, 'zippo1.jpg',
  '[{"label":"Material","value":"Brushed steel"},{"label":"Finish","value":"Laser-engraved"},{"label":"Edition","value":"Limited — 100 units"}]'
),
(
  '1337 Wing Zippo — Matte Black',
  'Matte black windproof lighter with a deep-engraved 1337 Wing mark. Ships in a branded box.',
  'Matte black finish, deep-engraved 1337 Wing mark. Ships in a branded box.',
  60, 'accessory', 25, 'zippo2.jpg',
  '[{"label":"Material","value":"Matte black steel"},{"label":"Engraving","value":"1337 Wing mark"},{"label":"Finish","value":"Matte"},{"label":"Ships in","value":"Branded box"}]'
),
(
  '1337 Wing Hoodie',
  'Heavyweight 400gsm cotton fleece hoodie with a glow-in-the-dark screen print. Each unit is individually numbered.',
  'Heavyweight cotton fleece hoodie with a glow-in-the-dark print. Numbered limited run.',
  70, 'apparel', 40, 'hoodie1.jpg',
  '[{"label":"Material","value":"400gsm cotton fleece"},{"label":"Print","value":"Glow-in-the-dark screen print"},{"label":"Sizes","value":"S – 3XL"},{"label":"Edition","value":"Numbered limited run"}]'
),
(
  '1337 Wing T-Shirt',
  'Combed cotton tee with a rotating set of print designs across drops. Lightweight and breathable.',
  'Combed cotton tee, rotating print designs each drop.',
  35, 'apparel', 60, 'tshirt1.jpg',
  '[{"label":"Material","value":"Combed cotton"},{"label":"Print","value":"Screen print"},{"label":"Sizes","value":"S – 3XL"},{"label":"Edition","value":"Rotating drop"}]'
),
(
  'USB Rubber Ducky',
  'HID injection platform running DuckyScript 3.0. Ships preloaded with a safe demo payload. Compatible with Windows, Linux, and macOS.',
  'HID injection device running DuckyScript 3.0. Ships with a demo payload preloaded.',
  80, 'usb_attack_tool', 15, 'usbducky.jpg',
  '[{"label":"Interface","value":"USB-A and USB-C"},{"label":"Storage","value":"128MB"},{"label":"Script","value":"DuckyScript 3.0"},{"label":"OS Support","value":"Windows / Linux / macOS"},{"label":"Type","value":"HID injection device"}]'
),
(
  'Custom Keycaps',
  'PBT double-shot keycap set with glow-in-the-dark legends. MX switch compatible, ANSI layout.',
  'PBT double-shot keycaps with glow-in-the-dark legends. MX compatible.',
  45, 'accessory', 30, 'keycaps.jpg',
  '[{"label":"Material","value":"PBT double-shot"},{"label":"Backlight","value":"Glow-in-the-dark"},{"label":"Switch","value":"MX compatible"},{"label":"Layout","value":"ANSI 104"}]'
),
(
  '1337 Wing Mesh Node',
  'Meshtastic-based LoRa mesh node. Encrypted, peer-to-peer networking with no internet dependency. Useful for field ops, disaster prep, or general off-grid comms.',
  'Meshtastic LoRa node for encrypted, internet-free communication.',
  200, 'network_tool', 10, 'mesh.jpg',
  '[{"label":"Protocol","value":"Meshtastic / LoRa"},{"label":"Range","value":"Up to 15km, open terrain"},{"label":"Battery","value":"3000mAh"},{"label":"Encryption","value":"AES-256"},{"label":"Network","value":"No internet required"}]'
),
(
  '1337 Wing Revenant',
  'Linux-first laptop built for real day-to-day security work. Fully repairable and upgradeable. Ships with Kali or Arch pre-installed, or any distro on request.',
  'Linux-first laptop, fully repairable and upgradeable, ThinkPad-inspired chassis.',
  1000, 'computer', 5, 'computer.jpg',
  '[{"label":"CPU","value":"Intel Core i7 155H (Meteor Lake)"},{"label":"RAM","value":"16GB DDR5"},{"label":"Storage","value":"512GB NVMe SSD"},{"label":"OS","value":"Any Linux distro, custom order"},{"label":"Display","value":"14\" IPS 1080p"},{"label":"Repairability","value":"Fully modular"}]'
),
(
  '1337 Wing Cyberdeck',
  'Portable security platform built around a Raspberry Pi CM4, running full Kali Linux ARM. Fits in a backpack. 7" touchscreen, all-day battery.',
  'Portable Kali Linux ARM platform built around a Raspberry Pi CM4.',
  300, 'computer', 8, 'cyber.jpg',
  '[{"label":"SBC","value":"Raspberry Pi CM4"},{"label":"Display","value":"7\" touchscreen"},{"label":"Battery","value":"10000mAh"},{"label":"OS","value":"Kali Linux ARM"},{"label":"Connectivity","value":"WiFi + Ethernet"}]'
);
