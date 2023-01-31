<template>
  <div class="login" :style="'background-image:url('+ Background +');'">
    <div class="login_left" :style="'background-image:url('+ Background2 +');'">
      <img class="logo" src="@/assets/icons/logo.png" alt="">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-position="left" label-width="0px" class="login-form">
        <img class="title" src="@/assets/icons/welcome.png" alt="">
        <div class="tabs">
          <div :class="{active:activeTab==1}" @click="changeTab(1)">
            账号密码登录
          </div>
          <div :class="{active:activeTab==2}" @click="changeTab(2)">
            手机号登录
          </div>
        </div>
        <div v-if="activeTab==1">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
              <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码" @keyup.enter.native="handleLogin">
              <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
            </el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-input v-model="loginForm.code" auto-complete="off" placeholder="验证码" style="width: 63%" @keyup.enter.native="handleLogin">
              <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
            </el-input>
            <div class="login-code">
              <img :src="codeUrl" @click="getCode">
            </div>
          </el-form-item>
          <el-checkbox v-model="loginForm.rememberMe">
            记住我
          </el-checkbox>
        </div>
        <div v-else>
          <el-form-item prop="phone">
            <el-input v-model="loginForm.phone" type="text" auto-complete="off" placeholder="手机号">
            </el-input>
          </el-form-item>
          <el-form-item prop="yzm">
            <div class="yzm">
              <el-input v-model="loginForm.yzm" maxlength='6' type="text" auto-complete="off" placeholder="验证码">
              </el-input>
              <div class="login-yzm">
                获取验证码
              </div>
            </div>
          </el-form-item>
        </div>
        <el-form-item style="width:100%; margin-top: 50px;">
          <el-button :loading="loading" size="medium" type="primary" style="width:100%;" @click.native.prevent="handleLogin">
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <img class="tubiao" src="@/assets/icons/tb.png" alt="">
    <!--  底部  -->
    <!-- <div v-if="$store.state.settings.showFooter" id="el-login-footer">
      <span v-html="$store.state.settings.footerTxt" />
      <span> ⋅ </span>
      <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">{{ $store.state.settings.caseNumber }}</a>
    </div> -->
  </div>
</template>

<script>
import { encrypt } from '@/utils/rsaEncrypt'
import Config from '@/settings'
import { getCodeImg } from '@/api/login'
import Cookies from 'js-cookie'
import qs from 'qs'
import Background from '@/assets/images/background.jpeg'
import bg01 from '@/assets/icons/bg01.png'
import bg02 from '@/assets/icons/bg02.png'
export default {
  name: 'Login',
  data() {
    return {
      activeTab:1,
      Background: bg01,
      Background2: bg02,
      codeUrl: '',
      cookiePass: '',
      loginForm: {
        username: '',
        password: '',
        rememberMe: false,
        code: '',
        uuid: '',
        phone:'',
        yzm:'',
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
        password: [{ required: true, trigger: 'blur', message: '密码不能为空' }],
        code: [{ required: true, trigger: 'change', message: '验证码不能为空' }]
      },
      loading: false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const data = route.query
        if (data && data.redirect) {
          this.redirect = data.redirect
          delete data.redirect
          if (JSON.stringify(data) !== '{}') {
            this.redirect = this.redirect + '&' + qs.stringify(data, { indices: false })
          }
        }
      },
      immediate: true
    }
  },
  created() {
    // 获取验证码
    this.getCode()
    // 获取用户名密码等Cookie
    this.getCookie()
    // token 过期提示
    this.point()
  },
  methods: {
    changeTab(type){
      this.activeTab = type
      if(type==2){
        this.loginRules={
          phone: [{ required: true, trigger: 'blur', message: '手机号不能为空' }],
          yzm: [{ required: true, trigger: 'change', message: '验证码不能为空' }]
        }
      }else{
        this.loginRules= {
          username: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
          password: [{ required: true, trigger: 'blur', message: '密码不能为空' }],
          code: [{ required: true, trigger: 'change', message: '验证码不能为空' }]
        }
      }
    },
    getCode() {
      getCodeImg().then(res => {
        this.codeUrl = res.img
        this.loginForm.uuid = res.uuid
      })
    },
    getCookie() {
      const username = Cookies.get('username')
      let password = Cookies.get('password')
      const rememberMe = Cookies.get('rememberMe')
      // 保存cookie里面的加密后的密码
      this.cookiePass = password === undefined ? '' : password
      password = password === undefined ? this.loginForm.password : password
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password,
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
        code: ''
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        const user = {
          username: this.loginForm.username,
          password: this.loginForm.password,
          rememberMe: this.loginForm.rememberMe,
          code: this.loginForm.code,
          uuid: this.loginForm.uuid
        }
        if (user.password !== this.cookiePass) {
          user.password = encrypt(user.password)
        }
        if (valid) {
          this.loading = true
          if (user.rememberMe) {
            Cookies.set('username', user.username, { expires: Config.passCookieExpires })
            Cookies.set('password', user.password, { expires: Config.passCookieExpires })
            Cookies.set('rememberMe', user.rememberMe, { expires: Config.passCookieExpires })
          } else {
            Cookies.remove('username')
            Cookies.remove('password')
            Cookies.remove('rememberMe')
          }
          this.$store.dispatch('Login', user).then(() => {
            this.loading = false
            this.$router.push({ path: this.redirect || '/' })
          }).catch(() => {
            this.loading = false
            this.getCode()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    point() {
      const point = Cookies.get('point') !== undefined
      if (point) {
        this.$notify({
          title: '提示',
          message: '当前登录状态已过期，请重新登录！',
          type: 'warning',
          duration: 5000
        })
        Cookies.remove('point')
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .yzm{
    position: relative;
    .login-yzm{
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      color: rgba(38, 138, 240, 1);
      font-size: 14px;
    }
  }
  .login_left{
    width: 60%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-size: cover;
    .logo{
      position: absolute;
      top: 90px;
      left: 46px;
      width: 310px;
      height: 48px;
    }
  }
  .login {
    display: flex;
    align-items: center;
    height: 100%;
    background-size: cover;
    .tubiao{
      margin-left: -150px;
    }
  }
  .title {
    margin: 0 auto 30px auto;
    display: block;
  }
  .tabs{
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-around;
    margin: 50px auto;
    letter-spacing: 0.23px;
    font-size: 18px;
    color: rgba(102, 102, 102, 1);
    .active{
      color: rgba(0, 84, 254, 1);
      position: relative;
      &::before{
        content: '';
        width: 100%;
        height: 3px;
        background: rgba(0, 84, 254, 1);
        position: absolute;
        top: 35px;
      }
    }
  }
  .login-form {
    border-radius: 6px;
    background: #ffffff;
    box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.1);
    width: 500px;
    height: 500px;
    padding: 35px 81px 25px 81px;
    .el-input {
      height: 38px;
      input {
        height: 38px;
      }
    }
    .input-icon{
      height: 39px;width: 14px;margin-left: 2px;
    }
  }
  .login-tip {
    font-size: 13px;
    text-align: center;
    color: #bfbfbf;
  }
  .login-code {
    width: 33%;
    display: inline-block;
    height: 38px;
    float: right;
    img{
      cursor: pointer;
      vertical-align:middle
    }
  }
</style>
