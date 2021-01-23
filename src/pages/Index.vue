<template>
  <q-splitter
    class="index-page"
    v-model="data.splitterModel"
    style="height: 100%"
  >
    <template v-slot:before>
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
          :nodes="projects"
          node-key="repositoryAuthURL"
          label-key="name"
          control-color="primary"
          text-color="white"
          tick-strategy="strict"
          class="bg-dark"
          style="width: 100%; height: calc(100% - 54px)"
          :ticked.sync="data.ticked"
        ></q-tree>
      </div>
    </template>
    <template v-slot:after>
      <q-tab-panels v-model="data.tab">
        <q-tab-panel name="settings">
          <div class="text-h6">设置</div>
          <personalize />
        </q-tab-panel>
        <q-tab-panel name="log">
          <div class="text-h6">Git Log</div>
          <log-query-form :ticked="data.ticked" @submit="logQuery" />
          <editor
            v-model="data.log"
            :options="{ language: '' }"
            style="height: 500px"
          />
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
import Vue from "vue";
import {
  defineComponent,
  computed,
  getCurrentInstance,
  reactive,
  SetupContext,
  watch,
} from "@vue/composition-api";
import {
  names,
  names as namesProject,
  ProjectType,
  StateInterface as StateInterfaceProject,
} from "@/store/project";
import Personalize from "@/components/Personalize.vue";
import ProjectForm from "@/components/project/form/Index.vue";
import LogQueryForm from "@/components/project/form/LogQuery.vue";
import Editor from "@/components/editor/Index.vue";
import path from "path";
import simpleGit, { LogResult } from "simple-git";
import { LogQueryData } from "@/components/project/form/models";

export default defineComponent({
  components: { Personalize, ProjectForm, LogQueryForm, Editor },
  /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
  setup(props: { [key: string]: any }, context: SetupContext) {
    const internalInstance = getCurrentInstance()!;
    const componentInstance = internalInstance.proxy as Vue & {
      [key: string]: any;
    };
    const { $axios, $store, $router, $q } = componentInstance;
    //  $route 不能析构，会丢失反应
    const $route = computed(() => componentInstance.$route);
    const $emit = context.emit;
    /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */

    const stateProject = computed<StateInterfaceProject>(
      () => $store.state[namesProject.module]
    );

    const projects = computed(() => stateProject.value.projects);

    const ticked = [] as string[];

    projects.value.forEach((value) => {
      ticked.push(value.repositoryAuthURL);
    });

    const data = reactive({
      tab: ticked.length ? "log" : "add",
      editProject: {
        data: null as ProjectType | null,
        index: -1,
      },
      ticked,
      log: "",
      splitterModel: 50,
    });

    function deleteProject() {
      $q.dialog({
        title: "删除确认",
        message: "确认要删除勾选的项目吗? ",
        ok: true,
        cancel: true,
      }).onOk(() => {
        for (let i = data.ticked.length - 1; i >= 0; i--) {
          const repositoryAuthURL = data.ticked[i];
          $store.commit(
            namesProject.module + "/" + namesProject.mutations.SET_PROJECT,
            Object.assign(
              {
                action: "delete",
              },
              $store.getters[names.module + "/" + names.getters.GET_PROJECT]({
                repositoryAuthURL,
              })
            )
          );
          data.ticked.splice(i, 1);
        }
      });
    }

    watch(
      computed(() => data.tab),
      (val) => {
        if (val === "edit") {
          const project = $store.getters[
            names.module + "/" + names.getters.GET_PROJECT
          ]({
            repositoryAuthURL: data.ticked[0],
          });
          data.editProject.data = project.data;
          data.editProject.index = project.index;
        } else if (val === "add") {
          data.editProject.data = null;
          data.editProject.index = -1;
        }
      }
    );

    async function logQuery(logQueryData: LogQueryData) {
      for (let i = 0, end = data.ticked.length; i < end; i++) {
        const repositoryAuthURL = data.ticked[i];
        const project = $store.getters[
          names.module + "/" + names.getters.GET_PROJECT
        ]({
          repositoryAuthURL,
        });
        const projectData = project.data as ProjectType;

        data.log = projectData.name;

        const gitPath = path.resolve(
          process.cwd(),
          "temp/git/" + projectData.name
        );
        const git = simpleGit(gitPath);
        await git.remote(["update"]);
        const logOptions: string[] = [];
        if (logQueryData.author) {
          logOptions.push(`--author=${logQueryData.author}`);
        }
        if (logQueryData.dateRange.from) {
          logOptions.push(`--since=${logQueryData.dateRange.from} 00:00:00`);
          logOptions.push(`--until=${logQueryData.dateRange.to} 23:59:59`);
        }
        if (logQueryData.noMerges) {
          logOptions.push(`--no-merges`);
        }
        for (let j = 0, jEnd = logQueryData.branches.length; j < jEnd; j++) {
          const branch = logQueryData.branches[j];
          if (j) {
            logOptions.shift();
          }
          logOptions.unshift(branch);
          const logResult: LogResult = await git.log(logOptions);
          logResult.all.forEach((log) => {
            if (logQueryData.onlyMessage) {
              if (logQueryData.dedup) {
                if (!data.log.includes(log.message)) {
                  data.log += `\r\n${log.message}`;
                }
              } else {
                data.log += `\r\n${log.message}`;
              }
            } else {
              for (const logKey in data.log) {
                if (Object.prototype.hasOwnProperty.call(data.log, logKey)) {
                  data.log += `\r\n${logKey}:${log[logKey]}`;
                }
              }
            }
          });
        }
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
