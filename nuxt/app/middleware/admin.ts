export default defineNuxtRouteMiddleware((to) => {
  const token = useAdminToken();
  if (!token.value && to.path !== "/admin/login") {
    return navigateTo("/admin/login");
  }
});
