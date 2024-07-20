<script lang="ts">
	// Utilities
	import { page } from '$app/stores';
	import { invalidate } from '$app/navigation';
	
	// Components
	import { popup } from '@skeletonlabs/skeleton';
	import { successToast, errorToast } from '$lib/helpers/triggerToast';
	
	// Types
	import type { Database } from '$lib/types/supabaseTypes';
	export let journalEntry: Database['public']['Tables']['journal']['Row'];
	
	// Local variables
	let regex: RegExp;
	let day: Date;
	
	function getLocalDate() {
	  let date = new Date();
	  let timezoneOffset = date.getTimezoneOffset() * 60000; // Convert offset to milliseconds
	  let localDate = new Date(date.getTime() - timezoneOffset);
	  return localDate;
	}
	
	$: {
	  day = journalEntry.day ? new Date(journalEntry.day) : getLocalDate();
	  const query = $page.url.searchParams.get('q') as string;
	  regex = new RegExp(query, 'gi');
	}
	
	// Event handlers
	async function handleDelete(e: Event) {
	  if (!confirm('Are you sure you want to delete this entry?')) {
		return;
	  }
	  const id = (e.target as HTMLButtonElement)?.dataset.id;
	  if (id) {
		const response = await fetch(`/api/journal/${id}`, {
		  method: 'DELETE'
		});
		if (response.status === 200) {
		  successToast('Entry deleted.');
		  invalidate('journal:list');
		} else {
		  errorToast('Something went wrong.');
		}
	  }
	}
</script>

<!-- Display the date -->
<h2>{day.toLocaleDateString('en', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h2>

<!-- Entry Content -->
<p>{journalEntry.content}</p>

<!-- Delete Button -->
<button data-id={journalEntry.id} on:click={handleDelete}>Delete</button>

<!-- Conditional Display -->
{#if regex.test(journalEntry.content)}
  <div>
	<p>Matched Content: {journalEntry.content}</p>
  </div>
{/if}
