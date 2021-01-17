<template>
    <div class="meta">
        <img class="logo" :src="value.logo" alt="" v-if="value.logo">
        <div class="title" v-else>{{ value.name }}</div>

        <div class="details">
            <div class="year">{{ value.year }}</div>
            <div class="runtime">{{ value.runtime }}</div>
        </div>

        <div class="description">{{ value.description }}</div>

        <div class="tags">
            <div class="tag" v-for="genre in value.genres" :key="genre">
                {{ genre }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Meta',
    props: {
        value: {
            type: Object,
            default: () => ({})
        }
    }
}
</script>

<style lang="scss" scoped>
.meta {
    display: flex;
    flex-direction: column;
    gap: 10px;
    color: white;

    .logo {
        display: block;
        width: 250px;
        user-select: none;
    }

    .title {
        font-family: 'Montserrat-Bold';
        font-size: 45px;
    }

    .details {
        display: flex;
        gap: 10px;
        font-family: 'Montserrat-MediumItalic';
        font-size: 15px;
        opacity: 0.7;
    }

    .description {
        font-family: 'Montserrat-Regular';
        font-size: 18px;
    }

    .tags {
        display: flex;
        gap: 10px;

        .tag {
            height: 30px;
            line-height: 30px;
            background-color: rgba(white, 0.1);
            padding: 0 12px;
            border-radius: 30px;
            font-family: 'Montserrat-Medium';
            font-size: 15px;
            user-select: none;
        }
    }
}
</style>