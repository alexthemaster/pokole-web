<script>
export default {
    name: 'logout',
    beforeMount() {
        if (this.$cookies.isKey('token')) this.$cookies.remove('token');
        return this.$router.replace('/');
    }
}
</script>