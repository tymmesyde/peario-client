<template>
    <input type="range" min="0" :max="max" :step="step" :value="modelValue" :disabled="disabled" @input="updateValue($event.target.value)"/>
</template>

<script>
export default {
    name: 'RangeInput',
    props: {
        modelValue: [String, Number],
		disabled: Boolean,
		max: {
			type: String,
			default: '1'
		},
		step: {
			type: String,
			default: '0.1'
		}
	},
	emits: ['change', 'update:modelValue'],
	methods: {
		updateValue(value) {
			this.$emit('change', value);
			this.$emit('update:modelValue', value);
		}
	}
}
</script>

<style lang="scss" scoped>
$range-size: 10px;

input {
	appearance: none;
	height: $range-size;
	background: transparent;
	outline: none;
	overflow: hidden;
	margin: 0;
	border-radius: $range-size;
	transition: height 0.1s ease-in-out, opacity 0.2s ease-in;

	&::-webkit-slider-thumb {
		appearance: none;
		width: 0;
		box-shadow: -100rem 0 0 100rem white;
	}

	&::-moz-range-thumb {
		appearance: none;
		width: 0;
		box-shadow: -100rem 0 0 100rem white;
	}

	&::-webkit-slider-runnable-track {
		height: $range-size;
		background-color: rgba(white, 0.35);
		transition: height 0.1s ease-in-out;
	}

	&::-moz-range-track {
		height: $range-size;
		background-color: rgba(white, 0.35);
		transition: height 0.1s ease-in-out;
	}

	&:not([disabled]):hover,
	&:not([disabled]):focus {
		height: $range-size + 5px;

		&::-webkit-slider-runnable-track {
			height: $range-size + 5px;
		}

		&::-moz-range-track {
			height: $range-size + 5px;
		}
	}
}
</style>