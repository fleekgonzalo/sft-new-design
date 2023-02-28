<script>
    import {createEventDispatcher} from "svelte";
    import {icons} from "../scripts/assets.js";

    export let options = []
    let selected = "";
    export let label;
    export let staticLabel = false;
    let show = false

    const dispatch = createEventDispatcher();

    function onSelect(option) {
        dispatch('select', {
            selected: option
        });
        selected = option
        show = false
    }

    function toggleDropdown() {
        show = !show
    }
</script>

<div>
  <button type="button" on:click={()=>toggleDropdown()} class="flex items-center justify-between relative">
    <slot name="icon"></slot>
    <span class="pr-3">{selected && !staticLabel ? selected.displayName : label}</span>
    <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.9268 1.79102L7.96359 8.99275L1.00042 1.79102" stroke="white" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round"/>
    </svg>
  </button>
  {#if show}
    <div class="flex flex-col pl-3 px-5 items-start absolute top-14 dropdown rounded-b-md z-10">
      {#each options as option}
        <button class="py-1 flex items-center" type="button" on:click={()=>onSelect(option)}>
          {#if option.icon}
            <img class="pr-3" src={icons[option.icon]} alt={option?.displayName}/>
          {/if}
          <span class="select-label">{option.displayName}</span>
        </button>
      {/each}
    </div>
  {/if}
</div>
<style>
    .dropdown {
        background: #A2A1B0;
    }
</style>