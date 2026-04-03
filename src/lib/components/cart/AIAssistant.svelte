<script>
	import { X, Send, Bot, Utensils } from 'lucide-svelte';
	import { fade, slide } from 'svelte/transition';

	let { isOpen = $bindable(false), menuItems = [], onAddCombo } = $props();

	let inputText = $state('');
	/**
	 * @type {{ role: 'user' | 'assistant', text: string, combo?: any[], total?: number }[]}
	 */
	let messages = $state([
		{
			role: 'assistant',
			text: "Hi! I'm your AI foodie assistant. Tell me your budget and I'll find the perfect combo for you!"
		}
	]);

	/** @param {number} budget */
	function findCombo(budget) {
		let combo = [];
		let currentTotal = 0;
		// Shuffle items to give different recommendations on same budget
		let shuffled = [...menuItems].sort(() => 0.5 - Math.random());

		// Try to pick at least one food, one drink if possible. But simple greedy is fine for now.
		for (let item of shuffled) {
			if (currentTotal + item.price <= budget) {
				combo.push(item);
				currentTotal += item.price;
			}
		}
		return { combo, total: currentTotal };
	}

	function handleSend() {
		if (!inputText.trim()) return;

		const userText = inputText.trim();
		messages.push({ role: 'user', text: userText });
		inputText = '';

		// Extract budget from text (first sequence of digits)
		const match = userText.match(/\d+/);
		if (match) {
			const budget = parseInt(match[0], 10);
			const { combo, total } = findCombo(budget);

			setTimeout(() => {
				if (combo.length > 0) {
					messages.push({
						role: 'assistant',
						text: `Here's a great combo for ${budget} so'm! (Total: ${total} so'm)`,
						combo,
						total
					});
				} else {
					messages.push({
						role: 'assistant',
						text: `Sorry, I couldn't find anything for ${budget} so'm. Our cheapest item might be more expensive.`
					});
				}
			}, 600);
		} else {
			setTimeout(() => {
				messages.push({
					role: 'assistant',
					text: "I didn't catch a budget there. Please include a number, like 'I have 2000'."
				});
			}, 600);
		}
	}

	/** @param {KeyboardEvent} e */
	function handleKeyDown(e) {
		if (e.key === 'Enter') {
			handleSend();
		}
	}

	/** @param {any[]} combo */
	function addComboToCart(combo) {
		onAddCombo(combo);
		messages.push({
			role: 'assistant',
			text: 'Awesome! I added those to your cart.'
		});
	}
</script>

{#if isOpen}
	<div
		class="fixed bottom-24 right-4 z-50 w-80 sm:w-96 rounded-2xl border border-border bg-background shadow-2xl overflow-hidden flex flex-col"
		in:fade={{ duration: 200 }}
		out:fade={{ duration: 200 }}
		style="height: 500px; max-height: 80vh;"
	>
		<!-- Header -->
		<div class="bg-primary text-primary-foreground p-4 flex items-center justify-between">
			<div class="flex items-center gap-2">
				<Bot class="w-6 h-6" />
				<h3 class="font-bold text-lg">AI Assistant</h3>
			</div>
			<button
				onclick={() => (isOpen = false)}
				class="p-1 hover:bg-primary-foreground/20 rounded-full transition-colors"
				aria-label="Close"
			>
				<X class="w-5 h-5" />
			</button>
		</div>

		<!-- Chat Area -->
		<div class="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col bg-muted/20">
			{#each messages as msg}
				<div class="flex flex-col {msg.role === 'user' ? 'items-end' : 'items-start'}">
					<div
						class="max-w-[85%] rounded-2xl p-3 {msg.role === 'user'
							? 'bg-primary text-primary-foreground rounded-tr-sm'
							: 'bg-muted text-foreground border border-border border-l-4 border-l-primary rounded-tl-sm'}"
					>
						<p class="text-sm">{msg.text}</p>
					</div>

					{#if msg.combo && msg.combo.length > 0}
						<div class="mt-2 w-[90%] bg-card border border-border rounded-xl p-3 shadow-sm self-start">
							<h4 class="text-xs font-semibold uppercase text-muted-foreground mb-2">
								Suggested Combo
							</h4>
							<div class="space-y-2 mb-3">
								{#each msg.combo as item}
									<div class="flex justify-between items-center text-sm">
										<div class="flex items-center gap-2">
											<Utensils class="w-3 h-3 text-primary" />
											<span class="truncate max-w-[120px]">{item.name}</span>
										</div>
										<span class="font-medium">{item.price} sum</span>
									</div>
								{/each}
							</div>
							<div class="pt-2 border-t border-border flex justify-between items-center mb-3">
								<span class="text-sm font-semibold">Total</span>
								<span class="text-sm font-bold text-primary">{msg.total} sum</span>
							</div>
							<button
								onclick={() => addComboToCart(msg.combo || [])}
								class="w-full bg-primary/10 hover:bg-primary/20 text-primary font-semibold py-2 rounded-lg text-sm transition-colors"
							>
								Add all to Cart
							</button>
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<!-- Input Area -->
		<div class="p-3 border-t border-border bg-background flex gap-2">
			<input
				type="text"
				bind:value={inputText}
				onkeydown={handleKeyDown}
				placeholder="E.g. I have 2500 so'm..."
				class="flex-1 bg-muted rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
			/>
			<button
				onclick={handleSend}
				class="bg-primary text-primary-foreground p-2 rounded-xl hover:opacity-90 transition-opacity shrink-0"
				aria-label="Send"
			>
				<Send class="w-5 h-5" />
			</button>
		</div>
	</div>
{/if}
