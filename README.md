#Storico report

## Funzionalità del widget
Il widget ha il compito di mostrare una lista di report validati, ricercata in base all'anno e al mese 
dei report.


### showResult()
Questo comando consentirà di mostrare il contenuto del file widget.svelte, esso servirà alla fine di ogni caricamento

### showError(text)
Questo comando consentirà in caso di errore di spiegare all'utente cosa è successo (usare solo se l'errore verificatosi non consente il funzionamento del widget)

### showMaintenance(text)
Questo comando consentirà in caso di manutenzione di spiegare all'utente cosa sta succedendo

### showLoading(text)
Questo comando mostrerà all'utente una barra di caricamento generica (non mostra il progresso del caricamento)

### showProgressBar(text, value)
Questo comando mostrerà la barra di caricamento (mostra il progresso del caricamento), il parametro "value" indica il valore iniziale del caricamento

### updateProgressBar(text, value)
Questo comando consentirà di eseguire un update della barra di caricamento (in modo tale da aggiornare il progresso)

## Costanti del widget
All'interno del file "Constants.js" vi sono svariate costanti che possono essere modificate a seconda del widget che si vuole sviluppare

### THEME
la costante "THEME" non deve essere modificata, essa contiene i colori da usare nel widget (è importata di default nel file Widget.svelte)
![Esempio tema](https://raw.githubusercontent.com/MaxMoffa/public-files/main/Palette%20Colori.png)

### Widget Dimension
Le costanti presenti in questa sezione si riferiscono alla dimensione che il widget può assumere all'interno della griglia (prova a modificarli ed osserva i cambiamenti sul browser)
#### isResizable
Se impostata a false renderà il widget fisso, esso non potrà essere spostato o modificato nella pagina
#### WIDGET_DEFAULT_DIMENSION
Indica la dimensione di default del widget nella griglia
#### WIDGET_MAX_DIMENSION
Indica la dimensione massima del widget nella griglia
#### WIDGET_MIN_DIMENSION
Indica la dimensione minima del widget nella griglia
