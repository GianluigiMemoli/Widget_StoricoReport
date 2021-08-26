
<script>
    /* NON MODIFICARE -> INIZIO */
    import Storico from "./Storico.svelte";

    export let showResult, showError, showLoading, showMaintenance, showProgressBar, updateProgressBar, getFormData;
    export let WIDGET_VISIBLE = false;
    /* NON MODIFICARE -> FINE */

    /* ESEMPIO FUNZIONAMENTO ->  INIZIO */
    import {Button} from 'svelte-materialify/src';

    setTimeout(() => {
        showResult();
    });
    /* ESEMPIO FUNZIONAMENTO ->  FINE */

</script>

<main style={WIDGET_VISIBLE ? "" : "display: none"}>

  <Storico on:loading={(e) => {
      if(e.detail.isLoading){
          showLoading(e.detail.text);
      } else { showResult()}
  }}></Storico>

</main>

<style>

    main {
        width: 100%;
        height: 100%;
    }

</style>
