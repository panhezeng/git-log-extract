<template>
  <q-form
    class="project-form-comp"
    @submit="onSubmit"
    @reset="onReset"
  >
    <q-list>
      <q-item>
        <q-item-section>
          <q-input
            v-model="project.repositoryUrl"
            label="Git仓库地址"
            hint="项目Git远程仓库地址"
            lazy-rules
            :rules="repositoryUrlValidation"
            :disable="isEdit"
            clearable
            @update:model-value="repositoryUrlInput"
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
            :rules="[val => !!val || '输入项目Git账户用户名']"
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
            :rules="[val => !!val || '输入项目Git账户密码']"
            clearable
          >
            <template #append>
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
    <div
      class="row justify-center"
      style="margin: 20px 0"
    >
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
import {computed, defineComponent, reactive, ref} from 'vue';

import {useQuasar} from 'quasar';
import {useRoute, useRouter} from 'vue-router';

import type {ProjectType} from '@/renderer/stores/project';
import {project as initProjectData, useProjectStore} from '@/renderer/stores/project';

import {appTitle} from '@/common/index.json';
import {usePersonalizeStore} from '@/renderer/stores/personalize';
import {fileName as fileNameValidation} from '@/renderer/utils/validation';
import {AES, Utf8} from 'jscrypto/es6';
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
  emits: ['submit-success'],
  /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
  setup(props, context) {
    const router = useRouter();
    const route = useRoute();
    const $q = useQuasar();

    /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */

    const isEdit = computed(() => props.index > -1);

    const personalizeStore = usePersonalizeStore();
    const projectStore = useProjectStore();

    let initData = JSON.parse(JSON.stringify(initProjectData)) as ProjectType;

    if (isEdit.value && props.data) {
      initData = JSON.parse(JSON.stringify(props.data)) as ProjectType;
    } else {
      initData.username = personalizeStore.git.username;
      initData.password = personalizeStore.git.password;
    }
    if (initData.password) {
      initData.password = AES.decrypt(initData.password, 'Secret Passphrase').toString(Utf8);
    }

    const project = reactive<ProjectType>(JSON.parse(JSON.stringify(initData)));

    const repositoryUrlValidation = [
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
          projectStore.getProject({
            repositoryUrl: val,
          }).data
        ) {
          return '已存在相同仓库地址项目，请修改仓库地址';
        } else {
          return true;
        }
      },
    ];

    function repositoryUrlInput() {
      const found = /^https?:\/\/.*\/(.*)\.git$/.exec(project.repositoryUrl);
      if (Array.isArray(found)) {
        project.name = found[1];
      }
    }

    const projectNameValidation = [
      fileNameValidation,
      (val: string) => {
        if (val) {
          const appDataPath = window.electron.path.join(
            window.electron.app.getPath('appData'),
            appTitle,
          );
          const directoryPath = window.electron.path.join(appDataPath, 'temp', 'git', val);
          window.electron.fs.removeSync(directoryPath);
        }
        if (
          !props.data &&
          projectStore.getProject({
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
      const repositoryAuthUrl = await window.electron.git.repositoryAuthUrl(
        project.repositoryUrl,
        project.username,
        project.password,
      );
      const appDataPath = window.electron.path.join(
        window.electron.app.getPath('appData'),
        appTitle,
      );
      const directoryPath = window.electron.path.join(appDataPath, 'temp', 'git', project.name);
      project.directoryPath = directoryPath;
      window.electron.fs.ensureDirSync(directoryPath);
      window.electron.fs.emptyDirSync(directoryPath);
      const branchSummary = await window.electron.git.branchSummary(
        directoryPath,
        repositoryAuthUrl,
      );
      project.branches = branchSummary.all;
      const data = JSON.parse(JSON.stringify(project)) as ProjectType;
      data.password = AES.encrypt(data.password, 'Secret Passphrase').toString();
      projectStore.setProject({
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
      repositoryUrlValidation,
      repositoryUrlInput,
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
