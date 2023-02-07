
import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import pagination from './pagination.js';

let productModal = {};
let delProductModal = {};

const app = createApp({
    data(){
        return{
            products:[],
            tempProduct:{
                imagesUrl:[],
            },
            isNew:false, //判斷是新增或編輯狀態
            page:{}
        };
    },
    components:{
        pagination,
    },

    methods:{
        getProducts(page=1){ //預設參數
            axios.get(`${url}/api/${api_path}/admin/products/?page=${page}`)
            .then((res)=>{
                this.products=res.data.products;
                this.page=res.data.pagination ;
                // console.log(this.page)
            })
            .catch((err)=>{
                alert(err.response.data.message)
            })
        },

        //開啟model:新增、編輯、刪除共用
        openModel(status,product){
            if(status === 'create'){
                productModal.show();
                this.isNew=true;
                // 帶入初始化資料
                this.tempProduct = {
                    imagesUrl:[],
                };
            }else if(status === 'edit'){
                productModal.show();
                this.isNew=false;
                // 帶入編輯資料
                this.tempProduct = {...product};
            }else if(status === 'delete'){
                delProductModal.show();
                this.isNew=false;
                // 帶入編輯資料
                this.tempProduct = {...product};
            }
        },
        
        //更新model（運用isNew判斷API怎麼運行）
        updateProduct(){
            let site = `${url}/api/${api_path}/admin/product`;
            let method = 'post' ;
            if(!this.isNew){
                site = `${url}/api/${api_path}/admin/product/${this.tempProduct.id}`;
                method = 'put';
            }
            axios[method](site,{data: this.tempProduct})
            .then(res=>{
                this.getProducts();
                productModal.hide(); //關閉model
                })
        },

        delProduct(){
            const site = `${url}/api/${api_path}/admin/product/${this.tempProduct.id}`;
            axios.delete(site)
            .then(res=>{
                this.getProducts();
                delProductModal.hide(); //關閉model
                })
        }
    },

    mounted(){
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        axios.defaults.headers.common['Authorization'] = token;
        this.getProducts();

        // Bootstrap 方法
        productModal = new bootstrap.Modal('#productModal');
        delProductModal = new bootstrap.Modal('#delProductModal')
    }
});

app.component('product-model',{
    props:['tempProduct','updateProduct'],
    template:'#product-model-template',
});

app.mount('#app'); 
