<template>
  <q-form
    class="personalize-comp"
    @submit="onSubmit"
    @reset="onReset"
  >
    <q-list>
      <q-item>
        <q-item-section>项目Git账户</q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-input
            v-model="data.git.username"
            clearable
            label="用户名"
          />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-input
            v-model="data.git.password"
            clearable
            label="密码"
            :type="isPwd ? 'password' : 'text'"
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
      <q-item>
        <q-item-section>
          <q-input
            v-model="data.git.sshKey"
            clearable
            label="sshKey"
          />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>Log查询</q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-input
            v-model="data.logQuery.author"
            clearable
            label="Author"
          />
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
    <div
      class="row justify-center"
      style="margin: 30px 10px"
    >
      <q-btn
        label="重置"
        type="reset"
        flat
        class="q-ml-sm"
      />
      <q-btn
        label="提交"
        type="submit"
        color="primary"
      />
    </div>
  </q-form>
</template>

<script lang="ts" setup>
import {reactive, ref, toRaw, unref} from 'vue';

import {useQuasar} from 'quasar';
import {useRoute, useRouter} from 'vue-router';

import type {StateType} from '@/renderer/stores/personalize';
import {usePersonalizeStore} from '@/renderer/stores/personalize';
import {AES, Utf8} from 'jscrypto/es6';

const emit = defineEmits(['submit-success']);
/* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */

const router = useRouter();
const route = useRoute();
const $q = useQuasar();

/* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */

const personalizeStore = usePersonalizeStore();

const data = reactive<StateType>(JSON.parse(JSON.stringify(toRaw(unref(personalizeStore.$state)))));

data.git.password = AES.decrypt(data.git.password, 'Secret Passphrase').toString(Utf8);

const isPwd = ref(true);
const submitLoading = ref(false);

async function onSubmit() {
  submitLoading.value = true;
  const newData = JSON.parse(JSON.stringify(toRaw(data))) as StateType;
  newData.git.password = AES.encrypt(newData.git.password, 'Secret Passphrase').toString();
  personalizeStore.setData(newData);
  $q.notify({
    type: 'positive',
    position: 'top',
    message: '保存成功',
  });
  emit('submit-success', data);
  submitLoading.value = false;
}

function onReset() {
  submitLoading.value = true;
  Object.assign(data, JSON.parse(JSON.stringify(toRaw(unref(personalizeStore.$state)))));
  submitLoading.value = false;
}
</script>
<style lang="less">
.personalize-comp {
}
</style>
