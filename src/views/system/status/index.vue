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
      <!--<el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">-->
        <!--新增-->
      <!--</el-button>-->
      <!--<el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">-->
        <!--导出-->
      <!--</el-button>-->
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
      <el-table-column label="登录用户名"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.loginName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="真实名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.realName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="USER_ID" align="center">
        <template slot-scope="{row}">
          <span>{{ row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登陆时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.startTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后访问时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.lastAccessTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="sessionID" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sessionId }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">-->
        <!--<template slot-scope="{row}">-->
          <!--<el-button type="primary" size="mini" @click="handleUpdate(row)">-->
            <!--编辑-->
          <!--</el-button>-->
          <!--<el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleModifyStatus(row,'deleted')">-->
            <!--删除-->
          <!--</el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->
    </el-table>
  </div>
</template>

<script>
  import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
  // import { getList, deleteRow } from '@/api/system/user'
  import { baseData} from '@/api/system/status'
  import { basicsApi, createNewObj } from '@/api/system/public'
  import waves from '@/directive/waves' // waves directive
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination

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
    name: 'status',
    components: { Pagination },
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
          pageSize: 10
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
          label:"",
          remark: "",
          sort: '',
          type:"",
          value: '',
          description:"",
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
      this.getList()

    },
    methods: {
      getList() {
        this.listLoading = true
        basicsApi(baseData.list).then(response => {
          this.list = response.data;
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
            if (action!="cancel"){
              basicsApi(baseData.delete,query).then(res=>{
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
          label:"",
          remark: "",
          sort: '',
          type:"",
          value: '',
          description:"",
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
            console.log(this.temp);
            basicsApi(baseData.sava,this.temp).then(() => {
              this.list.unshift(this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: 'Created Successfully',
                type: 'success',
                duration: 2000
              })
              this.resetTemp()
            })
          }
        })
      },
      handleUpdate(row) {
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
            const tempData = Object.assign({}, this.temp)
            basicsApi(baseData.sava,tempData).then(() => {
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: 'Update Successfully',
                type: 'success',
                duration: 2000
              })
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

