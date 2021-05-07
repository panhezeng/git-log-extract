<template>
  <q-form
    class="project-form-log-query-comp"
    @submit="onSubmit"
    @reset="onReset"
  >
    <div>
      <q-select
        v-model="data.branches"
        multiple
        :options="other.branchesOptions"
        label="Branches"
        style="width: 150px; display: inline-block"
        :rules="[(val) => val.length > 0 || '最少选择一个分支']"
        clearable
      />
      <q-input
        v-model="data.author"
        label="Author"
        style="width: 110px; display: inline-block"
        clearable
      />
      <div
        style="
          position: relative;
          display: inline-block;
          margin-left: 10px;
          top: 2px;
        "
      >
        <span style="position: absolute; top: -20px; left: 0; width: 100px"
          >Since->Until
        </span>
        <q-btn
          padding="xs"
          label="选择时间"
          @click="other.dateRange.visible = true"
        /><template v-if="data.dateRange.from"
          ><span>{{ data.dateRange.from + " " + data.dateRange.to }}</span
          ><q-btn
            padding="xs"
            label="删除选择"
            @click="(data.dateRange.from = ''), (data.dateRange.to = '')"
        /></template>
        <q-dialog v-model="other.dateRange.visible" persistent>
          <q-card>
            <q-card-section class="row items-center">
              <q-date v-model="data.dateRange" range mask="YYYY-MM-DD" />
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="取消" color="primary" v-close-popup />
              <q-btn flat label="确认" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <q-toggle
          v-model="data.onlyMessage"
          label="Only Message"
          left-label
          style="display: inline-block; margin-left: 10px"
        />
        <q-toggle
          v-model="data.noMerges"
          label="No Merges"
          left-label
          style="display: inline-block; margin-left: 10px"
        />
        <q-toggle
          v-model="data.dedup"
          label="Dedup"
          left-label
          style="display: inline-block; margin-left: 10px"
        />
      </div>
    </div>
    <div class="row justify-end" style="margin: 10px 0">
      <q-btn
        label="查询"
        type="submit"
        color="purple"
        padding="xs"
        :loading="data.loading"
      />
      <q-btn
        label="重置"
        type="reset"
        color="purple"
        padding="xs"
        flat
        class="q-ml-sm"
        :loading="data.loading"
      />
    </div>
  </q-form>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, watch } from "vue";

import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { useQuasar } from "quasar";

import {
  LogQueryData,
  logQueryInitData,
} from "@/components/project/form/models";
import { names, ProjectType } from "@/store/project";
import {
  names as namesPersonalize,
  StateInterface as StateInterfacePersonalize,
} from "@/store/personalize";
import dayjs from "@/utils/dayjs";

export default defineComponent({
  components: {},
  props: {
    ticked: {
      type: Array,
      required: true,
    },
  },
  /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
  setup(props, context) {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const $q = useQuasar();
    /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */

    const statePersonalize = computed(
      () => store.state[namesPersonalize.module] as StateInterfacePersonalize
    );

    const other = reactive({
      dateRange: {
        visible: false,
      },
      branchesOptions: [] as string[],
    });

    const initData = Object.assign(logQueryInitData) as LogQueryData;

    const data = reactive<LogQueryData>(JSON.parse(JSON.stringify(initData)));

    watch(
      computed(() => props.ticked),
      async () => {
        other.branchesOptions = [];
        initData.branches = [];
        for (let i = 0, end = props.ticked.length; i < end; i++) {
          const repositoryURL = props.ticked[i];
          const project = store.getters[
            names.module + "/" + names.getters.GET_PROJECT
          ]({
            repositoryURL,
          });
          const projectData = project.data as ProjectType;
          projectData.branches.forEach((branch, index) => {
            if (!other.branchesOptions.includes(branch)) {
              other.branchesOptions.push(branch);
              if (index === 0) {
                initData.branches.push(branch);
              }
            }
          });
        }
        data.branches = initData.branches.slice();
        data.author = statePersonalize.value.logQuery.author;
        data.dedup = statePersonalize.value.logQuery.dedup;
        data.noMerges = statePersonalize.value.logQuery.noMerges;
        data.onlyMessage = statePersonalize.value.logQuery.onlyMessage;
        if (statePersonalize.value.logQuery.thisWeek) {
          const dayjsInstance = await dayjs();
          data.dateRange.from = dayjsInstance()
            .subtract(6, "day")
            .format("YYYY-MM-DD");
          data.dateRange.to = dayjsInstance().format("YYYY-MM-DD");
        }
      },
      {
        deep: true,
        immediate: true,
      }
    );

    function onReset() {
      Object.assign(data, initData);
    }

    function onSubmit() {
      data.loading = true;
      context.emit("log-query", data);
    }

    return {
      other,
      data,
      onSubmit,
      onReset,
    };
  },
});
</script>
<style lang="less">
.project-form-log-query-comp {
}
</style>
