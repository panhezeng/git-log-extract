<template>
  <q-layout>
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>Git 项目列表</q-toolbar-title>
        <q-btn
          flat
          round
          dense
          icon="settings"
          label="设置"
          style="margin-right: 20px"
          @click="data.dialog.settings.visible = true"
        />
        <q-btn
          flat
          round
          dense
          icon="cloud_download"
          label="拉取"
          style="margin-right: 20px"
          :disable="!data.ticked.length"
          @click="syncProjects()"
        />
        <q-btn
          flat
          round
          dense
          icon="add"
          label="添加"
          style="margin-right: 20px"
          @click="addProject()"
        />
        <q-btn
          flat
          round
          dense
          icon="edit"
          label="编辑"
          style="margin-right: 20px"
          :disable="data.ticked.length !== 1"
          @click="editProject()"
        />
        <q-btn
          flat
          round
          dense
          icon="article"
          label="日志"
          style="margin-right: 20px"
          :disable="!data.ticked.length"
          @click="data.dialog.log.visible = true"
        />
        <q-btn
          flat
          round
          dense
          icon="delete"
          label="删除"
          :disable="!data.ticked.length"
          @click="deleteProject()"
        />
      </q-toolbar>
      <q-dialog
        v-if="data.dialog.settings.visible"
        v-model="data.dialog.settings.visible"
        persistent
        maximized
        transition-show="slide-up"
        transition-hide="slide-down"
      >
        <q-card>
          <q-bar class="bg-primary text-white">
            <q-space />
            <q-btn
              v-close-popup
              dense
              flat
              icon="close"
            >
              <q-tooltip class="bg-white text-primary">关闭</q-tooltip>
            </q-btn>
          </q-bar>

          <q-card-section>
            <div class="text-h6">全局设置</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <personalize />
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog
        v-if="data.dialog.add.visible"
        v-model="data.dialog.add.visible"
        persistent
        maximized
        transition-show="slide-up"
        transition-hide="slide-down"
      >
        <q-card>
          <q-bar class="bg-primary text-white">
            <q-space />
            <q-btn
              v-close-popup
              dense
              flat
              icon="close"
            >
              <q-tooltip class="bg-white text-primary">关闭</q-tooltip>
            </q-btn>
          </q-bar>

          <q-card-section>
            <div class="text-h6">添加项目</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <project-form @submit-success="data.dialog.add.visible = false" />
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog
        v-if="data.dialog.edit.visible"
        v-model="data.dialog.edit.visible"
        persistent
        maximized
        transition-show="slide-up"
        transition-hide="slide-down"
      >
        <q-card>
          <q-bar class="bg-primary text-white">
            <q-space />
            <q-btn
              v-close-popup
              dense
              flat
              icon="close"
            >
              <q-tooltip class="bg-white text-primary">关闭</q-tooltip>
            </q-btn>
          </q-bar>

          <q-card-section>
            <div class="text-h6">编辑项目</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <project-form
              v-if="data.dialog.edit.data"
              :data="data.dialog.edit.data"
              :index="data.dialog.edit.index"
            />
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog
        v-if="data.dialog.log.visible"
        v-model="data.dialog.log.visible"
        persistent
        maximized
        transition-show="slide-up"
        transition-hide="slide-down"
      >
        <q-card>
          <q-bar class="bg-primary text-white">
            <q-space />
            <q-btn
              v-close-popup
              dense
              flat
              icon="close"
            >
              <q-tooltip class="bg-white text-primary">关闭</q-tooltip>
            </q-btn>
          </q-bar>

          <q-card-section>
            <div class="text-h6">日志</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <log-query-form
              :ticked="data.ticked"
              @log-query="logQuery"
            />
            <div>
              <div>命令内容：</div>
              <q-input
                v-model="data.dialog.log.cmd"
                input-class="bg-dark text-grey-1"
                input-style="min-height: 20px"
                type="textarea"
              />
            </div>
            <div>
              <div>日志内容：</div>
              <q-input
                v-model="data.dialog.log.content"
                input-class="bg-dark text-grey-1"
                input-style="min-height: 300px;"
                type="textarea"
              />
              <!--            <editor v-model="data.dialog.log.content" style="height: 300px" />-->
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
    </q-header>

    <q-page-container>
      <q-page padding>
        <q-tree
          v-if="projects.length"
          v-model:ticked="data.ticked"
          :nodes="projects"
          node-key="repositoryAddress"
          label-key="name"
          tick-strategy="strict"
        ></q-tree>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import {computed, reactive} from 'vue';

import Personalize from '../components/Personalize.vue';
import ProjectForm from '../components/project/form/index.vue';
import LogQueryForm from '../components/project/form/LogQuery.vue';
import type {LogQueryData} from '../components/project/form/models';
import {useQuasar} from 'quasar';
import {useRoute, useRouter} from 'vue-router';
// import Editor from '../components/editor/Ace.vue';
// import Editor from '../components/editor/Monaco.vue';

import type {DefaultLogFields, ListLogLine} from 'simple-git';

import type {ProjectType} from '../stores/project';
import {id, useProjectStore} from '../stores/project';
import {toRaw, unref} from 'vue';
import {usePersonalizeStore} from '../stores/personalize.ts';

/* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
const router = useRouter();
const route = useRoute();
const $q = useQuasar();
/* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */

const personalizeStore = usePersonalizeStore();
const projectStore = useProjectStore();
const projects = computed(() => projectStore.projects);
const ticked = [] as string[];

projects.value.forEach(value => {
  ticked.push(value.repositoryAddress);
});

const data = reactive({
  ticked,
  dialog: {
    settings: {
      visible: false,
    },
    add: {
      visible: false,
    },
    edit: {
      visible: false,
      data: null as ProjectType | null,
      index: -1,
    },
    log: {
      visible: false,
      content: '',
      cmd: '',
    },
  },
});

async function syncProjects() {
  const dialog = $q.dialog({
    message: '拉取中...',
    progress: true, // we enable default settings
    persistent: true, // we want the user to not be able to close it
    ok: false, // we want the user to not be able to close it
  });
  try {
    for (let i = data.ticked.length - 1; i >= 0; i--) {
      const repositoryAddress = data.ticked[i];
      const project = projectStore.getProject({
        repositoryAddress,
      });
      const projectData = project.data as ProjectType;
      const directoryPath = projectData.directoryPath;
      if (/temp[/\\]git/.test(directoryPath)) {
        window[btoa('electron')].fs.ensureDirSync(directoryPath);
        window[btoa('electron')].fs.emptyDirSync(directoryPath);
      }
      const branchSummary = await window[btoa('electron')].git.branchSummary(
        JSON.stringify(toRaw(unref(projectData))),
        personalizeStore.logQuery.shallowSince,
      );
      projectData.branches = branchSummary.all;
    }
    window[btoa('electron')].store.set({
      [`store_${id}`]: {projects: toRaw(unref(projects))},
    });
  } finally {
    dialog.hide();
  }
}

function deleteProject() {
  $q.dialog({
    title: '删除确认',
    message: '确认要删除勾选的项目吗? ',
    ok: true,
    cancel: true,
  }).onOk(() => {
    for (let i = data.ticked.length - 1; i >= 0; i--) {
      const repositoryAddress = data.ticked[i];
      const project = projectStore.getProject({
        repositoryAddress,
      });
      if (project.data) {
        projectStore.setProject({
          data: project.data,
          index: project.index,
          action: 'delete',
        });
      }
      data.ticked.splice(i, 1);
    }
  });
}

function addProject() {
  data.dialog.edit.data = null;
  data.dialog.edit.index = -1;
  data.dialog.add.visible = true;
}

function editProject() {
  const project = projectStore.getProject({
    repositoryAddress: data.ticked[0],
  });
  data.dialog.edit.data = project.data;
  data.dialog.edit.index = project.index;
  data.dialog.edit.visible = true;
}

async function logQuery(logQueryData: LogQueryData) {
  data.dialog.log.content = '';
  data.dialog.log.cmd = '';
  for (let i = 0, end = data.ticked.length; i < end; i++) {
    const repositoryAddress = data.ticked[i];
    const project = projectStore.getProject({
      repositoryAddress,
    });
    const projectData = project.data as ProjectType;

    if (i) {
      data.dialog.log.content += `

${projectData.name}

`;
    } else {
      data.dialog.log.content += `${projectData.name}

`;
    }

    const logOptions: string[] = [];

    logQueryData.branches.forEach(branch => {
      if (projectData.branches.includes(branch)) {
        logOptions.push(branch);
      }
    });

    if (logQueryData.author) {
      logOptions.push(`--author=${logQueryData.author}`);
    }
    if (logQueryData.dateRange.from) {
      logOptions.push(`--since="${logQueryData.dateRange.from} 00:00:00"`);
      logOptions.push(`--until="${logQueryData.dateRange.to} 23:59:59"`);
    }
    if (logQueryData.noMerges) {
      logOptions.push('--no-merges');
    }

    data.dialog.log.cmd += `git log ${logOptions.join(' ')}
`;
    // console.log(data.dialog.log.cmd);
    try {
      const logResult = await window[btoa('electron')].git.logResult(
        JSON.stringify(projectData),
        logOptions,
        personalizeStore.logQuery.shallowSince,
      );
      logResult.all.forEach((log: DefaultLogFields & ListLogLine) => {
        if (logQueryData.onlyMessage) {
          if (logQueryData.dedup) {
            if (!data.dialog.log.content.includes(log.message)) {
              data.dialog.log.content += `${log.message}
`;
            }
          } else {
            data.dialog.log.content += `${log.message}
`;
          }
        } else {
          for (const logKey in log) {
            if (logKey in log) {
              data.dialog.log.content += `${logKey}:${String(log[logKey as keyof typeof log])}
`;
            }
          }
        }
      });
      // eslint-disable-next-line no-empty
    } catch (e) {}

    // for (let j = 0, jEnd = logQueryData.branches.length; j < jEnd; j++) {
    //   const branch = logQueryData.branches[j];
    //   if (j) {
    //     logOptions.shift();
    //   }
    //   logOptions.unshift(branch);
    //   data.dialog.log.cmd = `git log ${logOptions.join(" ")}`;
    //   // console.log(data.dialog.log.cmd);
    //   const logResult = await git.logResult(
    //     projectData.directoryPath,
    //     logOptions
    //   );
    //   logResult.all.forEach((log: DefaultLogFields & ListLogLine) => {
    //     if (logQueryData.onlyMessage) {
    //       if (logQueryData.dedup) {
    //         if (!data.dialog.log.content.includes(log.message)) {
    //           data.dialog.log.content += `\r\n${log.message}`;
    //         }
    //       } else {
    //         data.dialog.log.content += `\r\n${log.message}`;
    //       }
    //     } else {
    //       for (const logKey in log) {
    //         if (logKey in log) {
    //           data.dialog.log.content += `\r\n${logKey}:${
    //             String(log[logKey as keyof typeof log])
    //           }`;
    //         }
    //       }
    //     }
    //   });
    // }
  }
  logQueryData.loading = false;
}
</script>
<style lang="less">
.index-page {
  height: 100%;
}
</style>
