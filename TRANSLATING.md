# Translating

We do not use Crowdin. The person or the AI agent that changes an English text also translates it, in the same PR.

## Rules

1. When you add a key to the English file, add the key to every other locale file in the same PR.
2. When you change the English text of a key, translate the key again in every locale file.
3. When you remove a key from the English file, remove the key from every locale file.
4. Put each key at the same position as in the English file.
5. Do not leave a value empty (`""`). An empty value shows English to the user.
6. Keep `{{placeholders}}`, `$t(...)` and tags such as `<0>` and `</0>` exactly as in English. Translate only the text around and between them.
7. Keep brand, product, chain, token, wallet and protocol names in English. Examples: Jumper, LI.FI, Ethereum, USDC, MetaMask.
8. Use the plural forms of the locale. See [Plural forms](#plural-forms).
9. Keep each text near the length of the English text. Buttons and labels have little space.
10. Use the register, the style rules and the glossary of the locale in [`docs/i18n/`](./docs/i18n/).

## How to translate

1. Add or change the English text.
2. For each locale, use its glossary file `docs/i18n/<locale>.md`. Then write the translation.
   - For a few keys, do not read the whole file. Read its first lines (register and style). Then search the file for the terms in your English text.
   - For many keys, use one agent for each locale. Each agent reads only its own glossary file.
3. Use the key path as context. `button.*` is a button label, `tooltip.*` is a tooltip and `error.*` is an error message.
4. Write as a native speaker who uses crypto apps every day. Do not translate word by word.
   - If crypto users of a language use the English word, keep the English word. The glossary tells you which words to keep.
   - Use the same word for the same concept in all texts of a locale. Read the existing texts of the locale near your key.
5. When a text inserts another key with `$t(...)`, make the inserted text fit the sentence.
6. Run the test. Fix every key that it names.
7. Read each new text again as a user of that locale. Fix text that sounds literal.

## "Exchange" has three senses

- The Exchange tab and header (swap and bridge in one place): use glossary term 5.
- A centralized exchange such as Binance: use the normal local word for a crypto exchange. The note of term 5 often names it.
- The DEX list in the settings: use the DEX term (term 27).

## Plural forms

i18next selects the plural form with `Intl.PluralRules`. A plural key in English has the forms `_one` and `_other`. Each locale needs exactly the forms in this table.

| Locale | Forms | Example numbers |
| --- | --- | --- |
| `bn` | `_one`, `_other` | `one`: 0, 1; `other`: 2, 3, 4, 5, 6, 7, … |
| `de` | `_one`, `_other` | `one`: 1; `other`: 0, 2, 3, 4, 5, 6, … |
| `es` | `_one`, `_many`, `_other` | `one`: 1; `many`: 1 000 000, 2 000 000; `other`: 0, 2, 3, 4, 5, 6, … |
| `fr` | `_one`, `_many`, `_other` | `one`: 0, 1, 1.5; `many`: 1 000 000, 2 000 000; `other`: 2, 3, 4, 5, 6, 7, … |
| `hi` | `_one`, `_other` | `one`: 0, 1; `other`: 2, 3, 4, 5, 6, 7, … |
| `id` | `_other` | `other`: 0, 1, 2, 3, 4, 5, … |
| `it` | `_one`, `_many`, `_other` | `one`: 1; `many`: 1 000 000, 2 000 000; `other`: 0, 2, 3, 4, 5, 6, … |
| `ja` | `_other` | `other`: 0, 1, 2, 3, 4, 5, … |
| `ko` | `_other` | `other`: 0, 1, 2, 3, 4, 5, … |
| `pl` | `_one`, `_few`, `_many`, `_other` | `one`: 1; `few`: 2, 3, 4, 22, 23, 24, …; `many`: 0, 5, 6, 7, 8, 9, …; `other`: 1.5 |
| `pt` | `_one`, `_many`, `_other` | `one`: 0, 1, 1.5; `many`: 1 000 000, 2 000 000; `other`: 2, 3, 4, 5, 6, 7, … |
| `th` | `_other` | `other`: 0, 1, 2, 3, 4, 5, … |
| `tr` | `_one`, `_other` | `one`: 1; `other`: 0, 2, 3, 4, 5, 6, … |
| `uk` | `_one`, `_few`, `_many`, `_other` | `one`: 1, 21, 31, 41, 51, 61, …; `few`: 2, 3, 4, 22, 23, 24, …; `many`: 0, 5, 6, 7, 8, 9, …; `other`: 1.5 |
| `vi` | `_other` | `other`: 0, 1, 2, 3, 4, 5, … |
| `zh` | `_other` | `other`: 0, 1, 2, 3, 4, 5, … |

- If the English `_other` text has `{{count}}`, every form must have `{{count}}`.
- Two forms do not need `{{count}}`: `_zero`, and `_one` when the locale uses `one` only for the number 1.
- A locale has `_zero` only when the English file has it.

## Files in this repo

- English files: `packages/widget/src/i18n/en.json` and `packages/wallet-management/src/i18n/en.json`.
- Locale files: `<locale>.json` in the same folders.

## Locale glossaries

- [`bn` — Bengali](./docs/i18n/bn.md)
- [`de` — German](./docs/i18n/de.md)
- [`es` — Spanish](./docs/i18n/es.md)
- [`fr` — French](./docs/i18n/fr.md)
- [`hi` — Hindi](./docs/i18n/hi.md)
- [`id` — Indonesian](./docs/i18n/id.md)
- [`it` — Italian](./docs/i18n/it.md)
- [`ja` — Japanese](./docs/i18n/ja.md)
- [`ko` — Korean](./docs/i18n/ko.md)
- [`pl` — Polish](./docs/i18n/pl.md)
- [`pt` — Portuguese](./docs/i18n/pt.md)
- [`th` — Thai](./docs/i18n/th.md)
- [`tr` — Turkish](./docs/i18n/tr.md)
- [`uk` — Ukrainian](./docs/i18n/uk.md)
- [`vi` — Vietnamese](./docs/i18n/vi.md)
- [`zh` — Chinese](./docs/i18n/zh.md)
