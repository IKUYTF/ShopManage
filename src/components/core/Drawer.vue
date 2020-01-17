<template>
    <v-navigation-drawer
            id="app-drawer"
            v-model="inputValue"
            app
            dark
            floating
            persistent
            :mini-variant="mini"
            mobile-break-point="991"
            width="260"
    >
        <v-img
                :src="image"
                height="100%"
        >
            <v-layout
                    class="fill-height"
                    tag="v-list"
                    column
            >
                <v-list-tile v-if="mini" @click.stop="mini = !mini">
                    <v-list-tile-action>
                        <v-icon>chevron_right</v-icon>
                    </v-list-tile-action>
                </v-list-tile>
                <v-list-tile avatar>
                    <v-list-tile-avatar color="white">
                        <v-img :src="logo" height="34" contain />
                    </v-list-tile-avatar>
                    <v-list-tile-content class="title">
                        店舗管理
                    </v-list-tile-content>
                    <v-list-tile-action>
                        <v-btn icon @click.stop="mini = !mini">
                            <v-icon>chevron_left</v-icon>
                        </v-btn>
                    </v-list-tile-action>
                </v-list-tile>
                <v-divider/>
                <v-list-tile
                        v-for="(link, i) in links"
                        :key="i"
                        :to="link.to"
                        v-if="link.visible"
                        :active-class="color"
                        avatar
                        class="v-list-item"
                >
                    <v-list-tile-action>
                        <v-icon>{{ link.icon }}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content v-text="link.text"/>
                </v-list-tile>
                <!--<v-list-tile-->
                        <!--disabled-->
                        <!--active-class="primary"-->
                        <!--class="v-list-item v-list__tile&#45;&#45;buy"-->
                        <!--to="/upgrade"-->
                <!--&gt;-->
                    <!--<v-list-tile-action>-->
                        <!--<v-icon>mdi-package-up</v-icon>-->
                    <!--</v-list-tile-action>-->
                    <!--&lt;!&ndash;<v-list-tile-title class="font-weight-light">&ndash;&gt;-->
                        <!--&lt;!&ndash;Upgrade To PRO&ndash;&gt;-->
                    <!--&lt;!&ndash;</v-list-tile-title>&ndash;&gt;-->
                <!--</v-list-tile>-->
            </v-layout>
        </v-img>
    </v-navigation-drawer>
</template>global

<script>
    // Utilities
    import {
        mapMutations,
        mapState
    } from 'vuex'
    import $route from "../../router";

    export default {
        data: () => ({
            logo: './img/canon.jpg',
            ifAdmin: 'false',
            userAuth: '',
            mini: false,
            links: [

                {
                    to: '/shopManage',
                    icon: 'chrome_reader_mode',
                    text: '店舗管理',
                    visible:true
                },
                {
                    to: '/userManage',
                    icon: 'mdi-account',
                    text: 'ユーザー管理',
                    visible:false
                }
            ],
            responsive: false
        }),
        computed: {
            ...mapState('app', ['image', 'color']),
            inputValue: {
                get() {
                    return this.$store.state.app.drawer
                },
                set(val) {
                    this.setDrawer(val)
                }
            },
            items() {
                return this.$t('Layout.View.items')
            }
        },
        mounted() {
            this.onResponsiveInverted()
            window.addEventListener('resize', this.onResponsiveInverted)
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.onResponsiveInverted)
        },
        created() {
            this.userAuth = localStorage.getItem('ms_userAuth');
            if(this.userAuth === 'true') {
                this.links[1].visible = true;
            } else {
                this.links[1].visible = false;
            }
        },
        methods: {
            ...mapMutations('app', ['setDrawer', 'toggleDrawer']),
            onResponsiveInverted() {
                if (window.innerWidth < 991) {
                    this.responsive = true
                } else {
                    this.responsive = false
                }
            }
        }
    }
</script>

<style lang="scss">
    #app-drawer {
        .v-list__tile {
            border-radius: 4px;

            &--buy {
                margin-top: auto;
                margin-bottom: 17px;
            }
        }

        .v-image__image--contain {
            top: 9px;
            height: 60%;
        }

        .search-input {
            margin-bottom: 30px !important;
            padding-left: 15px;
            padding-right: 15px;
        }
    }
</style>
