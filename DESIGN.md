# Kavvusia – Design System (prototyp strony głównej)

**Świat:** domowa waga do kawy z minutnikiem. Strona zachowuje się jak przyrząd: wybierasz metodę parzenia, wyświetlacz pokazuje gramy, proporcję i czas, a pod wagą „leżą” pasujące kawy.

## Kolory
| Token | Hex | Rola |
|---|---|---|
| `--roast` | #D77B33 | pole marki: nagłówek, hero, stopka, kupon; aktywny klawisz/filtr |
| `--roast-deep` | #A4511A | akcent tekstowy na jasnym (origin, rodzaj poradnika) |
| `--espresso` | #422212 | obudowa wagi, panel filtrów, sekcja palarni |
| `--ink` | #24130A | tekst, przyciski główne |
| `--lcd` / `--lcd-ink` | #C9D3B4 / #1E2417 | wyświetlacz – wyłącznie dla pomiarów |
| `--paper` | #FBF6EF | karty kaw i przepisów |
| `--counter` | #F1E7DA | tło strony („blat”) |
| `--muted` | #6E4F3C | tekst drugorzędny |
Na pomarańczu tekst zawsze `--ink` (biały ma za niski kontrast).

## Typografia
- **Bricolage Grotesque** (Google Fonts) – cały tekst; nagłówki 800, tracking −0.045em, `text-wrap:balance`.
- **DSEG7 / DSEG14** (jsDelivr `dseg@0.46.0`) – tylko liczby z pomiarów (gramy, czas, proporcja, licznik wyników, kod rabatowy), zawsze z „duchem” 8.8.8 pod spodem.

## Komponenty
- **Waga (hero):** obudowa espresso, LCD, 4 fizyczne klawisze metod (`aria-pressed`, wciśnięty = pomarańczowy i obniżony), TARA, START (minutnik z krokami przepisu).
- **Karta kawy:** torebka kraft z kolorową etykietą (kolor = kawa), badge, `KRAJ · PROCES`, nazwa, 3 nuty oddzielone „/”, identyczne skale 5-segmentowe (Palenie w pomarańczu; Kwasowość, Słodycz, Body w espresso), cena „/ 250 g”, „Do koszyka”.
- **Finder (wtyczka „Kavvusia Finder”):** panel espresso, segmenty Metoda / Palenie (pojedynczy wybór), Smak (wielokrotny), wyszukiwarka, licznik w DSEG7, pusty stan „-0-”.
- **Kupon:** paragon z wagi z kodem na mini-LCD.
- **Dziennik palenia:** krzywa temperatury (SVG, rysuje się przy wejściu) + 5 etapów z czasem w DSEG7.
- **Przepis:** karta z paskiem LCD (kawa / woda / czas).

## Ruch
Jeden autorski moment: odczyt wagi „dobiega” do wartości (ease-out expo, 650 ms) przy zmianie metody. Do tego delikatne odsłanianie sekcji i rysowanie krzywej. `prefers-reduced-motion` wyłącza wszystko.

## Zasady
- Informacja „SKLEP DEMONSTRACYJNY” jest częścią designu: pasek na górze, toast przy koszyku, paragon, newsletter, stopka.
- Żadnych emoji ani glifów zamiast ikon – ikony to własne SVG o kresce 2px.
- Brak eyebrow/kickerów nad nagłówkami.
