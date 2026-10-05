# Launch checklist

The site is complete and every page builds. These are the items still open, in the order I'd tackle them.

## Before going live

1. **Expert review of the venom types page and the "Bitten?" panel.** The panel currently says "Call your local emergency number". Once the reviewer confirms them, add the right numbers for your main audience (for example South Africa) to `src/common.js`.
2. **Photos.** Run `python build.py` on your computer. It couldn't reach iNaturalist from where the site was built, so there are no photos yet. Then look through the species pages and fix any poor choices in `photos/overrides.csv`.
3. **Citations for the explainer pages.** The review notes have been removed from the live pages, but these sources are still needed:
   - Scores explained: the LD50 statistical methods (probit, Spearman–Kärber, Reed–Muench), the claim that LD50 favours fast-acting venoms, the venom yield statements, and the onset reasoning (treatment delay).
   - Venom types: one source per row of the "How some well-known venoms work" table. The boomslang and twig snake procoagulant labels also need a source.
4. **Domain.** Add your domain in Cloudflare, then rebuild with `--base-url https://your-domain` to create `sitemap.xml`.
5. **A way to report errors.** The footer has no contact link yet. Decide on an email address or form, and add it to the footer in `src/common.js`.

## Data gaps (fine to launch with; the site shows "not yet" wherever data is missing)

- **16 species have no venom yield, so no Venom Hazard.** Mirtschin et al. (2006) *Ecotoxicology* 15:531 would cover about 9 of them.
- **Small-eyed snake and olive whip snake:** Encounter reasons are written, but there's no Encounter rating, bite propensity, onset or antivenom access yet, so no Human Risk score.
- **Speckled brown snake:** the Encounter reason says central Australia (QLD, NT, SA), but the Region column says "Central Queensland". Make them match.
- **Venom effects:** 31 species are recorded only as "Hemotoxic" with no subtype, the Hemorrhagic column is empty for every species, and the source column (AD) says "source needed" throughout.
- **Still unsourced:** eastern diamondback deaths (US) and the Chinese cobra case-fatality rate. Both show "(source not yet found)" on the site.

## After launch

- Update the site: edit the workbook, save it in Excel, run `python build.py`, and upload `dist/` again.
- Book link: when it's ready, add it to the footer in `src/common.js`. The photo licences already allow for this.
