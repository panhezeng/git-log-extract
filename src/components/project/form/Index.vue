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
            @update:model-value="repositoryURLInput"
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
      <q-btn
        label="重置"
        type="reset"
        color="purple"
        flat
        class="q-ml-sm"
        :loading="submitLoading"
      />
    </div>
  </q-form>
</template>

<script lang="ts">
import { computed, defineComponent, ref, reactive } from 'vue';
import {
  names,
  project as initProjectData,
  ProjectType,
} from '@/store/project';
import {
  names as namesPersonalize,
  StateInterface as StateInterfacePersonalize,
} from '@/store/personalize';
import CryptoJS from 'crypto-js';
import { fileName as fileNameValidation } from '@/utils/validation';
import PathType from 'path';
import FSType from 'fs-extra';

import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { useQuasar } from 'quasar';

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
  setup(props, context) {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const $q = useQuasar();

    const fs = window.electronFS as typeof FSType;
    const path = window.electronPath as typeof PathType;
    const git = window.electronGit;
    /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */

    const isEdit = computed(() => props.index > -1);

    const statePersonalize = computed<StateInterfacePersonalize>(
      () => store.state[namesPersonalize.module]
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
        'Secret Passphrase'
      ).toString(CryptoJS.enc.Utf8);
    }

    const project = reactive<ProjectType>(JSON.parse(JSON.stringify(initData)));

    const repositoryURLValidation = [
      (val: string) => {
        if (/^https?:\/\/.*\.git$/.test(val)) {
          return true;
        } else {
          return '请输入有效的git仓库地址，http开始，.git结尾';
        }
      },
      (val: string) => {
        if (
          !props.data &&
          store.getters[names.module + '/' + names.getters.GET_PROJECT]({
            repositoryURL: val,
          }).data
        ) {
          return '已存在相同仓库地址项目，请修改仓库地址';
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
          const gitPath = path.resolve('temp/git/' + val);
          fs.removeSync(gitPath);
        }
        if (
          !props.data &&
          store.getters[names.module + '/' + names.getters.GET_PROJECT]({
            name: val,
          }).data
        ) {
          return '已存在同名项目，请修改项目名称';
        } else {
          return true;
        }
      },
    ] as any[];

    const isPwd = ref(true);
    const submitLoading = ref(false);

    function onReset() {
      Object.assign(project, initData);
    }

    async function onSubmit() {
      submitLoading.value = true;
      const repositoryAuthURL = git.repositoryAuthURL(
        project.repositoryURL,
        project.username,
        project.password
      );
      const gitPath = path.resolve('temp/git/' + project.name);
      project.gitPath = gitPath;
      fs.emptyDirSync(gitPath);
      const branchSummary = await git.branchSummary(gitPath, repositoryAuthURL);
      project.branches = branchSummary.all;
      const data = JSON.parse(JSON.stringify(project)) as ProjectType;
      data.password = CryptoJS.AES.encrypt(
        data.password,
        'Secret Passphrase'
      ).toString();
      store.commit(names.module + '/' + names.mutations.SET_PROJECT, {
        data,
        action: isEdit.value ? 'edit' : 'add',
        index: props.index,
      });
      context.emit('submit-success', data);
      $q.notify({
        message: '保存成功',
        type: 'positive',
        position: 'bottom-right',
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
