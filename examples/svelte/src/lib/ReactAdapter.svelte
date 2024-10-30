<script lang="ts">
import { createElement } from 'react'
import type { Root } from 'react-dom/client'
import { createRoot } from 'react-dom/client'
import { onDestroy, onMount } from 'svelte'

let container: HTMLDivElement
let root: Root

onMount(() => {
  const { element, children, class: _, ...props } = $$props
  try {
    root = createRoot(container)
    root.render(createElement(element, props, children))
  } catch (e) {
    console.warn('ReactAdapter failed to mount.', e)
  }
})

onDestroy(() => {
  try {
    root.unmount()
  } catch (e) {
    console.warn('ReactAdapter failed to unmount.', e)
  }
})
</script>

<div bind:this={container} class={$$props.class}></div>
