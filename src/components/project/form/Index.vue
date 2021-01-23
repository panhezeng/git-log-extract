<template>
  <q-form class="project-form-comp" @submit="onSubmit" @reset="onReset">
    <q-list>
      <q-item>
        <q-item-section>
          <q-input
            v-model="project.repositoryURL"
            label="Git仓库地址"
            hint="项目Git远程仓库地址"
            lazy-rules
            :rules="repositoryURLValidation"
            :disable="isEdit"
            clearable
            @input="repositoryURLInput"
          />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-input
            v-model="project.name"
            label="项目名称"
            hint="默认使用项目Git仓库名"
            lazy-rules
            :rules="projectNameValidation"
            clearable
          />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-input
            v-model="project.username"
            label="Git用户名"
            lazy-rules
            :rules="[(val) => !!val || '输入项目Git账户用户名']"
            clearable
          />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-input
            v-model="project.password"
            label="Git密码"
            :type="isPwd ? 'password' : 'text'"
            lazy-rules
            :rules="[(val) => !!val || '输入项目Git账户密码']"
            clearable
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
        </q-item-section>
      </q-item>
    </q-list>
    <div class="row justify-center" style="margin: 20px 0">
      <q-btn
        label="提交"
        type="submit"
        color="purple"
        :loading="submitLoading"
      />
      <q-btn label="重置" type="reset" color="purple" flat class="q-ml-sm" />
    </div>
  </q-form>
</template>

<script lang="ts">
import Vue from "vue";
import {
  computed,
  defineComponent,
  ref,
  getCurrentInstance,
  SetupContext,
  reactive,
} from "@vue/composition-api";
import {
  names,
  project as initProjectData,
  ProjectType,
} from "@/store/project";
import {
  names as namesPersonalize,
  StateInterface as StateInterfacePersonalize,
} from "@/store/personalize";
import CryptoJS from "crypto-js";
import { fileName as fileNameValidation } from "@/utils/validation";
import { URL } from "url";
import path from "path";
import fs from "fs-extra";
import simpleGit, { BranchSummary } from "simple-git";

export default defineComponent({
  components: {},
  props: {
    data: {
      type: null,
      default: undefined,
    },
    index: {
      type: Number,
      default: -1,
    },
  },
  /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
  setup(
    props: { data: null | ProjectType; index: number },
    context: SetupContext
  ) {
    const internalInstance = getCurrentInstance()!;
    const componentInstance = internalInstance.proxy as Vue & {
      [key: string]: any;
    };
    const { $axios, $store, $router, $q } = componentInstance;
    //  $route 不能析构，会丢失反应
    const $route = computed(() => componentInstance.$route);
    const $emit = context.emit;
    /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */

    const isEdit = computed(() => props.index > -1);

    const statePersonalize = computed<StateInterfacePersonalize>(
      () => $store.state[namesPersonalize.module]
    );

    let initData = JSON.parse(JSON.stringify(initProjectData)) as ProjectType;

    if (isEdit.value && props.data) {
      initData = JSON.parse(JSON.stringify(props.data)) as ProjectType;
    } else {
      initData.username = statePersonalize.value.git.username;
      initData.password = statePersonalize.value.git.password;
    }
    if (initData.password) {
      initData.password = CryptoJS.AES.decrypt(
        initData.password,
        "Secret Passphrase"
      ).toString(CryptoJS.enc.Utf8);
    }

    const project = reactive<ProjectType>(JSON.parse(JSON.stringify(initData)));

    const repositoryURLValidation = [
      (val: string) => {
        if (/^https?:\/\/.*\.git$/.test(val)) {
          return true;
        } else {
          return "请输入有效的git仓库地址，http开始，.git结尾";
        }
      },
      (val: string) => {
        if (
          !props.data &&
          $store.getters[names.module + "/" + names.getters.GET_PROJECT]({
            repositoryURL: val,
          }).data
        ) {
          return "已存在相同仓库地址项目，请修改仓库地址";
        } else {
          return true;
        }
      },
    ];

    function repositoryURLInput() {
      const found = project.repositoryURL.match(/^https?:\/\/.*\/(.*)\.git$/);
      if (Array.isArray(found)) {
        project.name = found[1];
      }
    }

    const projectNameValidation = [
      fileNameValidation,
      (val: string) => {
        if (val) {
          const gitPath = path.resolve(process.cwd(), "temp/git/" + val);
          fs.removeSync(gitPath);
        }
        if (
          !props.data &&
          $store.getters[names.module + "/" + names.getters.GET_PROJECT]({
            name: val,
          }).data
        ) {
          return "已存在同名项目，请修改项目名称";
        } else {
          return true;
        }
      },
    ];

    const isPwd = ref(true);
    const submitLoading = ref(false);

    function onReset() {
      for (const key in project) {
        if (Object.prototype.hasOwnProperty.call(project, key)) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          project[key] = initData[key];
        }
      }
    }

    async function onSubmit() {
      submitLoading.value = true;
      const urlObj = new URL(project.repositoryURL);
      urlObj.username = project.username;
      urlObj.password = project.password;
      project.repositoryAuthURL = urlObj.href;
      const gitPath = path.resolve(process.cwd(), "temp/git/" + project.name);
      fs.emptyDirSync(gitPath);
      const git = simpleGit(gitPath);
      await git.init();
      await git.addRemote("origin", project.repositoryAuthURL);
      await git.remote(["update"]);
      const branchSummary: BranchSummary = await git.branch(["-r"]);
      project.branches = branchSummary.all;
      const data = JSON.parse(JSON.stringify(project)) as ProjectType;
      data.password = CryptoJS.AES.encrypt(
        data.password,
        "Secret Passphrase"
      ).toString();
      $store.commit(names.module + "/" + names.mutations.SET_PROJECT, {
        data,
        action: isEdit.value ? "edit" : "add",
        index: props.index,
      });
      $emit("submit", data);
      $q.notify({
        message: "保存成功",
        type: "positive",
        position: "bottom-right",
      });
      submitLoading.value = false;
    }

    return {
      isEdit,
      project,
      repositoryURLValidation,
      repositoryURLInput,
      projectNameValidation,
      isPwd,
      submitLoading,
      onSubmit,
      onReset,
    };
  },
});
</script>
<style lang="less">
.project-form-comp {
}
</style>
