<template>
  <div class="hello">
    <h1 class="title has-text-left">&nbsp;Variables</h1>
    <div class="section" style="padding-top: 0px;">
      <button class="button is-dark is-pulled-right no-print" v-show="!showVariablesList" v-on:click="toggleModal(null)">Add One</button>
      <br /><br />
      <div class="variable-list">
        <div class="variable separator" v-if="variables" v-for="variable in filteredVariables">
          <div class="has-text-left">
            <div class="columns">
              <div class="column is-one-quarter">
                <div class="has-text-weight-bold">{{variable.name}}</div>
              </div>
              <div class="column" style="max-width: 50%;">
                <div class="variable-content has-no-padding wrap-text" v-if="variable.contentType=='text'">
                  <span class="double-size has-no-padding" v-if="variable.isSecret==true" v-on:click="variable.isSecret=false">******</span>
                  <span v-if="variable.isSecret==false" v-on:click="variable.isSecret=true" v-html="variable.content"></span>
                </div>
                <div class="variable-code code" v-if="variable.contentType!='text'" v-html="variable.content"></div>
                <!-- <pre class="prettyprint linenums black-bg" v-if="variable.contentType!='text'" v-html="variable.content"></pre> -->
              </div>
              <div class="column">
                <!-- {{variable.contentType}} -->
              </div>
              <div class="column">
                <i class="fa fa-fw fa-2x fa-times is-pulled-right pointer" v-on:click="deleteVariable(variable._id)" v-show="!showVariablesList"></i>
                <i class="fa fa-fw fa-2x fa-pencil is-pulled-right pointer" v-show="!showVariablesList" v-on:click="toggleModal(variable)"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="variables.length == 0">
        There are currently no variables to view.<br /><br />
        <button class="button is-dark" v-on:click="toggleModal(null)">Add one</button>
      </div>
      <!--modal-->
      <div class="modal" v-bind:class="{ 'is-active': modalActive }">
        <div class="modal-background"></div>
        <div class="modal-content">
          <section class="modal-card-body">    
            <h1 class="title is-pulled-left" v-if="!isEdit">Add Variable</h1>
            <h1 class="title is-pulled-left" v-if="isEdit">Edit Variable</h1>
            {{selectedContentType}}
            <div class="field">
              <p class="control">
                <input class="input" type="text" name="variable_title" placeholder="Name" v-model="variableName" v-validate="'required'">
                <span v-show="errors.has('variableName')" class="help is-danger"><i class="fa fa-warning"></i>&nbsp;{{ errors.first('variableName') }}</span>
              </p>
            </div>
            <div class="field">
              <p class="control">
                <button class="button" v-on:click="selectedContentType='text'">Text</button>
                <button class="button" v-on:click="selectedContentType='code'">Code</button>
              </p>
            </div>
            <div class="field">
              <p class="control">
                <wysiwyg class="textarea" rows="10" id="editor" name="variable_content" placeholder="Content" v-model="variableContent" />
                
              </p>
            </div>
            <div class="field">
              <p class="control is-pulled-left">
                <input type="checkbox" v-model="variableIsSecret" /> Is Secret?
              </p>
            </div>
            <div class="field">
              <p class="control is-pulled-right">
                <button class="button is-info" v-on:click="validateBeforeSubmit(null)" v-if="!isEdit">
                  Save
                </button>
                <button class="button is-info" v-on:click="validateBeforeSubmit(variableId)" v-if="isEdit">
                  Update
                </button>
                <button class="button is-default" v-on:click="toggleModal">Cancel</button>
              </p>
            </div>
          </section>
        </div>
        <button class="modal-close is-large" aria-label="close" v-on:click="toggleModal"></button>
      </div>
      <!--/modal-->
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import VueLocalStorage from 'vue-localstorage'
import moment from 'moment'
import VueHighlightJS from 'vue-highlightjs'
import wysiwyg from "vue-wysiwyg";

Vue.use(VueHighlightJS)
Vue.use(VueLocalStorage,{name: 'ls'})
Vue.use(wysiwyg, {});

export default {
  name: 'hello',
  data () {
    return {
      api_url: 'http://localhost:3005',
      isLoggedIn: false,
      variables: [],
      modalActive: false,
      isEdit: false,
      showVariablesList: false,
      variableId: '',
      variableName: '',
      variableContent: '',
      variableContentType: '',
      variableIsSecret: '',
      selectedContentType: 'text',
      selectedVariables: [],
      isSelected: [],
      moment: moment
    }
  },
  created () {
    //console.log(this.$ls.get('token'));
    if(!this.$ls.get('token')){
      this.$router.push('/login')
    }else{
      this.isLoggedIn = true
    }
    this.init();
    //console.log('gunna get ls ',this.$ls.get('selectedVariables'));
    if(this.$ls.get('selectedVariables')){
      this.selectedVariables = this.$ls.get('selectedVariables').split(',')
      //console.log(this.selectedVariables);
      for (var i = this.selectedVariables.length - 1; i >= 0; i--) {
        this.isSelected[this.selectedVariables[i]] = true
      }
    }
  },
  computed:{
    filteredVariables : function(){
      if(this.showVariablesList){
        return this.variables.filter((variable) =>{
          if(this.selectedVariables.indexOf(variable._id) !=-1){
            return true;
          }
        })
      }else{
        return this.variables
      }
    },
    niceDate: function(){
      return moment(Date.now()).format('MM/DD/YYYY [at] h:mm a')
    }
  },
  methods:{
    init (){
      axios.get(this.api_url+'/v1/variable')
      .then(response => {
        console.log(response);
        this.variables = response.data;
      })
      .catch(error => {
        console.log(error);
      })
      //this.$ls.set('selectedVariables','')
    },
    mouseOver(){

    },
    mouseOut(){

    },
    toggleModal (editItem) {
      if(this.modalActive){
        // closes modal and wipes data
        this.modalActive = false;
        this.variableName = '';
        this.variableContent = '';
        this.variableContentType = '';
        this.variableIsSecret = '';
      }else{
        // modal is not already open
        if(editItem){
          console.log('editItem',editItem);
          this.isEdit = true
          this.variableId = editItem._id
          this.variableName = editItem.name;
          this.variableContent = editItem.content;
          this.variableContentType = editItem.contentType;
          this.selectedContentType = editItem.contentType;
          this.variableIsSecret = editItem.isSecret;
        }else{
          // if no edit item
          this.variableName = '';
          this.variableContent = '';
          this.variableContentType = '';
          this.variableIsSecret = '';
          this.isEdit = false
        }
        this.modalActive = true;
      }
    },
      validateBeforeSubmit(editId) {
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.addVariable(editId)
            return;
          }
        });
      },
      addVariable (editId) {
        if(editId){
          axios.put(this.api_url+'/v1/variable/'+editId,{
            name: this.variableName,
            content: this.variableContent,
            contentType: this.selectedContentType,
            isSecret: this.variableIsSecret
          })
          .then(response => {
            console.log('variable updated');
            this.variableName = '';
            this.variableContent = '';
            this.variableContentType = '';
            this.variableIsSecret = '';
            this.init()
            this.toggleModal()
          })
          .catch(error => {
            console.log(error);
          });
        }else{
          axios.post(this.api_url+'/v1/variable/add',{
            name: this.variableName,
            content: this.variableContent,
            contentType: this.selectedContentType,
            isSecret: this.variableIsSecret
          })
          .then(response => {
            console.log('variable added');
            this.variableName = '';
            this.variableContent = '';
            this.variableContentType = '';
            this.variableIsSecret = '';
            this.init()
            this.toggleModal()
          })
          .catch(error => {
            console.log(error);
          });
        }
      },
      deleteVariable(deleteId) {
        var result = confirm("Are you sure you want to delete this variable?")
        if(result){
          axios.delete(this.api_url+'/v1/variable/'+deleteId)
          .then(response => {
            console.log('variable updated');
            this.variableName = '';
            this.variableContent = '';
            this.variableContentType = '';
            this.variableIsSecret = '';
            this.init()
          })
          .catch(error => {
            console.log(error);
          });
        }
      },
      toggleStar (id) {
        //console.log(this.selectedVariables.indexOf(id));
        if(this.selectedVariables.indexOf(id)!=-1){
          this.isSelected[id] = false;
          var ind = this.selectedVariables.indexOf(id);
          this.selectedVariables.splice(ind,1);
          var selind = this.isSelected.indexOf(id);
          this.isSelected.splice(selind,1);
        }else{
          var ind = null;
          this.isSelected.push(id);
          this.isSelected[id] = true;
          this.selectedVariables.push(id);
        }
        if(this.selectedVariables.length > 0){
          //console.log('setting ',this.selectedVariables)
          this.$ls.set('selectedVariables',this.selectedVariables)
        }else{
          this.$ls.set('selectedVariables','')
        }
      },
      toggleListView () {
        if(this.showVariablesList){
          this.showVariablesList = false
        }else{
          this.showVariablesList = true
        }
      },
      toggleSecret(){

      },
      highlightCode(content){
        const regex = []
        //regex['str'] = /'(.*?)'/g
        //regex['str2'] = /(\".*?\")/g
        //regex['fn'] = /(\w+?)\(\)/g
        //regex['fn2'] = /(\w+?)\(([^)]*)\)/g
        if(content.match(regex['str'])){
          content = content.replace(regex['str'],'<span style="color: #FDA209">\'$1\'</span>');          
        }
        // if(content.match(regex['str2'])){
        //   content = content.replace(regex['str2'],'<span style=\'color: #FDA209\'>$1</span>');
        // }
      
        if(content.match(regex['fn'])){
          content = content.replace(regex['fn'],'<span style="color: #1AADA2">$1\(\)</span>');
        }
        if(content.match(regex['fn2'])){
          content = content.replace(regex['fn2'],'<span style="color: #1AADA2">$1\(<span style="color: #7763FF">$2</span>\)</span>');
        }
      
        return content
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
pre{background: transparent; font-size: 1em;}
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
.double-size{
  font-size: 2em;
  line-height: 0.9em;
}
.separator{
  border-bottom: 1px solid #696969;
  padding-bottom: 10px;
  margin-top: 10px;
}
.separator:first-child{
  margin-top: 0px;
}
.pointer{
  cursor: pointer;
}
.has-no-padding{padding: 0px;}
.wrap-text{overflow-wrap: break-word;}
.variable-content{font-size: 16px;}
/* Code styles */
.code{padding: 5px 10px; white-space: pre; background: black; font-family: Consolas, Console New; color: #9D67FF; border-radius: 7px;}
.code div, .code span, .code div div, {color: #7B68EE; font-weight: 600 !important;}
.black-bg{background: black;}
/* hl = highlight */
.hl-str{color: #FDA209;}
</style>