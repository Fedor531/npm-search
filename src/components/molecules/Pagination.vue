<template>
    <ul class="pagination">
        <li class="page-item"
            :class="{'active': +$route.query.page === pageNumber}"
            v-for="pageNumber in totalPages"
            :key="pageNumber"
            @click="setPage(pageNumber)"
        >
            <a class="page-link" href="#">
                {{ pageNumber }}
            </a>
        </li>
    </ul>
</template>

<script>
export default {
    name: 'Pagination',
    props: {
        totalPages: {
            type: Number,
            required: true
        },
    },
    methods: {
        setPage(pageNumber) {
            const query = { ...this.$route.query, page: pageNumber };
            this.$router.push({ path: this.$route.path, query })
        }
    }
}
</script>

<style scoped>

</style>
