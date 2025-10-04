<script lang="ts">
    let data: any = null;
    let loading = false;
    let error: any = null;

    const authenticate = async () => {
        loading = true;
        error = null;

        try{
            const res = await fetch("/api/auth/test");
            if (!res.ok){
                throw new Error("Failed to communicate to service");
            }
            data = await res.json();
        } catch (err: any){
            error = err.message;
        } finally {
            loading = false;
        }

    }
</script>

<button onclick = {authenticate} disabled={loading}>
    {loading ? "Loading..." : "Login"}
</button>

{#if error}
    <p>Error: {error}</p>
{/if}

{#if data} 
    <p>Data: {data}</p>
{/if}
