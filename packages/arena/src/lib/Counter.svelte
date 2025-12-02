<script lang="ts">
import type {User} from "@tzar/shared";
let count: number = $state(0)
const increment = () => {
    count += 1
}
let user: User = $state({user: "person"})

</script>

<button onclick={increment}>
count is {count}
</button>

<p>User is {user.user}</p>
