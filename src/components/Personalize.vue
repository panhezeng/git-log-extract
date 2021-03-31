<template>
  <q-form class="personalize-comp" @submit="onSubmit" @reset="onReset">
    <q-list>
      <q-item>
        <q-item-section>项目Git账户</q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-input clearable v-model="data.git.username" label="用户名" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-input
            clearable
            v-model="data.git.password"
            label="密码"
            :type="isPwd ? 'password' : 'text'"
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
      <q-item>
        <q-item-section>Log查询</q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-input clearable v-model="data.logQuery.author" label="Author" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-toggle
            v-model="data.logQuery.onlyMessage"
            label="Only Message"
            left-label
            style="display: inline-block; margin-left: 10px"
          />
        </q-item-section>
        <q-item-section>
          <q-toggle
            v-model="data.logQuery.noMerges"
            label="No Merges"
            left-label
            style="display: inline-block; margin-left: 10px"
          />
        </q-item-section>
        <q-item-section>
          <q-toggle
            v-model="data.logQuery.dedup"
            label="Dedup"
            left-label
            style="display: inline-block; margin-left: 10px"
          />
        </q-item-section>
        <q-item-section>
          <q-toggle
            v-model="data.logQuery.thisWeek"
            label="This Week"
            left-label
            style="display: inline-block; margin-left: 10px"
          />
        </q-item-section>
      </q-item>
    </q-list>
    <div class="row justify-center" style="margin: 30px 10px">
      <q-btn label="提交" type="submit" color="black" />
      <q-btn label="重置" type="reset" color="red" flat class="q-ml-sm" />
    </div>
  </q-form>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

import { names, StateInterface } from '@/store/personalize';

import CryptoJS from 'crypto-js';

import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { useQuasar } from 'quasar';

export default defineComponent({
  /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
  setup(props, context) {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const $q = useQuasar();

    /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */

    const state = computed<StateInterface>(() => store.state[names.module]);

    const data = ref<StateInterface>(JSON.parse(JSON.stringify(state.value)));
    data.value.git.password = CryptoJS.AES.decrypt(
      data.value.git.password,
      'Secret Passphrase'
    ).toString(CryptoJS.enc.Utf8);

    const isPwd = ref(true);

    async function onSubmit() {
      const newData = JSON.parse(JSON.stringify(data.value)) as StateInterface;
      newData.git.password = CryptoJS.AES.encrypt(
        newData.git.password,
        'Secret Passphrase'
      ).toString();
      store.commit(names.module + '/' + names.mutations.SET_DATA, newData);
      $q.notify({
        type: 'positive',
        position: 'top',
        message: '保存成功',
      });
      context.emit('submit', data.value);
    }

    function onReset() {
      data.value = JSON.parse(JSON.stringify(state.value));
    }

    return {
      data,
      isPwd,
      onSubmit,
      onReset,
    };
  },
});
</script>
<style lang="less">
.personalize-comp {
}
</style>
