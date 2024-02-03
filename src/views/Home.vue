<template>
    <div class="home">
        <div class="title">
            <ATitle translate="views.home.title"/>
            <ATitle type="tertiary">
                <i18n-t keypath="views.home.sub" tag="span">
                    <ALink href="https://stremio.com">Stremio</ALink>
                </i18n-t>
            </ATitle>
        </div>

        <AButton large icon="play" @click="goToSearch()">
            {{ $t('views.home.button') }}
        </AButton>
    </div>
</template>

<script setup>
import router from '@/router';

import ATitle from '@/components/ui/Title.vue';
import ALink from '@/components/ui/Link.vue';
import AButton from '@/components/ui/Button.vue';

const goToSearch = () => router.push({ name: 'search' });
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