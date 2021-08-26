<script>
	import Widget from "./Content/Widget.svelte";
	import { MaterialApp, ProgressCircular, ProgressLinear, Icon } from 'svelte-materialify';
	import { mdiAlertBox, mdiAccountHardHat } from '@mdi/js';

	export let token = null;
	export let apikey = null;

	// Status options
	const LOADING = 0, DONE = 1, ERROR = -1, MAINTENANCE = 2;

	// Loading options
	const GENERIC_LOADING = 0, PROGRESSBAR_LOADING = 1;

	// Status widget
	let STATUS_WIDGET = LOADING;
	let TEXT_DESCRIPTION = "";
	let LOADING_TYPE = GENERIC_LOADING;
	let LOADING_VALUE = 0;

	function getFormData() {
		let params = new FormData();
		console.log(apikey);
		if(token)
			params.append("token", token);
		else if(apikey)
			params.append("apikey", apikey);

		return params
	}

</script>

<main>

	<MaterialApp>
	
		<Widget 

			WIDGET_VISIBLE={STATUS_WIDGET === DONE}

			showResult={() => {				
				STATUS_WIDGET = DONE;
				LOADING_VALUE = 0;
				TEXT_DESCRIPTION = "";
			}}

			showError={text => {
				STATUS_WIDGET = ERROR;
				LOADING_VALUE = 0;
				TEXT_DESCRIPTION = text;
			}}

			showMaintenance={text => {
				STATUS_WIDGET = MAINTENANCE;
				LOADING_VALUE = 0;
				TEXT_DESCRIPTION = text;
			}}

			showLoading={text => {				
				STATUS_WIDGET = LOADING;
				LOADING_TYPE = GENERIC_LOADING;
				LOADING_VALUE = 0;
				TEXT_DESCRIPTION = text;
			}}

			showProgressBar={(text, value=0) => {
				STATUS_WIDGET = LOADING;
				LOADING_TYPE = PROGRESSBAR_LOADING;
				TEXT_DESCRIPTION = text;
				LOADING_VALUE = value;
			}}

			updateProgressBar={(text, value=0) => {
				if(STATUS_WIDGET === LOADING && LOADING_TYPE === PROGRESSBAR_LOADING){
					TEXT_DESCRIPTION = text;
					LOADING_VALUE = value;
				}
			}}

			{getFormData}

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
				</div>

			</div>
		
		{/if}

	</MaterialApp>

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

</style>