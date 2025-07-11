<template>
  <q-form
    class="project-form-comp"
    @submit="onSubmit"
    @reset="onReset"
  >
    <q-tabs
      v-model="project.protocolType"
      class="text-primary"
    >
      <q-tab
        name="ssh"
        label="ssh"
      />
      <q-tab
        name="https"
        label="https"
      />
    </q-tabs>
    <q-list>
      <q-item>
        <q-item-section>
          <q-input
            v-model="project.repositoryAddress"
            label="Git仓库地址"
            hint="项目Git远程仓库地址"
            lazy-rules
            :rules="repositoryAddressValidation"
            :disable="isEdit"
            clearable
            @update:model-value="repositoryAddressInput"
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
            v-model="project.directoryPath"
            label="项目本地目录"
            hint="默认使用软件目录下的temp目录"
            clearable
          />
        </q-item-section>
      </q-item>
      <template v-if="project.protocolType === 'ssh'">
        <q-item>
          <q-item-section>
            <q-input
              v-model="project.sshKey"
              label="Git用户名"
              lazy-rules
              :rules="[val => !!val || '输入ssh秘钥']"
              clearable
            />
          </q-item-section>
        </q-item>
      </template>
      <template v-else>
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
      </template>
    </q-list>
    <div
      class="row justify-center"
      style="margin: 20px 0"
    >
      <q-btn
        label="重置"
        type="reset"
        color="purple"
        flat
        class="q-ml-sm"
        :loading="submitLoading"
      />
      <q-btn
        label="提交"
        type="submit"
        color="purple"
        :loading="submitLoading"
      />
    </div>
  </q-form>
</template>

<script lang="ts" setup>
import {computed, reactive, ref} from 'vue';

import {useQuasar} from 'quasar';
import {useRoute, useRouter} from 'vue-router';

import type {ProjectType} from '../../../stores/project';
import {project as initProjectData, useProjectStore} from '../../../stores/project';

import {config} from '@vite-electron-builder/common';
import {usePersonalizeStore} from '../../../stores/personalize';
import {fileName as fileNameValidation} from '../../../utils/validation';
import {AES, Utf8} from 'jscrypto/es6';

const props = defineProps({
  data: {
    type: null,
    default: undefined,
  },
  index: {
    type: Number,
    default: -1,
  },
});
const emit = defineEmits(['submit-success']);

/* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
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
  initData.sshKey = personalizeStore.git.sshKey;
}
if (initData.password) {
  initData.password = AES.decrypt(initData.password, 'Secret Passphrase').toString(Utf8);
}

const project = reactive<ProjectType>(JSON.parse(JSON.stringify(initData)));

const repositoryAddressValidation = [
  (val: string) => {
    if (project.protocolType === 'ssh') {
      if (/^git@.*\.git$/.test(val)) {
        return true;
      } else {
        return '请输入有效的git仓库地址，git@开始，.git结尾';
      }
    } else {
      if (/^https?:\/\/.*\.git$/.test(val)) {
        return true;
      } else {
        return '请输入有效的git仓库地址，http开始，.git结尾';
      }
    }
  },
  (val: string) => {
    if (
      !props.data &&
      projectStore.getProject({
        repositoryAddress: val,
      }).data
    ) {
      return '已存在相同仓库地址项目，请修改仓库地址';
    } else {
      return true;
    }
  },
];

function repositoryAddressInput() {
  if (project.protocolType === 'ssh') {
    const found = /^git@.*\/(.*)\.git$/.exec(project.repositoryAddress);
    if (Array.isArray(found)) {
      project.name = found[1];
    }
  } else {
    const found = /^https?:\/\/.*\/(.*)\.git$/.exec(project.repositoryAddress);
    if (Array.isArray(found)) {
      project.name = found[1];
    }
  }
}

const projectNameValidation = [
  fileNameValidation,
  (val: string) => {
    if (val) {
      if (project.directoryPath) {
        return true;
      }
      const appDataPath = window[btoa('electron')].path.join(
        window[btoa('electron')].app.getPath('appData'),
        config.appTitle,
      );
      const directoryPath = window[btoa('electron')].path.join(appDataPath, 'temp', 'git', val);
      window[btoa('electron')].fs.removeSync(directoryPath);
    }
    if (
      !props.data &&
      projectStore.getProject({
        name: val,
      }).data
    ) {
      return '已存在同名项目，请修改项目名称';
    }
    return true;
  },
] as any[];

const isPwd = ref(true);
const submitLoading = ref(false);

function onReset() {
  submitLoading.value = true;
  Object.assign(project, initData);
  submitLoading.value = false;
}

async function onSubmit() {
  submitLoading.value = true;
  const appDataPath = window[btoa('electron')].path.join(
    window[btoa('electron')].app.getPath('appData'),
    config.appTitle,
  );
  let directoryPath = project.directoryPath;
  if (!directoryPath) {
    directoryPath = window[btoa('electron')].path.join(appDataPath, 'temp', 'git', project.name);
    project.directoryPath = directoryPath;
    window[btoa('electron')].fs.ensureDirSync(directoryPath);
    console.log(directoryPath);
    window[btoa('electron')].fs.emptyDirSync(directoryPath);
  }
  const branchSummary = await window[btoa('electron')].git.branchSummary(
    JSON.stringify(project),
    personalizeStore.logQuery.shallowSince,
  );
  project.branches = branchSummary.all;
  const data = JSON.parse(JSON.stringify(project)) as ProjectType;
  data.password = AES.encrypt(data.password, 'Secret Passphrase').toString();
  projectStore.setProject({
    data,
    action: isEdit.value ? 'edit' : 'add',
    index: props.index,
  });
  emit('submit-success', data);
  $q.notify({
    message: '保存成功',
    type: 'positive',
    position: 'center',
  });
  submitLoading.value = false;
}
</script>
<style lang="less">
.project-form-comp {
}
</style>
