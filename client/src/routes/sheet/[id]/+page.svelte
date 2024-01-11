<script lang="ts">
	import type { PageData } from './$types';
	import { Abilities } from '$lib/Stats';
	import Card, { Content } from '@smui/card';
	import List, { Item, Text } from '@smui/list';

	export let data: PageData;
</script>

<h3>Character Sheet</h3>
<div>
	<span>Character Id: {data.id}</span>

	<Card>
		<Content component={List}>
			<Item nonInteractive>
				<Text>
					<h6>Abilities</h6>
				</Text>
			</Item>

			{#each Abilities as ability}
				<Item>
					<Text>{ability}</Text>
				</Item>
			{/each}
		</Content>
	</Card>
</div>
