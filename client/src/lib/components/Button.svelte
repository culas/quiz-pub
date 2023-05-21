<button on:click
        type="button"
        {...$$props}
        class={`btn uppercase font-bold ${$$props.class || 'variant-filled-primary'}`}>
	<slot />
</button>
