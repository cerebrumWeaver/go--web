<template>
  <div>
    <div class="gva-button-box">
      <div class="gva-button-list">
        <el-button size="large" type="primary" link icon="plus" @click="addMenu('0')">新建转录组</el-button>
        <el-divider direction="vertical" style="margin-top: 10px" />
        <el-upload
          class="excel-btn"
          accept=".xlsx, .xls"
          :action="`${path}/trs/importExcel`"
          :headers="{'x-token':userStore.token}"
          :on-success="loadExcel"
          :show-file-list="false"
          :before-upload="beforeUpload"
        >
          <el-button size="large" type="primary" link icon="upload">导入</el-button>
        </el-upload>
        <el-divider direction="vertical" style="margin-top: 10px" />
        <el-button size="large" type="primary" link icon="download" @click="getTemplate">下载模板</el-button>
        <el-button size="large" type="primary" link icon="present" disabled @click="notice">发送邮件</el-button>
      </div>
      <div class="gva-button-list">
        <el-form ref="searchForm" :inline="true" :model="search" style="margin-left: 8px">
          <el-form-item label="项目编号">
            <el-input v-model="search.projectNo" size="small" autocomplete="off" placeholder="输入项目号" clearable />
          </el-form-item>
          <el-form-item label="分析类型">
            <el-input v-model="search.analysisType" size="small" autocomplete="off" placeholder="输入分析类型" clearable />
          </el-form-item>
          <el-form-item label="物种名字">
            <el-input v-model="search.speciesNames" size="small" autocomplete="off" placeholder="输入物种名字" clearable />
          </el-form-item>
          <el-form-item label="项目类型">
            <el-input v-model="search.prjType" size="small" autocomplete="off" placeholder="输入项目类型" clearable />
          </el-form-item>

          <el-form-item label="动植物">
            <el-select v-model="search.category" size="small" placeholder="选择动植物" clearable>
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>
          <!--          <el-form-item label="样本名称">
            &lt;!&ndash;            <el-input v-model="search.sampleName" placeholder="样本名称" />&ndash;&gt;
            <el-input v-model="search.sampleName" size="small" autocomplete="off" placeholder="输入样本名称" clearable />
          </el-form-item>
          <el-form-item label="项目类型">
            &lt;!&ndash;            <el-input v-model="search.projectType" placeholder="项目类型" />&ndash;&gt;
            <el-select v-model="search.projectType" placeholder="选择项目类型" size="small" clearable>
              <el-option
                  v-for="item in options2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>-->
          <el-form-item>
            <el-button size="small" type="primary" link icon="search" @click="onSubmit">查 询</el-button>
            <el-button size="small" type="warning" link icon="refresh" @click="onReset">重 置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="gva-table-box">

      <!-- 由于此处菜单跟左侧列表一一对应所以不需要分页 pageSize默认999 -->
      <el-table :data="tableData" row-key="ID" height="600px" @sort-change="sortChange">
        <el-table-column align="left" label="ID" min-width="100" prop="ID" sortable="custom" />
        <el-table-column align="left" label="项目编号" show-overflow-tooltip min-width="160" prop="projectNo" sortable="custom" />
        <el-table-column align="left" label="数据目录" show-overflow-tooltip min-width="160" prop="rawCleanDir" />
        <el-table-column align="left" label="分析类型" show-overflow-tooltip min-width="160" prop="analysisType" sortable="custom" />
        <el-table-column align="left" label="样本信息" show-overflow-tooltip min-width="160" prop="sampleInfo" />
        <el-table-column align="left" label="比较组" show-overflow-tooltip min-width="160" prop="cmpGroup" />
        <el-table-column align="left" label="物种名字" show-overflow-tooltip min-width="160" prop="speciesNames" sortable="custom" />
        <el-table-column align="left" label="差异阈值" show-overflow-tooltip min-width="160" prop="differenceThreshold" />
        <el-table-column align="left" label="子项目编号" show-overflow-tooltip min-width="160" prop="subProjectNo" />
        <el-table-column align="left" label="项目类型" show-overflow-tooltip min-width="160" prop="prjType" sortable="custom" />
        <el-table-column align="left" label="线程数" show-overflow-tooltip min-width="160" prop="paraNum" />
        <el-table-column align="left" label="测序类型" show-overflow-tooltip min-width="160" prop="seqType" />
        <el-table-column align="left" label="链特异性" show-overflow-tooltip min-width="160" prop="strand" />
        <el-table-column align="left" label="基因或转录本" show-overflow-tooltip min-width="160" prop="geneId" />
        <el-table-column align="left" label="结构类型" show-overflow-tooltip min-width="160" prop="featureType" />
        <el-table-column align="left" label="动植物" show-overflow-tooltip min-width="160" prop="category" sortable="custom" />
        <el-table-column align="left" label="近缘物种" show-overflow-tooltip min-width="160" prop="ppiSpecies" />
        <el-table-column align="left" label="状态" show-overflow-tooltip min-width="160" prop="state" />
        <!--        <el-table-column align="left" label="项目号" show-overflow-tooltip min-width="160" prop="projectNo">
          <template #header>
            <el-input v-model="searchProjectNo" size="small" placeholder="Type to search" />
          </template>
        </el-table-column>-->
        <el-table-column align="left" fixed="right" label="操作" width="230">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              link
              icon="edit"
              @click="editInfo(scope.row.ID)"
            >编辑</el-button>
            <el-button
              size="small"
              type="primary"
              link
              icon="delete"
              disabled
              @click="deleteMenu(scope.row.ID)"
            >删除</el-button>
            <el-button
              size="small"
              type="primary"
              link
              icon="download"
              disabled
              @click="downloadZip(scope.row.ID, scope.row.projectNo)"
            >下载</el-button>
<!--            <router-link tag="a" target="_blank" to="/viewReport" style="margin-left: 12px">
              <el-button
                size="small"
                type="primary"
                link
                icon="view"
              >预览</el-button>
            </router-link>-->
            <el-button
              size="small"
              type="primary"
              link
              icon="view"
              disabled
              @click="analysisState(scope.row.state)"
            >状态</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="gva-pagination">
        <el-pagination
          :current-page="page"
          :page-size="pageSize"
          :page-sizes="[10, 30, 50, 100]"
          :style="{ float: 'right', padding: '20px' }"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>
    <el-dialog v-model="dialogFormVisible" draggable :before-close="handleClose" :title="dialogTitle" :close-on-click-modal="false">
      <warning-bar title="注意：项目编号必须唯一" />
      <el-form
        v-if="dialogFormVisible"
        ref="menuForm"
        :inline="true"
        :model="form"
        :rules="rules"
        label-position="top"
        label-width="85px"
      >
        <el-form-item label="项目编号" prop="projectNo" style="width:30%">
          <el-input v-model="form.projectNo" autocomplete="off" placeholder="输入项目编号" clearable />
          <span style="font-size:12px;margin-right:12px;">类似于RNAS2208001的项目编号</span>
        </el-form-item>
        <el-form-item label="数据目录" prop="rawCleanDir" style="width:30%">
          <el-input v-model="form.rawCleanDir" autocomplete="off" placeholder="输入数据目录" clearable />
        </el-form-item>
        <el-form-item label="分析类型" prop="analysisType" style="width:30%">
          <el-input v-model="form.analysisType" autocomplete="off" placeholder="输入分析类型" clearable />
          <span style="font-size:12px;margin-right:12px;">支持填写(Transcriptome | DGE | scRNA | FastTranscriptome)</span>
        </el-form-item>
        <el-form-item label="样本信息" prop="sampleInfo" style="width:30%">
          <el-input v-model="form.sampleInfo" autocomplete="off" placeholder="输入样本信息" clearable />
          <span style="font-size:12px;margin-right:12px;">预置位不建议修改</span>
        </el-form-item>
        <el-form-item label="比较组" prop="cmpGroup" style="width:30%">
          <el-input v-model="form.cmpGroup" autocomplete="off" placeholder="输入样本信息" clearable />
          <span style="font-size:12px;margin-right:12px;">预置位不建议修改</span>
        </el-form-item>
        <el-form-item label="物种名字" prop="speciesNames" style="width:30%">
          <el-input v-model="form.speciesNames" autocomplete="off" placeholder="输入物种名字" clearable />
          <span style="font-size:12px;margin-right:12px;">支持填写(Homo_sapiens.GRCh38.89.chr | Mus_musculus.GRCm38.98 | Rattus_norvegicus.Rnor_6.0.85 | Arabidopsis_thaliana.TAIR10.37 | Oryza_sativa_IRGSP-1.0.36)</span>
        </el-form-item>
        <el-form-item label="差异阈值" prop="differenceThreshold" style="width:30%">
          <el-input v-model="form.differenceThreshold" autocomplete="off" placeholder="输入差异阈值" clearable />
          <span style="font-size:12px;margin-right:12px;">默认值(2,0.05,0.05)，自定义时必须以英文逗号分隔3个数值</span>
        </el-form-item>
        <el-form-item label="子项目编号" prop="subProjectNo" style="width:30%" clearable>
          <el-input v-model="form.subProjectNo" autocomplete="off" placeholder="可以是项目编号的数字部分" clearable />
          <span style="font-size:12px;margin-right:12px;">类似于2208001的子项目编号</span>
        </el-form-item>
        <el-form-item label="项目类型" prop="prjType" style="width:30%">
          <el-input v-model="form.prjType" autocomplete="off" placeholder="输入项目类型" clearable />
          <span style="font-size:12px;margin-right:12px;">支持填写(RNAS | WRSA | CCRS | LNRS | SMRS)</span>
        </el-form-item>
        <el-form-item label="线程数" prop="paraNum" style="width:30%">
          <!--          <el-input v-model.number="form.paraNum" autocomplete="off" placeholder="输入线程数" clearable />-->
          <el-input-number v-model="form.paraNum" :min="1" :max="90" />
          <span style="font-size:12px;margin-right:12px;">线程数(一般为样本数，默认6，上限为90)</span>
        </el-form-item>
        <el-form-item label="测序类型" prop="seqType" style="width:30%">
          <el-input v-model.number="form.seqType" autocomplete="off" placeholder="输入测序类型" clearable />
          <span style="font-size:12px;margin-right:12px;">支持填写(PE150 | SE50 | PE100)</span>
        </el-form-item>
        <el-form-item label="链特异性" prop="strand" style="width:30%">
          <el-select v-model="form.strand" placeholder="选择链特异性" clearable>
            <el-option
              v-for="item in yesOrNo"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="基因或转录本" prop="geneId" style="width:20%">
          <el-select v-model="form.geneId" placeholder="选择基因或转录本" clearable>
            <el-option
              v-for="item in geneIdOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="结构类型" prop="featureType" style="width:20%">
          <el-select v-model="form.featureType" placeholder="选择结构类型">
            <el-option
              v-for="item in featureTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="动植物" prop="category" style="width:20%">
          <el-select v-model="form.category" placeholder="选择动植物" clearable>
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="近缘物种" prop="ppiSpecies" style="width:20%">
          <el-select v-model="form.ppiSpecies" placeholder="选择近缘物种" clearable>
            <el-option
              v-for="item in ppiSpeciesOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </el-select>
          <span style="font-size:12px;margin-right:12px;">动物选择 9606,植物选择 3702</span>
        </el-form-item>
        <!--        <el-form-item label="物种名字" prop="speciesName" style="width:30%">
          <el-select v-model="form.speciesName" placeholder="选择物种名字">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="样本名称" prop="sampleName" style="width:30%">
          <el-input v-model="form.sampleName" autocomplete="off" placeholder="输入样本名称" />
        </el-form-item>
        <el-form-item label="项目类型" prop="projectType" style="width:30%">
          <el-select v-model="form.projectType" placeholder="选择项目类型">
            <el-option
              v-for="item in options2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>-->

      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button size="small" @click="closeDialog">取 消</el-button>
          <el-button size="small" type="primary" @click="enterDialog()">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
// import icon from '@/view/superAdmin/menu/icon.vue'
import warningBar from '@/components/warningBar/warningBar.vue'
import { useUserStore } from '@/pinia/modules/user'
import { reactive, ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { addAnaTrs, getAnaTrs, downloadPDF, downloadTemplate, getAnaTrsById, updateAnaTrs, sendNotification } from '@/api/transcriptome'
import { toSQLLine } from '@/utils/stringFun'
import SocketService from '@/utils/wsocket'
const path = ref(import.meta.env.VITE_BASE_API)
const rules = reactive({
  speciesName: [
    { required: true, message: '请选择物种名字', trigger: 'blur' }
  ],
  rawCleanDir: [
    { required: true, message: '请输入数据目录', trigger: 'blur' }
  ],
  sampleName: [
    { required: true, message: '请输入样本名称', trigger: 'blur' }
  ],
  projectType: [
    { required: true, message: '请选择项目类型', trigger: 'blur' }
  ],
  projectNo: [
    { required: true, message: '请输入项目号', trigger: 'blur' }
  ],
  analysisType: [
    { required: true, message: '请输入分析类型', trigger: 'blur' }
  ],
  sampleInfo: [
    { required: true, message: '请输入样本信息', trigger: 'blur' }
  ],
  cmpGroup: [
    { required: true, message: '请输入比较组', trigger: 'blur' }
  ],
  speciesNames: [
    { required: true, message: '请输入物种名字', trigger: 'blur' }
  ],
  differenceThreshold: [
    { required: true, message: '请输入差异阈值', trigger: 'blur' }
  ],
  subProjectNo: [
    { required: true, message: '请输入子项目编号', trigger: 'blur' }
  ],
  prjType: [
    { required: true, message: '请输入项目类型', trigger: 'blur' }
  ],
  seqType: [
    { required: true, message: '请输入测序类型', trigger: 'blur' }
  ],
  strand: [
    { required: true, message: '请选择链特异性', trigger: 'blur' }
  ],
  geneId: [
    { required: true, message: '请选择基因或转录本', trigger: 'blur' }
  ],
  featureType: [
    { required: true, message: '请选择结构类型', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择动植物', trigger: 'blur' }
  ],
  ppiSpecies: [
    { required: true, message: '请选择近缘物种', trigger: 'blur' }
  ],
})

const userStore = useUserStore()
// const threadingNums = ref(6)

// 定义表单字段
const form = ref({
  ID: 0,
  // speciesName: '',
  // sampleName: '',
  // projectType: '',
  projectNo: '',
  rawCleanDir: '',
  analysisType: '',
  sampleInfo: '',
  cmpGroup: '',
  speciesNames: '',
  differenceThreshold: '',
  subProjectNo: '',
  prjType: '',
  paraNum: 6,
  seqType: '',
  strand: false,
  geneId: '',
  featureType: '',
  category: '',
  ppiSpecies: '',
  state: '',
})
const yesOrNo = ref([
  {
    value: true,
    lable: 'yes',
  },
  {
    value: false,
    lable: 'no',
  }
])
const geneIdOptions = ref([
  {
    value: 'gene_id',
    lable: 'gene_id',
  },
  {
    value: 'transcript_id',
    lable: 'transcript_id',
  }
])
const featureTypeOptions = ref([
  {
    value: 'exon',
    lable: 'exon',
  },
  {
    value: 'CDS',
    lable: 'CDS',
  }
])
const categoryOptions = ref([
  {
    value: 'animal',
    lable: 'animal',
  },
  {
    value: 'plant',
    lable: 'plant',
  }
])
const ppiSpeciesOptions = ref([
  {
    value: '9606',
    lable: '9606',
  },
  {
    value: '3702',
    lable: '3702',
  }
])

const options = ref([
  {
    value: 'animal',
    label: 'animal',
  },
  {
    value: 'plant',
    label: 'plant',
  }
])

const options2 = ref([
  {
    value: 'mRNA',
    label: 'mRNA',
  },
  {
    value: 'sRNA',
    label: 'sRNA',
  },
  {
    value: 'lncRNA',
    label: 'lncRNA',
  },
  {
    value: 'circRNA',
    label: 'circRNA',
  },
  {
    value: 'wRNA',
    label: 'wRNA',
  },
])

const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const search = ref({})
const tableData = ref([])

const onReset = () => {
  search.value = {}
  getTableData()
}

// 搜索
const onSubmit = () => {
  page.value = 1
  pageSize.value = 10
  getTableData()
}

// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  getTableData()
}

const handleCurrentChange = (val) => {
  page.value = val
  getTableData()
}

// 排序
const sortChange = ({ prop, order }) => {
  if (prop) {
    if (prop === 'ID') {
      prop = 'id'
    }
    search.value.orderKey = toSQLLine(prop)
    search.value.desc = order === 'descending'
  }
  getTableData()
}

// 查询（支持条件查询）
const getTableData = async() => {
  const table = await getAnaTrs({ page: page.value, pageSize: pageSize.value, ...search.value })
  if (table.code === 0) {
    tableData.value = table.data.list
    total.value = table.data.total
    page.value = table.data.page
    pageSize.value = table.data.pageSize
  }
}
getTableData()

const editInfo = async(id) => {
  console.log('我是id：' + id)
  dialogTitle.value = '修改信息'
  const res = await getAnaTrsById({ id })
  form.value = res.data.trs
  isEdit.value = true
  // setOptions()
  dialogFormVisible.value = true
}

// 初始化弹窗内表格方法
const menuForm = ref(null)
const checkFlag = ref(false)
const initForm = () => {
  checkFlag.value = false
  // menuForm.value.resetFields()
  form.value = {
    ID: 0,
    // speciesName: '',
    // sampleName: '',
    // projectType: '',
    projectNo: '',
    rawCleanDir: '/work/rawdata/testFqRNASeq/',
    analysisType: 'Transcriptome',
    sampleInfo: 'info.txt',
    cmpGroup: 'cmp.txt',
    speciesNames: 'Homo_sapiens.GRCh38.89.chr',
    differenceThreshold: '2,0.05,0.05',
    subProjectNo: '',
    prjType: 'RNAS',
    paraNum: 6,
    seqType: 'PE150',
    strand: false,
    geneId: '',
    featureType: '',
    category: '',
    ppiSpecies: '',
    state: '',
  }
}
// 关闭弹窗

const dialogFormVisible = ref(false)
const closeDialog = () => {
  initForm()
  dialogFormVisible.value = false
}

// 添加菜单方法，id为 0则为添加根菜单
const isEdit = ref(false)
// const isDelete = ref(false)
const dialogTitle = ref('新增')

// 删除菜单
const deleteMenu = (id) => {
  ElMessageBox.confirm('此操作将永久删除所有角色下该菜单, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async() => {
      // editID.value = id - 0
      // isDelete.value = true
      ElMessage({
        type: 'success',
        message: '测试阶段!'
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消删除'
      })
    })
}

// 添加menu
const editID = ref()
const enterDialog = async() => {
  menuForm.value.validate(async valid => {
    if (valid) {
      let res
      if (isEdit.value) {
        res = await updateAnaTrs(form.value)
      } else {
        res = await addAnaTrs(form.value)
        // res = addAnaTrs(form.value)
      }
      console.log('code:\n')
      console.log(res.code)
      if (res.code === 0) {
        ElMessage({
          type: 'success',
          message: isEdit.value ? '修改成功' : '添加成功!'
        })
        // await getTableData()
        getTableData()
      }
      initForm()
      dialogFormVisible.value = false
    }
  })
}

// 添加菜单方法，id为 0则为添加根菜单
const rootMenuitem = ref(true)
const addMenu = (id) => {
  // editID.value = id - 0 // 参数id为行ID字符串，故需减0
  initForm()
  dialogTitle.value = '新增'
  form.value.parentId = String(id)
  isEdit.value = false
  // isDelete.value = false
  dialogFormVisible.value = true
  if (id === '0') {
    rootMenuitem.value = true
  } else {
    rootMenuitem.value = false
  }
}

// 批量 新建转录组
const loadExcel = (response, file, fileList) => {
  console.log('上传成功后信息：')
  console.log(JSON.parse(JSON.stringify(response)))
  console.log(typeof JSON.parse(JSON.stringify(response)))
  // console.log(file)
  // console.log(fileList)
  if (response.code === 0) {
    ElMessage({
      message: response.msg,
      type: 'success'
    })
    // getTableData()
  } else {
    ElMessage({
      message: response.msg,
      type: 'error'
    })
  }
  getTableData()
}

const beforeUpload = (file) => {
  const fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1)
  const whiteList = ['xls', 'xlsx']

  if (whiteList.indexOf(fileSuffix) === -1) {
    ElMessage({
      message: '上传文件只支持xls、xlsx格式，请按只是选择文件',
      type: 'warning'
    })
    // this.$message.error('上传文件只能是xls、xlsx格式')
    return false
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    ElMessage({
      message: '上传文件大小不能超过 2MB',
      type: 'warning'
    })
    // this.$message.error('上传文件大小不能超过 2MB')
    return false
  }
}

// 下载pdf 多文件请在后台压缩
const getPdf = async(id) => {
  // downloadPdf(tableData.value[id - 1].projectNo + '.txt')
  // await downloadPDF(id)
  await downloadPDF(id)
}
// 用fetch发送请求 对请求回来的二进制文件流进行处理
const downloadZip = async(id, name) => {
  await fetch('api/trs/downloadPdf?fileName=' + id, {
    method: 'GET',
    headers: { 'x-token': userStore.token },
  }).then(res => {
    console.log('嘿嘿')
    res.blob().then(blob => {
      console.log('哈哈')
      const blobUrl = window.URL.createObjectURL(blob)
      // 这里的文件名根据实际情况从响应头或者url里获取
      // const filename = response.headers.get('Content-Disposition').split('filename=')[1].split('.')
      // const filename = name + '.test.zip'
      const filename = name + ''
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = filename
      a.click()
      window.URL.revokeObjectURL(blobUrl)
    })
  })
}


const analysisState = async(btn) => {
  console.log(btn)
}

// 下载模板
const getTemplate = async() => {
  await downloadTemplate('template.xlsx')
}
// 发送邮件
const notice = async() => {
  sendNotification()
}

// el-dialog弹框关闭操作
const handleClose = (done) => {
  // initForm()
  done()
}
const getHeight = ref()
onMounted(() => {
  // getHeight.value = document.documentElement.clientHeight
  getHeight.value = document.body.clientHeight - 350
})
</script>

<style scoped>
.gva-button-box {
  padding-left: 24px;
  background-color: #fff;
  border-radius: 2px;
}
.gva-button-list {
  margin-bottom: 2px;
  display: flex;
}
</style>
