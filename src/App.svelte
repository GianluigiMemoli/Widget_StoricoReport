<script>
  import { WIDGET_DEFAULT_DIMENSION, WIDGET_MAX_DIMENSION, WIDGET_MIN_DIMENSION, isResizable, BACKGROUND, WIDGET_NAME, WIDGET_ID, CONFIGURATION, DEFAULT_CONFIGURATION } from "./Content/Constants";
  import Wrapper from "./Wrapper.svelte";
  import WidgetOptions from './widgetOptions.svelte';
  import Grid from "svelte-grid";
  import gridHelp from "svelte-grid/build/helper/index.mjs";
  import { MaterialApp } from "svelte-materialify";
  import {onMount} from 'svelte'

  // Get APIKEY
  const url = new URL(window.location.href);
  const APIKEY = url.searchParams.get("apikey");

  // Options visibility
  let isReloading = false;
  let isOptionsVisible = null;
  let optionsState = null;
  let optionsDataItem = null;

  const id = () => "_" + Math.random().toString(36).substr(2, 9);

  let items = [];

  const cols = [
    [ 3200, 10 ],
  ];

  onMount(() => {

    sessionStorage.setItem("widget-state-save", JSON.stringify(DEFAULT_CONFIGURATION));

    addWidget()
    .then(() => console.log("widget loaded"));

  });

  async function addWidget() {
    items.push({
      10: gridHelp.item({ 
        x: 0,
        y: 0,
        w: WIDGET_DEFAULT_DIMENSION.w,
        h: WIDGET_DEFAULT_DIMENSION.h,
        max: WIDGET_MAX_DIMENSION,
        min: WIDGET_MIN_DIMENSION,
        fixed: !isResizable
      }),
      id: id(),
      widgetId: WIDGET_ID,
      background: BACKGROUND,
      name: WIDGET_NAME,
      state: DEFAULT_CONFIGURATION,
      widget: (await import("./Content/Widget.svelte")).default
    });
  }

  async function checkToken() {
		let params = new FormData();
    params.append("apikey", APIKEY)
		let response = await fetch("https://sqd.sensesquare.eu:5002/check_token", {
			body: params,
			method: "POST"
		});
		let result = await response.json();
		return result;
	}

  function reload() {
    isReloading = true;
    setTimeout(() => {
      isReloading = false;
    }, 100);
  }

</script>

<MaterialApp>

  <div class=demo-container>

    {#await checkToken()}

      ...

    {:then result} 
    
      {#if result.response_code === 200}
          
        {#if !isReloading}

          <Grid bind:items={items} rowHeight={70} let:item let:dataItem {cols}>

            <div class=demo-widget style={`background: ${dataItem.background} !important`}>
                <Wrapper 
                  widget={dataItem.widget}
                  apikey={APIKEY}
                  state={dataItem.state}
                  on:changeOptions={(e) => {
                    isOptionsVisible = e.detail.widget;
                    optionsState = e.detail.state;
                    optionsDataItem = dataItem;
                  }}  
                />  
            </div>
          
          </Grid>

        {/if}

        {#if isOptionsVisible !== null}

          <WidgetOptions 
              name={WIDGET_NAME}
              widget={isOptionsVisible} 
              apikey={APIKEY} 
              state={optionsState} 
              configuration={CONFIGURATION}
              background={BACKGROUND}
              on:saveState={(e) => {
                  optionsDataItem.state = e.detail;
                  isOptionsVisible = null;
                  optionsDataItem = null;
                  optionsState = null;
                  reload();
              }}
              on:close={() => {
                  isOptionsVisible = null;
                  optionsDataItem = null;
                  optionsState = null;
              }}
          />

        {/if}

      {:else}

      Errore nella checkToken

      {/if}

    {:catch e}

      Errore nella checkToken

    {/await}

  </div>

</MaterialApp>

<style>
  
  :global(body){
    background-color: #f1f1f1;
  }

  :global(.s-app){
    background-color: rgba(0,0,0,0) !important;
  }

  .demo-widget {
    height: 100%;
    width: 100%;
   border-radius: 16px !important;
    background-color: #fff;
    padding: 8px;
    overflow: auto;
  }

  .demo-container {
    max-width: 3200px;
    width: 100%;
    margin: 0 auto;
  }
</style>