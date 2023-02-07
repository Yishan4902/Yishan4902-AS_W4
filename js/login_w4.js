
//Vue開發
import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

//元件
const app = {
    // 資料
    data(){
        return{
            user:{
            "username":"",
            "password":"" 
        } 
        }
    },
    // 方法集：登入(token和expired需要放在cookie)
    methods:{
    signIn(){
        if(this.user.username==''||this.user.password==''){
            alert("請填入帳號密碼")
        }else(
        axios.post(`${url}/admin/signin`,this.user)
        .then((res)=>{
            // console.log(res.data);
            const { token,expired } = res.data;
            document.cookie = `hexToken= ${token};expires=${ new Date(expired)}`;
            this.user.username='';this.user.password='';
            window.location.href="products_w4.html";
        })
        .catch((err)=>{
            alert(err.response.data)
        })
        )
        
        },
    },

};

createApp(app).mount('#app'); //渲染