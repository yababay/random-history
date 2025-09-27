<script lang="ts">

    import Checkbox from '../input/Checkbox.svelte'
    import Field from '../input/Field.svelte';

    let hours = 0
    
    const getRussianDayOfWeek = (date = new Date) => date.toLocaleString("ru-RU", {weekday: 'long', timeZone: "Europe/Moscow"})

    const dates = new Array<Date>(14).fill(new Date)
        .map(date => {
            const updated = new Date(date)
            updated.setHours(date.getHours() + hours)
            hours += 24
            return updated
        })

    const mondayIndex = dates.findIndex(day => day.getDay() === 1)
    if(typeof mondayIndex !== 'number') throw 'no monday'
    const days = dates
        .slice(mondayIndex, mondayIndex + 7)
        .map(date => getRussianDayOfWeek(date))

    export let label: string, checked: string[] = []

</script>

<Field {label}>
    <div class="ps-3 d-flex gap-3 flex-wrap w-75">
        {#each days as day, i}
                <Checkbox label={day} name={`day-of-week-${i}`} checked={checked.includes(day)} value={day}/>
        {/each}
    </div>
</Field>
