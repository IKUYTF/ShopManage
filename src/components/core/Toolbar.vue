<template>
    <v-toolbar
            id="core-toolbar" flat
            prominent
            style="background: #eee; "
    >
        <div class="v-toolbar-title">
            <v-toolbar-title
                    class="tertiary--text font-weight-thin">
                <v-btn
                        v-if="responsive"
                        class="default v-btn--simple"
                        dark
                        icon
                        @click.stop="onClickBtn">
                    <v-icon large>mdi-view-list</v-icon>
                </v-btn>
                <!--{{ title }}-->
            </v-toolbar-title>
        </div>

        <v-spacer/>

        <v-toolbar-title><v-icon color="tertiary">mdi-account</v-icon> {{username}}　</v-toolbar-title>
        <v-toolbar-items>
            <v-btn outline small class="btn" @click="logout">ログアウト</v-btn>
            <!--</v-flex>-->
        </v-toolbar-items>
    </v-toolbar>
</template>

<script>

    import {
        mapMutations
    } from 'vuex'

    export default {
        data: () => ({
            notifications: [
                'Mike, John responded to your email',
                'You have 5 new tasks',
                'You\'re now a friend with Andrew',
                'Another Notification',
                'Another One'
            ],
            title: null,
            responsive: false,
            responsiveInput: false,
            username: ''
        }),

        watch: {
            '$route'(val) {
                this.title = val.name
            }
        },

        mounted() {
            this.onResponsiveInverted()
            window.addEventListener('resize', this.onResponsiveInverted)
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.onResponsiveInverted)
        },

        methods: {
            ...mapMutations('app', ['setDrawer', 'toggleDrawer']),
            onClickBtn() {
                this.setDrawer(!this.$store.state.app.drawer)
            },
            logout() {
                localStorage.setItem('ms_username','');
                localStorage.setItem('ms_userAuth','');
                localStorage.setItem('ms_shopAuth','');
                this.$router.push('/login');
            },
            onResponsiveInverted() {
                if (window.innerWidth < 991) {
                    this.responsive = true
                    this.responsiveInput = false
                } else {
                    this.responsive = false
                    this.responsiveInput = true
                }
            }
        },
        created() {

            this.username = localStorage.getItem('ms_username');
        }
    }
</script>

<style>
    #core-toolbar a {
        text-decoration: none;
    }

    #core-toolbar {
        margin-bottom: 0;
    }

    .btn {
        height: 80% !important;
    }
</style>
