<script lang="ts">
  import Counter from './lib/Counter.svelte'
  import AuthButton from "./lib/AuthenticationButton.svelte"
  import Chart from "./lib/CloseMarketChart.svelte"
</script>

<main>
  <div>
    <Chart backgroundColor="#141D24"/>
  </div>

  <div class="card">
    <AuthButton />
  </div> 

</main>

<style>
    
</style>
