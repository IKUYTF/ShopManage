<template>
    <div class="data-table">
        <v-toolbar flat color="white">
            <v-toolbar-title>店舗管理</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-text-field
                    label="検索..."
                    class="search-text"
                    append-icon="search"
                    v-model="searchKeyword"
                    @input="searchWord"
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="600px">
                <template v-slot:activator="{ on }">
                    <v-btn color="#1867c0" v-if="shopAuth" dark class="mb-2" v-on="on">店舗追加</v-btn>
                </template>
                <v-card>
                    <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                    </v-card-title>
                    <v-card-text>
                        <v-form ref="form" v-model="valid" lazy-validation>
                            <v-container grid-list-xl>
                                <v-layout wrap>
                                    <v-flex xs12 md6>
                                        <v-text-field v-model="editedItem.shopCode" :counter="20"
                                                      :rules="[
                                                               v => !!v || '店舗コードを入力してください',
                                                               v => (v && v.length <= 20) || '店舗コードを20桁以下入力してください',
                                                               checkShopCode]" :error-messages="errorCodeMessages"
                                                      :disabled="editedIndex > -1"
                                                      label="店舗コード" required></v-text-field>
                                        <v-text-field v-model="editedItem.shopName" :counter="50"
                                                      :rules="nameRules"
                                                      label="店舗名" required></v-text-field>
                                        <v-text-field v-model="editedItem.address" :counter="100"
                                                      :rules="[checkAddress]" :error-messages="errorAddressMessages"
                                                      label="アドレス"></v-text-field>
                                        <v-text-field v-model="editedItem.details" :counter="100"
                                                      :rules="[checkDetails]" :error-messages="errorDetailsMessages"
                                                      label="明細"></v-text-field>

                                    </v-flex>
                                    <v-flex xs12 md6>
                                        <v-card>
                                            <v-img class="black--text" height="200px"
                                                   @click="enlarge(editedItem.certPath)"
                                                   :src="editedItem.certPath">
                                                <v-container fill-height fluid>
                                                    <v-layout fill-height>
                                                        <v-flex xs12 align-end flexbox>
                                                            <span v-if="editedItem.certPath === ``"
                                                                  class="headline cert-background">証書未選択</span>
                                                        </v-flex>
                                                    </v-layout>
                                                </v-container>
                                            </v-img>
                                            <v-card-actions>
                                                <v-spacer></v-spacer>
                                                <v-btn v-if="editedItem.certPath !== ``" flat color="orange"
                                                       @click="enlarge(editedItem.certPath)">拡大表示
                                                </v-btn>
                                                <v-btn flat color="orange" @click="certSelect=true">証書選択</v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-flex>

                                    <v-flex xs12 md8>
                                        <v-text-field v-model="editedItem.certWord" :counter="100"
                                                      :error-messages="errorWordMessages"
                                                      label="証書認証文字"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 md4>
                                        <v-btn color="error" class="btn1" v-if="editedItem.certPath !== ``"
                                               @click="deleteCert()">証書削除
                                        </v-btn>
                                    </v-flex>

                                    <v-flex xs12 md6>
                                        <v-btn :disabled="!valid || loadingDialog" :loading="loadingDialog"
                                               color="success" class="btn" @click="save">確認</v-btn>
                                    </v-flex>

                                    <!--<v-flex xs12 md4>-->
                                        <!--<v-btn color="error" class="btn" @click="reset">リセット</v-btn>-->
                                    <!--</v-flex>-->

                                    <v-flex xs12 md6>
                                        <v-btn color="warning" class="btn" @click="close">キャンセル</v-btn>
                                    </v-flex>

                                </v-layout>
                            </v-container>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-toolbar>
        <v-dialog v-model="certPicture">
            <v-card name="cert">
                <v-img :src="currentPic"
                       lazy-src="https://picsum.photos/10/6?image=15"
                       aspect-ratio="1.33" contain
                       class="grey lighten-2">
                    <template v-slot:placeholder>
                        <v-layout fill-height align-center justify-center ma-0>
                            <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                        </v-layout>
                    </template>
                </v-img>
            </v-card>
        </v-dialog>

        <v-dialog v-model="certSelect">
            <v-layout wrap>

                <v-flex xs4>

                    <v-card>
                        <v-img
                                :src="certPic1"
                                height="330"
                                class="grey darken-4"
                        >
                            <span class="headline cert-background">証書テンプレート1</span>
                        </v-img>

                        <v-card-actions>
                            <v-btn flat color="orange" @click="selectCert(certPic1)">選択
                            </v-btn>
                            <v-btn flat color="orange" @click="enlarge(certPic1)">プレビュー</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-flex>

                <v-flex xs4>
                    <v-card>
                        <v-img
                                :src="certPic2"
                                height="330"
                                contain
                                class="grey darken-4"
                        >
                            <span class="headline cert-background">証書テンプレート2</span></v-img>

                        <v-card-actions>
                            <v-btn flat color="orange" @click="selectCert(certPic2)">選択
                            </v-btn>
                            <v-btn flat color="orange" @click="enlarge(certPic2)">プレビュー</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-flex>

                <v-flex xs4>
                    <v-card>
                        <v-img
                                :src="certPic3"
                                height="330"
                                class="grey darken-4"
                        >
                            <span class="headline cert-background">証書テンプレート3</span></v-img>

                        <v-card-actions>
                            <v-btn flat color="orange" @click="selectCert(certPic3)">選択
                            </v-btn>
                            <v-btn flat color="orange" @click="enlarge(certPic3)">プレビュー</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-dialog>

        <v-snackbar v-model="snackbar" color='success' top>
            {{ alertText }}
            <v-icon dark flat @click="snackbar = false">close</v-icon>
        </v-snackbar>
        <v-dialog
                v-model="loadingDialog"
                persistent
                width="300"
        >
            <v-card color="primary" dark>
                <v-card-text>
                    {{loadingText}}
                    <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-data-table :headers="shopAuth?headers:headers2" :items="shopInfo" :pagination.sync="pagination" class="elevation-1">
            <template v-slot:items="props">
                <td>{{ props.item.shopName }}</td>
                <td class="text-xs-right">{{ props.item.shopCode }}</td>
                <td class="text-xs-right">{{ props.item.address }}</td>
                <td class="text-xs-right">{{ props.item.details }}</td>
                <td class="text-xs-right">
                    <v-icon v-if="props.item.certPath !== ``" color="green" @click="certView(props.item.certPath)">
                        pageview
                    </v-icon>
                    <div v-else>未認証</div>
                </td>
                <td class="text-xs-right">{{ props.item.createTime }}</td>
                <td class="text-xs-right">{{ props.item.updateTime }}</td>
                <td class="justify-center layout px-0" v-if="shopAuth">
                    <v-icon small color="indigo" class="mr-2" @click="editItem(props.item)">edit</v-icon>
                    <v-icon small @click="deleteItem(props.item)">delete</v-icon>
                </td>
            </template>
            <template v-slot:no-data>
                <v-btn color="primary" @click="initialize">Reload</v-btn>
            </template>
        </v-data-table>
    </div>
</template>

<script>
    export default {
        data: () => ({
            dialog: false,
            snackbar: false,
            alertText: '',
            currentPic: '',
            certPicture: false,
            certSelect: false,
            loadingDialog: false,
            loadingText: '',
            certGroup: 1,
            certWord1: '',
            certWord2: '',
            certWord3: '',
            searchKeyword: '',
            certPic1: 'http://localhost:8200/certificate/CertTemplate/template1.png',
            certPic2: 'http://localhost:8200/certificate/CertTemplate/template2.jpg',
            certPic3: 'http://localhost:8200/certificate/CertTemplate/template3.jpeg',
            valid: false,
            errorCodeMessages: '',
            errorWordMessages: '',
            errorAddressMessages: '',
            errorDetailsMessages: '',
            lastSearchWord: '',
            nameRules: [
                v => !!v || '店舗名を入力してください',
                v => (v && v.length <= 50) || '店舗名を50桁以下入力してください'
            ],
            headers: [
                {text: '店舗名', align: 'left', value: 'shopName'},
                {text: '店舗コード', align: 'right', value: 'shopCode'},
                {text: 'アドレス', align: 'right', value: 'address'},
                {text: '明細', align: 'right', value: 'details'},
                {text: '証書', align: 'right', value: 'certPath', sortable: false},
                {text: '登録時間', align: 'right', value: 'createTime'},
                {text: '更新時間', align: 'right', value: 'updateTime'},
                {text: '操作', align: 'center', value: 'action', sortable: false}
            ],
            headers2: [
                {text: '店舗名', align: 'left', value: 'shopName'},
                {text: '店舗コード', align: 'right', value: 'shopCode'},
                {text: 'アドレス', align: 'right', value: 'address'},
                {text: '明細', align: 'right', value: 'details'},
                {text: '証書', align: 'right', value: 'certPath', sortable: false},
                {text: '登録時間', align: 'right', value: 'createTime'},
                {text: '更新時間', align: 'right', value: 'updateTime'}
            ],
            shopInfo: [],
            pagination: {
                sortBy: 'shopName',
                rowsPerPage: '10'
            },
            editedIndex: -1,
            editedItem: {
                shopName: '',
                shopUuid: '',
                shopCode: '',
                address: '',
                certPath: '',
                details: '',
                certWord: '',
                createTime: '',
                updateTime: ''
            },
            defaultItem: {
                shopName: '',
                shopUuid: '',
                shopCode: '',
                address: '',
                certPath: '',
                details: '',
                certWord: '',
                createTime: '',
                updateTime: ''
            },
            localUrl: '',
            shopAuth:''
        }),

        computed: {
            formTitle() {
                return this.editedIndex === -1 ? '店舗追加' : '店舗変更'
            }
        },

        watch: {
            dialog(val) {
                val || this.close()
            }
        },

        created() {
            this.localUrl = global.backServerEndpoint + '/manage';

            this.certPic1 = global.backServerEndpoint + '/certificate/CertTemplate/template1.png';
            this.certPic2 = global.backServerEndpoint + '/certificate/CertTemplate/template2.jpg';
            this.certPic3 = global.backServerEndpoint + '/certificate/CertTemplate/template3.jpeg';
            this.shopAuth = localStorage.getItem('ms_shopAuth') === 'true';
            this.initialize()
        },

        methods: {
            initialize() {
                if(this.lastSearchWord === '') {
                    const url = this.localUrl + '/shop-getAll'
                    this.$axios({
                        method: 'get',
                        url: url
                    }).then((res) => {
                        this.shopInfo = res.data;
                    });
                } else {
                    this.searchWord();
                }

            },

            editItem(item) {
                this.editedIndex = this.shopInfo.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.dialog = true
            },

            deleteItem(item) {
                confirm('この店舗を削除しますか。');
                const url = this.localUrl + '/shop-delete/' + item.shopUuid;
                this.$axios({
                    method: 'get',
                    url: url
                }).then((res) => {
                    this.snackbar = true;
                    this.alertText = '店舗情報削除済み';
                    this.initialize();
                });

            },

            close() {
                this.dialog = false;
                this.$refs.form.resetValidation();
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            },

            save() {
                if (this.$refs.form.validate()) {
                    this.loadingDialog = true;
                    let url = '';
                    if (this.editedIndex > -1) {
                        url = this.localUrl + '/shop-update'
                        this.editedItem.createTime = ''
                        this.editedItem.updateTime = ''
                        this.loadingText = '店舗情報更新中'
                    } else {
                        url = this.localUrl + '/shop-insert'
                        this.loadingText = '店舗情報登録中'
                    }
                    this.$axios({
                        method: 'post',
                        url: url,
                        data: this.editedItem
                    }).then((res) => {
                        this.snackbar = true;
                        this.loadingDialog = false;
                        this.loadingText = '';
                        this.alertText = '店舗情報更新済み';
                        this.initialize();
                        this.close()
                    }).catch(function (response) {
                        console.log(response)
                    });
                }
            },
            reset() {
                this.$refs.form.reset()
            },
            certView(path) {
                this.certPicture = true;
                this.currentPic = path;
            },
            enlarge(pic) {
                if (pic === '')
                    return;
                this.certPicture = true;
                this.currentPic = pic;

            },
            selectCert(pic) {
                this.editedItem.certPath = pic;
                this.certSelect = false;
            },
            deleteCert() {
                this.editedItem.certPath = '';
            },
            checkShopCode() {
                if(this.editedIndex > -1 || this.editedItem.shopCode === '')
                    return true;
                const url = this.localUrl + '/shop-getOne/' + this.editedItem.shopCode;
                this.$axios({
                    method: 'get',
                    url: url
                }).then((res) => {
                    if (res.data.returnCode === 'OK') {
                        this.errorCodeMessages = '店舗コードが存在しました';
                        return false;
                    } else {
                        this.errorCodeMessages = '';
                        return true
                    }
                });
                return true;
            },
            searchWord() {
                if(this.searchKeyword === '') {
                    this.lastSearchWord = '';
                    this.initialize();
                    return;
                }
                const url = this.localUrl + '/shop-get/' + this.searchKeyword;
                this.$axios({
                    method: 'get',
                    url: url
                }).then((res) => {
                    this.shopInfo = res.data;
                    this.lastSearchWord = this.searchKeyword;
                });
            },

            checkDetails() {

                if(this.editedItem.details === '') {
                    return true;
                }
                if(this.editedItem.details.length > 100) {
                    this.errorDetailsMessages = '明細を100桁以下入力してください';
                    return false;
                }

                this.errorDetailsMessages = '';
                return true;
            },
            checkAddress() {

                if(this.editedItem.address === '') {
                    return true;
                }
                if(this.editedItem.address.length > 100) {
                    this.errorAddressMessages = '明細を100桁以下入力してください';
                    return false;
                }

                this.errorAddressMessages = '';
                return true;
            }
        }
    }
</script>

<style scoped>
    .data-table {
        margin: 10px;
    }

    .btn {
        width: 270px;
    }
    .btn1 {
        width: 175px;
    }

    .cert-background {
        background: white;
    }

</style>