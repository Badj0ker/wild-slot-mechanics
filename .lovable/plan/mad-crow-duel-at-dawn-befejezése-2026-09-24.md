# Mad Crow – Duel at Dawn befejezése

## Cél
A jelenlegi félkész játékból teljesen játszható Mad Crow nyerőgép készül, amelynek központi eleme a Duel at Dawn párbaj és a kiterjedő wild oszlopok.

## Megvalósítás
- Elkészül a teljes főképernyő: 5×5-ös játékmező, egyenleg, tétállítás, pörgetés, Bonus Buy és nyereménytábla.
- A VS találat után két bandita látványos párbaja jelenik meg.
- Minden érintett oszlop saját szorzót kap; a párbaj után az oszlop teljes magasságban wild lesz, és a nyertes szorzó jól láthatóan rákerül.
- Több wild oszlop esetén minden szorzó külön megjelenik, a közös nyerővonalon szereplő szorzók pedig összeadódnak.
- Megmarad a kizárólag Duel at Dawn bónuszkör: 3 scatter, 10 ingyenpörgetés, gyakoribb VS találatok és 100× tétű Bonus Buy.
- A játék magyar feliratokat, Mad Crow gótikus temetői megjelenést és mobilon is használható elrendezést kap.

## Ellenőrzés
- Kipróbálom az alap pörgetést, tétállítást és a nyereménytábla megnyitását.
- Ellenőrzöm a párbaj → szorzó felfedése → teljes wild oszlop folyamatot.
- Asztali és mobil méretben is ellenőrzöm, hogy a kezelőszervek és szorzók jól láthatók maradjanak.

## Technikai részletek
A már elkészült játékmotort és grafikákat használom tovább. A párbaj időzített állapotokon keresztül fedi fel az oszlopok szorzóit, majd a kiértékelés a kiterjesztett wild mezővel számolja a vonalnyereményt. A jelenlegi tárolás böngészőben őrzi az egyenleget és a tétet; valódi pénzes működés nem része ennek a változatnak.
