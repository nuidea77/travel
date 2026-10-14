import type { Ref } from "vue";

/** Admin auth token, kept in a cookie so SSR requests can see it too. */
export const useAdminToken = (): Ref<string | null> =>
  useCookie<string | null>("admin_token", {
    maxAge: 60 * 60 * 24 * 14,
    sameSite: "lax",
    default: () => null,
  });

export const useAdminUser = () =>
  useState<{ id: number; name: string; email: string } | null>("admin-user", () => null);

/** $fetch against the admin API with the bearer token; 401 → login page. */
export async function adminFetch<T>(
  path: string,
  options: Parameters<typeof $fetch>[1] = {},
): Promise<T> {
  const base = useRuntimeConfig().public.apiBase;
  const token = useAdminToken();
  try {
    return await $fetch<T>(`${base}/admin${path}`, {
      ...options,
      headers: {
        Accept: "application/json",
        ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
        ...(options?.headers ?? {}),
      },
    });
  } catch (error: unknown) {
    const status = (error as { statusCode?: number })?.statusCode;
    if (status === 401) {
      token.value = null;
      await navigateTo("/admin/login");
    }
    throw error;
  }
}

/** Human-readable message out of a failed admin request. */
export function adminError(error: unknown): string {
  const data = (error as { data?: { message?: string; errors?: Record<string, string[]> } })?.data;
  if (data?.errors) {
    const first = Object.values(data.errors)[0];
    if (first?.[0]) return first[0];
  }
  return data?.message ?? "Something went wrong. Please try again.";
}
