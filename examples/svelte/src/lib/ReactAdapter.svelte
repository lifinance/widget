<script>
  import { createElement } from 'react';
  import { createRoot } from 'react-dom/client';
  import { onDestroy, onMount } from 'svelte';

  let container, root;

  onMount(() => {
    const { element, children, class: _, ...props } = $$props;
    try {
      root = createRoot(container);
      root.render(createElement(element, props, children));
    } catch (e) {
      console.warn(`ReactAdapter failed to mount.`, e);
    }
  });

  onDestroy(() => {
    try {
      root.unmount();
    } catch (e) {
      console.warn(`ReactAdapter failed to unmount.`, e);
    }
  });
</script>

<div bind:this={container} class={$$props.class} />
