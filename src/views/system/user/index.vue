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
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登录名"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.loginName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" align="center">
        <template slot-scope="{row}">
          <!--<span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>-->
          <span>{{ row.realName }}</span>
          <!--<el-tag>{{ row.realName}}</el-tag>-->
        </template>
      </el-table-column>
      <el-table-column label="用户类型" class-name="status-col" align="center" >
        <template slot-scope="{row}">
            {{ row.roles | rolesFilter}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <!--<el-button v-if="row.status!='published'" size="mini" type="success" @click="handleModifyStatus(row,'published')">-->
            <!--可操作-->
          <!--</el-button>-->
          <!--<el-button v-if="row.status!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">-->
            <!--恢复-->
          <!--</el-button>-->
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
        <el-form-item label="用户编号" prop="userId">
          <el-input v-model="temp.userId" />
        </el-form-item>
        <el-form-item label="登录名" prop="loginName">
          <el-input v-model="temp.loginName" />
        </el-form-item>
        <el-form-item label="用户名" prop="realName">
          <el-input v-model="temp.realName" />
        </el-form-item>
        <el-form-item label="是否有效">
          <el-select v-model="temp.isValid" class="filter-item" placeholder="Please select">
            <el-option v-for="item in yseNo" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户类型" >
          <el-select v-model="temp.roles" class="filter-item" placeholder="Please select">
            <el-option v-for="item in rolesList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>

        <!--<el-form-item label="用户类型">-->
          <!--<el-input v-model="temp.userType" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />-->
        <!--</el-form-item>-->
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
  import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
  import { baseData } from '@/api/system/user'
  import { selectList, createNewObj, basicsApi } from '@/api/system/public'
  import waves from '@/directive/waves' // waves directive
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination

  let calendarTypeOptions = [
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
  let vm;

  export default {
    name: 'user',
    components: { Pagination },
    directives: { waves },
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
        rolesList:[],
        sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
        statusOptions: ['published', 'draft', 'deleted'],
        showReviewer: false,
        temp: {
          id: undefined,
          userId:"",
          loginName: 1,
          realName: '',
          isValid:"",
          roles: '',
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
        downloadLoading: false
      }
    },
    created() {
      vm=this;
      this.getList()
      this.getYesNoS()
      this.getRolesS()
    },
    mounted(){

    },
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
      },
      rolesFilter(value){
        let roles=vm.rolesList;
        if(roles.length<1)return value;
        let newObj=null;
        roles.forEach(item=>{
          if(item.id==value) newObj=item;
        })
        return newObj.name
      }
    },
    methods: {
      //获取下拉框数据
      getYesNoS(){
        let data={type:"yes_no"};
        basicsApi(baseData.yes_noS,data).then(res=>{
          this.yseNo=res.data;
        })
      },
      getRolesS(){
        let query={
          pageIndex: 1,
          pageSize: 20
        }
        basicsApi(baseData.rolesS,query).then(res=>{
          let dataList=res.data.data;
          this.rolesList=[];
          dataList.forEach(item=>{
            this.rolesList.push({
               id:""+item.id,
               name:item.name
             })
          })
        })
      },
      getList() {
         this.listLoading = true
        basicsApi(baseData.list,this.listQuery).then(response => {
             this.list = response.data.data;
             this.total = response.data.total
             // console.log(response);
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
            basicsApi(baseData.delete,query).then(res=>{
              this.$message({
                type: 'info',
                message: `action: ${ action }`
              });
              this.getList()
              // row.status = status
            })

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
          userId:"",
          loginName: "",
          realName: '',
          isValid:"",
          roles: '',
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
            basicsApi(baseData.sava,this.temp).then(() => {
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: 'Created Successfully',
                type: 'success',
                duration: 2000
              })
              this.getList()
            })
          }
        })
      },
      handleUpdate(row) {
        let query=createNewObj(row, ["id", "version","userId","loginName","realName","isValid","roles"])
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({},this.temp)
            basicsApi(baseData.sava,tempData).then(() => {
              this.dialogFormVisible = false;
              this.$notify({
                title: 'Success',
                message: 'Update Successfully',
                type: 'success',
                duration: 2000
              })
              this.getList()
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
      }
    }
  }
</script>
<style>
  .filter-container{
    margin: 10px 0;
  }
</style>
<!--<template>-->
  <!--<div class="app-container">-->
    <!--<el-table-->
      <!--v-loading="listLoading"-->
      <!--:data="list"-->
      <!--element-loading-text="Loading"-->
      <!--border-->
      <!--fit-->
      <!--highlight-current-row-->
    <!--&gt;-->
      <!--<el-table-column align="center" label="ID" width="95">-->
        <!--<template slot-scope="scope">-->
          <!--{{ scope.$index }}-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column label="Title">-->
        <!--<template slot-scope="scope">-->
          <!--{{ scope.row.title }}-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column label="Author" width="110" align="center">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{ scope.row.author }}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column label="Pageviews" width="110" align="center">-->
        <!--<template slot-scope="scope">-->
          <!--{{ scope.row.pageviews }}-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column class-name="status-col" label="Status" width="110" align="center">-->
        <!--<template slot-scope="scope">-->
          <!--<el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column align="center" prop="created_at" label="Display_time" width="200">-->
        <!--<template slot-scope="scope">-->
          <!--<i class="el-icon-time" />-->
          <!--<span>{{ scope.row.display_time }}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
    <!--</el-table>-->
  <!--</div>-->
<!--</template>-->

<!--<script>-->
<!--import { getList } from '@/api/table'-->

<!--export default {-->
  <!--filters: {-->
    <!--statusFilter(status) {-->
      <!--const statusMap = {-->
        <!--published: 'success',-->
        <!--draft: 'gray',-->
        <!--deleted: 'danger'-->
      <!--}-->
      <!--return statusMap[status]-->
    <!--}-->
  <!--},-->
  <!--data() {-->
    <!--return {-->
      <!--list: null,-->
      <!--listLoading: true-->
    <!--}-->
  <!--},-->
  <!--created() {-->
    <!--this.fetchData()-->
  <!--},-->
  <!--methods: {-->
    <!--fetchData() {-->
      <!--this.listLoading = true-->
      <!--getList().then(response => {-->
        <!--this.list = response.data.items-->
        <!--this.listLoading = false-->
      <!--})-->
    <!--}-->
  <!--}-->
<!--}-->
<!--</script>-->
