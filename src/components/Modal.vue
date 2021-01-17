<template>
    <transition name="fade">
        <div class="modal" v-if="modelValue">
            <div :class="['backdrop', { 'disabled': disabled }]" v-if="modelValue" @click="close()"></div>

            <div class="inner">
                <div class="topbar" v-if="!$slots.button">
                    <div class="title">
                        <ion-icon :name="icon"></ion-icon>
                        <slot name="title"></slot>
                    </div>
                    <Button icon="close" clear @click="close()" v-if="!disabled"></Button>
                </div>
                <slot></slot>
                <Button large :icon="buttonIcon" @click="close()" v-if="$slots.button && !disabled">
                    <slot name="button">Done</slot>
                </Button>
            </div>
        </div>
    </transition>
</template>

<script>
import Button from '../components/Button';

export default {
    name: 'Modal',
    components: {
        Button
    },
    props: {
        modelValue: Boolean,
        closeButton: {
            type: Boolean,
            default: true
        },
        icon: String,
        buttonIcon: {
            type: String,
            default: 'checkmark'
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        close() {
            if(!this.disabled) this.$emit('update:modelValue', false);
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../variables.scss';

.modal, .backdrop {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}

.modal {
    z-index: 98;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(black, 0.5);
    backdrop-filter: blur(10px);

    .backdrop:not(.disabled) {
        cursor: pointer;
    }

    .inner {
        z-index: 99;
        max-height: 70%;
        padding: 30px;
        border-radius: 16px;
        background-color: $background-color;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);

        .topbar {
            display: flex;
            justify-content: space-between;
            gap: 30px;

            .title {
                display: flex;
                align-items: center;
                gap: 15px;
                font-family: 'Montserrat-Bold';
                font-size: 30px;
                color: $accent-color;
                user-select: none;
            }
        }

        button {
            flex-shrink: 0;
        }
    }
}
</style>