<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="登录名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.importance" placeholder="用户名" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
      <!--<el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">-->
      <!--reviewer-->
      <!--</el-checkbox>-->
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column
        type="selection" align="center"
        width="60">
      </el-table-column>
      <el-table-column label="角色名称"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="英文名称" align="center">
        <template slot-scope="{row}">
          <!--<span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>-->
          <span>{{ row.enname }}</span>
          <!--<el-tag>{{ row.realName}}</el-tag>-->
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleModifyStatus(row,'deleted')">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <!--<el-form-item label="Type" prop="type">-->
        <!--<el-select v-model="temp.type" class="filter-item" placeholder="Please select">-->
        <!--<el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="Date" prop="timestamp">-->
        <!--<el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />-->
        <!--</el-form-item>-->
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="英文名称" prop="enname">
          <el-input v-model="temp.enname" />
        </el-form-item>
        <el-form-item label="角色授权" prop="menuIds">
          <!--<el-input v-model="temp.menuIds" />-->
          <!--<SelectTree-->
            <!--:props="props"-->
            <!--:options="TreeSelectlist"-->
            <!--:value="temp.menuIds"-->
            <!--:clearable="isClearable"-->
            <!--:accordion="isAccordion"-->
            <!--@getValue="getValue($event)"/>-->
          <treeselect
            :multiple="true"
            :options="TreeSelectlist"
            sort-value-by="INDEX"
            value-consists-of="ALL_WITH_INDETERMINATE"
            v-model="temp.menuIds"
          />
        </el-form-item>
        <el-form-item label="包含角色">
          <el-select v-model="temp.users" class="filter-item" placeholder="Please select">
            <el-option v-for="item in userSelect" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'

  import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'

  import store from "@/store/index";
  import { baseData } from '@/api/system/role'
  import { basicsApi, getTree, createNewObj } from '@/api/system/public'
  import waves from '@/directive/waves' // waves directive
  // import SelectTree from "@/components/TreeSelect/treeSelect";
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination'

  // import {basicsApi} from "../../../api/system/public"; // secondary package based on el-pagination

  const calendarTypeOptions = [
    { key: 'CN', display_name: 'China' },
    { key: 'US', display_name: 'USA' },
    { key: 'JP', display_name: 'Japan' },
    { key: 'EU', display_name: 'Eurozone' }
  ]

  // arr to obj, such as { CN : "China", US : "USA" }
  const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})


  export default {
    name: 'role',
    components: { Pagination, Treeselect },
    directives: { waves },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'info',
          deleted: 'danger'
        }
        return statusMap[status]
      },
      typeFilter(type) {
        return calendarTypeKeyValue[type]
      }
    },
    data() {
      return {
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        // listQuery: {
        //   page: 1,
        //   limit: 20,
        //   importance: undefined,
        //   title: undefined,
        //   type: undefined,
        //   sort: '+id'
        // },
        listQuery: {
          pageIndex: 1,
          pageSize: 20
        },
        importanceOptions: [1, 2, 3],
        calendarTypeOptions,
        //有效期
        yseNo:null,
        //rolesList 用户权限
        rolesList:null,
        sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
        statusOptions: ['published', 'draft', 'deleted'],
        showReviewer: false,
        temp: {
          id: undefined,
          name:"",
          enname: "",
          realName: '',
          menuIds:null,
          users: "",
          version:""
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '新增'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          type: [{ required: true, message: 'type is required', trigger: 'change' }],
          timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
          title: [{ required: true, message: 'title is required', trigger: 'blur' }]
        },
        downloadLoading: false,
        //角色授权树形
        isClearable:true,      // 可清空（可选）
        isAccordion:true,      // 可收起（可选）
        valueId:20,            // 初始ID（可选）
        props:{                // 配置项（必选）
          value: 'id',
          label: 'name',
          children: 'children',
          // disabled:true
        },
        // 选项列表（必选）
        TreeSelectlist:[],
        //用户
        userSelect:[]
      }
    },
    created() {
      this.getList()
      this.getUserList()
      this.getMenuList()
    },
    computed:{
      /* 转树形数据 */
      optionData(){
        let cloneData = JSON.parse(JSON.stringify(this.TreeSelectlist))      // 对源数据深度克隆
        return  cloneData.filter(father=>{                      // 循环所有项，并添加children属性
          let branchArr = cloneData.filter(child=>father.id == child.parentId);       // 返回每一项的子级数组
          branchArr.length>0 ? father.children=branchArr : ''   //给父级添加一个children属性，并赋值

          return father.parentId==0;      //返回第一层
        });
      }
    },
    methods: {
      //权限
      getMenuList(){
        let query={userId: store.getters.userId}
        basicsApi(baseData.menuS,query).then(res => {
          console.log(getTree(res.data));
          this.TreeSelectlist=getTree(res.data);

        })
      },
      //获取用户角色
      getUserList(){
        let query={
          pageIndex: 1,
          pageSize:null
        };
        basicsApi(baseData.userListS,query).then(res => {
          let dataList=res.data.data;
          this.rolesList=[];
          dataList.forEach(item=>{
            this.userSelect.push({
              value:""+item.id,
              label:item.realName
            })
          })
        })
      },
      getList() {
        this.listLoading = true
        basicsApi(baseData.list,this.listQuery).then(response => {
          this.list = response.data.data;
          this.total = response.data.total
          this.listLoading = false
        })
      },
      handleFilter(){
        this.listQuery.pageIndex = 1
        this.getList()
      },
      //删除
      handleModifyStatus(row, status) {
        let query=createNewObj(row, ["id", "version"])
        this.$alert('确认删除该行数据？', '删除', {
          confirmButtonText: '确定',
          callback: action => {
            console.log(action);
            if (action!="cancel"){
              deleteRow(query).then(res=>{
                this.$message({
                  type: 'info',
                  message: `action: ${ action }`
                });
                this.getList()
              // row.status = status
              })
            }


          }
        });
      },
      sortChange(data) {
        const { prop, order } = data
        if (prop === 'id') {
          this.sortByID(order)
        }
      },
      sortByID(order) {
        if (order === 'ascending') {
          this.listQuery.sort = '+id'
        } else {
          this.listQuery.sort = '-id'
        }
        this.handleFilter()
      },
      resetTemp() {
        this.temp = {
          id: undefined,
          name:"",
          enname:"",
          realName: '',
          menuIds:null,
          users: '',
          version:""
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
            // this.temp.author = 'vue-element-admin'
            let formData=Object.assign({},this.temp);
            formData.menuIds=formData.menuIds.join(",");
            basicsApi(baseData.sava,formData).then(() => {
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: 'Created Successfully',
                type: 'success',
                duration: 2000
              })
              this.resetTemp()
              this.getList()
            })
          }
        })
      },
      handleUpdate(row) {
        let query={id:row.id}
        basicsApi(baseData.update,query).then(res => {
          console.log(res.data);
          let result=res.data;
          let updateData=["id","name","enname","menuIds","users","version"]
          let newObj=createNewObj(result,updateData)
          newObj.menuIds=newObj.menuIds.split(",").map(item=>{return parseInt(item)});
          this.temp = Object.assign({}, newObj) // copy obj
          this.dialogStatus = 'update'
          this.dialogFormVisible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        })

      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let formData=Object.assign({},this.temp);
            formData.menuIds=formData.menuIds.join(",");
            basicsApi(baseData.sava,formData).then(() => {
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: 'Update Successfully',
                type: 'success',
                duration: 2000
              })
              this.getList()
              this.resetTemp()
            })
          }
        })
      },
      handleDelete(row) {
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      },
      handleFetchPv(pv) {
        fetchPv(pv).then(response => {
          this.pvData = response.data.pvData
          this.dialogPvVisible = true
        })
      },
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
          const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'table-list'
          })
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      },
      getSortClass: function(key) {
        const sort = this.listQuery.sort
        return sort === `+${key}`
          ? 'ascending'
          : sort === `-${key}`
            ? 'descending'
            : ''
      },
      // 取值
      getValue(value){
        this.temp.menuIds = value
        // console.log(this.valueId);
      }
    }
  }
</script>
<style>
  .filter-container{
    margin: 10px 0;
  }
  /*.el-form-item__content{*/
    /*line-height: normal;*/
  /*}*/
</style>

