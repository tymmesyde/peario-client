<template>
    <div class="select">
        <div class="input" @click="toggle()">
            <transition name="fade" mode="out-in">
                <ion-icon name="chevron-down-outline" v-if="!active"></ion-icon>
                <ion-icon name="chevron-up-outline" v-else></ion-icon>
            </transition>
            {{ selected.name }}
        </div>
        
        <transition name="fade">
            <ul class="menu" v-show="active">
                <li :class="{ 'active': option.value == selected.value }" v-for="option in options" :key="option" @click="$emit('update:modelValue', option.value), toggle()">
                    {{ option.name }}
                </li>
            </ul>
        </transition>
    </div>
</template>

<script>
export default {
    props: {
        modelValue: String,
        options: Array
    },
    data() {
        return {
            active: false
        }
    },
    computed: {
        selected() {
            return this.options.find(({ value }) => value === this.modelValue);
        }
    },
    methods: {
        toggle() {
            this.active = !this.active;
        }
    }
}
</script>

<style lang="scss" scoped>
.select {
    position: relative;

    .input {
        display: flex;
        align-items: center;
        gap: 8px;
        height: 40px;
        border: 2px solid $accent-color;
        border-radius: 5px;
        padding: 0 15px;
        font-family: 'Montserrat-Bold';
        font-size: 15px;
        font-weight: bold;
        color: $primary-color;
        background-color: $accent-color;
        text-transform: none;
        outline: none;
        text-overflow: ellipsis;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
        cursor: pointer;
    }

    .menu {
        z-index: 1;
        position: absolute;
        top: 36px;
        width: 100%;
        padding-top: 4px;
        border-radius: 0 0 10px 10px;
        text-align: left;
        background-color: $accent-color;
        backdrop-filter: blur(10px);

        li {
            display: flex;
            align-items: center;
            height: 40px;
            padding: 15px;
            font-family: 'Montserrat-Bold';
            font-size: 15px;
            font-weight: bold;
            color: $primary-color;
            cursor: pointer;

            &:hover {
                background-color: rgba(0, 0, 0, 0.1);
            }

            &.active {
                background-color: rgba(0, 0, 0, 0.1);

                &:after {
                    content: "";
                    position: absolute;
                    right: 15px;
                    height: 6px;
                    width: 6px;
                    border-radius: 100%;
                    background-color: $primary-color;
                }
            }
        }
    }
}
</style>