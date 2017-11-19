<template>
	<div id="login">
		<div class="columns">
			<div class="column">&nbsp;</div>
			<div class="column">
				<h2 class="title">Register</h2>
				<div class="field">
				  <p class="control has-icons-left has-icons-right">
				    <input class="input" type="email" name="email" placeholder="Email" v-model="email" :class="{'input': true, 'is-danger': errors.has('email') }" v-validate="'required|email'">
            <span v-show="errors.has('email')" class="help is-danger"><i class="fa fa-warning"></i>&nbsp;{{ errors.first('email') }}</span>
				    <span class="icon is-small is-left">
				      <i class="fa fa-envelope"></i>
				    </span>
				    <span class="icon is-small is-right">
				      <i class="fa fa-check"></i>
				    </span>
				  </p>
				</div>
				<div class="field">
				  <p class="control has-icons-left">
				    <input class="input" type="password" name="password" placeholder="Password" v-model="password" v-validate="'required'" v-on:keyup.enter="validateBeforeSubmit">
				    <span v-show="errors.has('password')" class="help is-danger"><i class="fa fa-warning"></i>&nbsp;{{ errors.first('password') }}</span>
				    <span class="icon is-small is-left">
				      <i class="fa fa-lock"></i>
				    </span>
				  </p>
				</div>
				<div class="field">
				  <p class="control has-icons-left">
				    <input class="input" type="password" name="confirm" placeholder="Confirm Password" v-model="password" v-validate="'required'" v-on:keyup.enter="validateBeforeSubmit">
				    <span v-show="errors.has('password')" class="help is-danger"><i class="fa fa-warning"></i>&nbsp;{{ errors.first('password') }}</span>
				    <span class="icon is-small is-left">
				      <i class="fa fa-lock"></i>
				    </span>
				  </p>
				</div>
				<div class="field">
				  <p class="control is-pulled-right">
				    <button class="button is-info" v-on:click="validateBeforeSubmit">
				      Login
				    </button>
				  </p>
				</div>
			</div>
			<div class="column">&nbsp;</div>
		</div>
	</div>
</template>
<script>
	import Vue from 'vue'
	import VeeValidate from 'vee-validate' 
	import axios from 'axios'

	Vue.use(VeeValidate)

	export default {
		name: 'login',
		data () {
			return {
				email: '',
				password: ''
			}
		},
		methods: {
			submitLogin () {
				axios.post('http://localhost:3005/v1/account/login',{
					email: this.email,
					password: this.password
				})
			  .then(response => {
			  	if(response.status==200){
			    	this.$router.push('/')
			    }
			  })
			  .catch(error => {
			    console.log(error);
			  })
			},
			validateBeforeSubmit() {
	      this.$validator.validateAll().then((result) => {
	        if (result) {
	          this.submitLogin()
	          return;
	        }
	      });
    	}
		}
	}
</script>
<style>
	
</style>