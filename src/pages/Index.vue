<template>
  <q-splitter
    v-model="data.splitterModel"
    class="index-page"
    style="height: 100%"
  >
    <template #before>
      <div style="min-width: 400px; height: 100%">
        <q-toolbar>
          <q-tabs v-model="data.tab">
            <q-tab name="settings" icon="settings" />
            <q-tab name="log" label="log" :disable="!data.ticked.length" />
            <q-tab name="add" icon="add" />
            <q-tab
              name="edit"
              icon="edit"
              :disable="data.ticked.length !== 1"
            />
          </q-tabs>
          <q-separator vertical inset color="white" />
          <q-btn
            flat
            icon="delete"
            :disable="!data.ticked.length"
            @click="deleteProject()"
          />
        </q-toolbar>
        <q-tree
          v-if="projects.length"
          v-model:ticked="data.ticked"
          :nodes="projects"
          node-key="repositoryUrl"
          label-key="name"
          control-color="primary"
          text-color="white"
          tick-strategy="strict"
          class="bg-dark"
          style="width: 100%; height: calc(100% - 54px)"
        ></q-tree>
      </div>
    </template>
    <template #after>
      <q-tab-panels v-model="data.tab">
        <q-tab-panel name="settings">
          <div class="text-h6">设置</div>
          <personalize />
        </q-tab-panel>
        <q-tab-panel name="log">
          <div class="text-h6">Git Log</div>
          <log-query-form :ticked="data.ticked" @log-query="logQuery" />
          <div>
            <div>cmd：</div>
            <q-input
              v-model="data.cmd"
              input-class="bg-dark text-grey-1"
              input-style="min-height: 20px"
              type="textarea"
            />
          </div>
          <div>
            <div>log：</div>
            <q-input
              v-model="data.log"
              input-class="bg-dark text-grey-1"
              input-style="min-height: 300px;"
              type="textarea"
            />
            <!--            <editor v-model="data.log" style="height: 300px" />-->
          </div>
        </q-tab-panel>
        <q-tab-panel name="add">
          <div class="text-h6">添加项目</div>
          <project-form />
        </q-tab-panel>
        <q-tab-panel name="edit">
          <div class="text-h6">编辑项目</div>
          <project-form
            v-if="data.editProject.data"
            :data="data.editProject.data"
            :index="data.editProject.index"
          />
        </q-tab-panel>
      </q-tab-panels>
    </template>
  </q-splitter>
</template>

<script lang="ts">
import { defineComponent, computed, reactive, watch } from 'vue';

import { useRouter, useRoute } from 'vue-router';
import { useQuasar } from 'quasar';

import Personalize from '@/components/Personalize.vue';
import ProjectForm from '@/components/project/form/Index.vue';
import LogQueryForm from '@/components/project/form/LogQuery.vue';
import { LogQueryData } from '@/components/project/form/models';
// import Editor from '@/components/editor/Ace.vue';
// import Editor from '@/components/editor/Monaco.vue';

import { DefaultLogFields, ListLogLine } from 'simple-git';

import { useProjectStore, ProjectType } from '@/stores/project';

export default defineComponent({
  // components: { Personalize, ProjectForm, LogQueryForm, Editor },
  components: { Personalize, ProjectForm, LogQueryForm },
  /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
  setup(props, context) {
    const router = useRouter();
    const route = useRoute();
    const $q = useQuasar();

    /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */

    const projectStore = useProjectStore();
    const projects = computed(() => projectStore.projects);
    const ticked = [] as string[];

    projects.value.forEach((value) => {
      ticked.push(value.repositoryUrl);
    });

    const data = reactive({
      tab: ticked.length ? 'log' : 'add',
      editProject: {
        data: null as ProjectType | null,
        index: -1,
      },
      ticked,
      log: '',
      cmd: '',
      splitterModel: 50,
    });

    function deleteProject() {
      $q.dialog({
        title: '删除确认',
        message: '确认要删除勾选的项目吗? ',
        ok: true,
        cancel: true,
      }).onOk(() => {
        for (let i = data.ticked.length - 1; i >= 0; i--) {
          const repositoryUrl = data.ticked[i];
          const project = projectStore.getProject({
            repositoryUrl,
          });
          if (project.data) {
            projectStore.setProject({
              data: project.data,
              index: project.index,
              action: 'delete',
            });
          }
          data.ticked.splice(i, 1);
          data.tab = ticked.length ? 'log' : 'add';
        }
      });
    }

    watch(
      computed(() => data.tab),
      (val) => {
        if (val === 'edit') {
          const project = projectStore.getProject({
            repositoryUrl: data.ticked[0],
          });
          data.editProject.data = project.data;
          data.editProject.index = project.index;
        } else if (val === 'add') {
          data.editProject.data = null;
          data.editProject.index = -1;
        }
      },
    );

    async function logQuery(logQueryData: LogQueryData) {
      data.log = '';
      data.cmd = '';
      for (let i = 0, end = data.ticked.length; i < end; i++) {
        const repositoryUrl = data.ticked[i];
        const project = projectStore.getProject({
          repositoryUrl,
        });
        const projectData = project.data as ProjectType;

        if (i) {
          data.log += `

${projectData.name}

`;
        } else {
          data.log += `${projectData.name}

`;
        }

        const logOptions: string[] = [];

        logQueryData.branches.forEach((branch) => {
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

        data.cmd += `git log ${logOptions.join(' ')}
`;
        // console.log(data.cmd);
        try {
          const logResult = await window.electron.git.logResult(
            projectData.directoryPath,
            logOptions,
          );
          logResult.all.forEach((log: DefaultLogFields & ListLogLine) => {
            if (logQueryData.onlyMessage) {
              if (logQueryData.dedup) {
                if (!data.log.includes(log.message)) {
                  data.log += `${log.message}
`;
                }
              } else {
                data.log += `${log.message}
`;
              }
            } else {
              for (const logKey in log) {
                if (logKey in log) {
                  data.log += `${logKey}:${String(
                    log[logKey as keyof typeof log],
                  )}
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
        //   data.cmd = `git log ${logOptions.join(" ")}`;
        //   // console.log(data.cmd);
        //   const logResult = await git.logResult(
        //     projectData.directoryPath,
        //     logOptions
        //   );
        //   logResult.all.forEach((log: DefaultLogFields & ListLogLine) => {
        //     if (logQueryData.onlyMessage) {
        //       if (logQueryData.dedup) {
        //         if (!data.log.includes(log.message)) {
        //           data.log += `\r\n${log.message}`;
        //         }
        //       } else {
        //         data.log += `\r\n${log.message}`;
        //       }
        //     } else {
        //       for (const logKey in log) {
        //         if (logKey in log) {
        //           data.log += `\r\n${logKey}:${
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

    return { projects, data, deleteProject, logQuery };
  },
});
</script>
<style lang="less">
.index-page {
  height: 100%;
}
</style>
