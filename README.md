# Venomous Snakes Explained – website

Everything on the site is generated from one workbook, `data/snake_venom_danger.xlsx`. You edit the workbook, run one command, and upload the `dist` folder to Cloudflare Pages.

## What's in this folder

| Path | What it is |
|---|---|
| `data/snake_venom_danger.xlsx` | The dataset. The only file you edit for content. |
| `build.py` | Builds the whole site into `dist/`. |
| `src/` | The fixed pages (home, Scores explained, Venom types, Species list), plus the shared style (`site.css`) and header and footer (`common.js`). |
| `photos/overrides.csv` | Use it to choose or block a photo by hand. |
| `photos/photos.json` | Created by the build: the photo chosen for each species and its credit. |
| `dist/` | The finished site. This is what you upload. |

## One-time setup

1. Install Python 3.9 or newer (python.org).
2. Open a terminal in this folder and run:
   `pip install -r requirements.txt`

## Building the site

```
python build.py
```

This reads the workbook, fetches photos from iNaturalist (only for species that don't have one yet), and writes the site into `dist/`. The first run takes about 5 minutes, because it waits a second between iNaturalist requests; later runs take seconds.

Useful options:

- `python build.py --no-photos` builds without contacting iNaturalist.
- `python build.py --refresh-photos` re-checks every species for a better photo.
- `python build.py --base-url https://your-domain` also writes `sitemap.xml` for search engines.

**After editing the workbook, save it in Excel before building.** The build reads the scores Excel calculated, and a workbook saved by another program may not contain them.

## Photos

The build takes each species' photo from its iNaturalist species page and only uses photos licensed **CC0, CC BY or CC BY-SA**. Non-commercial (NC) and no-derivatives (ND) photos are skipped, so a future paid book link won't cause licence problems. Each photo is credited under the image, with a link back to the photo on iNaturalist.

Species without a suitable photo are listed in `photos/missing.txt`. To set a photo by hand, add a row to `photos/overrides.csv`:

```
scientific_name,url,attribution,licence,page
Naja annulata,https://…/large.jpg,"(c) Jane Doe, some rights reserved (CC BY)",cc-by,https://www.inaturalist.org/photos/123
```

To hide the photo for a species, put `none` in the licence column.

Check a few photos after the first build. iNaturalist's featured photo is usually good, but occasionally shows a juvenile, a similar species or a poor angle.

## Publishing to Cloudflare Pages

**Direct upload (simplest):**

1. In the Cloudflare dashboard, go to **Workers & Pages → Create → Pages → Upload assets**.
2. Name the project and drag the whole `dist` folder in.
3. Add your domain under the project's **Custom domains** tab.

**With Wrangler (command line):**

```
npx wrangler pages deploy dist --project-name venomous-snakes-explained
```

Cloudflare serves `sp-daboia-russelii.html` at `/sp-daboia-russelii` automatically. `_headers`, `404.html` and `robots.txt` are already in `dist/`.

## Updating the site later

1. Edit the workbook in Excel and save it.
2. Run `python build.py`.
3. Upload `dist/` again (or run the Wrangler command).

## Adding a species

1. In the workbook, add the species to **Species** and **Scores**, and to **Combined** (copy the formulas down from the row above).
2. Add at least one Used LD50 row.
3. Run the QA Checks sheet: every check row should read OK.
4. Build. The new species gets its own page, a place on the home chart and a row in the species list.
