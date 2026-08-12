/* =========================================================
   Dzidziuś — konfiguracja.
   Jedyny plik, który zwykle trzeba ruszyć.
   ========================================================= */

window.DZIDZIUS_CONFIG = {

  /* --- dziecko --- */
  babyName: 'Nela',
  birth: '2026-08-08T04:00',   // data i godzina narodzin (czas lokalny)

  /* --- doba --- */
  dayStartHour: 4,             // o tej godzinie zaczyna się nowa doba

  /* --- sugerowana ilość mleczka --- */
  // Wzór: (doba życia + mlOffset) * mlStep, nie więcej niż mlMax.
  // Przy ustawieniach poniżej: doba 1 = 20 ml, doba 6 = 70 ml, doba 9 i dalej = 100 ml.
  // Jeśli pierwsza doba ma być 10 ml, zmień mlOffset na 0.
  mlStep: 10,
  mlOffset: 1,
  mlMax: 100,

  /* --- granice ręcznego wpisu ilości --- */
  mlMin: 0,
  mlHardMax: 500,

  /* --- synchronizacja między telefonami ---
     Klucz "publishable" jest z założenia jawny — leży w kodzie strony i tak.
     Klucz "secret" (sb_secret_...) NIGDY tutaj nie trafia.
     Adres bez końcówki /rest/v1/ — kod dokleja ją sam. */
  supabaseUrl: 'https://vygmijiuwyzmtfirpovh.supabase.co',
  supabaseKey: 'sb_publishable_TzwBih02GSMvRJLsLZW2kw_LZhz6kSX',
  supabaseTable: 'events'
};
