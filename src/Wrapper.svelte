<script>
	import { ProgressCircular, ProgressLinear, Icon, Button } from 'svelte-materialify';
	import { mdiAlertBox, mdiAccountHardHat, mdiCog } from '@mdi/js';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let token = null;
	export let apikey = null;
	export let state = null;
	export let showOptions = true;
	export let widget;

	// Status options
	const LOADING = 0, DONE = 1, ERROR = -1, MAINTENANCE = 2, SELECT_SQUARE = 3;

	// Loading options
	const GENERIC_LOADING = 0, PROGRESSBAR_LOADING = 1;

	// Reload
	let reload = false;

	let showOptionsBtn = false;

	// Status widget
	let STATUS_WIDGET = LOADING;
	let TEXT_DESCRIPTION = "";
	let LOADING_TYPE = GENERIC_LOADING;
	let LOADING_VALUE = 0;

	function showResult() {
		STATUS_WIDGET = DONE;
		LOADING_VALUE = 0;
		TEXT_DESCRIPTION = "";
	}

	function showError(text) {
		STATUS_WIDGET = ERROR;
		LOADING_VALUE = 0;
		TEXT_DESCRIPTION = text;
	}

	function showMaintenance(text) {
		STATUS_WIDGET = MAINTENANCE;
		LOADING_VALUE = 0;
		TEXT_DESCRIPTION = text;
	}

	function showLoading(text) {
		STATUS_WIDGET = LOADING;
		LOADING_TYPE = GENERIC_LOADING;
		LOADING_VALUE = 0;
		TEXT_DESCRIPTION = text;
	}

	function showProgressBar(text, value=0) {
		STATUS_WIDGET = LOADING;
		LOADING_TYPE = PROGRESSBAR_LOADING;
		TEXT_DESCRIPTION = text;
		LOADING_VALUE = value;
	}

	function updateProgressBar(text, value=0) {
		if(STATUS_WIDGET === LOADING && LOADING_TYPE === PROGRESSBAR_LOADING){
			TEXT_DESCRIPTION = text;
			LOADING_VALUE = value;
		}
	}

	function getFormData() {
		let params = new FormData();
		if(token)
			params.append("token", token);
		else if(apikey)
			params.append("apikey", apikey);

		return params
	}

	function saveState(state) {
		sessionStorage.setItem("widget-state-save", JSON.stringify(state));
	}

	function getState() {
		if(state !== null)
			saveState(state);
		let save = sessionStorage.getItem("widget-state-save");
		return save ? JSON.parse(save) : save;
	}

	function reloadWidget() {
		reload = true;
		setTimeout(() => reload = false, 0);
	}

	function showOptions_() {
		if(!showOptions)
			return;
		showOptionsBtn = true;
		if(!state){
			dispatch("changeOptions", {
				widget: widget,
				state: null
			})
		}
	}

</script>

<main>

	{#if showOptionsBtn}
	
		<div class="btn-menu-options" on:click={() => dispatch("changeOptions", {
				widget: widget,
				state: state
			})
		}>

			<Icon 
				size="16"
				path={mdiCog} 
			/>

		</div>

	{/if}
	
	{#if !reload}
		
		<svelte:component
			this={widget} 
			WIDGET_VISIBLE={STATUS_WIDGET === DONE}
			{showResult}
			{showError}
			{showMaintenance}
			{showLoading}
			{showProgressBar}
			{updateProgressBar}
			{getFormData}
			state={getState()}
			{saveState}
			{showOptions_}
			on:changeOptions={() => {
				if(showOptions){
					dispatch("changeOptions", {
						widget: widget,
						state: state
					});
				}
			}}
		/>

		{#if STATUS_WIDGET === LOADING}
		
			{#if LOADING_TYPE === GENERIC_LOADING}

				<div class="GENERIC_CONTAINER">

					<div>
						
						<div class="loading-element">
							<ProgressCircular 
								size={70} 
								indeterminate 
								color="success" 
							/>
						</div>

						<span>
							{TEXT_DESCRIPTION}
						</span>

						<div class="btn-reload">
							<Button size="small" on:click={reloadWidget}>
								Riavvia
							</Button>
						</div>

					</div>

				</div>

			{:else}

				<div class="GENERIC_CONTAINER">

					<div>
						<ProgressLinear 
							height="16px" 
							value={LOADING_VALUE} 
						/>

						<span>
							{TEXT_DESCRIPTION}
						</span>

						<div class="btn-reload">
							<Button size="small" on:click={reloadWidget}>
								Riavvia
							</Button>
						</div>

					</div>

				</div>

			{/if}

		{:else if STATUS_WIDGET === ERROR}
		
			<div class="GENERIC_CONTAINER">

				<div>
					<Icon 
						size="64"
						path={mdiAlertBox} 
					/>

					<span>
						{TEXT_DESCRIPTION}
					</span>

					<div class="btn-reload">
						<Button size="small" on:click={reloadWidget}>
							Riavvia
						</Button>

						{#if state}

							<Button class=accent size="small" on:click={() => {
								if(showOptions){
									dispatch("changeOptions", {
										widget: widget,
										state: state
									});
								}
							}}>
								Opzioni
							</Button>

						{/if}

					</div>

				</div>

			</div>
		
		{:else if STATUS_WIDGET === MAINTENANCE}

			<div class="GENERIC_CONTAINER">

				<div>
					<Icon 
						size="64"
						path={mdiAccountHardHat} 
					/>

					<span>
						{TEXT_DESCRIPTION}
					</span>

					<div class="btn-reload">
						<Button size="small" on:click={reloadWidget}>
							Riavvia
						</Button>
					</div>

				</div>

			</div>

		{/if}

	{/if}
		
</main>

<style>

	:global(.s-app){
		width: 100%;
		height: 100%;
	}

	main {
		width: 100%;
        height: 100%;
	}

	.GENERIC_CONTAINER {
		width: 100%;
		height: 100%;
		display: grid;
		place-items: center;
	}

	.GENERIC_CONTAINER > div {
		width: 100%;
		max-width: 600px;
		display: flex;
		flex-direction: column;
	}

	.GENERIC_CONTAINER > div > span {
		text-align: center;
		margin-top: 32px;
	}

	.GENERIC_CONTAINER > div > .loading-element {
		display: grid;
		place-items: center;
	}

	.btn-reload {
		width: 100%;
		padding: 16px 32px;
		display: grid;
		place-items: center;
	}

	.btn-menu-options {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background-color: #fff;
		box-shadow: 0 0 6px rgba(0, 0, 0, 0.6);
		position: absolute;
		top: 16px;
		right: 16px;
		z-index: 1005;
		display: grid;
		place-items: center;
		cursor: pointer;
	}

</style>