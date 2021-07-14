<template>
    <div class="home">
        <div class="title">
            <Title translate="views.home.title"/>
            <Title type="tertiary">
                <i18n-t keypath="views.home.sub" tag="span">
                    <Link href="https://stremio.com">Stremio</Link>
                </i18n-t>
            </Title>
        </div>

        <Button large icon="play" @click="goToSearch()">
            {{ $t('views.home.button') }}
        </Button>
    </div>
</template>

<script>
import Title from '@/components/ui/Title.vue';
import Link from '@/components/ui/Link.vue';
import Button from '@/components/ui/Button.vue';

export default {
    name: 'Home',
    components: {
        Title,
        Link,
        Button
    },
    methods: {
        goToSearch() {
            this.$router.push({ name: 'search' });
        }
    }
}
</script>

<style lang="scss" scoped>
.home {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 45px;

    .title {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
}
</style>