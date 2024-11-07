import { getUserInfo } from '@/api/user';
import { useUserInfoStore } from '@/stores/userInfo.js';


export const refreshUserInfo = async () => {
  const res = await getUserInfo();
  const userInfoStore = useUserInfoStore();
  console.log(res);
  // 更新用户信息
  userInfoStore.setInfo({
    ...res.data,
  });
};


