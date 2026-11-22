# Kavvusia – prototyp sklepu z kawą

Statyczny prototyp (HTML/CSS/JS) sklepu internetowego palarni kawy **Kavvusia** – projekt zaliczeniowy z przedmiotu „Zarządzanie Treścią (CMS)”, PJATK.

> **Sklep demonstracyjny.** Produkty są fikcyjne, zamówień nie realizujemy, płatności nie pobieramy.

Docelowo strona zostanie przeniesiona na WordPress + WooCommerce.

## Uruchomienie lokalnie

Koszyk zapisuje się w `localStorage`, więc stronę trzeba serwować przez serwer (nie `file://`):

```bash
python3 -m http.server 8080
```

albo dwuklik na `uruchom.command` (macOS) i wejście na http://localhost:8080.

## Zespół

Bartosz Urbański, Wojciech Huzar, Piotr Michalak, Wiktor Chudy, Oskar Erdenberger.
