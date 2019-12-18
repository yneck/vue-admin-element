<template>
  <div class="login-container" :style="bg">
    <h4>北京二期</h4>
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">用户登录</h3>
      </div>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="Password"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>
      <el-form-item style="background: #fff;border: none">
        <div class="tips">
          <p><a>忘记用户名？</a><a>忘记密码？</a></p>
        </div>
      </el-form-item>
      <el-form-item style="background: #fff;border: none">
        <el-button :loading="loading" type="primary" @click.native.prevent="handleLogin" style=" width: 47%;">登录</el-button>
        <el-button @click="" type="primary" style=" width: 47%;">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import SocialSign from './components/SocialSignin'
import backgroundImage from "../../assets/bg_login.png";

export default {
  name: 'Login',
  components: { SocialSign },
  data() {
    // const validateUsername = (rule, value, callback) => {
    //   if (!validUsername(value)) {
    //     callback(new Error('Please enter the correct user name'))
    //   } else {
    //     callback()
    //   }
    // }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      backgroundImage,
      bg:{
        background:`url(${backgroundImage})`,
        backgroundSize:'100% 100%'
      },
      loginForm: {
        username: 'admin',
        password: 'BKa531*$%_6'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur'}],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,

      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss"  >
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
  $bg:#283443;
  $bg_ele:#fff;
  $light_gray:#fff;
  $cursor: #fff;
  $dark_gray:#889aa4;
  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-button--medium {
      padding: 10px 63px;
      font-size: 14px;
      height: 40px;
      border-radius: 0;
    }

    h4{
      position: absolute;
      top: 80px;
      margin: 0;
      padding: 0;
      left: 80px;
      font-size: 40px;
      color: #fff;
      font-weight: normal;
    }


    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: $bg_ele !important;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $dark_gray;
        height: 47px;
        caret-color: $bg;
        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg_ele inset !important;
          -webkit-text-fill-color: $bg !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid $dark_gray;
      background: $bg_ele;
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style lang="scss" rel="stylesheet/scss"   scoped>
  $bg:#44abf0;
  $dark_gray:#889aa4;
  $light_gray:#44abf0;

  .login-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;
    color: $dark_gray;
    .login-form {
      border-radius: 10px;
      position: absolute;
      width: 410px;
      left: 0;
      background: #fff;
      top: 30%;
      right: 0;
      max-width: 100%;
      padding: 30px 35px 60px 35px;
      margin: 0 auto;
      overflow: hidden;


    }

    .tips {
      margin-bottom: 10px;
      text-align: right;
      font-size: 14px;
      color: $light_gray;
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      font-size: 18px;
      display: inline-block;
    }

    .title-container {
      position: relative;
      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }

    .thirdparty-button {
      position: absolute;
      right: 0;
      bottom: 6px;
    }

    @media only screen and (max-width: 470px) {
      .thirdparty-button {
        display: none;
      }
    }
  }
</style>
