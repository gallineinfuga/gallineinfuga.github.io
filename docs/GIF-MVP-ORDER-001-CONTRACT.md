# GIF-MVP-ORDER-001 — Contratto minimo richiesta assistita
Data: 2026-10-13 | STATO: DESIGN; **NON IMPLEMENTATO e NON ATTIVATO**.

## Intento
Affiancare il menù con una composizione di richiesta via WhatsApp senza chiamarla checkout o ordine confermato. La modalità statica GitHub Pages non può garantire disponibilità, prezzi definitivi, pagamento o accettazione.

## Flusso d'uso
1. L'utente seleziona ritiro o consegna (il locale non ha consumo in sede).
2. Vede solo prodotti con disponibilità digitale espressamente ammessa, varianti con prezzo e descrizione non ambigui.
3. Compone righe nel browser, con quantità, eventuali varianti e note. Calcolo totale *indicativo*, non preventivo vincolante.
4. Conferma di voler aprire WhatsApp; l'app forma il testo ma non lo invia da sola.
5. Il locale verifica orario, copertura consegna, quantità, prezzo, allergeni e disponibilità; risponde accettando o rifiutando. Senza risposta, nessun ordine.
6. Eventuali pagamenti e memorizzazione operativa sono fuori MVP-1.

## Contratto JSON suggerito (interno al browser)
```json
{
  "schemaVersion": "1.0",
  "kind": "ORDER_REQUEST_NOT_CONFIRMED",
  "serviceMode": "takeaway",
  "items": [{"productId": "margherita", "variantId": "normale", "quantity": 1}],
  "customerNote": "",
  "indicativeTotalCents": 600,
  "currency": "EUR"
}
```
Il calcolo prezzi deve derivare esclusivamente da `data/site.json`, mai da valori arbitrari del DOM o dal cliente. Nessun invio API fino a progetto backend.

## Regole di dominio bloccanti
- `rosticceria-palermitana` solo al banco: mai aggiungibile dal builder.
- `rosticceria-mignon` per kg: quantità 0,5 / 1,0 / 1,5 ecc.; prezzo moltiplicato per kg.
- Pizza: normale/familiare dai `menuGroups`; aggiunte solo con tipo/quantità esplicitati e prezzo approvato; non inventare opzioni.
- Prezzi multipli senza associazione univoca a variante (es. birre assortite 2,50/3,00): richiedono catalogo più dettagliato **prima** di essere ordinabili.
- Niente orari di consegna o tariffa consegna inventati; niente promessa di esito automatico.
- Nessuna memorizzazione PII in localStorage, cookie, analytics, log o git.
- Lingue IT/EN per ogni messaggio e controllo; escape/validazione di input testo, quantità e URL.
- WhatsApp: conferma manuale da operatore; niente accesso automatico ai dati della chat.
- Se script/configurazione fallisce, mostra link WhatsApp di contatto, non nascondere l'errore.
- Niente integrazione con social o pixel analitici.

## Gate di attivazione
[ ] Listino e ingredienti commercialmente convalidati
[ ] Copertura modalità consegna e criteri disponibilità operatore
[ ] Privacy e base giuridica del trattamento aggiornate per dati richiesti
[ ] Contratto dati stabile con test unitari (no regressioni sui divieti)
[ ] Test manuali 320px, mobile Safari/Chrome, WhatsApp, tastiera
[ ] Prova ordine fittizio con un operatore reale, nessun pagamento
[ ] Decisione commerciale finale per rendere visibile il builder
Senza questi gate si resta in MVP-0.
