<script lang="ts">

    import './fieldset.scss'
    import Input from './Input.svelte'
    import Field from './Field.svelte'
    import Textarea from './Textarea.svelte'
    import Tags from './tags/index.svelte'

    export let 
    rows: number = 3, 
    message: string = '', 
    notes: string = '', 
    tags: string[] | null = [],
    back: string = '1'

    const title = 'Черновики'

    const width = 3

</script>

<fieldset>
    <input name="back" type="hidden" value={back}/>
    <legend>Коллекция «{title}»</legend>
    <section class="d-flex flex-column justify-content-between align-items-center m-0 h-100">
        <slot />
        {#if rows}
            <Field label="Описание:" {width} top={true}>
                <Textarea {rows} value={message}/>
            </Field>
        {/if}
        <!-- Tags {width} url="/api/tags" tags={tags || []} / -->
        <Field label="Тэги:" {width}>
            <Input name="tags" value={tags?.join(' ')}/>
        </Field>
        <Field label="Примечания:" {width}>
            <Input name="notes" value={notes}/>
        </Field>
        <div class="mb-0 me-3 w-100 d-flex justify-content-end gap-5">


            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="vk" id="checkIndeterminate" name="vk">
                <label class="form-check-label" for="checkIndeterminate">
                  в чат ВКонтакте
                </label>
            </div>
              
            <button class="btn btn-primary" type="submit" formaction="?/skip">Пропустить</button>
            <button class="btn btn-primary" type="submit" formaction="?/save">Сохранить</button>
        </div>
    </section>
</fieldset>

<!-- style lang="scss">

    $space-around: .5rem;
    $margin-top: $space-around * 2;
    $full-height: calc(100vh - $space-around - $margin-top);

    fieldset {
        box-sizing: border-box;
        margin: 0;
        padding: $space-around;
        margin: $space-around;
        border: 1px solid silver;
        border-radius: $space-around;
        margin-top: $margin-top;    
        height: $full-height;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        legend {
            margin: 0;
            background-color: white;
            width: fit-content;
            padding-inline: $space-around;
            margin-top: calc($space-around * -2 - 3px);
            font-size: smaller;
            color: grey;
        }
    }
</style -->
